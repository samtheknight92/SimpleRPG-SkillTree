# LumenForge RPG Character Creator

## Run the app

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Rebuild game data (after editing `data/*.js`)

```bash
node scripts/build-data.mjs
```

## What the app loads at runtime

- `index.html`, `styles/`, `js/`, `favicon.svg`
- `data/json/*.json` (races, skills, items, effects, premade characters, etc.)

## Build scripts (not needed to run — only to regenerate JSON)

- `scripts/build-data.mjs` — merges source data into `data/json/`
- `scripts/generate-careers.mjs` — regenerates career skill trees
- `scripts/generate-career-effects.mjs` — syncs career entries into `effects.json`
- `scripts/build-premade-characters.mjs` — builds premade character templates
