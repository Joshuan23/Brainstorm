import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products-data";

/**
 * POST /api/products/checkout — start a digital-product purchase (Venture B).
 *
 * Returns the product's Lemon Squeezy hosted checkout URL when configured
 * (env var named by the product's `checkoutEnv`). Lemon Squeezy is the merchant
 * of record and delivers the file/license after purchase. Unconfigured → a demo
 * message so the flow is visible in development.
 */
export async function POST(req: Request) {
  let slug: string | undefined;
  try {
    ({ slug } = (await req.json()) as { slug?: string });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const product = slug ? getProduct(slug) : undefined;
  if (!product) {
    return NextResponse.json({ error: "unknown product" }, { status: 404 });
  }

  const url = process.env[product.checkoutEnv];
  if (url) {
    return NextResponse.json({ url, mode: "lemonsqueezy" });
  }

  return NextResponse.json({
    mode: "demo",
    message:
      "Checkout isn't wired to Lemon Squeezy yet. Set the product's checkout URL env var to take real payments. Meanwhile, try the free lite version below.",
  });
}
