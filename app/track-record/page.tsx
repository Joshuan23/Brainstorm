import Link from "next/link";
import { COINS } from "@/lib/coins";
import { getDailySeries } from "@/lib/data";
import { backtest } from "@/lib/backtest";

export const metadata = { title: "Track record — BudSignal" };
export const dynamic = "force-dynamic";

/**
 * Honest, aggregate performance across every market. This is a walk-forward
 * simulation of the exact live rules over the loaded price history — not a
 * curated log of "wins". It is recomputed on every request from the same data
 * the dashboard uses, so it can never drift from what the engine actually does.
 */
export default async function TrackRecord() {
  const rows = await Promise.all(
    COINS.map(async (coin) => {
      const series = await getDailySeries(coin);
      return { coin, bt: backtest(series.closes), source: series.source };
    })
  );

  const totalWins = rows.reduce((a, r) => a + r.bt.wins, 0);
  const totalLosses = rows.reduce((a, r) => a + r.bt.losses, 0);
  const totalClosed = totalWins + totalLosses;
  const totalNetR = rows.reduce((a, r) => a + r.bt.netR, 0);
  const overallWinRate = totalClosed > 0 ? (totalWins / totalClosed) * 100 : null;
  const grossWin = totalWins * 1.5;
  const overallPF = totalLosses > 0 ? grossWin / totalLosses : totalClosed > 0 ? Infinity : null;
  const anyDemo = rows.some((r) => r.source === "demo");

  const pf = (v: number | null) => (v === null ? "n/a" : v === Infinity ? "∞" : v.toFixed(2));
  const wr = (v: number | null) => (v === null ? "n/a" : `${v.toFixed(0)}%`);

  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="brand">
          Bud<span>Signal</span>
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/dashboard" className="btn btn-primary">
            Open dashboard
          </Link>
        </div>
      </nav>

      <div className="dash-head">
        <h1>Track record</h1>
      </div>
      <p className="sub" style={{ maxWidth: 680, marginBottom: 24 }}>
        Every trade the exact live rules would have taken over the loaded price history — long and
        short, wins and losses. It is a walk-forward simulation using only data available at each
        point in time, recomputed on every load. No cherry-picking; the losers are counted too.
      </p>

      {anyDemo && (
        <div className="banner">
          <strong>Demo data in use.</strong> The live price API isn&apos;t reachable here, so these
          figures are simulated on generated sample data to demonstrate the method — not a real
          performance record.
        </div>
      )}

      <div className="tr-summary">
        <div className="tr-stat">
          <span className="k">Overall win rate</span>
          <b>{wr(overallWinRate)}</b>
        </div>
        <div className="tr-stat">
          <span className="k">Profit factor</span>
          <b>{pf(overallPF)}</b>
        </div>
        <div className="tr-stat">
          <span className="k">Closed trades</span>
          <b>{totalClosed}</b>
        </div>
        <div className="tr-stat">
          <span className="k">Net result</span>
          <b>{totalNetR >= 0 ? "+" : ""}{totalNetR.toFixed(1)}R</b>
        </div>
      </div>

      <div className="tr-table-wrap">
        <table className="tr-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Trades</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Win rate</th>
              <th>Profit factor</th>
              <th>Net R</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.coin.id}>
                <td><b>{r.coin.label}</b></td>
                <td>{r.bt.wins + r.bt.losses}</td>
                <td>{r.bt.wins}</td>
                <td>{r.bt.losses}</td>
                <td>{wr(r.bt.winRate)}</td>
                <td>{pf(r.bt.profitFactor)}</td>
                <td className={r.bt.netR >= 0 ? "chg-up" : "chg-down"}>
                  {r.bt.netR >= 0 ? "+" : ""}{r.bt.netR.toFixed(1)}R
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="foot-note">
        &ldquo;R&rdquo; is risk-multiples: a loss is −1R, a win is +1.5R (the fixed reward:risk of the
        strategy). Figures exclude exchange fees, funding and slippage, are measured on daily closing
        prices, and <b>do not predict future results</b>. BudSignal is an education tool, not
        financial advice. Crypto is highly volatile — see the full{" "}
        <Link href="/#risk">risk disclosure</Link>.
      </p>

      <footer className="footer">
        <div>© {new Date().getFullYear()} BudSignal · free forever</div>
        <div>Walk-forward backtest · recomputed live from CoinGecko daily prices</div>
      </footer>
    </div>
  );
}
