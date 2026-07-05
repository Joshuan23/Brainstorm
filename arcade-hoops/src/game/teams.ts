// Original, App-Store-safe teams and players. No real NBA marks — swap these
// for licensed rosters only if you hold the rights.

// Signature-move categories. Each maps to a concrete gameplay effect in
// game.ts (see applySig* helpers). The `label` is the flashy on-court call-out.
export type SigId =
  | "dunkrange" // dunk from way out (Air Walk / Euro Step)
  | "deep" // deadly shooter, ignores distance falloff (Logo Range / Splash)
  | "unblock" // dunks can't be blocked and stun defenders (The Diesel)
  | "lockdown" // boosted steals & blocks (The Glove / Goaltender)
  | "motor" // turbo barely drains, extra speed (Crossover / Fast Break)
  | "general"; // passes can't be intercepted (No-Look / Dime Machine)

export interface Signature {
  id: SigId;
  label: string;
}

export interface PlayerDef {
  name: string;
  num: number;
  // 0..1 attribute ratings that feed the arcade math.
  speed: number;
  shooting: number;
  dunk: number;
  steal: number;
  // Marquee "legend" — gets a gold aura and catches fire one bucket sooner.
  // (Original tribute character; swap `name` for a licensed one only if you
  // hold the rights — see README's branding note.)
  legend?: boolean;
  // Optional signature special move.
  sig?: Signature;
}

export interface TeamDef {
  id: string;
  city: string;
  name: string;
  abbr: string;
  primary: string;
  secondary: string;
  accent: string;
  roster: PlayerDef[];
}

export const TEAMS: TeamDef[] = [
  {
    id: "kings",
    city: "Metro",
    name: "Court Kings",
    abbr: "MET",
    primary: "#f2b418",
    secondary: "#1a1a2e",
    accent: "#ffffff",
    roster: [
      { name: "Ace", num: 3, speed: 0.9, shooting: 0.8, dunk: 0.6, steal: 0.8 },
      { name: "Tower", num: 55, speed: 0.55, shooting: 0.55, dunk: 0.95, steal: 0.5 },
      { name: "Splash", num: 11, speed: 0.75, shooting: 0.95, dunk: 0.5, steal: 0.65 },
    ],
  },
  {
    id: "heat",
    city: "Coastal",
    name: "Riptide",
    abbr: "CST",
    primary: "#e23b2e",
    secondary: "#1a1a2e",
    accent: "#ffd36b",
    roster: [
      { name: "Blaze", num: 7, speed: 0.85, shooting: 0.85, dunk: 0.7, steal: 0.7 },
      { name: "Anchor", num: 40, speed: 0.6, shooting: 0.5, dunk: 0.9, steal: 0.6 },
      { name: "Gale", num: 21, speed: 0.9, shooting: 0.7, dunk: 0.65, steal: 0.85 },
    ],
  },
  {
    id: "volt",
    city: "Neon",
    name: "Voltage",
    abbr: "NEO",
    primary: "#8b5cf6",
    secondary: "#101024",
    accent: "#39e0c8",
    roster: [
      { name: "Spark", num: 1, speed: 0.95, shooting: 0.75, dunk: 0.6, steal: 0.9 },
      { name: "Surge", num: 33, speed: 0.7, shooting: 0.7, dunk: 0.85, steal: 0.6 },
      { name: "Bolt", num: 24, speed: 0.85, shooting: 0.88, dunk: 0.7, steal: 0.7 },
    ],
  },
  {
    id: "frost",
    city: "Summit",
    name: "Avalanche",
    abbr: "SUM",
    primary: "#38bdf8",
    secondary: "#0b2540",
    accent: "#e2f2ff",
    roster: [
      { name: "Chill", num: 6, speed: 0.8, shooting: 0.82, dunk: 0.62, steal: 0.75 },
      { name: "Glacier", num: 50, speed: 0.5, shooting: 0.5, dunk: 0.97, steal: 0.55 },
      { name: "Drift", num: 15, speed: 0.88, shooting: 0.78, dunk: 0.68, steal: 0.8 },
    ],
  },
  {
    id: "grove",
    city: "Emerald",
    name: "Grovers",
    abbr: "EMR",
    primary: "#22c55e",
    secondary: "#0d1f12",
    accent: "#f7f2c9",
    roster: [
      { name: "Vine", num: 8, speed: 0.86, shooting: 0.8, dunk: 0.66, steal: 0.82 },
      { name: "Oak", num: 44, speed: 0.58, shooting: 0.58, dunk: 0.92, steal: 0.58 },
      { name: "Fern", num: 19, speed: 0.82, shooting: 0.9, dunk: 0.55, steal: 0.7 },
    ],
  },
  {
    id: "dusk",
    city: "Crimson",
    name: "Nightfall",
    abbr: "CRM",
    primary: "#f43f5e",
    secondary: "#1c1024",
    accent: "#ffd9e0",
    roster: [
      { name: "Shade", num: 13, speed: 0.9, shooting: 0.83, dunk: 0.72, steal: 0.86 },
      { name: "Eclipse", num: 32, speed: 0.62, shooting: 0.6, dunk: 0.9, steal: 0.6 },
      { name: "Nova", num: 9, speed: 0.84, shooting: 0.92, dunk: 0.6, steal: 0.68 },
    ],
  },
];

// Marquee tribute team headlined by the legendary #23. "Air" is an original
// nickname tribute to the greatest to ever lace them up — kept trademark-safe
// so the game stays App Store shippable. For personal/private builds you may
// change this `name` to the real one; do NOT do so for a published app.
TEAMS.push({
  id: "legends",
  city: "Skyline",
  name: "Legends",
  abbr: "GOAT",
  primary: "#c0122b",
  secondary: "#1a1a1a",
  accent: "#f2c14e",
  roster: [
    { name: "Air", num: 23, speed: 0.97, shooting: 0.95, dunk: 1.0, steal: 0.95, legend: true, sig: { id: "dunkrange", label: "AIR WALK" } },
    // "Logo" #44 — a trademark-safe tribute to the clutch guard whose
    // silhouette became the league's emblem. Elite shooter and stealer.
    { name: "Logo", num: 44, speed: 0.88, shooting: 0.97, dunk: 0.7, steal: 0.9, legend: true, sig: { id: "deep", label: "LOGO RANGE" } },
    { name: "Rip", num: 33, speed: 0.62, shooting: 0.6, dunk: 0.95, steal: 0.6 },
  ],
});

// ---------------------------------------------------------------------------
// LEGENDS LEAGUE
// A full slate of tribute teams. Every player is an original, trademark-safe
// homage — recognizable by jersey number, nickname, and play style, never by
// real name or likeness (keeps the game App Store shippable). For a private,
// unpublished build you may rename them; do NOT ship real names/likenesses
// without an NBA/NBPA license. See the branding note in README.md.
// ---------------------------------------------------------------------------

const LEGEND_TEAMS: TeamDef[] = [
  {
    id: "showtime",
    city: "Sunset",
    name: "Showtime",
    abbr: "SHO",
    primary: "#6b21a8",
    secondary: "#1a1a2e",
    accent: "#f9d616",
    roster: [
      { name: "Mamba", num: 24, speed: 0.9, shooting: 0.96, dunk: 0.85, steal: 0.82, legend: true, sig: { id: "deep", label: "MAMBA MENTALITY" } },
      { name: "Chef", num: 30, speed: 0.85, shooting: 1.0, dunk: 0.5, steal: 0.78, legend: true, sig: { id: "deep", label: "SPLASH" } },
      { name: "Slim", num: 35, speed: 0.82, shooting: 0.94, dunk: 0.86, steal: 0.7, legend: true, sig: { id: "dunkrange", label: "DEATH LINEUP" } },
    ],
  },
  {
    id: "towers",
    city: "Empire",
    name: "Towers",
    abbr: "TWR",
    primary: "#0f2a4a",
    secondary: "#0a1524",
    accent: "#c9d3e0",
    roster: [
      { name: "Diesel", num: 34, speed: 0.55, shooting: 0.5, dunk: 1.0, steal: 0.55, legend: true, sig: { id: "unblock", label: "THE DIESEL" } },
      { name: "Stilt", num: 13, speed: 0.72, shooting: 0.58, dunk: 1.0, steal: 0.6, legend: true, sig: { id: "lockdown", label: "GOALTENDER" } },
      { name: "Cap", num: 33, speed: 0.6, shooting: 0.82, dunk: 0.92, steal: 0.6, legend: true, sig: { id: "deep", label: "SKYHOOK" } },
    ],
  },
  {
    id: "grit",
    city: "Motor",
    name: "Grit",
    abbr: "GRT",
    primary: "#b91c1c",
    secondary: "#111827",
    accent: "#e5e7eb",
    roster: [
      { name: "Answer", num: 3, speed: 1.0, shooting: 0.86, dunk: 0.6, steal: 0.96, legend: true, sig: { id: "motor", label: "CROSSOVER" } },
      { name: "Glove", num: 20, speed: 0.92, shooting: 0.7, dunk: 0.6, steal: 1.0, legend: true, sig: { id: "lockdown", label: "THE GLOVE" } },
      { name: "Mailman", num: 32, speed: 0.68, shooting: 0.72, dunk: 0.96, steal: 0.62, legend: true, sig: { id: "unblock", label: "SPECIAL DELIVERY" } },
    ],
  },
  {
    id: "primeera",
    city: "Prime",
    name: "Era",
    abbr: "NOW",
    primary: "#1f2937",
    secondary: "#0b0f16",
    accent: "#f2c14e",
    roster: [
      { name: "King", num: 6, speed: 0.9, shooting: 0.82, dunk: 0.95, steal: 0.85, legend: true, sig: { id: "lockdown", label: "CHASEDOWN" } },
      { name: "Greek", num: 34, speed: 0.92, shooting: 0.68, dunk: 1.0, steal: 0.8, legend: true, sig: { id: "dunkrange", label: "EURO STEP" } },
      { name: "Brow", num: 1, speed: 0.78, shooting: 0.74, dunk: 0.95, steal: 0.82, legend: true, sig: { id: "lockdown", label: "THE BROW" } },
    ],
  },
  {
    id: "generals",
    city: "Downtown",
    name: "Generals",
    abbr: "GEN",
    primary: "#047857",
    secondary: "#04231a",
    accent: "#f7f7f2",
    roster: [
      { name: "Show", num: 32, speed: 0.88, shooting: 0.8, dunk: 0.82, steal: 0.82, legend: true, sig: { id: "general", label: "NO-LOOK" } },
      { name: "Post", num: 12, speed: 0.82, shooting: 0.82, dunk: 0.55, steal: 0.95, legend: true, sig: { id: "general", label: "DIME MACHINE" } },
      { name: "Zo", num: 2, speed: 0.95, shooting: 0.82, dunk: 0.6, steal: 0.9, legend: true, sig: { id: "motor", label: "FAST BREAK" } },
    ],
  },
];

TEAMS.push(...LEGEND_TEAMS);

// ---------------------------------------------------------------------------
// PRO LEAGUE — all 30 pro cities as full teams.
// Real CITY names are used (geographic, not trademarks); team names and player
// nicknames are ORIGINAL and trademark-safe. Rosters are generated
// deterministically (a guard, a wing, and a big) so the whole league is
// playable without encoding any real player's name or likeness. For a private,
// unpublished build you may rename them in this file — do NOT ship real
// names/likenesses without an NBA/NBPA license (see README's branding note).
// ---------------------------------------------------------------------------

// id, city, name, abbr, primary, secondary, accent
const PRO_CONFIG: [string, string, string, string, string, string, string][] = [
  ["bos", "Boston", "Shamrocks", "BOS", "#0a7d4f", "#0b1a14", "#f4f0d8"],
  ["bkn", "Brooklyn", "Blackout", "BKN", "#1a1a1a", "#000000", "#ffffff"],
  ["nyk", "New York", "Empire", "NYK", "#1d6fb8", "#0c2340", "#f58426"],
  ["phi", "Philadelphia", "Liberty", "PHI", "#1461b0", "#0b1e33", "#ed506b"],
  ["tor", "Toronto", "North", "TOR", "#ce1141", "#1a1a1a", "#d0c7bd"],
  ["chi", "Chicago", "Windy", "CHI", "#ce1141", "#161616", "#eaeaea"],
  ["cle", "Cleveland", "Lakeside", "CLE", "#7a1734", "#0c1a2a", "#f0b429"],
  ["det", "Detroit", "Motors", "DET", "#c8102e", "#123a9a", "#ffffff"],
  ["ind", "Indiana", "Racers", "IND", "#12284b", "#0a1730", "#fdbb30"],
  ["mil", "Milwaukee", "Antlers", "MIL", "#1c5c37", "#0a2318", "#eee1c6"],
  ["atl", "Atlanta", "Talons", "ATL", "#e03a3e", "#161616", "#26c6a8"],
  ["cha", "Charlotte", "Hive", "CHA", "#3a1f8f", "#111024", "#22b7a6"],
  ["mia", "Miami", "Heatwave", "MIA", "#98002e", "#111111", "#f9a01b"],
  ["orl", "Orlando", "Wizardry", "ORL", "#0b77c2", "#0a2436", "#c0c7cf"],
  ["was", "Washington", "Capitols", "WAS", "#0c2c56", "#0a1c38", "#e03a3e"],
  ["den", "Denver", "Altitude", "DEN", "#0e2240", "#0a1830", "#fec524"],
  ["min", "Minnesota", "Timber", "MIN", "#0c2340", "#0a1a30", "#63b0e3"],
  ["okc", "Oklahoma City", "Storm", "OKC", "#0b7ac1", "#0a2740", "#ef6024"],
  ["por", "Portland", "Ripcity", "POR", "#d43a3a", "#161616", "#dcdcdc"],
  ["uta", "Utah", "Peaks", "UTA", "#12284b", "#0a1830", "#5aa64a"],
  ["gsw", "Golden State", "Splash", "GSW", "#1d54a8", "#0c2148", "#ffc72c"],
  ["lal", "Los Angeles", "Royals", "LAL", "#5a2d81", "#20123a", "#f4c430"],
  ["lac", "Los Angeles", "Sails", "LAC", "#c8102e", "#0c2148", "#dfe3e8"],
  ["phx", "Phoenix", "Blaze", "PHX", "#e56020", "#2a1140", "#f5c542"],
  ["sac", "Sacramento", "Crowns", "SAC", "#5a2d81", "#161616", "#c0c7cf"],
  ["dal", "Dallas", "Lonestar", "DAL", "#12649c", "#0a1f33", "#b4bcc4"],
  ["hou", "Houston", "Launch", "HOU", "#ce1141", "#111111", "#c4ced4"],
  ["mem", "Memphis", "Grind", "MEM", "#5d76a9", "#12203a", "#f5b112"],
  ["nop", "New Orleans", "Brass", "NOP", "#0c2340", "#0a1830", "#b4975a"],
  ["sas", "San Antonio", "Silver", "SAS", "#8a8f96", "#161616", "#e6e9ec"],
];

const PRO_NICKS = [
  "Jet", "Sniper", "Motor", "Clutch", "Flash", "Bruiser", "Handles", "Wingman",
  "Cash", "Sky", "Tank", "Bolt", "Ice", "Prime", "Zone", "Dagger", "Hops",
  "Vault", "Chain", "Pulse", "Blur", "Deuce", "Cobra", "Torch",
];

function proRoster(ti: number): PlayerDef[] {
  const roles = ["guard", "wing", "big"] as const;
  const round2 = (x: number) => Math.min(0.98, Math.round(x * 100) / 100);
  return roles.map((role, r) => {
    const v = ((ti * 7 + r * 13) % 10) / 10; // deterministic 0..0.9 variation
    const nick = PRO_NICKS[(ti * 3 + r) % PRO_NICKS.length];
    const num =
      role === "guard" ? 1 + ((ti + r) % 9)
        : role === "wing" ? 20 + ((ti * 2 + r) % 15)
          : 40 + ((ti + r) % 15);
    const s =
      role === "guard"
        ? { speed: 0.86 + v * 0.1, shooting: 0.8 + v * 0.16, dunk: 0.45 + v * 0.18, steal: 0.82 + v * 0.14 }
        : role === "wing"
          ? { speed: 0.78 + v * 0.12, shooting: 0.74 + v * 0.2, dunk: 0.72 + v * 0.22, steal: 0.68 + v * 0.16 }
          : { speed: 0.55 + v * 0.14, shooting: 0.5 + v * 0.28, dunk: 0.9 + v * 0.09, steal: 0.55 + v * 0.14 };
    return {
      name: nick, num,
      speed: round2(s.speed), shooting: round2(s.shooting), dunk: round2(s.dunk), steal: round2(s.steal),
    };
  });
}

PRO_CONFIG.forEach(([id, city, name, abbr, primary, secondary, accent], ti) => {
  TEAMS.push({ id, city, name, abbr, primary, secondary, accent, roster: proRoster(ti) });
});

export function teamById(id: string): TeamDef {
  return TEAMS.find((t) => t.id === id) ?? TEAMS[0];
}
