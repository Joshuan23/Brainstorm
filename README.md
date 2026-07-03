# PipSignal

Daily forex signals from a **transparent multi-indicator confluence engine**, with a
Stripe-powered paywall. Built with Next.js 14 (App Router, TypeScript), no database
required for the MVP.

> **Honesty note (read before marketing this):** no product can truthfully claim "the
> most accurate signals in the market", and making that claim invites regulatory and
> reputational trouble. PipSignal's positioning is the defensible version of the same
> pitch: *every* signal ships with the exact indicator votes that produced it and a
> walk-forward backtest of the same rules, recomputed from data on every load —
> **measured, not promised**. Keep it that way.

## What's inside

| Piece | Where | What it does |
|---|---|---|
| Signal engine | `lib/signals.ts` | 5 weighted indicator votes (EMA 20/50 trend, price vs EMA20, MACD 12/26/9, RSI 14, Bollinger %B) sum to a −100…+100 confluence score; ±40 fires BUY/SELL, else NEUTRAL. Entries at close, stops at 1.5× volatility, fixed 1.5R targets. |
| Indicators | `lib/indicators.ts` | SMA, EMA, RSI, MACD, Bollinger, close-based ATR proxy — pure functions, unit-checked. |
| Backtester | `lib/backtest.ts` | Walk-forward simulation of the exact live rules (no lookahead; both-sides-hit days count as losses). Produces the win rate / profit factor / net-R shown on each card. |
| Market data | `lib/data.ts` | Frankfurter API (ECB daily reference rates, free, no key) with a 15-min cache; falls back to clearly-labelled deterministic demo data when offline. |
| Paywall | `app/api/checkout*`, `lib/entitlement.ts` | Stripe Checkout (subscription, 7-day trial). Success URL is verified server-side with Stripe before an HMAC-signed, expiring Pro cookie is set. No Stripe keys → demo mode (24 h "Pro (demo)" pass) so the flow is testable locally. |
| Free tier | `lib/pairs.ts` | EUR/USD + USD/JPY free; 8 more pairs (majors + EUR/GBP, EUR/JPY, GBP/JPY) behind Pro at $29/mo. |
| UI | `app/`, `components/` | Landing page with pricing + risk disclosure; dashboard with signal cards, confluence meter, vote breakdown, interactive sparklines, blurred locked cards. |

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run engine:check   # indicator unit checks + full pipeline over all 10 pairs
npm run build          # production build
```

Copy `.env.example` to `.env.local` and fill in Stripe keys to take real payments:

1. Stripe dashboard → create a Product ("PipSignal Pro") with a **recurring $29/mo price** → copy the `price_...` id.
2. Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, and a long random `ENTITLEMENT_SECRET`.
3. Deploy (Vercel works out of the box). Checkout → success → server-side session
   verification → signed 30-day Pro cookie.

Without keys the upgrade button grants a clearly-labelled 24-hour demo pass, so the
entire paywall flow can be exercised in development.

## Data honesty

- Signals are computed on **daily ECB reference rates** (one close per trading day) —
  suitable for daily-timeframe swing signals, not intraday scalping. Stops use a
  close-to-close volatility proxy because reference rates carry no intraday high/low.
- Backtest figures exclude spread, slippage and swap, and say so in the UI.
- When the rates API is unreachable, the app generates deterministic sample data and
  shows a banner saying exactly that. Demo data is never presented as market data.

## Before charging real customers (roadmap)

- [ ] Real accounts (email magic-link) + Stripe **webhooks** so cancellations revoke
      access immediately (the MVP cookie simply expires after 30 days).
- [ ] Billing portal link (`stripe.billingPortal.sessions.create`) for self-serve cancel.
- [ ] Upgrade the data feed (e.g. a keyed OHLC provider) for true ATR stops and
      intraday timeframes.
- [ ] Email/push delivery of new signals (retention).
- [ ] Legal review of marketing copy in your jurisdictions — signals products attract
      regulator attention; the shipped copy deliberately avoids performance promises.

## Disclaimer

This software is an analytics/education tool. Nothing it outputs is financial advice
or a recommendation to trade. Forex trading on margin carries a high risk of loss.
