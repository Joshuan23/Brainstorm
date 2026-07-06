"use client";

import { useState } from "react";
import type { Optimized } from "@/lib/generator";
import type { PlatformId } from "@/lib/platforms";

/** Pro-only: paste many products (one per line, "product | keyword") and export a CSV. */
export function BulkOptimizer() {
  const [platform, setPlatform] = useState<PlatformId>("etsy");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Optimized[]>([]);
  const [csv, setCsv] = useState("");

  async function run() {
    setBusy(true);
    setError(null);
    const items = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [product, keyword] = line.split("|").map((s) => s.trim());
        return { product, keyword: keyword ?? "" };
      });

    try {
      const res = await fetch("/api/generate/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Bulk generation failed.");
      setRows(json.results as Optimized[]);
      setCsv(json.csv as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "listlift-optimized.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Bulk optimizer</h2>
        <span className="pill text-brand">Pro</span>
      </div>
      <p className="mb-4 text-sm text-muted">
        One product per line, in the form <code className="text-slate-300">product details | keyword</code>.
        Up to 200 rows.
      </p>

      <div className="mb-3 flex gap-2">
        {(["etsy", "shopify", "amazon"] as PlatformId[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
              platform === p ? "border-brand bg-brand/10 text-white" : "border-edge text-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <textarea
        className="input h-40 resize-none font-mono text-xs"
        placeholder={"lavender soy candle 8oz amber jar | soy candle\ndainty gold initial necklace | initial necklace"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-3 flex gap-2">
        <button className="btn btn-primary" onClick={run} disabled={busy || text.trim().length < 3}>
          {busy ? "Optimizing…" : "Optimize all"}
        </button>
        {csv && (
          <button className="btn btn-ghost" onClick={download}>
            Download CSV ({rows.length})
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-warn">{error}</p>}

      {rows.length > 0 && (
        <div className="mt-5 max-h-80 overflow-y-auto rounded-xl border border-edge">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-panel text-muted">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Tags</th>
                <th className="p-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-edge align-top">
                  <td className="p-2 text-slate-200">{r.title}</td>
                  <td className="p-2 text-muted">{r.tags.slice(0, 4).join(", ")}…</td>
                  <td className="p-2 font-semibold text-slate-100">{r.score.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
