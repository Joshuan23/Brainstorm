import { NextResponse } from "next/server";
import { getDailySeries } from "@/lib/data";
import { backtest, BacktestStats } from "@/lib/backtest";
import { buildSignal, Signal } from "@/lib/signals";
import { COINS } from "@/lib/coins";

export const dynamic = "force-dynamic";

export interface CoinPayload {
  signal: Signal;
  backtest: BacktestStats;
  /** last ~90 sessions for the sparkline */
  spark: { dates: string[]; closes: number[] };
}

export async function GET() {
  const coins = await Promise.all(
    COINS.map(async (coin) => {
      const series = await getDailySeries(coin);
      const signal = buildSignal(coin, series.dates, series.closes, series.source);
      const stats = backtest(series.closes);
      const n = series.closes.length;
      const from = Math.max(0, n - 90);
      return {
        signal,
        backtest: stats,
        spark: { dates: series.dates.slice(from), closes: series.closes.slice(from) },
      } satisfies CoinPayload;
    })
  );

  return NextResponse.json({
    coins,
    generatedAt: new Date().toISOString(),
  });
}
