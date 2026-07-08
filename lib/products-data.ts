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
      "Project pricing calculator: rate, hours, expenses, and target margin → recommended price (live formulas, 3 worked examples)",
      "Real hourly-profit view so you can spot unprofitable clients at a glance",
      "Client tracker: status dropdown, invoiced vs. paid, live balance formula, next action, running totals",
      "Master .xlsx (opens in Excel, Numbers, LibreOffice, and imports natively into Google Sheets) plus a per-tab CSV set for Sheets",
      "SETUP.md with full formula key, Google Sheets import steps, and single-user license terms",
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
  {
    slug: "bookkeeper-pricing-package-calculator",
    name: "Bookkeeper Pricing & Package Calculator",
    tagline: "Price your monthly packages with real numbers, not a gut-feel flat rate.",
    targetQuery: "bookkeeper pricing calculator",
    price: "$29",
    priceValue: 29,
    audience: "bookkeepers, virtual bookkeepers, and small accounting/tax practices selling monthly packages",
    intro:
      "A focused Google Sheets + Excel system that turns your package tiers (Starter, Growth, Pro, payroll and catch-up add-ons) into a defensible monthly price — accounting for labor, overhead (software subscriptions, E&O insurance), and target margin — plus a client profitability tracker that flags underpriced clients before renewal. Built for solo and small-team bookkeeping practices that are tired of pricing packages by gut feel.",
    includes: [
      "Package pricing calculator: clients per tier, hours/client, target hourly rate, monthly overhead, and target margin → recommended monthly package price, effective hourly rate, profit/client, and total monthly profit per tier (live formulas, 3 worked example tiers)",
      "Overhead allocation built in, so software subscriptions (QBO, Xero, etc.) and E&O insurance are actually priced into every package instead of eaten as an afterthought",
      "Client profitability tracker: client, package, monthly fee, actual hours, effective hourly rate (live formula), target rate, and an On Target?/Review flag so scope creep gets caught before you renew",
      "Master .xlsx (opens in Excel, Numbers, LibreOffice, and imports natively into Google Sheets) plus a per-tab CSV set for Sheets",
      "SETUP.md with full formula key, guidance on pricing payroll/catch-up cleanup add-ons, Google Sheets import steps, and single-user license terms",
    ],
    faqs: [
      {
        q: "Do I need Excel, or does Google Sheets work?",
        a: "Both. You get a Google Sheets version (copy to your Drive) and an .xlsx that opens in Excel or Numbers. No account or subscription required.",
      },
      {
        q: "How does it handle overhead like software and insurance?",
        a: "You enter your total monthly overhead (bookkeeping software subscriptions, E&O insurance, other fixed costs) once per tier, and the sheet automatically spreads it evenly across the clients on that tier before calculating price and profit.",
      },
      {
        q: "Can I price payroll processing or one-time catch-up cleanup separately?",
        a: "Yes. Give each add-on its own row on the Package Pricing tab with its own hours and overhead share, and it gets the same price-to-profit math as your core monthly packages. SETUP.md walks through this.",
      },
      {
        q: "Is this a subscription?",
        a: "No. It's a one-time purchase and instant download. Updates to the template are free.",
      },
    ],
    litePath: "/products/bookkeeper-pricing-package-calculator/bookkeeper-pricing-lite.csv",
    checkoutEnv: "LS_CHECKOUT_BOOKKEEPER_PRICING",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
