import type { Metadata } from "next";
import Link from "next/link";
import { abs } from "@/lib/site";
import { PRODUCTS } from "@/lib/products-data";

export const metadata: Metadata = {
  title: "Templates & Tools for Solo Businesses | Instant Download",
  description:
    "Focused, single-purpose spreadsheet and Notion templates that solve one real problem well. One-time purchase, instant download, no subscription.",
  alternates: { canonical: abs("/products") },
};

export default function ProductsIndex() {
  return (
    <main className="wrap">
      <header className="hero">
        <h1>Templates that solve one problem, well.</h1>
        <p className="lede">
          No bloated all-in-one systems. Each tool is focused, instantly usable, and yours for a
          one-time price — no subscription.
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
