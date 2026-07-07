import { NextRequest, NextResponse } from "next/server";
import { activateLicense } from "@/lib/payments";
import { PRO_COOKIE, signEntitlement } from "@/lib/entitlement";

/**
 * POST /api/license/activate { key } — turn a Gumroad license key (emailed on
 * purchase) into a Pro entitlement cookie. The key is stored in the signed
 * cookie and re-verified about once a day, so a refunded or lapsed
 * subscription loses access automatically.
 */
export async function POST(req: NextRequest) {
  let key = "";
  try {
    const body = (await req.json()) as { key?: string };
    key = (body.key ?? "").trim();
  } catch {
    /* fall through to the length check */
  }
  if (key.length < 8) {
    return NextResponse.json({ error: "Enter the license key from your purchase email." }, { status: 400 });
  }

  const check = await activateLicense(key);
  if (!check.ok) {
    return NextResponse.json(
      { error: "Could not reach the license server — try again in a minute." },
      { status: 502 }
    );
  }
  if (!check.valid) {
    return NextResponse.json({ error: check.reason ?? "Invalid license key." }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const token = signEntitlement({ plan: "pro", key, checkedAt: now, exp: now + 30 * 24 * 3600 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PRO_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 3600,
    path: "/",
  });
  return res;
}
