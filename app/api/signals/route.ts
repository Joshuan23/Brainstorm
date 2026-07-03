import { NextResponse } from "next/server";
import { getDailySeries } from "@/lib/data";
import { backtest, BacktestStats } from "@/lib/backtest";
import { buildSignal, Signal } from "@/lib/signals";
import { FREE_PAIR_IDS, PAIRS } from "@/lib/pairs";
import { currentEntitlement } from "@/lib/entitlement";

export const dynamic = "force-dynamic";

export interface PairPayload {
  signal: Signal;
  backtest: BacktestStats;
  /** last ~90 sessions for the sparkline */
  spark: { dates: string[]; closes: number[] };
  locked: false;
}

export interface LockedPayload {
  pairId: string;
  label: string;
  locked: true;
}

export async function GET() {
  const ent = currentEntitlement();
  const isPro = ent !== null;

  const results = await Promise.all(
    PAIRS.map(async (pair) => {
      const unlocked = isPro || FREE_PAIR_IDS.includes(pair.id);
      if (!unlocked) {
        return { pairId: pair.id, label: pair.label, locked: true } satisfies LockedPayload;
      }
      const series = await getDailySeries(pair);
      const signal = buildSignal(pair, series.dates, series.closes, series.source);
      const stats = backtest(series.closes);
      const n = series.closes.length;
      const from = Math.max(0, n - 90);
      return {
        signal,
        backtest: stats,
        spark: { dates: series.dates.slice(from), closes: series.closes.slice(from) },
        locked: false,
      } satisfies PairPayload;
    })
  );

  return NextResponse.json({
    plan: isPro ? ent!.plan : "free",
    pairs: results,
    generatedAt: new Date().toISOString(),
  });
}
