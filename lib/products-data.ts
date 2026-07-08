/**
 * Catalog for Venture B — digital products sold via Lemon Squeezy.
 *
 * Each product is a make-once, sell-infinitely asset. The full asset is
 * delivered by Lemon Squeezy after purchase; a free "lite" file (in /public)
 * drives the funnel by proving value. Per-product checkout URLs are configured
 * via env so keys/products can be swapped without code changes.
 */

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  /** the exact phrase a ready buyer types */
  targetQuery: string;
  price: string;
  priceValue: number;
  audience: string;
  intro: string;
  includes: string[];
  faqs: { q: string; a: string }[];
  /** free lite preview download in /public (optional) */
  litePath?: string;
  /** env var holding the Lemon Squeezy checkout URL for this product */
  checkoutEnv: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "freelance-pricing-profit-calculator",
    name: "Freelance Pricing & Profit Calculator + Client Tracker",
    tagline: "Stop guessing your rates. Know your real hourly profit on every project.",
    targetQuery: "freelance pricing calculator template",
    price: "$24",
    priceValue: 24,
    audience: "freelance designers, photographers, writers, and virtual assistants",
    intro:
      "A focused, single-purpose Google Sheets + Excel system that turns a project scope into a defensible price and shows your true profit per hour — plus a lightweight client tracker so nothing slips. Built for solo service providers who are tired of pricing by gut feel.",
    includes: [
      "Project pricing calculator: rate, hours, expenses, and target margin → recommended price",
      "Real hourly-profit view so you can spot unprofitable clients at a glance",
      "Client tracker: status, deliverables, invoiced vs. paid, next action",
      "Works in Google Sheets and Excel — no login, no subscription",
      "Setup guide + example filled-in project",
    ],
    faqs: [
      {
        q: "Do I need Excel, or does Google Sheets work?",
        a: "Both. You get a Google Sheets version (copy to your Drive) and an .xlsx that opens in Excel or Numbers. No account or subscription required.",
      },
      {
        q: "Is this a subscription?",
        a: "No. It's a one-time purchase and instant download. Updates to the template are free.",
      },
      {
        q: "Can I use it for any freelance service?",
        a: "Yes. It's built around billable time, expenses, and margin, so it fits design, photography, writing, VA work, and most solo service businesses.",
      },
    ],
    litePath: "/products/freelance-pricing-profit-calculator/pricing-calculator-lite.csv",
    checkoutEnv: "LS_CHECKOUT_FREELANCE_PRICING",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
