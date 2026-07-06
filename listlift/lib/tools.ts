/**
 * Programmatic-SEO free-tool catalog.
 *
 * Each entry becomes a statically-rendered page targeting a real, high-intent
 * search query ("etsy title generator", "shopify description generator for
 * candles", ...). The pages cost nothing to serve, rank while you sleep, and
 * funnel to the Pro optimizer — this is the automated acquisition loop.
 */

import { PlatformId, PLATFORMS } from "./platforms";

export type ToolKind = "title" | "tags" | "description" | "all";

export interface Tool {
  slug: string;
  platform: PlatformId;
  kind: ToolKind;
  niche?: string;
  h1: string;
  title: string; // <title> / og
  description: string; // meta description
  intro: string;
  sampleProduct: string;
  sampleKeyword: string;
  faq: { q: string; a: string }[];
}

const KIND_LABEL: Record<ToolKind, string> = {
  title: "Title Generator",
  tags: "Tag Generator",
  description: "Description Generator",
  all: "Listing Optimizer",
};

const NICHE_SAMPLES: Record<string, { product: string; keyword: string }> = {
  jewelry: { product: "dainty gold-plated initial necklace, hypoallergenic", keyword: "initial necklace" },
  candles: { product: "hand-poured soy candle, lavender scent, 8oz amber jar", keyword: "soy candle" },
  "t-shirts": { product: "unisex cotton graphic tee with a retro sunset print", keyword: "retro graphic tee" },
  "wall-art": { product: "printable botanical line-art poster set, digital download", keyword: "botanical wall art" },
  stickers: { product: "waterproof vinyl laptop sticker pack, 10 designs", keyword: "vinyl sticker pack" },
  mugs: { product: "11oz ceramic coffee mug with a funny cat design", keyword: "funny coffee mug" },
};

const GENERIC_SAMPLE = {
  product: "handmade macrame plant hanger in natural cotton",
  keyword: "macrame plant hanger",
};

function faqFor(platform: PlatformId, kind: ToolKind, niche?: string): { q: string; a: string }[] {
  const p = PLATFORMS[platform];
  const thing = niche ? niche.replace(/-/g, " ") : "product";
  const base: { q: string; a: string }[] = [
    {
      q: `Is this ${p.label} ${KIND_LABEL[kind].toLowerCase()} free?`,
      a: `Yes. You can generate optimized ${kind === "tags" ? "tags" : kind === "title" ? "titles" : "listing copy"} for one ${thing} at a time for free. ListLift Pro ($19/mo) unlocks unlimited generations, bulk CSV upload, and saved history.`,
    },
    {
      q: `How does ListLift optimize my ${p.label} listing?`,
      a: `It front-loads your primary keyword, fills all ${p.tagCount} ${platform === "etsy" ? "tag slots" : "search-term slots"} with long-tail phrases shoppers actually search, uses the full ${p.titleMax}-character title limit, and weaves the keyword into a conversion-focused description — then shows you exactly which SEO rules the result passes.`,
    },
    {
      q: `Will this get my ${thing} to the top of search?`,
      a: `No tool can promise rankings, and you should be skeptical of any that does. ListLift applies the concrete, checkable on-page SEO rules ${p.label} sellers are advised to follow and shows you the score — better inputs win, not magic.`,
    },
    {
      q: `Can I use it for other marketplaces?`,
      a: `Yes — switch the platform toggle to generate ${["Etsy", "Shopify", "Amazon"].filter((x) => x.toLowerCase() !== p.label.toLowerCase()).join(" or ")} listings, each within that marketplace's exact character and tag limits.`,
    },
  ];
  return base;
}

function make(platform: PlatformId, kind: ToolKind, niche?: string): Tool {
  const p = PLATFORMS[platform];
  const label = KIND_LABEL[kind];
  const nicheLabel = niche ? ` for ${niche.replace(/-/g, " ")}` : "";
  const nicheTitle = niche
    ? niche.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  const sample = niche && NICHE_SAMPLES[niche] ? NICHE_SAMPLES[niche] : GENERIC_SAMPLE;
  const slug = ["", p.id, kind === "all" ? "listing-optimizer" : `${kind}-generator`, niche]
    .filter(Boolean)
    .join("-")
    .replace(/^-/, "");

  const kindWord = kind === "tags" ? "tags" : kind === "title" ? "titles" : kind === "description" ? "descriptions" : "listings";

  return {
    slug,
    platform,
    kind,
    niche,
    h1: `Free ${p.label} ${label}${niche ? ` for ${nicheTitle}` : ""}`,
    title: `${p.label} ${label}${nicheLabel} — Free & Instant | ListLift`,
    description: `Generate SEO-optimized ${p.label} ${kindWord}${nicheLabel} in seconds. Front-loaded keywords, ${p.tagCount} long-tail tags, and a transparent SEO score. Free to try.`,
    intro: `Paste your ${niche ? niche.replace(/-/g, " ") : "product"} details and a keyword, and ListLift builds a search-ready ${p.label} ${kind === "all" ? "listing" : kindWord.replace(/s$/, "")} that respects ${p.label}'s ${p.titleMax}-character title limit and ${p.tagCount}-tag structure.`,
    sampleProduct: sample.product,
    sampleKeyword: sample.keyword,
    faq: faqFor(platform, kind, niche),
  };
}

const NICHES = ["jewelry", "candles", "t-shirts", "wall-art", "stickers", "mugs"];

/** The full generated catalog of SEO tool pages. */
export const TOOLS: Tool[] = [
  // Core hub pages (highest-volume queries)
  make("etsy", "all"),
  make("etsy", "title"),
  make("etsy", "tags"),
  make("etsy", "description"),
  make("shopify", "all"),
  make("shopify", "description"),
  make("amazon", "title"),
  // Niche long-tail pages (Etsy title + tags per niche)
  ...NICHES.map((n) => make("etsy", "title", n)),
  ...NICHES.map((n) => make("etsy", "tags", n)),
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function allToolSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}
