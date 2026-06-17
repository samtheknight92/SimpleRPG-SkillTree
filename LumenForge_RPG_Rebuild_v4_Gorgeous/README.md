# LumenForge RPG Character Creator

A modular, performance-tuned RPG character companion for tabletop play.

## How to run

This version loads game data as JSON via ES modules, so use a local server:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

To rebuild JSON data from legacy JS sources (after editing `data/*.js`):

```bash
node scripts/build-data.mjs
```

## Architecture

```
js/           Application modules (state, cache, render, events, actions)
data/json/    Game data loaded at boot (races, skills, items, effects, …)
scripts/      Data build tooling
```

## Improvements in this refactor

- **Modular ES modules** instead of a single 3,600-line `app.js`
- **Lookup caches** for skills and items (`skillById`, `itemById`)
- **Per-character stat/effect caches** invalidated on change
- **Debounced** localStorage saves, search inputs, and notes auto-save
- **Partial renders** (header/sidebar/content) instead of full DOM rebuilds
- **Event delegation** — no listener rebinding after each render
- **Versioned saves** (`lumenforge_save_v2`) with legacy migration
- **Paginated item catalogue** (48 items per page)
- **URL hash state** for tab/filter persistence (`#tab=skills&cat=weapons`)
- **Tab keyboard shortcuts** — press `1`–`6` to switch tabs
- **Duplicate character** button on sidebar cards
- **Consolidated GM tab** — session tools only; resources live on Stats
- **Mobile tap-to-expand** tooltips for cards with `data-tooltip`
- **Accessibility** — tab roles, `aria-selected`, live toast region

## Features

- Character creation, duplication, import/export
- Race selection, lumens stat upgrades, skill trees
- Inventory, shop filtering, equipment
- Effects & status manager with turn processing
- GM dice roller and quick heals
- Per-character notes with auto-save

Save data is stored in the browser via `localStorage`.
