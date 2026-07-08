/**
 * Sanity harness for the signal engine — run with `npm run engine:check`.
 * Verifies indicator math on known inputs and runs the full pipeline
 * (signal + backtest) over demo data for every coin.
 */
import { ema, rsi, macd, bollinger, closeAtr, sma } from "../lib/indicators";
import { evaluate, buildSignal } from "../lib/signals";
import { backtest } from "../lib/backtest";
import { demoSeries } from "../lib/data";
import { COINS } from "../lib/coins";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

// --- indicator unit checks on hand-computable inputs ---
const seq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const s3 = sma(seq, 3);
check("SMA(3) of 1..10 ends at 9", Math.abs(s3[9] - 9) < 1e-9, `got ${s3[9]}`);

const e3 = ema(seq, 3);
check("EMA(3) of 1..10 ends near 9", Math.abs(e3[9] - 9) < 0.2, `got ${e3[9]}`);

const up = Array.from({ length: 30 }, (_, i) => 100 + i); // strictly rising
const rUp = rsi(up, 14);
check("RSI of strictly rising series = 100", Math.abs(rUp[29] - 100) < 1e-9, `got ${rUp[29]}`);

const down = Array.from({ length: 30 }, (_, i) => 100 - i);
const rDown = rsi(down, 14);
check("RSI of strictly falling series = 0", Math.abs(rDown[29]) < 1e-9, `got ${rDown[29]}`);

const flat = new Array(60).fill(5);
const b = bollinger(flat, 20, 2);
check("Bollinger on flat series: bands collapse to price", Math.abs(b.upper[59] - 5) < 1e-9 && Math.abs(b.lower[59] - 5) < 1e-9);

const m = macd(up.concat(down));
check("MACD defined after warmup", !Number.isNaN(m.histogram[50]));

const atr = closeAtr(up, 14);
check("closeATR of unit-step series = 1", Math.abs(atr[29] - 1) < 1e-6, `got ${atr[29]}`);

// --- engine direction sanity: strong trend should not fight the trend ---
const bull = Array.from({ length: 120 }, (_, i) => 100 * (1 + 0.001 * i));
const bullState = evaluate(bull, bull.length - 1);
check("Sustained uptrend does not produce SHORT", bullState.direction !== "SHORT", `score ${bullState.score}`);

const bear = Array.from({ length: 120 }, (_, i) => 100 * (1 - 0.001 * i));
const bearState = evaluate(bear, bear.length - 1);
check("Sustained downtrend does not produce LONG", bearState.direction !== "LONG", `score ${bearState.score}`);

// --- full pipeline over demo data for every coin ---
console.log("\ncoin   dir     score  entry        stop         target       | trades win%  PF     netR");
for (const coin of COINS) {
  const series = demoSeries(coin);
  const sig = buildSignal(coin, series.dates, series.closes, series.source);
  const bt = backtest(series.closes);

  const consistent =
    sig.direction === "WAIT"
      ? sig.stopLoss === null
      : sig.direction === "LONG"
        ? sig.stopLoss! < sig.entry && sig.takeProfit! > sig.entry
        : sig.stopLoss! > sig.entry && sig.takeProfit! < sig.entry;
  if (!consistent) {
    failures++;
    console.log(`FAIL  ${coin.id}: stop/target on wrong side of entry`);
  }
  const wr = bt.winRate === null ? "  n/a" : `${bt.winRate.toFixed(0).padStart(4)}%`;
  const pf = bt.profitFactor === null ? "n/a " : bt.profitFactor === Infinity ? "inf " : bt.profitFactor.toFixed(2);
  console.log(
    `${coin.id.padEnd(5)}  ${sig.direction.padEnd(6)} ${String(sig.score).padStart(5)}  ${sig.entry.toFixed(coin.digits).padEnd(11)} ${(sig.stopLoss?.toFixed(coin.digits) ?? "—").padEnd(11)} ${(sig.takeProfit?.toFixed(coin.digits) ?? "—").padEnd(11)} | ${String(bt.trades).padStart(6)} ${wr}  ${pf}  ${bt.netR >= 0 ? "+" : ""}${bt.netR.toFixed(1)}R`
  );
}

console.log(failures === 0 ? "\nAll engine checks passed." : `\n${failures} check(s) FAILED`);
process.exit(failures === 0 ? 0 : 1);
