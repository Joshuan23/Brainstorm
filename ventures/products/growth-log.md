# Venture B — Growth / Listings Log

## 2026-07-08 — first listing (marketplace-growth)
- Product page `/products/[slug]` — unique metadata, Product JSON-LD, benefit-led copy,
  "what's included", FAQ, buy CTA + free lite download.
- Store index `/products` — targets "templates for solo businesses"; cards link to products.
- Both added to sitemap.

Next: target the exact buy query ("freelance pricing calculator template") in H1/title; add
cross-links from restoration hub; consider Gumroad/Etsy mirror (owner decision).

## 2026-07-08 — store index conversion pass + related-templates cross-linking
- `app/products/page.tsx` — retitled metadata to
  "Pricing Calculator & Business Templates | Instant Download, No Subscription" and rewrote the
  description/H1/lede to lead with "pricing calculator" (the highest-intent buyer phrase across
  the catalog) instead of the generic "templates for solo businesses". Still maps over PRODUCTS,
  so it auto-picks up the bookkeeper pricing calculator (and any future product) with zero code
  changes.
  - Target queries surfaced on this page: "pricing calculator template", "freelance pricing
    calculator template", "instant download no subscription".
  - Expected impact: sharper query match in the `<title>`/meta description should lift
    click-through from search for anyone searching "[x] pricing calculator" or "template instant
    download"; the store index is the top-of-funnel page so this compounds across every product
    listed there.
- `app/products/[slug]/page.tsx` — added a "Related templates" section (reuses the existing
  `.related` class from the restoration pages) directly below the FAQ, listing every other
  product in PRODUCTS (name → link, tagline, price). Guarded with `otherProducts.length > 0` so
  it renders nothing while the catalog only has one product, and activates automatically once the
  bookkeeper pricing calculator (or any future product) ships.
  - Internal-link/SEO effect: once 2+ products exist, every product page passes link equity to
    every other product page and gives buyers of one template a one-click path to the next,
    raising products-per-visit and repeat-purchase odds without adding a new page.

Per-product target buy queries (from `lib/products-data.ts` targetQuery field, for reference):
- freelance-pricing-profit-calculator → "freelance pricing calculator template"
- bookkeeper pricing calculator (pending from product-maker) → track its targetQuery once merged
  and confirm the store index + related-templates copy still matches buyer phrasing for it.

Flag: no sales data available yet for freelance-pricing-profit-calculator (too early since
launch) — nothing to flag to product-maker today. Re-check after first traffic/sales data lands.
