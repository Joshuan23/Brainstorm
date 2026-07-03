import type { MetadataRoute } from "next";
import { PROFESSIONS } from "@/lib/professions";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/invoice-generator`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/freelance-rate-calculator`, lastModified: now, priority: 0.8 },
    ...PROFESSIONS.map((p) => ({
      url: `${SITE_URL}/invoice-template/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
