import type { Metadata } from "next";
import Link from "next/link";
import { abs } from "@/lib/site";
import { CAUSES, CITIES, STATES } from "@/lib/restoration-data";

export const metadata: Metadata = {
  title: "Emergency Water Damage & Restoration Help by City | Restoration Match",
  description:
    "Burst pipe, flooded basement, sewage backup, or storm damage? Find what to do right now and get matched with a licensed local restoration pro. Fast, free referral.",
  alternates: { canonical: abs("/restoration") },
};

export default function RestorationHub() {
  return (
    <main className="wrap">
      <header className="hero">
        <span className="badge">24/7 emergency response</span>
        <h1>Water damage? Get matched with a local restoration pro.</h1>
        <p className="lede">
          Pick what happened for immediate steps and a fast callback from a licensed, local
          restoration contractor. Acting within the first 24–48 hours is what prevents mold and
          structural damage.
        </p>
      </header>

      <section className="related">
        <h2>Emergencies we help with</h2>
        <ul className="cards">
          {CAUSES.map((c) => (
            <li key={c.slug}>
              <h3>{c.name}</h3>
              <p>{c.intro}</p>
              <Link href={`/restoration/${c.slug}/${CITIES[0].slug}`}>See {c.name.toLowerCase()} help →</Link>
            </li>
          ))}
        </ul>

        <h2>Browse by state</h2>
        <p>
          Every state below has its own hub page listing all {CAUSES.length} emergencies across
          every city we cover there — the fastest way to find your city.
        </p>
        <ul className="cols">
          {STATES.map((state) => (
            <li key={state.slug}>
              <Link href={`/restoration/state/${state.slug}`}>
                {state.name} ({state.cities.length} {state.cities.length === 1 ? "city" : "cities"})
              </Link>
            </li>
          ))}
        </ul>

        <h2>Cities we cover</h2>
        <ul className="cols">
          {CITIES.map((city) => (
            <li key={city.slug}>
              <Link href={`/restoration/${CAUSES[0].slug}/${city.slug}`}>
                {city.name}, {city.state}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="disclaimer">
        <p>
          Restoration Match is a free referral service that connects homeowners with independent,
          licensed restoration contractors. We are not a restoration company. In a life-threatening
          emergency, call 911.
        </p>
      </footer>
    </main>
  );
}
