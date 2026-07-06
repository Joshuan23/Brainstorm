/**
 * Keyword vocabulary + text utilities for the optimizer engine.
 *
 * This is deliberately data-driven rather than AI-driven: the same buyer-intent
 * modifiers that top Etsy/Amazon listings use are curated here, so the engine
 * produces long-tail phrases that mirror how shoppers actually search — with no
 * external API call and no per-generation cost.
 */

/** Words that add no search value in a title/tag and should be dropped. */
export const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "for", "with", "in", "on",
  "at", "by", "from", "this", "that", "is", "are", "be", "your", "you", "it",
  "my", "our", "we", "i", "as", "so", "very", "really", "just", "perfect",
]);

/** Buyer-intent modifiers, grouped. The engine mixes these into tags/titles. */
export const MODIFIERS = {
  style: [
    "minimalist", "boho", "vintage", "modern", "rustic", "aesthetic",
    "cottagecore", "farmhouse", "scandinavian", "retro", "elegant", "cute",
  ],
  quality: [
    "handmade", "custom", "personalized", "unique", "premium", "artisan",
    "small batch", "eco friendly", "reusable",
  ],
  occasion: [
    "birthday", "wedding", "anniversary", "christmas", "valentines day",
    "mothers day", "fathers day", "housewarming", "graduation", "baby shower",
  ],
  audience: [
    "for her", "for him", "for mom", "for wife", "for husband", "for kids",
    "for teachers", "for couples", "for best friend", "for women", "for men",
  ],
  format: [
    "gift", "gift set", "gift idea", "decor", "wall art", "digital download",
    "printable", "bundle", "kit",
  ],
} as const;

export type ModifierGroup = keyof typeof MODIFIERS;

const ALL_MODIFIERS = Object.values(MODIFIERS).flat();

/** Normalize free text into clean lowercase words (keeps letters/numbers). */
export function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Content words from text, stopwords removed, order preserved, de-duplicated. */
export function contentWords(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words(text)) {
    if (STOPWORDS.has(w) || w.length < 2) continue;
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

/** Which curated modifiers already appear in the seller's own copy. */
export function detectModifiers(text: string): string[] {
  const lower = ` ${text.toLowerCase()} `;
  return ALL_MODIFIERS.filter((m) => lower.includes(` ${m} `));
}

/** Title-case a phrase for display in a listing title. */
export function titleCase(phrase: string): string {
  const small = new Set(["for", "and", "or", "the", "a", "an", "of", "to", "with"]);
  return phrase
    .split(/\s+/)
    .map((w, i) =>
      i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
}
