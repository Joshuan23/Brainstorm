"use client";

import { useState } from "react";

/** Entry point for buyers: paste the license key emailed after purchase. */
export function LicenseForm() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        window.location.reload();
        return;
      }
      setError(json.error ?? "Activation failed.");
    } catch {
      setError("Activation failed — check your connection and try again.");
    }
    setBusy(false);
  }

  if (!open) {
    return (
      <button className="link-btn" onClick={() => setOpen(true)}>
        Already purchased? Activate your license key
      </button>
    );
  }

  return (
    <form className="license-form" onSubmit={activate}>
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Paste the license key from your purchase email"
        aria-label="License key"
        autoFocus
      />
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Checking…" : "Activate"}
      </button>
      {error && <span className="license-error">{error}</span>}
    </form>
  );
}
