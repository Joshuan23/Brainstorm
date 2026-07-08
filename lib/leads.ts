/**
 * Durable(ish) append-only lead store for Venture A (restoration lead-gen).
 *
 * There is no database wired up in this repo yet, and the production host
 * (Vercel) has an ephemeral/read-only filesystem outside of `/tmp` — a plain
 * `fs.writeFile` to the repo is NOT durable in prod. Until a real store is
 * chosen, this module layers several fallbacks so a captured lead is never
 * silently dropped, even if the buyer/partner forward fails:
 *
 *   1. Forward (monetization): POST to `LEADS_WEBHOOK_URL` (or the legacy
 *      `LEAD_WEBHOOK_URL`) — a buyer/partner endpoint — when configured.
 *      A failure here does NOT drop the lead; it's just not sold yet.
 *   2. Store: POST to `LEADS_KV_URL` — any generic HTTP endpoint fronting a
 *      real store (Vercel KV REST API, a Sheets/Zapier webhook, a Supabase
 *      row-insert endpoint, etc.) — when configured.
 *   3. Log fallback: if no `LEADS_KV_URL` is configured, best-effort append
 *      a JSON line to `LEADS_LOG_PATH` (or `/tmp/leads.log`). This is a
 *      local/dev safety net only — `/tmp` on Vercel is per-instance and
 *      does not persist across deploys/invocations, so treat it as a
 *      convenience for local development, not the source of truth.
 *   4. Always `console.log` a structured record, unconditionally. Vercel
 *      (and most hosts) capture stdout in a log drain/observability
 *      product, so even if 1-3 are all unset or fail, the lead is
 *      recoverable from platform logs.
 *
 * Upgrade path: once the owner picks a store, swap step 2's generic POST
 * for a typed client (Vercel KV, `@vercel/postgres`, Supabase, etc.) and
 * add delivery confirmation + retry/backoff to step 1 for per-buyer
 * routing.
 */

import fs from "node:fs";

export interface LeadRecord {
  [key: string]: unknown;
}

export interface PersistResult {
  /** True if the lead was captured somewhere durable-ish (KV endpoint or local log fallback). */
  stored: boolean;
  /** True if the lead was successfully forwarded to a buyer/partner endpoint. */
  forwarded: boolean;
}

const FETCH_TIMEOUT_MS = 8000;

export async function persistLead(lead: LeadRecord): Promise<PersistResult> {
  const record = { ...lead, loggedAt: new Date().toISOString() };

  // 4. Always log a structured record — the last-resort safety net.
  console.log("[lead]", JSON.stringify(record));

  let forwarded = false;
  let stored = false;

  // 1. Forward to a buyer/partner endpoint, if configured.
  const webhook = process.env.LEADS_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error(`[lead] forward failed: buyer endpoint responded ${res.status}`);
      }
    } catch (err) {
      // Don't let a forward failure drop the lead — it's still logged/stored below.
      console.error("[lead] forward failed", err);
    }
  }

  // 2/3. Store durably: prefer a configured KV/HTTP endpoint, else fall
  // back to a local append-only log file (best-effort, dev-oriented).
  const kvUrl = process.env.LEADS_KV_URL;
  if (kvUrl) {
    try {
      const res = await fetch(kvUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      stored = res.ok;
      if (!res.ok) {
        console.error(`[lead] store failed: KV endpoint responded ${res.status}`);
      }
    } catch (err) {
      console.error("[lead] store failed", err);
    }
  } else {
    try {
      // Guarded fs usage — never crashes the request if the FS is
      // read-only (e.g. most of a Vercel prod deployment outside /tmp).
      const logPath = process.env.LEADS_LOG_PATH || "/tmp/leads.log";
      fs.appendFileSync(logPath, JSON.stringify(record) + "\n", "utf8");
      stored = true;
    } catch (err) {
      console.error("[lead] local log fallback failed", err);
    }
  }

  return { stored, forwarded };
}
