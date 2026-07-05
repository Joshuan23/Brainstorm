# Court Kings 3v3 — Arcade Hoops 🏀🔥

A fast, over-the-top **3-on-3 arcade basketball** game in the spirit of *NBA Hang Time* /
*NBA Jam*: turbo dashes, huge dunks, ankle-breaking steals, and a **catch-fire** mechanic
when you drain three in a row. Built as a tiny, dependency-light TypeScript canvas engine
that runs in any browser **and** ships to the **iOS App Store / Google Play** via
[Capacitor](https://capacitorjs.com/).

> **Branding note (read this before you submit):** the teams, cities, and players here are
> **original and trademark-safe** (Metro Court Kings, Coastal Riptide, Neon Voltage, …).
> The real NBA name, team logos, and player likenesses are licensed exclusively (Take-Two /
> NBA) — shipping them without a license gets an app **rejected and pulled**. Keep the
> original branding, or swap in your own licensed rosters in `src/game/teams.ts`.

## Play it now (web)

```bash
cd arcade-hoops
npm install
npm run dev          # open the printed http://localhost:5173 URL
```

- **Move:** drag the left side of the screen (virtual stick) · or `WASD` / arrows
- **Turbo:** hold the TURBO button · or `Shift`
- **Shoot / Dunk:** SHOOT button — hold to charge the shot meter, release in the green for
  a *Perfect!*; get close to the rim with turbo to **dunk** · or `J`
- **Pass:** PASS button · or `K`
- **On defense** the same buttons become **STEAL** and **BLOCK**; `Space` switches defender

Sink **three baskets in a row** to catch **fire** — you move faster and almost never miss
until the other team scores.

## Legends, signature moves & modes

**Legends League** — 12 selectable teams, including six squads of original, trademark-safe
tribute stars (recognizable by number, nickname, and play style; see the branding note
above). Every legend glows gold and catches fire a bucket sooner.

**Signature moves** — each legend has a special ability that bends the arcade math:

| Signature | Effect | Examples |
|---|---|---|
| **Air Walk / Euro Step** | Dunk from way outside the paint | Air #23, Greek #34, Slim #35 |
| **Logo Range / Splash** | Ignores distance falloff, shrugs off contests | Logo #44, Chef #30, Mamba #24, Cap #33 |
| **The Diesel** | Dunks can't be blocked and knock down defenders | Diesel #34, Mailman #32 |
| **The Glove / Goaltender** | Boosted steal & block range/chance | Glove #20, Stilt #13, King #6, Brow #1 |
| **Crossover / Fast Break** | Turbo barely drains, extra speed | Answer #3, Zo #2 |
| **No-Look / Dime Machine** | Passes can't be intercepted | Show #32, Post #12 |

**Modes** — from the team-select screen:
- **Exhibition** — a single game against your chosen opponent.
- **Tournament** — a 3-round single-elimination bracket vs. escalating-difficulty teams.
  Win all three to be crowned champion; lose once and you're eliminated.

## How it's built

Plain TypeScript + HTML5 Canvas, bundled by [Vite](https://vitejs.dev/). No game engine, no
art assets — everything (players, court, ball physics, SFX) is drawn/synthesized at runtime,
so the whole thing is **~13 KB gzipped**.

| Area | File |
|---|---|
| Bootstrap, render loop, letterboxing, DPR scaling | `src/main.ts` |
| Match state, rules, AI, shooting/dunk/steal/block, clocks | `src/game/game.ts` |
| Keyboard + on-screen touch controls (floating stick + buttons) | `src/game/input.ts` |
| All drawing — court, players, ball, HUD, menus | `src/game/render.ts` |
| Procedural Web Audio SFX (no audio files) | `src/game/audio.ts` |
| Original teams & player ratings | `src/game/teams.ts` |
| Tuning constants (court size, physics, rules) | `src/game/constants.ts` |

Design choices that keep it arcade-fun rather than a sim: fixed full-court camera, no
out-of-bounds (walls bounce the ball), short 60-second quarters, exaggerated dunks, and a
"scripted make" model — shot success is rolled from distance / contest / shot-meter / fire,
then the ball is arced to look like that outcome.

## Ship it to the App Store

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step (Xcode signing, icons,
`App Store Connect`, review notes). The short version:

```bash
npm run build                    # -> dist/
npx cap add ios                  # one-time: generates the Xcode project
npm run cap:ios                  # build + sync + open Xcode, then Archive → Upload
```

## Tuning & extending

- **Difficulty / rules:** `src/game/constants.ts` (`QUARTER_SECONDS`, `SHOT_CLOCK`,
  `SCORE_TO_FIRE`, speeds, ranges).
- **Rosters & colors:** `src/game/teams.ts` — add teams by pushing to the `TEAMS` array.
- **Feel:** `BASE_SPEED`, `TURBO_MULT`, `GRAVITY`, shot-meter `PERFECT_WINDOW`.

MIT-licensed original code; you own what you build on top of it.
