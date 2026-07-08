import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/BuyButton";
import { abs } from "@/lib/site";
import { PRODUCTS, getProduct } from "@/lib/products-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  const title = `${p.name} | Instant Download`;
  const description = p.intro.slice(0, 155);
  const canonical = abs(`/products/${p.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default function ProductPage({ params }: Params) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.intro,
    audience: { "@type": "Audience", audienceType: p.audience },
    offers: {
      "@type": "Offer",
      price: p.priceValue,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: abs(`/products/${p.slug}`),
    },
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="crumbs">
        <Link href="/products">Products</Link> / <span>{p.name}</span>
      </nav>

      <div className="grid">
        <article>
          <header className="hero">
            <h1>{p.name}</h1>
            <p className="lede">{p.tagline}</p>
          </header>

          <p>{p.intro}</p>

          <h2>What's included</h2>
          <ul className="ticks">
            {p.includes.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <h2>FAQ</h2>
          <dl className="faq">
            {p.faqs.map((f, i) => (
              <div key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </article>

        <aside>
          <div className="buy-card">
            <div className="price">{p.price}</div>
            <p className="buy-sub">One-time purchase · instant download · free updates</p>
            <BuyButton slug={p.slug} price={p.price} />
            {p.litePath && (
              <p className="lite">
                Not ready? <a href={p.litePath} download>Download the free lite version</a> to try it.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
