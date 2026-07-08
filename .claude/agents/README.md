# Autopilot Venture Team

A team of Claude Code subagents that **build and run two passive-income ventures in
parallel**, top to bottom, each with a daily performance task.

## The two ventures
- **Venture A — Programmatic-SEO lead-gen.** Many static, useful pages rank for high-intent
  service queries → capture leads → route/sell them to providers who pay per lead. State in
  `ventures/leadgen/`.
- **Venture B — Digital products.** Make-once, sell-infinitely downloadable assets sold
  self-serve through Lemon Squeezy (already wired in this repo). State in `ventures/products/`.

Both reuse this repo's stack: Next.js 14 App Router, TypeScript, no database, Vercel-ready,
Lemon Squeezy checkout.

## The team

| Agent | Venture | Owns | Daily task |
|---|---|---|---|
| `venture-orchestrator` | Both | Strategy, sequencing, delegation | Pick the day's constraint, write the standup, delegate, gate, track KPIs |
| `niche-scout` | Both | Demand/competition research | Validate a wedge with real searches; keep the opportunity backlog ranked |
| `seo-page-builder` | A | Programmatic SEO pages | Ship a batch of indexable pages or optimize weak ones |
| `lead-engine` | A | Lead capture + monetization | Ship one conversion/routing improvement |
| `product-maker` | B | Digital product creation + delivery | Produce one revenue-ready product + checkout |
| `marketplace-growth` | B | Listings, storefront, product SEO | Ship one listing or conversion improvement |
| `analytics-reporter` | Both | KPIs, funnels, the daily report | Compute metrics; name the #1 bottleneck |
| `quality-gate` | Both | Correctness + publish gate | Verify build/metadata/forms/checkout before anything goes live |

## The daily loop
```
analytics-reporter  → names the bottleneck
        ↓
venture-orchestrator → sets today's theme + assignments (ventures/reports/standup-<date>.md)
        ↓
niche-scout ─ seo-page-builder ─ lead-engine ─ product-maker ─ marketplace-growth  (produce assets)
        ↓
quality-gate → green-lights what's correct + honest
        ↓
orchestrator → records what shipped + expected impact; appends to kpi-history.md
```

## How to run it
- **Manually:** ask Claude to "run the daily venture standup" (or invoke `venture-orchestrator`),
  and it will delegate to the specialists.
- **On a schedule:** a daily trigger can wake `venture-orchestrator` to run the loop
  unattended. (Ask to set this up.)

## Guardrails (all agents)
- **Passive-first**: prefer compounding assets over ongoing human ops/support.
- **Honesty**: no fake reviews, fake scarcity, fabricated stats, or thin doorway pages.
- **Quality gate ships**: nothing goes live until `quality-gate` is green.
- **Escalate, don't guess**: real spend, buyer/payout contracts, pricing, and legal/tax
  questions go to the owner.

State and reports live under `ventures/` (git-tracked so the work survives container restarts).
