# PipSignal

Daily forex signals from a **transparent multi-indicator confluence engine**, with a
license-key paywall powered by Lemon Squeezy. Built with Next.js 14 (App Router,
TypeScript), no database required.

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
| Paywall | `app/api/checkout`, `app/api/license/activate`, `lib/lemonsqueezy.ts`, `lib/entitlement.ts` | Lemon Squeezy hosted checkout (merchant of record — they handle global sales tax/VAT). Purchases email the buyer a license key; activating it in the app validates it against the License API and sets an HMAC-signed Pro cookie. The key is re-validated ~daily, so cancelled subscriptions lose access automatically. No config → demo mode (24 h "Pro (demo)" pass). |
| Free tier | `lib/pairs.ts` | EUR/USD + USD/JPY free; 8 more pairs (majors + EUR/GBP, EUR/JPY, GBP/JPY) behind Pro at $29/mo. |
| UI | `app/`, `components/` | Landing page with pricing + risk disclosure; dashboard with signal cards, confluence meter, vote breakdown, interactive sparklines, blurred locked cards. |

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run engine:check   # indicator unit checks + full pipeline over all 10 pairs
npm run build          # production build
```

Copy `.env.example` to `.env.local` and configure Lemon Squeezy to take real payments:

1. Create a Lemon Squeezy store (they are the merchant of record, so they handle
   global sales tax/VAT — no Stripe account needed) and a **$29/mo subscription
   product** with *"Generate license keys"* enabled.
2. Set `LEMONSQUEEZY_CHECKOUT_URL` (the product's checkout link), optionally
   `LEMONSQUEEZY_STORE_ID`/`LEMONSQUEEZY_PRODUCT_ID` to pin keys to your product,
   and a long random `ENTITLEMENT_SECRET`.
3. Deploy (Vercel works out of the box). Purchase → license key arrives by email →
   buyer activates it on the dashboard → signed 30-day Pro cookie, silently
   re-validated ~daily so cancelled subscriptions lose access on their own.

Without configuration the upgrade button grants a clearly-labelled 24-hour demo
pass, so the entire paywall flow can be exercised in development.

## Data honesty

- Signals are computed on **daily ECB reference rates** (one close per trading day) —
  suitable for daily-timeframe swing signals, not intraday scalping. Stops use a
  close-to-close volatility proxy because reference rates carry no intraday high/low.
- Backtest figures exclude spread, slippage and swap, and say so in the UI.
- When the rates API is unreachable, the app generates deterministic sample data and
  shows a banner saying exactly that. Demo data is never presented as market data.

## Before charging real customers (roadmap)

- [ ] Real accounts (email magic-link) so buyers don't depend on one browser's
      cookie; Lemon Squeezy webhooks for instant (rather than ~daily) revocation.
- [ ] Link to the Lemon Squeezy customer portal for self-serve cancel/receipts.
- [ ] Upgrade the data feed (e.g. a keyed OHLC provider) for true ATR stops and
      intraday timeframes.
- [ ] Email/push delivery of new signals (retention).
- [ ] Legal review of marketing copy in your jurisdictions — signals products attract
      regulator attention; the shipped copy deliberately avoids performance promises.

## Disclaimer

This software is an analytics/education tool. Nothing it outputs is financial advice
or a recommendation to trade. Forex trading on margin carries a high risk of loss.
