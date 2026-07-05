// ---------------------------------------------------------------------------
// OPTIONAL REAL-ROSTER OVERRIDE
//
// This file lets you replace the default, trademark-safe tribute names with
// real team/player names WITHOUT touching game logic. Any team id you add here
// overrides that team's display info and/or roster; anything you leave out
// keeps the publishable default.
//
// ⚠️  LEGAL: Only populate this with real NBA names/likenesses if you actually
//     hold the required licenses (NBA + NBPA). The default (empty) map ships
//     the game in its App Store-safe form. This is your responsibility, not the
//     engine's — see the branding note in README.md.
//
// ⚠️  ACCURACY: Pull names, numbers, and team assignments from your official
//     licensed data source. Real rosters change every season — do not rely on
//     hand-typed or model-recalled data for a shipping product.
//
// Team ids are defined in teams.ts (e.g. "lal", "bos", "gsw", ... for the Pro
// League; "legends", "showtime", ... for the Legends League).
//
// Schema per team id:
//   {
//     team?:    { city?, name?, abbr?, primary?, secondary?, accent? },
//     players?: [ { name?, num?, speed?, shooting?, dunk?, steal? }, ... ]
//               // applied by index to the existing 3-man roster
//   }
//
// Example (commented — uncomment and fill from YOUR licensed source):
//   "lal": {
//     team: { name: "Los Angeles" },
//     players: [
//       { name: "Guard",  num: 3 },
//       { name: "Wing",   num: 23 },
//       { name: "Center", num: 15 },
//     ],
//   },
// ---------------------------------------------------------------------------

import type { PlayerDef, TeamDef } from "./teams";

export interface RosterOverride {
  team?: Partial<Pick<TeamDef, "city" | "name" | "abbr" | "primary" | "secondary" | "accent">>;
  players?: Partial<PlayerDef>[];
}

// ⚠️⚠️  UNVERIFIED — MODEL-RECALLED DATA  ⚠️⚠️
// The entries below were populated from the assistant's training knowledge
// (roughly the 2025-26 season). Rosters change constantly (trades, signings,
// injuries, retirements) and this WILL contain stale or wrong names/numbers.
// You MUST verify every line against your official licensed data source before
// shipping. Player slots map by index to each team's [guard, wing, big] roster;
// only name + number are overridden (ratings keep the generated arcade values).
// To revert to the trademark-safe defaults, empty this object again.
export const ROSTER_OVERRIDE: Record<string, RosterOverride> = {
  // Eastern Conference
  bos: { players: [{ name: "Tatum", num: 0 }, { name: "Brown", num: 7 }, { name: "White", num: 9 }] },
  bkn: { players: [{ name: "Thomas", num: 24 }, { name: "Porter", num: 1 }, { name: "Claxton", num: 33 }] },
  nyk: { players: [{ name: "Brunson", num: 11 }, { name: "Bridges", num: 25 }, { name: "Towns", num: 32 }] },
  phi: { players: [{ name: "Maxey", num: 0 }, { name: "George", num: 8 }, { name: "Embiid", num: 21 }] },
  tor: { players: [{ name: "Barnes", num: 4 }, { name: "Ingram", num: 14 }, { name: "Barrett", num: 9 }] },
  chi: { players: [{ name: "White", num: 0 }, { name: "Giddey", num: 3 }, { name: "Vucevic", num: 9 }] },
  cle: { players: [{ name: "Mitchell", num: 45 }, { name: "Garland", num: 10 }, { name: "Mobley", num: 4 }] },
  det: { players: [{ name: "Cunningham", num: 2 }, { name: "Ivey", num: 23 }, { name: "Duren", num: 0 }] },
  ind: { players: [{ name: "Haliburton", num: 0 }, { name: "Mathurin", num: 0 }, { name: "Siakam", num: 43 }] },
  mil: { players: [{ name: "Giannis", num: 34 }, { name: "Portis", num: 9 }, { name: "Turner", num: 33 }] },
  atl: { players: [{ name: "Young", num: 11 }, { name: "Johnson", num: 1 }, { name: "Porzingis", num: 8 }] },
  cha: { players: [{ name: "Ball", num: 1 }, { name: "Miller", num: 24 }, { name: "Bridges", num: 0 }] },
  mia: { players: [{ name: "Herro", num: 14 }, { name: "Wiggins", num: 22 }, { name: "Adebayo", num: 13 }] },
  orl: { players: [{ name: "Suggs", num: 4 }, { name: "Wagner", num: 22 }, { name: "Banchero", num: 5 }] },
  was: { players: [{ name: "McCollum", num: 3 }, { name: "Coulibaly", num: 0 }, { name: "Sarr", num: 20 }] },
  // Western Conference
  den: { players: [{ name: "Murray", num: 27 }, { name: "Gordon", num: 50 }, { name: "Jokic", num: 15 }] },
  min: { players: [{ name: "Edwards", num: 5 }, { name: "Randle", num: 30 }, { name: "Gobert", num: 27 }] },
  okc: { players: [{ name: "Gilgeous", num: 2 }, { name: "Williams", num: 8 }, { name: "Holmgren", num: 7 }] },
  por: { players: [{ name: "Henderson", num: 0 }, { name: "Sharpe", num: 17 }, { name: "Avdija", num: 8 }] },
  uta: { players: [{ name: "George", num: 3 }, { name: "Markkanen", num: 23 }, { name: "Kessler", num: 24 }] },
  gsw: { players: [{ name: "Curry", num: 30 }, { name: "Butler", num: 10 }, { name: "Green", num: 23 }] },
  lal: { players: [{ name: "Doncic", num: 77 }, { name: "James", num: 23 }, { name: "Reaves", num: 15 }] },
  lac: { players: [{ name: "Harden", num: 1 }, { name: "Leonard", num: 2 }, { name: "Zubac", num: 40 }] },
  phx: { players: [{ name: "Booker", num: 1 }, { name: "Green", num: 4 }, { name: "Brooks", num: 9 }] },
  sac: { players: [{ name: "LaVine", num: 8 }, { name: "DeRozan", num: 11 }, { name: "Sabonis", num: 10 }] },
  dal: { players: [{ name: "Irving", num: 11 }, { name: "Davis", num: 3 }, { name: "Flagg", num: 32 }] },
  hou: { players: [{ name: "Thompson", num: 1 }, { name: "Durant", num: 7 }, { name: "Sengun", num: 28 }] },
  mem: { players: [{ name: "Morant", num: 12 }, { name: "Jackson", num: 13 }, { name: "Edey", num: 14 }] },
  nop: { players: [{ name: "Murray", num: 5 }, { name: "Murphy", num: 25 }, { name: "Williamson", num: 1 }] },
  sas: { players: [{ name: "Fox", num: 4 }, { name: "Vassell", num: 24 }, { name: "Wembanyama", num: 1 }] },
};
