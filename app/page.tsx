import Link from "next/link";
import { UpgradeButton } from "@/components/UpgradeButton";
import { currentEntitlement } from "@/lib/entitlement";

export default function Landing() {
  const ent = currentEntitlement();
  const isPro = ent !== null;

  return (
    <>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="brand">
            Pip<span>Signal</span>
          </Link>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/dashboard" className="btn">
              Dashboard
            </Link>
            {!isPro && <UpgradeButton className="btn btn-primary" label="Start free trial" />}
          </div>
        </nav>

        <header className="hero">
          <h1>
            Forex signals with the receipts. <em>Measured, not promised.</em>
          </h1>
          <p className="lede">
            A transparent five-indicator confluence engine scans 10 major pairs daily and hands you
            precise entries, volatility-sized stops and 1.5R targets — with every rule&apos;s
            historical win rate computed live by walk-forward backtest, right on the card. No black
            box, no cherry-picked screenshots.
          </p>
          <div className="cta-row">
            {isPro ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Open your dashboard
              </Link>
            ) : (
              <UpgradeButton className="btn btn-primary btn-lg" label="Start 7-day free trial" />
            )}
            <Link href="/dashboard" className="btn btn-lg">
              See free signals first
            </Link>
          </div>
          <p className="fine">
            EUR/USD and USD/JPY are free forever. No credit card needed to look around.
          </p>
        </header>

        <section className="section">
          <h2>Why traders trust it: nothing is hidden</h2>
          <p className="sub">
            Anyone can claim &ldquo;90% accuracy.&rdquo; We don&apos;t claim — we show. Every signal
            ships with the exact indicator votes that produced it and the strategy&apos;s measured
            performance on the last ~400 sessions of data.
          </p>
          <div className="cards-3">
            <div className="feature">
              <span className="k">The engine</span>
              <h3>Five-indicator confluence</h3>
              <p>
                EMA 20/50 trend, price structure, MACD momentum, RSI regime and Bollinger %B each
                cast a weighted vote. Only when the votes align past a ±40 threshold does a BUY or
                SELL fire — otherwise the pair stays honestly NEUTRAL.
              </p>
            </div>
            <div className="feature">
              <span className="k">The entries</span>
              <h3>Exact levels, managed risk</h3>
              <p>
                Every signal includes an entry, a volatility-sized stop (1.5× recent daily range)
                and a fixed 1.5R take-profit — so one number, the win rate, tells you whether the
                edge is real.
              </p>
            </div>
            <div className="feature">
              <span className="k">The proof</span>
              <h3>Live walk-forward backtest</h3>
              <p>
                Each pair&apos;s card shows the win rate, profit factor and trade count the exact
                same rules produced historically — recomputed from data on every load, using only
                information available at the time of each simulated trade.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="pricing">
          <h2>Pricing</h2>
          <p className="sub">One plan, everything unlocked. Cancel anytime.</p>
          <div className="pricing">
            <div className="plan">
              <h3>Free</h3>
              <div className="price">
                $0 <small>forever</small>
              </div>
              <ul>
                <li>EUR/USD &amp; USD/JPY daily signals</li>
                <li>Full indicator breakdown per signal</li>
                <li>Backtested stats on free pairs</li>
                <li className="no">8 additional major &amp; cross pairs</li>
                <li className="no">Volatility stops &amp; 1.5R targets on all pairs</li>
              </ul>
              <Link href="/dashboard" className="btn">
                View free signals
              </Link>
            </div>
            <div className="plan featured">
              <h3>Pro</h3>
              <div className="price">
                $29 <small>/ month · 7-day free trial</small>
              </div>
              <ul>
                <li>All 10 pairs: majors + EUR/GBP, EUR/JPY, GBP/JPY</li>
                <li>Entry, stop and target on every active signal</li>
                <li>Confluence score &amp; full vote transparency</li>
                <li>Walk-forward stats on every pair</li>
                <li>Cancel in one click, keep access till period ends</li>
              </ul>
              {isPro ? (
                <Link href="/dashboard" className="btn btn-primary">
                  You&apos;re Pro — open dashboard
                </Link>
              ) : (
                <UpgradeButton className="btn btn-primary" label="Start free trial" />
              )}
            </div>
          </div>
        </section>

        <div className="disclaimer">
          <strong>Risk disclosure — read this.</strong> PipSignal is an analytics tool, not
          financial advice, and no output constitutes a recommendation to buy or sell any
          instrument. Backtested and historical win rates are measured on daily reference rates,
          exclude spread, slippage and swap, and do not predict future results. Foreign exchange
          trading on margin carries a high level of risk and can result in losses exceeding your
          deposit. Never trade money you cannot afford to lose. If in doubt, consult a licensed
          financial adviser.
        </div>

        <footer className="footer">
          <div>© {new Date().getFullYear()} PipSignal</div>
          <div>Data: ECB daily reference rates · Signals recompute once per trading day</div>
        </footer>
      </div>
    </>
  );
}
