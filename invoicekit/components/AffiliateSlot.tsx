import { getAffiliateOffers } from "@/lib/site";

/**
 * Renders configured affiliate offers, or nothing when none are set.
 * Disclosure lives in the visible "Partner" label and the site footer.
 */
export default function AffiliateSlot() {
  const offers = getAffiliateOffers();
  if (offers.length === 0) return null;
  return (
    <div className="aff-slot">
      {offers.map((o) => (
        <div className="aff-card" key={o.url}>
          <div className="aff-label">Partner</div>
          <h4>{o.name}</h4>
          <p>{o.tagline}</p>
          <a
            className="btn btn-primary"
            href={o.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Learn more
          </a>
        </div>
      ))}
    </div>
  );
}
