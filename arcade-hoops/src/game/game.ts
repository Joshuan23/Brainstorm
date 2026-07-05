import {
  BASE_SPEED,
  BLOCK_RANGE,
  COURT,
  COURT_CY,
  DUNK_RANGE,
  GRAVITY,
  HOOP_LEFT,
  HOOP_RIGHT,
  PERFECT_WINDOW,
  PLAYER_RADIUS,
  QUARTER_SECONDS,
  QUARTERS,
  RIM_HEIGHT,
  SCORE_TO_FIRE,
  SHOT_CLOCK,
  SHOT_METER_SPEED,
  STEAL_RANGE,
  THREE_DIST,
  TURBO_DRAIN,
  TURBO_MAX,
  TURBO_MULT,
  TURBO_REGEN,
} from "./constants";
import { Input } from "./input";
import { sfx } from "./audio";
import { TEAMS, type TeamDef } from "./teams";
import type { Athlete, Ball, MatchConfig, Scene, Side, Toast } from "./types";
import { clamp, dist } from "./vec";

const rand = (a = 1, b = 0) => b + Math.random() * (a - b);

export class GameState {
  scene: Scene = "menu";
  cfg: MatchConfig;
  home: Athlete[] = [];
  away: Athlete[] = [];
  ball!: Ball;

  score = { home: 0, away: 0 };
  quarter = 1;
  gameClock = QUARTER_SECONDS;
  shotClock = SHOT_CLOCK;
  possession: Side = "home";
  controlledIndex = 0;

  toasts: Toast[] = [];
  particles: { x: number; y: number; vx: number; vy: number; life: number; c: string }[] = [];

  // flow timers
  private freeze = 0; // gameplay paused for celebration/reset
  tipTimer = 0;

  // shot meter (user)
  meter: { active: boolean; value: number; dir: number; shooter: Athlete | null; holdTime: number } = {
    active: false, value: 0, dir: 1, shooter: null, holdTime: 0,
  };

  // menu selection
  selHome = 0;
  selAway = 1;
  difficulty = 0.5;
  menuButtons: { id: string; x: number; y: number; w: number; h: number }[] = [];

  overtime = false;

  constructor() {
    this.cfg = { home: TEAMS[0], away: TEAMS[1], difficulty: 0.5 };
  }

  // ---- setup ---------------------------------------------------------------

  private hoopFor(side: Side) {
    return side === "home" ? HOOP_RIGHT : HOOP_LEFT;
  }
  private defendHoop(side: Side) {
    return side === "home" ? HOOP_LEFT : HOOP_RIGHT;
  }

  startMatch() {
    this.cfg = {
      home: TEAMS[this.selHome],
      away: TEAMS[this.selAway],
      difficulty: this.difficulty,
    };
    this.score = { home: 0, away: 0 };
    this.quarter = 1;
    this.gameClock = QUARTER_SECONDS;
    this.overtime = false;
    this.buildTeams();
    this.ball = {
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
      holder: null, mode: "loose",
      sx: 0, sy: 0, sz: 0, tx: 0, ty: 0, peak: 0, flightT: 0, elapsed: 0,
      makeIntended: false, points: 2, passTo: null, lastShooter: null, looseTimer: 0,
    };
    this.tipOff("home");
    this.scene = "tip";
    this.tipTimer = 1.6;
  }

  private buildTeams() {
    const make = (team: TeamDef, side: Side): Athlete[] =>
      team.roster.map((def, i) => ({
        def, side, teamIndex: i,
        x: 0, y: 0, vx: 0, vy: 0,
        facing: side === "home" ? 1 : -1,
        turbo: TURBO_MAX, hasBall: false,
        dunking: 0, stealCd: 0, shoveCd: 0, stunned: 0,
        streak: 0, onFire: false, runPhase: 0,
      }));
    this.home = make(this.cfg.home, "home");
    this.away = make(this.cfg.away, "away");
  }

  private get all() {
    return [...this.home, ...this.away];
  }
  teamOf(side: Side) {
    return side === "home" ? this.home : this.away;
  }

  // Position everyone in a formation; give ball to `offense`.
  private tipOff(offense: Side) {
    this.setFormation(offense);
    const carrier = this.teamOf(offense)[0];
    this.giveBall(carrier);
    this.possession = offense;
    this.shotClock = SHOT_CLOCK;
    this.freeze = 0.0;
  }

  private setFormation(offense: Side) {
    const defense: Side = offense === "home" ? "away" : "home";
    const oHoop = this.hoopFor(offense);
    const sign = oHoop.x > COURT.left + 100 ? 1 : -1; // attacking direction
    const backX = oHoop.x - sign * 620;
    const offSpots = [
      { x: backX + sign * 120, y: COURT_CY },
      { x: oHoop.x - sign * 260, y: COURT.top + 120 },
      { x: oHoop.x - sign * 260, y: COURT.bottom - 120 },
    ];
    const defSpots = [
      { x: oHoop.x - sign * 360, y: COURT_CY },
      { x: oHoop.x - sign * 170, y: COURT.top + 150 },
      { x: oHoop.x - sign * 170, y: COURT.bottom - 150 },
    ];
    this.teamOf(offense).forEach((a, i) => {
      a.x = offSpots[i].x; a.y = offSpots[i].y; a.vx = a.vy = 0;
      a.dunking = 0; a.stunned = 0; a.hasBall = false;
    });
    this.teamOf(defense).forEach((a, i) => {
      a.x = defSpots[i].x; a.y = defSpots[i].y; a.vx = a.vy = 0;
      a.dunking = 0; a.stunned = 0; a.hasBall = false;
    });
  }

  private giveBall(a: Athlete) {
    for (const p of this.all) p.hasBall = false;
    a.hasBall = true;
    this.ball.holder = a;
    this.ball.mode = "held";
    this.ball.passTo = null;
    this.possession = a.side;
    if (a.side === "home") {
      this.controlledIndex = a.teamIndex;
    } else {
      // We're on defense now — hand control to the closest home defender.
      let best = 0, bd = Infinity;
      this.home.forEach((h, i) => { const d = dist(h, a); if (d < bd) { bd = d; best = i; } });
      this.controlledIndex = best;
    }
  }

  // ---- update dispatch -----------------------------------------------------

  update(dt: number, input: Input) {
    this.toasts = this.toasts.filter((t) => (t.t -= dt) > 0);
    this.particles = this.particles.filter((p) => {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 400 * dt; return p.life > 0;
    });

    switch (this.scene) {
      case "menu": this.updateMenu(input); break;
      case "select": this.updateSelect(input); break;
      case "tip":
        this.tipTimer -= dt;
        if (this.tipTimer <= 0) { this.scene = "play"; sfx.whistle(); }
        break;
      case "play": this.updatePlay(dt, input); break;
      case "paused":
        if (input.take("PAUSE") || input.take("A")) this.scene = "play";
        break;
      case "quarterbreak":
        this.tipTimer -= dt;
        if (this.tipTimer <= 0) this.scene = "play";
        break;
      case "final":
        if (input.takeTap() !== null || input.take("A")) { this.scene = "menu"; }
        break;
    }
  }

  // ---- menus ---------------------------------------------------------------

  private updateMenu(input: Input) {
    input.context = "menu";
    const tapped = input.takeTap() !== null;
    if (tapped || input.take("A") || input.take("PAUSE")) {
      sfx.select();
      this.scene = "select";
    }
  }

  private updateSelect(input: Input) {
    input.context = "menu";
    const tap = input.takeTap();
    if (tap) {
      for (const b of this.menuButtons) {
        if (tap.x >= b.x && tap.x <= b.x + b.w && tap.y >= b.y && tap.y <= b.y + b.h) {
          this.handleMenuButton(b.id);
          return;
        }
      }
    }
    // keyboard
    if (input.take("SWITCH")) { this.handleMenuButton("start"); }
    if (input.take("A")) { this.handleMenuButton("start"); }
  }

  private handleMenuButton(id: string) {
    sfx.select();
    switch (id) {
      case "homePrev": this.selHome = (this.selHome + TEAMS.length - 1) % TEAMS.length; break;
      case "homeNext": this.selHome = (this.selHome + 1) % TEAMS.length; break;
      case "awayPrev": this.selAway = (this.selAway + TEAMS.length - 1) % TEAMS.length; break;
      case "awayNext": this.selAway = (this.selAway + 1) % TEAMS.length; break;
      case "diff":
        this.difficulty = this.difficulty >= 0.85 ? 0.25 : this.difficulty + 0.3;
        break;
      case "start":
        if (this.selAway === this.selHome) this.selAway = (this.selAway + 1) % TEAMS.length;
        this.startMatch();
        break;
      case "back": this.scene = "menu"; break;
    }
  }

  // ---- gameplay ------------------------------------------------------------

  private updatePlay(dt: number, input: Input) {
    if (input.take("PAUSE")) { this.scene = "paused"; return; }

    // clocks (unless frozen for a celebration)
    if (this.freeze > 0) {
      this.freeze -= dt;
    } else {
      this.gameClock -= dt;
      this.shotClock -= dt;
      if (this.shotClock <= 0) this.shotClockViolation();
      if (this.gameClock <= 0) { this.endQuarter(); return; }
    }

    input.update();
    input.context = this.possession === "home" ? "offense" : "defense";

    this.updateControlled(dt, input);
    this.updateAI(dt);
    this.integrate(dt);
    this.updateBall(dt);
    this.updateMeter(dt, input);
    this.separate();
  }

  private controlled(): Athlete {
    return this.home[clamp(this.controlledIndex, 0, this.home.length - 1)];
  }

  private updateControlled(dt: number, input: Input) {
    // On offense the user always controls the ball handler.
    if (this.possession === "home" && this.ball.holder && this.ball.holder.side === "home") {
      this.controlledIndex = this.ball.holder.teamIndex;
    }
    const me = this.controlled();
    if (me.stunned > 0 || me.dunking > 0) return;
    // While winding up a jump shot the shooter is frozen; the meter handles release.
    if (this.meter.active && this.meter.shooter === me) { me.vx = 0; me.vy = 0; return; }

    // switch defender
    if (this.possession === "away" && input.take("SWITCH")) {
      this.controlledIndex = (this.controlledIndex + 1) % this.home.length;
      sfx.select();
    }

    // movement
    const ax = input.axis.x, ay = input.axis.y;
    const boosting = input.turboEffective && me.turbo > 1 && (ax || ay);
    const spd = BASE_SPEED * (boosting ? TURBO_MULT : 1) * (me.onFire ? 1.12 : 1);
    me.vx = ax * spd;
    me.vy = ay * spd;
    if (ax || ay) me.facing = ax >= 0 ? 1 : -1;
    if (boosting) me.turbo = Math.max(0, me.turbo - TURBO_DRAIN * dt);
    else me.turbo = Math.min(TURBO_MAX, me.turbo + TURBO_REGEN * dt);

    // actions
    if (this.possession === "home" && me.hasBall) {
      const hoop = this.hoopFor("home");
      const d = dist(me, hoop);
      if (input.take("A")) {
        if (d < DUNK_RANGE) this.startDunk(me);
        else this.beginShot(me);
      }
      if (input.take("B")) this.passToTeammate(me);
    } else if (this.possession === "away") {
      // defense
      if (input.take("B")) this.attemptSteal(me);
      if (input.take("A")) this.attemptBlock(me);
      // shove with turbo
      if (boosting) this.tryShove(me);
    }
  }

  // ---- AI ------------------------------------------------------------------

  private updateAI(dt: number) {
    const D = this.cfg.difficulty;
    for (const a of this.all) {
      const isUser =
        a.side === "home" &&
        a.teamIndex === this.controlledIndex &&
        (this.possession === "away" || a.hasBall);
      if (isUser) continue;
      if (a.stunned > 0 || a.dunking > 0) { a.vx *= 0.8; a.vy *= 0.8; continue; }

      if (a.side === this.possession) this.aiOffense(a, D, dt);
      else this.aiDefense(a, D, dt);

      // turbo regen for AI
      a.turbo = Math.min(TURBO_MAX, a.turbo + TURBO_REGEN * dt);
    }
  }

  private moveToward(a: Athlete, tx: number, ty: number, mult = 1) {
    const dx = tx - a.x, dy = ty - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const spd = BASE_SPEED * mult * (a.onFire ? 1.1 : 1);
    a.vx = (dx / d) * spd;
    a.vy = (dy / d) * spd;
    if (Math.abs(dx) > 4) a.facing = dx >= 0 ? 1 : -1;
  }

  private aiOffense(a: Athlete, D: number, _dt: number) {
    const hoop = this.hoopFor(a.side);
    if (a.hasBall) {
      const d = dist(a, hoop);
      const defender = this.nearestOpponent(a);
      const guarded = defender ? dist(a, defender) : 999;
      // dunk if close
      if (d < DUNK_RANGE + 10) { this.startDunk(a); return; }
      // shoot if open and in a good spot
      const shootUrge = (0.5 + D * 0.5) * (guarded > 90 ? 1 : 0.25);
      const inRange = d < THREE_DIST + 120;
      if (inRange && Math.random() < shootUrge * 0.06) { this.beginAiShot(a); return; }
      // pass if heavily guarded
      if (guarded < 70 && Math.random() < 0.03) {
        const mate = this.openTeammate(a);
        if (mate) { this.passTo(a, mate); return; }
      }
      // else drive to the rim, veering around defender
      let tx = hoop.x, ty = hoop.y;
      if (guarded < 120 && defender) {
        ty += a.y < defender.y ? -80 : 80;
      }
      const boost = a.turbo > 20 && d > 200;
      if (boost) a.turbo = Math.max(0, a.turbo - TURBO_DRAIN * _dt);
      this.moveToward(a, tx, ty, boost ? TURBO_MULT : 1);
    } else {
      // off-ball spacing: get open toward a wing/corner near the hoop
      const spot = this.spacingSpot(a);
      this.moveToward(a, spot.x, spot.y, 0.85);
    }
  }

  private aiDefense(a: Athlete, D: number, dt: number) {
    const ballHandler = this.ball.holder;
    const target = ballHandler ?? this.nearestOpponent(a);
    if (!target) return;
    const hoop = this.defendHoop(a.side);
    // the closest defender guards the ball; others guard their man / sag
    const myGuard = this.assignedMan(a);
    if (myGuard === ballHandler && ballHandler) {
      // ball pressure: position between handler and hoop
      const bx = ballHandler.x + (hoop.x - ballHandler.x) * 0.18;
      const by = ballHandler.y + (hoop.y - ballHandler.y) * 0.18;
      this.moveToward(a, bx, by, 1);
      a.stealCd -= dt;
      if (dist(a, ballHandler) < STEAL_RANGE && a.stealCd <= 0 && Math.random() < 0.02 + D * 0.03) {
        this.attemptSteal(a);
        a.stealCd = 0.9;
      }
    } else {
      const man = myGuard ?? target;
      const bx = man.x + (hoop.x - man.x) * 0.22;
      const by = man.y + (hoop.y - man.y) * 0.22;
      this.moveToward(a, bx, by, 0.9);
    }
  }

  private assignedMan(a: Athlete): Athlete | null {
    const opp = this.teamOf(a.side === "home" ? "away" : "home");
    return opp[a.teamIndex] ?? null;
  }

  private spacingSpot(a: Athlete) {
    const hoop = this.hoopFor(a.side);
    const sign = hoop.x > COURT.left + 100 ? 1 : -1;
    const lanes = [COURT.top + 110, COURT_CY, COURT.bottom - 110];
    const y = lanes[a.teamIndex % 3];
    const x = hoop.x - sign * (a.teamIndex === 0 ? 210 : 300);
    return { x, y };
  }

  private nearestOpponent(a: Athlete): Athlete | null {
    const opp = this.teamOf(a.side === "home" ? "away" : "home");
    let best: Athlete | null = null, bd = Infinity;
    for (const o of opp) { const d = dist(a, o); if (d < bd) { bd = d; best = o; } }
    return best;
  }

  private openTeammate(a: Athlete): Athlete | null {
    const mates = this.teamOf(a.side).filter((m) => m !== a);
    let best: Athlete | null = null, bestOpen = -1;
    for (const m of mates) {
      const def = this.nearestOpponent(m);
      const open = def ? dist(m, def) : 999;
      if (open > bestOpen) { bestOpen = open; best = m; }
    }
    return best;
  }

  // ---- integrate & collide -------------------------------------------------

  private integrate(dt: number) {
    for (const a of this.all) {
      if (a.stunned > 0) { a.stunned -= dt; a.vx *= 0.85; a.vy *= 0.85; }
      if (a.dunking > 0) { this.advanceDunk(a, dt); }
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.x = clamp(a.x, COURT.left + PLAYER_RADIUS, COURT.right - PLAYER_RADIUS);
      a.y = clamp(a.y, COURT.top + PLAYER_RADIUS, COURT.bottom - PLAYER_RADIUS);
      const moving = Math.hypot(a.vx, a.vy);
      a.runPhase += moving * dt * 0.05;
    }
  }

  private separate() {
    const list = this.all;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        if (a.dunking > 0 || b.dunking > 0) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        const min = PLAYER_RADIUS * 2 - 4;
        if (d > 0 && d < min) {
          const push = (min - d) / 2;
          const nx = dx / d, ny = dy / d;
          a.x -= nx * push; a.y -= ny * push;
          b.x += nx * push; b.y += ny * push;
        }
      }
    }
  }

  // ---- ball ----------------------------------------------------------------

  private updateBall(dt: number) {
    const ball = this.ball;
    if (ball.mode === "held" && ball.holder) {
      const h = ball.holder;
      ball.x = h.x + h.facing * 16;
      ball.y = h.y + 6;
      ball.z = 46 + Math.sin(h.runPhase * 3 + performance.now() * 0.008) * 8;
      return;
    }
    if (ball.mode === "shot" || ball.mode === "pass") {
      ball.elapsed += dt;
      const p = clamp(ball.elapsed / ball.flightT, 0, 1);
      ball.x = ball.sx + (ball.tx - ball.sx) * p;
      ball.y = ball.sy + (ball.ty - ball.sy) * p;
      const base = ball.sz;
      const endZ = ball.mode === "shot" ? RIM_HEIGHT : 46;
      ball.z = base * (1 - p) + endZ * p + 4 * ball.peak * p * (1 - p);
      if (p >= 1) {
        if (ball.mode === "shot") this.resolveShot();
        else this.resolvePass();
      }
      return;
    }
    if (ball.mode === "loose") {
      ball.looseTimer = Math.max(0, ball.looseTimer - dt);
      ball.vz -= GRAVITY * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.z += ball.vz * dt;
      if (ball.z <= 0) {
        ball.z = 0;
        ball.vz = -ball.vz * 0.55;
        ball.vx *= 0.7; ball.vy *= 0.7;
        if (Math.abs(ball.vz) < 40) ball.vz = 0;
        sfx.bounce();
      }
      // walls
      if (ball.x < COURT.left + 8 || ball.x > COURT.right - 8) { ball.vx *= -0.7; ball.x = clamp(ball.x, COURT.left + 8, COURT.right - 8); }
      if (ball.y < COURT.top + 8 || ball.y > COURT.bottom - 8) { ball.vy *= -0.7; ball.y = clamp(ball.y, COURT.top + 8, COURT.bottom - 8); }
      ball.vx *= 0.99; ball.vy *= 0.99;
      // pickup
      if (ball.z < 60) {
        for (const a of this.all) {
          if (a.stunned > 0 || a.dunking > 0) continue;
          if (ball.looseTimer > 0 && a === ball.lastShooter) continue;
          if (dist(a, ball) < PLAYER_RADIUS + 14) { this.giveBall(a); this.shotClock = Math.max(this.shotClock, 8); sfx.pass(); return; }
        }
      }
    }
  }

  // ---- shooting ------------------------------------------------------------

  private beginShot(shooter: Athlete) {
    this.meter = { active: true, value: 0, dir: 1, shooter, holdTime: 0 };
    shooter.vx = 0; shooter.vy = 0;
    sfx.shoot();
  }

  private updateMeter(dt: number, input: Input) {
    if (!this.meter.active) return;
    this.meter.value += this.meter.dir * SHOT_METER_SPEED * dt;
    if (this.meter.value >= 1) { this.meter.value = 1; this.meter.dir = -1; }
    if (this.meter.value <= 0 && this.meter.dir < 0) { this.releaseShot(0); return; }
    // release when the user lets go of A (or force after a full sweep)
    if (!input.isHeld("A") && !input.take("A")) {
      // give a tiny grace so a quick tap still charges a bit
      this.meter.holdTime += dt;
      if (this.meter.holdTime > 0.12) this.releaseShot(this.meter.value);
    } else {
      this.meter.holdTime = 0;
    }
  }

  private releaseShot(value: number) {
    const shooter = this.meter.shooter;
    this.meter.active = false;
    this.meter.holdTime = 0;
    this.meter.shooter = null;
    if (!shooter || !shooter.hasBall) return;
    // sweet spot at 0.85; perfect release boosts accuracy
    const perfect = Math.abs(value - 0.85) <= PERFECT_WINDOW;
    const good = Math.abs(value - 0.85) <= PERFECT_WINDOW * 2.2;
    const bonus = perfect ? 0.28 : good ? 0.1 : -0.15;
    this.launchShot(shooter, bonus, perfect);
  }

  private beginAiShot(shooter: Athlete) {
    this.launchShot(shooter, rand(0.12, -0.12), false);
    sfx.shoot();
  }

  private launchShot(shooter: Athlete, meterBonus: number, perfect: boolean) {
    const hoop = this.hoopFor(shooter.side);
    const d = dist(shooter, hoop);
    const three = d > THREE_DIST;
    const defender = this.nearestOpponent(shooter);
    const contest = defender ? clamp(1 - dist(shooter, defender) / 140, 0, 1) : 0;

    let chance =
      0.34 +
      shooter.def.shooting * 0.42 +
      clamp(1 - d / 720, 0, 1) * 0.28 +
      meterBonus -
      contest * 0.3;
    if (shooter.onFire) chance = 0.94;
    chance = clamp(chance, 0.05, 0.97);
    const makeIntended = Math.random() < chance;

    const ball = this.ball;
    ball.mode = "shot";
    ball.holder = null;
    shooter.hasBall = false;
    ball.sx = shooter.x + shooter.facing * 16;
    ball.sy = shooter.y;
    ball.sz = 62;
    ball.tx = hoop.x;
    ball.ty = hoop.y;
    ball.peak = 150 + d * 0.22;
    ball.flightT = clamp(0.55 + d / 900, 0.55, 1.35);
    ball.elapsed = 0;
    ball.makeIntended = makeIntended;
    ball.points = three ? 3 : 2;
    ball.lastShooter = shooter;
    ball.passTo = null;
    if (perfect) this.toast("PERFECT!", "#ffd34d", false);
  }

  private resolveShot() {
    const ball = this.ball;
    const shooter = ball.lastShooter!;
    if (ball.makeIntended) {
      const pts = ball.points;
      if (shooter.side === "home") this.score.home += pts;
      else this.score.away += pts;
      // fire streak
      shooter.streak++;
      for (const m of this.teamOf(shooter.side)) if (m !== shooter) m.streak = Math.max(0, m.streak);
      // opponents cool
      for (const o of this.teamOf(shooter.side === "home" ? "away" : "home")) { o.streak = 0; o.onFire = false; }
      if (shooter.streak >= SCORE_TO_FIRE && !shooter.onFire) {
        shooter.onFire = true;
        this.toast(`${shooter.def.name.toUpperCase()} IS ON FIRE!`, "#ff7a1a", true);
        sfx.fire();
      }
      this.toast(pts === 3 ? "3 POINTER!" : "BUCKET!", pts === 3 ? "#4dd2ff" : "#8dffab", false);
      if (pts === 3) sfx.score3(); else sfx.score2();
      this.spawnConfetti(this.hoopFor(shooter.side));
      this.freeze = 1.0;
      this.afterScore(shooter.side);
    } else {
      // miss → rim clang, loose ball for rebound
      sfx.rim();
      shooter.streak = 0; shooter.onFire = false;
      const hoop = this.hoopFor(shooter.side);
      ball.mode = "loose";
      ball.x = hoop.x - shooter.facing * 24;
      ball.y = hoop.y + rand(30, -30);
      ball.z = RIM_HEIGHT;
      ball.vx = -shooter.facing * rand(180, 60) + rand(60, -60);
      ball.vy = rand(140, -140);
      ball.vz = rand(120, 40);
      ball.lastShooter = shooter;
      ball.looseTimer = 0.15;
      this.shotClock = Math.max(this.shotClock, 6);
    }
  }

  private afterScore(scoringSide: Side) {
    // opponent inbounds
    const other: Side = scoringSide === "home" ? "away" : "home";
    this.setFormation(other);
    const carrier = this.teamOf(other)[0];
    this.giveBall(carrier);
    this.shotClock = SHOT_CLOCK;
  }

  // ---- dunk ----------------------------------------------------------------

  private startDunk(a: Athlete) {
    if (!a.hasBall) return;
    a.dunking = 0.55;
    a.facing = this.hoopFor(a.side).x >= a.x ? 1 : -1;
    sfx.shoot();
  }

  private advanceDunk(a: Athlete, dt: number) {
    a.dunking -= dt;
    const hoop = this.hoopFor(a.side);
    const dx = hoop.x - a.x, dy = hoop.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const step = 900 * dt;
    if (d > step) { a.x += (dx / d) * step; a.y += (dy / d) * step; a.vx = a.vy = 0; }
    else { a.x = hoop.x - a.facing * 20; a.y = hoop.y; }
    // keep ball glued high
    this.ball.x = a.x + a.facing * 10;
    this.ball.y = a.y;
    this.ball.z = 40 + (0.55 - a.dunking) / 0.55 * 60;
    if (a.dunking <= 0) this.finishDunk(a);
  }

  private finishDunk(a: Athlete) {
    // block check: a defender within range with turbo blocks the dunk
    const blocker = this.teamOf(a.side === "home" ? "away" : "home").find(
      (d) => dist(d, a) < BLOCK_RANGE && d.turbo > 40,
    );
    if (blocker && Math.random() < 0.22 * this.cfg.difficulty + (a.side === "home" ? 0.0 : 0.05)) {
      sfx.block();
      this.toast("REJECTED!", "#ff5566", true);
      a.hasBall = false;
      this.becomeLooseFrom(a);
      return;
    }
    if (a.side === "home") this.score.home += 2; else this.score.away += 2;
    a.streak++;
    if (a.streak >= SCORE_TO_FIRE && !a.onFire) {
      a.onFire = true;
      this.toast(`${a.def.name.toUpperCase()} IS ON FIRE!`, "#ff7a1a", true);
      sfx.fire();
    } else {
      this.toast(a.def.dunk > 0.85 ? "MONSTER JAM!" : "SLAM!", "#ffd34d", true);
    }
    for (const o of this.teamOf(a.side === "home" ? "away" : "home")) { o.streak = 0; o.onFire = false; }
    sfx.dunk();
    this.spawnConfetti(this.hoopFor(a.side));
    this.freeze = 1.0;
    a.hasBall = false;
    this.afterScore(a.side);
  }

  // ---- steals / blocks / shoves -------------------------------------------

  private attemptSteal(defender: Athlete) {
    if (defender.stealCd > 0) return;
    defender.stealCd = 0.6;
    const ball = this.ball;
    const handler = ball.holder;
    if (!handler || handler.side === defender.side) return;
    if (dist(defender, handler) > STEAL_RANGE) return;
    const chance = 0.3 + defender.def.steal * 0.4 - handler.def.speed * 0.15;
    if (Math.random() < clamp(chance, 0.08, 0.75)) {
      sfx.steal();
      this.toast("STEAL!", "#8dffab", false);
      this.giveBall(defender);
      this.shotClock = SHOT_CLOCK;
    }
  }

  private attemptBlock(defender: Athlete) {
    const ball = this.ball;
    if (ball.mode !== "shot") return;
    if (ball.lastShooter && ball.lastShooter.side === defender.side) return;
    if (dist(defender, ball) < BLOCK_RANGE && ball.z < RIM_HEIGHT + 30) {
      const chance = 0.35 + defender.def.dunk * 0.3;
      if (Math.random() < clamp(chance, 0.1, 0.7)) {
        sfx.block();
        this.toast("BLOCKED!", "#ff5566", true);
        ball.makeIntended = false;
        ball.mode = "loose";
        ball.vx = rand(220, -220); ball.vy = rand(220, -220); ball.vz = 60;
        ball.looseTimer = 0.2;
      }
    }
  }

  private tryShove(pusher: Athlete) {
    if (pusher.shoveCd > 0) return;
    for (const o of this.teamOf(pusher.side === "home" ? "away" : "home")) {
      if (dist(pusher, o) < PLAYER_RADIUS * 2 + 6) {
        pusher.shoveCd = 0.8;
        o.stunned = 0.7;
        const dx = o.x - pusher.x, dy = o.y - pusher.y;
        const d = Math.hypot(dx, dy) || 1;
        o.vx = (dx / d) * 260; o.vy = (dy / d) * 260;
        sfx.block();
        if (o.hasBall) { o.hasBall = false; this.becomeLooseFrom(o); this.toast("KNOCKED LOOSE!", "#ffd34d", false); }
        break;
      }
    }
  }

  // ---- passing -------------------------------------------------------------

  private passToTeammate(a: Athlete) {
    const mate = this.bestPassTarget(a);
    if (mate) this.passTo(a, mate);
  }

  private bestPassTarget(a: Athlete): Athlete | null {
    const mates = this.teamOf(a.side).filter((m) => m !== a);
    // prefer the one most in the facing direction
    let best: Athlete | null = null, bestScore = -Infinity;
    for (const m of mates) {
      const dir = (m.x - a.x) * a.facing;
      const open = this.nearestOpponent(m);
      const openness = open ? dist(m, open) : 999;
      const s = dir * 0.5 + openness;
      if (s > bestScore) { bestScore = s; best = m; }
    }
    return best;
  }

  private passTo(from: Athlete, to: Athlete) {
    const ball = this.ball;
    from.hasBall = false;
    ball.mode = "pass";
    ball.holder = null;
    ball.sx = from.x + from.facing * 16; ball.sy = from.y; ball.sz = 46;
    ball.tx = to.x; ball.ty = to.y;
    ball.peak = 30;
    ball.flightT = clamp(dist(from, to) / 900, 0.15, 0.5);
    ball.elapsed = 0;
    ball.passTo = to;
    ball.lastShooter = null;
    if (from.side === "home") this.controlledIndex = to.teamIndex;
    sfx.pass();
  }

  private resolvePass() {
    const ball = this.ball;
    const to = ball.passTo;
    // interception check
    let interceptor: Athlete | null = null;
    for (const o of this.teamOf((to?.side === "home" ? "away" : "home"))) {
      if (dist(o, ball) < PLAYER_RADIUS + 16) { interceptor = o; break; }
    }
    if (interceptor) {
      sfx.steal();
      this.toast("INTERCEPTED!", "#ff5566", false);
      this.giveBall(interceptor);
      this.shotClock = SHOT_CLOCK;
    } else if (to) {
      this.giveBall(to);
    } else {
      ball.mode = "loose"; ball.vz = 0;
    }
  }

  private becomeLooseFrom(a: Athlete) {
    const ball = this.ball;
    ball.mode = "loose";
    ball.holder = null;
    ball.x = a.x; ball.y = a.y; ball.z = 40;
    ball.vx = rand(180, -180); ball.vy = rand(180, -180); ball.vz = 120;
    ball.lastShooter = a;
    ball.looseTimer = 0.2;
  }

  // ---- clock / quarters ----------------------------------------------------

  private shotClockViolation() {
    sfx.buzzer();
    this.toast("SHOT CLOCK!", "#ff5566", false);
    const other: Side = this.possession === "home" ? "away" : "home";
    this.tipOff(other);
    this.freeze = 0.6;
  }

  private endQuarter() {
    sfx.buzzer();
    if (this.quarter >= QUARTERS) {
      if (this.score.home === this.score.away) {
        // overtime
        this.overtime = true;
        this.quarter++;
        this.gameClock = QUARTER_SECONDS * 0.5;
        this.toast("OVERTIME!", "#ffd34d", true);
        this.tipOff(Math.random() < 0.5 ? "home" : "away");
        this.scene = "quarterbreak";
        this.tipTimer = 1.6;
      } else {
        this.scene = "final";
        sfx.buzzer();
      }
      return;
    }
    this.quarter++;
    this.gameClock = QUARTER_SECONDS;
    this.toast(`QUARTER ${this.quarter}`, "#ffffff", true);
    this.tipOff(this.quarter % 2 === 0 ? "away" : "home");
    this.scene = "quarterbreak";
    this.tipTimer = 1.6;
  }

  // ---- fx ------------------------------------------------------------------

  private toast(text: string, color: string, big: boolean) {
    this.toasts.push({ text, color, big, t: big ? 1.8 : 1.2 });
  }

  private spawnConfetti(at: { x: number; y: number }) {
    const colors = ["#ffd34d", "#ff7a1a", "#4dd2ff", "#8dffab", "#ff5566"];
    for (let i = 0; i < 26; i++) {
      this.particles.push({
        x: at.x, y: at.y - RIM_HEIGHT,
        vx: rand(260, -260), vy: rand(-40, -320),
        life: rand(1.2, 0.6), c: colors[(Math.random() * colors.length) | 0],
      });
    }
  }
}

