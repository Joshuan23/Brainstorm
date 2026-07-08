/** Canonical site origin, used for metadata canonicals and the sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
).replace(/\/$/, "");

export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
