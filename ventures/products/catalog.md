# Venture B — Catalog

## 2026-07-08 — first product (product-maker)
- **Freelance Pricing & Profit Calculator + Client Tracker** — `/products/freelance-pricing-profit-calculator`
  - Audience: freelance designers, photographers, writers, VAs.
  - Target query: "freelance pricing calculator template".
  - Price: $24, one-time, instant download via Lemon Squeezy.
  - Focused single-purpose system (pricing calc + real hourly-profit + client tracker).
  - Free LITE preview: `public/products/.../pricing-calculator-lite.csv` (funnel driver, unchanged).
  - Checkout: `app/api/products/checkout` → env `LS_CHECKOUT_FREELANCE_PRICING` (demo until set).
  - Product JSON-LD (Product + Offer).
  - Pain solved: freelancers price by gut feel and don't know their real hourly profit after
    expenses/margin, so they underprice and can't tell which clients are actually worth keeping.

## 2026-07-08 — full paid master built (product-maker)
- Built the real, formula-driven deliverable (previously only the free lite CSV existed).
  Generator script (reproducible): `scripts/build-pricing-workbook.py` (Python + openpyxl).
- **Paid master — upload this to Lemon Squeezy as the product file:**
  `public/products/freelance-pricing-profit-calculator/freelance-pricing-profit-calculator.xlsx`
  - Tab 1 "Pricing Calculator": 5 yellow input cells (project, hours, rate, expenses, margin%)
    per row; blue formula cells compute Labor Cost, Base Cost, Recommended Price, Profit, Real
    Profit/Hour. 3 worked example rows + 7 pre-formatted blank rows; formula-key notes box below
    the table.
  - Tab 2 "Client Tracker": Client, Project, Status (dropdown: Not started/Scoping/In
    progress/Invoiced/Paid/Overdue), Invoiced, Paid, Balance (live formula = Invoiced − Paid),
    Next Action; 4 worked examples + 8 blank rows + totals row.
  - Tab 3 "Read me - Setup": how to use, Google Sheets import note, color key, single-user
    license, support policy.
  - Verified: zip integrity OK, all 3 sheets load via openpyxl, formulas independently
    recomputed in Python and match the encoded formula logic exactly.
- **Google Sheets CSV set** (fallback / alternate import path) —
  `public/products/freelance-pricing-profit-calculator/google-sheets/`:
  `01-Pricing-Calculator.csv`, `02-Client-Tracker.csv`, `03-Read-me-Setup.csv`. Formulas are
  written in-cell (e.g. `=B2*C2`) so Sheets imports them as live formulas in most cases; a
  full formula key is provided as a manual fallback.
- **Setup guide**: `public/products/freelance-pricing-profit-calculator/SETUP.md` — fastest-path
  instructions (import the .xlsx directly into Sheets), CSV-by-tab alternative, full formula key
  for both tabs, color key, and license terms.
- `pricing-calculator-lite.csv` (free funnel download) is unchanged and still what
  `litePath` in `lib/products-data.ts` points to.
- `lib/products-data.ts` `includes[]` updated to describe the real master file (live formulas,
  dropdown, totals, SETUP.md) instead of the earlier generic description.

TODO (owner): upload `freelance-pricing-profit-calculator.xlsx` (+ SETUP.md and the
`google-sheets/` CSVs, zipped together) as the Lemon Squeezy product file for
`LS_CHECKOUT_FREELANCE_PRICING`; confirm checkout → license → download flow end to end. Then
clone the template to adjacent niches (each = new page + listing).
