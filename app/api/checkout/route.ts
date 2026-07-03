import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRO_COOKIE, signEntitlement } from "@/lib/entitlement";

/**
 * POST /api/checkout — start a Pro subscription.
 *
 * With STRIPE_SECRET_KEY + STRIPE_PRICE_ID configured, creates a real Stripe
 * Checkout session (subscription mode) and returns its URL. Without keys
 * (local/dev), grants a clearly-labelled "demo-pro" pass so the paywall flow
 * can be exercised end to end.
 */
export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const origin = req.nextUrl.origin;

  if (stripeKey && priceId) {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      allow_promotion_codes: true,
      success_url: `${origin}/api/checkout/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });
    return NextResponse.json({ url: session.url, mode: "stripe" });
  }

  // Demo mode: no payment processor configured.
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
