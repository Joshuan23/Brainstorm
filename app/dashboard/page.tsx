import Link from "next/link";
import { Dashboard } from "@/components/Dashboard";

export const metadata = { title: "Dashboard — PipSignal" };

export default function DashboardPage() {
  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="brand">
          Pip<span>Signal</span>
        </Link>
        <Link href="/#pricing" className="btn">
          Pricing
        </Link>
      </nav>
      <Dashboard />
    </div>
  );
}
