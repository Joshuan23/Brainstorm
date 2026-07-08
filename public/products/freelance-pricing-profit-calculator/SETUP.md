# Freelance Pricing & Profit Calculator + Client Tracker — Setup

Thanks for buying the full asset. This file explains both delivery formats and
exactly how to get it running in under two minutes.

## What's in this download

- `freelance-pricing-profit-calculator.xlsx` — the master file. Two live-formula
  tabs (Pricing Calculator, Client Tracker) plus a Read Me tab. Opens natively in
  Excel, Numbers, LibreOffice Calc, and Google Sheets.
- `google-sheets/01-Pricing-Calculator.csv`
- `google-sheets/02-Client-Tracker.csv`
- `google-sheets/03-Read-me-Setup.csv`
- `SETUP.md` — this file.

## Fastest path: use the .xlsx directly in Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) → **File → Import → Upload**.
2. Select `freelance-pricing-profit-calculator.xlsx`.
3. Choose **Insert new sheet(s)**.

All three tabs, formulas, formatting, colors, and the Status dropdown import
natively — no re-typing needed. This is the recommended path.

## Alternative: CSV-by-tab import

If you were given (or prefer) the CSV set in `google-sheets/`, import each file
as its own tab:

1. Create a new Google Sheet.
2. For each CSV: **File → Import → Upload → select the CSV → "Insert new
   sheet(s)"**. Repeat for all three files so you end up with three tabs.
3. Formulas in these CSVs are written in plain formula syntax (e.g. `=B2*C2`)
   and in most cases **Google Sheets will interpret them as live formulas on
   import automatically**. If any cell shows the formula as literal text
   instead of a calculated number, just re-type that one formula using the
   **Formula Key** below — it takes under a minute.

## Excel / Numbers / LibreOffice

Just double-click `freelance-pricing-profit-calculator.xlsx`. Formulas,
conditional formatting, column widths, and the Status dropdown (data
validation) are all embedded and work immediately — nothing to configure.

## Formula key (Pricing Calculator tab)

| Column | Formula | What it means |
|---|---|---|
| Labor Cost (F) | `=B*C` (Hours × Rate) | What your time alone costs at your target rate |
| Base Cost (G) | `=F+D` (Labor + Expenses) | Your full cost floor for the project |
| Recommended Price (H) | `=G/(1-E)` (Base Cost ÷ (1 − Margin%)) | The price that hits your target margin |
| Profit (I) | `=H-G` (Price − Base Cost) | Dollars you keep after costs |
| Real Profit / Hour (J) | `=I/B` (Profit ÷ Hours) | Your true hourly take-home — compare this to your target rate before you send the quote |

**Example (row 1):** 20 hrs × $75/hr = $1,500 labor; + $120 expenses = $1,620
base cost; ÷ (1 − 25%) = **$2,160 recommended price**; profit = $540; real
profit/hour = **$27/hr**.

## Formula key (Client Tracker tab)

| Column | Formula | What it means |
|---|---|---|
| Balance | `=Invoiced - Paid` | Outstanding amount owed by the client |
| Totals row | `=SUM(...)` per column | Running total across all clients/projects |

Status is a dropdown with six values: Not started, Scoping, In progress,
Invoiced, Paid, Overdue. In Sheets, reproduce it via **Data → Data
validation → Dropdown (from a list)** if it didn't come through on import.

## Color key

- **Yellow cells** = your inputs. Type over these freely.
- **Blue cells** = formulas. Don't type over them directly — copy a
  fully-formatted row instead if you need more rows; the formulas will follow.

## License

Single-user license. Use this template for your own freelance business and
for unlimited personal projects/clients. You may **not** resell,
redistribute, or repost this file — or a derivative of it — as your own
template or product (in original or modified form, in bundles, or for free)
on any marketplace. One purchase = one user/business.

## Support

This template is self-serve by design — the formula key above covers every
calculated column. If numbers look wrong, check the yellow input cells first;
the blue formula cells should never be edited directly.
