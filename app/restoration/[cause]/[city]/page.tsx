import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { abs } from "@/lib/site";
import { CAUSES, CITIES, allCauseCityParams, getCause, getCity } from "@/lib/restoration-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCauseCityParams();
}

type Params = { params: { cause: string; city: string } };

export function generateMetadata({ params }: Params): Metadata {
  const cause = getCause(params.cause);
  const city = getCity(params.city);
  if (!cause || !city) return {};
  const title = `${cause.name} in ${city.name}, ${city.state} | 24/7 Emergency Restoration`;
  const description = `Dealing with ${cause.trigger} in ${city.name}, ${city.state}? Get matched with a licensed local water-damage restoration pro for fast extraction and drying. What to do right now + emergency callback.`;
  const canonical = abs(`/restoration/${cause.slug}/${city.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article" },
  };
}

export default function Page({ params }: Params) {
  const cause = getCause(params.cause);
  const city = getCity(params.city);
  if (!cause || !city) notFound();

  const nearby = CITIES.filter((c) => c.slug !== city.slug).slice(0, 6);
  const otherCauses = CAUSES.filter((c) => c.slug !== cause.slug);
  const h1 = `${cause.name} in ${city.name}, ${city.state}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        serviceType: cause.name,
        areaServed: { "@type": "City", name: `${city.name}, ${city.state}` },
        provider: { "@type": "Organization", name: "Restoration Match" },
        description: cause.intro,
      },
      {
        "@type": "FAQPage",
        mainEntity: cause.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="crumbs">
        <Link href="/restoration">Restoration</Link> / <span>{cause.name}</span> / <span>{city.name}, {city.state}</span>
      </nav>

      <header className="hero">
        <span className="badge">24/7 emergency response</span>
        <h1>{h1}</h1>
        <p className="lede">{cause.intro}</p>
      </header>

      <div className="grid">
        <article>
          <h2>What to do right now</h2>
          <ol className="steps">
            {cause.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          <h2>Why act fast in {city.name}</h2>
          <p>
            The first 24–48 hours after {cause.trigger} determine whether you're looking at drying and
            repair or full mold remediation. A local {city.name}, {city.state} restoration crew can
            begin water extraction and structural drying quickly — the sooner moisture is removed from
            walls, floors, and framing, the less you'll pay in secondary damage.
          </p>

          <h2>Frequently asked questions</h2>
          <dl className="faq">
            {cause.faqs.map((f, i) => (
              <div key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>

          <section className="related">
            <h2>Other emergencies we help with in {city.name}</h2>
            <ul>
              {otherCauses.map((c) => (
                <li key={c.slug}>
                  <Link href={`/restoration/${c.slug}/${city.slug}`}>
                    {c.name} in {city.name}, {city.state}
                  </Link>
                </li>
              ))}
            </ul>
            <h2>{cause.name} in nearby cities</h2>
            <ul className="cols">
              {nearby.map((c) => (
                <li key={c.slug}>
                  <Link href={`/restoration/${cause.slug}/${c.slug}`}>
                    {cause.name} in {c.name}, {c.state}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside>
          <LeadForm cause={cause.slug} city={city.slug} />
        </aside>
      </div>

      <footer className="disclaimer">
        <p>
          Restoration Match is a free referral service that connects homeowners with independent,
          licensed restoration contractors. We are not a restoration company and do not provide
          emergency services ourselves. In a life-threatening emergency, call 911.
        </p>
      </footer>
    </main>
  );
}
