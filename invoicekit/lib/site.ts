export const SITE_NAME = "InvoiceKit";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
export const SITE_TAGLINE = "Free invoice generator for freelancers & small businesses";

export interface AffiliateOffer {
  name: string;
  tagline: string;
  url: string;
}

/** Affiliate offers from env; slots without a URL are skipped entirely. */
export function getAffiliateOffers(): AffiliateOffer[] {
  const offers: AffiliateOffer[] = [];
  for (const n of ["1", "2"] as const) {
    const url = process.env[`NEXT_PUBLIC_AFF_${n}_URL`];
    const name = process.env[`NEXT_PUBLIC_AFF_${n}_NAME`];
    if (url && name) {
      offers.push({
        name,
        tagline: process.env[`NEXT_PUBLIC_AFF_${n}_TAGLINE`] || "",
        url,
      });
    }
  }
  return offers;
}

export const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
];
