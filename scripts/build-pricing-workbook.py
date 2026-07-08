#!/usr/bin/env python3
"""
Builds the paid master workbook for the "Freelance Pricing & Profit
Calculator + Client Tracker" digital product (Venture B).

Output: public/products/freelance-pricing-profit-calculator/
        freelance-pricing-profit-calculator.xlsx

Tabs:
  1. Pricing Calculator  - live formulas, 3 worked example rows
  2. Client Tracker      - live formula (balance), status dropdown, examples
  3. Read Me / Setup     - usage + licensing

Run:  python3 scripts/build-pricing-workbook.py
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
    "freelance-pricing-profit-calculator",
)
OUT_PATH = os.path.join(OUT_DIR, "freelance-pricing-profit-calculator.xlsx")

# ---------------------------------------------------------------------------
# Shared styling
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
    ws.row_dimensions[row].height = 30


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
# TAB 1 — Pricing Calculator
# =========================================================================
ws1 = wb.active
ws1.title = "Pricing Calculator"
ws1.sheet_view.showGridLines = False

style_title(ws1, "A1:J1", "Freelance Pricing & Profit Calculator")
ws1.merge_cells("A2:J2")
ws1["A2"] = (
    "Yellow cells = your inputs. Blue cells = live formulas — leave them alone "
    "and they recalculate automatically. Add new rows by copying row 8 (formulas included)."
)
ws1["A2"].font = NOTE_FONT
ws1["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1, wrap_text=True)
ws1.row_dimensions[2].height = 30

headers = [
    "Project Name",
    "Estimated Hours",
    "Target Hourly Rate ($)",
    "Direct Expenses ($)",
    "Target Profit Margin (%)",
    "Labor Cost ($)",
    "Base Cost ($)",
    "Recommended Price ($)",
    "Profit ($)",
    "Real Profit / Hour ($)",
]
HEADER_ROW = 4
for idx, h in enumerate(headers, start=1):
    ws1.cell(row=HEADER_ROW, column=idx, value=h)
style_header_row(ws1, HEADER_ROW, 1, len(headers))

examples = [
    ("Brand logo + guidelines", 20, 75, 120, 0.25),
    ("5-page marketing website", 35, 65, 250, 0.30),
    ("Monthly social media management (retainer)", 15, 50, 0, 0.35),
]

first_data_row = HEADER_ROW + 1
for i, (name, hours, rate, expenses, margin) in enumerate(examples):
    r = first_data_row + i
    ws1.cell(row=r, column=1, value=name).fill = INPUT_FILL
    ws1.cell(row=r, column=2, value=hours).fill = INPUT_FILL
    ws1.cell(row=r, column=3, value=rate).fill = INPUT_FILL
    ws1.cell(row=r, column=4, value=expenses).fill = INPUT_FILL
    ws1.cell(row=r, column=5, value=margin).fill = INPUT_FILL

    ws1.cell(row=r, column=6, value=f"=B{r}*C{r}").fill = CALC_FILL
    ws1.cell(row=r, column=7, value=f"=F{r}+D{r}").fill = CALC_FILL
    ws1.cell(row=r, column=8, value=f"=IF(E{r}>=1,\"margin must be <100%\",G{r}/(1-E{r}))").fill = CALC_FILL
    ws1.cell(row=r, column=9, value=f"=H{r}-G{r}").fill = CALC_FILL
    ws1.cell(row=r, column=10, value=f"=IF(B{r}=0,0,I{r}/B{r})").fill = CALC_FILL

    # number formats
    ws1.cell(row=r, column=3).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=4).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=5).number_format = "0%"
    for c in (6, 7, 8, 9, 10):
        ws1.cell(row=r, column=c).number_format = '"$"#,##0.00'

    box_row(ws1, r, 1, len(headers))
    for c in range(1, len(headers) + 1):
        ws1.cell(row=r, column=c).alignment = CENTER if c != 1 else LEFT
    ws1.row_dimensions[r].height = 22

# a few blank pre-formatted rows for the buyer to fill in
BLANK_ROWS = 7
last_data_row = first_data_row + len(examples) - 1
for i in range(BLANK_ROWS):
    r = last_data_row + 1 + i
    for c in (1, 2, 3, 4, 5):
        ws1.cell(row=r, column=c).fill = INPUT_FILL
    ws1.cell(row=r, column=6, value=f"=B{r}*C{r}").fill = CALC_FILL
    ws1.cell(row=r, column=7, value=f"=F{r}+D{r}").fill = CALC_FILL
    ws1.cell(row=r, column=8, value=f"=IF(E{r}>=1,\"margin must be <100%\",IF(B{r}=0,0,G{r}/(1-E{r})))").fill = CALC_FILL
    ws1.cell(row=r, column=9, value=f"=IF(H{r}=\"\",0,H{r}-G{r})").fill = CALC_FILL
    ws1.cell(row=r, column=10, value=f"=IF(B{r}=0,0,I{r}/B{r})").fill = CALC_FILL

    ws1.cell(row=r, column=3).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=4).number_format = '"$"#,##0.00'
    ws1.cell(row=r, column=5).number_format = "0%"
    for c in (6, 7, 8, 9, 10):
        ws1.cell(row=r, column=c).number_format = '"$"#,##0.00'
    box_row(ws1, r, 1, len(headers))
    for c in range(1, len(headers) + 1):
        ws1.cell(row=r, column=c).alignment = CENTER if c != 1 else LEFT
    ws1.row_dimensions[r].height = 22

set_col_widths(ws1, [30, 14, 16, 15, 16, 13, 13, 16, 12, 16])
ws1.freeze_panes = "A5"

# quick "how the math works" box below the table
notes_row = last_data_row + BLANK_ROWS + 3
ws1.cell(row=notes_row, column=1, value="How the formulas work").font = SUBHEADER_FONT
formula_notes = [
    ("Labor Cost", "= Estimated Hours × Target Hourly Rate"),
    ("Base Cost", "= Labor Cost + Direct Expenses"),
    ("Recommended Price", "= Base Cost ÷ (1 − Target Profit Margin %)"),
    ("Profit", "= Recommended Price − Base Cost"),
    ("Real Profit / Hour", "= Profit ÷ Estimated Hours  (your true hourly take, after expenses & margin)"),
]
for i, (label, formula) in enumerate(formula_notes):
    r = notes_row + 1 + i
    ws1.cell(row=r, column=1, value=label).font = Font(bold=True, size=10)
    ws1.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6)
    ws1.cell(row=r, column=2, value=formula).font = Font(size=10, color="374151")

# =========================================================================
# TAB 2 — Client Tracker
# =========================================================================
ws2 = wb.create_sheet("Client Tracker")
ws2.sheet_view.showGridLines = False

style_title(ws2, "A1:G1", "Client Tracker")
ws2.merge_cells("A2:G2")
ws2["A2"] = (
    "Yellow cells = your inputs. Balance is a live formula (Invoiced − Paid). "
    "Status has a dropdown — click any Status cell to pick a value."
)
ws2["A2"].font = NOTE_FONT
ws2["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1, wrap_text=True)
ws2.row_dimensions[2].height = 30

ct_headers = ["Client", "Project", "Status", "Invoiced ($)", "Paid ($)", "Balance ($)", "Next Action"]
CT_HEADER_ROW = 4
for idx, h in enumerate(ct_headers, start=1):
    ws2.cell(row=CT_HEADER_ROW, column=idx, value=h)
style_header_row(ws2, CT_HEADER_ROW, 1, len(ct_headers))

ct_examples = [
    ("Example Co", "Brand logo + guidelines", "In progress", 2160, 0, "Send 50% deposit invoice"),
    ("Riverside Dental", "5-page marketing website", "Invoiced", 3120, 1560, "Follow up on remaining balance"),
    ("Nora Kim (personal brand)", "Monthly social management — July", "Paid", 750, 750, "None — send August scope"),
    ("Blume Coffee Co", "Product photography day", "Not started", 0, 0, "Confirm shoot date"),
]

status_options = "Not started,Scoping,In progress,Invoiced,Paid,Overdue"
dv = DataValidation(type="list", formula1=f'"{status_options}"', allow_blank=True, showDropDown=False)
ws2.add_data_validation(dv)

ct_first_row = CT_HEADER_ROW + 1
ct_total_rows = 12  # examples + blank rows for buyer
for i in range(ct_total_rows):
    r = ct_first_row + i
    if i < len(ct_examples):
        client, project, status, invoiced, paid, next_action = ct_examples[i]
    else:
        client, project, status, invoiced, paid, next_action = ("", "", "", 0, 0, "")

    ws2.cell(row=r, column=1, value=client).fill = INPUT_FILL
    ws2.cell(row=r, column=2, value=project).fill = INPUT_FILL
    status_cell = ws2.cell(row=r, column=3, value=status)
    status_cell.fill = INPUT_FILL
    dv.add(status_cell)
    ws2.cell(row=r, column=4, value=invoiced).fill = INPUT_FILL
    ws2.cell(row=r, column=5, value=paid).fill = INPUT_FILL
    ws2.cell(row=r, column=6, value=f"=D{r}-E{r}").fill = CALC_FILL
    ws2.cell(row=r, column=7, value=next_action).fill = INPUT_FILL

    ws2.cell(row=r, column=4).number_format = '"$"#,##0.00'
    ws2.cell(row=r, column=5).number_format = '"$"#,##0.00'
    ws2.cell(row=r, column=6).number_format = '"$"#,##0.00'

    box_row(ws2, r, 1, len(ct_headers))
    for c in range(1, len(ct_headers) + 1):
        ws2.cell(row=r, column=c).alignment = LEFT if c in (1, 2, 7) else CENTER
    ws2.row_dimensions[r].height = 24

# totals row
tot_row = ct_first_row + ct_total_rows
ws2.cell(row=tot_row, column=3, value="TOTAL").font = Font(bold=True)
ws2.cell(row=tot_row, column=3).alignment = Alignment(horizontal="right")
ws2.cell(row=tot_row, column=4, value=f"=SUM(D{ct_first_row}:D{tot_row-1})").number_format = '"$"#,##0.00'
ws2.cell(row=tot_row, column=5, value=f"=SUM(E{ct_first_row}:E{tot_row-1})").number_format = '"$"#,##0.00'
ws2.cell(row=tot_row, column=6, value=f"=SUM(F{ct_first_row}:F{tot_row-1})").number_format = '"$"#,##0.00'
for c in (3, 4, 5, 6):
    ws2.cell(row=tot_row, column=c).font = Font(bold=True)
    ws2.cell(row=tot_row, column=c).fill = SUBHEADER_FILL
    ws2.cell(row=tot_row, column=c).border = BOX

set_col_widths(ws2, [22, 30, 14, 14, 12, 14, 30])
ws2.freeze_panes = "A5"

# =========================================================================
# TAB 3 — Read Me / Setup
# =========================================================================
ws3 = wb.create_sheet("Read me - Setup")
ws3.sheet_view.showGridLines = False
set_col_widths(ws3, [95])

style_title(ws3, "A1:A1", "Freelance Pricing & Profit Calculator + Client Tracker", height=32)

content_blocks = [
    ("HOW TO USE", "header"),
    (
        "1. Open the 'Pricing Calculator' tab. For each project, fill in the five yellow "
        "input cells: project name, estimated hours, your target hourly rate, direct "
        "expenses (software, stock assets, subcontractors), and your target profit margin. "
        "The blue cells recalculate automatically.",
        "body",
    ),
    (
        "2. Look at 'Real Profit / Hour' before you send the quote. If it's lower than your "
        "target rate, raise the price or the margin — don't just hope the project runs fast.",
        "body",
    ),
    (
        "3. Once you win the work, log the client and project on the 'Client Tracker' tab. "
        "Update Status from the dropdown and fill in Invoiced / Paid as money moves — "
        "Balance updates itself.",
        "body",
    ),
    (
        "4. Need more rows? Select a fully-formatted row (formulas included), right-click "
        "the row number, choose 'Insert Copied Cells' (Excel) or 'Insert row above/below then "
        "paste' (Sheets), and the formulas will carry down automatically.",
        "body",
    ),
    ("", "spacer"),
    ("GOOGLE SHEETS", "header"),
    (
        "Two ways to use this in Google Sheets:\n"
        "  A) Open Google Sheets -> File -> Import -> Upload -> select this .xlsx file -> "
        "'Insert new sheet(s)'. All formulas and formatting carry over natively.\n"
        "  B) If you were given the CSV set (google-sheets/ folder), import each CSV as its "
        "own tab and re-enter the formulas listed in SETUP.md — the formula key matches the "
        "'How the formulas work' box on the Pricing Calculator tab.",
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
        "Single-user license. You may use this template for your own freelance business and "
        "for unlimited personal projects/clients. You may NOT resell, redistribute, or repost "
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
