import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BudSignal — free Bitcoin & crypto signals, measured not promised",
  description:
    "Free daily Bitcoin and crypto signals from a transparent multi-indicator confluence engine, with every setup's historical win rate measured live by walk-forward backtest. Not financial advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
