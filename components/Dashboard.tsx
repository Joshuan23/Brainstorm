"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignalCard } from "./SignalCard";
import { UpgradeButton } from "./UpgradeButton";
import type { BacktestStats } from "@/lib/backtest";
import type { Signal } from "@/lib/signals";

type PairEntry =
  | { locked: true; pairId: string; label: string }
  | { locked: false; signal: Signal; backtest: BacktestStats; spark: { dates: string[]; closes: number[] } };

interface Payload {
  plan: "free" | "pro" | "demo-pro";
  pairs: PairEntry[];
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
    return <div className="meta-line" style={{ padding: "40px 0" }}>Scanning 10 pairs…</div>;
  }

  const isPro = data.plan !== "free";
  const anyDemo = data.pairs.some((p) => !p.locked && p.signal.dataSource === "demo");
  const lockedCount = data.pairs.filter((p) => p.locked).length;

  return (
    <>
      <div className="dash-head">
        <h1>
          Daily signals
          <span className={`plan-badge${isPro ? " pro" : ""}`}>
            {data.plan === "demo-pro" ? "Pro (demo)" : data.plan}
          </span>
        </h1>
        {isPro ? (
          <button
            className="btn"
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.reload();
            }}
          >
            Switch to free view
          </button>
        ) : (
          <UpgradeButton label={`Unlock ${lockedCount} more pairs — start free trial`} />
        )}
      </div>

      {anyDemo && (
        <div className="banner">
          <strong>Demo data in use.</strong> The live rates API isn&apos;t reachable from this
          environment, so charts and stats below are computed on generated sample data — clearly a
          demonstration of the engine, not market analysis. Deployed with network access, the app
          uses ECB daily reference rates automatically.
        </div>
      )}

      <div className="grid">
        {data.pairs.map((p) =>
          p.locked ? (
            <article className="card locked" key={p.pairId}>
              <div className="lock-body">
                <div className="card-top">
                  <span className="pair-name">{p.label}</span>
                  <span className="price-line">•••••</span>
                </div>
                <div className="sig-row" style={{ marginTop: 12 }}>
                  <span className="sig-badge sig-neutral">— HIDDEN</span>
                </div>
                <div style={{ height: 110 }} />
              </div>
              <div className="lock-overlay">
                <span className="lock-ico" aria-hidden>
                  🔒
                </span>
                <p>
                  <b>{p.label}</b> signals, levels and backtest stats are on the Pro plan.
                </p>
                <UpgradeButton label="Unlock with Pro" />
              </div>
            </article>
          ) : (
            <SignalCard key={p.signal.pairId} signal={p.signal} backtest={p.backtest} spark={p.spark} />
          )
        )}
      </div>

      <p className="foot-note">
        Signals are generated once per trading day from daily reference rates and are provided for
        education and research — they are not financial advice or an inducement to trade. Backtest
        figures are measured on historical data by walk-forward simulation, exclude spread,
        slippage and swap, and do not predict future performance. Trading forex on margin carries a
        high risk of loss. See the full <Link href="/#pricing">risk disclosure</Link>.
      </p>
    </>
  );
}
