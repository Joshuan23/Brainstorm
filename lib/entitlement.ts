import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Lightweight paywall entitlement: after a verified Stripe Checkout, we set a
 * signed, expiring cookie. No user database needed for the MVP. For a full
 * launch, replace with real accounts + Stripe webhooks (see README roadmap).
 */

export const PRO_COOKIE = "ps_pro";

function secret(): string {
  return process.env.ENTITLEMENT_SECRET || "dev-only-secret-change-me";
}

export interface Entitlement {
  plan: "pro" | "demo-pro";
  exp: number; // unix seconds
}

export function signEntitlement(ent: Entitlement): string {
  const payload = Buffer.from(JSON.stringify(ent)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyEntitlement(token: string | undefined): Entitlement | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const ent = JSON.parse(Buffer.from(payload, "base64url").toString()) as Entitlement;
    if (typeof ent.exp !== "number" || ent.exp * 1000 < Date.now()) return null;
    if (ent.plan !== "pro" && ent.plan !== "demo-pro") return null;
    return ent;
  } catch {
    return null;
  }
}

export function currentEntitlement(): Entitlement | null {
  const token = cookies().get(PRO_COOKIE)?.value;
  return verifyEntitlement(token);
}
