# InvoiceKit — the 2-hour human setup

Everything in this repo is built. This file is the part I **cannot** do for you,
because it requires a legal person: owning money, owning accounts, and agreeing to
terms. Do these once, in order, and the asset is live and earning-capable. Total
hands-on time: about 2 hours. After this, your involvement drops to a ~30-minute
monthly check.

Nothing below asks you to write code. If a step needs a value pasted into the app,
it's called out as `ENV: NAME=value` — send me those values and I'll wire them in.

---

## Part 1 — Get it online (~40 min)

- [ ] **Buy a domain (~$12/yr).** Namecheap, Cloudflare, or Porkbun. Good patterns:
      something with "invoice" in it (`invoicekit.app`, `freeinvoice.tools`,
      `make-invoice.co`). Exact wording doesn't matter much; keep it short.
      → `ENV: NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- [ ] **Create a Vercel account** (free tier is enough) at vercel.com. Sign up with
      GitHub so it can see this repo.
- [ ] **Import the repo → deploy.** Set the project's **Root Directory to `invoicekit`**
      (this repo has other projects in it). Vercel auto-detects Next.js. Add the
      `NEXT_PUBLIC_SITE_URL` env var. Click deploy.
- [ ] **Point the domain at Vercel.** In Vercel's project → Domains, add your domain
      and follow the DNS instructions it gives you. Done once, permanent.

## Part 2 — Get it found by Google (~20 min)

- [ ] **Google Search Console** (search.google.com/search-console). Add your domain,
      verify via the DNS TXT record Vercel/your registrar makes easy.
- [ ] **Submit the sitemap:** enter `sitemap.xml` in the Sitemaps section. The site
      already generates it with all pages.
- [ ] **Request indexing** on the homepage and 3–4 template pages (paste each URL into
      the top search bar → "Request Indexing"). This nudges Google to crawl sooner.

## Part 3 — Turn on the money (~40 min)

Until these links exist, the site runs fine and simply shows no ads/offers. Revenue
starts only once at least one is live.

- [ ] **Apply to affiliate programs** (each takes ~10 min; approval is 1–7 days):
      - **FreshBooks** partner program — pays per trial/signup, invoicing audience is a
        perfect match.
      - **QuickBooks** — via a network like CJ Affiliate or Impact (search "QuickBooks
        affiliate CJ"). Higher payouts, stricter approval.
      - **Bonsai** or **Found** (freelancer banking/invoicing) — audience-aligned,
        friendlier approval for new sites.
      Provide your real name/business and a payout method (bank/PayPal). This is the
      KYC step only you can do.
      → When approved, each gives you a tracked link. Send me:
      `ENV: NEXT_PUBLIC_AFF_1_NAME=`, `NEXT_PUBLIC_AFF_1_TAGLINE=`, `NEXT_PUBLIC_AFF_1_URL=`
      (and `_2_` for a second). I redeploy and the Partner cards go live.
- [ ] **(Later, at traffic) Display ads.** Once you have steady visits, apply to
      **Ezoic** or **Journey by Mediavine** (low/no traffic minimum). Mediavine proper
      needs ~50k sessions/mo. This is a paste-one-script step — send it to me when you
      have it.

## Part 4 — The one-weekend growth spark (~30 min, do it once)

A brand-new domain with zero inbound links won't rank. A dozen genuine links fixes
that. **Do this as yourself, honestly — never automated, or the domain gets burned:**

- [ ] Answer 5–10 real questions where someone asks how to invoice / what to charge
      (r/freelance, r/smallbusiness, IndieHackers, relevant Facebook groups). Link the
      tool only where it genuinely answers the question.
- [ ] List the site on 3–4 free-tool directories (AlternativeTo, SaaSHub, free-tools
      roundups, "Show HN", Product Hunt once).
- [ ] Drafts for all of the above: ask me and I'll write them ready-to-post.

---

## After launch — your entire ongoing job (~30 min/month)

1. Open Search Console. Look at Performance.
2. Any page getting impressions but ranking low (position 8–20)? Tell me the query —
   I'll strengthen that one page.
3. Any search showing up that has no page yet (e.g. "hvac invoice template free")?
   Tell me — I add it to `professions.ts` in 15 min.

That's the whole loop. The site earns while you don't touch it; you just feed me
signals once a month and I compound the asset.

---

## What only *you* can do, and why (the honest boundary)

I built 100% of the product. I cannot: own a bank account, pass identity/KYC checks,
accept a terms-of-service contract, or post as you on real platforms. Those aren't
access problems — they're legal-person problems that no tool grants. That's the
irreducible ~2 hours above. Everything on the other side of it, I've got.
