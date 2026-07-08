import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { abs } from "@/lib/site";
import { CAUSES, STATES, allStateParams, getState } from "@/lib/restoration-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return allStateParams();
}

type Params = { params: { state: string } };

export function generateMetadata({ params }: Params): Metadata {
  const state = getState(params.state);
  if (!state) return {};
  const title = `Water Damage & Restoration Help in ${state.name} | Restoration Match`;
  const description = `Burst pipe, flooded basement, sewage backup, mold, fire, or storm damage in ${state.name}? Find what to do right now and get matched with a licensed local restoration pro in ${state.cities.length} ${state.name} ${state.cities.length === 1 ? "city" : "cities"}.`;
  const canonical = abs(`/restoration/state/${state.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default function StateHub({ params }: Params) {
  const state = getState(params.state);
  if (!state) notFound();

  const otherStates = STATES.filter((s) => s.slug !== state.slug);

  return (
    <main className="wrap">
      <nav className="crumbs">
        <Link href="/restoration">Restoration</Link> / <span>{state.name}</span>
      </nav>

      <header className="hero">
        <span className="badge">24/7 emergency response</span>
        <h1>Water damage &amp; restoration help in {state.name}</h1>
        <p className="lede">
          Pick your city and what happened for immediate steps and a fast callback from a
          licensed, local {state.name} restoration contractor. Acting within the first 24–48
          hours is what prevents mold and structural damage.
        </p>
      </header>

      <section className="related">
        <h2>
          Cities we cover in {state.name}
        </h2>
        {state.cities.map((city) => (
          <div key={city.slug}>
            <h3>
              {city.name}, {city.state}
            </h3>
            <ul className="cols">
              {CAUSES.map((cause) => (
                <li key={cause.slug}>
                  <Link href={`/restoration/${cause.slug}/${city.slug}`}>
                    {cause.name} in {city.name}, {city.state}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Other states we cover</h2>
        <ul className="cols">
          {otherStates.map((s) => (
            <li key={s.slug}>
              <Link href={`/restoration/state/${s.slug}`}>{s.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="disclaimer">
        <p>
          Restoration Match is a free referral service that connects homeowners with independent,
          licensed restoration contractors. We are not a restoration company. In a
          life-threatening emergency, call 911.
        </p>
      </footer>
    </main>
  );
}
