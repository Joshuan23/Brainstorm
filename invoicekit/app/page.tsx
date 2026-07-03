import Link from "next/link";
import AffiliateSlot from "@/components/AffiliateSlot";
import { PROFESSIONS } from "@/lib/professions";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <h1>Make a professional invoice in 60 seconds. Free, forever.</h1>
        <p className="lede">
          Fill in your details, watch the invoice build itself, and download a clean
          PDF. No signup, no watermark, no catch — your data never leaves your browser.
        </p>
        <Link href="/invoice-generator" className="btn btn-primary">
          Create your invoice
        </Link>
        <div className="trust-row">
          No account needed · Works on your phone · Drafts saved on your device
        </div>
      </section>

      <section className="feature-grid">
        <div className="card">
          <h3>Actually free</h3>
          <p>
            No trial that expires, no watermark on the PDF, no email wall before
            download. The tool is free and stays free.
          </p>
        </div>
        <div className="card">
          <h3>Private by design</h3>
          <p>
            The invoice is generated entirely in your browser. We never see your
            clients, your rates, or your totals.
          </p>
        </div>
        <div className="card">
          <h3>Built for your trade</h3>
          <p>
            {PROFESSIONS.length}+ profession-specific templates pre-load realistic
            line items and payment terms, so you start from something sensible.
          </p>
        </div>
      </section>

      <AffiliateSlot />

      <section id="templates">
        <h2 className="section-title">Invoice templates by profession</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 700 }}>
          Each template opens the generator pre-filled with line items, rates, and
          payment terms typical for the trade — plus billing advice specific to how
          that work actually gets invoiced and paid.
        </p>
        <div className="template-grid">
          {PROFESSIONS.map((p) => (
            <Link key={p.slug} href={`/invoice-template/${p.slug}`}>
              {p.name} invoice
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">More free tools</h2>
        <div className="feature-grid">
          <div className="card">
            <h3><Link href="/freelance-rate-calculator">Freelance rate calculator</Link></h3>
            <p>
              Work backwards from the income you want to the hourly rate you must
              charge — accounting for unbillable time, overhead, and taxes.
            </p>
          </div>
          <div className="card">
            <h3><Link href="/invoice-generator">Blank invoice generator</Link></h3>
            <p>
              Start from a clean slate: any currency, tax rates, discounts, and
              unlimited line items. Print or save as PDF.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
