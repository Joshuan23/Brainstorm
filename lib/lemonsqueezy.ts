/**
 * Lemon Squeezy license-key paywall.
 *
 * Lemon Squeezy is the merchant of record (it handles global sales tax/VAT).
 * Each purchase issues a license key by email; the app grants Pro by
 * activating/validating that key against the public License API — no user
 * database needed, and keys go invalid automatically when a subscription
 * lapses, so access revokes itself on cancellation.
 */

const API = "https://api.lemonsqueezy.com/v1/licenses";

export interface LicenseCheck {
  /** false = could not reach the license server (network), not a verdict */
  ok: boolean;
  valid: boolean;
  reason?: string;
}

interface LsResponse {
  activated?: boolean;
  valid?: boolean;
  error?: string | null;
  license_key?: { status?: string };
  meta?: { store_id?: number | string; product_id?: number | string };
}

async function post(path: string, body: Record<string, string>): Promise<LsResponse> {
  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  // The license endpoints return 400 with an `error` field for bad keys —
  // that's a verdict, not a transport failure.
  return (await res.json()) as LsResponse;
}

function verdict(data: LsResponse, passed: boolean): LicenseCheck {
  if (!passed) return { ok: true, valid: false, reason: data.error ?? "invalid license key" };

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const productId = process.env.LEMONSQUEEZY_PRODUCT_ID;
  if (storeId && String(data.meta?.store_id) !== storeId) {
    return { ok: true, valid: false, reason: "license key belongs to a different store" };
  }
  if (productId && String(data.meta?.product_id) !== productId) {
    return { ok: true, valid: false, reason: "license key is for a different product" };
  }
  const status = data.license_key?.status;
  if (status === "expired" || status === "disabled") {
    return { ok: true, valid: false, reason: `license is ${status}` };
  }
  return { ok: true, valid: true };
}

/** First-time activation. Falls back to validate when the activation limit is hit
 *  (e.g. the buyer signs in from a second browser). */
export async function activateLicense(key: string): Promise<LicenseCheck> {
  try {
    const act = await post("activate", { license_key: key, instance_name: "pipsignal-web" });
    if (act.activated) return verdict(act, true);
    if (typeof act.error === "string" && /activation limit/i.test(act.error)) {
      const val = await post("validate", { license_key: key });
      return verdict(val, val.valid === true);
    }
    return verdict(act, false);
  } catch {
    return { ok: false, valid: false, reason: "could not reach the license server" };
  }
}

/** Periodic re-check (does not consume an activation). */
export async function validateLicense(key: string): Promise<LicenseCheck> {
  try {
    const val = await post("validate", { license_key: key });
    return verdict(val, val.valid === true);
  } catch {
    return { ok: false, valid: false, reason: "could not reach the license server" };
  }
}

/** True when a Lemon Squeezy checkout is configured (otherwise demo mode). */
export function paymentsConfigured(): boolean {
  return Boolean(process.env.LEMONSQUEEZY_CHECKOUT_URL);
}
