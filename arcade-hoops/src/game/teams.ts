// Original, App-Store-safe teams and players. No real NBA marks — swap these
// for licensed rosters only if you hold the rights.

export interface PlayerDef {
  name: string;
  num: number;
  // 0..1 attribute ratings that feed the arcade math.
  speed: number;
  shooting: number;
  dunk: number;
  steal: number;
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

export function teamById(id: string): TeamDef {
  return TEAMS.find((t) => t.id === id) ?? TEAMS[0];
}
