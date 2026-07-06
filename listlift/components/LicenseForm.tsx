"use client";

import { useState } from "react";

export function LicenseForm() {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Activation failed.");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activation failed.");
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Paste your license key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button className="btn btn-ghost whitespace-nowrap" onClick={activate} disabled={busy || key.length < 8}>
          {busy ? "Activating…" : "Activate"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-warn">{error}</p>}
    </div>
  );
}
