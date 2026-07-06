# ListLift — Launch Punch List

Everything needed to go from this repo to first paying customer. Items marked **[you]**
need the human (accounts, money, domain); everything else I can do or draft.

## 1. Deploy (day 1)

- [ ] **[you]** Create a Vercel account and import this repo (root: `listlift/`).
- [ ] **[you]** Buy a domain (e.g. `listlift.app`) and point it at Vercel.
- [ ] Set env vars in Vercel:
  - [ ] `NEXT_PUBLIC_SITE_URL=https://yourdomain`
  - [ ] `ENTITLEMENT_SECRET=` (long random string)
- [ ] Confirm `npm run build` passes (it does) and the site loads.

## 2. Payments (day 1)

- [ ] **[you]** Create a Lemon Squeezy store (merchant of record — handles VAT/sales tax).
- [ ] **[you]** Create a **$19/mo subscription product** with *"Generate license keys"* on.
- [ ] Set env vars: `LEMONSQUEEZY_CHECKOUT_URL`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_PRODUCT_ID`.
- [ ] Do one real test purchase → confirm the license key activates Pro at `/app` and
      bulk mode unlocks. Refund the test.

## 3. Get indexed (week 1)

- [ ] **[you]** Add the domain to Google Search Console; submit `/sitemap.xml`.
- [ ] Confirm the 19 `/tools/*` pages are live and each has unique title + FAQ JSON-LD.
- [ ] Add 5–10 more niche tool pages (edit `NICHES`/`TOOLS` in `lib/tools.ts`) — I can do this.

## 4. First 50 customers — the manual reps (weeks 1–6)

SEO won't rank instantly. This cohort comes from showing up where sellers already are.
I can draft every post; **[you]** posts from a real account (communities ban bots).

- [ ] r/Etsy, r/EtsySellers, r/shopify — genuinely helpful posts + the free tool, no spam.
- [ ] 3–5 Etsy-seller Facebook groups — same.
- [ ] A TikTok/Reels "before/after listing" demo (the free tool makes great short-form).
- [ ] DM 20 sellers with visibly weak titles; offer a free optimized version.

## 5. Retain & compound (ongoing — my job)

- [ ] Ship saved history + re-optimize reminders (roadmap) to reduce churn.
- [ ] Add a "listing audit" free tool (paste a live URL → score) as a new funnel.
- [ ] Monthly review: index count, tool-page traffic, free→paid rate (target ≥3–5%),
      churn. Iterate copy/pricing off the numbers.

## Definition of "profitable"

Fixed costs are ~$1–2/mo (domain amortized) + Vercel hobby ($0) until scale. Lemon Squeezy
takes ~5%+ per sale. **Profitable at customer #1.** The real goal is durable MRR — the
milestones in `BUSINESS-PLAN.md` track it.
