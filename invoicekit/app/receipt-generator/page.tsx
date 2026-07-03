import type { Metadata } from "next";
import Link from "next/link";
import ReceiptGenerator from "@/components/ReceiptGenerator";
import AffiliateSlot from "@/components/AffiliateSlot";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Receipt Generator — make a payment receipt PDF",
  description:
    "Create and download a professional payment receipt in your browser — free, no signup, no watermark. Cash, card, rent, or business receipts with a PAID stamp.",
  alternates: { canonical: "/receipt-generator" },
};

const faqs = [
  {
    q: "What is the difference between an invoice and a receipt?",
    a: "An invoice requests payment before it's made; a receipt confirms payment after it's received. If you're asking a client to pay, use the invoice generator. If they've already paid and need proof, use this receipt generator.",
  },
  {
    q: "Is this receipt generator free?",
    a: "Yes — no signup, no watermark, no charge. The receipt is generated entirely in your browser and drafts are stored only on your device.",
  },
  {
    q: "Can I make a rent receipt or a cash receipt with this?",
    a: "Yes. Set the payment method to Cash for a cash receipt, or describe the line item as 'Rent — [month]' for a rent receipt. The PAID stamp and receipt number make it valid proof of payment.",
  },
  {
    q: "How do I save the receipt as a PDF?",
    a: 'Click "Download PDF / Print" and choose "Save as PDF" in the print dialog. Only the receipt itself prints — the form and site navigation are hidden.',
  },
];

export default function ReceiptGeneratorPage() {
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
    name: "Receipt Generator",
    url: `${SITE_URL}/receipt-generator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="container">
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <div className="page-head">
        <h1>Free Receipt Generator</h1>
        <p>
          Make a clean payment receipt with a PAID stamp and download it as a PDF.
          Perfect for cash payments, rent, and any transaction a customer needs proof
          of. No signup, nothing uploaded.
        </p>
      </div>

      <ReceiptGenerator />

      <AffiliateSlot />

      <div className="prose no-print">
        <h2>When to send a receipt</h2>
        <p>
          Send a receipt the moment a payment clears — especially for cash, where the
          receipt is the only record either side has. A numbered receipt protects you
          in a dispute and makes your business look established, which matters more with
          new customers than most people realize.
        </p>
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

      <div className="prose">
        <p>
          Need to <em>request</em> payment instead? Use the{" "}
          <Link href="/invoice-generator">free invoice generator</Link>.
        </p>
      </div>
    </div>
  );
}
