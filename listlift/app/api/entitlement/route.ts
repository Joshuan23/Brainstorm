import { NextResponse } from "next/server";
import { currentEntitlement } from "@/lib/entitlement";
import { paymentsConfigured } from "@/lib/payments";

/** GET /api/entitlement — client checks whether the visitor has Pro. */
export async function GET() {
  const ent = currentEntitlement();
  return NextResponse.json({
    pro: ent !== null,
    plan: ent?.plan ?? null,
    paymentsConfigured: paymentsConfigured(),
  });
}
