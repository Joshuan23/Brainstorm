#!/usr/bin/env python3
"""
Builds the paid master workbook for the "Bookkeeper Pricing & Package
Calculator" digital product (Venture B).

Output: public/products/bookkeeper-pricing-package-calculator/
        bookkeeper-pricing-package-calculator.xlsx

Tabs:
  1. Package Pricing        - live formulas, 3 worked example package tiers
  2. Client Profitability   - live formula (effective hourly rate), 3 worked
                               example clients + blank rows
  3. Read me / Setup        - usage + licensing

Run:  python3 scripts/build-bookkeeper-workbook.py
Requires: openpyxl  (pip install openpyxl)
"""

import os

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "products",
    "bookkeeper-pricing-package-calculator",
)
OUT_PATH = os.path.join(OUT_DIR, "bookkeeper-pricing-package-calculator.xlsx")

# ---------------------------------------------------------------------------
# Shared styling (matches freelance-pricing-profit-calculator for brand
# consistency across the catalog)
# ---------------------------------------------------------------------------

BRAND_DARK = "1F2937"      # slate-800
BRAND_ACCENT = "2563EB"    # blue-600
HEADER_FILL = PatternFill("solid", fgColor=BRAND_DARK)
SUBHEADER_FILL = PatternFill("solid", fgColor="E5E7EB")  # gray-200
INPUT_FILL = PatternFill("solid", fgColor="FEF9C3")      # pale yellow = editable
CALC_FILL = PatternFill("solid", fgColor="DBEAFE")       # pale blue = formula/output
TITLE_FONT = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
SUBHEADER_FONT = Font(name="Calibri", size=11, bold=True, color=BRAND_DARK)
NOTE_FONT = Font(name="Calibri", size=10, italic=True, color="6B7280")
BODY_FONT = Font(name="Calibri", size=11)
THIN = Side(style="thin", color="D1D5DB")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)


def style_title(ws, cell_range, text, height=28):
    ws.merge_cells(cell_range)
    top_left = cell_range.split(":")[0]
    ws[top_left] = text
    ws[top_left].font = TITLE_FONT
    ws[top_left].fill = HEADER_FILL
    ws[top_left].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[int("".join(filter(str.isdigit, top_left)))].height = height


def style_header_row(ws, row, first_col, last_col):
    for c in range(first_col, last_col + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = CENTER
        cell.border = BOX
    ws.row_dimensions[row].height = 34


def set_col_widths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w


def box_row(ws, row, first_col, last_col):
    for c in range(first_col, last_col + 1):
        ws.cell(row=row, column=c).border = BOX


# ---------------------------------------------------------------------------
# Workbook
# ---------------------------------------------------------------------------

wb = Workbook()

# =========================================================================
# TAB 1 — Package Pricing
# =========================================================================
ws1 = wb.active
ws1.title = "Package Pricing"
ws1.sheet_view.showGridLines = False

style_title(ws1, "A1:M1", "Bookkeeper Pricing & Package Calculator")
ws1.merge_cells("A2:M2")
ws1["A2"] = (
    "Yellow cells = your inputs. Blue cells = live formulas — leave them alone "
    "and they recalculate automatically. Add new tiers by copying row 8 (formulas included)."
)
ws1["A2"].font = NOTE_FONT
ws1["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1, wrap_text=True)
ws1.row_dimensions[2].height = 30

headers = [
    "Package Tier",
    "Clients on This Tier",
    "Monthly Hours / Client",
    "Target Hourly Rate ($)",
    "Total Monthly Overhead ($)",
    "Target Profit Margin (%)",
    "Labor Cost / Client ($)",
    "Overhead / Client ($)",
    "Base Cost / Client ($)",
    "Recommended Monthly Package Price ($)",
    "Effective Hourly Rate ($)",
    "Profit / Client ($)",
    "Total Monthly Profit — This Tier ($)",
]
HEADER_ROW = 4
for idx, h in enumerate(headers, start=1):
    ws1.cell(row=HEADER_ROW, column=idx, value=h)
style_header_row(ws1, HEADER_ROW, 1, len(headers))

# (tier, clients, hours/client, target rate, total monthly overhead, margin)
examples = [
    ("Starter (up to 50 tx/mo, monthly bookkeeping)", 8, 3, 50, 400, 0.30),
    ("Growth (up to 150 tx/mo, monthly bookkeeping + reconciliations)", 5, 6, 55, 400, 0.32),
    ("Pro (payroll + catch-up cleanup add-ons)", 3, 10, 60, 400, 0.35),
]

first_data_row = HEADER_ROW + 1
for i, (tier, clients, hours, rate, overhead, margin) in enumerate(examples):
    r = first_data_row + i
    ws1.cell(row=r, column=1, value=tier).fill = INPUT_FILL
    ws1.cell(row=r, column=2, value=clients).fill = INPUT_FILL
    ws1.cell(row=r, column=3, value=hours).fill = INPUT_FILL
    ws1.cell(row=r, column=4, value=rate).fill = INPUT_FILL
    ws1.cell(row=r, column=5, value=overhead).fill = INPUT_FILL
    ws1.cell(row=r, column=6, value=margin).fill = INPUT_FILL

    ws1.cell(row=r, column=7, value=f"=C{r}*D{r}").fill = CALC_FILL
    ws1.cell(row=r, column=8, value=f"=IF(B{r}=0,0,E{r}/B{r})").fill = CALC_FILL
    ws1.cell(row=r, column=9, value=f"=G{r}+H{r}").fill = CALC_FILL
    ws1.cell(
        row=r, column=10,
        value=f"=IF(F{r}>=1,\"margin must be <100%\",I{r}/(1-F{r}))",
    ).fill = CALC_FILL
    ws1.cell(
        row=r, column=11,
        value=f"=IF(OR(C{r}=0,F{r}>=1),0,I{r}/(1-F{r})/C{r})",
    ).fill = CALC_FILL
    ws1.cell(
        row=r, column=12,
        value=f"=IF(F{r}>=1,0,I{r}/(1-F{r})-I{r})",
    ).fill = CALC_FILL
    ws1.cell(row=r, column=13, value=f"=L{r}*B{r}").fill = CALC_FILL

    ws1.cell(row=r, column=4).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=5).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=6).number_format = "0%"
    for c in (7, 8, 9, 10, 11, 12, 13):
        ws1.cell(row=r, column=c).number_format = '"$"#,##0.00'

    box_row(ws1, r, 1, len(headers))
    for c in range(1, len(headers) + 1):
        ws1.cell(row=r, column=c).alignment = CENTER if c != 1 else LEFT
    ws1.row_dimensions[r].height = 24

# a few blank pre-formatted rows for the buyer to fill in
BLANK_ROWS = 6
last_data_row = first_data_row + len(examples) - 1
for i in range(BLANK_ROWS):
    r = last_data_row + 1 + i
    for c in (1, 2, 3, 4, 5, 6):
        ws1.cell(row=r, column=c).fill = INPUT_FILL

    ws1.cell(row=r, column=7, value=f"=C{r}*D{r}").fill = CALC_FILL
    ws1.cell(row=r, column=8, value=f"=IF(B{r}=0,0,E{r}/B{r})").fill = CALC_FILL
    ws1.cell(row=r, column=9, value=f"=G{r}+H{r}").fill = CALC_FILL
    ws1.cell(
        row=r, column=10,
        value=f"=IF(F{r}>=1,\"margin must be <100%\",I{r}/(1-F{r}))",
    ).fill = CALC_FILL
    ws1.cell(
        row=r, column=11,
        value=f"=IF(OR(C{r}=0,F{r}>=1),0,I{r}/(1-F{r})/C{r})",
    ).fill = CALC_FILL
    ws1.cell(
        row=r, column=12,
        value=f"=IF(F{r}>=1,0,I{r}/(1-F{r})-I{r})",
    ).fill = CALC_FILL
    ws1.cell(row=r, column=13, value=f"=L{r}*B{r}").fill = CALC_FILL

    ws1.cell(row=r, column=4).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=5).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=6).number_format = "0%"
    for c in (7, 8, 9, 10, 11, 12, 13):
        ws1.cell(row=r, column=c).number_format = '"$"#,##0.00'
    box_row(ws1, r, 1, len(headers))
    for c in range(1, len(headers) + 1):
        ws1.cell(row=r, column=c).alignment = CENTER if c != 1 else LEFT
    ws1.row_dimensions[r].height = 24

set_col_widths(ws1, [30, 14, 15, 14, 16, 14, 14, 13, 13, 20, 15, 13, 20])
ws1.freeze_panes = "A5"

# quick "how the math works" box below the table
notes_row = last_data_row + BLANK_ROWS + 3
ws1.cell(row=notes_row, column=1, value="How the formulas work").font = SUBHEADER_FONT
formula_notes = [
    ("Labor Cost / Client", "= Monthly Hours per Client x Target Hourly Rate"),
    (
        "Overhead / Client",
        "= Total Monthly Overhead (software subscriptions, E&O insurance, etc.) / Clients on This Tier",
    ),
    ("Base Cost / Client", "= Labor Cost / Client + Overhead / Client"),
    ("Recommended Monthly Package Price", "= Base Cost / Client / (1 - Target Profit Margin %)"),
    ("Effective Hourly Rate", "= Recommended Monthly Package Price / Monthly Hours per Client"),
    ("Profit / Client", "= Recommended Monthly Package Price - Base Cost / Client"),
    ("Total Monthly Profit - This Tier", "= Profit / Client x Clients on This Tier"),
]
for i, (label, formula) in enumerate(formula_notes):
    r = notes_row + 1 + i
    ws1.cell(row=r, column=1, value=label).font = Font(bold=True, size=10)
    ws1.merge_cells(start_row=r, start_column=2, end_row=r, end_column=8)
    ws1.cell(row=r, column=2, value=formula).font = Font(size=10, color="374151")

# =========================================================================
# TAB 2 — Client Profitability
# =========================================================================
ws2 = wb.create_sheet("Client Profitability")
ws2.sheet_view.showGridLines = False

style_title(ws2, "A1:H1", "Client Profitability")
ws2.merge_cells("A2:H2")
ws2["A2"] = (
    "Yellow cells = your inputs. Effective Hourly Rate is a live formula "
    "(Monthly Fee / Actual Monthly Hours). Compare it to Target Hourly Rate to spot "
    "underpriced clients before renewal."
)
ws2["A2"].font = NOTE_FONT
ws2["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1, wrap_text=True)
ws2.row_dimensions[2].height = 30

cp_headers = [
    "Client",
    "Package Tier",
    "Monthly Fee ($)",
    "Actual Monthly Hours",
    "Effective Hourly Rate ($)",
    "Target Hourly Rate ($)",
    "On Target?",
    "Notes / Action",
]
CP_HEADER_ROW = 4
for idx, h in enumerate(cp_headers, start=1):
    ws2.cell(row=CP_HEADER_ROW, column=idx, value=h)
style_header_row(ws2, CP_HEADER_ROW, 1, len(cp_headers))

# (client, package tier, monthly fee, actual hours, target hourly rate, notes)
cp_examples = [
    ("Larkspur Landscaping LLC", "Starter", 285.71, 3.5, 95.24, "Taking longer than planned — review scope or move to Growth"),
    ("Nguyen Family Dental", "Growth", 602.94, 5.5, 100.49, "Running efficient — good renewal candidate"),
    ("Cedar & Stone Woodworks", "Pro", 1128.21, 11, 112.82, "Slightly under target — confirm payroll add-on is billed separately"),
]

status_options = "On target,Review,Renegotiate"
dv = DataValidation(type="list", formula1=f'"{status_options}"', allow_blank=True, showDropDown=False)
ws2.add_data_validation(dv)

cp_first_row = CP_HEADER_ROW + 1
cp_total_rows = 11  # examples + blank rows for buyer
for i in range(cp_total_rows):
    r = cp_first_row + i
    if i < len(cp_examples):
        client, tier, fee, hours, target_rate, notes = cp_examples[i]
    else:
        client, tier, fee, hours, target_rate, notes = ("", "", 0, 0, 0, "")

    ws2.cell(row=r, column=1, value=client).fill = INPUT_FILL
    ws2.cell(row=r, column=2, value=tier).fill = INPUT_FILL
    ws2.cell(row=r, column=3, value=fee).fill = INPUT_FILL
    ws2.cell(row=r, column=4, value=hours).fill = INPUT_FILL
    ws2.cell(row=r, column=5, value=f"=IF(D{r}=0,0,C{r}/D{r})").fill = CALC_FILL
    ws2.cell(row=r, column=6, value=target_rate).fill = INPUT_FILL
    status_cell = ws2.cell(
        row=r, column=7,
        value=f"=IF(D{r}=0,\"\",IF(E{r}>=F{r},\"On target\",\"Review\"))",
    )
    status_cell.fill = CALC_FILL
    ws2.cell(row=r, column=8, value=notes).fill = INPUT_FILL

    ws2.cell(row=r, column=3).number_format = '"$"#,##0.00'
    ws2.cell(row=r, column=5).number_format = '"$"#,##0.00'
    ws2.cell(row=r, column=6).number_format = '"$"#,##0.00'

    box_row(ws2, r, 1, len(cp_headers))
    for c in range(1, len(cp_headers) + 1):
        ws2.cell(row=r, column=c).alignment = LEFT if c in (1, 2, 8) else CENTER
    ws2.row_dimensions[r].height = 26

# totals row
tot_row = cp_first_row + cp_total_rows
ws2.cell(row=tot_row, column=2, value="TOTAL MONTHLY FEES").font = Font(bold=True)
ws2.cell(row=tot_row, column=2).alignment = Alignment(horizontal="right")
ws2.cell(row=tot_row, column=3, value=f"=SUM(C{cp_first_row}:C{tot_row-1})").number_format = '"$"#,##0.00'
ws2.cell(row=tot_row, column=4, value=f"=SUM(D{cp_first_row}:D{tot_row-1})")
for c in (2, 3, 4):
    ws2.cell(row=tot_row, column=c).font = Font(bold=True)
    ws2.cell(row=tot_row, column=c).fill = SUBHEADER_FILL
    ws2.cell(row=tot_row, column=c).border = BOX

set_col_widths(ws2, [26, 14, 15, 16, 18, 16, 13, 38])
ws2.freeze_panes = "A5"

# =========================================================================
# TAB 3 — Read Me / Setup
# =========================================================================
ws3 = wb.create_sheet("Read me - Setup")
ws3.sheet_view.showGridLines = False
set_col_widths(ws3, [95])

style_title(ws3, "A1:A1", "Bookkeeper Pricing & Package Calculator", height=32)

content_blocks = [
    ("HOW TO USE", "header"),
    (
        "1. Open the 'Package Pricing' tab. For each package tier you offer (e.g. Starter, "
        "Growth, Pro / payroll add-on), fill in the six yellow input cells: tier name, how many "
        "current clients sit on that tier, average monthly hours per client, your target hourly "
        "rate, your total monthly business overhead (bookkeeping/accounting software subscriptions "
        "like QBO or Xero, E&O insurance, other fixed costs), and your target profit margin. The "
        "blue cells recalculate automatically.",
        "body",
    ),
    (
        "2. 'Overhead / Client' spreads your total monthly overhead evenly across the clients on "
        "that tier, so each package price actually covers its share of software and insurance "
        "costs — not just your labor.",
        "body",
    ),
    (
        "3. Check 'Effective Hourly Rate' before you quote a new client. If it's lower than your "
        "target hourly rate, raise the package price, tighten the scope, or move the client to a "
        "higher tier.",
        "body",
    ),
    (
        "4. Once a client is live, log them on the 'Client Profitability' tab: their package, "
        "monthly fee, and actual hours worked that month. 'Effective Hourly Rate' updates itself, "
        "and 'On Target?' flags anyone billing below your target rate — a fast way to catch "
        "scope creep before your next renewal.",
        "body",
    ),
    (
        "5. Need more rows? Select a fully-formatted row (formulas included), right-click the row "
        "number, choose 'Insert Copied Cells' (Excel) or 'Insert row above/below then paste' "
        "(Sheets), and the formulas will carry down automatically.",
        "body",
    ),
    ("", "spacer"),
    ("A NOTE ON ADD-ONS", "header"),
    (
        "Payroll processing and one-time catch-up/cleanup work are usually priced separately from "
        "the recurring monthly package. The easiest approach: give each add-on its own row on the "
        "'Package Pricing' tab (e.g. 'Payroll add-on (1-5 employees)' or 'Catch-up cleanup — one-time') "
        "with its own hours and overhead share, so it gets the same rigorous price-to-profit check "
        "as your core monthly packages.",
        "body",
    ),
    ("", "spacer"),
    ("GOOGLE SHEETS", "header"),
    (
        "Two ways to use this in Google Sheets:\n"
        "  A) Open Google Sheets -> File -> Import -> Upload -> select this .xlsx file -> "
        "'Insert new sheet(s)'. All formulas and formatting carry over natively.\n"
        "  B) If you were given the CSV set (google-sheets/ folder), import each CSV as its own "
        "tab and re-enter the formulas listed in SETUP.md — the formula key matches the "
        "'How the formulas work' box on the Package Pricing tab.",
        "body",
    ),
    ("", "spacer"),
    ("EXCEL / NUMBERS", "header"),
    (
        "Just double-click the .xlsx file. It opens natively in Excel, LibreOffice Calc, and "
        "Apple Numbers with formulas intact.",
        "body",
    ),
    ("", "spacer"),
    ("COLOR KEY", "header"),
    ("Yellow cells = type your own numbers/text here.", "body"),
    ("Blue cells = formulas. Don't type over these — copy the row instead if you need more.", "body"),
    ("", "spacer"),
    ("LICENSE", "header"),
    (
        "Single-user license. You may use this template for your own bookkeeping/accounting "
        "practice and for unlimited personal clients. You may NOT resell, redistribute, or repost "
        "this file (or a derivative of it) as your own template or product, in original or "
        "modified form, on marketplaces, in bundles, or for free. One purchase = one user/business.",
        "body",
    ),
    ("", "spacer"),
    ("QUESTIONS", "header"),
    (
        "This template is self-serve by design — the formula key and instructions above cover "
        "every column. If something still doesn't add up, re-check the yellow input cells first; "
        "the blue formula cells should never be edited directly.",
        "body",
    ),
]

r = 3
for text, kind in content_blocks:
    if kind == "spacer":
        ws3.row_dimensions[r].height = 10
        r += 1
        continue
    cell = ws3.cell(row=r, column=1, value=text)
    if kind == "header":
        cell.font = Font(bold=True, size=12, color=BRAND_ACCENT)
        ws3.row_dimensions[r].height = 22
    else:
        cell.font = BODY_FONT
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        # rough height estimate based on text length
        lines = max(1, (len(text) // 95) + text.count("\n") + 1)
        ws3.row_dimensions[r].height = 15 * lines
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

# =========================================================================
os.makedirs(OUT_DIR, exist_ok=True)
wb.save(OUT_PATH)
print(f"Wrote {OUT_PATH}")
