"use client";

import { Sparkline } from "./Sparkline";
import type { BacktestStats } from "@/lib/backtest";
import type { Signal } from "@/lib/signals";
import { getCoin } from "@/lib/coins";

interface Props {
  signal: Signal;
  backtest: BacktestStats;
  spark: { dates: string[]; closes: number[] };
}

/** USD price with thousands separators and the coin's display precision. */
export function fmtPrice(v: number, digits: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function SignalCard({ signal, backtest, spark }: Props) {
  const coin = getCoin(signal.coinId);
  const digits = coin?.digits ?? 2;
  const s = signal;

  const badgeClass =
    s.direction === "LONG"
      ? "sig-badge sig-buy"
      : s.direction === "SHORT"
        ? "sig-badge sig-sell"
        : "sig-badge sig-neutral";
  const icon = s.direction === "LONG" ? "▲" : s.direction === "SHORT" ? "▼" : "—";
  const confColor =
    s.direction === "LONG" ? "var(--good)" : s.direction === "SHORT" ? "var(--critical)" : "var(--ink-muted)";

  return (
    <article className="card">
      <div className="card-top">
        <span className="pair-name">{s.label}</span>
        <span className="price-line">
          ${fmtPrice(s.price, digits)}{" "}
          <span className={s.changePct >= 0 ? "chg-up" : "chg-down"}>
            {s.changePct >= 0 ? "+" : ""}
            {s.changePct.toFixed(2)}%
          </span>
        </span>
      </div>

      <div className="sig-row">
        <span className={badgeClass}>
          <span aria-hidden>{icon}</span> {s.direction}
        </span>
        <div className="conf">
          <div className="conf-label">
            <span>Confluence</span>
            <span>
              {s.score > 0 ? "+" : ""}
              {s.score}
            </span>
          </div>
          <div className="bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.confidence} aria-label="Confluence strength">
            <div style={{ width: `${s.confidence}%`, background: confColor }} />
          </div>
        </div>
      </div>

      <Sparkline dates={spark.dates} closes={spark.closes} digits={digits} />

      {s.direction !== "WAIT" && s.stopLoss !== null && s.takeProfit !== null ? (
        <>
          <div className="levels">
            <div className="lv">
              <b>Entry</b>
              <span>${fmtPrice(s.entry, digits)}</span>
            </div>
            <div className="lv">
              <b>Stop</b>
              <span>${fmtPrice(s.stopLoss, digits)}</span>
            </div>
            <div className="lv">
              <b>Target</b>
              <span>${fmtPrice(s.takeProfit, digits)}</span>
            </div>
          </div>
          <div className="meta-line">
            Stop {s.stopPct?.toFixed(1)}% · fixed {s.riskRewardRatio.toFixed(1)}R target · valid for the next 4h · as of {s.asOf}
            {s.dataSource === "demo" ? " · demo data" : ""}
          </div>
        </>
      ) : (
        <div className="meta-line">
          No trade — votes don&apos;t align past the ±40 threshold. As of {s.asOf}
          {s.dataSource === "demo" ? " · demo data" : ""}
        </div>
      )}

      <details className="why">
        <summary>Why? Indicator votes</summary>
        <ul>
          {s.reasons.map((r) => (
            <li key={r.indicator}>
              <span>
                <b style={{ color: "var(--ink)" }}>{r.indicator}.</b> {r.detail}
              </span>
              <span className={`pts ${r.points > 0 ? "pts-pos" : r.points < 0 ? "pts-neg" : "pts-zero"}`}>
                {r.points > 0 ? "+" : ""}
                {r.points}
              </span>
            </li>
          ))}
        </ul>
      </details>

      <div className="stats-line" title="Walk-forward backtest of these exact rules on the loaded history. Excludes fees, funding and slippage.">
        <span>
          Win rate <b>{backtest.winRate === null ? "n/a" : `${backtest.winRate.toFixed(0)}%`}</b>
        </span>
        <span>
          Profit factor{" "}
          <b>
            {backtest.profitFactor === null
              ? "n/a"
              : backtest.profitFactor === Infinity
                ? "∞"
                : backtest.profitFactor.toFixed(2)}
          </b>
        </span>
        <span>
          Trades <b>{backtest.trades}</b>
        </span>
        <span>
          Net <b>{backtest.netR >= 0 ? "+" : ""}{backtest.netR.toFixed(1)}R</b>
        </span>
      </div>
    </article>
  );
}
