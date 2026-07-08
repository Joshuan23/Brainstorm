import { bollinger, closeAtr, ema, macd, rsi } from "./indicators";
import { CoinDef } from "./coins";

export type Direction = "LONG" | "SHORT" | "WAIT";

export interface SignalReason {
  indicator: string;
  detail: string;
  /** signed contribution to the confluence score */
  points: number;
}

export interface Signal {
  coinId: string;
  label: string;
  direction: Direction;
  /** confluence score, -100..100 */
  score: number;
  /** |score| shown as confidence */
  confidence: number;
  entry: number;
  stopLoss: number | null;
  takeProfit: number | null;
  riskRewardRatio: number;
  /** stop distance as a percentage of entry price */
  stopPct: number | null;
  reasons: SignalReason[];
  asOf: string;
  price: number;
  changePct: number;
  dataSource: "live" | "demo";
}

export const SIGNAL_THRESHOLD = 40;
export const STOP_ATR_MULT = 1.5;
export const TARGET_ATR_MULT = 2.25; // fixed 1.5R target

export interface EngineState {
  direction: Direction;
  score: number;
  reasons: SignalReason[];
  atr: number;
}

/**
 * Multi-indicator confluence engine (daily timeframe).
 *
 * Each indicator votes with a signed number of points; the sum (clamped to
 * ±100) is the score. |score| >= 40 with agreeing trend produces a signal.
 * This is a transparent, rules-based system — every signal ships with the
 * exact votes that produced it, and its historical performance is measured
 * by the backtester, never asserted.
 */
export function evaluate(closes: number[], index: number): EngineState {
  const slice = closes.slice(0, index + 1);
  const price = slice[slice.length - 1];

  const ema20 = ema(slice, 20);
  const ema50 = ema(slice, 50);
  const rsi14 = rsi(slice, 14);
  const { histogram } = macd(slice);
  const boll = bollinger(slice, 20, 2);
  const atrArr = closeAtr(slice, 14);

  const i = slice.length - 1;
  const reasons: SignalReason[] = [];
  let score = 0;

  const e20 = ema20[i];
  const e50 = ema50[i];
  const r = rsi14[i];
  const h = histogram[i];
  const hPrev = histogram[i - 1];
  const pb = boll.percentB[i];
  const atr = atrArr[i];

  if ([e20, e50, r, h, hPrev, pb, atr].some((v) => v === undefined || Number.isNaN(v))) {
    return { direction: "WAIT", score: 0, reasons: [], atr: Number.isNaN(atr) ? 0 : atr };
  }

  // 1) Trend: EMA20 vs EMA50 (±25)
  const trendUp = e20 > e50;
  score += trendUp ? 25 : -25;
  reasons.push({
    indicator: "Trend (EMA 20/50)",
    detail: trendUp ? "EMA20 above EMA50 — uptrend" : "EMA20 below EMA50 — downtrend",
    points: trendUp ? 25 : -25,
  });

  // 2) Price vs EMA20 (±10)
  const aboveFast = price > e20;
  score += aboveFast ? 10 : -10;
  reasons.push({
    indicator: "Price vs EMA20",
    detail: aboveFast ? "Close above the fast average" : "Close below the fast average",
    points: aboveFast ? 10 : -10,
  });

  // 3) MACD histogram: sign (±12) plus momentum building (±8)
  const macdPts = (h > 0 ? 12 : -12) + (h > hPrev ? 8 : -8);
  score += macdPts;
  reasons.push({
    indicator: "MACD (12,26,9)",
    detail:
      `Histogram ${h > 0 ? "positive" : "negative"}` +
      (h > hPrev ? ", momentum building" : ", momentum fading"),
    points: macdPts,
  });

  // 4) RSI regime (±15), with exhaustion damping at extremes (∓10)
  let rsiPts = 0;
  let rsiDetail: string;
  if (r >= 55) {
    rsiPts = 15;
    rsiDetail = `RSI ${r.toFixed(1)} — bullish momentum`;
  } else if (r <= 45) {
    rsiPts = -15;
    rsiDetail = `RSI ${r.toFixed(1)} — bearish momentum`;
  } else {
    rsiDetail = `RSI ${r.toFixed(1)} — neutral zone`;
  }
  if (r >= 72) {
    rsiPts -= 10;
    rsiDetail += " (overbought — chase risk)";
  } else if (r <= 28) {
    rsiPts += 10;
    rsiDetail += " (oversold — chase risk)";
  }
  score += rsiPts;
  reasons.push({ indicator: "RSI (14)", detail: rsiDetail, points: rsiPts });

  // 5) Bollinger %B: position inside the bands (±10 toward the breakout side,
  //    damped at the very edge where snap-back risk dominates)
  let bbPts = 0;
  let bbDetail: string;
  if (pb > 1 || pb < 0) {
    bbPts = 0;
    bbDetail = pb > 1 ? "Close outside upper band — extended" : "Close outside lower band — extended";
  } else if (pb >= 0.65) {
    bbPts = 10;
    bbDetail = "Close in the upper band region — buyers in control";
  } else if (pb <= 0.35) {
    bbPts = -10;
    bbDetail = "Close in the lower band region — sellers in control";
  } else {
    bbDetail = "Close mid-band — no edge";
  }
  score += bbPts;
  reasons.push({ indicator: "Bollinger %B (20,2)", detail: bbDetail, points: bbPts });

  score = Math.max(-100, Math.min(100, score));
  const direction: Direction =
    score >= SIGNAL_THRESHOLD ? "LONG" : score <= -SIGNAL_THRESHOLD ? "SHORT" : "WAIT";
  return { direction, score, reasons, atr };
}

export function buildSignal(
  coin: CoinDef,
  dates: string[],
  closes: number[],
  source: "live" | "demo"
): Signal {
  const i = closes.length - 1;
  const state = evaluate(closes, i);
  const price = closes[i];
  const prev = closes[i - 1] ?? price;

  let stopLoss: number | null = null;
  let takeProfit: number | null = null;
  let stopPct: number | null = null;
  if (state.direction !== "WAIT" && state.atr > 0) {
    const sign = state.direction === "LONG" ? 1 : -1;
    stopLoss = price - sign * STOP_ATR_MULT * state.atr;
    takeProfit = price + sign * TARGET_ATR_MULT * state.atr;
    stopPct = price === 0 ? null : ((STOP_ATR_MULT * state.atr) / price) * 100;
  }

  return {
    coinId: coin.id,
    label: coin.label,
    direction: state.direction,
    score: state.score,
    confidence: Math.abs(state.score),
    entry: price,
    stopLoss,
    takeProfit,
    riskRewardRatio: TARGET_ATR_MULT / STOP_ATR_MULT,
    stopPct,
    reasons: state.reasons,
    asOf: dates[i],
    price,
    changePct: prev === 0 ? 0 : ((price - prev) / prev) * 100,
    dataSource: source,
  };
}
