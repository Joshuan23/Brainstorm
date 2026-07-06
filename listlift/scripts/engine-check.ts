/**
 * Engine check: exercises the optimizer over sample products on every platform
 * and asserts the marketplace constraints hold. Run with `npm run engine:check`.
 */

import { optimize, OptimizeInput } from "../lib/generator";
import { PLATFORMS, PlatformId } from "../lib/platforms";
import { TOOLS } from "../lib/tools";

let failures = 0;
function check(name: string, cond: boolean, detail = "") {
  const mark = cond ? "✓" : "✗";
  if (!cond) failures++;
  console.log(`  ${mark} ${name}${detail ? ` — ${detail}` : ""}`);
}

const samples: OptimizeInput[] = [
  { platform: "etsy", product: "hand-poured soy candle, lavender scent, 8oz amber jar", keyword: "soy candle" },
  { platform: "etsy", product: "dainty gold-plated initial necklace, hypoallergenic", keyword: "initial necklace", attributes: { style: "minimalist", occasion: "birthday", audience: "for her" } },
  { platform: "shopify", product: "unisex cotton graphic tee with a retro sunset print", keyword: "retro graphic tee" },
  { platform: "amazon", product: "stainless steel insulated water bottle 32oz leakproof", keyword: "insulated water bottle" },
  { platform: "etsy", product: "printable botanical wall art set" }, // no keyword -> inferred
];

console.log("ListLift engine check\n");

for (const input of samples) {
  const p = PLATFORMS[input.platform as PlatformId];
  const r = optimize(input);
  console.log(`• ${p.label}: "${input.keyword || "(inferred)"}"`);
  check("title within char limit", r.title.length <= p.titleMax, `${r.title.length}/${p.titleMax}`);
  check("title non-empty", r.title.trim().length > 0);
  check("tag count filled", r.tags.length === p.tagCount, `${r.tags.length}/${p.tagCount}`);
  check("tags within char limit", r.tags.every((t) => t.length <= p.tagMaxChars));
  check("tags unique", new Set(r.tags.map((t) => t.toLowerCase())).size === r.tags.length);
  check("description non-trivial", r.description.length > 80);
  check("meta within ~160", r.metaDescription.length <= 161, `${r.metaDescription.length}`);
  check("score computed", r.score.total >= 0 && r.score.total <= 100, `${r.score.total}`);
  check("keyword in title", r.title.toLowerCase().includes((input.keyword || r.tags[0]).toLowerCase().split(" ")[0]));
  console.log("");
}

// Catalog sanity: every tool page has a unique slug and renders required fields.
console.log(`• Tool catalog (${TOOLS.length} pages)`);
const slugs = TOOLS.map((t) => t.slug);
check("slugs unique", new Set(slugs).size === slugs.length);
check("every tool has title + faq", TOOLS.every((t) => t.title && t.faq.length >= 3));
check("every tool has a working sample", TOOLS.every((t) => optimize({ platform: t.platform, product: t.sampleProduct, keyword: t.sampleKeyword }).title.length > 0));
console.log("");

if (failures > 0) {
  console.error(`FAILED: ${failures} check(s) failed.`);
  process.exit(1);
}
console.log("All engine checks passed.");
