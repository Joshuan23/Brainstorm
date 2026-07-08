import { NextResponse } from "next/server";

/**
 * POST /api/lead — capture a restoration lead (Venture A).
 *
 * Monetization is intentionally behind a config flag: leads are only forwarded
 * when LEAD_WEBHOOK_URL is set (a buyer/partner endpoint). Until then, leads are
 * logged so pages can rank and capture while the owner finalizes a lead buyer.
 *
 * No database in this repo yet; this is an append-only forward/log. Upgrade path:
 * persist to a KV/store and add per-buyer routing + delivery confirmation.
 */

interface LeadPayload {
  name?: string;
  phone?: string;
  zip?: string;
  details?: string;
  cause?: string;
  city?: string;
  consent?: string;
  company?: string; // honeypot
}

const PHONE_RE = /[0-9]{7,}/;

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }

  // Bot honeypot: real users never fill this.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true }); // silently accept, drop
  }

  // Consent is mandatory before we capture contact info.
  if (body.consent !== "yes") {
    return NextResponse.json({ ok: false, error: "consent is required" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const zip = (body.zip ?? "").trim();
  if (!name || !PHONE_RE.test(phone) || zip.length < 3) {
    return NextResponse.json({ ok: false, error: "please provide a valid name, phone, and ZIP" }, { status: 400 });
  }

  const lead = {
    name,
    phone,
    zip,
    details: (body.details ?? "").slice(0, 500),
    cause: body.cause ?? "",
    city: body.city ?? "",
    source: "restoration",
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`buyer endpoint ${res.status}`);
    } catch (err) {
      // Don't lose the lead: log it so it can be recovered/retried.
      console.error("[lead] forward failed, logging instead", err, lead);
    }
  } else {
    // No buyer configured yet — log so the owner can see captured demand.
    console.log("[lead] captured (no buyer configured)", lead);
  }

  return NextResponse.json({ ok: true });
}
