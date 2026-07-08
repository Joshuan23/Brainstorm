# Venture A — Page Log

## 2026-07-08 — first batch (seo-page-builder)
- Template: `app/restoration/[cause]/[city]/page.tsx` — static (dynamicParams=false),
  unique title/description/canonical, Service + FAQPage JSON-LD, "what to do now" checklist,
  city-specific copy, FAQ, internal links to sibling causes + nearby cities.
- Hub: `app/restoration/page.tsx` linking all causes × cities.
- **80 pages live** = 4 causes × 20 small cities.
  - Causes: burst-pipe-cleanup, basement-flood-restoration, sewage-backup-cleanup,
    storm-flood-damage-restoration.
  - Target queries: "[cause] in [small city, state]" — thin SERPs, emergency intent, $400+ leads.
- Added to `app/sitemap.ts`.
- CTA: LeadForm (see conversion-log).

Next: expand cities (aim 100+), add causes (mold remediation, fire/smoke, appliance leak),
and add per-state hub pages for internal-link depth.
