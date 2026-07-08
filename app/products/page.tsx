import type { Metadata } from "next";
import Link from "next/link";
import { abs } from "@/lib/site";
import { PRODUCTS } from "@/lib/products-data";

export const metadata: Metadata = {
  title: "Pricing Calculator & Business Templates | Instant Download, No Subscription",
  description:
    "Spreadsheet templates for solo businesses: pricing calculators, trackers, and planners you can download and use in minutes. One-time purchase, instant download, no subscription.",
  alternates: { canonical: abs("/products") },
};

export default function ProductsIndex() {
  return (
    <main className="wrap">
      <header className="hero">
        <h1>Pricing calculators &amp; templates for solo businesses.</h1>
        <p className="lede">
          Each template solves one real problem — pricing a job, tracking clients, planning a
          budget — with working formulas you can use the same day. Buy once, download instantly,
          no subscription and no bloated all-in-one system to learn.
        </p>
      </header>

      <ul className="cards">
        {PRODUCTS.map((p) => (
          <li key={p.slug}>
            <h3>{p.name}</h3>
            <p>{p.tagline}</p>
            <div className="card-row">
              <span className="price-sm">{p.price}</span>
              <Link href={`/products/${p.slug}`}>View →</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
