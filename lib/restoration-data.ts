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
  {
    slug: "mold-remediation",
    name: "Mold Remediation",
    trigger: "mold from water damage",
    intro:
      "Mold can start growing on wet materials within a couple of days of water exposure. Remediation means fixing the moisture source, containing the affected area, and removing mold-damaged material — not just wiping visible spots.",
    steps: [
      "Identify and fix the moisture source first — mold will return if the underlying leak or humidity isn't resolved.",
      "Increase ventilation, but avoid aggressively disturbing visible mold, which can release spores into the air.",
      "Close off the affected room or area if you can, to limit spread to the rest of the home.",
      "Photograph the affected area and note any history of water damage or leaks for your records.",
      "For mold covering more than a small patch, or mold inside HVAC ducts or wall cavities, call a licensed mold remediation professional rather than treating it yourself.",
    ],
    faqs: [
      {
        q: "Can I clean small mold spots myself?",
        a: "Small, isolated mold on a non-porous, hard surface can sometimes be cleaned with soap and water or a mild bleach solution. But if mold covers a larger area, keeps coming back, or is on a porous material like drywall or carpet, it generally needs professional remediation and the moisture source needs to be fixed.",
      },
      {
        q: "Does homeowners insurance cover mold remediation?",
        a: "It depends on the cause. Mold resulting from a sudden, covered event like a burst pipe is more often covered than mold from long-term humidity or a leak that went unaddressed. Check your specific policy — this is general information, not insurance advice.",
      },
    ],
  },
  {
    slug: "fire-smoke-damage-restoration",
    name: "Fire & Smoke Damage Restoration",
    trigger: "fire and smoke damage",
    intro:
      "Fire damage isn't just burned material — soot is acidic and can etch or stain surfaces within hours, smoke odor penetrates porous materials, and water from firefighting efforts often needs extraction too. Fast, correct handling limits how much you lose.",
    steps: [
      "Do not re-enter the building until the fire department confirms it's safe — watch for structural damage and hidden hot spots.",
      "Ventilate the space once it's safe to do so, to start clearing smoke odor and airborne soot.",
      "Avoid wiping soot-covered surfaces with a household cleaner or bare cloth — dry soot can smear and permanently stain fabric and finishes if handled the wrong way.",
      "Document damage room by room with photos and video before any cleanup begins, for your insurance claim.",
      "Call a fire and smoke restoration professional for soot removal, odor treatment, and extraction of any water used to fight the fire.",
    ],
    faqs: [
      {
        q: "Why can't I just clean up soot myself?",
        a: "Dry soot is acidic and can permanently stain or etch fabrics, walls, and finishes if wiped with the wrong cleaner or technique. Restoration professionals use dry chemical sponges and a specific cleaning sequence to avoid spreading residue further.",
      },
      {
        q: "Will the smoke smell go away on its own?",
        a: "Light, surface-level smoke odor may fade with ventilation and basic cleaning, but odor that has penetrated porous materials like carpet, drywall, or insulation usually needs specialized deodorization — such as thermal fogging or sealing — to fully resolve.",
      },
    ],
  },
  {
    slug: "appliance-leak-cleanup",
    name: "Appliance Leak Cleanup",
    trigger: "an appliance leak",
    intro:
      "Leaks from a dishwasher, washing machine, or water heater are often slow and hidden behind or under the appliance, which means water can spread into flooring and subfloor for days or weeks before anyone notices.",
    steps: [
      "Shut off the water supply valve behind the appliance, or the home's main shutoff if you can't locate it.",
      "Unplug the appliance if it's safe to do so, especially if water is pooling near an outlet.",
      "Carefully pull the appliance out to see how far the water has spread underneath and behind it.",
      "Photograph the leak source and any visible damage to flooring, cabinetry, or the subfloor.",
      "If water has been sitting for more than a few hours, or has soaked into flooring or subfloor, call a water-damage restoration professional for extraction and drying.",
    ],
    faqs: [
      {
        q: "How do I know if an appliance leak caused hidden damage?",
        a: "Warped or soft flooring, a musty smell, or discoloration near the appliance are signs that water has spread beneath or behind it. Because appliance leaks are often slow, moisture can sit unnoticed for weeks before symptoms show up.",
      },
      {
        q: "Is a water heater leak covered by insurance?",
        a: "A sudden water heater failure is often covered, but damage from a leak that developed gradually due to lack of maintenance is less likely to be. Check your specific policy — this is general information, not insurance advice.",
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
  { slug: "chandler-az", name: "Chandler", state: "AZ" },
  { slug: "tempe-az", name: "Tempe", state: "AZ" },
  { slug: "peoria-az", name: "Peoria", state: "AZ" },
  { slug: "surprise-az", name: "Surprise", state: "AZ" },
  { slug: "yuma-az", name: "Yuma", state: "AZ" },
  { slug: "flagstaff-az", name: "Flagstaff", state: "AZ" },
  { slug: "fayetteville-ar", name: "Fayetteville", state: "AR" },
  { slug: "bentonville-ar", name: "Bentonville", state: "AR" },
  { slug: "conway-ar", name: "Conway", state: "AR" },
  { slug: "fontana-ca", name: "Fontana", state: "CA" },
  { slug: "visalia-ca", name: "Visalia", state: "CA" },
  { slug: "chico-ca", name: "Chico", state: "CA" },
  { slug: "vacaville-ca", name: "Vacaville", state: "CA" },
  { slug: "turlock-ca", name: "Turlock", state: "CA" },
  { slug: "fort-collins-co", name: "Fort Collins", state: "CO" },
  { slug: "boulder-co", name: "Boulder", state: "CO" },
  { slug: "aurora-co", name: "Aurora", state: "CO" },
  { slug: "longmont-co", name: "Longmont", state: "CO" },
  { slug: "greeley-co", name: "Greeley", state: "CO" },
  { slug: "manchester-ct", name: "Manchester", state: "CT" },
  { slug: "newark-de", name: "Newark", state: "DE" },
  { slug: "dover-de", name: "Dover", state: "DE" },
  { slug: "ocala-fl", name: "Ocala", state: "FL" },
  { slug: "gainesville-fl", name: "Gainesville", state: "FL" },
  { slug: "pensacola-fl", name: "Pensacola", state: "FL" },
  { slug: "port-st-lucie-fl", name: "Port St. Lucie", state: "FL" },
  { slug: "kennesaw-ga", name: "Kennesaw", state: "GA" },
  { slug: "marietta-ga", name: "Marietta", state: "GA" },
  { slug: "alpharetta-ga", name: "Alpharetta", state: "GA" },
  { slug: "warner-robins-ga", name: "Warner Robins", state: "GA" },
  { slug: "boise-id", name: "Boise", state: "ID" },
  { slug: "idaho-falls-id", name: "Idaho Falls", state: "ID" },
  { slug: "coeur-dalene-id", name: "Coeur d'Alene", state: "ID" },
  { slug: "bloomington-il", name: "Bloomington", state: "IL" },
  { slug: "champaign-il", name: "Champaign", state: "IL" },
  { slug: "rockford-il", name: "Rockford", state: "IL" },
  { slug: "elgin-il", name: "Elgin", state: "IL" },
  { slug: "evansville-in", name: "Evansville", state: "IN" },
  { slug: "fishers-in", name: "Fishers", state: "IN" },
  { slug: "bloomington-in", name: "Bloomington", state: "IN" },
  { slug: "cedar-rapids-ia", name: "Cedar Rapids", state: "IA" },
  { slug: "davenport-ia", name: "Davenport", state: "IA" },
  { slug: "ames-ia", name: "Ames", state: "IA" },
  { slug: "topeka-ks", name: "Topeka", state: "KS" },
  { slug: "lawrence-ks", name: "Lawrence", state: "KS" },
  { slug: "wichita-ks", name: "Wichita", state: "KS" },
  { slug: "bowling-green-ky", name: "Bowling Green", state: "KY" },
  { slug: "owensboro-ky", name: "Owensboro", state: "KY" },
  { slug: "lafayette-la", name: "Lafayette", state: "LA" },
  { slug: "bangor-me", name: "Bangor", state: "ME" },
  { slug: "portland-me", name: "Portland", state: "ME" },
  { slug: "rockville-md", name: "Rockville", state: "MD" },
  { slug: "gaithersburg-md", name: "Gaithersburg", state: "MD" },
  { slug: "ann-arbor-mi", name: "Ann Arbor", state: "MI" },
  { slug: "grand-rapids-mi", name: "Grand Rapids", state: "MI" },
  { slug: "lansing-mi", name: "Lansing", state: "MI" },
  { slug: "rochester-mn", name: "Rochester", state: "MN" },
  { slug: "st-cloud-mn", name: "St. Cloud", state: "MN" },
  { slug: "eagan-mn", name: "Eagan", state: "MN" },
  { slug: "columbia-mo", name: "Columbia", state: "MO" },
  { slug: "springfield-mo", name: "Springfield", state: "MO" },
  { slug: "billings-mt", name: "Billings", state: "MT" },
  { slug: "missoula-mt", name: "Missoula", state: "MT" },
  { slug: "lincoln-ne", name: "Lincoln", state: "NE" },
  { slug: "kearney-ne", name: "Kearney", state: "NE" },
  { slug: "reno-nv", name: "Reno", state: "NV" },
  { slug: "henderson-nv", name: "Henderson", state: "NV" },
  { slug: "manchester-nh", name: "Manchester", state: "NH" },
  { slug: "nashua-nh", name: "Nashua", state: "NH" },
  { slug: "edison-nj", name: "Edison", state: "NJ" },
  { slug: "cherry-hill-nj", name: "Cherry Hill", state: "NJ" },
  { slug: "santa-fe-nm", name: "Santa Fe", state: "NM" },
  { slug: "las-cruces-nm", name: "Las Cruces", state: "NM" },
  { slug: "albany-ny", name: "Albany", state: "NY" },
  { slug: "syracuse-ny", name: "Syracuse", state: "NY" },
  { slug: "rochester-ny", name: "Rochester", state: "NY" },
  { slug: "asheville-nc", name: "Asheville", state: "NC" },
  { slug: "wilmington-nc", name: "Wilmington", state: "NC" },
  { slug: "durham-nc", name: "Durham", state: "NC" },
  { slug: "fargo-nd", name: "Fargo", state: "ND" },
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

/** Full names for the US state postal abbreviations used in CITIES. */
const STATE_NAMES: Record<string, string> = {
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  IA: "Iowa",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  MD: "Maryland",
  ME: "Maine",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  MT: "Montana",
  NC: "North Carolina",
  ND: "North Dakota",
  NE: "Nebraska",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NV: "Nevada",
  NY: "New York",
  OH: "Ohio",
  OR: "Oregon",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  WI: "Wisconsin",
};

export interface State {
  /** URL-safe slug for the state hub, e.g. "il" */
  slug: string;
  /** postal abbreviation, e.g. "IL" */
  abbr: string;
  /** full name, e.g. "Illinois" */
  name: string;
  cities: City[];
}

/** Returns the lowercase URL slug for a city's state, e.g. "il". */
export function stateOf(city: City): string {
  return city.state.toLowerCase();
}

/** Distinct states derived from CITIES, each with its own list of cities. */
export const STATES: State[] = Array.from(new Set(CITIES.map((c) => c.state)))
  .sort()
  .map((abbr) => ({
    slug: abbr.toLowerCase(),
    abbr,
    name: STATE_NAMES[abbr] ?? abbr,
    cities: CITIES.filter((c) => c.state === abbr),
  }));

export function getState(slug: string): State | undefined {
  return STATES.find((s) => s.slug === slug);
}

/** Every state slug, for generateStaticParams. */
export function allStateParams(): { state: string }[] {
  return STATES.map((s) => ({ state: s.slug }));
}
