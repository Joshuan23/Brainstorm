import { PairDef } from "./pairs";

export interface DailySeries {
  /** ISO dates, oldest first */
  dates: string[];
  /** daily closes aligned with dates */
  closes: number[];
  /** "live" = fetched from the rates API, "demo" = generated sample data */
  source: "live" | "demo";
}

const HISTORY_DAYS = 400;
const CACHE_TTL_MS = 15 * 60 * 1000;

const cache = new Map<string, { at: number; series: DailySeries }>();

/**
 * Daily reference-rate history. Tries the free Frankfurter API (ECB reference
 * rates, no key required); on any failure falls back to clearly-labelled demo
 * data so the app remains fully usable offline. The UI surfaces the source.
 */
export async function getDailySeries(pair: PairDef): Promise<DailySeries> {
  const cached = cache.get(pair.id);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.series;

  let series: DailySeries;
  try {
    series = await fetchLive(pair);
  } catch {
    series = demoSeries(pair);
  }
  cache.set(pair.id, { at: Date.now(), series });
  return series;
}

async function fetchLive(pair: PairDef): Promise<DailySeries> {
  const end = new Date();
  const start = new Date(end.getTime() - HISTORY_DAYS * 86400_000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const url = `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?base=${pair.base}&symbols=${pair.quote}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`rates API ${res.status}`);
  const json = (await res.json()) as { rates: Record<string, Record<string, number>> };
  const dates = Object.keys(json.rates).sort();
  const closes = dates.map((d) => json.rates[d][pair.quote]);
  if (closes.length < 60 || closes.some((c) => typeof c !== "number")) {
    throw new Error("insufficient data");
  }
  return { dates, closes, source: "live" };
}

/** Deterministic PRNG so demo data is stable across requests/builds. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample data for offline/demo use: a mean-reverting random walk with mild
 * trend regimes, anchored at a realistic spot level. Explicitly labelled
 * "demo" everywhere it is shown — never presented as market data.
 */
export function demoSeries(pair: PairDef): DailySeries {
  let seed = 0;
  for (const ch of pair.id) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
  const rand = mulberry32(seed);
  const gauss = () => {
    // Box–Muller
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const n = HISTORY_DAYS;
  const dates: string[] = [];
  const closes: number[] = [];
  const today = new Date();
  let price = pair.demoAnchor * (1 + (rand() - 0.5) * 0.04);
  let drift = 0;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400_000);
    const dow = d.getUTCDay();
    if (dow === 0 || dow === 6) continue; // FX daily data: weekdays only
    // Occasionally rotate the trend regime.
    if (rand() < 0.02) drift = (rand() - 0.5) * 0.0012;
    // Mean reversion toward the anchor keeps levels realistic.
    const pull = (pair.demoAnchor - price) / pair.demoAnchor;
    price *= 1 + drift + pull * 0.004 + gauss() * pair.demoVol;
    dates.push(d.toISOString().slice(0, 10));
    closes.push(price);
  }
  return { dates, closes, source: "demo" };
}
