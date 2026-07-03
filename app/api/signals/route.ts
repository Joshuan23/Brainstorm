import { NextResponse } from "next/server";
import { getDailySeries } from "@/lib/data";
import { backtest, BacktestStats } from "@/lib/backtest";
import { buildSignal, Signal } from "@/lib/signals";
import { FREE_PAIR_IDS, PAIRS } from "@/lib/pairs";
import { currentEntitlement, Entitlement, PRO_COOKIE, signEntitlement } from "@/lib/entitlement";
import { validateLicense } from "@/lib/lemonsqueezy";

export const dynamic = "force-dynamic";

const RECHECK_SECONDS = 24 * 3600;

/**
 * Re-validate a license-backed entitlement roughly once a day so a cancelled
 * subscription loses access. Returns the (possibly refreshed) entitlement and
 * a cookie value to set: a new token on success, "" to clear on revocation,
 * or null to leave the cookie alone (fresh enough, demo pass, or the license
 * server was unreachable — fail open and retry on the next request).
 */
async function refreshEntitlement(
  ent: Entitlement | null
): Promise<{ ent: Entitlement | null; setCookie: string | null }> {
  if (!ent || ent.plan !== "pro" || !ent.key) return { ent, setCookie: null };
  const now = Math.floor(Date.now() / 1000);
  if (now - (ent.checkedAt ?? 0) < RECHECK_SECONDS) return { ent, setCookie: null };

  const check = await validateLicense(ent.key);
  if (check.ok && !check.valid) return { ent: null, setCookie: "" };
  if (check.ok && check.valid) {
    const refreshed: Entitlement = { ...ent, checkedAt: now, exp: now + 30 * 24 * 3600 };
    return { ent: refreshed, setCookie: signEntitlement(refreshed) };
  }
  return { ent, setCookie: null };
}

export interface PairPayload {
  signal: Signal;
  backtest: BacktestStats;
  /** last ~90 sessions for the sparkline */
  spark: { dates: string[]; closes: number[] };
  locked: false;
}

export interface LockedPayload {
  pairId: string;
  label: string;
  locked: true;
}

export async function GET() {
  const { ent, setCookie } = await refreshEntitlement(currentEntitlement());
  const isPro = ent !== null;

  const results = await Promise.all(
    PAIRS.map(async (pair) => {
      const unlocked = isPro || FREE_PAIR_IDS.includes(pair.id);
      if (!unlocked) {
        return { pairId: pair.id, label: pair.label, locked: true } satisfies LockedPayload;
      }
      const series = await getDailySeries(pair);
      const signal = buildSignal(pair, series.dates, series.closes, series.source);
      const stats = backtest(series.closes);
      const n = series.closes.length;
      const from = Math.max(0, n - 90);
      return {
        signal,
        backtest: stats,
        spark: { dates: series.dates.slice(from), closes: series.closes.slice(from) },
        locked: false,
      } satisfies PairPayload;
    })
  );

  const res = NextResponse.json({
    plan: isPro ? ent!.plan : "free",
    pairs: results,
    generatedAt: new Date().toISOString(),
  });
  if (setCookie === "") {
    res.cookies.set(PRO_COOKIE, "", { maxAge: 0, path: "/" });
  } else if (setCookie) {
    res.cookies.set(PRO_COOKIE, setCookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 3600,
      path: "/",
    });
  }
  return res;
}
