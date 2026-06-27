# LumenForge — Homebrew Tab (design & build roadmap)

Living build spec for **custom skills & items** created in-app, stored locally, and shared via **export files** (no online sync).

**Status:** **v1 items + v2 skills + v3 races + v4 locks** — custom races; optional skill locks (weapon / race / level / prerequisite skills); weapon **type** on homebrew gear.  
**Main roadmap:** `ROADMAP.md`  
**Design rules:** workspace `.cursor/rules/lumenforge.mdc` + `.cursor/rules/simple-game-design.mdc`

---

## v4 — Skill & gear locks (implemented)

Homebrew **skills** optional locks (combine any):

| Lock | When enforced |
|------|----------------|
| **Weapon type(s)** | Action bar — same as official sword/axe trees (`Requires sword weapon equipped`) |
| **Race(s)** | Skills tab visibility + learning (racial category still uses **Race** picker above) |
| **Minimum level** | Learning — stacks with tier gate (`max(tier, lock)`) |
| **Required skills** | Learning — all listed skills must be learned first (AND) |

Homebrew **weapons** get an explicit **Weapon type** field (official kinds + custom ids). Custom types from saved items appear in skill weapon-lock checkboxes. **No** Human Determination / cross-race rules for homebrew — keep those official-only.

Skill fields on disk: `lockWeaponKinds`, `lockRaces`, `lockMinLevel`, `lockSkills`. Item field: `weaponKind`.

---

## Decisions locked (2026-06)

| Topic | Decision |
|--------|----------|
| **Tab name** | **Homebrew** (dedicated tab in main tab bar) |
| **Who can create** | **Everyone** — any player or GM on their device |
| **v1 content** | **Custom items** — skills added in v2 (basic editor) |
| **Storage** | Browser **`localStorage`** (dedicated key), merged into runtime **cache** on load — same permanence as character saves; survives refresh; cleared if user wipes site data |
| **Custom items on characters** | **Grant to inventory** and/or **optional Shop listing** (Gil price) |
| **Custom skills (v2)** | Creator **picks category** (weapons / magic / careers / fusion / ascension / ultimate / racial) when authoring |
| **Export / import** | **Flexible packs** — select entries via checkboxes; export subset or grouped pack; **separate from full save** as primary sharing path |
| **Character export** | If a character uses homebrew item/skill IDs, **character export must embed** (or reference+inline) those definitions so the file works on another device |

---

## Goals

1. **Creative freedom** — GM and players can add items (v1) and skills (v2) without editing `data/*.js` or running build scripts.
2. **Table-friendly** — plain-language `desc`; optional simple stats/damage; no algebra in player text.
3. **Offline sharing** — JSON files passed between devices (Discord, USB, email).
4. **Safe merges** — import never silently deletes existing homebrew unless user confirms replace.
5. **No server** — no accounts, no live sync (consistent with app scope).

---

## Non-goals (explicit)

- Online homebrew library or multiplayer sync
- Editing or overriding **official** catalog entries from `data/json/`
- Full `effects.json` authoring UI in v1 (pick from catalog only; no new effect definitions)
- Harmony builder / cross-sheet sync for homebrew skills
- Requiring `node scripts/build-data.mjs` for homebrew content

---

## Storage architecture

### Why localStorage + cache overlay

| Layer | Role |
|-------|------|
| **`localStorage`** (`lumenforge_homebrew_v1`) | Source of truth for all user-created entries on this browser |
| **Cache overlay** (`initCache()` / `getItem()` / `getSkill()`) | Homebrew merged **after** official JSON so lookups work everywhere (shop, equip, tooltips) |
| **Full character save** | Stores character **IDs** referencing homebrew; optional future flag to embed definitions in full save |
| **Homebrew pack file** | Portable share format; import merges into `localStorage` |

Homebrew is **device-local** until exported. Same caveats as character saves: backup via export.

### Homebrew store shape (localStorage JSON)

```json
{
  "version": 1,
  "updated": "2026-06-22T12:00:00.000Z",
  "items": {
    "custom_lucky_charm": { "id": "custom_lucky_charm", "source": "homebrew", ... }
  },
  "skills": {},
  "races": {}
}
```

- **`skills`** object empty in v1; reserved for v2.
- **`races`** object empty until v3; homebrew-only races (`custom_` IDs).
- Every homebrew ID **must** use prefix `custom_` (auto-applied on create) to avoid collisions with official IDs.
- Official IDs are **read-only** in UI.

---

## Share file formats

### 1. Homebrew pack (primary group share)

```json
{
  "version": 1,
  "type": "lumenforge-homebrew-pack",
  "name": "Session 3 loot",
  "author": "GM Name",
  "exported": "2026-06-22T12:00:00.000Z",
  "items": [ { "id": "custom_...", ... } ],
  "skills": []
}
```

**UI:** Homebrew tab → checklist on each row → **Export selected** / **Export all** → `.json` download.

**Import:** file picker → preview list → **Merge** (by ID, incoming wins on conflict) or **Replace entire homebrew library** (confirm).

### 2. Single entry export (optional convenience)

- Export one item as a one-entry pack (same schema, `items` length 1).
- Useful for quick shares.

### 3. Character export (must carry dependencies)

When exporting **one character** (Character tab → Export):

- Scan `inventory`, `equipped`, and (v2) `skills` for IDs starting with `custom_`.
- **Embed** matching definitions under a `homebrew` block:

```json
{
  "version": 2,
  "characters": [ { "id": "...", "inventory": [...], "skills": [...] } ],
  "homebrew": {
    "items": [ { "id": "custom_...", ... } ],
    "skills": []
  }
}
```

On **import character file**:

1. Merge embedded `homebrew` into local homebrew store (same rules as pack import).
2. Then merge/import character as today.

If homebrew is missing and not embedded → show clear error listing missing IDs.

### 4. Full save (`Export Save` sidebar)

**Decision (recommended):** Include homebrew block in full save **in v1.1** after Homebrew tab ships — keeps one backup file for everything.  
**v1 launch:** Homebrew tab + pack export; full-save inclusion tracked as follow-up (see Phase 5).

---

## Homebrew tab — UX spec

### Tab placement

- New main tab: **Homebrew** (icon e.g. ✨ or 🧪).
- Visible to **everyone** (not GM-gated).

### List view (default)

- Table/cards of all homebrew **items** (v1).
- Columns: icon, name, type, rarity, shop price (if any), created/updated.
- Actions per row: **Edit**, **Duplicate**, **Delete**, **Export**, checkbox for bulk select.
- Toolbar:
  - **+ New item**
  - **Import pack**
  - **Export selected** / **Export all**
  - Search/filter by name, type, rarity

### Empty state

- Short copy: “Create custom items for your table. Export packs to share with your group.”
- Button: **Create your first item**

### Create / edit form (custom item — v1)

**Required**

| Field | Notes |
|-------|--------|
| Name | Display name |
| Type | `weapon` · `armor` · `accessory` · `consumable` · `material` (subset TBD) |
| Description | Plain language; table reads this aloud |

**Optional (simple mechanics)**

| Field | Notes |
|-------|--------|
| Icon | Emoji picker or text field (default ✦) |
| Rarity | common → legendary (affects shop level gate if priced) |
| Damage | Weapons only, e.g. `1d8` |
| Stat modifiers | +Str, +PD, etc. (same pattern as official items) |
| Gil price | Used only when **List in shop** is on |
| Acquisition mode | **List in shop** or **Grant only** (see visibility below) |

#### Acquisition modes — where items appear

| Mode | Homebrew tab | Shop tab | On a character |
|------|--------------|----------|----------------|
| **List in shop** | Yes (edit/export) | Yes — normal Shop row with Gil price, filters, buy flow | After purchase or grant |
| **Grant only** | Yes (edit/export/**Add to character**) | **No** — not in Shop for anyone, GM mode or not | After **Add to character** (or import pack + grant) |

**Grant only is not “secret shop stock.”** It is intentionally **off the Shop catalog**. Players and GMs find it on the **Homebrew tab**, then put it on a sheet with **Add to character** (self) or GM grant (any roster character). After that it behaves like any other inventory item (equip, tooltips, combat).

**Why grant-only exists:** quest loot, GM gifts, prototypes, or “not for sale” gear — without cluttering Shop or bypassing Gil with a 0-price row.

**Optional later (not v1 unless you want it):** GM mode **Homebrew shelf** in Shop — grant-only items visible only when GM mode is on, still **free grant** (no Gil), separate from priced listings. v1 keeps grant-only **Homebrew tab only** to avoid two shop UXes.

**In v1 form**

- `specialEffects` — multi-select from established `effects.json` IDs (Add effect(s) picker). Unique charge/curse rules stay in description.
- **Counter** — optional label, starting value, max cap, and rules gated by **while counter is above / below / equal to X** (cannot unequip, cannot remove, show only when equipped). Collapsed behind **Add counter** in the editor.

**Not in v1 form**
- Craft recipes / profession linkage
- Enchantment slot editor (could inherit defaults by type later)

### Grant to character

From item row or editor:

- Dropdown: **Add to character** → pick roster character → adds to inventory (respect stack rules).
- Available to everyone for their own characters; GM mode can target any roster character (same pattern as other GM grants).

---

## Integration points (code)

Files likely touched when building (reference during implementation):

| Area | File(s) | Work |
|------|---------|------|
| Storage | `js/homebrew.js` (new) | load/save localStorage, CRUD, ID prefix, merge import |
| Cache | `js/cache.js` | After official catalog, register homebrew items/skills |
| Lookup | `js/items.js`, `js/skills.js` | Ensure filters include `source: homebrew` |
| Shop | `js/items.js`, `js/render.js`, `js/actions.js` | Homebrew items with price in shop; buy flow |
| Tab UI | `js/render.js`, `js/events.js`, `js/state.js` | Homebrew tab, forms, list |
| Constants | `js/constants.js` | `HOMEBREW_STORAGE_KEY`, `TAB_IDS` + `custom_` prefix |
| Character export | `js/actions.js` | Embed homebrew deps on single-character export |
| Character import | `js/actions.js`, `js/storage.js` | Merge embedded homebrew before character |
| Validation | `scripts/validate-homebrew.mjs` (new, optional) | Schema checks in Node tests |
| Tests | `scripts/test-homebrew.mjs` (new) | Merge, ID rules, export shape |
| Styles | `styles.css` / `compact.css` | Homebrew list + form |
| Glossary | `js/glossary.js` | Short “Homebrew” entry |
| Full save | `js/storage.js` | Phase 5: include homebrew in `serializeSave()` |

---

## Phased implementation

### Phase 0 — Spec & scaffolding

- [ ] This document reviewed and signed off
- [ ] Add Homebrew to `TAB_IDS` (hidden until Phase 2 or feature flag)
- [ ] `js/homebrew.js`: empty store, `loadHomebrew()`, `saveHomebrew()`, `customId()`

### Phase 1 — Data layer (items)

- [ ] localStorage read/write with version migrate
- [ ] CRUD: create, update, delete, duplicate item
- [ ] Merge import: by ID, conflict = incoming wins with toast
- [ ] Replace-all import with confirm dialog
- [ ] Overlay homebrew items in `initCache()` / `getItem()`
- [ ] Mark items with `source: 'homebrew'`

### Phase 2 — Homebrew tab UI (items)

- [ ] List + search + bulk checkboxes
- [ ] Create/edit form (fields above)
- [ ] Delete confirm
- [ ] “Add to character” grant flow
- [ ] Empty state + mobile layout (reuse compact patterns)

### Phase 3 — Shop & equip

- [ ] Optional Gil price + “List in shop” toggle
- [ ] Shop filter: include homebrew (Source filter: Homebrew?)
- [ ] `shopMinLevelForItem` from rarity (reuse official rules)
- [ ] Equip / inventory / tooltips work unchanged via cache
- [ ] Craft tab: homebrew items **not** craftable unless v2 recipe support

### Phase 4 — Export / import packs

- [ ] Export selected / export all → pack JSON
- [ ] Import pack → preview → merge or replace
- [ ] Single-item export shortcut
- [ ] Character export embeds referenced homebrew items
- [ ] Character import merges embedded homebrew first
- [ ] Error UX for missing homebrew IDs on import

### Phase 5 — Full save & polish

- [ ] Include homebrew store in `serializeSave()` / `applySavePayload()`
- [ ] Homebrew section in README
- [ ] `npm test` + audit notes for homebrew
- [ ] Glossary entry

### Phase 6 — Custom skills (v2) — **Basic editor shipped**

- [x] Skill form: name, tier, category picker, tree/group datalist (official + custom), desc, Lumen cost, type (passive / toggle / action), optional stamina, stat mods, passive effects picker
- [x] Activatable skills: damage mode (basic + dice, elemental variants, dice-only), on-use effects with duration + potency (self only)
- [x] Register in cache; show in Skills tab under chosen category + subcategory
- [x] Learn/refund on character (normal tier/Lumen gates; GM free)
- [x] Grant skill from Homebrew tab
- [x] Pack export/import includes skills; character export embeds skill deps
- [x] Action bar: homebrew activatable damage rolls + on-use self-buffs; opponent effects remain desc-only
- [ ] Prerequisites / incompatibilities editor

---

## v2 open questions (skills — ask before building)

| # | Question | Default if unset |
|---|----------|------------------|
| 1 | Do homebrew skills cost Lumens / respect tier level gates? | Yes, same as official tier |
| 2 | Can homebrew skills use action bar / combat automation in v2? | Desc-first; simple damage/heal only |
| 3 | Harmony lines on custom skills? | Allowed in desc text; table applies (no sync) |
| 4 | Toggle / passive / active types? | Single “type” dropdown mirroring official patterns |

---

## Validation & safety rules

- Reject import IDs without `custom_` prefix (or auto-prefix with warning).
- Reject duplicate official IDs on import.
- Max name/desc lengths (prevent localStorage bloat) — e.g. name 80 chars, desc 2000 chars.
- Sanitize icon field (emoji / short string).
- Damage field: validate `\d+d\d+` pattern optional.
- On delete: warn if any character inventory/skill list still references ID; offer “remove from all characters” or block delete.

---

## Copy & table guidance (player-facing)

- Homebrew tab subtitle: *“Your table’s custom items — export packs to share with friends.”*
- Import confirm: *“Merge keeps your existing homebrew and updates matching IDs. Replace removes all local homebrew first.”*
- Shop homebrew pill: *“Homebrew”* (distinct from official loot).
- Remind in glossary: homebrew is **not** official rules text — GM approves at the table.

---

## Success criteria (v1 done when…)

1. User can create a custom weapon with damage + desc, grant to character, equip, basic attack uses weapon die.
2. User can set Gil price and buy homebrew item from Shop on same device.
3. User can export selected items as pack; another browser profile imports merge successfully.
4. User exports character with homebrew item; import on fresh browser restores item definition + character.
5. `npm test` covers homebrew merge + export shape; no regressions in `full-audit.mjs`.

---

## Link from main roadmap

Add under **Priority — planned implementation** in `ROADMAP.md` when work starts:

> **Homebrew tab** — custom items & skills, localStorage + pack export. See **`ROADMAP-Homebrew.md`**.

---

*Last updated: 2026-06-22 — from user decisions: everyone creates; v1 items; grant + shop; flexible pack export; character export embeds deps; skills v2 with category picker.*
