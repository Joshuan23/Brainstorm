"use client";

import { useState } from "react";

/**
 * Buy CTA for a digital product. Calls /api/products/checkout which returns the
 * product's Lemon Squeezy hosted checkout URL (or a demo notice if unconfigured).
 */
export function BuyButton({ slug, price }: { slug: string; price: string }) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function buy() {
    setLoading(true);
    setNote("");
    try {
      const res = await fetch("/api/products/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
        return;
      }
      setNote(json.message ?? "Checkout isn't configured yet.");
    } catch {
      setNote("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="buy">
      <button onClick={buy} disabled={loading}>
        {loading ? "Opening checkout…" : `Get it — ${price}`}
      </button>
      {note && <p className="buy-note">{note}</p>}
    </div>
  );
}
