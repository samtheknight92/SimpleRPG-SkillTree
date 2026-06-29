# LumenForge — Roadmap & Design Notes

Living document for planned work, deferred ideas, and audits.  
**Active project:** LumenForge RPG v5 (Nearly Complete) — folder `LumenForge_RPG/`  
**Legacy reference only (do not edit):** `Visual Studio - Skill Tree OLD SYSTEM`

---

## Design pillars — simpler than D&D

LumenForge is a **deliberately simple** tabletop RPG and companion app — **easier to play than D&D**. Design and copy should assume casual tables (including kids), not RAW optimizers.

| Prefer | Avoid |
|--------|--------|
| One counting rule per harmony ("+1 per Chef helping") | `n`, `n²`, or hidden formulas in player text |
| "+ Harmony Reaction:" + short target | "Other [careers] Harmony Reaction on…" |
| Upgrade at 2 helpers (d4→d6) | Extra riders at 3+ (reroll banks, splash maths) |
| UI tally ("3 Soldiers → +9 Physical Defence") | Mid-combat multiplication |

**Table test:** Can someone track this with fingers and one die? If not, simplify.

Persistent AI guidance: workspace `.cursor/rules/lumenforge.mdc` + `.cursor/rules/simple-game-design.mdc`

### Weapon & element identity — **Added**

Each weapon type and magic element has **four design traits** (versatility, burning, reach, etc.). Skills should reinforce at least one trait; fusion skills should hit traits from **both** parents. Full guide: **`DESIGN-WEAPON-ELEMENT-IDENTITY.md`** (includes Striker / unarmed martial arts).

---

## Homebrew tab (custom items & skills)

**Status:** Spec only — see **`ROADMAP-Homebrew.md`**.

Player/GM-created items (v1) and skills (v2), stored in localStorage, shared via export packs and embedded in character exports. No online sync.

---

## Priority — planned implementation

### 1. Roll feedback UX (action bar & combat rolls) — **Completed**

**Decision:** No floating dice-roller widget. The action bar and GM tab already cover rolling.

**Implemented:** Combat and roll toasts use `toastCombat()` — they stay on screen until the next toast or until you click (or press Enter/Space) to dismiss. Regular feedback toasts still auto-dismiss after ~2.9s.

**Covers:** action bar skill use (heals, procs, damage summaries), basic attack, end-of-turn processing, GM tab dice roller.

**Reference:** `js/utils.js` (`toast()`, `toastCombat()`), `js/actions.js`, `js/events.js` (`rollDice`).

---

### Mobile readiness — **Completed** (global compact density)

**Problem:** UI felt oversized on phones — heavy padding, large headers, tab bar wrapping, and a tall stacked action bar.

**Implemented:** `styles/compact.css` applies the compact mobile pass **at all viewport sizes** (tighter shell, topbar, cards, action bar, skill tiles, stats grid, gear rows). `styles/mobile.css` keeps **phone-only** behaviour: sidebar drawer, 2×2 resource grid, single-column skill shop, hidden skill blurbs under 760px.

**Reference:** `styles/compact.css`, `styles/mobile.css`, `styles.css` (base tokens), `index.html` (stylesheet order).

---

### 2. Elemental affinity system — **Completed**

**Decision:** Re-introduce elemental affinity / resistance / weakness mechanics.

**Player-facing damage scale** (typed damage only — multiply final element damage):

| Tier | Meaning | At the table |
|------|---------|----------------|
| **25% resistance** | Quarter damage | ÷4 |
| **50% resistance** | Half damage | ÷2 |
| **200% weakness** | Double damage | ×2 |
| **400% weakness** | Quadruple damage | ×4 |

Skill and item text uses **both** the % and plain words (e.g. `Fire weakness 200% (double fire damage)`). Attunements, gear, and **Analyze** reveal enemy tiers — meaningful at 10+ damage hits.

**Implemented:**

- `character.elementalAffinity` (Dragonborn creation and runtime)
- **Character tab:** `js/elemental-affinity.js` — 8 elements, 25/50/200/400% tiers + immunity; hover for sources
- **Combat:** typed damage multiply via `getElementalDamageMultiplier()` in damage resolution
- Monster racial skills, attunements, and gear wired into affinity aggregation

**Use old system as design reference only** for tier meanings and skill→affinity mappings.

**Retired:** Legacy `professions` skill tree removed from `skills-data.js` — use **`careers`** only.

---

### 2b. Racial & ascension — table-friendly pass ✓

**Decision (audit point 3):** Rewrite player `desc` text so high-tier racial and ascension skills read clearly at the table. Where a skill stays complex, document **original → easier** wording here instead of hiding the maths in jargon.

**Principles applied:**

- No D&D **advantage/disadvantage** — use “roll twice, keep higher/lower”
- No **PD/MD** abbreviations — spell out Physical Defence / Magical Defence
- Cap stacking bonuses with explicit **max** (e.g. Blood Frenzy **+6**, not “stackable up to +10”)
- Ultimates: one sentence for **who**, **range**, **damage**, **side effect**
- Ascension legendaries: state **once per day/combat/encounter/lifetime** up front

**Applied in data** (`data/races-data.js`, `data/skills-data.js` ascension + ultimate):

| Skill | Was (summary) | Now (summary) |
|-------|---------------|---------------|
| Fortune's Favor (Halfling) | advantage / disadvantage | next 3 rolls — roll twice, keep higher or lower |
| Orcish Fury | gains advantage | roll attack twice, keep higher |
| Blood Frenzy (Orc) | stackable up to +10 | +2 per kill in combat, **max +6** |
| Legendary Luck (Halfling) | per-source rest bookkeeping | once per short rest: reroll your save; once per short rest: ally within 10ft rerolls |
| Starlight Mastery (Elf) | long AoE prose | 30ft burst — enemies 4d8 light; allies heal 2d6 |
| Runic Weapon (Dwarf) | ignore resistances (vague) | +2d6 on next 10 hits; those hits **ignore elemental resistances** |
| Ancestral Might (Dwarf) | PD/MD abbreviations | Toggle: +4 Str, +3 Physical/Magical Defence (5 Stamina/round) |
| Ancient Fury (Dragonborn) | vague breath ultimate | 30ft breath — 4d8 element; **95%** status chance |
| Draconic Breath (Dragonborn) | — | 15ft cone 2d6; **20%** status chance |
| Infernal Constitution (Tiefling) | flat −1 fire | fire immunity; darkness **50% (half)**; +2 max Stamina |
| Devil's Bargain (Tiefling) | — | −2 enemy next attack/save; you take +1 from them until your next turn |
| Infernal Dominion (Tiefling) | — | 30ft hellfire 5 rounds — enemies 1d8 fire/start of turn; allies +1 damage |
| Drow Poison / Matron | — | +1d4 poison; 20% Dazed; ult = three shadow allies (GM, one attack each) |
| Gnoll Rampage / Alpha | — | on kill: move + bonus attack; ult = party-wide kill chains for 10 rounds |
| Probability Shift | advantage + disadvantage | reroll fail keep better; once also force enemy reroll keep worse |
| Instinctive Dodge | auto-dodge every attack | once per round: d20+Speed vs attacker accuracy |
| Analyze | vague reveal | HP band + elemental tiers (25/50/200/400%) + one trait (GM) |
| Nova / Ultimate Nova | friendly fire buried | auto-hit burst; state ally damage and Incapacitated/Exhausted cost |
| Soul Link | HP pool jargon | combined max HP pool; split damage/healing; 0 = both unconscious |
| Eternal Moment | temporal instability | 1 extra turn; enemies can't react; skip next turn |
| Chronos Rewind | — | undo last ally/your action — reroll or retarget (GM) |
| Aetherial Shift (both tiers) | dimensional instability | ignore one hit OR phase 1 round; clear action lockout |

**Intentionally left complex** (worth the extra table time at tier 4–5):

| Skill | Why it's OK | At the table |
|-------|-------------|--------------|
| **Runic Weapon** | Hit counter + ignore resist | Track “10 hits remaining” on sheet |
| **Infernal Dominion** | Zone over 5 rounds | One d8 per enemy at start of their turn |
| **Alpha Dominance** (Gnoll) | Party kill chains | Only triggers when an ally drops an enemy |
| **Drow Matron Magic** | GM-run shadows | Three allies, one simple attack each — no stat clone |
| **Soul Transference** | Once-per-lifetime fantasy | GM adjudicates body swap; original body in coma |
| **Familiar Summon / Monster Summoning** | Build-a-monster | 50 Lumens budget with GM — not a combat formula |

Re-run copy audit: `node scripts/audit-ruleset.mjs`

---

### 2c. Legendary gear & high-tier items — table-friendly pass ✓

**Decision (audit point 4):** Item `desc` must match what `GRANTS` / `specialEffects` actually do in `effects.json`. Drop narrative fluff that lies about mechanics (“instant kill on crit”, “ignores all defenses”, “creates matter from nothing”).

**Principles applied:**

- **Stats + damage + GRANTS rule** — one line the GM can read aloud
- Parenthetical after GRANTS name states the **table procedure** (dice, saves, once-per-scene, etc.)
- Legendary consumables: **Consume:** prefix with permanent/temporary effects spelled out
- Epic/rare weapons with misleading fluff updated the same way

**Critical fixes (wrong fluff → correct rule):**

| Item | Was (misleading) | Now (matches effect) |
|------|------------------|----------------------|
| **Executioner's Axe** | Instant kill on critical hits | +1d6 damage vs targets below half HP |
| **Void Dagger** | Ignores armor | Ignore 3 Physical Defence and 3 Magical Defence |
| **Reality Piercer** | Ignores all defenses | Once per scene: ignore barriers and 6 total defence |
| **World Cleaver** | Reality-breaking power | Once per scene: ignore all defence/cover; +2d6 force |
| **Infinity Spear** | Infinite reach (no rule) | Melee reach 30ft for 3 turns |
| **Berserker Axe** | Enters rage when wounded | +2 Str/Speed, −1 Physical Defence for 8 turns |
| **Genesis Rod** | Creates matter from nothing | +3 Magic Power 8 turns; minor objects — GM |

**Legendary weapons updated:** Dragon Blade, Shadow Fang, Temporal Blade, Star Bow, Titan's Hammer, Void Crusher, Chaos Axe, World Cleaver, Cosmic Staff, Genesis Rod, Infinity Spear, Reality Piercer.

**Legendary consumables updated:** Phoenix Feather, Dragon Heart, Elixir of Immortality.

**Intentionally complex (worth it at tier 5):**

| Item | At the table |
|------|----------------|
| **Reality Cut / Dimension Pierce** | Once per **scene** — track on sheet |
| **Time Strike** | Once per scene extra attack after hit |
| **Chaos Strike** | Roll element die each hit (fire/ice/lightning/void) |
| **Double Strike** | Two attack rolls; second doesn't re-trigger once-per-turn |
| **Creation Magic** | Narrative shaping — GM, not combat math |

Source: `data/items-data.js` — re-run `node scripts/build-data.mjs` after edits.

---

### 3. Enchantment system — **Completed** (core)

**Decision:** Implement fully — scaffolding already exists.

**UI (equipped gear — Character tab):**

- Every slot on equipped weapon/armor/accessory is visible (empty dashed chip or filled chip).
- Filled slots hover-tooltip explains what the enchant does while equipped.
- Empty slots: plain chip — apply from Inventory on the enhancement item.

**Implemented:**

- `js/enchantments.js` — resolve enhancement recipes, slot limits, stat/damage/effect aggregation, tooltips
- Apply / remove on Character tab (`applyEnchantment`, `removeEnchantment` in `js/actions.js`)
- Stats, damage bonuses, and special effects from enchants on equipped gear
- Dwarf **Forge Blessing**: +1 enchant slot on crafted weapons/armor (`craft-bonuses.js`)
- Enchanter **Artifact Shaping**: crafted gear with that skill gets at least 2 slots when base is lower

**Enhancement source:** 14 craft recipes under `profession-items` → `enchanting` (sharpening stones, ward charms, runes, etc.)

**Table note:** Enchants are **active while attached** to equipped gear. Click the chip to remove and get the enhancement item back — no round tracking.

---

### 4. Character folders (GM encounter prep) — **Completed**

**Decision:** Add folder-style organisation for characters.

**Implemented:**

- **`character.folder`** on each character (saved in export/import)
- Sidebar **accordion folders** (Unfiled + named folders, fold like Create Character) with per-character **Move** dropdown
- **GM Tools → Spawn to folder** — premade spawns (and new characters while a spawn folder is set) land in that folder

**Reference:** `js/character-folders.js`, `js/render.js` (sidebar), `js/actions.js`, `js/storage.js`

---

### 5. Off-hand equipment slot (shields, tomes, instruments & more)

**Current state:** The off-hand slot exists in character data and UI (`character.equipped.offhand`, equip rows, combat damage from off-hand weapon). Today it only unlocks via the **Dual Wield** skill and accepts **daggers** in the off-hand (`js/equipment.js`, `js/actions.js`, `js/render.js`).

**Idea:** Generalise the slot so other builds can use it — not only dual-wield rogues.

**Possible off-hand categories:**

- **Shields** — fighters, paladins; block/defence bonuses; may conflict with two-handed weapons
- **Tomes / focus items** — casters; magic power or spell-related bonuses
- **Parrying daggers / bucklers** — keep current dual-wield path
- **Instruments** — Musician career skills work **vocally without gear**; equipping an instrument in the off-hand **amplifies** performance (stronger numbers, wider area, longer duration, or lower stamina — see deferred design notes in §9). Instrument **items**, craft recipes, and equip rules ship **with this item**, not with the career tree.
- **Future:** torches, holy symbols, other class-specific focus items

**Design questions to resolve:**

- Skill-gated vs always-available when main hand is one-handed?
- Item tagging in `items.json` (`offhandType`: shield | tome | weapon | …) vs inferring from type/name
- Mutual exclusion rules (shield + two-hander, tome + bow, etc.)
- Combat integration beyond extra weapon damage (block, AC, spell bonuses)

**Reference:** `js/equipment.js` (`offhandSlotAvailable`, `characterHasDualWield`), equip/unequip in `js/actions.js`, Character tab equip UI in `js/render.js`.

---

### 10. Race, background & content audit — **Completed** (2026-06)

**Decision:** Full audit required before treating content as “complete”.

**Tooling:** `node scripts/content-audit.mjs` (companion: `node scripts/validate-data.mjs`, `node scripts/balance-audit.mjs`)

**Checklist:**

- [x] Every race `passiveTraits` text matches implemented rules (`data/races-data.js` → `races.json`, `js/race-passives.js`, `js/effects.js`, `js/craft.js`, `js/damage-breakdown.js`, `js/elemental-affinity.js`)
- [x] Immunities and special rules exist as real effects in `data/json/effects.json` where claimed (poison/fire/disease/charm/fear → wired; dragonborn resist → affinity system)
- [x] Background starting packages match `js/backgrounds.js` — all 8 backgrounds, item IDs valid
- [x] Dragonborn affinity — creation UI + all 6 pedestrian dragonborn premades have valid affinity
- [x] Skill effect references — `validate-data.mjs` passes (738 skills, activationEffects + specialEffects)
- [x] Premade characters — 163 templates; skills/items/equipped valid; tier gates enforced only on level-5 starters (NPCs/monsters may exceed player gates by design)

**Fixes applied during audit:**

- Halfling passive text: `+1 Speed` → `+2 Speed` (matches `statModifiers.speed`)
- Elf longevity: `aging and disease` → maps to `disease_immunity` in `js/effects.js`
- Dwarf **Master Craftsman**: −1 material wired in `js/craft.js` (`materialQuantityNeeded`)

**Intentional table/GM rules (not app-automated):**

| Race | Passive | Why |
|------|---------|-----|
| Halfling | Lucky (reroll natural 1) | No dice roller in app |
| Orc | Relentless Endurance (0→1 HP) | GM adjudicated |
| Human | Ambitious Spirit (+10% Lumens) | Defeat loot is manual GM award |
| Drow | Sunlight Sensitivity (−1 Accuracy) | No “bright sun” scene toggle |
| Gnoll | Pack Tactics (+1 Accuracy adjacent ally) | Party positioning not tracked |

**Info (cosmetic, not blocking):** Many races have `statModifiers` not repeated verbatim in passive trait blurbs — stats still apply via `computeStats`. Level-5 starter premades omit “Defeat loot:” in notes (player builds, not enemies).

**Note:** Gorgeous **added** backgrounds and conditional race passives the old app lacked — audit for correctness, not for restoring old prose verbatim.

---

## Deferred — future, not now

### 7. Skill tree tree-map visuals

**Decision:** No SVG connection-line tree for now. Old grid + lines were janky; a true tree-map layout isn’t realistic in a basic static webapp without disproportionate effort.

**Current approach is fine:** card grid + prereq labels + state colours in `js/render.js`.

---

### 8. Custom icon pack

**Decision:** Eventually commission or build an icon set tailored to LumenForge — emoji-in-data is a placeholder.

**Not in scope until** art direction and asset pipeline are decided. Do not port old `icon-mapping.js` / PNG folder structure.

---

### 9. Musician career — **Completed** · instruments deferred

**Status:** **Musician career** is in data (`scripts/generate-careers.mjs` → `careers-skills-data.js`, harmony `desc` strings). Singing works without gear — no instrument required to perform.

**Still deferred → off-hand expansion (item 5):** **Instrument items** (shop/craft), off-hand equip when eligible, and in-combat **amplification** of Musician skills (numbers, area, duration, stamina — by instrument type/tier).

**Design reference** (for when instruments ship with item 5):

**Full-party musicians (ensemble play):**

Deliberately viable — nothing stops **every player** from taking Musician. The system should reward coordinated bands, not punish duplicate careers.

- **Harmony stacking** — when multiple allies perform the **same song** at the same time, bonuses stack from each performer (not just the “lead”).
- **Example — *Work Song* (tier 1 sketch):**
  - **Cost:** 5 Stamina once when you start (not per turn).
  - **Duration:** up to 3 turns — but see **sustained performance** below.
  - **Base effect (each performer):** allies in hearing range gain **+1 Strength**.
  - **Harmony bonus (each *other* ally playing the same song):** **+1 Physical Defence** to those same listeners (stacks per simultaneous performer).
  - **Worked example:** three musicians all play *Work Song* while a fourth fighter listens → fighter gets **+3 Strength** (one per performer) and **+3 Physical Defence** (harmony from three performers). Tune numbers in balance pass; the *pattern* is the design.
- **Same song rule:** harmony requires matching skill ID (or “same piece” tag), not just “any music” — encourages call-and-response at the table (“everyone roll Inspire on three!”).

**Sustained performance (buffs live only while you play):**

- Effects are **not** fire-and-forget. “Duration 3 turns” means the musician **commits** to performing for up to 3 turns — singing/playing each turn (or using a dedicated Perform action) to **maintain** the aura.
- **Stamina is paid upfront** when the performance starts; maintaining it costs actions/time, not repeated stamina each turn (unless a higher-tier song says otherwise).
- **End early anytime** — stop performing on your turn; buffs from *your* contribution drop immediately (others’ performances keep their slice of the stack).
- **Interrupted** — damage, silence, grapple, etc. may break concentration (GM / effect rules TBD).
- **UI implication:** show “Performing: *Work Song* (turn 2/3)” on the character; action bar may need a **Stop performance** / **End song** control alongside toggles.

**Fits existing systems (career — done):**

- Subcategory under `careers` in `data/json/skills.json` ✓
- Harmony text on skills; table applies joins and stacking ✓

**Fits existing systems (instruments — with off-hand item 5):**

- Craft recipes for instruments in profession/craft data (`data/json/profession-items.json` or items shop)
- Off-hand slot rules when character has Musician tier-1 (or specific skill) instead of/in addition to Dual Wield
- Optional amplification stat/effect hooks when an instrument is equipped

**Optional app polish (any time):**

- Status effects in `effects.json` for performance buffs/debuffs; hook into `js/effects.js` and combat/turn flow
- **`character.activePerformance`** (song id, turns remaining) — solo sustain tracker on one sheet
- Turn/end-of-turn hooks to tick duration, drop auras when performer stops

**Design questions (mostly for instruments + off-hand):**

- One-handed main hand + instrument off-hand only, or instrument can be main hand too?
- Friendly fire on debuffs — do enemies-only auras need a target mode?
- Instrument tiers / rarity → scaling buff to career skills
- Overlap with existing “careers” that are mostly crafting — Musician is **active play** support; may need clearer UI label (Career vs Profession)
- Harmony: must performers start the same song on the **same round**, or is “already performing” enough to join mid-song?
- Do non-musicians in hearing range get debuffed by dissonant enemy songs while allies are buffed?

**Depends on:** Off-hand slot expansion (item 5) for **instruments**; optional solo performance state in combat turn flow.

**Core fantasy (unchanged):**

- **Singing always works** — every Musician career skill can be used vocally (no gear required).
- **Instruments amplify** — when item 5 lands, off-hand instruments buff career skills (see above).
- **Area performance** — many skills affect everyone who can hear within range; GM defines audience (LOS, silence, deafened, distance).

---

## Explicitly out of scope / agreed no action

| Topic | Notes |
|---|---|
| Floating dice roller widget | Covered by action bar + GM tab roller |
| Old admin / itemadmin tooling | Dev clutter; Gorgeous shop/craft/data scripts are enough |
| Standalone `status-effects.js` | Replaced by `effects.json` + `js/effects.js` (382 effects) |
| Old balance/design doc bulk | Archive in legacy folder if needed; not runtime code |
| `enchantments-data.js` / `monster-system-new.js` | Never existed as separate files in legacy repo |

---

## Suggested implementation order

1. ~~Longer-lived roll toasts~~ ✓
2. ~~Mobile readiness~~ ✓
3. ~~Elemental affinity (UI + combat)~~ ✓
4. ~~Musician career (skills + harmony copy in data)~~ ✓ — **instruments** deferred to item 7 below
5. ~~Content audit (race/background/effects)~~ ✓
6. ~~Enchantments (data + UI)~~ ✓
7. ~~Character folders (GM QoL)~~ ✓
8. Off-hand slot expansion (shields, tomes, **instruments**, broader equip rules)
9. Optional: solo **performance sustain tracker** on one sheet (`Performing: Work Song (2/3)`) — harmony stacking stays at the table

---

## Team harmony — same career & cross career (design draft)

**Goal:** Reward coordinated parties without bloating every career tree. Prefer **buffing existing skills** via a shared **Harmony** rule rather than adding many new tier-2/3 nodes.

**Global rules (proposed):**

- **Harmony Reaction (joining in):** The **first** ally uses the skill normally (**Action**, or **sustain** for songs). Any **joiners** use a **Harmony Reaction** — **not an Action** — so they can pile on **before the next enemy turn** (or during the lead’s harmony window). **Cost:** each joiner **loses their next turn** (they reacted instead of acting). They can still move on that skipped turn if your table allows “move only” on a lost turn, or treat it as fully skipped — pick one at the table. Requires same career + eligible same skill (or same song ID). **At the table:** players call out joins; the GM counts helpers and applies the `+ Harmony Reaction:` line on the skill. **This app does not sync harmonies across character sheets** (local play aid, not online/multiplayer).
- **Harmony ≠ “use the skill twice”:** If three Soldiers can already Shield Wall the same ally for **+1 + +1 + +1**, harmony must add **extra** benefit for coordinating on the **same target** the same round. Use the **huddle stacking** rule below where noted.
- **Huddle stacking (Shield Wall pattern — implementation):** Count everyone helping (lead + Harmony Reactions). Each helper’s contribution equals the headcount — **add that number once per helper** (e.g. 3 Soldiers → +3+3+3 = **+9 Physical Defence**; 5 Soldiers → **+25 Physical Defence**). Solo (one helper) stays **+1**. **No maximum headcount.**
- **Layered buff (Phalanx pattern):** A second bonus type kicks in when more allies qualify — e.g. **+1 accuracy per Phalanx Soldier**, plus **+1d4 damage for each Phalanx Soldier when 2+** attack the same enemy. Each skill picks its own pair.
- **Passive harmonics:** Some skills (e.g. **Phalanx**) are **passive** — no Action, no harmony window, no Harmony Reaction. Bonus applies when the trigger condition is met (same-target focus fire).
- **Open-ended headcount:** Any number of allies may join the same harmony. **Examples (3 Soldiers, 5 Soldiers, etc.) are samples** — not limits. Large groups keep using the same **“each additional…”** rule.
- **Plain language in player text (required):** Skill **`desc`** strings must **not** use **n**, **n²**, or algebra. Write **“each additional…”**, **“+1 per [career] helping”**, or **“count them, add +X each”**. **Implementation** may store a formula; **UI and `skills.json` desc** do not.
- **One rule per harmony:** Prefer **a single counting line** players can do at the table. Avoid extra bookkeeping — long-rest banks, splash maths, “every 3 also…”, or second riders at 2+/3+ unless that *is* the whole skill. When in doubt, **+1 per helper** (or the career’s one special rule) is enough.
- **Same-skill harmony:** 2+ allies with the same career join the **same harmony window** (lead Action + joiner Reactions) → apply the listed rule. Design notes below may show totals for GMs; player text stays verbal.
- **Cross-career:** Trigger skill from career A amplifies an **existing** skill/effect from career B (no extra skill required on B). Cross-career bonuses apply when the **lead** uses an Action; other careers do **not** spend Harmony Reactions unless explicitly noted (e.g. two Soldiers Shield Wall + Musician song is cross-career buff on the lead’s performance, not a third Reaction).
- **Sustained vs instant:** Musician-style songs must be **maintained**; joiners can Harmony Reaction into an **already playing** song (also skip next turn) to add harmony stacks without spending an Action to start.
- **New skills:** Only where no existing skill fits — marked **NEW** below (Musician career is all new).

**Harmony pattern catalog** *(pick one per skill — avoids every career feeling like “+1 per ally”):*

| Pattern | When to use | Examples |
|---------|-------------|----------|
| **Huddle stacking** | Same beneficiary; each helper adds “headcount” once per helper (addition, not algebra) | Shield Wall, Ward Circle |
| **Per-helper flat** | Each joiner adds the same chunk — count helpers | Rally Cry (+2 each) |
| **Per-helper opener** | Pre-combat; each Chef adds the same bundle | Battle Breakfast |
| **Layered passive** | Passive trigger; second bonus at 2+ helpers | Phalanx (+acc, then +d4 each) |
| **Upgrade tier** | Same target; quality steps up, not double application | Empower Ally (d4→d6) |
| **Duration / scope weave** | Craft, buffs, marks — extend time, reach, or beneficiaries | Banquet Planner, Volley Call |
| **Zone escalation** | Same area; penalty or cover stacks per helper | Suppressing Fire, Reinforced Frame |
| **Setup chain** | Debuff helps one ally’s next attack | Dirty Trick |
| **Compound craft** | Same-round throws stack damage | Acid Vials |
| **Aura stack** | Passive overlap — **+1 per source** in range, full stop | Paladin, Plague Ward |
| **Menu / split output** | Each joiner adds a **different** benefit line | Teach (different topics), feast stats |
| **Investigation depth** | Non-combat; extra clue tiers per helper | Keen Eye |
| **Aura-per-source** | Already in data; harmony documents intent, no Reaction | Phalanx Formation |

---

### A. Same career — base skill vs harmony add-on

**ROADMAP format:** **Today** = design notes / current `skills.json` behaviour. **+ Harmony** = what stacks when allies coordinate. **Example** = quick math.

**Player-facing `desc` format (preferred — use in `skills.json`, effects, and UI):**

- **One string** per skill — do **not** split Today and Harmony across fields or line breaks.
- Open with **`Action:`** or **`Passive:`** (match existing skills), then the base effect.
- Append **`+ Harmony Reaction:`** for skills joiners enter via Harmony Reaction — **not** “Other [careers] Harmony Reaction on…”. Add a **short target** after the colon if needed (`same ally`, `same feast`, `same target`). Passive / no-Reaction skills keep **`+ Harmony:`**.
- Add **one or two number examples** players can copy (e.g. `3 Soldiers → +3+3+3 = +9 Physical Defence`) — examples are not caps.
- Use **`;`** to separate clauses; **`→`** only for worked examples.

- Plain language only — **“each additional…”**, **“+1 per [career] helping”**, **“count them, add +X each”**. **Never `n`, `n²`, or “where n =”.**

**Template:** `{Action|Passive}: {base effect}. + Harmony Reaction: {optional target} ({each additional / per helper rule}; {example}).` — or **`+ Harmony:`** for passives / no Reaction.

**Soldier reference copy (target `desc` strings):**

| Skill | Target `desc` |
|-------|----------------|
| **Shield Wall** | `Action: Adjacent ally gains +1 Physical Defence until your next turn. + Harmony Reaction: same ally (each Soldier in the huddle adds +1 Physical Defence per Soldier helping — count heads, add that many once per Soldier; 3 Soldiers → +9 Physical Defence; 5 Soldiers on one ally → +25 Physical Defence).` |
| **Rally Cry** | `Action: One ally within 30ft may reroll a failed save (once per combat). + Harmony Reaction: that reroll (+2 for each participating Soldier; 5 Soldiers → +10 on the reroll).` |
| **Phalanx** | `Passive: When you and two or more allies attack the same target, all gain +1 accuracy. + Harmony: +1 accuracy on next hit vs that enemy per Phalanx Soldier in the volley; when 2+ Phalanx Soldiers attack, also +1d4 damage per Phalanx Soldier (all focus-fire attackers benefit; no Reaction).` |

When adding harmony to other careers, include **`Desc (target)`**, **`Pattern`**, and design bullets — same structure as Soldier and entries below.

---

#### Musician *(career in data ✓; harmonies at table; instruments → off-hand item 5)*

**Work Song** *(tier 1)*  
- **Desc (target):** `Action: Sustain up to 3 turns (5 Stamina once); allies in hearing range +1 Strength per performing Musician. + Harmony Reaction: join the same song (+1 Physical Defence per Musician while sustained; e.g. 6 Musicians → +6 Strength and +6 Physical Defence).`  
- **Pattern:** **Duration weave** + **layered** (Strength from performers, Physical Defence from harmony joiners).  
- **Today:** *(planned)* **Action** to start · 5 Stamina once · sustain up to 3 turns (must keep performing; can stop early). Allies in hearing range: **+1 Strength** per performing Musician.  
- **+ Harmony:** Joiners use **Harmony Reaction** to enter the **same song** (skip next turn) — each adds **+1 Physical Defence** to listeners while the ensemble sustains. Lead must keep performing.  
- **Example (1 Action + 2 Harmony Reactions, 1 fighter listening):** Fighter gets **+3 Strength**, **+3 Physical Defence** — while all three keep performing.

**Musician baseline** *(career rule — not a skill)*  
- **Vocals always work** — no instrument required. **Off-hand instruments amplify** (longer sustain, count as 2 Musicians at uncommon+, listener +1 at rare+ — see glossary *Instrument amplify*).

**Long Set** *(tier 2, passive)*  
- **Desc:** Your sustained songs may last 1 extra turn (e.g. Work Song up to 4 turns with instrument bonuses).

**Encore** *(tier 3, passive)*  
- **Desc:** Once per combat, play the same song again for free — base sustain length only (no Long Set, instrument, or other bonus turns).

**Marching Tune** *(tier 2)*  
- **Desc (target):** `Action: Sustain up to 2 turns (4 Stamina once); allies in hearing range +1 Speed per performing Musician. + Harmony Reaction: join the same song (+1 initiative for listeners while sustained).`

**Soothing Hymn** *(tier 2)*  
- **Desc (target):** `Action: Sustain up to 2 turns (4 Stamina once); allies in hearing range +1 Magical Defence per performing Musician. + Harmony Reaction: join the same song (+1 Stamina at the start of each listener's turn while sustained).`

**Battle Anthem** *(tier 3)*  
- **Desc (target):** `Action: Sustain up to 3 turns (6 Stamina once); allies in hearing range +1 accuracy per performing Musician. + Harmony Reaction: join the same song (+1 damage on next hit per Musician while sustained).`

**Dissonant Note** *(tier 3)*  
- **Desc (target):** `Action: Sustain 1 turn (4 Stamina once); enemies in hearing range −1 accuracy per performing Musician. + Harmony Reaction: join the same song (−1 per Musician on enemy saves while sustained).`

---

#### Soldier

**Shield Wall** (tier 2)  
- **Desc (target):** `Action: Adjacent ally gains +1 Physical Defence until your next turn. + Harmony Reaction: same ally (each Soldier in the huddle adds +1 Physical Defence per Soldier helping — count heads, add that many once per Soldier; 3 Soldiers → +9 Physical Defence; 5 Soldiers on one ally → +25 Physical Defence).`  
- **Today (solo):** One Soldier — **Action** — adjacent ally **+1 Physical Defence** until your next turn.  
- **Today (3 Soldiers, no harmony rule):** Three Shield Walls on the same ally would already be **+1 + +1 + +1 = +3 Physical Defence** (linear).  
- **+ Harmony (huddle stacking):** Lead uses **Action**; any number of allies may **Harmony Reaction** (same ally, same round) — skip next turn each. **Count Soldiers in the huddle**; **each Soldier adds that many Physical Defence once** (3 → +3+3+3, 5 → +25).  
- **Example (5 Soldiers, 1 ally — hex ring on a 6th):** **+25 Physical Defence** on the protected ally.

**Rally Cry** (tier 2)  
- **Desc (target):** `Action: One ally within 30ft may reroll a failed save (once per combat). + Harmony Reaction: that reroll (+2 for each participating Soldier; 5 Soldiers → +10 on the reroll).`  
- **Today (solo):** **Action** — one ally within 30ft **may reroll a failed save** (once per combat per Soldier).  
- **+ Harmony:** Lead **Action**; any number of joiners **Harmony Reaction** — **+2 on the reroll per participating Soldier** (count everyone helping, add +2 each time).  
- **Example (5 Soldiers, same ally):** Reroll gets **+10**.

**Phalanx** (tier 3, **passive**)  
- **Desc (target):** `Passive: When you and two or more allies attack the same target, all gain +1 accuracy. + Harmony: +1 accuracy on next hit vs that enemy per Phalanx Soldier in the volley; when 2+ Phalanx Soldiers attack, also +1d4 damage per Phalanx Soldier (all focus-fire attackers benefit; no Reaction).`  
- **Today (in `skills.json`):** Passive — when **you and two or more allies** attack the **same target**, all gain **+1 accuracy**. *(Requires 3+ total attackers; flat +1 only.)*  
- **+ Harmony (layered — passive focus fire):** Still **passive** — no Reaction. When allies **attack the same enemy** in the same round:

  - **+1 accuracy** on next hit vs that enemy **for each Phalanx Soldier** in the volley (count Phalanx Soldiers, add +1 each).  
  - **When 2 or more Phalanx Soldiers** are in that volley, also **+1d4 damage per Phalanx Soldier** on that next hit (count again, roll that many d4).  
  - **All focus-fire attackers** benefit (not only Soldiers). Only Soldiers **who attacked** count toward Phalanx — not joiners who didn’t attack.

- **Example (1 Phalanx Soldier + 3 other allies vs boss):** Everyone’s next hit **+1 accuracy**.  
- **Example (3 Phalanx Soldiers vs boss):** Everyone’s next hit **+3 accuracy** and **+3d4 damage**.  
- **Example (6 Phalanx Soldiers vs boss):** Everyone’s next hit **+6 accuracy** and **+6d4 damage**.  
- **Note:** Distinct from **Polearm · Phalanx Formation** (defensive aura per polearm ally nearby).

---

#### Chef

**Banquet Planner** (tier 3)  
- **Desc (target):** `Craft: Feast for the party; shared +1 Accuracy for 20 rounds. + Harmony Reaction: same feast (each additional Chef adds +1 Accuracy and +5 feast duration; 9 Chefs → +9 Accuracy for 65 rounds).`  
- **Pattern:** **Duration weave** — count Chefs; each adds **+1 Accuracy** and **+5 rounds**.  
- **Today:** Craft — feast for the whole party; **one shared buff** (e.g. **+1 Accuracy for 20 rounds**).  
- **+ Harmony:** Each Chef **Harmony Reaction** on the **same feast** adds **+1 Accuracy** and **+5 rounds** (start at 20 rounds, **+5 for each additional Chef** after the first).  
- **Example (9 Chefs, one feast):** **+9 Accuracy for 65 rounds** (20 + 8×5).

**Battle Breakfast** (tier 3)  
- **Desc (target):** `Craft: Before first combat, one eater gains +2 initiative or +1 Physical Defence (first combat only). + Harmony Reaction: same meal (when 2+ Chefs, each served eater gets both bonuses; each Chef adds +2 initiative, +1 Physical Defence for one combat round, +1 Stamina round 1, and +1d4 temp HP at combat start; one eater per Chef).`  
- **Pattern:** **Per-helper opener** — count Chefs; each adds the same bundle (tier-3 punch without multiplication).  
- **Today:** Craft — pre-combat meal; **one eater** **+2 initiative** *or* **+1 Physical Defence** for **first combat only**.  
- **+ Harmony:** Lead prepares one meal; any number of Chefs **Harmony Reaction** into the **same prep**. Each Chef assigns **one eater** (default one eater per Chef). **When 2+ Chefs**, each served eater gets **both** solo lines (+2 init **and** +1 Physical Defence). **Each Chef** on the meal adds for each served eater:

  - **+2 initiative** (first combat)  
  - **+1 Physical Defence** for **one more combat round** (stack rounds by counting Chefs)  
  - **+1 Stamina** on round 1 (count Chefs, add +1 each)  
  - **+1d4 temp HP** at combat start (roll one d4 per Chef)

- **Example (3 Chefs, 3 frontliners):** Each eater **+6 initiative**, **+3 Physical Defence** for rounds 1–3, **+3 Stamina** round 1, **3d4 temp HP**.  
- **Example (5 Chefs, 1 champion):** One eater **+10 initiative**, **+5 Physical Defence** for 5 rounds, **+5 Stamina** round 1, **5d4 temp HP**.  
- **Example (9 Chefs, 9 allies):** Each **+18 initiative**, **+9 Physical Defence** for 9 rounds, **+9 Stamina** round 1, **9d4 temp HP**.

---

#### Mage *(career)*

**Ward Circle** (tier 3)  
- **Desc (target):** `Action: 10ft aura; allies +1 Magical Defence for 3 rounds (once per combat). + Harmony Reaction: overlapping circles (each Mage in the overlap adds +1 Magical Defence per Mage helping — count Mages, add that many once per Mage; 3 Mages → +9 Magical Defence; 5 Mages → +25 Magical Defence).`  
- **Pattern:** **Huddle stacking** (same counting rule as Shield Wall, magical defence).  
- **Today (solo):** Action — 10ft aura; allies **+1 Magical Defence for 3 rounds** (once per combat).  
- **Today (2 Mages, overlap, no harmony):** Two circles on overlap could already be **+2 Magical Defence** (linear).  
- **+ Harmony (huddle stacking):** Overlapping circles same round — **each Mage in the overlap adds +1 Magical Defence per Mage helping** (same counting as Shield Wall). Joiners use **Harmony Reaction** (skip next turn).  
- **Example (5 Mages, overlap):** **+25 Magical Defence** in that patch.

**Empower Ally** (tier 2)  
- **Desc (target):** `Action: Ally's next spell or magical attack +1d4 damage or heal +2 HP (once per ally per combat). + Harmony Reaction: same ally (when 2+ Mages, +1d6 damage or +3 HP instead).`  
- **Pattern:** **Upgrade tier** — solo d4/+2 HP; **2+ Mages** → d6/+3 HP.  
- **Today:** Action — ally’s next spell or magical attack **+1d4 damage** or heal **+2 HP** (once per ally per combat).  
- **+ Harmony:** **When 2+ Mages** on the **same ally** same round → **+1d6 damage** or **+3 HP** (upgrade, not double stack). More Mages do not stack further — still one empowered cast.  
- **Example (3 Mages, damage):** Next spell **+1d6** (was +1d4).

---

#### Paladin *(career)*

**Aura of Protection** (tier 3, passive)  
- **Desc (target):** `Passive: Allies within 10ft +1 Magical Defence vs fear and charm. + Harmony: +1 Magical Defence vs fear and charm per Paladin with this aura in range (no Reaction).`  
- **Pattern:** **Aura stack** — count Paladins in range, add +1 Magical Defence each.  
- **Today:** Allies within 10ft **+1 Magical Defence vs fear and charm**.  
- **+ Harmony:** **+1 Magical Defence** per Paladin with this aura within 10ft of the ally (passive — no Reaction).  
- **Example (3 Paladins clustered):** Allies in range **+3 Magical Defence vs fear/charm**.

---

#### Medic

**Plague Ward** (tier 3, passive)  
- **Desc (target):** `Passive: Allies within 10ft +1 Magical Defence vs disease and poison saves. + Harmony: +1 Magical Defence vs disease and poison per Medic with this aura in range (no Reaction).`  
- **Pattern:** **Aura stack** — same as Paladin, different save tag.  
- **Today:** Allies within 10ft **+1 Magical Defence vs disease/poison saves** (GM).  
- **+ Harmony:** **+1 Magical Defence** per Medic with Plague Ward within 10ft (passive — no Reaction).  
- **Example (2 Medics):** Allies **+2 Magical Defence vs disease/poison** in the combined aura.

---

#### Cleric (Lay)

**Lay Blessing** (tier 1)  
- **Desc (target):** `Action: Touch ally; +1 Magical Defence for 8 hours (once per ally per day). + Harmony Reaction: same ally, same day (+1 Magical Defence per Cleric blessing that ally).`  
- **Pattern:** **Per-helper flat** — count Clerics, +1 Magical Defence each on the same target.  
- **Today:** Action — touch ally; **+1 Magical Defence for 8 hours** (once per ally per day).  
- **+ Harmony:** **+1 Magical Defence per Cleric** blessing the same ally same day via **Harmony Reaction**.  
- **Example (3 Clerics, same ally):** **+3 Magical Defence for 8 hours**.

**Sanctuary Camp** (tier 3)  
- **Desc (target):** `Action: Short rest in consecrated camp; each ally removes one fear or charm. + Harmony Reaction: same camp (each ally removes one additional fear or charm per Cleric at that rest).`  
- **Pattern:** **Per-helper flat** — count Clerics, +1 cleanse each per ally.  
- **Today:** Action — short rest in consecrated camp; **remove one fear/charm**.  
- **+ Harmony:** Each Cleric **Harmony Reaction** on the **same camp** lets each ally remove **one additional** fear/charm (count Clerics helping).  
- **Example (3 Clerics):** Each ally removes **up to 3** fear/charm.

---

#### Ranger

**Volley Call** (tier 3)  
- **Desc (target):** `Action: Call a target; one ally +1 on next attack vs it. Once per combat. + Harmony Reaction: same target (each Ranger adds +1 to marked allies' next attack and marks one more ally).`  
- **Pattern:** **Duration / scope weave** — count Rangers; **+1 per Ranger** and **one more marked ally each**.  
- **Today:** Action — call a target; **one ally +1 on next attack** vs it (any weapon/spell). Once per combat.  
- **+ Harmony:** Each Ranger **Harmony Reaction** on the **same target** same round **marks one additional ally** and adds **+1** to the next attack vs that foe for all marked allies (count Rangers for both).  
- **Example (5 Rangers, same target):** Five allies each get **+5** on their next attack vs that foe.

---

#### Thief

**Dirty Trick** (tier 2)  
- **Desc (target):** `Action: Distract a foe; one ally +2 on next attack vs that target. + Harmony Reaction: same foe (each additional Thief adds +1 to that attack).`  
- **Pattern:** **Per-helper flat** — base +2, **+1 per additional Thief**.  
- **Today:** Action — distract a foe; **one ally +2 on next attack** vs that target.  
- **+ Harmony:** Each **additional** Thief **Harmony Reaction** on the **same foe** adds **+1** to that ally’s bonus.  
- **Example (4 Thieves):** Ally **+5** on next attack (+2 + three additional +1s).

---

#### Marksman

**Suppressing Fire** (tier 2)  
- **Desc (target):** `Action: Suppress a zone; enemies −1 to attacks or movement for 1 round. + Harmony Reaction: same zone (−1 penalty per Marksman).`  
- **Pattern:** **Per-helper flat** — count Marksmen, −1 each.  
- **Today:** Action — suppress a zone; enemies **−1 to attacks or movement for 1 round**.  
- **+ Harmony:** Each Marksman **Harmony Reaction** on the **same zone** adds **−1** to the chosen penalty (count Marksmen).  
- **Example (4 Marksmen):** Enemies **−4** to chosen penalty.

---

#### Berserker

**Intimidate** (tier 2)  
- **Desc (target):** `Action: Foes within 10ft save or −1 accuracy for 1 round. + Harmony Reaction: same area (−1 accuracy per Berserker on failed save).`  
- **Pattern:** **Per-helper flat** — count Berserkers, −1 on failed saves each.  
- **Today:** Action — foes within 10ft save or **−1 accuracy for 1 round**.  
- **+ Harmony:** Each Berserker **Harmony Reaction** adds **−1 accuracy** on failed saves (count Berserkers).  
- **Example (3 Berserkers):** Failed save → **−3 accuracy**.

---

#### Blacksmith

**Field Fit** (tier 2, pre-combat)  
- **Desc (target):** `Pre-combat: Tune ally gear (10 min); +1 first attack roll or +1 Physical Defence first round (choose one). Once per ally per long rest. + Harmony Reaction: same ally (2 Smiths → both bonuses).`  
- **Pattern:** **Upgrade tier** — solo OR → harmony AND (clean, prep-phase fantasy).  
- **Today:** Tune ally’s gear (10 min); **+1 first attack roll *or* +1 Physical Defence first round** (choose one). Once per ally per long rest.  
- **+ Harmony:** Two+ Smiths **Harmony Reaction** tuning the **same ally** → grant **both** (+1 first attack **and** +1 first-round Physical Defence).  
- **Example (2 Smiths, same fighter):** Fighter gets **both** bonuses (today you only pick one).

---

#### Alchemist

**Acid Vials** (tier 2 — representative for thrown crafts)  
- **Desc (target):** `Craft/throw: On hit 1d6 acid; 40% Weakened. + Harmony Reaction: same target, same round (+1 acid damage per Alchemist).`  
- **Pattern:** **Per-helper flat** — **+1 acid damage per Alchemist** on hit.  
- **Today:** Craft/throw — on hit **1d6 acid**; 40% Weakened. *(Volatile Expert separately: allies −1 friendly-fire damage.)*  
- **+ Harmony:** Each Alchemist **Harmony Reaction** on the **same target** same round adds **+1 acid damage** on hit.  
- **Example (3 Alchemists):** Hit deals **1d6+3 acid**.

---

#### Engineer

**Reinforced Frame** (tier 2)  
- **Desc (target):** `Craft: Portable cover; +3 Physical Defence while behind it. + Harmony Reaction: same lane (+1 Physical Defence per additional Engineer).`  
- **Pattern:** **Per-helper flat** — **+3 base**, **+1 Physical Defence per additional Engineer**.  
- **Today:** Craft — portable cover; **+3 Physical Defence** while behind it.  
- **+ Harmony:** Each **additional** Engineer **Harmony Reaction** on the **same lane** adds **+1 Physical Defence**.  
- **Example (4 Engineers):** Cover **+6 Physical Defence** (+3 + three additional +1s).

---

#### Scholar

**Teach** (tier 3)  
- **Desc (target):** `Action: Ally gains your tier-1 knowledge skill for one task this session. + Harmony Reaction: same ally, different topics (ally keeps each granted edge once; no cap on number of topics).`  
- **Pattern:** **Menu / split output** — uniqueness through **different knowledge lines**, not bigger numbers.  
- **Today:** Action — ally gains your **tier-1 knowledge skill for one task** this session.  
- **+ Harmony:** Other Scholars **Harmony Reaction** teaching the **same ally** **different** tasks → ally keeps **each** edge once (clarifies intent; no numeric stack).  
- **Example:** Scholar A teaches lore check, Scholar B teaches language — ally can use both once each.

---

#### Detective

**Keen Eye** (tier 1)  
- **Desc (target):** `Action: Examine scene; GM reveals one clue tier. + Harmony Reaction: same scene (+1 clue tier per Detective).`  
- **Pattern:** **Investigation depth** — count Detectives, +1 clue tier each.  
- **Today:** Action — examine scene; GM reveals **one clue tier** (obvious / hidden / secret).  
- **+ Harmony:** Each Detective **Harmony Reaction** on the **same scene** → **one extra clue tier** (count Detectives).  
- **Example (2 Detectives):** Two tiers revealed (GM permitting).

---

#### Archaeologist

**Lost Technique** (tier 3, passive)  
- **Desc (target):** `Passive: Once per adventure, recognise weakness vs undead/construct; party +2 damage for one fight. + Harmony: +1 party damage per additional Archaeologist on same enemy type same fight (no Reaction).`  
- **Pattern:** **Per-helper flat** — **+2 base**, **+1 per additional Archaeologist**.  
- **Today:** Once per adventure, recognise weakness in undead/construct → **+2 damage for party for one fight**.  
- **+ Harmony:** Each **additional** Archaeologist IDing the **same enemy type** same fight adds **+1 party damage**.  
- **Example (3 Archaeologists vs liches):** Party **+4 damage** this fight (+2 + two additional +1s).

---

#### No same-career harmony planned *(cross-career only for now)*

| Career | Why | Future hook |
|--------|-----|-------------|
| **Beast Handler** | Companion-focused — buffs the pet, not duplicate handlers | Pack Tactics *(NEW)* — two handlers same companion type |
| **Enchanter** | Harmony when enchant UI exists (co-enchant one item) | Co-enchant pattern in cross-career table |
| **Farmer** | Supply chain / camp buffs — pair with Chef/Medic cross-career | Communal Harvest *(NEW)* if same-career farms same rest |
| **Duelist** | Solo fantasy | **Tag Team** *(NEW)* with Thief if needed — Feint already cross-links Ranger |

---

#### Weapon tree *(not a career)*

**Phalanx Formation** (Polearm · tier 3, passive)  
- **Desc (target):** `Passive: +1 Physical Defence and +1 Magical Defence per polearm ally within 10ft. + Harmony: No Reaction — when polearm allies within 10ft all attack the same target that round, +1 accuracy per polearm in that volley on that attack.`  
- **Pattern:** **Aura-per-source** + count polearms for accuracy on coordinated volley.  
- **Today:** **+1 Physical Defence and +1 Magical Defence** for **each polearm ally within 10ft**.  
- **+ Harmony:** Defensive stack unchanged. When **polearm allies** within 10ft **all attack the same target** that round, each gains **+1 accuracy per polearm** in that volley (count polearms, add +1 each — passive, no Reaction).  
- **Example (5 polearms in 10ft, same target):** Each gets **+5 Physical Defence, +5 Magical Defence** from aura, and **+5 accuracy** on that volley.

---

### B. Cross career — base skill vs cross add-on

Format: **Target — Today** = skill being buffed. **When [trigger]** = another career’s action. **+ Cross add-on** = extra effect while/as long as trigger applies.

---

**Chef · Banquet Planner / Battle Breakfast**  
- **Today:** Feast **+1 Accuracy ~20 rounds** *or* breakfast **+2 init / +1 Physical Defence** (solo, one eater, first combat).  
- **When Musician · any sustained song is active**  
- **+ Cross add-on:** Meal/feast buff duration **+2 rounds per sustaining Musician** (no cap).

**Soldier · Rally Cry / Shield Wall**  
- **Today:** Rally **30ft reroll**; Shield Wall **adjacent +1 Physical Defence**.  
- **When Musician · sustained song in range**  
- **+ Cross add-on:** Effective range **+10ft** for those Soldier actions.

**Paladin · Aura of Protection** / **Medic · Plague Ward**  
- **Today:** **10ft** aura (+1 Magical Defence vs fear/charm *or* disease/poison).  
- **When Musician · harmony song playing**  
- **+ Cross add-on:** Aura radius **10ft → 15ft** while music lasts.

**Marksman · Volley Support** (passive) / **Ranged · Covering Fire**  
- **Today:** Volley Support — allies **+1 accuracy** vs target you damaged this round. Covering Fire — ally **+2 accuracy** vs suppressed foe until your next turn.  
- **When Ranger · Volley Call** on same target same round *(harmony spread marks extra allies)*  
- **+ Cross add-on:** Covering Fire and Volley Support apply to **each ally** currently marked by that Volley Call harmony (not only the primary mark).

**Thief · Dirty Trick** / **Duelist · Feint**  
- **Today:** Dirty Trick — ally **+2 next attack**; Feint — your next attack **roll twice, keep higher** (once/combat).  
- **When Ranger · Volley Call** on that target this round  
- **+ Cross add-on:** Using Trick/Feint vs called target **does not consume once-per-combat** that round; if Volley Call harmony marked multiple allies, Feint may be used once per marked ally.

**Any martial · attack vs marked foe**  
- **Today:** Normal weapon/spell damage on hit.  
- **When Thief · Dirty Trick** *and/or* **Ranger · Volley Call** on same foe this round  
- **+ Cross add-on:** **+1 damage on hit per setup career** that targeted that foe this round.

**Soldier · Phalanx** / **Marksman · Called Shot**  
- **Today:** Phalanx — 3+ allies same target → **+1 accuracy**; Called Shot — **−2 to hit**, **+1d6** on hit. *(Harmony redesign: + Harmony table in Soldier section.)*  
- **When Blacksmith · Field Fit** tuned that ally pre-fight  
- **+ Cross add-on:** A **Field Fit**–tuned ally **counts as one extra Phalanx Soldier** when counting focus fire (e.g. one Phalanx Soldier + tuned ally attacking same foe → **+2 accuracy** and **+2d4** when 2+ Phalanx-equivalent qualify); Called Shot penalty **−2 → −1**.

**Any ally · forged weapon** *(Blacksmith · Tempered Steel)*  
- **Today:** Allies using smith’s forged gear **+1 physical attack roll**.  
- **When Engineer · Overcharge** on that weapon same fight  
- **+ Cross add-on:** **+1 additional attack roll** (total +2 from gear line).

**Soldier · Shield Wall**  
- **Today:** Adjacent ally **+1 Physical Defence** until your next turn (solo); **+3 Physical Defence** if three Soldiers stack linearly without harmony.  
- **When Engineer · Reinforced Frame** — ally is behind that cover **and** adjacent to Soldier  
- **+ Cross add-on:** Ally gets **+1 extra Physical Defence** (on top of Shield Wall total, including cooperative harmony).

**Alchemist · thrown vial** *(e.g. Acid Vials)*  
- **Today:** On hit, flask damage/effect; Volatile Expert reduces ally friendly-fire hurt.  
- **When Engineer · Overcharge** on thrower’s device *or* shared party trigger (once/combat)  
- **+ Cross add-on:** **One** ally’s throw this round **doubles effect** without spending Overcharge rebuild.

**Any ally · tier-1+ spell** *(after Mage · Empower Ally)*  
- **Today:** Empowered spell **+1d4 / +2 heal** (once per ally per combat).  
- **When Musician · sustained song**  
- **+ Cross add-on:** Caster **refunds 1 Stamina** on that cast.

**Musician · sustained performance** *(target of Mage · Shared Focus)*  
- **Today:** *(Musician — see Work Song.)*  
- **When Mage · Shared Focus** *(once/combat, sustain ally concentration without action)*  
- **+ Cross add-on:** Musician’s performance maintenance **counts as** the sustained effect for Shared Focus (free sustain proc).

**Paladin · Lay on Hands**  
- **Today:** Touch ally — **1d6+1 HP** (once per ally per day).  
- **When Cleric · Lay Blessing** on same ally same day  
- **+ Cross add-on:** Heal restores **+1 HP**.

**Paladin · Lay on Hands** / **potions** *(with Medic)*  
- **Today:** Lay on Hands **1d6+1**; Clean Bandage **stabilise + 1 HP**; Surgical Touch — items on others **+1d4 HP**.  
- **When Medic · Clean Bandage** then heal **same ally same round**  
- **+ Cross add-on:** **+1d4 HP once** on that combined care.

**Detective · Keen Eye** / **Archaeologist · Careful Extraction**  
- **Today:** Keen Eye — **one clue tier** (+session +2 at 2 Detectives); Careful Extraction — remove relic safely (GM).  
- **When Scholar · Teach** on same ally for this task  
- **+ Cross add-on:** Taught ally **+2** on that investigation; if Teach covered a **different** topic than Keen Eye, ally gets **both** edges (menu pattern).

**Thief · Filch** / social contested rolls  
- **Today:** Filch — steal small item (GM contested, once/encounter).  
- **When Detective · Keen Eye** just revealed a clue this session  
- **+ Cross add-on:** One party member **+2** on one contested roll tied to that clue.

**Any · Stamina recovery** *(with Chef · Hearty Rations)*  
- **Today:** Hearty Rations — after eating, **+2 Stamina for 10 rounds**.  
- **When eater started combat with rations active**  
- **+ Cross add-on:** **+1 extra Stamina** on first recovery tick (one time).

**Chef · Camp Cook** / **Medic · potions** *(with Farmer)*  
- **Today:** Camp Cook meals **1d4+1 HP**; Farmer **+1 HP from natural food** (passive).  
- **When Farmer · Hands in the Soil** supplies ingredients that rest  
- **+ Cross add-on:** Meals/potions brewed that rest **+1 HP**.

**Ranger · Ambush Spotter** *(via Beast Handler)*  
- **Today:** Party **+1 initiative** with 1 minute scout ahead.  
- **When Beast Handler · Animal Kin** on overland travel  
- **+ Cross add-on:** Scout bonus **+1 → +2**.

**Enemies in 10ft** *(future Musician debuff song + Berserker · Intimidate)*  
- **Today:** Intimidate — save or **−1 accuracy 1 round**.  
- **When Musician · dissonant/debuff song** in same area  
- **+ Cross add-on:** Enemies **−1 save vs fear** effects that round.

**Blacksmith · forged item + Enchanter** *(when enchant UI exists)*  
- **Today:** Forge gear; Enchanter applies minor enchant.  
- **When two careers work same item**  
- **+ Cross add-on:** Co-enchant **+1 stat** on that slot vs solo enchant.

---

### C. Implementation note

**Local play aid — not online.** LumenForge runs on each player’s device with **no shared session**. Multi-character harmonies are **table rules**: skill `desc` strings document the math; **players and the GM** coordinate joins, count helpers, and apply totals. The app should **not** require cross-sheet state, harmony windows between characters, or a “Join Harmony” sync flow.

**What the app may do (optional, per character):**

- Show full **`+ Harmony Reaction:`** / **`+ Harmony:`** text on skills (done via `generate-careers.mjs`).
- Apply **solo** parts only — e.g. one character uses Shield Wall and picks an ally for **+1 Physical Defence**; one Musician tracks **“Performing: Work Song (2/3)”** on their own sheet.
- **Passive / aura** bonuses that depend only on **this character’s** state (equipped gear, learned passives) — same as today.

**What stays at the table:** counting joiners across the party, skipped turns for Harmony Reactions, huddle stacking totals, cross-career add-ons, and “who is in hearing range.”

**Data sync (`/update-all`):** Player-facing harmony text lives in **`scripts/generate-careers.mjs`** (careers) and **`data/skills-data.js`** (weapon trees). Run `node scripts/generate-careers.mjs` then `node scripts/build-data.mjs` to refresh `data/json/skills.json` and `effects.json`. **`ROADMAP.md` `Desc (target)`** lines should match before regenerating.

Musician + Soldier are reference careers for harmony wording; Chef/Mage/Ranger second wave.

---

*Last updated from design review — June 2026.*
