import type { Metadata } from "next";
import { Optimizer } from "@/components/Optimizer";
import { BulkOptimizer } from "@/components/BulkOptimizer";
import { UpgradeButton } from "@/components/UpgradeButton";
import { LicenseForm } from "@/components/LicenseForm";
import { currentEntitlement } from "@/lib/entitlement";
import { paymentsConfigured } from "@/lib/lemonsqueezy";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "ListLift app — optimize your listings",
  description: "Generate and bulk-optimize search-ready Etsy, Shopify and Amazon listings.",
  robots: { index: false },
};

export default function AppPage() {
  const ent = currentEntitlement();
  const isPro = ent !== null;
  const configured = paymentsConfigured();

  return (
    <div className="container-x py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Optimizer</h1>
          <p className="text-sm text-muted">
            {isPro ? (
              <>You're on <span className="text-good">{ent?.plan === "demo-pro" ? "Pro (demo)" : "Pro"}</span>. Bulk mode unlocked below.</>
            ) : (
              "Free plan — unlimited single-listing optimization."
            )}
          </p>
        </div>
        {isPro && (
          <form action="/api/logout" method="post">
            <button className="text-xs text-muted hover:text-slate-200">Sign out</button>
          </form>
        )}
      </div>

      <Optimizer />

      <div className="mt-10">
        {isPro ? (
          <BulkOptimizer />
        ) : (
          <div className="card border-brand/40">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="pill text-brand">Pro</span>
              <h2 className="text-xl font-semibold text-white">Optimize your whole shop at once</h2>
              <p className="max-w-xl text-sm text-muted">
                Paste every product, get optimized titles, tags and descriptions for all of them,
                and export a CSV. ${SITE.price}/mo, cancel anytime.
              </p>
              <UpgradeButton
                className="btn btn-primary"
                label={configured ? `Go Pro — $${SITE.price}/mo` : "Try Pro (demo pass)"}
              />
              <div className="mt-2 w-full max-w-md">
                <p className="label text-center">Already bought? Activate your license key</p>
                <LicenseForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
