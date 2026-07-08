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

## 2026-07-08 — second product (product-maker)
- **Bookkeeper Pricing & Package Calculator** — `/products/bookkeeper-pricing-package-calculator`
  - Audience: bookkeepers, virtual bookkeepers, small accounting/tax practices selling monthly
    packages.
  - Target query: "bookkeeper pricing calculator".
  - Price: $29, one-time, instant download via Lemon Squeezy.
  - Same mechanic as product #1 (inputs → live-formula outputs), adapted for monthly package
    pricing: overhead allocation (software subscriptions, E&O insurance) spread across clients
    per tier, plus per-client profitability with an On Target?/Review flag to catch scope creep
    before renewal.
  - Pain solved: bookkeepers price monthly packages by gut feel and don't account for overhead
    (software, insurance) or check whether a client's actual hours are eating the margin, so
    packages quietly become unprofitable over time.
  - Generator script (reproducible): `scripts/build-bookkeeper-workbook.py` (Python + openpyxl,
    mirrors `build-pricing-workbook.py`'s styling/structure).
  - **Paid master — upload this to Lemon Squeezy as the product file:**
    `public/products/bookkeeper-pricing-package-calculator/bookkeeper-pricing-package-calculator.xlsx`
    - Tab 1 "Package Pricing": 6 yellow inputs per row (package tier, clients on tier, monthly
      hours/client, target hourly rate, total monthly overhead, target margin%); blue formula
      cells compute Labor Cost/Client, Overhead/Client (overhead ÷ clients on tier), Base
      Cost/Client, Recommended Monthly Package Price, Effective Hourly Rate, Profit/Client, and
      Total Monthly Profit for the tier. 3 worked example tiers (Starter/Growth/Pro with
      payroll+catch-up add-on framing) + 6 pre-formatted blank rows; formula-key notes box below
      the table.
    - Tab 2 "Client Profitability": Client, Package Tier, Monthly Fee, Actual Monthly Hours,
      Effective Hourly Rate (live formula = Fee ÷ Hours), Target Hourly Rate, On Target?/Review
      flag (live formula), Notes/Action; 3 worked examples + 8 blank rows + totals row.
    - Tab 3 "Read me - Setup": how to use, overhead-allocation explanation, guidance on pricing
      payroll/catch-up cleanup add-ons separately, Google Sheets import note, color key,
      single-user license, support policy.
    - Verified: workbook loads via openpyxl (3 sheets present, formulas intact), and all example
      outputs (Starter: $285.71 price / $95.24 effective hourly / $685.71 total tier profit;
      Growth: $602.94 / $100.49 / $964.71; Pro: $1,128.21 / $112.82 / $1,184.62) were
      independently recomputed in Python and match the encoded formula logic exactly. Client
      Profitability effective-rate examples (81.63, 109.63, 102.56) also verified by hand.
  - **Google Sheets CSV set** (fallback / alternate import path) —
    `public/products/bookkeeper-pricing-package-calculator/google-sheets/`:
    `01-Package-Pricing.csv`, `02-Client-Profitability.csv`, `03-Read-me-Setup.csv`. Formulas
    are written in-cell (e.g. `=C2*D2`) so Sheets imports them as live formulas in most cases; a
    full formula key is provided as a manual fallback.
  - **Setup guide**: `public/products/bookkeeper-pricing-package-calculator/SETUP.md` —
    fastest-path instructions (import the .xlsx directly into Sheets), CSV-by-tab alternative,
    full formula key for both tabs, add-on pricing note, color key, and license terms.
  - **Free lite preview** (funnel driver, matches `litePath` in `lib/products-data.ts`):
    `public/products/bookkeeper-pricing-package-calculator/bookkeeper-pricing-lite.csv` — single
    worked Starter-tier example with the formula key spelled out as plain text (not live
    formulas), same pattern as product #1's lite file.
  - `lib/products-data.ts`: added the `bookkeeper-pricing-package-calculator` entry to
    `PRODUCTS` (name, tagline, targetQuery, price $29/priceValue 29, audience, intro, includes,
    faqs, litePath, `checkoutEnv: "LS_CHECKOUT_BOOKKEEPER_PRICING"`). Existing
    `freelance-pricing-profit-calculator` entry left untouched. The product page and checkout
    route are both driven dynamically off this array (`app/products/[slug]/page.tsx`,
    `app/api/products/checkout/route.ts`), so no page/route files were added or touched.

TODO (owner): upload `bookkeeper-pricing-package-calculator.xlsx` (+ SETUP.md and the
`google-sheets/` CSVs, zipped together) as the Lemon Squeezy product file, set
`LS_CHECKOUT_BOOKKEEPER_PRICING` to the resulting checkout URL, and confirm the $29 price in
Lemon Squeezy matches `priceValue` in `lib/products-data.ts`. Then run the checkout → license →
download flow end to end (same as the TODO left for product #1). Also add
`LS_CHECKOUT_BOOKKEEPER_PRICING` to `DEPLOY.md`'s env var table/checklist (out of scope for this
change — `DEPLOY.md` was intentionally not touched).
