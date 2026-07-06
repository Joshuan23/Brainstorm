import type { MetadataRoute } from "next";
import { allToolSlugs } from "@/lib/tools";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/tools`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/app`, lastModified: now, priority: 0.5 },
  ];
  for (const slug of allToolSlugs()) {
    routes.push({ url: `${SITE.url}/tools/${slug}`, lastModified: now, priority: 0.7 });
  }
  return routes;
}
