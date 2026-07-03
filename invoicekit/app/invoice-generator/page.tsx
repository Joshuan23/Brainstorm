import type { Metadata } from "next";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import AffiliateSlot from "@/components/AffiliateSlot";
import { getProfession } from "@/lib/professions";

export const metadata: Metadata = {
  title: "Free Invoice Generator — no signup, no watermark",
  description:
    "Create and download a professional PDF invoice in your browser. Free invoice maker with tax, discounts, and multiple currencies. No account required.",
  alternates: { canonical: "/invoice-generator" },
};

export default function GeneratorPage({
  searchParams,
}: {
  searchParams: { preset?: string };
}) {
  const profession = searchParams.preset ? getProfession(searchParams.preset) : undefined;
  const preset = profession
    ? { items: profession.sampleItems, notes: `Payment terms: ${profession.terms}` }
    : undefined;

  return (
    <div className="container">
      <div className="page-head">
        <h1>
          {profession ? `${profession.name} Invoice Generator` : "Free Invoice Generator"}
        </h1>
        <p>
          Fill in the form — the invoice updates live. When it looks right, hit
          “Download PDF / Print”. Everything runs in your browser; nothing is uploaded.
        </p>
      </div>

      <InvoiceGenerator preset={preset} />

      <AffiliateSlot />

      <div className="prose no-print">
        <h2>How to use this invoice generator</h2>
        <ul>
          <li>Add your business details and your client’s billing contact.</li>
          <li>List each product or service as its own line item — itemized invoices get questioned less and paid faster.</li>
          <li>Set a due date. “Due on receipt” or net 7–14 days is standard for small businesses; net 30 is common with larger companies.</li>
          <li>Use the notes field for payment instructions (bank details, payment link) and your late-fee policy.</li>
          <li>Click <em>Download PDF / Print</em> and choose “Save as PDF” in the print dialog.</li>
        </ul>
      </div>
    </div>
  );
}
