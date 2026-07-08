"use client";

import Link from "next/link";
import { useState } from "react";

/** Only ever redirect to a same-origin, known-safe path — never trust ?next= blindly. */
const SAFE_NEXT_PATHS = new Set(["/restoration/thanks"]);

/**
 * Lead-capture form for Venture A restoration pages.
 * - honeypot field ("company") to deter bots
 * - explicit consent checkbox (required) with disclosure
 * - carries source (cause + city) so leads can be priced by page
 */
export function LeadForm({ cause, city }: { cause: string; city: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.consent) {
      setStatus("error");
      setMessage("Please agree to be contacted so a local pro can reach you.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, cause, city }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        form.reset();
        // Optional opt-in redirect via ?next=/restoration/thanks — never
        // trust an arbitrary URL, only an explicit allow-listed path, and
        // fall back to the inline success message otherwise.
        const next = new URLSearchParams(window.location.search).get("next");
        if (next && SAFE_NEXT_PATHS.has(next)) {
          window.location.href = next;
          return;
        }
        setStatus("ok");
        setMessage("Thanks — we're matching you with a local restoration pro. Keep your phone handy.");
      } else {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="lead-card" role="status">
        <strong>Request received.</strong>
        <p>{message}</p>
        <p className="lead-fine">
          <Link href="/restoration/thanks">What happens next →</Link>
        </p>
      </div>
    );
  }

  return (
    <form className="lead-card" onSubmit={onSubmit}>
      <h3>Get emergency help now</h3>
      <p className="lead-sub">Tell us what happened and we'll connect you with a local, licensed restoration pro.</p>
      {/* honeypot: hidden from users, bots fill it in */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <label>
        <span>Name</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      <label>
        <span>ZIP code</span>
        <input name="zip" inputMode="numeric" required autoComplete="postal-code" />
      </label>
      <label>
        <span>Briefly, what happened?</span>
        <textarea name="details" rows={2} />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" />
        <span>
          I agree to be contacted by phone or text about my request. Message/data rates may apply.
          I understand this is a referral service, not emergency services.
        </span>
      </label>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request a call back"}
      </button>
      {status === "error" && <p className="lead-error">{message}</p>}
      <p className="lead-fine">In a life-threatening emergency, call 911. For active flooding, shut off your water main first.</p>
    </form>
  );
}
