"use client";

import { useEffect, useMemo, useState } from "react";
import { CURRENCIES } from "@/lib/site";

interface LineItem {
  description: string;
  qty: string;
  rate: string;
}

interface ReceiptState {
  from: string;
  fromDetails: string;
  to: string;
  number: string;
  date: string;
  method: string;
  currency: string;
  taxPct: string;
  items: LineItem[];
  notes: string;
}

const STORAGE_KEY = "invoicekit-receipt-v1";
const METHODS = ["Cash", "Card", "Bank transfer", "Check", "PayPal", "Other"];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function blankState(): ReceiptState {
  return {
    from: "",
    fromDetails: "",
    to: "",
    number: "REC-001",
    date: today(),
    method: "Cash",
    currency: "USD",
    taxPct: "0",
    items: [{ description: "", qty: "1", rate: "0" }],
    notes: "Paid in full. Thank you.",
  };
}

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export default function ReceiptGenerator() {
  const [rec, setRec] = useState<ReceiptState>(blankState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let restored = blankState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = { ...restored, ...JSON.parse(raw) };
    } catch {
      /* corrupt draft — start fresh */
    }
    setRec(restored);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
    } catch {
      /* storage blocked — preview still works */
    }
  }, [rec, loaded]);

  const set = (patch: Partial<ReceiptState>) => setRec((s) => ({ ...s, ...patch }));
  const setItem = (idx: number, patch: Partial<LineItem>) =>
    setRec((s) => ({
      ...s,
      items: s.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  const addItem = () =>
    setRec((s) => ({ ...s, items: [...s.items, { description: "", qty: "1", rate: "0" }] }));
  const removeItem = (idx: number) =>
    setRec((s) => ({
      ...s,
      items: s.items.length > 1 ? s.items.filter((_, i) => i !== idx) : s.items,
    }));

  const symbol = CURRENCIES.find((c) => c.code === rec.currency)?.symbol ?? "$";
  const fmt = (n: number) =>
    `${symbol}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totals = useMemo(() => {
    const subtotal = rec.items.reduce((sum, it) => sum + num(it.qty) * num(it.rate), 0);
    const tax = (subtotal * num(rec.taxPct)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [rec.items, rec.taxPct]);

  return (
    <div className="gen-layout">
      <form className="gen-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Received from / paid to</h2>
        <div className="field">
          <label htmlFor="from">Your business / name (received by)</label>
          <input id="from" value={rec.from} placeholder="Jane Doe Services"
            onChange={(e) => set({ from: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="fromDetails">Address, email, phone</label>
          <textarea id="fromDetails" value={rec.fromDetails}
            placeholder={"123 Main St\njane@example.com"}
            onChange={(e) => set({ fromDetails: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="to">Received from (customer)</label>
          <input id="to" value={rec.to} placeholder="John Smith"
            onChange={(e) => set({ to: e.target.value })} />
        </div>

        <h2>Receipt details</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="number">Receipt #</label>
            <input id="number" value={rec.number} onChange={(e) => set({ number: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="date">Date paid</label>
            <input id="date" type="date" value={rec.date} onChange={(e) => set({ date: e.target.value })} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="method">Payment method</label>
            <select id="method" value={rec.method} onChange={(e) => set({ method: e.target.value })}>
              {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <select id="currency" value={rec.currency} onChange={(e) => set({ currency: e.target.value })}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
        </div>

        <h2>What was paid for</h2>
        {rec.items.map((it, i) => (
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
        <button type="button" className="add-item" onClick={addItem}>+ Add line</button>

        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="taxPct">Tax %</label>
          <input id="taxPct" type="number" min="0" step="any" value={rec.taxPct}
            onChange={(e) => set({ taxPct: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={rec.notes} onChange={(e) => set({ notes: e.target.value })} />
        </div>

        <div className="gen-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Download PDF / Print
          </button>
          <button type="button" className="btn btn-ghost"
            onClick={() => { setRec(blankState()); try { localStorage.removeItem(STORAGE_KEY); } catch {} }}>
            Clear
          </button>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginTop: 10 }}>
          Everything stays in this browser — nothing is uploaded.
        </p>
      </form>

      <div className="invoice-paper" id="receipt-preview">
        <div className="inv-top">
          <div>
            <div className="inv-title">RECEIPT</div>
            <div style={{
              display: "inline-block", marginTop: 8, padding: "3px 12px",
              border: "2px solid var(--good)", color: "var(--good)",
              borderRadius: 6, fontWeight: 800, letterSpacing: "0.1em", fontSize: "0.8rem",
            }}>PAID</div>
          </div>
          <div className="inv-meta">
            <div><strong>{rec.number || "REC-001"}</strong></div>
            <div>Date: {rec.date}</div>
            <div>Method: {rec.method}</div>
          </div>
        </div>

        <div className="inv-parties">
          <div className="inv-party">
            <div className="label">Received by</div>
            <div className="name">{rec.from || "Your business name"}</div>
            <div className="detail">{rec.fromDetails}</div>
          </div>
          <div className="inv-party">
            <div className="label">Received from</div>
            <div className="name">{rec.to || "Customer name"}</div>
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
            {rec.items.map((it, i) => (
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
          {num(rec.taxPct) > 0 && (
            <div className="row"><span>Tax ({num(rec.taxPct)}%)</span><span>{fmt(totals.tax)}</span></div>
          )}
          <div className="row grand"><span>Amount paid</span><span>{fmt(totals.total)}</span></div>
        </div>

        {rec.notes && (
          <div className="inv-notes">
            <div className="label">Notes</div>
            {rec.notes}
          </div>
        )}
      </div>
    </div>
  );
}
