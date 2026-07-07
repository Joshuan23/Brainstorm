# ListLift

**AI listing optimizer for Etsy, Shopify & Amazon sellers.** Turn a rough product
idea + a keyword into a paste-ready, search-optimized listing — front-loaded title,
long-tail tags, conversion description, and a **transparent SEO score** — in seconds.
Built with Next.js 14 (App Router, TypeScript), no database required.

> **Honesty note (read before marketing this):** no tool can truthfully promise "#1
> rankings", and claiming it invites refunds and reputational damage. ListLift's
> defensible pitch is the same value without the lie: every listing ships with the
> concrete on-page SEO rules it passes (keyword front-loaded, full title length, 13
> long-tail tags, keyword in the meta) — **shown, not promised.** Keep it that way.

## What's inside

| Piece | Where | What it does |
|---|---|---|
| Optimizer engine | `lib/generator.ts` | Pure, deterministic. Builds a front-loaded title, fills every tag slot with long-tail phrases (varying the core noun to respect Etsy's 20-char cap), writes a keyword-led description + meta, and scores the result against 5 checkable SEO rules. **No API key, no per-call cost.** |
| Marketplace rules | `lib/platforms.ts` | Real Etsy / Shopify / Amazon limits (title length, tag count, tag char cap) so output is paste-ready per platform. |
| Keyword vocab | `lib/keywords.ts` | Curated buyer-intent modifiers (style / occasion / audience / quality) + text utilities that mirror how shoppers search. |
| SEO tool pages | `lib/tools.ts`, `app/tools/[slug]` | 19 statically-generated free-tool pages ("etsy title generator", "etsy tag generator for jewelry", …) with unique metadata, FAQ + JSON-LD, and a CTA. This is the **programmatic-SEO acquisition engine**. |
| Paywall | `app/api/checkout`, `app/api/license/activate`, `lib/payments.ts`, `lib/entitlement.ts` | Gumroad hosted checkout (merchant of record — handles global sales tax/VAT). Purchase emails a license key; activating it verifies against Gumroad's License API and sets an HMAC-signed Pro cookie, re-verified ~daily so refunds/cancellations revoke access. No config → 24h demo pass. Provider is isolated to `lib/payments.ts`. |
| Free vs Pro | `app/api/generate`, `app/api/generate/bulk` | **Free:** unlimited single-listing optimization (keeps the SEO pages genuinely useful). **Pro ($19/mo):** bulk mode — optimize a whole shop and export a CSV. |
| UI | `app/`, `components/` | Landing (hero + pricing + FAQ + JSON-LD), the live optimizer, the Pro bulk optimizer, and the free-tool pages. |

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run engine:check   # constraint checks over sample products on all 3 platforms
npm run build          # production build (prerenders the 19 SEO pages)
```

Copy `.env.example` to `.env.local` to take real payments:

1. Create a Gumroad **$19/mo membership product** (they are the merchant of record)
   with *"Generate a unique license key per sale"* enabled.
2. Set `GUMROAD_CHECKOUT_URL` (the product's share link), `GUMROAD_PRODUCT_ID`
   (or `GUMROAD_PRODUCT_PERMALINK`), a long random `ENTITLEMENT_SECRET`, and
   `NEXT_PUBLIC_SITE_URL`.
3. Deploy (Vercel works out of the box). Purchase → license key by email → buyer
   activates it at `/app` → signed Pro cookie → bulk mode unlocks.

Without configuration the upgrade button grants a clearly-labelled 24-hour demo pass,
so the entire paywall + bulk flow can be exercised locally.

## Why this can be profitable

- **Proven willingness to pay:** eRank, Marmalead and Alura already charge Etsy sellers
  $20–40/mo for listing SEO. $19/mo is an impulse buy against a shop that costs money to run.
- **Zero marginal cost:** the engine is pure functions; free tool pages are static HTML.
- **Automated acquisition:** each `/tools/*` page targets a real long-tail query and ranks
  while you sleep, funnelling to Pro. Add pages = add funnels, at no serving cost.
- **Self-serve delivery:** no fulfilment, no support-heavy onboarding.

See `BUSINESS-PLAN.md` for the model and `LAUNCH.md` for the step-by-step go-live checklist.

## Disclaimer

ListLift is an SEO/copywriting tool. It does not guarantee marketplace rankings or sales.
Not affiliated with, endorsed by, or sponsored by Etsy, Shopify or Amazon.
