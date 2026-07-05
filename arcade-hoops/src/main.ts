import "./style.css";
import { VW, VH } from "./game/constants";
import { GameState } from "./game/game";
import { Input } from "./game/input";
import { render } from "./game/render";
import { unlockAudio } from "./game/audio";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d", { alpha: false })!;

let scale = 1;
let ox = 0;
let oy = 0;
let dpr = 1;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  scale = Math.min(w / VW, h / VH);
  ox = (w - VW * scale) / 2;
  oy = (h - VH * scale) / 2;
}
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 200));
resize();

const game = new GameState();
const input = new Input(canvas, () => ({ scale, ox, oy }));

// Expose state for automated smoke tests / debugging (harmless in production).
(window as unknown as { __game: GameState }).__game = game;
import { TEAMS } from "./game/teams";
(window as unknown as { __teams: typeof TEAMS }).__teams = TEAMS;

// Unlock the Web Audio context on the first user gesture (iOS/Safari policy).
const unlock = () => {
  unlockAudio();
  window.removeEventListener("pointerdown", unlock);
  window.removeEventListener("keydown", unlock);
};
window.addEventListener("pointerdown", unlock);
window.addEventListener("keydown", unlock);

// Optional Capacitor niceties (no-ops on the web build).
void (async () => {
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.hide();
  } catch {
    /* not running under Capacitor */
  }
  try {
    const { App } = await import("@capacitor/app");
    App.addListener("backButton", () => {
      /* keep the app open; the game handles its own navigation */
    });
  } catch {
    /* ignore */
  }
})();

let last = performance.now();
function frame(now: number) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.05) dt = 0.05; // clamp after tab switches

  game.update(dt, input);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#05070f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr);
  render(ctx, game, input);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
