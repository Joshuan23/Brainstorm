// Virtual resolution — the game is authored at this size and letterboxed to fit
// any screen. 16:9 landscape.
export const VW = 1280;
export const VH = 720;

// Court geometry (in virtual pixels). Top-down-ish view; the hoops sit at the
// left and right ends, players move on the (x, y) floor plane, and the ball
// additionally has a z height used for arcs and dunks.
export const COURT = {
  left: 96,
  right: VW - 96,
  top: 108,
  bottom: VH - 60,
};
export const COURT_W = COURT.right - COURT.left;
export const COURT_H = COURT.bottom - COURT.top;
export const COURT_CY = (COURT.top + COURT.bottom) / 2;

// Hoop positions (rim center on the floor plane) and rim height.
export const RIM_HEIGHT = 92; // z pixels
export const HOOP_LEFT = { x: COURT.left + 34, y: COURT_CY };
export const HOOP_RIGHT = { x: COURT.right - 34, y: COURT_CY };
export const RIM_RADIUS = 26;

// Three-point arc radius (distance from hoop beyond which a make counts 3).
export const THREE_DIST = 340;

// Player tuning.
export const PLAYER_RADIUS = 20;
export const BASE_SPEED = 235; // px/s
export const TURBO_MULT = 1.6;
export const TURBO_MAX = 100;
export const TURBO_DRAIN = 42; // per second while boosting
export const TURBO_REGEN = 22; // per second while not boosting

// Ball / physics.
export const GRAVITY = 1650; // px/s^2 applied to ball z
export const BALL_RADIUS = 12;
export const STEAL_RANGE = 46;
export const BLOCK_RANGE = 70;
export const DUNK_RANGE = 120;

// Shooting.
export const SHOT_METER_SPEED = 1.7; // full sweeps per second
export const PERFECT_WINDOW = 0.09; // +/- around the sweet spot (0..1)

// Match rules.
export const QUARTERS = 4;
export const QUARTER_SECONDS = 60; // arcade-short quarters
export const SHOT_CLOCK = 20;
export const SCORE_TO_FIRE = 3; // makes in a row to catch fire

// Team colors (original, App-Store-safe branding).
export const COLORS = {
  bgTop: "#0b1020",
  bgBottom: "#161d33",
  wood: "#c88a4a",
  woodDark: "#b0763b",
  line: "#f4ede2",
  paint: "#2a4d8f",
  paintAway: "#8f2a2a",
};
