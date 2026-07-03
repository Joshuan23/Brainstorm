"use client";

import { useMemo, useState } from "react";

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export default function RateCalculator() {
  const [income, setIncome] = useState("80000");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [billablePct, setBillablePct] = useState("60");
  const [weeksOff, setWeeksOff] = useState("4");
  const [overhead, setOverhead] = useState("6000");
  const [taxPct, setTaxPct] = useState("25");

  const r = useMemo(() => {
    const workingWeeks = Math.max(52 - num(weeksOff), 1);
    const billableHours = Math.max(
      workingWeeks * num(hoursPerWeek) * (num(billablePct) / 100),
      1
    );
    // Gross revenue needed so that (revenue - overhead) * (1 - tax) = target income
    const taxFrac = Math.min(num(taxPct), 90) / 100;
    const revenueNeeded = num(income) / (1 - taxFrac) + num(overhead);
    const hourly = revenueNeeded / billableHours;
    return {
      workingWeeks,
      billableHours: Math.round(billableHours),
      revenueNeeded,
      hourly,
      day: hourly * 8,
    };
  }, [income, hoursPerWeek, billablePct, weeksOff, overhead, taxPct]);

  const money = (n: number) =>
    `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <div className="gen-layout">
      <form className="gen-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Your target</h2>
        <div className="field">
          <label htmlFor="income">Desired take-home income per year ($)</label>
          <input id="income" type="number" min="0" value={income}
            onChange={(e) => setIncome(e.target.value)} />
        </div>

        <h2>Your time</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="hpw">Hours worked per week</label>
            <input id="hpw" type="number" min="1" max="100" value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="wo">Weeks off per year</label>
            <input id="wo" type="number" min="0" max="30" value={weeksOff}
              onChange={(e) => setWeeksOff(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="bp">% of worked hours that are billable</label>
          <input id="bp" type="number" min="1" max="100" value={billablePct}
            onChange={(e) => setBillablePct(e.target.value)} />
        </div>

        <h2>Your costs</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="oh">Annual overhead ($)</label>
            <input id="oh" type="number" min="0" value={overhead}
              onChange={(e) => setOverhead(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="tx">Effective tax rate (%)</label>
            <input id="tx" type="number" min="0" max="90" value={taxPct}
              onChange={(e) => setTaxPct(e.target.value)} />
          </div>
        </div>
      </form>

      <div className="invoice-paper" style={{ minHeight: "auto" }}>
        <div className="inv-title" style={{ fontSize: "1.2rem", letterSpacing: "0.06em", marginBottom: 18 }}>
          YOUR MINIMUM RATE
        </div>
        <div style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {money(r.hourly)}<span style={{ fontSize: "1.2rem", color: "var(--ink-faint)" }}>/hour</span>
        </div>
        <p style={{ color: "var(--ink-soft)", margin: "6px 0 24px" }}>
          ≈ {money(r.day)} per 8-hour day
        </p>
        <div className="inv-totals" style={{ marginLeft: 0, width: "100%", maxWidth: 360 }}>
          <div className="row"><span>Working weeks</span><span>{r.workingWeeks}</span></div>
          <div className="row"><span>Billable hours / year</span><span>{r.billableHours.toLocaleString("en-US")}</span></div>
          <div className="row"><span>Revenue you must invoice</span><span>{money(r.revenueNeeded)}</span></div>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-faint)", marginTop: 22 }}>
          Charging less than this means funding your business out of your own salary.
          Estimates only — confirm tax rates with a professional.
        </p>
      </div>
    </div>
  );
}
