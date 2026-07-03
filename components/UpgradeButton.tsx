"use client";

import { useState } from "react";

export function UpgradeButton({ className, label }: { className?: string; label: string }) {
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const json = (await res.json()) as { url?: string };
      if (json.url) {
        window.location.href = json.url;
        return;
      }
      throw new Error("no checkout url");
    } catch {
      alert("Could not start checkout. Please try again.");
      setBusy(false);
    }
  }

  return (
    <button className={className ?? "btn btn-primary"} onClick={go} disabled={busy}>
      {busy ? "Redirecting…" : label}
    </button>
  );
}
