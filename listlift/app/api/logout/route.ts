import { NextResponse } from "next/server";
import { PRO_COOKIE } from "@/lib/entitlement";

/** POST /api/logout — clear the Pro entitlement cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PRO_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
