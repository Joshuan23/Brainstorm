import Link from "next/link";
import { Dashboard } from "@/components/Dashboard";

export const metadata = { title: "Dashboard — BudSignal" };

export default function DashboardPage() {
  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="brand">
          Bud<span>Signal</span>
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/track-record" className="btn">
            Track record
          </Link>
          <Link href="/#risk" className="btn">
            Risk
          </Link>
        </div>
      </nav>
      <Dashboard />
    </div>
  );
}
