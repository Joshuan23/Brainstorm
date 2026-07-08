/**
 * Data for Venture A — programmatic-SEO lead-gen for water-damage / restoration.
 *
 * Pages are generated as service × cause × city. We deliberately target
 * cause-specific + smaller-city long-tail (thin SERPs, high emergency intent,
 * $400+ lead value) rather than the "water damage leads [big city]" head terms
 * owned by large lead-gen aggregators.
 */

export interface Cause {
  slug: string;
  /** e.g. "Burst Pipe Cleanup" */
  name: string;
  /** short intent phrase used in copy, e.g. "a burst pipe" */
  trigger: string;
  intro: string;
  /** immediate, genuinely useful steps a homeowner should take now */
  steps: string[];
  faqs: { q: string; a: string }[];
}

export interface City {
  slug: string;
  name: string;
  state: string;
}

export const CAUSES: Cause[] = [
  {
    slug: "burst-pipe-cleanup",
    name: "Burst Pipe Cleanup",
    trigger: "a burst pipe",
    intro:
      "A burst pipe can release dozens of gallons a minute. Fast water extraction and drying in the first 24–48 hours is what prevents structural damage and mold.",
    steps: [
      "Shut off the main water supply, then open the lowest faucet in the house to drain the lines.",
      "Turn off electricity to affected areas at the breaker if water is near outlets or fixtures.",
      "Move valuables and lift furniture off wet flooring to limit secondary damage.",
      "Photograph everything before cleanup — you'll need it for your insurance claim.",
      "Call a licensed water-damage restoration pro for extraction and structural drying.",
    ],
    faqs: [
      {
        q: "How fast do I need to act after a burst pipe?",
        a: "Aim to begin extraction and drying within 24–48 hours. Mold can begin to grow after about 48 hours on wet materials, which turns a water job into a remediation job.",
      },
      {
        q: "Will homeowners insurance cover a burst pipe?",
        a: "Sudden, accidental water damage from a burst pipe is commonly covered, while gradual leaks often are not. Document the damage with photos and keep receipts. This is general information, not insurance advice — check your policy.",
      },
    ],
  },
  {
    slug: "basement-flood-restoration",
    name: "Basement Flood Restoration",
    trigger: "a flooded basement",
    intro:
      "Standing water in a basement threatens your foundation, electrical, HVAC, and anything stored below grade. Professional extraction plus dehumidification is the difference between drying out and tearing out.",
    steps: [
      "Do not enter standing water if it may be in contact with electrical outlets or the panel — cut power first or call an electrician.",
      "Identify and stop the water source if it's safe (sump failure, groundwater, backup).",
      "Remove water-damaged porous items (cardboard, soaked carpet padding) to slow mold.",
      "Document the water line and damaged contents with photos and video.",
      "Get professional water extraction and structural drying before refinishing anything.",
    ],
    faqs: [
      {
        q: "Is basement flood water dangerous?",
        a: "It can be. Flood water may carry contaminants and can hide electrical hazards. Avoid contact with standing water near outlets and let a professional assess category and safety.",
      },
      {
        q: "Can I just let a flooded basement dry on its own?",
        a: "Air-drying alone rarely removes moisture from behind walls and under floors fast enough to prevent mold. Commercial dehumidifiers and air movers are used to dry the structure, not just the surface.",
      },
    ],
  },
  {
    slug: "sewage-backup-cleanup",
    name: "Sewage Backup Cleanup",
    trigger: "a sewage backup",
    intro:
      "Sewage backups are classified as Category 3 'black water' — they carry bacteria and pathogens and require containment, disinfection, and safe disposal, not a mop and bucket.",
    steps: [
      "Keep people and pets away from the affected area and avoid using drains until it's resolved.",
      "Turn off HVAC so contaminants aren't circulated through the home.",
      "Do not attempt DIY cleanup of large sewage spills — Category 3 water is a health hazard.",
      "Photograph the affected area and contents for your claim.",
      "Call a licensed restoration company equipped for biohazard sewage remediation.",
    ],
    faqs: [
      {
        q: "Why can't I clean up sewage myself?",
        a: "Sewage is Category 3 water containing harmful bacteria and pathogens. Proper cleanup requires PPE, containment, antimicrobial treatment, and safe disposal to protect your health and your home.",
      },
      {
        q: "What gets thrown away after a sewage backup?",
        a: "Porous materials that contacted sewage — carpet, padding, drywall below the water line, and many soft goods — are typically removed and disposed of, then the area is disinfected and dried.",
      },
    ],
  },
  {
    slug: "storm-flood-damage-restoration",
    name: "Storm & Flood Damage Restoration",
    trigger: "storm or flood damage",
    intro:
      "After a storm, water intrusion through the roof, windows, or rising ground water needs rapid extraction and drying to protect the structure and prevent mold — often alongside temporary board-up or tarping.",
    steps: [
      "Ensure the building is safe to enter — watch for structural damage and downed power lines.",
      "Stop ongoing intrusion where safe (tarp a roof leak, board a broken window).",
      "Move belongings to a dry area and discard obviously ruined porous items.",
      "Document all damage thoroughly before cleanup for insurance.",
      "Bring in a restoration crew for water extraction, drying, and mold prevention.",
    ],
    faqs: [
      {
        q: "Does homeowners insurance cover storm flooding?",
        a: "Wind-driven rain and roof damage are often covered by homeowners policies, but rising-water flooding usually requires separate flood insurance. Confirm coverage with your insurer — this is general information, not advice.",
      },
      {
        q: "How soon should storm water be extracted?",
        a: "As soon as it is safe to enter. The first 24–48 hours are critical for preventing mold growth and further structural damage.",
      },
    ],
  },
];

export const CITIES: City[] = [
  { slug: "naperville-il", name: "Naperville", state: "IL" },
  { slug: "round-rock-tx", name: "Round Rock", state: "TX" },
  { slug: "murfreesboro-tn", name: "Murfreesboro", state: "TN" },
  { slug: "bend-or", name: "Bend", state: "OR" },
  { slug: "frederick-md", name: "Frederick", state: "MD" },
  { slug: "olathe-ks", name: "Olathe", state: "KS" },
  { slug: "carmel-in", name: "Carmel", state: "IN" },
  { slug: "rogers-ar", name: "Rogers", state: "AR" },
  { slug: "sandy-ut", name: "Sandy", state: "UT" },
  { slug: "franklin-tn", name: "Franklin", state: "TN" },
  { slug: "apex-nc", name: "Apex", state: "NC" },
  { slug: "leander-tx", name: "Leander", state: "TX" },
  { slug: "meridian-id", name: "Meridian", state: "ID" },
  { slug: "kalamazoo-mi", name: "Kalamazoo", state: "MI" },
  { slug: "wauwatosa-wi", name: "Wauwatosa", state: "WI" },
  { slug: "st-charles-mo", name: "St. Charles", state: "MO" },
  { slug: "loveland-co", name: "Loveland", state: "CO" },
  { slug: "gilbert-az", name: "Gilbert", state: "AZ" },
  { slug: "cary-nc", name: "Cary", state: "NC" },
  { slug: "dublin-oh", name: "Dublin", state: "OH" },
];

export function getCause(slug: string): Cause | undefined {
  return CAUSES.find((c) => c.slug === slug);
}

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/** Every cause × city combination, for generateStaticParams. */
export function allCauseCityParams(): { cause: string; city: string }[] {
  const out: { cause: string; city: string }[] = [];
  for (const c of CAUSES) for (const city of CITIES) out.push({ cause: c.slug, city: city.slug });
  return out;
}
