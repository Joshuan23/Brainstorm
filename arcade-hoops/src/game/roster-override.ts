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

export const ROSTER_OVERRIDE: Record<string, RosterOverride> = {
  // (empty by default — see the header for how to populate)
};
