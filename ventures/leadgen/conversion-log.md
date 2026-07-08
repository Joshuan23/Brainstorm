# Venture A — Conversion / Monetization Log

## 2026-07-08 — capture stubbed (lead-engine)
- `components/LeadForm.tsx`: name/phone/ZIP/details, honeypot ("company"), REQUIRED consent
  checkbox with disclosure, carries source (cause + city).
- `app/api/lead/route.ts`: validates input, drops honeypot hits, requires consent, forwards to
  `LEAD_WEBHOOK_URL` when set (buyer/partner) else logs captured demand. No lead is lost on
  forward failure (logged for retry).
- Routing is behind a config flag on purpose — capture works now; revenue turns on once a
  lead buyer + TCPA consent stance are confirmed (owner escalation).

Next: persist leads to a store (KV) + delivery confirmation + per-buyer routing.
