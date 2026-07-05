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
// Names, numbers, team names, AND ratings below come from the assistant's
// training knowledge (roughly the 2025-26 season). Rosters and jersey numbers
// change constantly (trades, signings, injuries, retirements) and this WILL
// contain stale or wrong entries. You MUST verify every line against your
// official licensed data source before shipping. See ACCURACY NOTES at the
// bottom for the entries I'm least confident about. Empty this object to
// restore the trademark-safe default build.
//
// Each entry overrides the team's display name and its [guard, wing, big]
// roster slots. Ratings (speed/shooting/dunk/steal, 0..1) are tuned on marquee
// players so stars feel like stars; role players keep the generated values.
export const ROSTER_OVERRIDE: Record<string, RosterOverride> = {
  // ---- Eastern Conference ----
  bos: { team: { name: "Celtics" }, players: [{ name: "Tatum", num: 0, shooting: 0.95, speed: 0.86, dunk: 0.82 }, { name: "Brown", num: 7, shooting: 0.85, dunk: 0.86 }, { name: "White", num: 9 }] },
  bkn: { team: { name: "Nets" }, players: [{ name: "Thomas", num: 24, shooting: 0.9, speed: 0.9 }, { name: "Porter", num: 1 }, { name: "Claxton", num: 33 }] },
  nyk: { team: { name: "Knicks" }, players: [{ name: "Brunson", num: 11, shooting: 0.92, speed: 0.9, steal: 0.82 }, { name: "Bridges", num: 25 }, { name: "Towns", num: 32, shooting: 0.85, dunk: 0.9 }] },
  phi: { team: { name: "76ers" }, players: [{ name: "Maxey", num: 0, speed: 0.96, shooting: 0.9 }, { name: "George", num: 8 }, { name: "Embiid", num: 21, dunk: 0.95, shooting: 0.85 }] },
  tor: { team: { name: "Raptors" }, players: [{ name: "Barnes", num: 4, speed: 0.88, dunk: 0.85, steal: 0.82 }, { name: "Ingram", num: 14, shooting: 0.88 }, { name: "Barrett", num: 9 }] },
  chi: { team: { name: "Bulls" }, players: [{ name: "White", num: 0, shooting: 0.88 }, { name: "Giddey", num: 3, speed: 0.86 }, { name: "Vucevic", num: 9 }] },
  cle: { team: { name: "Cavaliers" }, players: [{ name: "Mitchell", num: 45, shooting: 0.93, speed: 0.9, dunk: 0.85 }, { name: "Garland", num: 10 }, { name: "Mobley", num: 4, dunk: 0.9 }] },
  det: { team: { name: "Pistons" }, players: [{ name: "Cunningham", num: 2, shooting: 0.88, speed: 0.86, steal: 0.82 }, { name: "Ivey", num: 23 }, { name: "Duren", num: 0, dunk: 0.92 }] },
  ind: { team: { name: "Pacers" }, players: [{ name: "Haliburton", num: 0, shooting: 0.92, speed: 0.92, steal: 0.85 }, { name: "Mathurin", num: 0 }, { name: "Siakam", num: 43, dunk: 0.88 }] },
  mil: { team: { name: "Bucks" }, players: [{ name: "Giannis", num: 34, dunk: 1.0, speed: 0.95, steal: 0.85 }, { name: "Portis", num: 9 }, { name: "Turner", num: 33 }] },
  atl: { team: { name: "Hawks" }, players: [{ name: "Young", num: 11, shooting: 0.96, speed: 0.88 }, { name: "Johnson", num: 1 }, { name: "Porzingis", num: 8, shooting: 0.82, dunk: 0.85 }] },
  cha: { team: { name: "Hornets" }, players: [{ name: "Ball", num: 1, speed: 0.95, shooting: 0.88, steal: 0.85 }, { name: "Miller", num: 24 }, { name: "Bridges", num: 0 }] },
  mia: { team: { name: "Heat" }, players: [{ name: "Herro", num: 14, shooting: 0.92 }, { name: "Wiggins", num: 22 }, { name: "Adebayo", num: 13, dunk: 0.9 }] },
  orl: { team: { name: "Magic" }, players: [{ name: "Suggs", num: 4, steal: 0.88 }, { name: "Wagner", num: 22 }, { name: "Banchero", num: 5, dunk: 0.9, shooting: 0.82 }] },
  was: { team: { name: "Wizards" }, players: [{ name: "McCollum", num: 3, shooting: 0.9, speed: 0.85 }, { name: "Coulibaly", num: 0 }, { name: "Sarr", num: 20 }] },
  // ---- Western Conference ----
  den: { team: { name: "Nuggets" }, players: [{ name: "Murray", num: 27 }, { name: "Gordon", num: 50, dunk: 0.9 }, { name: "Jokic", num: 15, shooting: 0.9, dunk: 0.9, steal: 0.82 }] },
  min: { team: { name: "Timberwolves" }, players: [{ name: "Edwards", num: 5, dunk: 0.92, speed: 0.92, shooting: 0.88 }, { name: "Randle", num: 30 }, { name: "Gobert", num: 27, dunk: 0.9 }] },
  okc: { team: { name: "Thunder" }, players: [{ name: "Gilgeous", num: 2, speed: 0.96, shooting: 0.9, steal: 0.9 }, { name: "Williams", num: 8 }, { name: "Holmgren", num: 7, dunk: 0.9 }] },
  por: { team: { name: "Trail Blazers" }, players: [{ name: "Henderson", num: 0 }, { name: "Sharpe", num: 17, dunk: 0.9, speed: 0.9 }, { name: "Avdija", num: 8 }] },
  uta: { team: { name: "Jazz" }, players: [{ name: "George", num: 3 }, { name: "Markkanen", num: 23, shooting: 0.9, dunk: 0.85 }, { name: "Kessler", num: 24, dunk: 0.9 }] },
  gsw: { team: { name: "Warriors" }, players: [{ name: "Curry", num: 30, shooting: 0.99, speed: 0.9, steal: 0.82 }, { name: "Butler", num: 10, steal: 0.88 }, { name: "Green", num: 23, steal: 0.9 }] },
  lal: { team: { name: "Lakers" }, players: [{ name: "Doncic", num: 77, shooting: 0.95, speed: 0.84, steal: 0.85 }, { name: "James", num: 23, dunk: 0.95, speed: 0.88, shooting: 0.8 }, { name: "Reaves", num: 15 }] },
  lac: { team: { name: "Clippers" }, players: [{ name: "Harden", num: 1, shooting: 0.9, steal: 0.8 }, { name: "Leonard", num: 2, shooting: 0.9, steal: 0.95, dunk: 0.85 }, { name: "Zubac", num: 40, dunk: 0.9 }] },
  phx: { team: { name: "Suns" }, players: [{ name: "Booker", num: 1, shooting: 0.95, speed: 0.88 }, { name: "Green", num: 4, dunk: 0.9 }, { name: "Brooks", num: 9 }] },
  sac: { team: { name: "Kings" }, players: [{ name: "LaVine", num: 8, dunk: 0.9 }, { name: "DeRozan", num: 11, shooting: 0.9 }, { name: "Sabonis", num: 10, dunk: 0.9 }] },
  dal: { team: { name: "Mavericks" }, players: [{ name: "Irving", num: 11, shooting: 0.95, speed: 0.96, steal: 0.85 }, { name: "Davis", num: 3, dunk: 0.95, steal: 0.85 }, { name: "Flagg", num: 32 }] },
  hou: { team: { name: "Rockets" }, players: [{ name: "Thompson", num: 1, speed: 0.9, steal: 0.88 }, { name: "Durant", num: 7, shooting: 0.97, dunk: 0.9 }, { name: "Sengun", num: 28, dunk: 0.85 }] },
  mem: { team: { name: "Grizzlies" }, players: [{ name: "Morant", num: 12, speed: 0.98, dunk: 0.95 }, { name: "Jackson", num: 13 }, { name: "Edey", num: 14, dunk: 0.9 }] },
  nop: { team: { name: "Pelicans" }, players: [{ name: "Murray", num: 5 }, { name: "Murphy", num: 25 }, { name: "Williamson", num: 1, dunk: 1.0, speed: 0.9 }] },
  sas: { team: { name: "Spurs" }, players: [{ name: "Fox", num: 4, speed: 0.95, steal: 0.9 }, { name: "Vassell", num: 24 }, { name: "Wembanyama", num: 1, dunk: 0.98, steal: 0.92, shooting: 0.82 }] },
};

// ---------------------------------------------------------------------------
// ACCURACY NOTES — verify these first (lower confidence: recent trades &
// jersey numbers I'm least sure about):
//   • Jersey NUMBERS throughout — many are best-guess; confirm every one.
//   • bkn Porter, tor Ingram, atl Porzingis, was McCollum, hou Durant,
//     phx Green, sac LaVine — players I placed via 2025 trades that may be
//     wrong or already superseded.
//   • dal Flagg #32 — rookie number is a guess.
//   • ind/mil Turner, min Randle, nop Murray — team fit uncertain.
//   • Retired/moved veterans may still be listed; cross-check the whole file.
// ---------------------------------------------------------------------------
