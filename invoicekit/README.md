# InvoiceKit — the "set up once" asset

A free invoice generator + freelance tools site designed to do one thing: **rank on
Google for evergreen "free tool" searches and earn money passively** through
affiliate referrals and (later) display ads. Static Next.js, no database, no
accounts, no customer support surface. Once deployed, the running cost is a domain
(~$10/yr) and the marginal cost per visitor is zero.

## Why this is the closest real thing to "set up once, money multiplies"

- **The demand never dies.** People search "free invoice generator", "plumber
  invoice template", "what should I charge as a freelancer" every day, in every
  economy, forever. No trend risk.
- **Traffic compounds.** Every profession page is a separate lottery ticket in
  Google. Pages rank slowly (3–9 months) but once they rank, they keep paying
  without new work. Adding a page is 15 minutes in `lib/professions.ts`.
- **Monetization needs no customers.** Affiliate referrals to bookkeeping/invoicing
  software (QuickBooks, FreshBooks, Bonsai — programs pay roughly $5–$100+ per
  signup depending on program) and display ads once traffic justifies it
  (Ezoic/Journey have low minimums; Mediavine ≈ 50k sessions/mo). Nobody emails
  you; nothing breaks at 3 a.m.

## What's built

| Piece | Where | Notes |
|---|---|---|
| Invoice generator | `components/InvoiceGenerator.tsx`, `/invoice-generator` | Live preview, multi-currency, tax/discount, print-to-PDF via print CSS, drafts in localStorage. Fully client-side — a real privacy selling point. |
| 30 programmatic SEO pages | `lib/professions.ts`, `/invoice-template/[slug]` | Unique intro, realistic pre-filled line items, trade-specific billing tip, FAQ with JSON-LD, WebApplication schema, internal links. `?preset=slug` pre-loads the generator. |
| Rate calculator | `/freelance-rate-calculator` | Second keyword cluster ("freelance rate calculator", "what should I charge"). Links back to the generator. |
| Affiliate slots | `components/AffiliateSlot.tsx` + env vars | Render nothing until you paste tracked links into env. `rel="sponsored"`, visible Partner label, footer disclosure. |
| SEO plumbing | `app/sitemap.ts`, `app/robots.ts`, canonical URLs, metadata per page | Submit the sitemap in Search Console on day one. |

## Run it

```bash
cd invoicekit
npm install
npm run dev        # http://localhost:3001
npm run build      # static production build
```

## Launch checklist (the one-time "set up" part)

1. **Domain + deploy.** Buy a domain (exact-match-ish helps: something with
   "invoice" in it), deploy to Vercel free tier, set `NEXT_PUBLIC_SITE_URL`.
2. **Search Console.** Verify the domain, submit `/sitemap.xml`, request indexing
   on the homepage and 3–4 template pages.
3. **Affiliate programs.** Apply to QuickBooks (via CJ or Impact), FreshBooks,
   and Bonsai partner programs. Paste tracked links into the `NEXT_PUBLIC_AFF_*`
   env vars. Until approved, leave them empty — the slots vanish cleanly.
4. **Seed backlinks (one weekend, once).** A dozen genuine links move the needle
   at this scale: answer 5–10 relevant questions on Reddit/IndieHackers/forums
   where someone asks how to invoice, list the site on free-tool directories,
   post it on Product Hunt / Hacker News "Show" once.
5. **Then leave it alone.** Check Search Console monthly. When a page gets
   impressions but a low position, improve that one page. When queries appear
   that have no page ("hvac invoice template free"), add an entry to
   `professions.ts` — that's the whole growth loop.

## Honest expectations

This is a compounding asset, not a slot machine. Realistic arc for a niche tool
site: months 1–3 near zero, months 4–9 first rankings on long-tail pages
(hundreds of visits/mo), year 1–2 either it has found traction (tens of
thousands of visits/mo → meaningful affiliate + ad income) or the niche is too
contested and the play is to clone this codebase into a less contested niche
(the code is deliberately generic: swap `professions.ts` and the copy). The
invoice niche has big competitors on the head terms — the strategy here is the
long tail ("dog groomer invoice template"), which big players under-serve.

Zero-maintenance is real *after* setup, but "set up once" includes the seed-link
weekend and a monthly 30-minute Search Console glance. Skipping those is the
difference between an asset and an abandoned repo.

## Growth levers (each one optional, each compounds)

- More professions (aim for 100+ pages over time; 15 min each).
- More tools, same playbook: receipt generator, quote/estimate generator,
  late-fee calculator, hourly-to-salary converter — each is a new keyword cluster
  sharing the same components.
- Localize: `/es/` invoice generator, per-country pages (invoice rules differ —
  research before writing).
- A $12 one-time "pro" unlock (logo upload, saved clients, recurring numbering)
  via Lemon Squeezy once traffic exists — the PipSignal license code in this repo
  is reusable for that.
