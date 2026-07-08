import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { allCauseCityParams } from "@/lib/restoration-data";
import { PRODUCTS } from "@/lib/products-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/restoration", "/products"];

  const restoration = allCauseCityParams().map(({ cause, city }) => ({
    url: `${SITE_URL}/restoration/${cause}/${city}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const products = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.8,
    })),
    ...restoration,
    ...products,
  ];
}
