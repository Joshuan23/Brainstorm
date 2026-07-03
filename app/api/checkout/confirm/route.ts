import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRO_COOKIE, signEntitlement } from "@/lib/entitlement";

/**
 * GET /api/checkout/confirm?session_id=... — Stripe Checkout success URL.
 * Verifies the session server-side with Stripe before granting Pro. The
 * entitlement cookie lasts 30 days; renewal is re-verified on the next visit.
 */
export async function GET(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const origin = req.nextUrl.origin;

  if (!stripeKey || !sessionId) {
    return NextResponse.redirect(`${origin}/?checkout=invalid`);
  }

  const stripe = new Stripe(stripeKey);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.redirect(`${origin}/?checkout=invalid`);
  }

  const paid =
    session.status === "complete" &&
    (session.payment_status === "paid" || session.payment_status === "no_payment_required");
  if (!paid) {
    return NextResponse.redirect(`${origin}/?checkout=incomplete`);
  }

  const token = signEntitlement({
    plan: "pro",
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
  });
  const res = NextResponse.redirect(`${origin}/dashboard?welcome=pro`);
  res.cookies.set(PRO_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 3600,
    path: "/",
  });
  return res;
}
