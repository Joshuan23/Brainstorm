"use client";

import { useState } from "react";
import Link from "next/link";
import type { AuditResult } from "@/lib/audit";
import type { PlatformId } from "@/lib/platforms";
import { CopyButton } from "./CopyButton";
import { SITE } from "@/lib/site";

const PLATFORMS: { id: PlatformId; label: string }[] = [
  { id: "etsy", label: "Etsy" },
  { id: "shopify", label: "Shopify" },
  { id: "amazon", label: "Amazon" },
];

const SEV_COLOR = { high: "text-warn", medium: "text-brand", low: "text-muted" } as const;

export function Auditor({ initialPlatform = "etsy" }: { initialPlatform?: PlatformId }) {
  const [platform, setPlatform] = useState<PlatformId>(initialPlatform);
  const [title, setTitle] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, title, tagsText, description }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Audit failed.");
      setResult(json.result as AuditResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input */}
      <div className="card">
        <div className="mb-4 flex gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                platform === p.id ? "border-brand bg-brand/10 text-white" : "border-edge text-muted hover:text-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="label">Your current title</label>
        <textarea
          className="input mb-4 h-20 resize-none"
          placeholder="Paste the title of your live listing"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="label">Your current tags (optional, comma-separated)</label>
        <textarea
          className="input mb-4 h-16 resize-none"
          placeholder="soy candle, candle, gift"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />

        <label className="label">Your current description (optional)</label>
        <textarea
          className="input mb-4 h-20 resize-none"
          placeholder="Paste your listing description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn btn-primary w-full" onClick={run} disabled={busy || title.trim().length < 3}>
          {busy ? "Auditing…" : "Audit my listing — free"}
        </button>
        {error && <p className="mt-3 text-sm text-warn">{error}</p>}
      </div>

      {/* Result */}
      <div className="card">
        {!result ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center text-center text-muted">
            <p className="text-sm">Your audit score and specific fixes appear here.</p>
            <p className="mt-1 text-xs">Free — no account needed.</p>
          </div>
        ) : (
          <AuditView result={result} />
        )}
      </div>
    </div>
  );
}

function AuditView({ result }: { result: AuditResult }) {
  const color = result.beforeScore >= 80 ? "text-good" : result.beforeScore >= 50 ? "text-warn" : "text-warn";
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="pill">{result.platform.label}</span>
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-bold ${color}`}>{result.beforeScore}</div>
          <div className="text-xs text-muted">current<br />score</div>
        </div>
      </div>

      {result.issues.length > 0 ? (
        <div>
          <p className="label">What's holding it back ({result.issues.length})</p>
          <ul className="space-y-2">
            {result.issues.map((iss) => (
              <li key={iss.label} className="text-xs">
                <span className={`font-semibold ${SEV_COLOR[iss.severity]}`}>
                  {iss.severity.toUpperCase()} · {iss.label}.
                </span>{" "}
                <span className="text-slate-300">{iss.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-good">Strong listing — no major issues found. Nice work.</p>
      )}

      {result.strengths.length > 0 && (
        <p className="text-xs text-muted">
          <span className="font-semibold text-slate-300">Working well:</span> {result.strengths.join(" ")}
        </p>
      )}

      {/* The "after" — the conversion moment */}
      <div className="rounded-xl border border-brand/40 bg-brand/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            Optimized rewrite <span className="text-good">(score {result.improved.score.total})</span>
          </p>
          <CopyButton text={result.improved.title} label="Copy title" />
        </div>
        <p className="text-sm text-slate-100">{result.improved.title}</p>
        <p className="mt-1 text-xs text-muted">{result.improved.titleLength}/{result.improved.platform.titleMax} chars</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="label mb-0">Suggested tags</span>
          <CopyButton text={result.improved.tags.join(", ")} label="Copy tags" />
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {result.improved.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        <Link href="/app" className="btn btn-primary mt-4 w-full">
          Optimize every listing — Pro ${SITE.price}/mo
        </Link>
      </div>
    </div>
  );
}
