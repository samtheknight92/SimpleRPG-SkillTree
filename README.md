# LumenForge RPG v5 — Nearly Complete

LumenForge is a browser-based **character sheet and play aid** for a custom tabletop RPG. It helps players create, equip, level, and track characters at the table, with GM tools for initiative, NPC turns, folders, and premade spawns.

The app is a **static HTML/JS project** — no backend, no accounts, no live sync between players. Harmonies and some racial passives are **table rules**; skill text explains the math, and the GM applies joins and manual effects.

## Main features

- Create and manage multiple characters with **sidebar folders**
- Races, backgrounds, elemental affinity (Dragonborn), and racial skill trees
- **Career skills** with harmony copy, weapon/magic skill trees, and fusion skills
- HP, Stamina, Lumens, Gil, stats, status effects, and action bar
- **Shop** with filters, rarity level gates, and buyable-only view
- **Crafting** with recipes, materials, and profession items
- **Enchantments** on equipped gear (apply/remove from Character tab)
- **GM mode**: initiative tracker, NPC turn helper, premade spawns to folders
- Notes, printable character export, light/dark mode and colour themes
- **Export / import save** (full app state or legacy character-only files)

## Run locally

The app uses ES modules and JSON data — serve the folder with a local web server (do not open `index.html` as a `file://` URL).

**Option A — npm (recommended on this machine):**

```bash
npm run serve
```

Then open [http://localhost:8000](http://localhost:8000).

**Option B — Python:**

```bash
python -m http.server 8000
```

If port 8000 is in use, pick another (e.g. `8080` or `npm run serve` with a different port via `npx serve -l 8080 .`).

### Rebuild & verify game data

```bash
npm run build-data
npm run validate
npm run audit
npm test
```

## Save, export, and import

- **Auto-save:** Progress is stored in this browser’s `localStorage` (same device/browser only).
- **Export Save** (sidebar): downloads a **full save** JSON — characters, active character, roster folders, GM mode, initiative tracker, NPC turn selection, UI tab/filters, item page, and GM spawn folder.
- **Export** (Character tab): downloads a **single character** (legacy `{ version, characters }` shape) for sharing one sheet.
- **Import Save:** supports **full saves** and **legacy character-only** exports.
  - **Full save + empty roster:** restores everything automatically.
  - **Full save + existing roster:** you choose **Replace entire save** or **Merge characters by ID** (merge keeps your current folders and GM state).
  - **Legacy file:** merges characters by ID; does not wipe folders or GM tools.

Back up with **Export Save** before major updates or clearing browser storage.

## Project layout

```text
index.html          App shell
js/                 Application modules
data/               Source game data (*.js)
data/json/          Built runtime JSON (generated)
scripts/            build-data, validate, audits, career generator
styles/             Base, themes, compact, mobile CSS
```

## Current status

**v5 · Nearly Complete** — playable at the table for character management, shop/craft, combat rolls, enchants, GM initiative, and folders. See `ROADMAP.md` for planned work (e.g. off-hand slot expansion, instrument items).

## Known limitations

- **No multiplayer / harmony sync** — harmonies are table rules; each sheet is local.
- **Table-rule race passives** — Lucky, Relentless Endurance, Ambitious Spirit, Sunlight Sensitivity, and Pack Tactics are labeled in the UI; the app does not roll or track them automatically.
- **No server** — saves stay on the device unless you export them.
- **Manual browser testing** — combat toasts, mobile layout, and edge-case UI are not fully automated.

## Credits

Built for the LumenForge tabletop RPG system — a deliberately simpler-than-D&D game for casual groups.
