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

## 2026-07-08 — durable capture + post-submit thanks page
- `lib/leads.ts` (new): `persistLead()` — a captured lead is never lost even with zero
  buyer/store config. Chain: (1) forward to `LEADS_WEBHOOK_URL`/`LEAD_WEBHOOK_URL` if set
  (monetization; failure doesn't drop the lead), (2) store to `LEADS_KV_URL` (generic HTTP
  endpoint) if set, else (3) best-effort append a JSON line to `LEADS_LOG_PATH`
  (default `/tmp/leads.log`) as a local/dev safety net, and (4) always `console.log` a
  structured record so Vercel's log drain has it regardless of 1-3. Documents the upgrade
  path to a real KV/Postgres store in comments.
- `app/api/lead/route.ts`: now calls `persistLead()` instead of inline forward/log; all
  existing honeypot/consent/name-phone-zip validation is unchanged. A forward failure to
  the buyer no longer risks losing the lead — it's still stored/logged.
- `app/restoration/thanks/page.tsx` (new, `robots: index:false`): reassurance copy ("a
  local pro will call shortly"), sets expectations, repeats the 911/shut-off-water note,
  link back to `/restoration`.
- `components/LeadForm.tsx`: inline success message is preserved (no forced redirect) and
  now links to `/restoration/thanks` ("What happens next →"). Also supports an explicit,
  allow-listed `?next=/restoration/thanks` query param for pages that want a full-page
  redirect instead of the inline card — honeypot/consent logic untouched.

**Hypothesis:** this mainly protects lead→sold value (a previously-silent forward failure
no longer means a lead vanishes — it's recoverable from logs/KV even with no buyer wired
up yet), and should nudge visit→lead conversion slightly by giving submitters a clear,
reassuring "what happens next" destination instead of just an inline blurb.

**Owner decision needed:** `LEADS_KV_URL` is a stub for "some real store" — nothing is
configured yet, so today only steps 3+4 (local /tmp log + console log) actually run in
prod. Needs an owner call on which store (Vercel KV vs. Postgres vs. a Sheets/Zapier
webhook) before leads are durable across function instances/deploys. Also still open from
before: a real lead-buyer contract, payout integration, and TCPA/consent posture per
jurisdiction before `LEADS_WEBHOOK_URL`/`LEAD_WEBHOOK_URL` should be turned on for revenue.
