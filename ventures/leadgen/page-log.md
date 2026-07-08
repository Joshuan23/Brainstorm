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

## 2026-07-08 — internal-link fix: state hub layer (seo-page-builder)

**Problem**: cities/causes had grown to 100 × 7 = 700 leaf pages, but the hub only linked
each cause to its first city and each city to its first cause — most of the 700 pages had
no inbound internal link at all, which starves them of crawl budget / indexing signal.

**Fix — new mid-tier hub layer**:
- `lib/restoration-data.ts`: added `stateOf(city)` helper, `STATE_NAMES` map, `State`
  interface, `STATES` (CITIES grouped by state, 35 states), `getState()`, `allStateParams()`.
  Existing exports/interfaces untouched.
- New route `app/restoration/state/[state]/page.tsx` — static (generateStaticParams over
  `allStateParams()`, `dynamicParams=false`). Chose `/restoration/state/[state]` over a bare
  `/restoration/[state]` sibling to `[cause]` to avoid a same-level dynamic-segment-name
  conflict with the existing `app/restoration/[cause]/[city]` route; a *static* `state`
  segment coexists fine alongside the `[cause]` dynamic segment.
  - Unique title/description/canonical (`abs()`) per state, e.g. "Water Damage &
    Restoration Help in Illinois | Restoration Match".
  - Lists every city in that state, and every cause × that city (7 links per city) —
    full fan-out to all leaf pages for that state.
  - Links back to the main hub (breadcrumb) and to every other state hub.
- `app/restoration/page.tsx`: added a "Browse by state" section linking all 35 state hubs
  (with city counts), so there's now a real crawl path hub → state → every cause/city page.
- `app/sitemap.ts`: added the 35 `/restoration/state/[state]` URLs (priority 0.75, between
  the hub and the leaf pages).
- `app/robots.ts` (new): allows all, points to `${SITE_URL}/sitemap.xml`.

**New page count**: 700 leaf pages (unchanged) + 35 new state hub pages = **735 total
restoration pages**, all now reachable within 2 clicks of `/restoration` (hub → state → leaf),
each leaf additionally reachable from its state hub's full cause list per city.

- CTA: unchanged, LeadForm on every leaf page (state hubs are pure link/nav pages, no form —
  they exist to spread link equity and give crawlers a shallow path to every leaf).

Next: consider adding a "your state" link from each leaf page back up to its state hub for
an even tighter internal-link graph (out of scope for this batch — leaf template owned by a
separate constraint today).
