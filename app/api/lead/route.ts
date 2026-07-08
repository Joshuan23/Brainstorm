import { NextResponse } from "next/server";
import { persistLead } from "@/lib/leads";

/**
 * POST /api/lead — capture a restoration lead (Venture A).
 *
 * Monetization is intentionally behind a config flag: leads are only forwarded
 * to a buyer when LEADS_WEBHOOK_URL/LEAD_WEBHOOK_URL is set. Regardless of that,
 * every valid lead is durably captured via `persistLead` (see lib/leads.ts) so a
 * missing/failed buyer integration never loses a lead — see that module for the
 * store/log fallback chain and the Vercel upgrade path.
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

  // persistLead always logs + best-effort stores locally, and forwards to a
  // buyer when configured. A forward failure never drops the lead.
  const { stored, forwarded } = await persistLead(lead);
  if (!stored && !forwarded) {
    // Both the durable store and the buyer forward failed — this only
    // happens if the local log fallback itself couldn't write (e.g. a
    // fully read-only FS with no KV/webhook configured). The lead is still
    // in the console/log drain, but flag it loudly for follow-up.
    console.error("[lead] WARNING: lead only captured via console log", lead);
  }

  return NextResponse.json({ ok: true });
}
