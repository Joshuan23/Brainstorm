import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request received | Restoration Match",
  description: "We received your restoration request — a local pro will call shortly.",
  robots: { index: false },
};

export default function RestorationThanksPage() {
  return (
    <main className="wrap">
      <header className="hero">
        <span className="badge">Request received</span>
        <h1>You're all set — a local pro will call shortly.</h1>
        <p className="lede">
          Thanks for reaching out. We're matching your request with a licensed, local
          restoration contractor now. Keep your phone handy — most homeowners hear back fast,
          especially for active water damage.
        </p>
      </header>

      <section>
        <h2>What happens next</h2>
        <ul className="ticks">
          <li>A local restoration pro reviews your details and calls or texts you directly.</li>
          <li>You're never obligated to hire anyone who reaches out — get a quote first.</li>
          <li>No pro available in your area yet? We'll keep your request on file and follow up.</li>
        </ul>
      </section>

      <footer className="disclaimer">
        <p>
          Restoration Match is a free referral service that connects homeowners with independent,
          licensed restoration contractors. We are not a restoration company and do not provide
          emergency services ourselves. In a life-threatening emergency, call 911. For active
          flooding, shut off your water main first.
        </p>
        <p style={{ marginTop: 12 }}>
          <Link href="/restoration">← Back to restoration help</Link>
        </p>
      </footer>
    </main>
  );
}
