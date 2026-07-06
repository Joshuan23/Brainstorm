import { NextRequest, NextResponse } from "next/server";
import { optimize, OptimizeInput } from "@/lib/generator";
import { PLATFORMS } from "@/lib/platforms";

/**
 * POST /api/generate — optimize a single listing.
 *
 * Public and free: this powers every SEO tool page as well as the in-app
 * optimizer. It's pure and deterministic (no external cost), so keeping it
 * open is what makes the free pages rank and convert. Pro is sold on *bulk*
 * (see /api/generate/bulk), not on gating this.
 */
export async function POST(req: NextRequest) {
  let body: Partial<OptimizeInput> = {};
  try {
    body = (await req.json()) as Partial<OptimizeInput>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const platform = body.platform && PLATFORMS[body.platform] ? body.platform : "etsy";
  const product = (body.product ?? "").toString().slice(0, 600).trim();
  const keyword = (body.keyword ?? "").toString().slice(0, 120).trim();

  if (product.length < 3) {
    return NextResponse.json(
      { error: "Describe your product in a few words to generate a listing." },
      { status: 400 }
    );
  }

  const result = optimize({
    platform,
    product,
    keyword,
    attributes: sanitizeAttrs(body.attributes),
  });

  return NextResponse.json({ result });
}

function sanitizeAttrs(attrs: OptimizeInput["attributes"]): OptimizeInput["attributes"] {
  if (!attrs || typeof attrs !== "object") return undefined;
  const clean: Record<string, string> = {};
  for (const k of ["material", "color", "style", "audience", "occasion"] as const) {
    const v = attrs[k];
    if (typeof v === "string" && v.trim()) clean[k] = v.slice(0, 80).trim();
  }
  return Object.keys(clean).length ? clean : undefined;
}
