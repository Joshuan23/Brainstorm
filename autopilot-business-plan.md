# The Autopilot Business: Prop-Trader Analytics SaaS

**Date:** 2026-07-02
**Decision:** Of all "make money on autopilot" options, the best one is the one already 80% built —
turn the Forextrader app into a subscription analytics tool for prop-firm challenge traders,
with programmatic SEO as the automated acquisition engine.

## Why this beats the usual "passive income" ideas

There is no day-one autopilot business. What exists is a business where **revenue is recurring
and marginal cost is ~zero**, so income eventually decouples from hours worked:

| Idea | Verdict |
|---|---|
| Dropshipping / FBA | Inventory risk, ad-spend treadmill, race to the bottom |
| Crypto/forex bot trading own capital | Strategy decay, brutal drawdowns, maximum stress |
| Faceless YouTube / content farms | Platform-dependent, winner-take-all, constant output needed |
| Selling trading signals/advice | Regulatory overhang, churn, reputation risk |
| **Niche B2B/prosumer SaaS** | **Recurring revenue, zero marginal cost, automatable acquisition** ✅ |

## The wedge: prop-firm challenge traders

- Huge, motivated, underserved niche (FTMO-style evaluations, funded accounts).
- Already spend $100–500 per challenge attempt — a $29/mo tool is an impulse buy.
- Challenges are lost to **rule violations** (daily loss, max drawdown), not bad ideas —
  so the product is a rules/risk dashboard, not "signals" (no regulatory overhang: tools, not advice).
- Sell the tool that helps them pass; retain with signals, COT data, and backtesting.

## The product (status: built, on branch `claude/fable-autopilot-business-ideas-vt5bjo`)

1. **Challenge Tracker** (subscriber feature) — live distance to daily-loss and max-drawdown
   floors, safe risk-per-trade suggestion, day-rollover tracking.
2. **Free tools** (acquisition) — position size calculator with a static SEO page per
   instrument, prop-firm drawdown calculator. Each page: unique metadata, FAQ + JSON-LD, CTA.
3. **Existing retention layer** — SMC signals, COT institutional positioning, backtesting engine.
4. **Monetization** — Stripe subscription with 7-day trial (already wired end to end).

## The autopilot loop

```
Google search ("eur/usd position size calculator",
               "prop firm drawdown calculator")
  → free tool page (static, costs nothing to serve)
    → CTA → 7-day trial → $29/mo subscription
      → churn mitigated by monthly performance emails + tracker lock-in
```

Delivery is automated (software). Acquisition is automated (SEO pages rank while you sleep).
The only non-automatable phase is the first ~50 customers (community posts, DMs) — skipping
that step is why most SaaS dies. Budget 4–6 weeks of manual reps, then the loop carries.

## Pricing

$29/mo, one tier, one CTA. (Design doc said $99 — for the prop-crowd wedge, sub-$30 is the
impulse-buy zone; revisit pricing only after 100 subscribers.)

## Milestones

| When | Milestone | MRR |
|---|---|---|
| Week 1 | Deployed, Stripe live, sitemap submitted | $0 |
| Week 4 | First 20 paying (manual outreach) | ~$580 |
| Month 3 | 100 subscribers, 15+ pages indexed | ~$2,900 |
| Month 6 | 300 subscribers, SEO compounding | ~$8,700 |
| Month 12 | 1,000 subscribers → **~$350k ARR, few hrs/week** | ~$29,000 |

Milestones are targets, not guarantees — the model works only if trial→paid holds above ~40%
and tool pages actually index; both are checked monthly (see punch list).

## Execution checklist

Lives in the product repo: `Forextrader/docs/launch-punch-list.md`
(domain + env vars → deploy → live Stripe test → community launch → SEO expansion).
