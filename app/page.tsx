import Link from "next/link";
import { COINS } from "@/lib/coins";

export default function Landing() {
  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="brand">
          Bud<span>Signal</span>
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/track-record" className="btn">
            Track record
          </Link>
          <Link href="/dashboard" className="btn btn-primary">
            Open dashboard
          </Link>
        </div>
      </nav>

      <header className="hero">
        <h1>
          Bitcoin signals with the receipts. <em>Free, and measured — not promised.</em>
        </h1>
        <p className="lede">
          A transparent five-indicator confluence engine scans Bitcoin and {COINS.length - 1} major
          coins every day and hands you a clear <b>LONG / SHORT / WAIT</b> call with exact entries,
          volatility-sized stops and 1.5R targets — and every rule&apos;s historical win rate is
          computed live by walk-forward backtest, right on the card. No black box, no paywall, no
          cherry-picked screenshots.
        </p>
        <div className="cta-row">
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            See today&apos;s signals — free
          </Link>
          <Link href="/track-record" className="btn btn-lg">
            Check the track record
          </Link>
        </div>
        <p className="fine">
          Everything is free forever. No sign-up, no credit card, no &ldquo;VIP tier.&rdquo;
        </p>
      </header>

      <section className="section">
        <h2>Why you can trust it: nothing is hidden</h2>
        <p className="sub">
          Anyone can screenshot a &ldquo;90% win rate.&rdquo; BudSignal doesn&apos;t claim — it shows.
          Every signal ships with the exact indicator votes that produced it and the strategy&apos;s
          measured performance over the last ~365 days of price data, recomputed on every load.
        </p>
        <div className="cards-3">
          <div className="feature">
            <span className="k">The engine</span>
            <h3>Five-indicator confluence</h3>
            <p>
              EMA 20/50 trend, price structure, MACD momentum, RSI regime and Bollinger %B each cast a
              weighted vote. Only when the votes align past a ±40 threshold does a LONG or SHORT fire —
              otherwise the market honestly stays on WAIT.
            </p>
          </div>
          <div className="feature">
            <span className="k">The trade</span>
            <h3>Exact levels, managed risk</h3>
            <p>
              Every signal includes an entry, a volatility-sized stop (1.5× recent daily range) and a
              fixed 1.5R take-profit, valid for a 4-hour entry window — so one number, the win rate,
              tells you whether the edge is real.
            </p>
          </div>
          <div className="feature">
            <span className="k">The proof</span>
            <h3>Live walk-forward backtest</h3>
            <p>
              Each coin&apos;s card shows the win rate, profit factor and trade count the exact same
              rules produced historically — recomputed from data every load, using only information
              available at the time of each simulated trade.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Markets covered</h2>
        <p className="sub">
          Bitcoin is the headline market. The rest are the most liquid coins, so the daily engine has
          the history and volume to mean something.
        </p>
        <div className="coin-chips">
          {COINS.map((c) => (
            <span className={`coin-chip${c.featured ? " featured" : ""}`} key={c.id}>
              {c.id} <small>{c.name}</small>
            </span>
          ))}
        </div>
      </section>

      <section className="section" id="pricing">
        <h2>Pricing</h2>
        <p className="sub">There isn&apos;t any. This is the whole plan.</p>
        <div className="pricing">
          <div className="plan featured">
            <h3>Everything</h3>
            <div className="price">
              $0 <small>forever · no account</small>
            </div>
            <ul>
              <li>Daily LONG / SHORT / WAIT calls on all {COINS.length} markets</li>
              <li>Entry, volatility stop and 1.5R target on every active signal</li>
              <li>Full confluence score &amp; per-indicator vote transparency</li>
              <li>Live walk-forward backtest stats on every coin</li>
              <li>Aggregate track record across all markets</li>
            </ul>
            <Link href="/dashboard" className="btn btn-primary">
              Open the dashboard
            </Link>
          </div>
        </div>
      </section>

      <div className="disclaimer" id="risk">
        <strong>Risk disclosure — read this.</strong> BudSignal is an analytics and education tool,
        not financial advice, and no output constitutes a recommendation to buy or sell any asset.
        Backtested and historical win rates are measured on daily closing prices, exclude exchange
        fees, funding and slippage, and do not predict future results. Cryptocurrency is extremely
        volatile and you can lose your entire investment. Never trade money you cannot afford to lose.
        If in doubt, consult a licensed financial adviser.
      </div>

      <footer className="footer">
        <div>© {new Date().getFullYear()} BudSignal · free forever</div>
        <div>Data: CoinGecko daily prices · Signals recompute once per day</div>
      </footer>
    </div>
  );
}
