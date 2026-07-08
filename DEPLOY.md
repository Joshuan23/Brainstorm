# DEPLOY.md — Launch Runbook

One-page checklist to take this app live on Vercel for its two ventures:

- **Venture A** — programmatic-SEO restoration lead-gen (`/restoration/...`, `POST /api/lead`)
- **Venture B** — digital products store (`/products/...`, `POST /api/products/checkout`, Lemon Squeezy)

---

## 1. Pre-flight

- [ ] `npm install` clean, then `npm run build` is **green** (no type or build errors)
- [ ] `npm run engine:check` passes (indicator/pipeline sanity)
- [ ] Confirm **no secrets committed**: `.env.local` is git-ignored; only `.env.example` (placeholders) is tracked
- [ ] Grep for stray keys/URLs accidentally hard-coded in source

---

## 2. Environment variables

Set these in Vercel → Project → Settings → Environment Variables (Production). Exact names below.

| Var | What it does | Required? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Real production origin (e.g. `https://yourdomain.com`). Drives metadata **canonicals** and every **sitemap** URL. **Defaults to `https://example.com`** if unset (see `lib/site.ts`), which breaks SEO. | **REQUIRED** |
| `ENTITLEMENT_SECRET` | Long random string used to sign the Pro entitlement cookie (paywall). | REQUIRED for paywall |
| `LEMONSQUEEZY_CHECKOUT_URL` | Hosted checkout link for the subscription product. **Unset → paywall runs in demo mode** (24h "Pro (demo)" pass). | Required to charge |
| `LEMONSQUEEZY_STORE_ID` | Numeric store id — pins license keys to your store. | Optional (recommended) |
| `LEMONSQUEEZY_PRODUCT_ID` | Numeric product id — pins license keys to your product. | Optional (recommended) |
| `LS_CHECKOUT_FREELANCE_PRICING` | Per-product Lemon Squeezy checkout URL for **Venture B** (product `checkoutEnv` in `lib/products-data.ts`, read by `app/api/products/checkout/route.ts`). **Unset → product checkout returns a demo message**, no sale. | Required to sell Venture B |
| `LEAD_WEBHOOK_URL` | Where **Venture A** leads are forwarded (buyer/partner endpoint). **Unset → capture-and-log only** (leads logged, not routed — see `app/api/lead/route.ts`). | Optional |

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] `ENTITLEMENT_SECRET` set to a long random string
- [ ] `LEMONSQUEEZY_CHECKOUT_URL` set (or accept demo mode intentionally)
- [ ] `LEMONSQUEEZY_STORE_ID` / `LEMONSQUEEZY_PRODUCT_ID` set (recommended)
- [ ] `LS_CHECKOUT_FREELANCE_PRICING` set (or accept demo mode for Venture B)
- [ ] `LEAD_WEBHOOK_URL` set **only** once a lead buyer is chosen (see §5)

---

## 3. Deploy to Vercel

- [ ] Import the repo in Vercel (Next.js 14 App Router auto-detected — no config needed)
- [ ] Add all env vars from §2 to the **Production** environment
- [ ] Trigger the deploy; confirm the build succeeds
- [ ] Attach the custom domain; confirm it matches `NEXT_PUBLIC_SITE_URL` exactly (scheme + host, no trailing slash)

---

## 4. Post-deploy SEO

- [ ] `https://yourdomain.com/sitemap.xml` resolves and URLs use the **real domain** (not `example.com`) — covers `/`, `/restoration`, `/products`, all restoration cause/city pages, and product pages
- [ ] Add a **robots allowance** (allow crawling + point to the sitemap) so pages can be indexed
- [ ] Submit the sitemap in **Google Search Console** (verify domain ownership first)
- [ ] Spot-check a restoration page (`/restoration/<cause>/<city>`) renders with unique metadata + FAQ **JSON-LD present**
- [ ] Spot-check the product page (`/products/freelance-pricing-profit-calculator`) renders and **JSON-LD is present**

---

## 5. Revenue-gating owner decisions

These block **earning**, not shipping — the site can go live and index without them, but no money moves until they're done.

### Venture A — leads
- [ ] Choose a **lead buyer/partner** and get their intake endpoint
- [ ] Set `LEAD_WEBHOOK_URL` to that endpoint
- [ ] Confirm **TCPA consent** stance before routing real leads (the form already requires `consent: "yes"`; verify the disclosure language and buyer requirements are compliant for your jurisdiction)

### Venture B — product
- [ ] Build/upload the **full paid spreadsheet** (Google Sheets + `.xlsx`) to Lemon Squeezy
- [ ] Create the Lemon Squeezy product and copy its hosted checkout link
- [ ] Set `LS_CHECKOUT_FREELANCE_PRICING` to that link
- [ ] Confirm the price is **$24** (matches `priceValue: 24` in `lib/products-data.ts`)
- [ ] Test-buy end to end: checkout URL loads → purchase → file delivered

---

## Go / No-Go

- [ ] Build green, no secrets committed (§1)
- [ ] `NEXT_PUBLIC_SITE_URL` correct, sitemap resolves on real domain (§2, §4)
- [ ] Deployed on Vercel with custom domain (§3)
- [ ] Sitemap submitted, JSON-LD verified (§4)
- [ ] Revenue paths configured **or** consciously deferred (§5)
