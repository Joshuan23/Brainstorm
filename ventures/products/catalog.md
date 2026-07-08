# Venture B — Catalog

## 2026-07-08 — first product (product-maker)
- **Freelance Pricing & Profit Calculator + Client Tracker** — `/products/freelance-pricing-profit-calculator`
  - Audience: freelance designers, photographers, writers, VAs.
  - Price: $24, one-time, instant download via Lemon Squeezy.
  - Focused single-purpose system (pricing calc + real hourly-profit + client tracker).
  - Free LITE preview: `public/products/.../pricing-calculator-lite.csv` (funnel driver).
  - Checkout: `app/api/products/checkout` → env `LS_CHECKOUT_FREELANCE_PRICING` (demo until set).
  - Product JSON-LD (Product + Offer).

TODO (owner): produce the full Google Sheets + .xlsx master with live formulas and upload to
Lemon Squeezy; confirm price. Then clone the template to adjacent niches (each = new page + listing).
