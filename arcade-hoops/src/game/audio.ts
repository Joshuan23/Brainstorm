// Tiny procedural sound engine — no audio assets to ship. All SFX are
// synthesized with the Web Audio API so the bundle stays small and there are
// no licensing concerns.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// Call from a user gesture (tap) to unlock audio on iOS/Safari.
export function unlockAudio(): void {
  ensure();
}

export function setAudioEnabled(on: boolean): void {
  enabled = on;
  if (master) master.gain.value = on ? 0.5 : 0;
}

export function isAudioEnabled(): boolean {
  return enabled;
}

type Wave = OscillatorType;

function tone(freq: number, dur: number, type: Wave, gain = 0.3, slideTo?: number): void {
  const c = ensure();
  if (!c || !master || !enabled) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), c.currentTime + dur);
  }
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g);
  g.connect(master);
  osc.start();
  osc.stop(c.currentTime + dur);
}

function noise(dur: number, gain = 0.25): void {
  const c = ensure();
  if (!c || !master || !enabled) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(master);
  src.start();
}

export const sfx = {
  bounce: () => tone(180, 0.08, "sine", 0.18, 120),
  pass: () => tone(320, 0.07, "triangle", 0.16, 420),
  shoot: () => tone(520, 0.12, "sine", 0.15, 720),
  swish: () => {
    tone(880, 0.12, "sine", 0.22, 1200);
    setTimeout(() => tone(1320, 0.1, "sine", 0.18), 60);
  },
  rim: () => tone(240, 0.09, "square", 0.14, 180),
  dunk: () => {
    noise(0.18, 0.3);
    tone(120, 0.25, "sawtooth", 0.25, 60);
  },
  steal: () => tone(660, 0.09, "square", 0.16, 990),
  block: () => {
    noise(0.12, 0.28);
    tone(90, 0.18, "square", 0.2, 50);
  },
  whistle: () => {
    tone(2000, 0.14, "square", 0.12, 2100);
  },
  buzzer: () => tone(160, 0.6, "sawtooth", 0.3, 140),
  fire: () => {
    tone(300, 0.3, "sawtooth", 0.2, 900);
    setTimeout(() => tone(500, 0.2, "sawtooth", 0.18, 1200), 120);
  },
  score2: () => tone(700, 0.1, "triangle", 0.16, 900),
  score3: () => {
    tone(700, 0.1, "triangle", 0.16, 900);
    setTimeout(() => tone(1050, 0.14, "triangle", 0.18), 90);
  },
  select: () => tone(600, 0.06, "square", 0.14, 760),
};
