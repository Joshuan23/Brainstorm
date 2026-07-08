import { evaluate, STOP_ATR_MULT, TARGET_ATR_MULT } from "./signals";

export interface BacktestStats {
  trades: number;
  wins: number;
  losses: number;
  open: number;
  winRate: number | null;
  profitFactor: number | null;
  netR: number;
  periodDays: number;
}

/**
 * Walk-forward simulation of the exact rule set the live engine uses.
 *
 * At each day t (using only data up to t), if the engine fires and no trade
 * is open, enter at that day's close with a volatility stop (1.5×ATR) and a
 * 1.5R target (2.25×ATR). Subsequent closes resolve the trade: stop touched
 * first = -1R, target touched first = +1.5R; if both bracket in one day the
 * conservative assumption (loss) is taken. These are *measured* numbers on
 * daily closing prices — shown to users as exactly that, with the method.
 */
export function backtest(closes: number[], warmup = 60): BacktestStats {
  let wins = 0;
  let losses = 0;
  let open = 0;
  let netR = 0;

  let inTrade = false;
  let dir = 0; // +1 buy, -1 sell
  let stop = 0;
  let target = 0;

  for (let t = warmup; t < closes.length; t++) {
    const price = closes[t];

    if (inTrade) {
      const hitStop = dir === 1 ? price <= stop : price >= stop;
      const hitTarget = dir === 1 ? price >= target : price <= target;
      if (hitStop) {
        losses++;
        netR -= 1;
        inTrade = false;
      } else if (hitTarget) {
        wins++;
        netR += TARGET_ATR_MULT / STOP_ATR_MULT;
        inTrade = false;
      }
      if (inTrade) continue; // still open — one position per pair at a time
    }

    const state = evaluate(closes, t);
    if (state.direction === "WAIT" || state.atr <= 0) continue;
    dir = state.direction === "LONG" ? 1 : -1;
    stop = price - dir * STOP_ATR_MULT * state.atr;
    target = price + dir * TARGET_ATR_MULT * state.atr;
    inTrade = true;
  }

  if (inTrade) open = 1;
  const closed = wins + losses;
  const grossWin = wins * (TARGET_ATR_MULT / STOP_ATR_MULT);
  return {
    trades: closed + open,
    wins,
    losses,
    open,
    winRate: closed > 0 ? (wins / closed) * 100 : null,
    profitFactor: losses > 0 ? grossWin / losses : closed > 0 ? Infinity : null,
    netR,
    periodDays: closes.length - warmup,
  };
}
