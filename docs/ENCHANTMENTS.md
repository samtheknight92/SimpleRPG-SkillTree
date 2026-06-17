# Enchantments — Design Approach

How magic on **gear** should work in LumenForge RPG Rebuild v4. **Not implemented yet** — slots display on items; there is no apply/remove UI (`ENCHANTMENTS_PLANNED` in `js/constants.js`).

Related docs: [CAREERS.md](./CAREERS.md) (Enchanter job), [PROFESSIONS.md](./PROFESSIONS.md) (legacy crafting trees).

---

## Purpose

Enchantments let characters **upgrade weapons, armour, and accessories** in a way that:

1. **Stays simple** — a small menu of clear bonuses, not a crafting sim inside a crafting sim.
2. **Fits the companion app** — track what is on the sword; GM or player resolves edge cases.
3. **Stays distinct from combat skills** — enchanting is **downtime / inventory**, not another action-bar button (except holy_weapon-style *spells* that temporarily apply an effect).
4. **Does not use durability** — enchants add power; they do not repair wear (see CAREERS design note).

**Not the same as:**

| System | What it is |
|--------|------------|
| **Fusion toggles** (Flame Arrow, etc.) | Character skill; buffs *your attacks* while active; costs stamina per turn |
| **Spell: Weapon Enchanted** (`holy_weapon`) | Temporary **character effect** on the weapon for 10 turns |
| **Item `specialEffects`** | Baked into the item definition (frost blade always freezes) |
| **Enchantment slots** | **Empty sockets** on gear; player fills them with chosen mods that persist on that inventory row |

---

## Current state in the codebase

| Piece | Status |
|-------|--------|
| `enchantmentSlots` on shop/loot items | In `data/items-data.js` — shown in UI pill + tooltip “planned” |
| Compare equipped | Shows slot count diff (`js/item-compare.js`) |
| Shop filter `enchantable` | Items with `enchantmentSlots > 0` |
| Inventory `enchantments[]` on entries | **Not stored** — no per-item enchant list yet |
| Apply / remove / identify UI | **None** |
| `weapon_enchanted` effect | In `effects.json` — used by spells/fusion, not gear slots |
| Legacy **enchanting** profession items | `profession-items` — consumable “stones” with temp `effect` blocks |
| Old **professions → enchanting** skills | `basic_enchanting`, `archenchanter`, etc. in `skills-data.js` |
| **Careers → Enchanter** | Template in CAREERS.md — target design going forward |

**Data drift:** Some `profession-items` reference skills that are not in the current skill tree (`barrier_enchanting`, `weapon_enchanting`, …). When enchantments ship, align recipes with **Career: Enchanter** skills or trim orphan recipes.

---

## Original SimpleRPG → v4 mapping

Reference: [SimpleRPG Skill Tree](https://samtheknight92.github.io/SimpleRPG-SkillTree/) (original app). That version’s enchant loop was **mostly data-driven through the Crafting tab + `profession-items`** — not a separate enchant engine. The rebuild already has almost all of that data; what’s missing is the **glue** between inventory rows, stats, and UI.

### What the original actually did (three layers)

| Layer | What it was | Where it lives in v4 |
|-------|-------------|----------------------|
| **Slots on gear** | `enchantmentSlots: 1` on silver-tier+ weapons | `data/items-data.js` — shown in UI |
| **Crafted enhancements** | Type `enhancement` in `profession-items` (sharpening stones, runes, legendary gems) | `data/profession-items-data.js` — intact |
| **Skill gates** | `requiredSkills: ["basic_enchanting"]` etc. | `skills-data.js` → `professions.enchanting` tree |

Enhancement items used a small **`effect` vocabulary** that v4 should reuse as-is:

```json
{ "type": "weapon_enchant", "stat": "damage", "amount": 2, "duration": 1800 }
{ "type": "armor_enchant", "stat": "magical_defence", "amount": 3, "duration": 1800 }
{ "type": "stat_boost", "stats": { "speed": 2 }, "duration": 1800 }
{ "type": "permanent_enchant", "stats": { "strength": 5 }, "bonus_effects": ["divine_damage"] }
```

- **Temp stones** (e.g. Weapon Sharpening Stone) — timed buff; desc says “30 rounds”, `duration` in data is seconds.
- **Legendary gems** (`transcendence_gem`, `godslayer_rune`, `infinity_core`) — **permanent** mods on a piece of gear; descriptions say “once per character”.

Why it felt decent: **craft → pick gear → apply**. Slots capped how much permanent power you could stack.

### What v4 has vs what’s missing

| Already in v4 | Still missing |
|---------------|---------------|
| `enchantmentSlots`, compare diff, shop `enchantable` filter | **Craft tab** (original had Crafting; v4 has Shop `profession` source only) |
| Full `profession-items.enchanting` recipes + materials | `inventory[].enchantments` (and related fields) on save |
| `weapon_enchanted` in `effects.json` | **Use enhancement on target item** flow |
| `computeStats()` + `characterEffectSources()` merge points | Stat merge from applied enchants |
| | Professions category hidden (`HIDDEN_SKILL_CATEGORIES`) |

**Don’t invent a new system first** — wire the existing `profession-items` schema into the modular v4 stack.

### Inventory entry shape (extend `normalizeInventoryEntry`)

```json
{
  "uid": "inv_…",
  "itemId": "steel_sword",
  "qty": 1,
  "enchantments": [],
  "boundTo": null,
  "tempBuff": null,
  "craftedBy": null
}
```

Bonuses live on the **inventory row**, not the item template — trading a sword trades its enchants.

### Route original `effect.type` → v4 behavior

| Original `effect.type` | v4 behavior |
|------------------------|-------------|
| `weapon_enchant` / `armor_enchant` | Set `entry.tempBuff` **or** apply `weapon_enchanted` / ward as **status effect** while that item is equipped |
| `stat_boost` | `applyEffect()` on character (`js/effects.js`) — self-buff consumable |
| `permanent_enchant` | Push into `entry.enchantments[]` if `enchantments.length < item.enchantmentSlots`; merge stats in `computeStats()` |
| `magical_shield` | Character status effect (barrier), not a slot |

This restores **original feel in phase 1** without a new enchant catalog. Direct “apply rune” from Enchanter skills is a later UX upgrade.

### Code hooks (where to wire)

| Concern | File |
|---------|------|
| Persist `enchantments[]`, `tempBuff`, `boundTo` | `js/character.js` `normalizeInventoryEntry`, `js/storage.js` migration |
| Merge enchant stats when equipped | `js/character.js` `computeStats` (after equipped `item.statModifiers`) |
| Show enchants in Skill & Gear Effects | `js/effects.js` `characterEffectSources` |
| Craft list + material deduct | New `js/craft.js` — read `PROFESSION_ITEMS_DATA`, filter by `character.skills` |
| Use stone on gear | `js/actions.js` — `useEnhancementOnItem(enhUid, targetUid)` |
| Target picker UI | `js/render.js` — equippable rows with free slots |

### Original player workflow (restore first)

```
Craft tab → craft Weapon Sharpening Stone
Inventory → Use stone → pick steel sword
Toast: "+2 damage for 30 rounds" or "Flame rune applied (slot 1/2)"
```

Ship **Craft tab + Use on…** before a fancy enchant browser — that’s what made the original work.

### Skills: two paths

| Path | When |
|------|------|
| **Faithful to original** | Unhide `professions` when Craft + Use exist; gate recipes with `basic_enchanting`, `elemental_infusion`, `archenchanter` |
| **Careers direction** | Map same recipes to **Enchanter** skills (`Rune Apprentice`, `Elemental Ink`, …); hide old `professions.enchanting` tree |

Data stays the same; only `requiredSkills` ids change.

### Keep three power sources separate (v4 is stricter)

| Source | Stays as |
|--------|----------|
| **Baked-in item power** | `statModifiers` + `specialEffects` on template (frost blade always freezes) |
| **Slot enchants** | `entry.enchantments[]` — player-chosen |
| **Combat magic** | Fusion toggles + `holy_weapon` → `weapon_enchanted` status — **not** slot fills |

The original sometimes blurred spell vs gear mod; v4 should keep them distinct (see **Not the same as** above).

### Recommended build order (original-first)

```
Craft tab → Use enhancement on gear → computeStats reads enchantments
         → tooltips + compare show enchants → Identify / Soul Bind / Dispel
```

1. **E1-lite** — `enchantments[]` + `normalizeInventoryEntry` migration  
2. **Craft + Use** — port `profession-items` `effect` handlers (fastest path to “decent”)  
3. **Stat/tooltip merge** — equipped gear shows full power  
4. **Enchanter career** — direct apply without crafting a stone first (optional)  
5. **Data cleanup** — recipes pointing at missing skills (`barrier_enchanting`, etc.)

---

## Core concepts

### 1. Enchantment slots

- Defined on **item template**: `enchantmentSlots: 0 | 1 | 2 | …`
- Meaning: “This piece of gear can hold N enchantments.”
- **0 slots** — cannot be enchanted (most common gear, consumables).
- Higher-tier or smith-crafted gear may have more slots (`enchanted_smithing`, `legendary_smithing` in old smithing tree = **craft-time** slot grants, not a separate system).

### 2. Applied enchantments (runtime)

Stored on **inventory entry**, not only on item template:

```json
{
  "uid": "inv_…",
  "itemId": "steel_sword",
  "qty": 1,
  "enchantments": [
    { "enchantId": "flame_1d6", "appliedBy": "character-id", "identified": true }
  ],
  "boundTo": null
}
```

- Equipping uses the **inventory row** — bonuses follow that row’s `enchantments`.
- Selling/trading: soul-bound rows blocked or penalty for non-owner (Enchanter **Soul Bind**).

### 3. Enchant definitions (catalog)

Central list in data (e.g. `data/enchantments-data.js` or entries in `effects.json` with `type: "enchant"`):

| Field | Example |
|-------|---------|
| `id` | `flame_1d6` |
| `name` | Flame I |
| `slotCost` | 1 |
| `allowedOn` | `weapon` \| `armor` \| `accessory` \| `any` |
| `statModifiers` | `{ "accuracy": 1 }` |
| `onHit` | `{ "damage": "1d6", "element": "fire" }` |
| `requiredSkill` | `elemental_infusion` |
| `curse` | optional downside if unidentified |

Keep the catalog **small at first** (~15–25 enchants), tiered by Enchanter skill.

### 4. Temporary vs permanent

| Kind | How | Example |
|------|-----|---------|
| **Permanent (slot)** | Fills `enchantmentSlots` on the item row | +1 Accuracy rune |
| **Temporary (consumable)** | Legacy profession “sharpening stone” — applies a **character or weapon effect** for N rounds, does not use a slot | Weapon Sharpening Stone (+2 damage, 30 rounds) |
| **Spell-granted** | `holy_weapon` → apply `weapon_enchanted` effect to wielder | 10 turns, not a slot |

**v1 enchant UI = permanent slot fills only.** Temp stones can stay **Use consumable** until merged later.

### 5. How bonuses apply in play

- **Stats (+PD, +damage, etc.)** — merge into `computeStats` when item is equipped (like `statModifiers` on base item).
- **On-hit ( +1d6 fire )** — show in tooltip + Skill & Gear Effects; combat remains GM/table (same as weapon damage + fusion).
- **Procs (freeze on hit)** — link to existing effect ids (`weapon_enchanted`, custom enchant procs).
- **AC (PD/MD)** — enchants raise the **stat**, not a separate damage-reduction layer.

---

## Who can enchant?

| Source | Rule |
|--------|------|
| **Enchanter career** | Primary path — skills gate which enchant ids appear in the Enchant UI |
| **Scrolls / gems (loot)** | One-shot apply if you have a free slot (no skill, or lower-tier enchant only) |
| **NPC / GM** | Free apply in GM mode |
| **Spells** | Temporary effects only — do not consume slots |

Suggested Enchanter gates (from CAREERS.md):

| Skill | Unlocks |
|-------|---------|
| Rune Apprentice | Minor stat enchants (+1 stat) |
| Elemental Ink | +1d6 fire/ice/lightning on weapons |
| Ward Scribe | +1 PD or +1 MD charms (timed or slot — pick one model) |
| Soul Bind | `boundTo` on inventory row |
| Artifact Shaping | Items crafted with 2 slots (craft metadata) |
| Dispel Touch | Remove/suppress enchant (action, not slot) |

---

## Player workflow (target UI)

1. Open **Inventory** or **Craft / Enchant** tab.
2. Select equippable item with **free slots** (`filled < enchantmentSlots`).
3. **Enchant** button → list enchants you know (skill-gated) + scrolls in inventory.
4. Preview: stat diff vs equipped (reuse `item-compare` patterns).
5. **Apply** — consumes materials/scroll, writes to `enchantments[]`.
6. **Identify** (optional) — unknown enchant shows “?” until identified (curse risk).
7. **Remove** (optional v2) — destroys enchant or refunds partial mats; requires skill or gold.

```
[ Steel Sword — 1/2 slots ]
  Slot 1: Flame I (+1d6 fire on hit)
  Slot 2: (empty)  [ Add enchant ]

[ Add enchant ]
  > +1 Accuracy (Rune Apprentice) — needs 2× anti_magic_essence
  > Flame I (Elemental Ink) — needs …
```

---

## Enchantment types (starter catalog ideas)

| Category | Example | Slot | Notes |
|----------|---------|------|-------|
| **Stat** | +1 Accuracy, +1 PD | 1 | Straightforward merge into stats |
| **Elemental weapon** | +1d6 fire | 1 | Matches Elemental Ink; distinct from fusion toggle |
| **Bane** | +1d6 vs undead | 1 | Holy / blessed theme |
| **Ward** | +1 MD while worn | 1 | Cleric holy symbol craft overlap — use same enchant id |
| **Utility** | Silent movement (boots) | 1 | Rare; may use `specialEffects` instead |
| **Curse** | −1 MD, +1d4 damage | 1 | Hidden until Identify Magic |
| **Soul bound** | Only owner equips | 0 | Meta flag on row, not a slot |

Avoid duplicating **full fusion trees** on gear — one elemental damage enchant is enough per weapon at v1.

---

## Rules & edge cases

| Topic | Proposal |
|-------|----------|
| **Stacking** | Same enchant id cannot stack twice on one item; two slots = two *different* enchants |
| **Slot overflow** | Cannot apply if `enchantments.length >= enchantmentSlots` |
| **Transfer** | Enchants stay on inventory uid; moving to another character = trading that row |
| **Identify** | Unidentified enchant: show slot used, hide bonus until Identify Magic or shop |
| **Dispel** | Removes one enchant or suppresses for 1 hour (Enchanter); cursed enchants may resist |
| **Compare** | Equipped diff includes enchant stat bonuses, not just base item |
| **Premade Enchanter** | May ship with pre-filled enchants on gear once `enchantments[]` exists |

---

## Relationship to other systems

```
┌─────────────────┐     ┌──────────────────┐
│  Craft page     │     │  Enchant UI      │
│  (make item)    │────▶│  (fill slots)    │
└─────────────────┘     └──────────────────┘
        │                         │
        ▼                         ▼
   inventory row            enchantments[]
        │                         │
        └──────────┬──────────────┘
                   ▼
            Equip → computeStats
                   tooltips / compare
```

- **Blacksmith** crafts the item; **Enchanter** fills slots (or smith adds slots at craft time via `craftBonuses.extraSlots`).
- **No durability** — never “enchant degrades with use” unless a specific curse says so.

---

## Implementation phases

| Phase | Build | Outcome |
|-------|--------|---------|
| **E0** | Craft tab + **Use enhancement on gear** (`profession-items` `effect` handlers) | Restores original SimpleRPG loop |
| **E1** | `enchantments[]` on inventory save + `normalizeInventoryEntry` migration | Data model |
| **E2** | Show applied enchants in tooltip; include in stat compute when equipped | Player sees value |
| **E3** | Direct Enchant UI: list gated enchants, apply to empty slot, material cost | Enchanter career playable without stone middleman |
| **E4** | Identify / curse reveal; Dispel remove one enchant | Risk/reward |
| **E5** | Soul bind; compare diff includes enchants | Trade / theft rules |
| **E6** | Align `requiredSkills` with Enchanter career; trim orphan recipes | One mental model |

**Ship with Careers:** Enchant UI is **C3** in CAREERS.md (after Craft page + consumable use).

---

## What we are not building (v1)

- Random roll / re-roll enchant gambling minigame
- Enchantment XP or leveling individual runes
- Gear durability tied to enchants
- Unlimited enchants on every item (`archenchanter` = high slot cap on **artifacts**, not ignore slots)
- Enchantments that duplicate active **fusion toggles** on the action bar

---

## Open questions

1. **Ward Scribe** — timed charm (consumable) or permanent +1 PD slot enchant?
2. **Curses** — always on unidentified loot, or Enchanter-only mistake when crafting?
3. **Remove enchant** — free, gold cost, or destroys slot permanently?
4. **Scrolls** — find in loot vs craft only?
5. **Accessories** — rings/amulets with slots, or weapons/armour only at first?
6. **Legacy `profession-items` enchanting** — keep as Craft + Use path (original); add direct Enchanter apply later, or replace stones entirely?

---

## File touch list (when implementing)

| Area | File(s) |
|------|---------|
| Enchant catalog | `data/enchantments-data.js`, `data/json/enchantments.json` |
| Inventory shape | `js/character.js`, `js/storage.js` (save migration) |
| Stat merge | `js/character.js` `computeStats` |
| UI | `js/render.js`, `js/craft.js`, `js/actions.js` (`useEnhancementOnItem`) |
| Tooltips / compare | `js/tooltips-text.js`, `js/item-compare.js` |
| Constants | Remove or fulfil `ENCHANTMENTS_PLANNED` |
| Careers | Enchanter skills in future `careers` skill data |

---

*Enchantments = slots on gear + a small catalog + inventory persistence. Spells and fusion toggles stay separate; the app tracks what is on the item and applies stats when equipped.*
