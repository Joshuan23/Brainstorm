import type { PlayerDef, TeamDef } from "./teams";

export type Side = "home" | "away";

export interface Athlete {
  def: PlayerDef;
  side: Side;
  teamIndex: number; // 0..2 within the team
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: number; // -1 left, +1 right (aim direction for dunks/shots)
  turbo: number; // 0..TURBO_MAX
  hasBall: boolean;
  // transient action state
  dunking: number; // seconds remaining in dunk animation
  stealCd: number; // cooldown timer
  shoveCd: number;
  stunned: number; // knocked down timer
  // fire tracking
  streak: number;
  onFire: boolean;
  // animation
  runPhase: number;
}

export type BallMode = "held" | "shot" | "pass" | "loose";

export interface Ball {
  x: number;
  y: number;
  z: number; // height above floor
  vx: number;
  vy: number;
  vz: number;
  holder: Athlete | null;
  mode: BallMode;
  // flight params (shot | pass)
  sx: number;
  sy: number;
  sz: number;
  tx: number;
  ty: number;
  peak: number;
  flightT: number;
  elapsed: number;
  makeIntended: boolean; // scripted to go in (shots)
  points: number; // 2 or 3 for a made basket
  passTo: Athlete | null;
  passFrom: Athlete | null;
  lastShooter: Athlete | null;
  looseTimer: number; // grace before it can be re-grabbed by shooter
}

export type Scene =
  | "menu"
  | "select"
  | "tip"
  | "play"
  | "paused"
  | "quarterbreak"
  | "bracket"
  | "final";

export interface MatchConfig {
  home: TeamDef;
  away: TeamDef;
  difficulty: number; // 0..1
}

export interface Toast {
  text: string;
  t: number;
  color: string;
  big: boolean;
}
