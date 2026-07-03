import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateSlot from "@/components/AffiliateSlot";
import { PROFESSIONS, getProfession, type Profession } from "@/lib/professions";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return PROFESSIONS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getProfession(params.slug);
  if (!p) return {};
  return {
    title: `Free ${p.name} Invoice Template & Generator`,
    description: `Create a professional ${p.name.toLowerCase()} invoice in 60 seconds — free template with realistic line items, payment terms, and billing tips for ${p.plural}. No signup.`,
    alternates: { canonical: `/invoice-template/${p.slug}` },
  };
}

function buildFaqs(p: Profession) {
  return [
    {
      q: `What should a ${p.name.toLowerCase()} invoice include?`,
      a: `Your business name and contact details, the client's billing details, a unique invoice number, invoice and due dates, itemized line items with quantities and rates, any tax, the total due, and payment instructions. For ${p.plural}, typical terms are: ${p.terms}`,
    },
    {
      q: "Is this invoice template really free?",
      a: "Yes. The generator runs entirely in your browser — no signup, no watermark, and no charge to download the PDF. Drafts are stored only on your own device.",
    },
    {
      q: "How do I turn the invoice into a PDF?",
      a: 'Click "Download PDF / Print" and choose "Save as PDF" as the destination in your browser\'s print dialog. The page is styled so only the invoice itself prints.',
    },
    {
      q: `When should ${p.plural} send the invoice?`,
      a: "The day the work (or milestone) completes. Invoices sent within 24 hours of finishing get paid measurably faster than invoices sent at month-end, because the value delivered is still fresh in the client's mind.",
    },
  ];
}

export default function TemplatePage({ params }: Props) {
  const p = getProfession(params.slug);
  if (!p) notFound();

  const faqs = buildFaqs(p);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${p.name} Invoice Generator`,
    url: `${SITE_URL}/invoice-template/${p.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const others = PROFESSIONS.filter((x) => x.slug !== p.slug).slice(0, 8);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <div className="page-head">
        <h1>Free {p.name} Invoice Template</h1>
        <p>{p.intro}</p>
      </div>

      <p style={{ margin: "10px 0 24px" }}>
        <Link href={`/invoice-generator?preset=${p.slug}`} className="btn btn-primary">
          Open the {p.name.toLowerCase()} invoice generator →
        </Link>
      </p>

      <div className="prose">
        <h2>What this template pre-fills for you</h2>
        <p>
          The generator opens with line items {p.plural} actually bill, so you edit
          real examples instead of staring at empty rows:
        </p>
        <ul>
          {p.sampleItems.map((it) => (
            <li key={it.description}>
              {it.description} — qty {it.qty} @ ${it.rate.toLocaleString("en-US")}
            </li>
          ))}
        </ul>
        <p>
          Typical payment terms for {p.plural}: <strong>{p.terms}</strong>
        </p>

        <div className="tip-box">
          <strong>Billing tip for {p.plural}:</strong> {p.tip}
        </div>

        <h2>Frequently asked questions</h2>
      </div>

      <div className="faq">
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <AffiliateSlot />

      <div className="prose">
        <h2>Templates for related trades</h2>
      </div>
      <div className="template-grid">
        {others.map((o) => (
          <Link key={o.slug} href={`/invoice-template/${o.slug}`}>
            {o.name} invoice
          </Link>
        ))}
      </div>
    </div>
  );
}
