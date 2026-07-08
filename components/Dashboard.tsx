"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignalCard } from "./SignalCard";
import type { BacktestStats } from "@/lib/backtest";
import type { Signal } from "@/lib/signals";

interface CoinEntry {
  signal: Signal;
  backtest: BacktestStats;
  spark: { dates: string[]; closes: number[] };
}

interface Payload {
  coins: CoinEntry[];
  generatedAt: string;
}

export function Dashboard() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/signals")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <div className="banner">Could not load signals. Refresh to try again.</div>;
  }
  if (!data) {
    return <div className="meta-line" style={{ padding: "40px 0" }}>Scanning the market…</div>;
  }

  const anyDemo = data.coins.some((c) => c.signal.dataSource === "demo");
  const active = data.coins.filter((c) => c.signal.direction !== "WAIT").length;

  return (
    <>
      <div className="dash-head">
        <h1>
          Live signals
          <span className="plan-badge pro">Free · all markets</span>
        </h1>
        <Link href="/track-record" className="btn">
          Track record →
        </Link>
      </div>

      <p className="meta-line" style={{ marginBottom: 20 }}>
        {active} of {data.coins.length} markets are firing a trade right now · recomputed every load ·
        signals refresh once per day.
      </p>

      {anyDemo && (
        <div className="banner">
          <strong>Demo data in use.</strong> The live price API isn&apos;t reachable from this
          environment, so the charts and stats below are computed on generated sample data — clearly a
          demonstration of the engine, not market analysis. Deployed with network access, the app
          uses live CoinGecko daily prices automatically.
        </div>
      )}

      <div className="grid">
        {data.coins.map((c) => (
          <SignalCard key={c.signal.coinId} signal={c.signal} backtest={c.backtest} spark={c.spark} />
        ))}
      </div>

      <p className="foot-note">
        Signals are generated once per day from daily closing prices and are provided for education
        and research — they are not financial advice or an inducement to trade. Backtest figures are
        measured on historical data by walk-forward simulation, exclude exchange fees, funding and
        slippage, and do not predict future performance. Trading crypto is highly volatile and can
        result in the total loss of your capital. See the full{" "}
        <Link href="/#risk">risk disclosure</Link>.
      </p>
    </>
  );
}
