export interface Vec {
  x: number;
  y: number;
}

export const dist = (a: Vec, b: Vec): number => Math.hypot(a.x - b.x, a.y - b.y);

export const len = (v: Vec): number => Math.hypot(v.x, v.y);

export function norm(v: Vec): Vec {
  const l = len(v) || 1;
  return { x: v.x / l, y: v.y / l };
}

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export function towards(from: Vec, to: Vec, maxStep: number): Vec {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const d = Math.hypot(dx, dy);
  if (d <= maxStep || d === 0) return { x: to.x, y: to.y };
  return { x: from.x + (dx / d) * maxStep, y: from.y + (dy / d) * maxStep };
}
