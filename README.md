LumenForge RPG Character Creator
# LumenForge RPG Character Creator

LumenForge is a browser-based character creator and companion app for a custom tabletop RPG system. It helps players create, manage, level, equip, and track characters during play, while also giving the Game Master useful tools for combat, initiative, NPC turns, crafting, items, and status effects.

The app is designed as a lightweight static web project, meaning it can run in a browser without a full backend or database.

## Features

* Create and manage multiple characters
* Choose races and backgrounds
* Track HP, Stamina, Lumens, Gil, and other character resources
* Browse and unlock skills through the skill tree
* Support for racial skills, career skills, fusion skills, passive bonuses, toggles, and active abilities
* Equipment and inventory management
* Shop system with item filtering, sorting, and purchasing
* Crafting system with recipes, required materials, and skill requirements
* Status effect tracking, including buffs, debuffs, damage-over-time effects, healing effects, and special conditions
* Action bar for commonly used abilities
* Stat calculation from race, skills, items, equipment, passives, and active effects
* GM tools for initiative and NPC turn assistance
* Notes section for character and campaign tracking
* Import/export save support
* Light and dark appearance modes
* Multiple visual themes
* Premade character support
* Fully browser-based and suitable for GitHub Pages hosting

## Running the App Locally

Because the app uses JavaScript modules and JSON data files, it should be run through a local server rather than opened directly as a file.

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

If port `8000` is already being used, you can choose another port:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Project Structure

```text
LumenForge_RPG_Rebuild_v4_Gorgeous/
├── index.html
├── styles.css
├── favicon.svg
├── README.md
├── data/
│   ├── *.js
│   └── json/
│       ├── skills.json
│       ├── items.json
│       ├── races.json
│       ├── effects.json
│       ├── monster-loot.json
│       ├── premade-characters.json
│       └── skill-meta.json
├── js/
│   ├── main.js
│   ├── character.js
│   ├── skills.js
│   ├── actions.js
│   ├── combat.js
│   ├── craft.js
│   ├── effects.js
│   ├── equipment.js
│   ├── render.js
│   └── other app modules
├── scripts/
│   ├── build-data.mjs
│   ├── validate-data.mjs
│   ├── generate-careers.mjs
│   ├── generate-career-effects.mjs
│   └── build-premade-characters.mjs
└── styles/
    ├── appearance.css
    └── themes.css
```

## Game Data

The app uses generated JSON files from the `data/json/` folder at runtime.

Source data is stored in the JavaScript data files inside `data/`. After editing the source data, rebuild the JSON files before testing or publishing.

To rebuild the runtime data:

```bash
node scripts/build-data.mjs
```

To check the game data for broken references, duplicate IDs, missing prerequisites, missing materials, or other data integrity problems:

```bash
node scripts/validate-data.mjs
```

A healthy project should return a successful validation message with no broken references.

## Editing Skills, Items, and Effects

Most gameplay content lives in the `data/` folder.

Common files include:

```text
data/skills-data.js
data/items-data.js
data/profession-items-data.js
data/discoverable-items-data.js
data/races-data.js
data/monster-loot-data.js
data/skill-meta.js
```

After editing these files, run:

```bash
node scripts/build-data.mjs
node scripts/validate-data.mjs
```

This helps make sure the app does not contain broken skill prerequisites, missing item references, duplicate IDs, or invalid crafting recipes.

## Save Data

Character data is stored locally in the browser using `localStorage`.

This means:

* Saves stay on the same browser and device
* Clearing browser storage may delete saved characters
* Exporting saves is recommended before major updates
* Imported save files can restore characters later

Use the app’s built-in export/import buttons to back up or move saves between devices.

## Deployment

This project is suitable for static hosting.

It can be hosted with:

* GitHub Pages
* Netlify
* Vercel
* Itch.io HTML upload
* Any basic static web server

For GitHub Pages, publish the folder containing:

```text
index.html
styles.css
styles/
js/
data/json/
favicon.svg
```

The build scripts and source data files are useful for development, but the app mainly needs the HTML, CSS, JavaScript, and generated JSON files to run.

## Development Notes

This project currently uses plain HTML, CSS, and JavaScript modules. There is no framework, no backend, and no package manager required for normal use.

Node.js is only needed if you want to rebuild or validate the game data using the scripts in the `scripts/` folder.

Recommended workflow after making changes:

```bash
node scripts/build-data.mjs
node scripts/validate-data.mjs
python -m http.server 8000
```

Then test the app in the browser.

## Current Status

LumenForge is a playable companion app for managing characters, skills, items, crafting, resources, and combat support during a tabletop RPG session.

The project is still evolving, so future improvements may include:

* More detailed skill tree views
* Improved mobile layouts
* Better GM combat automation
* More item and recipe balancing tools
* Expanded character export sheets
* Cleaner split between rendering, data, and game logic modules

## Credits

Created for the LumenForge RPG system.

Built as a custom character creator, companion app, and Game Master toolkit for managing a large skill-based tabletop RPG.
