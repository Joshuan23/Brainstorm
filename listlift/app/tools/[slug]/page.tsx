import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Optimizer } from "@/components/Optimizer";
import { UpgradeButton } from "@/components/UpgradeButton";
import { allToolSlugs, getTool } from "@/lib/tools";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return allToolSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `${SITE.url}/tools/${tool.slug}` },
    openGraph: { title: tool.title, description: tool.description, url: `${SITE.url}/tools/${tool.slug}` },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const emphasize = tool.kind === "all" ? undefined : tool.kind;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-x py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="mb-6 text-sm text-muted">
        <Link href="/tools" className="hover:text-slate-100">Free tools</Link> <span className="mx-1">/</span>{" "}
        <span className="text-slate-300">{tool.h1.replace("Free ", "")}</span>
      </nav>

      <h1 className="max-w-3xl text-3xl font-bold text-white sm:text-4xl">{tool.h1}</h1>
      <p className="mt-3 max-w-2xl text-muted">{tool.intro}</p>

      <div className="mt-8">
        <Optimizer
          initialPlatform={tool.platform}
          initialProduct={tool.sampleProduct}
          initialKeyword={tool.sampleKeyword}
          lockedKind={emphasize}
        />
      </div>

      {/* CTA */}
      <div className="mt-10 card flex flex-col items-center gap-4 border-brand/40 text-center">
        <p className="text-lg font-semibold text-white">
          Selling more than one item? Optimize your whole shop at once.
        </p>
        <p className="max-w-xl text-sm text-muted">
          ListLift Pro lets you paste every product and export optimized titles, tags and
          descriptions as a CSV — ${SITE.price}/mo, cancel anytime.
        </p>
        <UpgradeButton className="btn btn-primary" label={`Go Pro — $${SITE.price}/mo`} />
      </div>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">Frequently asked</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {tool.faq.map((f) => (
            <details key={f.q} className="card">
              <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Interlinking for SEO */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-white">More free tools</h2>
        <div className="flex flex-wrap gap-2">
          {allToolSlugs()
            .filter((s) => s !== tool.slug)
            .slice(0, 12)
            .map((slug) => {
              const t = getTool(slug)!;
              return (
                <Link key={slug} href={`/tools/${slug}`} className="chip hover:border-brand">
                  {t.h1.replace("Free ", "")}
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
