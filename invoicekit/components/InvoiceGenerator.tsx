"use client";

import { useEffect, useMemo, useState } from "react";
import { CURRENCIES } from "@/lib/site";

interface LineItem {
  description: string;
  qty: string;
  rate: string;
}

export interface InvoicePreset {
  fromLabel?: string;
  items?: { description: string; qty: number; rate: number }[];
  notes?: string;
}

interface InvoiceState {
  from: string;
  fromDetails: string;
  to: string;
  toDetails: string;
  number: string;
  date: string;
  due: string;
  currency: string;
  taxPct: string;
  discount: string;
  items: LineItem[];
  notes: string;
}

const STORAGE_KEY = "invoicekit-draft-v1";

function today(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function blankState(): InvoiceState {
  return {
    from: "",
    fromDetails: "",
    to: "",
    toDetails: "",
    number: "INV-001",
    date: today(),
    due: today(14),
    currency: "USD",
    taxPct: "0",
    discount: "0",
    items: [{ description: "", qty: "1", rate: "0" }],
    notes: "Thank you for your business.",
  };
}

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export default function InvoiceGenerator({ preset }: { preset?: InvoicePreset }) {
  const [inv, setInv] = useState<InvoiceState>(blankState);
  const [loaded, setLoaded] = useState(false);

  // Restore draft, then let a preset override the line items (a visitor arriving
  // from a template page expects to see that template, not last week's draft).
  useEffect(() => {
    let restored = blankState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = { ...restored, ...JSON.parse(raw) };
    } catch {
      /* corrupt draft — start fresh */
    }
    if (preset?.items?.length) {
      restored.items = preset.items.map((i) => ({
        description: i.description,
        qty: String(i.qty),
        rate: String(i.rate),
      }));
      if (preset.notes) restored.notes = preset.notes;
    }
    setInv(restored);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inv));
    } catch {
      /* storage full/blocked — preview still works */
    }
  }, [inv, loaded]);

  const set = (patch: Partial<InvoiceState>) => setInv((s) => ({ ...s, ...patch }));

  const setItem = (idx: number, patch: Partial<LineItem>) =>
    setInv((s) => ({
      ...s,
      items: s.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));

  const addItem = () =>
    setInv((s) => ({ ...s, items: [...s.items, { description: "", qty: "1", rate: "0" }] }));

  const removeItem = (idx: number) =>
    setInv((s) => ({
      ...s,
      items: s.items.length > 1 ? s.items.filter((_, i) => i !== idx) : s.items,
    }));

  const symbol = CURRENCIES.find((c) => c.code === inv.currency)?.symbol ?? "$";
  const fmt = (n: number) =>
    `${symbol}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totals = useMemo(() => {
    const subtotal = inv.items.reduce((sum, it) => sum + num(it.qty) * num(it.rate), 0);
    const discount = Math.min(num(inv.discount), subtotal);
    const tax = ((subtotal - discount) * num(inv.taxPct)) / 100;
    return { subtotal, discount, tax, total: subtotal - discount + tax };
  }, [inv.items, inv.discount, inv.taxPct]);

  return (
    <div className="gen-layout">
      <form className="gen-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Your business</h2>
        <div className="field">
          <label htmlFor="from">Business / your name</label>
          <input id="from" value={inv.from} placeholder="Jane Doe Photography"
            onChange={(e) => set({ from: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="fromDetails">Address, email, phone</label>
          <textarea id="fromDetails" value={inv.fromDetails}
            placeholder={"123 Main St\njane@example.com"}
            onChange={(e) => set({ fromDetails: e.target.value })} />
        </div>

        <h2>Bill to</h2>
        <div className="field">
          <label htmlFor="to">Client name</label>
          <input id="to" value={inv.to} placeholder="Acme Co."
            onChange={(e) => set({ to: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="toDetails">Client details</label>
          <textarea id="toDetails" value={inv.toDetails}
            placeholder={"456 Oak Ave\nbilling@acme.com"}
            onChange={(e) => set({ toDetails: e.target.value })} />
        </div>

        <h2>Invoice details</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="number">Invoice #</label>
            <input id="number" value={inv.number} onChange={(e) => set({ number: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <select id="currency" value={inv.currency} onChange={(e) => set({ currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Invoice date</label>
            <input id="date" type="date" value={inv.date} onChange={(e) => set({ date: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="due">Due date</label>
            <input id="due" type="date" value={inv.due} onChange={(e) => set({ due: e.target.value })} />
          </div>
        </div>

        <h2>Line items</h2>
        {inv.items.map((it, i) => (
          <div className="item-row" key={i}>
            <input aria-label="Item description" placeholder="Description" value={it.description}
              onChange={(e) => setItem(i, { description: e.target.value })} />
            <input aria-label="Quantity" type="number" min="0" step="any" value={it.qty}
              onChange={(e) => setItem(i, { qty: e.target.value })} />
            <input aria-label="Rate" type="number" min="0" step="any" value={it.rate}
              onChange={(e) => setItem(i, { rate: e.target.value })} />
            <button type="button" className="item-remove" aria-label="Remove item"
              onClick={() => removeItem(i)}>×</button>
          </div>
        ))}
        <button type="button" className="add-item" onClick={addItem}>+ Add line item</button>

        <div className="field-row" style={{ marginTop: 12 }}>
          <div className="field">
            <label htmlFor="taxPct">Tax %</label>
            <input id="taxPct" type="number" min="0" step="any" value={inv.taxPct}
              onChange={(e) => set({ taxPct: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="discount">Discount ({symbol})</label>
            <input id="discount" type="number" min="0" step="any" value={inv.discount}
              onChange={(e) => set({ discount: e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes">Notes / payment terms</label>
          <textarea id="notes" value={inv.notes} onChange={(e) => set({ notes: e.target.value })} />
        </div>

        <div className="gen-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Download PDF / Print
          </button>
          <button type="button" className="btn btn-ghost"
            onClick={() => { setInv(blankState()); try { localStorage.removeItem(STORAGE_KEY); } catch {} }}>
            Clear
          </button>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginTop: 10 }}>
          Your invoice never leaves this browser — drafts are saved locally on your device only.
        </p>
      </form>

      <div className="invoice-paper" id="invoice-preview">
        <div className="inv-top">
          <div>
            <div className="inv-title">INVOICE</div>
          </div>
          <div className="inv-meta">
            <div><strong>{inv.number || "INV-001"}</strong></div>
            <div>Date: {inv.date}</div>
            <div>Due: {inv.due}</div>
          </div>
        </div>

        <div className="inv-parties">
          <div className="inv-party">
            <div className="label">From</div>
            <div className="name">{inv.from || "Your business name"}</div>
            <div className="detail">{inv.fromDetails}</div>
          </div>
          <div className="inv-party">
            <div className="label">Bill to</div>
            <div className="name">{inv.to || "Client name"}</div>
            <div className="detail">{inv.toDetails}</div>
          </div>
        </div>

        <table className="inv-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Qty</th>
              <th className="num">Rate</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((it, i) => (
              <tr key={i}>
                <td>{it.description || <span style={{ color: "var(--ink-faint)" }}>—</span>}</td>
                <td className="num">{num(it.qty)}</td>
                <td className="num">{fmt(num(it.rate))}</td>
                <td className="num">{fmt(num(it.qty) * num(it.rate))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="inv-totals">
          <div className="row"><span>Subtotal</span><span>{fmt(totals.subtotal)}</span></div>
          {totals.discount > 0 && (
            <div className="row"><span>Discount</span><span>−{fmt(totals.discount)}</span></div>
          )}
          {num(inv.taxPct) > 0 && (
            <div className="row"><span>Tax ({num(inv.taxPct)}%)</span><span>{fmt(totals.tax)}</span></div>
          )}
          <div className="row grand"><span>Total due</span><span>{fmt(totals.total)}</span></div>
        </div>

        {inv.notes && (
          <div className="inv-notes">
            <div className="label">Notes</div>
            {inv.notes}
          </div>
        )}
      </div>
    </div>
  );
}
