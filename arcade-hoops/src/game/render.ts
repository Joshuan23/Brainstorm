import {
  COLORS,
  COURT,
  COURT_CY,
  COURT_H,
  HOOP_LEFT,
  HOOP_RIGHT,
  RIM_RADIUS,
  THREE_DIST,
  TURBO_MAX,
  VH,
  VW,
} from "./constants";
import type { GameState } from "./game";
import type { Input } from "./input";
import { TEAMS } from "./teams";
import type { Athlete, Side } from "./types";

export function render(ctx: CanvasRenderingContext2D, g: GameState, input: Input) {
  // background
  const bg = ctx.createLinearGradient(0, 0, 0, VH);
  bg.addColorStop(0, COLORS.bgTop);
  bg.addColorStop(1, COLORS.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, VW, VH);

  switch (g.scene) {
    case "menu":
      drawMenu(ctx);
      break;
    case "select":
      drawSelect(ctx, g);
      break;
    default:
      drawCourt(ctx);
      drawEntities(ctx, g);
      drawParticles(ctx, g);
      drawHud(ctx, g);
      drawControls(ctx, g, input);
      drawToasts(ctx, g);
      if (g.scene === "tip" || g.scene === "quarterbreak") drawTip(ctx, g);
      if (g.scene === "paused") drawPause(ctx);
      if (g.scene === "final") drawFinal(ctx, g);
      break;
  }
}

// ---- court -----------------------------------------------------------------

function drawCourt(ctx: CanvasRenderingContext2D) {
  ctx.save();
  // floor
  roundRect(ctx, COURT.left - 18, COURT.top - 18, COURT.right - COURT.left + 36, COURT_H + 36, 22);
  const grad = ctx.createLinearGradient(0, COURT.top, 0, COURT.bottom);
  grad.addColorStop(0, COLORS.wood);
  grad.addColorStop(1, COLORS.woodDark);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = COLORS.line;
  ctx.globalAlpha = 0.9;

  // boundary
  roundRect(ctx, COURT.left, COURT.top, COURT.right - COURT.left, COURT_H, 10);
  ctx.stroke();

  // center line + circle
  ctx.beginPath();
  ctx.moveTo(VW / 2, COURT.top);
  ctx.lineTo(VW / 2, COURT.bottom);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(VW / 2, COURT_CY, 70, 0, Math.PI * 2);
  ctx.stroke();

  drawHalf(ctx, HOOP_LEFT, 1);
  drawHalf(ctx, HOOP_RIGHT, -1);
  ctx.restore();
}

function drawHalf(ctx: CanvasRenderingContext2D, hoop: { x: number; y: number }, sign: number) {
  // paint / key
  const keyW = 150;
  const keyH = 150;
  const kx = sign > 0 ? hoop.x : hoop.x - keyW;
  ctx.fillStyle = sign > 0 ? COLORS.paint : COLORS.paintAway;
  ctx.globalAlpha = 0.28;
  ctx.fillRect(kx, COURT_CY - keyH / 2, keyW, keyH);
  ctx.globalAlpha = 0.9;
  ctx.strokeRect(kx, COURT_CY - keyH / 2, keyW, keyH);

  // three point arc
  ctx.beginPath();
  ctx.arc(hoop.x, hoop.y, THREE_DIST, sign > 0 ? -Math.PI / 2.1 : Math.PI / 2.1, sign > 0 ? Math.PI / 2.1 : -Math.PI / 2.1, sign < 0);
  ctx.stroke();
}

function drawHoopPost(ctx: CanvasRenderingContext2D, hoop: { x: number; y: number }, sign: number) {
  // backboard
  ctx.save();
  const bx = hoop.x - sign * 16;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(bx - 3, hoop.y - 40, 6, 80);
  // rim
  ctx.strokeStyle = "#ff7a1a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(hoop.x, hoop.y, RIM_RADIUS, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  // net
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(hoop.x + i * 9, hoop.y);
    ctx.lineTo(hoop.x + i * 5, hoop.y + 26);
    ctx.stroke();
  }
  ctx.restore();
}

// ---- entities --------------------------------------------------------------

function drawEntities(ctx: CanvasRenderingContext2D, g: GameState) {
  // draw hoops behind players
  drawHoopPost(ctx, HOOP_LEFT, 1);
  drawHoopPost(ctx, HOOP_RIGHT, -1);

  // sort by y for depth
  const list = [...g.home, ...g.away].sort((a, b) => a.y - b.y);
  const controlled = g.home[Math.max(0, Math.min(g.controlledIndex, g.home.length - 1))];
  for (const a of list) drawAthlete(ctx, a, a === controlled, g);

  drawBall(ctx, g);
}

function jersey(a: Athlete, g: GameState) {
  return a.side === "home" ? g.cfg.home : g.cfg.away;
}

function drawAthlete(ctx: CanvasRenderingContext2D, a: Athlete, controlled: boolean, g: GameState) {
  const team = jersey(a, g);
  const lift = a.dunking > 0 ? (0.55 - a.dunking) / 0.55 * 60 : 0;
  const x = a.x;
  const y = a.y - lift;

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.ellipse(a.x, a.y + 16, 18 - lift * 0.1, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // control indicator
  if (controlled) {
    ctx.fillStyle = "#ffe14d";
    ctx.beginPath();
    ctx.moveTo(x, y - 46);
    ctx.lineTo(x - 8, y - 58);
    ctx.lineTo(x + 8, y - 58);
    ctx.closePath();
    ctx.fill();
  }

  // legend aura (gold shimmer) — shown when not already blazing on fire
  if (a.def.legend && !a.onFire) {
    const t = performance.now() * 0.005;
    ctx.save();
    ctx.globalAlpha = 0.45 + Math.sin(t * 2) * 0.15;
    const glow = ctx.createRadialGradient(x, y - 4, 6, x, y - 4, 34);
    glow.addColorStop(0, "rgba(242,193,78,0.0)");
    glow.addColorStop(0.6, "rgba(242,193,78,0.55)");
    glow.addColorStop(1, "rgba(242,193,78,0.0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y - 4, 34, 0, Math.PI * 2);
    ctx.fill();
    // little sparkle stars
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#ffe9a8";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 3; i++) {
      const ang = t + (i * Math.PI * 2) / 3;
      ctx.fillText("✦", x + Math.cos(ang) * 26, y - 4 + Math.sin(ang) * 26);
    }
    ctx.restore();
  }

  // on-fire aura
  if (a.onFire) {
    const t = performance.now() * 0.01;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? "rgba(255,120,20,0.5)" : "rgba(255,210,60,0.5)";
      const fx = x + Math.sin(t + i) * 12;
      ctx.beginPath();
      ctx.ellipse(fx, y - 6 + Math.cos(t * 1.3 + i) * 4, 16 - i * 1.5, 26 - i * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const stunned = a.stunned > 0;
  const bob = Math.sin(a.runPhase) * 2;

  // legs
  ctx.strokeStyle = team.secondary;
  ctx.lineWidth = 6;
  const legSpread = Math.sin(a.runPhase) * 6;
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 8);
  ctx.lineTo(x - 4 - legSpread, y + 20 - lift * 0.2);
  ctx.moveTo(x + 4, y + 8);
  ctx.lineTo(x + 4 + legSpread, y + 20 - lift * 0.2);
  ctx.stroke();

  // torso (jersey)
  ctx.fillStyle = stunned ? "#888" : team.primary;
  roundRect(ctx, x - 13, y - 16 + bob, 26, 28, 8);
  ctx.fill();
  // trim
  ctx.fillStyle = team.accent;
  ctx.fillRect(x - 13, y + 6 + bob, 26, 3);

  // arms up when dunking
  if (a.dunking > 0) {
    ctx.strokeStyle = "#e8c39a";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 10);
    ctx.lineTo(x - 12, y - 34);
    ctx.moveTo(x + 8, y - 10);
    ctx.lineTo(x + 12, y - 34);
    ctx.stroke();
  }

  // head
  ctx.fillStyle = "#e8c39a";
  ctx.beginPath();
  ctx.arc(x, y - 24 + bob, 9, 0, Math.PI * 2);
  ctx.fill();

  // number
  ctx.fillStyle = team.accent;
  ctx.font = "bold 12px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(a.def.num), x, y - 2 + bob);

  if (stunned) {
    ctx.fillStyle = "#ffd34d";
    ctx.font = "12px sans-serif";
    ctx.fillText("✦", x, y - 40);
  }
}

function drawBall(ctx: CanvasRenderingContext2D, g: GameState) {
  const b = g.ball;
  // shadow (skipped when held — the player already casts one)
  if (b.mode === "held") {
    const by = b.y - b.z;
    const r = 10;
    const grad = ctx.createRadialGradient(b.x - 3, by - 3, 2, b.x, by, r);
    grad.addColorStop(0, "#ffb35c");
    grad.addColorStop(1, "#e8791a");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x, by, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(90,40,0,0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();
    return;
  }
  const shadowR = 8 + b.z * 0.02;
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(b.x, b.y + 14, shadowR, shadowR * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const by = b.y - b.z;
  const r = 11;
  const grad = ctx.createRadialGradient(b.x - 3, by - 3, 2, b.x, by, r);
  grad.addColorStop(0, "#ffb35c");
  grad.addColorStop(1, "#e8791a");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(b.x, by, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(90,40,0,0.7)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(b.x, by, r, 0, Math.PI * 2);
  ctx.moveTo(b.x - r, by);
  ctx.lineTo(b.x + r, by);
  ctx.moveTo(b.x, by - r);
  ctx.lineTo(b.x, by + r);
  ctx.stroke();
}

function drawParticles(ctx: CanvasRenderingContext2D, g: GameState) {
  for (const p of g.particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    ctx.fillStyle = p.c;
    ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
  }
  ctx.globalAlpha = 1;
}

// ---- HUD -------------------------------------------------------------------

function drawHud(ctx: CanvasRenderingContext2D, g: GameState) {
  // scoreboard
  const w = 460, h = 62, x = VW / 2 - w / 2, y = 14;
  ctx.fillStyle = "rgba(8,12,26,0.85)";
  roundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();

  drawTeamScore(ctx, g.cfg.home, g.score.home, "home", x + 14, y + 12);
  drawTeamScore(ctx, g.cfg.away, g.score.away, "away", x + w - 14, y + 12);

  // clock + quarter
  ctx.fillStyle = "#fff";
  ctx.font = "bold 26px Trebuchet MS, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const t = Math.max(0, g.gameClock);
  const mm = Math.floor(t / 60);
  const ss = Math.floor(t % 60).toString().padStart(2, "0");
  ctx.fillText(`${mm}:${ss}`, VW / 2, y + 10);
  ctx.font = "bold 13px Trebuchet MS, sans-serif";
  ctx.fillStyle = "#ffd34d";
  ctx.fillText(g.overtime ? "OT" : `Q${g.quarter}`, VW / 2, y + 40);

  // shot clock
  ctx.fillStyle = g.shotClock < 5 ? "#ff5566" : "#fff";
  ctx.font = "bold 16px monospace";
  ctx.fillText(`:${Math.ceil(Math.max(0, g.shotClock)).toString().padStart(2, "0")}`, VW / 2, y + h + 6);

  drawTurbo(ctx, g);
}

function drawTeamScore(
  ctx: CanvasRenderingContext2D,
  team: { abbr: string; primary: string },
  score: number,
  side: Side,
  x: number,
  y: number,
) {
  ctx.textBaseline = "top";
  ctx.textAlign = side === "home" ? "left" : "right";
  ctx.fillStyle = team.primary;
  ctx.font = "bold 16px Trebuchet MS, sans-serif";
  ctx.fillText(team.abbr, x, y);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 30px Trebuchet MS, monospace";
  ctx.fillText(String(score), x, y + 16);
}

function drawTurbo(ctx: CanvasRenderingContext2D, g: GameState) {
  const a = g.home[Math.max(0, Math.min(g.controlledIndex, g.home.length - 1))];
  const x = 30, y = VH - 60, w = 190, h = 16;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  const pct = a.turbo / TURBO_MAX;
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, "#ffd34d");
  grad.addColorStop(1, "#ff7a1a");
  ctx.fillStyle = a.onFire ? "#ff5522" : grad;
  roundRect(ctx, x + 2, y + 2, (w - 4) * pct, h - 4, 6);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Trebuchet MS, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(a.onFire ? `${a.def.name}  🔥 ON FIRE` : `${a.def.name}  TURBO`, x, y - 4);
}

// ---- touch controls --------------------------------------------------------

function drawControls(ctx: CanvasRenderingContext2D, g: GameState, input: Input) {
  if (g.scene !== "play") return;
  ctx.save();

  // joystick
  if (input.stickView.active) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.arc(input.stickView.bx, input.stickView.by, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(input.stickView.kx, input.stickView.ky, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  // buttons
  for (const b of input.buttons) {
    const held = (b.id === "TURBO" && input.turbo) || input.isHeld(b.id);
    ctx.globalAlpha = held ? 0.85 : 0.4;
    let color = "rgba(255,255,255,0.18)";
    if (b.id === "A") color = "rgba(90,200,255,0.5)";
    if (b.id === "B") color = "rgba(140,255,171,0.5)";
    if (b.id === "TURBO") color = "rgba(255,170,40,0.55)";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${b.r > 50 ? 18 : 14}px Trebuchet MS, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(input.labelFor(b.id), b.x, b.y);
  }

  // shot meter
  if (g.meter.active) drawShotMeter(ctx, g);
  ctx.restore();
}

function drawShotMeter(ctx: CanvasRenderingContext2D, g: GameState) {
  const s = g.meter.shooter;
  if (!s) return;
  const x = s.x - 26, y = s.y - 70, w = 52, h = 8;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  roundRect(ctx, x, y, w, h, 4);
  ctx.fill();
  // sweet zone at 0.85
  ctx.fillStyle = "rgba(141,255,171,0.7)";
  ctx.fillRect(x + w * 0.76, y, w * 0.18, h);
  // marker
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + w * g.meter.value - 1.5, y - 2, 3, h + 4);
}

// ---- overlays --------------------------------------------------------------

function drawToasts(ctx: CanvasRenderingContext2D, g: GameState) {
  let i = 0;
  for (const t of g.toasts) {
    const alpha = Math.min(1, t.t * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = t.color;
    ctx.font = `bold ${t.big ? 52 : 30}px Trebuchet MS, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const yy = VH / 2 - 60 + i * (t.big ? 56 : 34);
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 5;
    ctx.strokeText(t.text, VW / 2, yy);
    ctx.fillText(t.text, VW / 2, yy);
    i++;
  }
  ctx.globalAlpha = 1;
}

function drawTip(ctx: CanvasRenderingContext2D, g: GameState) {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 40px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const msg = g.overtime ? "OVERTIME" : g.quarter > 1 ? `QUARTER ${g.quarter}` : "TIP OFF!";
  ctx.fillText(msg, VW / 2, VH / 2);
}

function drawPause(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 54px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PAUSED", VW / 2, VH / 2 - 20);
  ctx.font = "20px Trebuchet MS, sans-serif";
  ctx.fillText("Tap / press P to resume", VW / 2, VH / 2 + 34);
}

function drawFinal(ctx: CanvasRenderingContext2D, g: GameState) {
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, 0, VW, VH);
  const homeWin = g.score.home > g.score.away;
  const winner = homeWin ? g.cfg.home : g.cfg.away;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = winner.primary;
  ctx.font = "bold 64px Trebuchet MS, sans-serif";
  ctx.fillText(`${winner.city} ${winner.name}`, VW / 2, VH / 2 - 80);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 34px Trebuchet MS, sans-serif";
  ctx.fillText("WIN!", VW / 2, VH / 2 - 30);
  ctx.font = "bold 46px Trebuchet MS, monospace";
  ctx.fillText(`${g.cfg.home.abbr} ${g.score.home} — ${g.score.away} ${g.cfg.away.abbr}`, VW / 2, VH / 2 + 30);
  ctx.font = "22px Trebuchet MS, sans-serif";
  ctx.fillStyle = "#ffd34d";
  ctx.fillText("Tap / press ENTER for menu", VW / 2, VH / 2 + 90);
}

// ---- menu / select ---------------------------------------------------------

function drawMenu(ctx: CanvasRenderingContext2D) {
  // court glow backdrop
  ctx.fillStyle = "rgba(255,211,77,0.06)";
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(VW / 2, VH / 2 + 40, 60 + i * 55, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffd34d";
  ctx.font = "bold 88px Trebuchet MS, sans-serif";
  ctx.fillText("COURT KINGS", VW / 2, VH / 2 - 70);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 34px Trebuchet MS, sans-serif";
  ctx.fillText("3-on-3 ARCADE HOOPS", VW / 2, VH / 2 + 5);
  ctx.fillStyle = "#8dffab";
  ctx.font = "22px Trebuchet MS, sans-serif";
  const pulse = 0.6 + Math.sin(performance.now() * 0.004) * 0.4;
  ctx.globalAlpha = pulse;
  ctx.fillText("TAP / PRESS ENTER TO START", VW / 2, VH / 2 + 80);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "15px Trebuchet MS, sans-serif";
  ctx.fillText("Move: drag left / WASD   ·   Shoot: J   ·   Pass: K   ·   Turbo: Shift", VW / 2, VH - 40);
}

function drawSelect(ctx: CanvasRenderingContext2D, g: GameState) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 40px Trebuchet MS, sans-serif";
  ctx.fillText("SELECT TEAMS", VW / 2, 60);

  g.menuButtons = [];
  drawTeamPicker(ctx, g, "YOU", TEAMS[g.selHome], VW * 0.28, "home");
  drawTeamPicker(ctx, g, "OPPONENT", TEAMS[g.selAway], VW * 0.72, "away");

  // difficulty
  const diffLabel = g.difficulty < 0.4 ? "ROOKIE" : g.difficulty < 0.7 ? "PRO" : "ALL-STAR";
  const db = { id: "diff", x: VW / 2 - 130, y: 470, w: 260, h: 50 };
  drawButton(ctx, db, `DIFFICULTY: ${diffLabel}`, "#8b5cf6");
  g.menuButtons.push(db);

  // start
  const sb = { id: "start", x: VW / 2 - 150, y: 540, w: 300, h: 66 };
  drawButton(ctx, sb, "START GAME", "#22c55e");
  g.menuButtons.push(sb);

  const bb = { id: "back", x: 30, y: 30, w: 90, h: 40 };
  drawButton(ctx, bb, "BACK", "#334");
  g.menuButtons.push(bb);
}

function drawTeamPicker(
  ctx: CanvasRenderingContext2D,
  g: GameState,
  label: string,
  team: (typeof TEAMS)[number],
  cx: number,
  which: "home" | "away",
) {
  ctx.fillStyle = "#ffd34d";
  ctx.font = "bold 22px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, cx, 120);

  // jersey swatch
  ctx.fillStyle = team.primary;
  roundRect(ctx, cx - 80, 150, 160, 160, 18);
  ctx.fill();
  ctx.fillStyle = team.secondary;
  roundRect(ctx, cx - 80, 250, 160, 60, 18);
  ctx.fill();
  ctx.fillStyle = team.accent;
  ctx.font = "bold 60px Trebuchet MS, sans-serif";
  ctx.fillText(team.abbr, cx, 210);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 26px Trebuchet MS, sans-serif";
  ctx.fillText(`${team.city} ${team.name}`, cx, 340);

  // roster
  ctx.font = "15px Trebuchet MS, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  team.roster.forEach((p, i) => {
    ctx.fillText(`#${p.num} ${p.name}`, cx, 370 + i * 22);
  });

  // arrows
  const prev = { id: `${which}Prev`, x: cx - 150, y: 200, w: 54, h: 60 };
  const next = { id: `${which}Next`, x: cx + 96, y: 200, w: 54, h: 60 };
  drawButton(ctx, prev, "‹", team.secondary);
  drawButton(ctx, next, "›", team.secondary);
  g.menuButtons.push(prev, next);
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  b: { x: number; y: number; w: number; h: number },
  label: string,
  color: string,
) {
  ctx.fillStyle = color;
  roundRect(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${b.h > 55 ? 26 : 20}px Trebuchet MS, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, b.x + b.w / 2, b.y + b.h / 2 + 1);
}

// ---- util ------------------------------------------------------------------


function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
