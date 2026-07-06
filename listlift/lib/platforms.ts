/**
 * Marketplace constraints. These are the real limits sellers must respect;
 * the generator uses them so output is paste-ready per platform.
 */

export type PlatformId = "etsy" | "shopify" | "amazon";

export interface Platform {
  id: PlatformId;
  label: string;
  /** Max characters a title/listing name may use. */
  titleMax: number;
  /** Sweet-spot title length to aim for (search + readability). */
  titleTarget: number;
  /** How many tags/keywords the platform accepts. 0 = no discrete tag field. */
  tagCount: number;
  /** Max characters per individual tag (Etsy caps at 20). */
  tagMaxChars: number;
  /** Recommended SEO meta-description length. */
  metaTarget: number;
  /** Label used for the tag field in the UI. */
  tagLabel: string;
  blurb: string;
}

export const PLATFORMS: Record<PlatformId, Platform> = {
  etsy: {
    id: "etsy",
    label: "Etsy",
    titleMax: 140,
    titleTarget: 130,
    tagCount: 13,
    tagMaxChars: 20,
    metaTarget: 160,
    tagLabel: "Tags (13 max, 20 chars each)",
    blurb: "Etsy search rewards front-loaded keywords and 13 long-tail tags.",
  },
  shopify: {
    id: "shopify",
    label: "Shopify",
    titleMax: 70,
    titleTarget: 60,
    tagCount: 10,
    tagMaxChars: 40,
    metaTarget: 155,
    tagLabel: "Product tags / collections",
    blurb: "Shopify SEO leans on a tight title tag and a compelling meta description.",
  },
  amazon: {
    id: "amazon",
    label: "Amazon",
    titleMax: 200,
    titleTarget: 180,
    tagCount: 7,
    tagMaxChars: 50,
    metaTarget: 200,
    tagLabel: "Backend search terms",
    blurb: "Amazon rewards a keyword-dense title plus hidden backend search terms.",
  },
};

export function getPlatform(id: string): Platform {
  return PLATFORMS[(id as PlatformId)] ?? PLATFORMS.etsy;
}
