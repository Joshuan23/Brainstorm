/**
 * Listing audit engine.
 *
 * Scores an existing listing a seller pastes in (title + optional tags +
 * description) against the same checkable on-page SEO rules the optimizer
 * uses, surfaces the specific problems with fixes, and produces the optimized
 * "after" version for a side-by-side comparison. This is a free acquisition
 * funnel: the audit is honest and genuinely useful, and the "after" is the CTA.
 */

import { getPlatform, Platform, PlatformId } from "./platforms";
import { contentWords } from "./keywords";
import { optimize, Optimized } from "./generator";

export interface AuditInput {
  platform: PlatformId;
  title: string;
  /** Current tags, if the seller pastes them (comma/newline separated upstream). */
  tags?: string[];
  description?: string;
  /** Primary keyword; inferred from the title when omitted. */
  keyword?: string;
}

export interface AuditIssue {
  severity: "high" | "medium" | "low";
  label: string;
  detail: string;
}

export interface AuditResult {
  platform: Platform;
  keyword: string;
  beforeScore: number;
  issues: AuditIssue[];
  strengths: string[];
  /** The optimized rewrite — the reason to sign up. */
  improved: Optimized;
}

interface Rule {
  ok: boolean;
  strength: string; // shown when ok
  issue?: Omit<AuditIssue, never>; // shown when not ok
}

export function auditListing(input: AuditInput): AuditResult {
  const platform = getPlatform(input.platform);
  const title = (input.title || "").trim();
  const tags = (input.tags || []).map((t) => t.trim()).filter(Boolean);
  const description = (input.description || "").trim();

  const titleWords = contentWords(title);
  const keyword = (input.keyword || titleWords.slice(0, 2).join(" ") || "product").toLowerCase().trim();
  const lowerTitle = title.toLowerCase();

  const rules: Rule[] = [];

  // 1. Keyword front-loaded.
  {
    const idx = lowerTitle.indexOf(keyword);
    const ok = idx >= 0 && idx < 25;
    rules.push({
      ok,
      strength: "Your main keyword is near the front of the title.",
      issue: {
        severity: "high",
        label: "Keyword is buried in the title",
        detail: `Move "${keyword}" into the first few words — ${platform.label} weights the start of the title most heavily.`,
      },
    });
  }

  // 2. Title length usage.
  {
    const ratio = title.length / platform.titleTarget;
    const ok = ratio >= 0.6;
    rules.push({
      ok,
      strength: `Title uses its length well (${title.length}/${platform.titleMax} chars).`,
      issue: {
        severity: "high",
        label: "Title is too short",
        detail: `You're using ${title.length} of ${platform.titleMax} characters. Add descriptive, searchable words — every unused character is missed reach.`,
      },
    });
  }

  // 3. Tag slots filled (skip gracefully if the seller didn't paste tags).
  if (platform.tagCount > 0) {
    const provided = tags.length;
    const ok = provided >= Math.min(platform.tagCount, 10);
    rules.push({
      ok,
      strength: `You're using ${provided}/${platform.tagCount} ${platform.id === "etsy" ? "tags" : "search terms"}.`,
      issue: {
        severity: "high",
        label:
          provided === 0
            ? "No tags detected"
            : `Only ${provided}/${platform.tagCount} tag slots used`,
        detail: `Fill every one of the ${platform.tagCount} slots. Empty slots are free search real estate you're giving up.`,
      },
    });

    // 4. Long-tail tags.
    if (provided > 0) {
      const longTail = tags.filter((t) => t.split(/\s+/).length >= 2).length;
      const ok2 = longTail >= Math.ceil(provided / 2);
      rules.push({
        ok: ok2,
        strength: "Good mix of multi-word, long-tail tags.",
        issue: {
          severity: "medium",
          label: "Tags are mostly single words",
          detail: "Single-word tags face the most competition. Multi-word phrases (\"soy candle gift\") match buyer searches and convert better.",
        },
      });

      // 5. Tags within char limit.
      const overLong = tags.filter((t) => t.length > platform.tagMaxChars).length;
      rules.push({
        ok: overLong === 0,
        strength: "All tags fit the character limit.",
        issue: {
          severity: "low",
          label: `${overLong} tag(s) exceed the ${platform.tagMaxChars}-char limit`,
          detail: `${platform.label} truncates or rejects over-long tags — trim them so they index cleanly.`,
        },
      });
    }
  }

  // 6. All-caps / spammy title.
  {
    const letters = title.replace(/[^a-zA-Z]/g, "");
    const caps = title.replace(/[^A-Z]/g, "").length;
    const ok = letters.length === 0 || caps / letters.length < 0.5;
    rules.push({
      ok,
      strength: "Title casing looks natural.",
      issue: {
        severity: "medium",
        label: "Title uses too many capitals",
        detail: "ALL-CAPS titles read as spam to shoppers and don't help ranking. Use Title Case instead.",
      },
    });
  }

  // 7. Keyword stuffing (same content word repeated 3+ times).
  {
    const raw = title.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    const freq = new Map<string, number>();
    for (const w of raw) if (w.length > 2) freq.set(w, (freq.get(w) ?? 0) + 1);
    const stuffed = [...freq.values()].some((n) => n >= 3);
    rules.push({
      ok: !stuffed,
      strength: "No obvious keyword stuffing.",
      issue: {
        severity: "medium",
        label: "Possible keyword stuffing",
        detail: "A word repeats 3+ times in the title. Repetition doesn't boost ranking and hurts readability — vary your phrasing.",
      },
    });
  }

  // 8. Description quality.
  {
    const hasKeyword = description.toLowerCase().includes(keyword);
    const ok = description.length >= 120 && hasKeyword;
    rules.push({
      ok,
      strength: "Description is substantial and includes your keyword.",
      issue: {
        severity: description.length < 120 ? "high" : "medium",
        label: description.length < 40 ? "Description is thin or missing" : "Description could work harder",
        detail:
          description.length < 120
            ? "Write at least a solid paragraph. Lead with the keyword and cover materials, sizing, and gifting."
            : "Work the primary keyword into the first sentence so search and shoppers both see it immediately.",
      },
    });
  }

  const passed = rules.filter((r) => r.ok).length;
  const beforeScore = Math.round((passed / rules.length) * 100);
  const issues = rules
    .filter((r) => !r.ok && r.issue)
    .map((r) => r.issue as AuditIssue)
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  const strengths = rules.filter((r) => r.ok).map((r) => r.strength);

  // The "after": feed the current title + description into the optimizer.
  const improved = optimize({
    platform: input.platform,
    product: [title, description].filter(Boolean).join(". ").slice(0, 600) || title,
    keyword,
  });

  return { platform, keyword, beforeScore, issues, strengths, improved };
}

function severityRank(s: AuditIssue["severity"]): number {
  return s === "high" ? 3 : s === "medium" ? 2 : 1;
}
