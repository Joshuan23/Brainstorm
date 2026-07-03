import type { Metadata } from "next";
import Link from "next/link";
import RateCalculator from "@/components/RateCalculator";
import AffiliateSlot from "@/components/AffiliateSlot";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator — what should I charge per hour?",
  description:
    "Work backwards from the income you want to the hourly rate you must charge. Accounts for unbillable hours, time off, overhead, and taxes. Free, no signup.",
  alternates: { canonical: "/freelance-rate-calculator" },
};

export default function RateCalculatorPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Freelance Rate Calculator</h1>
        <p>
          Most freelancers set their rate by guessing what the market pays. This
          calculator works the other way: start from the take-home income you want,
          subtract the hours nobody pays for, and see the rate that actually gets you
          there.
        </p>
      </div>

      <RateCalculator />

      <AffiliateSlot />

      <div className="prose">
        <h2>Why your rate is higher than you think</h2>
        <p>
          An employee's $40/hour and a freelancer's $40/hour are completely different
          numbers. As a freelancer you pay for the gaps between projects, the hours
          spent on proposals and admin, your own equipment and software, and the
          employer's share of taxes. A typical freelancer only bills 50–70% of the
          hours they work — which is why the calculator asks for your billable
          percentage instead of assuming every hour earns.
        </p>
        <h2>Three rules of thumb</h2>
        <ul>
          <li>
            <strong>The employee shortcut:</strong> take the equivalent salary's hourly
            rate and multiply by 2–2.5 to cover taxes, benefits, downtime, and overhead.
          </li>
          <li>
            <strong>Raise on demand:</strong> if you're booked more than ~80% of your
            capacity for two straight months, your rate is too low. Raise it for every
            new client until winning slows.
          </li>
          <li>
            <strong>Never quote hourly for defined outcomes:</strong> use this rate as
            your private floor, then quote fixed project prices above it.
          </li>
        </ul>
        <p>
          Once you've set your rate, send the invoice with our{" "}
          <Link href="/invoice-generator">free invoice generator</Link> — no signup,
          straight to PDF.
        </p>
      </div>
    </div>
  );
}
