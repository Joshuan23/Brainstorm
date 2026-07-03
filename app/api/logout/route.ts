import { NextRequest, NextResponse } from "next/server";
import { PRO_COOKIE } from "@/lib/entitlement";

/** POST /api/logout — clear the Pro entitlement cookie (downgrade to free view). */
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PRO_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
