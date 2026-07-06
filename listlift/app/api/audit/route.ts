import { NextRequest, NextResponse } from "next/server";
import { auditListing, AuditInput } from "@/lib/audit";
import { PLATFORMS } from "@/lib/platforms";

/**
 * POST /api/audit — free listing audit.
 *
 * Public: this is an acquisition funnel. The seller pastes their current
 * listing and gets an honest score + fixes + the optimized rewrite (the CTA).
 */
export async function POST(req: NextRequest) {
  let body: Partial<AuditInput> & { tagsText?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const platform = body.platform && PLATFORMS[body.platform] ? body.platform : "etsy";
  const title = (body.title ?? "").toString().slice(0, 300).trim();
  if (title.length < 3) {
    return NextResponse.json({ error: "Paste your current listing title to run an audit." }, { status: 400 });
  }

  // Accept tags as an array or as a raw comma/newline-separated string.
  let tags: string[] = Array.isArray(body.tags) ? body.tags : [];
  if (typeof body.tagsText === "string") {
    tags = body.tagsText.split(/[\n,]/).map((t) => t.trim()).filter(Boolean);
  }
  tags = tags.slice(0, 30).map((t) => t.slice(0, 60));

  const result = auditListing({
    platform,
    title,
    tags,
    description: (body.description ?? "").toString().slice(0, 2000).trim(),
    keyword: (body.keyword ?? "").toString().slice(0, 120).trim() || undefined,
  });

  return NextResponse.json({ result });
}
