import { NextResponse } from "next/server";
import { paymentsConfigured } from "@/lib/lemonsqueezy";
import { PRO_COOKIE, signEntitlement } from "@/lib/entitlement";

/**
 * POST /api/checkout — start a Pro purchase.
 *
 * With LEMONSQUEEZY_CHECKOUT_URL configured, sends the buyer to the hosted
 * Lemon Squeezy checkout; the purchase emails them a license key which they
 * activate at /api/license/activate. Without it (local/dev), grants a
 * clearly-labelled "demo-pro" pass so the paywall flow can be exercised.
 */
export async function POST() {
  if (paymentsConfigured()) {
    return NextResponse.json({ url: process.env.LEMONSQUEEZY_CHECKOUT_URL, mode: "lemonsqueezy" });
  }

  // Demo mode: no payment provider configured.
  const token = signEntitlement({
    plan: "demo-pro",
    exp: Math.floor(Date.now() / 1000) + 24 * 3600,
  });
  const res = NextResponse.json({ url: "/dashboard?welcome=demo", mode: "demo" });
  res.cookies.set(PRO_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 3600,
    path: "/",
  });
  return res;
}
