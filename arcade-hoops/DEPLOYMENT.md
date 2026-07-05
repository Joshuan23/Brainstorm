# Shipping Court Kings 3v3 to the App Store & Google Play

The game is a static web build wrapped natively with **Capacitor**. Capacitor produces a
real Xcode project (and Android Studio project) that embeds the built `dist/` as the app's
web layer — this is a legitimate, Apple-approved path for HTML5/canvas games.

---

## 0. Prerequisites

- **macOS with Xcode 15+** (required to build & submit an iOS app — Apple only allows this
  from a Mac).
- An **Apple Developer Program** membership ($99/yr) → https://developer.apple.com/programs/
- **CocoaPods**: `sudo gem install cocoapods`
- Node 18+ and this repo installed: `cd arcade-hoops && npm install`
- (Android) **Android Studio** + JDK 17.

---

## 1. Build the web bundle

```bash
npm run build        # outputs dist/
```

`capacitor.config.ts` already points `webDir` at `dist` and sets:
- `appId: com.courtkings.arcade`  ← change to your own reverse-DNS bundle id
- `appName: Court Kings 3v3`

Pick a **unique** `appId` you own (e.g. `com.yourstudio.courtkings`) **before** creating the
app record — it can't be changed after first upload.

---

## 2. Add the native platforms (one time)

```bash
npx cap add ios
npx cap add android        # optional, for Google Play
```

This creates `ios/` and `android/` folders (git-ignored on purpose — regenerate anytime).

Sync whenever you rebuild the web code:

```bash
npm run cap:sync           # = npm run build && cap sync
```

---

## 3. iOS: icons, splash, orientation

**App icon** — you need a 1024×1024 PNG (no transparency, no rounded corners; Apple rounds
it). Then either:
- drop it into `ios/App/App/Assets.xcassets/AppIcon.appiconset` in Xcode, or
- use a generator: `npm i -D @capacitor/assets`, put a `1024×1024` `icon.png` and a
  `2732×2732` `splash.png` in a `resources/` folder, then
  `npx @capacitor/assets generate --ios`.

**Landscape lock** — this game is landscape-only. In Xcode → target **App** → *General* →
*Deployment Info*, uncheck Portrait; leave *Landscape Left/Right* checked. (Capacitor's
`Info.plist` `UISupportedInterfaceOrientations` — keep only the two landscape values.)

**Status bar / full screen** — already handled at runtime (`@capacitor/status-bar` hides it);
optionally set `UIStatusBarHidden = YES` in `Info.plist`.

---

## 4. iOS: signing & archive

```bash
npm run cap:ios            # build + sync + open the project in Xcode
```

In Xcode:
1. Select the **App** target → *Signing & Capabilities* → check **Automatically manage
   signing**, pick your **Team**.
2. Set a **Version** (e.g. `1.0.0`) and **Build** (`1`).
3. Choose **Any iOS Device (arm64)** as the run destination.
4. **Product → Archive**. When the Organizer opens, **Distribute App → App Store Connect →
   Upload**.

---

## 5. App Store Connect

1. https://appstoreconnect.apple.com → **Apps → +** → New App. Bundle ID = your `appId`.
2. Fill in: name, subtitle, category **Games → Sports / Arcade**, age rating (this has no
   objectionable content; cartoon competition → likely **4+**).
3. Upload **screenshots** (6.7" iPhone + 12.9" iPad required). Capture from the simulator in
   landscape.
4. Attach the build you uploaded from Xcode, add "What's New" text, set price (Free is fine).
5. **Submit for Review.**

### Review notes to include (avoids rejection)

> "All teams, cities, and players in this game are original and fictional. The game contains
> no NBA trademarks, real team logos, or real player names/likenesses. Gameplay is a
> single-player arcade basketball game vs. AI; no accounts, no data collection, no ads,
> no in-app purchases."

**App Privacy**: if you don't add analytics/ads, declare **"Data Not Collected."** (The game
as shipped collects nothing.) If you later add SDKs (ads, analytics), update this.

---

## 6. Android (Google Play), optional

```bash
npx cap add android
npm run cap:android        # opens Android Studio
```

- In Android Studio: **Build → Generate Signed Bundle/APK → Android App Bundle (.aab)**,
  create/sign with an upload key.
- Google Play Console → create app → upload the `.aab` → fill store listing → roll out.
- Lock orientation: `android/app/src/main/AndroidManifest.xml`, set
  `android:screenOrientation="sensorLandscape"` on the `MainActivity`.

---

## 7. Common gotchas

| Symptom | Fix |
|---|---|
| Black screen on device | Run `npm run cap:sync` after every `npm run build`; confirm `dist/` isn't empty. |
| Audio silent until first tap | Expected — iOS unlocks Web Audio on first touch (handled in `main.ts`). |
| Rejected for "misleading" NBA branding | Keep original team names; don't market with "NBA" in the App Store title/keywords. |
| Icon looks wrong | 1024×1024, opaque, no alpha; let Apple round the corners. |
| Safe-area cutout overlaps HUD | `viewport-fit=cover` + landscape is handled; test on a notched device and nudge `COURT` insets in `constants.ts` if needed. |

---

## 8. Legal / naming

- The **game title** must not include "NBA". "Court Kings", "Street Slam", "Hoops Arena",
  etc. are safe.
- You **own** the code and the original teams; ship freely.
- To use the real NBA, you need a license from the **NBA** and **NBPA** (players) — in
  practice granted exclusively to Take-Two/2K. Don't ship real branding without it.
