/**
 * ListLift optimizer engine.
 *
 * Turns a rough product idea + a primary keyword into a paste-ready,
 * search-optimized listing (title, tags, description, meta) for a given
 * marketplace. Pure and deterministic: no network, no per-call cost, so it
 * can serve free SEO tool pages at scale and power the Pro tool identically.
 *
 * Philosophy (mirrors PipSignal's "measured, not promised"): we don't claim
 * to guarantee rankings. We apply the concrete, checkable SEO rules sellers
 * are told to follow — front-loaded keyword, full title-length use, 13
 * long-tail tags, keyword in the first sentence — and we *show* which rules
 * each output passes via a transparent score.
 */

import { getPlatform, Platform, PlatformId } from "./platforms";
import {
  contentWords,
  detectModifiers,
  MODIFIERS,
  titleCase,
} from "./keywords";

export interface OptimizeInput {
  platform: PlatformId;
  /** What the product is, in the seller's own words. */
  product: string;
  /** The main phrase shoppers would type to find it. Inferred when omitted. */
  keyword?: string;
  /** Optional structured attributes that sharpen the output. */
  attributes?: {
    material?: string;
    color?: string;
    style?: string;
    audience?: string;
    occasion?: string;
  };
}

export interface ScoreCheck {
  label: string;
  pass: boolean;
  detail: string;
}

export interface Optimized {
  platform: Platform;
  title: string;
  titleLength: number;
  tags: string[];
  description: string;
  metaDescription: string;
  altText: string;
  score: { total: number; checks: ScoreCheck[] };
  notes: string[];
}

function clampTag(tag: string, max: number): string {
  const t = tag.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  // Trim to whole words within the limit.
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 3 ? cut.slice(0, lastSpace) : cut).trim();
}

function uniquePush(list: string[], seen: Set<string>, value: string): void {
  const key = value.toLowerCase();
  if (!value || seen.has(key)) return;
  seen.add(key);
  list.push(value);
}

/** A candidate tag survives if, once clamped to the char limit, it still reads
 *  as a real phrase (didn't collapse to just the head or a bare fragment). */
function pushTag(tags: string[], seen: Set<string>, raw: string, head: string, max: number): void {
  const clamped = clampTag(raw, max);
  if (!clamped || clamped.length < 3) return;
  // Reject candidates that clamped down to exactly the head keyword when they
  // were meant to add something (avoids silent duplicates of the head tag).
  if (clamped.toLowerCase() === head.toLowerCase() && raw.length > head.length) return;
  uniquePush(tags, seen, clamped);
}

/**
 * Build long-tail tag phrases. Etsy caps tags at 20 chars, so for longer head
 * keywords we vary the *core noun* ("gold necklace", "necklace for her")
 * rather than appending to the full phrase — which is how top listings tag.
 */
function buildTags(head: string, pool: string[], platform: Platform): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  const max = platform.tagMaxChars;
  const headWords = head.split(/\s+/).filter(Boolean);
  const noun = headWords[headWords.length - 1] || head;

  // 1. The head keyword itself (the single most important tag).
  pushTag(tags, seen, head, head, max);

  // 2. Modifier + core noun, and full head + modifier where it still fits.
  for (const m of pool) {
    if (tags.length >= platform.tagCount) break;
    if (!headWords.includes(m)) pushTag(tags, seen, `${m} ${noun}`, head, max);
    pushTag(tags, seen, `${head} ${m}`, head, max);
    pushTag(tags, seen, `${noun} ${m}`, head, max);
  }

  // 3. Multi-word pooled modifiers on their own (catch adjacent searches).
  for (const m of pool) {
    if (tags.length >= platform.tagCount) break;
    if (m.includes(" ")) pushTag(tags, seen, m, head, max);
  }

  // 4. Curated fallbacks around the core noun so slots always fill.
  const fallback = [...MODIFIERS.format, ...MODIFIERS.audience, ...MODIFIERS.occasion, ...MODIFIERS.style];
  for (const m of fallback) {
    if (tags.length >= platform.tagCount) break;
    pushTag(tags, seen, `${m} ${noun}`, head, max);
    if (tags.length < platform.tagCount) pushTag(tags, seen, `${noun} ${m}`, head, max);
  }

  return tags.slice(0, platform.tagCount);
}

function buildTitle(
  head: string,
  differentiators: string[],
  platform: Platform
): string {
  // Front-load the primary keyword, then stack differentiators separated by
  // Etsy-friendly "|" / "," until we approach the platform's target length.
  let title = titleCase(head);
  const usedWords = new Set(head.toLowerCase().split(/\s+/));

  for (const d of differentiators) {
    const clean = d.trim();
    if (!clean) continue;
    // Skip differentiators that only repeat words already in the title.
    const dWords = clean.toLowerCase().split(/\s+/);
    if (dWords.every((w) => usedWords.has(w))) continue;

    const sep = platform.id === "amazon" ? " " : " | ";
    const candidate = `${title}${sep}${titleCase(clean)}`;
    if (candidate.length > platform.titleTarget) continue;
    title = candidate;
    dWords.forEach((w) => usedWords.add(w));
  }
  return title.slice(0, platform.titleMax);
}

function buildDescription(
  input: OptimizeInput,
  head: string,
  tags: string[]
): { body: string; meta: string } {
  const { product, attributes = {} } = input;
  const nice = titleCase(head);
  const features: string[] = [];
  if (attributes.material) features.push(`Made from ${attributes.material.trim()}`);
  if (attributes.color) features.push(`Available in ${attributes.color.trim()}`);
  if (attributes.style) features.push(`${titleCase(attributes.style.trim())} style`);
  if (attributes.occasion)
    features.push(`Perfect for ${attributes.occasion.trim()}`);
  if (attributes.audience)
    features.push(`A thoughtful pick ${attributes.audience.trim()}`);
  if (features.length === 0) {
    features.push("Carefully made and quality-checked before it ships");
    features.push("Designed to arrive gift-ready");
  }

  const intro =
    `Looking for the perfect ${head}? This ${product.trim().replace(/\.$/, "")} ` +
    `is a ${nice} made to stand out. Every detail is considered so it looks ` +
    `great the moment it arrives.`;

  const bullets = features.map((f) => `• ${f}`).join("\n");

  const searchLine =
    `Great as ${tags
      .filter((t) => t.toLowerCase() !== head.toLowerCase())
      .slice(0, 3)
      .join(", ")}.`;

  const cta =
    `Add it to your cart today — and message us if you'd like it personalized.`;

  const body = `${intro}\n\n${bullets}\n\n${searchLine}\n\n${cta}`;

  // Meta description: keyword first, ~155-160 chars, single sentence.
  let meta = `${nice} — ${product.trim().replace(/\.$/, "")}. ${searchLine}`;
  meta = meta.replace(/\s+/g, " ").trim();
  if (meta.length > 160) meta = clampTag(meta, 157) + "…";

  return { body, meta };
}

function scoreListing(
  title: string,
  head: string,
  tags: string[],
  meta: string,
  platform: Platform
): { total: number; checks: ScoreCheck[] } {
  const lowerTitle = title.toLowerCase();
  const lowerHead = head.toLowerCase();
  const checks: ScoreCheck[] = [];

  const frontLoaded = lowerTitle.indexOf(lowerHead) >= 0 && lowerTitle.indexOf(lowerHead) < 25;
  checks.push({
    label: "Keyword front-loaded in title",
    pass: frontLoaded,
    detail: frontLoaded
      ? "Primary keyword appears in the first ~25 characters."
      : "Move the primary keyword closer to the start of the title.",
  });

  const lenRatio = title.length / platform.titleTarget;
  const usesLength = lenRatio >= 0.6;
  checks.push({
    label: "Title uses available length",
    pass: usesLength,
    detail: `${title.length}/${platform.titleMax} chars — ${
      usesLength ? "good keyword coverage" : "add more descriptive keywords"
    }.`,
  });

  const enoughTags = tags.length >= Math.min(platform.tagCount, 10);
  checks.push({
    label: `All ${platform.tagCount} tag slots filled`,
    pass: enoughTags,
    detail: `${tags.length}/${platform.tagCount} ${platform.id === "etsy" ? "tags" : "search terms"} generated.`,
  });

  const longTail = tags.filter((t) => t.split(" ").length >= 2).length;
  const diverse = longTail >= Math.ceil(tags.length / 2);
  checks.push({
    label: "Tags are long-tail (multi-word)",
    pass: diverse,
    detail: `${longTail}/${tags.length} tags are multi-word phrases (they convert better).`,
  });

  const metaKeyword = meta.toLowerCase().includes(lowerHead);
  checks.push({
    label: "Keyword in meta description",
    pass: metaKeyword,
    detail: metaKeyword
      ? "Meta description leads with the keyword."
      : "Work the keyword into the meta description.",
  });

  const passed = checks.filter((c) => c.pass).length;
  const total = Math.round((passed / checks.length) * 100);
  return { total, checks };
}

export function optimize(input: OptimizeInput): Optimized {
  const platform = getPlatform(input.platform);
  const head = (input.keyword || contentWords(input.product)[0] || "product")
    .toLowerCase()
    .trim();

  // Assemble the differentiator/modifier pool from attributes, the seller's
  // own words, and curated buyer-intent modifiers.
  const attrs = input.attributes ?? {};
  const attrPool = [attrs.style, attrs.material, attrs.color, attrs.audience, attrs.occasion]
    .filter(Boolean)
    .map((s) => (s as string).toLowerCase().trim());

  const detected = detectModifiers(`${input.product} ${Object.values(attrs).join(" ")}`);
  const productWords = contentWords(input.product).filter((w) => !head.includes(w));

  // Ordered pool: seller-supplied attributes first, then detected modifiers,
  // then a curated spread across style/occasion/audience for long-tail reach.
  const pool = Array.from(
    new Set([
      ...attrPool,
      ...detected,
      ...productWords.slice(0, 3),
      ...MODIFIERS.style.slice(0, 2),
      ...MODIFIERS.occasion.slice(0, 3),
      ...MODIFIERS.audience.slice(0, 3),
      ...MODIFIERS.quality.slice(0, 2),
    ])
  ).filter(Boolean);

  const tags = buildTags(head, pool, platform);
  // Seller-supplied differentiators first; then a curated buyer-intent tail so a
  // thin input still yields a title that uses the marketplace's length (buildTitle
  // stops before the target and skips words already present, so it won't over-stuff).
  const curatedTail = [
    ...MODIFIERS.quality.slice(0, 1),
    ...MODIFIERS.format.slice(0, 2),
    ...MODIFIERS.audience.slice(0, 1),
  ];
  const title = buildTitle(head, [...attrPool, ...detected, ...productWords, ...curatedTail], platform);
  const { body, meta } = buildDescription(input, head, tags);
  const score = scoreListing(title, head, tags, meta, platform);

  const notes: string[] = [];
  if (!input.keyword)
    notes.push("No primary keyword given — inferred one from your product text.");
  if (attrPool.length === 0)
    notes.push("Add material/style/occasion attributes for sharper, higher-converting tags.");

  const altText = `${titleCase(head)} — ${input.product.trim().replace(/\.$/, "")}`.slice(0, 125);

  return {
    platform,
    title,
    titleLength: title.length,
    tags,
    description: body,
    metaDescription: meta,
    altText,
    score,
    notes,
  };
}
