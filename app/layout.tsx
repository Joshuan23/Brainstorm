import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PipSignal — transparent forex signals, measured not promised",
  description:
    "Daily forex signals from a transparent multi-indicator confluence engine, with every setup's historical win rate measured by walk-forward backtest. Not financial advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
