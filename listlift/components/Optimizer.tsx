"use client";

import { useState } from "react";
import type { Optimized } from "@/lib/generator";
import type { PlatformId } from "@/lib/platforms";
import { CopyButton } from "./CopyButton";

const PLATFORM_OPTIONS: { id: PlatformId; label: string }[] = [
  { id: "etsy", label: "Etsy" },
  { id: "shopify", label: "Shopify" },
  { id: "amazon", label: "Amazon" },
];

export function Optimizer({
  initialPlatform = "etsy",
  initialProduct = "",
  initialKeyword = "",
  lockedKind,
}: {
  initialPlatform?: PlatformId;
  initialProduct?: string;
  initialKeyword?: string;
  /** When set, the results view emphasizes this field (title/tags/description). */
  lockedKind?: "title" | "tags" | "description";
}) {
  const [platform, setPlatform] = useState<PlatformId>(initialPlatform);
  const [product, setProduct] = useState(initialProduct);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [showAttrs, setShowAttrs] = useState(false);
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [occasion, setOccasion] = useState("");
  const [audience, setAudience] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Optimized | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          product,
          keyword,
          attributes: { material, color, style, occasion, audience },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed.");
      setResult(json.result as Optimized);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input panel */}
      <div className="card">
        <div className="mb-4 flex gap-2">
          {PLATFORM_OPTIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                platform === p.id
                  ? "border-brand bg-brand/10 text-white"
                  : "border-edge text-muted hover:text-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="label">What are you selling?</label>
        <textarea
          className="input mb-4 h-24 resize-none"
          placeholder="e.g. hand-poured soy candle, lavender scent, 8oz amber jar"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <label className="label">Main keyword shoppers search</label>
        <input
          className="input mb-4"
          placeholder="e.g. soy candle"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          type="button"
          className="mb-4 text-xs font-semibold text-brand"
          onClick={() => setShowAttrs((v) => !v)}
        >
          {showAttrs ? "− Hide" : "+ Add"} details (sharper tags)
        </button>

        {showAttrs && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <input className="input" placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
            <input className="input" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input className="input" placeholder="Style (boho…)" value={style} onChange={(e) => setStyle(e.target.value)} />
            <input className="input" placeholder="Occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} />
            <input className="input col-span-2" placeholder="Audience (for her, for teachers…)" value={audience} onChange={(e) => setAudience(e.target.value)} />
          </div>
        )}

        <button className="btn btn-primary w-full" onClick={run} disabled={busy || product.trim().length < 3}>
          {busy ? "Optimizing…" : "Generate optimized listing"}
        </button>
        {error && <p className="mt-3 text-sm text-warn">{error}</p>}
      </div>

      {/* Results panel */}
      <div className="card">
        {!result ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center text-center text-muted">
            <p className="text-sm">Your optimized {lockedKind ?? "listing"} appears here.</p>
            <p className="mt-1 text-xs">Free — no account needed.</p>
          </div>
        ) : (
          <Results result={result} emphasize={lockedKind} />
        )}
      </div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const color = value >= 80 ? "text-good" : value >= 50 ? "text-warn" : "text-brand";
  return (
    <div className="flex items-center gap-3">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted">
        SEO score
        <br />
        (rules passed)
      </div>
    </div>
  );
}

function Results({ result, emphasize }: { result: Optimized; emphasize?: "title" | "tags" | "description" }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="pill">{result.platform.label}</span>
        <ScoreRing value={result.score.total} />
      </div>

      <Section title="Title" highlight={emphasize === "title"} copy={result.title}>
        <p className="text-sm text-slate-100">{result.title}</p>
        <p className="mt-1 text-xs text-muted">
          {result.titleLength}/{result.platform.titleMax} characters
        </p>
      </Section>

      <Section
        title={result.platform.tagLabel}
        highlight={emphasize === "tags"}
        copy={result.tags.join(", ")}
      >
        <div className="flex flex-wrap gap-1.5">
          {result.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Description" highlight={emphasize === "description"} copy={result.description}>
        <p className="whitespace-pre-line text-sm text-slate-300">{result.description}</p>
      </Section>

      <Section title="Meta description" copy={result.metaDescription}>
        <p className="text-sm text-slate-300">{result.metaDescription}</p>
      </Section>

      <div>
        <p className="label">SEO checks</p>
        <ul className="space-y-1.5">
          {result.score.checks.map((c) => (
            <li key={c.label} className="flex items-start gap-2 text-xs">
              <span className={c.pass ? "text-good" : "text-warn"}>{c.pass ? "✓" : "•"}</span>
              <span className="text-slate-300">
                <span className="font-semibold text-slate-100">{c.label}.</span> {c.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {result.notes.length > 0 && (
        <p className="rounded-lg border border-edge bg-white/5 p-3 text-xs text-muted">
          {result.notes.join(" ")}
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  copy,
  highlight,
  children,
}: {
  title: string;
  copy: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={highlight ? "rounded-xl border border-brand/40 bg-brand/5 p-3" : ""}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="label mb-0">{title}</span>
        <CopyButton text={copy} />
      </div>
      {children}
    </div>
  );
}
