import type { Metadata } from "next";
import { Auditor } from "@/components/Auditor";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Etsy Listing Audit — score & fix your listing | ListLift",
  description:
    "Paste your Etsy, Shopify or Amazon listing and get a free SEO audit: a score, the exact problems holding it back, and an optimized rewrite. No account needed.",
  alternates: { canonical: `${SITE.url}/audit` },
};

const FAQ = [
  {
    q: "How does the listing audit work?",
    a: "Paste your current title (and optionally your tags and description). ListLift checks it against the concrete on-page SEO rules that matter — keyword placement, title length, tag coverage, long-tail phrasing, readability — and returns a score, a ranked list of problems, and an optimized rewrite you can copy.",
  },
  {
    q: "Is the audit really free?",
    a: `Yes — auditing and the optimized rewrite for a single listing are free, no account required. Pro ($${SITE.price}/mo) lets you audit and optimize your entire shop in bulk and export a CSV.`,
  },
  {
    q: "Do I need to paste a URL?",
    a: "No — paste the text of your listing directly. That keeps the audit instant, private, and independent of any marketplace blocking automated page fetches.",
  },
  {
    q: "Will a higher score guarantee more sales?",
    a: "No honest tool can promise that. A better score means your listing follows the on-page SEO rules more completely — which improves your odds of being found. Photos, price, reviews and demand still matter.",
  },
];

export default function AuditPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-x py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="mx-auto max-w-3xl text-center">
        <span className="pill mx-auto">Free listing audit</span>
        <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
          Why isn't your listing getting found?
        </h1>
        <p className="mt-4 text-muted">
          Paste your live Etsy, Shopify or Amazon listing and get an honest SEO score, the exact
          problems holding it back, and an optimized rewrite — in seconds, free.
        </p>
      </div>

      <div className="mt-10">
        <Auditor />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Frequently asked</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="card">
              <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
