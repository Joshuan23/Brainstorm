/**
 * Technical indicators over a daily close series.
 * All functions return arrays aligned with the input (leading NaN where the
 * indicator is not yet defined), so index i always refers to the same day.
 */

export function sma(values: number[], period: number): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  const k = 2 / (period + 1);
  let prev = NaN;
  let warmSum = 0;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      warmSum += values[i];
      continue;
    }
    if (i === period - 1) {
      prev = (warmSum + values[i]) / period; // seed with SMA
    } else {
      prev = values[i] * k + prev * (1 - k);
    }
    out[i] = prev;
  }
  return out;
}

export function rsi(values: number[], period = 14): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      avgGain += gain / period;
      avgLoss += loss / period;
      if (i === period) {
        out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
  }
  return out;
}

export interface MacdResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

export function macd(values: number[], fast = 12, slow = 26, signalPeriod = 9): MacdResult {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = values.map((_, i) =>
    Number.isNaN(emaFast[i]) || Number.isNaN(emaSlow[i]) ? NaN : emaFast[i] - emaSlow[i]
  );
  // Signal line: EMA of the macd line, starting where macd is defined.
  const firstIdx = macdLine.findIndex((v) => !Number.isNaN(v));
  const defined = macdLine.slice(firstIdx);
  const signalDefined = ema(defined, signalPeriod);
  const signalLine = new Array<number>(values.length).fill(NaN);
  for (let i = 0; i < signalDefined.length; i++) {
    signalLine[firstIdx + i] = signalDefined[i];
  }
  const histogram = macdLine.map((v, i) =>
    Number.isNaN(v) || Number.isNaN(signalLine[i]) ? NaN : v - signalLine[i]
  );
  return { macd: macdLine, signal: signalLine, histogram };
}

export interface BollingerResult {
  middle: number[];
  upper: number[];
  lower: number[];
  /** %B — where the close sits within the bands (0 = lower, 1 = upper) */
  percentB: number[];
}

export function bollinger(values: number[], period = 20, mult = 2): BollingerResult {
  const middle = sma(values, period);
  const upper = new Array<number>(values.length).fill(NaN);
  const lower = new Array<number>(values.length).fill(NaN);
  const percentB = new Array<number>(values.length).fill(NaN);
  for (let i = period - 1; i < values.length; i++) {
    let sumSq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j] - middle[i];
      sumSq += d * d;
    }
    const sd = Math.sqrt(sumSq / period);
    upper[i] = middle[i] + mult * sd;
    lower[i] = middle[i] - mult * sd;
    const width = upper[i] - lower[i];
    percentB[i] = width === 0 ? 0.5 : (values[i] - lower[i]) / width;
  }
  return { middle, upper, lower, percentB };
}

/**
 * Volatility proxy from a close-only series: EMA of absolute day-over-day
 * moves. Daily FX reference rates carry no intraday high/low, so this stands
 * in for ATR when sizing stops — documented as such in the UI.
 */
export function closeAtr(values: number[], period = 14): number[] {
  const ranges = values.map((v, i) => (i === 0 ? NaN : Math.abs(v - values[i - 1])));
  const out = new Array<number>(values.length).fill(NaN);
  const k = 2 / (period + 1);
  let prev = NaN;
  let warmSum = 0;
  let warmCount = 0;
  for (let i = 1; i < values.length; i++) {
    if (warmCount < period) {
      warmSum += ranges[i];
      warmCount++;
      if (warmCount === period) {
        prev = warmSum / period;
        out[i] = prev;
      }
      continue;
    }
    prev = ranges[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}
