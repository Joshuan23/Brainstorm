/**
 * Gumroad license-key paywall.
 *
 * Gumroad is the merchant of record (it handles global sales tax/VAT). When a
 * product has "Generate a unique license key per sale" enabled, each purchase
 * issues a license key; the app grants Pro by verifying that key against
 * Gumroad's public License API — no user database needed. For subscriptions,
 * the verify response reports refunds and subscription status, so access
 * revokes itself when a subscription ends or a purchase is refunded.
 *
 * Swapping providers is intentionally isolated to this one file: it exposes
 * activateLicense / validateLicense / paymentsConfigured, which the API routes
 * and entitlement layer consume without caring who the provider is.
 */

const API = "https://api.gumroad.com/v2/licenses/verify";

export interface LicenseCheck {
  /** false = could not reach the license server (network), not a verdict */
  ok: boolean;
  valid: boolean;
  reason?: string;
}

interface GumroadPurchase {
  refunded?: boolean;
  disputed?: boolean;
  chargebacked?: boolean;
  subscription_failed_at?: string | null;
  subscription_ended_at?: string | null;
  subscription_cancelled_at?: string | null;
}

interface GumroadResponse {
  success?: boolean;
  message?: string;
  uses?: number;
  purchase?: GumroadPurchase;
}

/** Product identifier the verify call is scoped to (set one). */
function productParam(): [string, string] | null {
  const id = process.env.GUMROAD_PRODUCT_ID;
  if (id) return ["product_id", id];
  const permalink = process.env.GUMROAD_PRODUCT_PERMALINK;
  if (permalink) return ["product_permalink", permalink];
  return null;
}

function verdict(data: GumroadResponse): LicenseCheck {
  if (!data.success) {
    return { ok: true, valid: false, reason: data.message ?? "invalid license key" };
  }
  const p = data.purchase ?? {};
  if (p.refunded || p.chargebacked || p.disputed) {
    return { ok: true, valid: false, reason: "this purchase was refunded" };
  }
  // A mere subscription_cancelled_at means the buyer cancelled but keeps access
  // until the paid period ends; only treat a failed/ended subscription as lapsed.
  if (p.subscription_failed_at || p.subscription_ended_at) {
    return { ok: true, valid: false, reason: "subscription is no longer active" };
  }
  return { ok: true, valid: true };
}

async function verify(key: string, increment: boolean): Promise<LicenseCheck> {
  const product = productParam();
  if (!product) return { ok: true, valid: false, reason: "payments are not configured" };

  try {
    const body = new URLSearchParams();
    body.set(product[0], product[1]);
    body.set("license_key", key);
    body.set("increment_uses_count", String(increment));

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    // Gumroad returns 404 with { success:false, message } for an unknown key —
    // that's a verdict, not a transport failure, so parse the body regardless.
    const data = (await res.json()) as GumroadResponse;
    return verdict(data);
  } catch {
    return { ok: false, valid: false, reason: "could not reach the license server" };
  }
}

/** First-time activation (counts one use, like claiming the key). */
export function activateLicense(key: string): Promise<LicenseCheck> {
  return verify(key, true);
}

/** Periodic re-check (does not increment the use count). */
export function validateLicense(key: string): Promise<LicenseCheck> {
  return verify(key, false);
}

/** True when a Gumroad checkout is configured (otherwise demo mode). */
export function paymentsConfigured(): boolean {
  return Boolean(process.env.GUMROAD_CHECKOUT_URL && productParam());
}
