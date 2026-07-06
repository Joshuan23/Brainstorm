import { NextRequest, NextResponse } from "next/server";
import { optimize, OptimizeInput, Optimized } from "@/lib/generator";
import { PLATFORMS, PlatformId } from "@/lib/platforms";
import { currentEntitlement } from "@/lib/entitlement";

/**
 * POST /api/generate/bulk — optimize many listings at once.
 *
 * This is the Pro feature: paste a whole shop's worth of products and get a
 * download-ready CSV back. Gated on a valid Pro/demo entitlement.
 */
const MAX_ITEMS = 200;

export async function POST(req: NextRequest) {
  const ent = currentEntitlement();
  if (!ent) {
    return NextResponse.json(
      { error: "Bulk optimization is a Pro feature. Upgrade to unlock it." },
      { status: 402 }
    );
  }

  let body: { platform?: PlatformId; items?: { product?: string; keyword?: string }[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const platform: PlatformId = body.platform && PLATFORMS[body.platform] ? body.platform : "etsy";
  const items = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Add at least one product row." }, { status: 400 });
  }

  const results: Optimized[] = [];
  for (const item of items) {
    const product = (item.product ?? "").toString().slice(0, 600).trim();
    if (product.length < 3) continue;
    const input: OptimizeInput = {
      platform,
      product,
      keyword: (item.keyword ?? "").toString().slice(0, 120).trim(),
    };
    results.push(optimize(input));
  }

  return NextResponse.json({ results, csv: toCsv(results) });
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function toCsv(results: Optimized[]): string {
  const header = ["title", "tags", "description", "meta_description", "seo_score"].join(",");
  const rows = results.map((r) =>
    [
      csvCell(r.title),
      csvCell(r.tags.join(", ")),
      csvCell(r.description.replace(/\n/g, " ")),
      csvCell(r.metaDescription),
      String(r.score.total),
    ].join(",")
  );
  return [header, ...rows].join("\n");
}
