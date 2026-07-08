# BudSignal

Free daily **Bitcoin & crypto trading signals** from a **transparent multi-indicator
confluence engine**, with every setup's historical win rate measured live by
walk-forward backtest. Built with Next.js 14 (App Router, TypeScript). No database,
no API key, no paywall.

> **Honesty note (read before marketing this):** the site this is modelled on pitches
> "predictive liquidation intelligence" and a headline accuracy number — which is
> exactly why it scores as a scam on trust-rating sites. BudSignal is the *defensible*
> version of the same idea: it never claims an accuracy figure. Every signal ships with
> the exact indicator votes that produced it and a walk-forward backtest of the same
> rules, recomputed from data on every load — **measured, not promised.** Keep it that
> way.

## What's inside

| Piece | Where | What it does |
|---|---|---|
| Signal engine | `lib/signals.ts` | 5 weighted indicator votes (EMA 20/50 trend, price vs EMA20, MACD 12/26/9, RSI 14, Bollinger %B) sum to a −100…+100 confluence score; ±40 fires **LONG/SHORT**, else **WAIT**. Entries at close, stops at 1.5× volatility, fixed 1.5R targets, 4-hour entry window. |
| Indicators | `lib/indicators.ts` | SMA, EMA, RSI, MACD, Bollinger, close-based ATR proxy — pure functions, unit-checked. |
| Backtester | `lib/backtest.ts` | Walk-forward simulation of the exact live rules (no lookahead; both-sides-hit days count as losses). Produces the win rate / profit factor / net-R shown on each card and on the track-record page. |
| Market data | `lib/data.ts` | Free public CoinGecko `market_chart` API (daily USD prices, no key) with a 15-min cache; falls back to clearly-labelled deterministic demo data when offline. |
| Markets | `lib/coins.ts` | Bitcoin plus 9 major coins (ETH, SOL, BNB, XRP, ADA, DOGE, AVAX, LINK, POL). All free. |
| Dashboard | `app/dashboard`, `components/` | Signal cards with confluence meter, per-indicator vote breakdown, interactive sparklines and live backtest stats. |
| Track record | `app/track-record` | Aggregate walk-forward performance across every market — wins *and* losses — recomputed live from the same data. |
| UI | `app/`, `components/` | Landing page with markets, pricing (it's $0) and risk disclosure; Bitcoin-orange theme. |

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run engine:check   # indicator unit checks + full pipeline over all markets
npm run build          # production build
```

There is **nothing to configure** — no keys, no accounts, no payment provider.
Deploy it anywhere that runs Next.js (Vercel works out of the box) and it's live and
free. When the CoinGecko API is unreachable (e.g. a sandboxed CI box), the app shows a
banner and computes on labelled demo data so it stays fully usable.

## Data honesty

- Signals are computed on **daily closing prices** — suitable for daily-timeframe swing
  signals, not intraday scalping. Stops use a close-to-close volatility proxy.
- Backtest figures exclude exchange fees, funding and slippage, and say so in the UI.
- When the price API is unreachable, the app generates deterministic sample data and
  shows a banner saying exactly that. Demo data is never presented as market data.

## Roadmap (nice-to-haves)

- [ ] Optional Telegram / browser-push delivery of new daily signals (retention).
- [ ] Upgrade the feed to an OHLC provider for true intraday ATR stops and timeframes.
- [ ] Per-market signal history log (dated entries + outcomes) alongside the aggregate.
- [ ] Legal review of marketing copy in your jurisdictions — signals products attract
      regulator attention; the shipped copy deliberately avoids performance promises.

## Disclaimer

This software is an analytics/education tool. Nothing it outputs is financial advice or
a recommendation to trade. Cryptocurrency is extremely volatile and you can lose your
entire investment. Never trade money you cannot afford to lose.
