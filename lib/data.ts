import { CoinDef } from "./coins";

export interface DailySeries {
  /** ISO dates, oldest first */
  dates: string[];
  /** daily USD closes aligned with dates */
  closes: number[];
  /** "live" = fetched from the price API, "demo" = generated sample data */
  source: "live" | "demo";
}

const HISTORY_DAYS = 365;
const CACHE_TTL_MS = 15 * 60 * 1000;

const cache = new Map<string, { at: number; series: DailySeries }>();

/**
 * Daily USD price history for a coin. Tries the free CoinGecko market_chart
 * API (no key required); on any failure falls back to clearly-labelled demo
 * data so the app stays fully usable offline. The UI always surfaces the
 * source, and demo data is never presented as market data.
 */
export async function getDailySeries(coin: CoinDef): Promise<DailySeries> {
  const cached = cache.get(coin.id);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.series;

  let series: DailySeries;
  try {
    series = await fetchLive(coin);
  } catch {
    series = demoSeries(coin);
  }
  cache.set(coin.id, { at: Date.now(), series });
  return series;
}

async function fetchLive(coin: CoinDef): Promise<DailySeries> {
  // days=365 (no explicit interval) yields one daily point per day on the
  // free tier — the paid-only `interval=daily` param is deliberately omitted.
  const url = `https://api.coingecko.com/api/v3/coins/${coin.coingeckoId}/market_chart?vs_currency=usd&days=${HISTORY_DAYS}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(9000),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`price API ${res.status}`);
  const json = (await res.json()) as { prices?: [number, number][] };
  if (!json.prices || !Array.isArray(json.prices)) throw new Error("no prices");

  // Collapse to one close per calendar day (last observation wins).
  const byDate = new Map<string, number>();
  for (const [ms, price] of json.prices) {
    if (typeof price !== "number" || !Number.isFinite(price)) continue;
    byDate.set(new Date(ms).toISOString().slice(0, 10), price);
  }
  const dates = [...byDate.keys()].sort();
  const closes = dates.map((d) => byDate.get(d)!);
  if (closes.length < 60) throw new Error("insufficient data");
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
 * trend regimes, anchored at a realistic spot level. Crypto trades every day,
 * so (unlike FX) no weekends are skipped. Explicitly labelled "demo" wherever
 * it is shown — never presented as market data.
 */
export function demoSeries(coin: CoinDef): DailySeries {
  let seed = 0;
  for (const ch of coin.id) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
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
  let price = coin.demoAnchor * (1 + (rand() - 0.5) * 0.06);
  let drift = 0;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400_000);
    // Occasionally rotate the trend regime (crypto trends hard, then chops).
    if (rand() < 0.03) drift = (rand() - 0.5) * 0.006;
    // Mean reversion toward the anchor keeps levels realistic.
    const pull = (coin.demoAnchor - price) / coin.demoAnchor;
    price *= 1 + drift + pull * 0.004 + gauss() * coin.demoVol;
    dates.push(d.toISOString().slice(0, 10));
    closes.push(price);
  }
  return { dates, closes, source: "demo" };
}
