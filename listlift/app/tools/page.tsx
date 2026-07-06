import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { PLATFORMS, PlatformId } from "@/lib/platforms";

export const metadata: Metadata = {
  title: "Free listing tools for Etsy, Shopify & Amazon | ListLift",
  description:
    "Free SEO title, tag and description generators for Etsy, Shopify and Amazon sellers. No account needed.",
};

export default function ToolsIndex() {
  const byPlatform = (["etsy", "shopify", "amazon"] as PlatformId[]).map((id) => ({
    platform: PLATFORMS[id],
    tools: TOOLS.filter((t) => t.platform === id),
  }));

  return (
    <div className="container-x py-16">
      <h1 className="text-3xl font-bold text-white">Free listing tools</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Generate search-optimized titles, tags and descriptions for any marketplace —
        free, instant, and no account required.
      </p>

      {byPlatform.map(({ platform, tools }) => (
        <section key={platform.id} className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-white">{platform.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card transition hover:border-brand">
                <p className="font-semibold text-white">{t.h1.replace("Free ", "")}</p>
                <p className="mt-1.5 text-sm text-muted">{t.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
