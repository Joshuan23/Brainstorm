# Bookkeeper Pricing & Package Calculator — Setup

Thanks for buying the full asset. This file explains both delivery formats and
exactly how to get it running in under two minutes.

## What's in this download

- `bookkeeper-pricing-package-calculator.xlsx` — the master file. Two live-formula
  tabs (Package Pricing, Client Profitability) plus a Read Me tab. Opens natively
  in Excel, Numbers, LibreOffice Calc, and Google Sheets.
- `google-sheets/01-Package-Pricing.csv`
- `google-sheets/02-Client-Profitability.csv`
- `google-sheets/03-Read-me-Setup.csv`
- `SETUP.md` — this file.

## Fastest path: use the .xlsx directly in Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) → **File → Import → Upload**.
2. Select `bookkeeper-pricing-package-calculator.xlsx`.
3. Choose **Insert new sheet(s)**.

All three tabs, formulas, formatting, colors, and the dropdown import
natively — no re-typing needed. This is the recommended path.

## Alternative: CSV-by-tab import

If you were given (or prefer) the CSV set in `google-sheets/`, import each file
as its own tab:

1. Create a new Google Sheet.
2. For each CSV: **File → Import → Upload → select the CSV → "Insert new
   sheet(s)"**. Repeat for all three files so you end up with three tabs.
3. Formulas in these CSVs are written in plain formula syntax (e.g. `=C2*D2`)
   and in most cases **Google Sheets will interpret them as live formulas on
   import automatically**. If any cell shows the formula as literal text
   instead of a calculated number, just re-type that one formula using the
   **Formula Key** below — it takes under a minute.

## Excel / Numbers / LibreOffice

Just double-click `bookkeeper-pricing-package-calculator.xlsx`. Formulas,
conditional formatting, column widths, and the "On Target?" flag are all
embedded and work immediately — nothing to configure.

## Formula key (Package Pricing tab)

| Column | Formula | What it means |
|---|---|---|
| Labor Cost / Client (G) | `=C*D` (Hours/Client × Target Hourly Rate) | What your time alone costs at your target rate, per client |
| Overhead / Client (H) | `=E/B` (Total Monthly Overhead ÷ Clients on This Tier) | Each client's fair share of your software subscriptions (QBO, Xero, etc.), E&O insurance, and other fixed monthly costs |
| Base Cost / Client (I) | `=G+H` (Labor + Overhead) | Your full cost floor for one client on this tier |
| Recommended Monthly Package Price (J) | `=I/(1-F)` (Base Cost ÷ (1 − Margin%)) | The monthly package price that hits your target margin |
| Effective Hourly Rate (K) | `=J/C` (Price ÷ Hours/Client) | What you're really earning per hour once the package is priced |
| Profit / Client (L) | `=J-I` (Price − Base Cost) | Dollars you keep per client after labor + overhead |
| Total Monthly Profit — This Tier (M) | `=L*B` (Profit/Client × Clients on Tier) | Your total monthly profit from every client on this tier |

**Example (Starter tier):** 3 hrs/client × $50/hr = $150 labor; overhead
$400 ÷ 8 clients = $50/client; $200 base cost; ÷ (1 − 30%) = **$285.71
recommended monthly price**; effective hourly = **$95.24/hr**; profit/client
= $85.71; total monthly profit across 8 Starter clients = $685.71.

## Formula key (Client Profitability tab)

| Column | Formula | What it means |
|---|---|---|
| Effective Hourly Rate | `=Monthly Fee / Actual Monthly Hours` | What you actually earned per hour on this client this month |
| On Target? | `=IF(Effective >= Target, "On target", "Review")` | Flags any client billing below your target hourly rate |
| Totals row | `=SUM(...)` | Running total of monthly fees and hours across all clients |

Reproduce the dropdown-style values in Sheets via **Data → Data validation →
Dropdown (from a list)** if you want to convert "On Target?" from a formula
into a manual pick list — most users leave it as the live formula.

## Color key

- **Yellow cells** = your inputs. Type over these freely.
- **Blue cells** = formulas. Don't type over them directly — copy a
  fully-formatted row instead if you need more rows; the formulas will follow.

## A note on add-ons

Payroll processing and one-time catch-up/cleanup work are usually priced
separately from the recurring monthly package. Give each add-on its own row
on the Package Pricing tab (its own hours and overhead share) so it gets the
same price-to-profit check as your core packages.

## License

Single-user license. Use this template for your own bookkeeping/accounting
practice and for unlimited personal clients. You may **not** resell,
redistribute, or repost this file — or a derivative of it — as your own
template or product (in original or modified form, in bundles, or for free)
on any marketplace. One purchase = one user/business.

## Support

This template is self-serve by design — the formula key above covers every
calculated column. If numbers look wrong, check the yellow input cells first;
the blue formula cells should never be edited directly.
