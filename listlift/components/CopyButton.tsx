"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="rounded-lg border border-edge px-2.5 py-1 text-xs text-muted transition hover:text-slate-100"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}
