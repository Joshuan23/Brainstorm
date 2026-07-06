import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "ListLift — AI listing optimizer for Etsy, Shopify & Amazon",
    template: "%s",
  },
  description:
    "Turn a rough product idea into a search-optimized Etsy, Shopify or Amazon listing in seconds — front-loaded titles, long-tail tags, and a transparent SEO score. Free to try.",
  openGraph: {
    title: "ListLift — AI listing optimizer for online sellers",
    description:
      "Search-optimized titles, tags & descriptions for Etsy, Shopify and Amazon. Free to try, $19/mo for bulk.",
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-edge">
          <div className="container-x flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-white">
              List<span className="h-gradient">Lift</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-muted">
              <Link href="/audit" className="hover:text-slate-100">Free audit</Link>
              <Link href="/tools" className="hover:text-slate-100">Free tools</Link>
              <Link href="/#pricing" className="hover:text-slate-100">Pricing</Link>
              <Link href="/app" className="btn btn-primary px-4 py-2">Open app</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-edge py-10 text-sm text-muted">
          <div className="container-x flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {SITE.name}. Not affiliated with Etsy, Shopify or Amazon.</p>
            <div className="flex gap-4">
              <Link href="/tools" className="hover:text-slate-100">Free tools</Link>
              <Link href="/app" className="hover:text-slate-100">App</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
