import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Create a professional invoice in your browser and download it as a PDF — free, no signup, no watermark. Plus profession-specific invoice templates and a freelance rate calculator.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              Invoice<span>Kit</span>
            </Link>
            <nav className="site-nav">
              <Link href="/invoice-generator">Invoice Generator</Link>
              <Link href="/freelance-rate-calculator">Rate Calculator</Link>
              <Link href="/#templates">Templates</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div>
              © {new Date().getFullYear()} {SITE_NAME}. Free tools for independent
              businesses. Nothing here is legal, tax, or accounting advice.
            </div>
            <div>
              Some links on this site are affiliate links — they cost you nothing and
              keep the tools free.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
