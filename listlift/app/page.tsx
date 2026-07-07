import Link from "next/link";
import { Optimizer } from "@/components/Optimizer";
import { UpgradeButton } from "@/components/UpgradeButton";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const FAQ = [
  {
    q: "Do I need an account or API key?",
    a: "No. The optimizer runs on a built-in engine — no OpenAI key, no signup. Just describe your product and go.",
  },
  {
    q: "What does Pro add?",
    a: `Pro ($${SITE.price}/mo) unlocks bulk mode — paste your whole shop or upload a CSV and optimize every listing at once, then download the results as a spreadsheet. Single-listing optimization stays free forever.`,
  },
  {
    q: "Will this guarantee I rank #1?",
    a: "No honest tool can. ListLift applies the concrete on-page SEO rules Etsy/Shopify/Amazon sellers are told to follow — front-loaded keyword, full title length, long-tail tags — and shows you a transparent score. Better inputs win, not magic.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Billing runs through Gumroad (the merchant of record, so they handle VAT/sales tax). Cancel from your Gumroad receipt and your Pro access ends at the period's end automatically.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: String(SITE.price), priceCurrency: "USD", name: "Pro" },
    ],
    description:
      "AI listing optimizer that generates search-optimized titles, tags and descriptions for Etsy, Shopify and Amazon.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="container-x pt-16 pb-10 text-center">
        <span className="pill mx-auto">For Etsy · Shopify · Amazon sellers</span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Turn a rough product idea into a <span className="h-gradient">listing that ranks</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          ListLift writes search-optimized titles, long-tail tags and conversion-ready
          descriptions in seconds — and shows you exactly which SEO rules each one passes.
          Free to try, no account needed.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href="#try" className="btn btn-primary">Try it free</Link>
          <Link href="/audit" className="btn btn-ghost">Audit my listing →</Link>
        </div>
      </section>

      {/* Live tool */}
      <section id="try" className="container-x py-8">
        <Optimizer initialProduct="hand-poured soy candle, lavender scent, 8oz amber jar" initialKeyword="soy candle" />
      </section>

      {/* How it works */}
      <section className="container-x py-16">
        <h2 className="text-center text-2xl font-bold text-white">Three steps to a better listing</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["1. Describe it", "Type what you're selling in plain words, plus the keyword shoppers search."],
            ["2. Generate", "Get a paste-ready title, all 13 tags, a description and a meta — sized to each marketplace."],
            ["3. Ship & scale", "Copy it in. On Pro, optimize your entire shop in one bulk run and export a CSV."],
          ].map(([t, d]) => (
            <div key={t} className="card">
              <h3 className="font-semibold text-white">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-x py-16">
        <h2 className="text-center text-2xl font-bold text-white">Simple pricing</h2>
        <div className="mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
          <div className="card">
            <p className="text-sm font-semibold text-muted">Free</p>
            <p className="mt-2 text-3xl font-bold text-white">$0</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>✓ Unlimited single-listing optimization</li>
              <li>✓ All 3 marketplaces</li>
              <li>✓ Transparent SEO score</li>
              <li>✓ No account, no API key</li>
            </ul>
            <Link href="#try" className="btn btn-ghost mt-6 w-full">Start free</Link>
          </div>
          <div className="card border-brand/50">
            <p className="text-sm font-semibold text-brand">Pro</p>
            <p className="mt-2 text-3xl font-bold text-white">
              ${SITE.price}<span className="text-base font-normal text-muted">/mo</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>✓ Everything in Free</li>
              <li>✓ Bulk: optimize your whole shop at once</li>
              <li>✓ CSV export</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <UpgradeButton className="btn btn-primary mt-6 w-full" label={`Go Pro — $${SITE.price}/mo`} />
          </div>
        </div>
      </section>

      {/* Popular free tools */}
      <section className="container-x py-10">
        <h2 className="text-center text-2xl font-bold text-white">Popular free tools</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {TOOLS.slice(0, 10).map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="chip hover:border-brand">
              {t.h1.replace("Free ", "")}
            </Link>
          ))}
          <Link href="/tools" className="chip border-brand text-brand">See all →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-16">
        <h2 className="text-center text-2xl font-bold text-white">Questions</h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="card">
              <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
