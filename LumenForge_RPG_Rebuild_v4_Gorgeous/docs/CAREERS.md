# Careers (Jobs) — Skill Tree Template

A **career** is what your character *does for a living* — not only what they can craft. Each career has **one tier‑1 entry skill** (take this to “have the job”) and **six upgrades** (three tier‑2, three tier‑3) that mix **practical crafting** with **adventure abilities**.

**Not implemented in the app yet.** This is a design template for replacing the old crafting-only profession trees.

---

## Shared rules

| Rule | Notes |
|------|--------|
| **Entry** | Exactly **1 tier‑1** skill per career (5 Lumens). Unlocks basic recipes *or* a core non-combat ability. |
| **Growth** | **3 tier‑2** (10 Lumens) + **3 tier‑3** (15 Lumens). Player picks order within tier; prereqs are “has entry” or “any other tier‑2 in this career.” |
| **Skill types** | `Passive:` always-on job perk · `Craft:` unlock recipes · `Action:` out-of-combat or combat assist (stamina cost TBD) · no career skill on the action bar unless it’s a real `Action:` |
| **Combat** | When a skill helps in a fight, use **d20 + accuracy vs PD/MD** only for direct attacks; buffs/detections are usually no attack roll. |
| **Crafting** | Recipes live in data (`requiredSkills`); career skills only **unlock** them. |
| **Multicareer** | Allowed, but each tier‑1 costs Lumens — dabbling is fine, mastery is expensive. |

**Tier layout per career:** `1 → (3×2) → (3×3)` = **7 skills total**.

---

## 1. Blacksmith

*Forge and maintain arms and armour; keep the party equipped in the field.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Apprentice Smith** | `Craft:` Basic weapons and armour. |
| **2** | **Weaponwright** | `Craft:` Martial weapons. Weapons you forge gain +1 damage. |
| **2** | **Armourer** | `Craft:` Armour and shields. Armour you forge grants +1 Physical Defence and +1 Magical Defence. |
| **2** | **Field Fit** | `Action:` Tune an ally’s weapon or armour before a fight (10 minutes). They gain +1 on their first attack roll or +1 Physical Defence for the first round (choose one). Once per ally per long rest. |
| **3** | **Master Alloy** | `Craft:` Advanced metals (mithril, adamantine recipes). |
| **3** | **Tempered Steel** | `Passive:` Allies using your forged gear gain +1 to physical attack rolls (weapon damage unchanged). |
| **3** | **Siege Breaker** | `Action:` Bypass mundane locks, hinges, or chains with tools (GM: one object per use). |

---

## 2. Chef

*Feed the party; meals are buffs, not just flavour.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Camp Cook** | `Craft:` Simple meals. Meal restores 1d4+1 HP when eaten. |
| **2** | **Hearty Rations** | `Craft:` Travel food. After eating, +2 Stamina for 10 rounds. |
| **2** | **Spice Box** | `Passive:` Meals you cook gain +1 HP restored or +1 round of meal buff duration. |
| **2** | **Second Serving** | `Action:` Prepare one extra portion from the same ingredients (once per long rest). |
| **3** | **Banquet Planner** | `Craft:` Feast for the whole party — one shared buff (e.g. +1 Accuracy for 20 rounds). |
| **3** | **Battle Breakfast** | `Craft:` Pre-combat meal; eater gains +2 to initiative or +1 Physical Defence for first combat only. |
| **3** | **Chef’s Instinct** | `Passive:` Detect spoiled, drugged, or poisonous food by taste/smell (GM may require no roll). |

---

## 3. Farmer

*Grow, gather, and know the land — bridge between herbalism and survival.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Hands in the Soil** | `Craft:` Common herbs and rations from farm goods. `Passive:` +1 HP from natural food. |
| **2** | **Crop Rotation** | `Craft:` Reliable herb yields when resting in wilderness or farmland (GM: extra herb loot). |
| **2** | **Animal Sense** | `Passive:` Notice disturbed earth, tracks, and grazing signs within 30ft. |
| **2** | **Preserve Harvest** | `Craft:` Salves and preserved goods that don’t spoil for a week. |
| **3** | **Green Thumb** | `Craft:` Magical or rare plants (ties to herbalism recipes). |
| **3** | **Landmark Memory** | `Action:` Recall terrain — advantage on navigation checks in regions you’ve worked (GM). |
| **3** | **Bountiful Plot** | `Passive:` Party gains +1 material find when looting plants/organics after a fight. |

---

## 4. Medic

*Potions plus diagnosis and better healing — combat support without being a full cleric.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Field Medic** | `Craft:` Health potions. Potions you brew restore +2 HP. |
| **2** | **Triage** | `Action:` Assess a creature — learn HP band, bleeding, poison, disease (not exact HP unless GM allows). |
| **2** | **Antidote Training** | `Passive:` +2 effective MD vs poison/disease effects on yourself; identify poison on sight. |
| **2** | **Clean Bandage** | `Action:` Stabilise a downed ally (0 HP) so they don’t worsen; restore 1 HP. |
| **3** | **Surgical Touch** | `Craft:` Advanced potions and antidotes. Healing items you use on others gain +1d4 HP. |
| **3** | **Plague Ward** | `Passive:` Allies within 10ft gain +1 Magical Defence vs disease/poison saves (GM). |
| **3** | **Revival Draft** | `Craft:` Rare stimulant — remove Incapacitated or one minor debuff (once per target per day). |

---

## 5. Alchemist

*Bombs, acids, and oddities — overlaps Medic on potions but focused on substances and reactions.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Apothecary** | `Craft:` Basic potions and reagents. |
| **2** | **Acid Vials** | `Craft:` Acid flasks (throw: attack roll d20 + accuracy vs PD; on hit, 1d6 acid; 40% chance to apply Weakened). |
| **2** | **Smoke & Flash** | `Craft:` Distraction devices (smoke, blinding powder) — no damage, utility. |
| **2** | **Label Reader** | `Passive:` Identify unknown liquids/powders safely (poison, potion, inert). |
| **3** | **Explosive Compounds** | `Craft:` Bombs (3d6 in 15ft; separate attack roll per target vs MD). Unlocks combat `explosive_shot` prereq if kept. |
| **3** | **Transmute Salts** | `Craft:` Convert common materials into alchemical bases (GM: daily quota). |
| **3** | **Volatile Expert** | `Passive:` You and allies take −1 damage from your own alchemical friendly fire (min 0). |

---

## 6. Enchanter

*Put magic on items — tied to enchant slots, not just +damage.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Rune Apprentice** | `Craft:` Apply one minor enchant (+1 stat or flavour effect). |
| **2** | **Elemental Ink** | `Craft:` Fire/Ice/Lightning +1d6 on weapon (as fusion-lite, not a toggle). |
| **2** | **Ward Scribe** | `Craft:` Protective charms (+1 PD or +1 MD for 8 hours). |
| **2** | **Identify Magic** | `Action:` Inspect a magic item — learn properties and curse risk. |
| **3** | **Soul Bind** | `Craft:` Bind item to owner (others suffer −2 using it). |
| **3** | **Artifact Shaping** | `Craft:` Items with 2 enchantment slots. |
| **3** | **Dispel Touch** | `Action:` Suppress one magical effect on an object or creature for 1 hour. |

---

## 7. Detective

*Scene work, interrogation, and following leads — no combat focus.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Keen Eye** | `Action:` Examine a scene — GM reveals one clue tier (obvious / hidden / secret). |
| **2** | **Trace Evidence** | `Passive:` Spot disturbed objects, footprints, blood, recent magic residue. |
| **2** | **Interview** | `Action:` Conversation grants +2 to read lies or pressure answers (GM social roll). |
| **2** | **Case Notes** | `Passive:` Once per scene, reroll a failed investigation check. |
| **3** | **Reconstruct** | `Action:` Visualise past events in a location (last 24 hours, GM narrative). |
| **3** | **Follow the Trail** | `Action:` Determine direction a specific person/creature went within last 8 hours. |
| **3** | **Deduction** | `Passive:` Connect two prior clues — GM must give a useful inference if both are known. |

---

## 8. Archaeologist

*Relics, history, and dangerous knowledge.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Artifact Study** | `Action:` Identify relics — true properties, era, curse flags. |
| **2** | **Ancient Tongues** | `Passive:` Read common dead languages; translate inscriptions slowly. |
| **2** | **Trap Sense** | `Passive:` +2 to notice ancient traps and structural weak points. |
| **2** | **Careful Extraction** | `Action:` Remove relic without triggering trap (GM check). |
| **3** | **Lost Technique** | `Passive:` Once per adventure, recognise a weakness in an undead/construct type (+2 damage for party for one fight). |
| **3** | **Divine Dig** | `Action:` Sense consecrated/desecrated ground and major burials within 60ft. |
| **3** | **Replicate Relic** | `Craft:` Reproduce a studied artifact’s *mundane* copy (not full magic without Enchanter). |

---

## 9. Scout

*Tracks, ambushes, and reading the wild — ranger-adjacent job.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Trail Reader** | `Passive:` Follow tracks in wilderness; know number and rough size of group. |
| **2** | **Ambush Spotter** | `Passive:` Party gains +1 initiative when you have 1 minute to scout ahead. |
| **2** | **Snare Craft** | `Craft:` Simple traps (snare, alarm) — GM sets DC/effect. |
| **2** | **Weather Nose** | `Passive:` Predict weather 12 hours ahead in region you know. |
| **3** | **Long Watch** | `Action:` Track a quarry for a day — learn camp sites and direction. |
| **3** | **Camouflage Net** | `Craft:` Hide camp from casual search (+2 Stealth for camp). |
| **3** | **Eagle’s Route** | `Passive:` Party ignores difficult terrain from undergrowth on overland travel (GM). |

---

## 10. Engineer

*Mechanisms, siege tools, and improvised solutions.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Tinker** | `Craft:` Basic tools, crossbow bolts, simple mechanisms. |
| **2** | **Clockwork Repair** | `Action:` Fix a jammed lock or stuck mechanism (GM). |
| **2** | **Reinforced Frame** | `Craft:` Portable cover (+3 PD while behind it). |
| **2** | **Schematic Mind** | `Passive:` Understand how unfamiliar machines work after 1 minute study. |
| **3** | **Siege Kit** | `Craft:` Breaching tools, pulleys, collapsible bridge sections. |
| **3** | **Overcharge** | `Action:` Boost ally’s mechanical device — double effect once, then it is spent until rebuilt (GM). |
| **3** | **Demolition Plan** | `Craft:` Shaped charges — target structure weak point (not creature HP). |

---

## 11. Merchant

*Trade, appraisal, and social leverage — economy at the table.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Haggler** | `Passive:` Buy at 10% discount, sell at 10% premium (mundane goods). |
| **2** | **Appraise** | `Action:` True market value and obvious fakes on items. |
| **2** | **Ledger** | `Passive:` Track party expenses; never “lose” change to bookkeeping errors (flavour + GM trust). |
| **2** | **Find Buyer** | `Action:` Locate a purchaser for unusual loot in a settlement (GM). |
| **3** | **Black Market** | `Passive:` Access illegal or rare goods in cities (GM availability). |
| **3** | **Invest** | `Action:` Seed capital — chance of return after downtime (GM economy). |
| **3** | **Caravan Lead** | `Passive:` Overland travel: −20% random encounter chance when you plan the route (GM). |

---

## 12. Scholar

*Lore, languages, and knowing what the thing actually is.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Well Read** | `Action:` Recall lore on a topic — GM gives one true fact. |
| **2** | **Polyglot** | `Passive:` Speak/read two extra common languages. |
| **2** | **Bestiary Notes** | `Action:` Identify creature type — resistances, habits (not exact stat block unless GM). |
| **2** | **Map Archive** | `Passive:` Copy or remember maps; never lost in mapped dungeons without magic. |
| **3** | **Forbidden Index** | `Action:` Know danger level of magic/curse on touch (safe study). |
| **3** | **Teach** | `Action:` Ally gains your tier‑1 knowledge skill for one task this session. |
| **3** | **Sage’s Conclusion** | `Passive:` Once per adventure, declare a lore-based solution — GM must make it viable if plausible. |

---

## 13. Beast Handler

*Animals as allies, transport, and senses.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Animal Kin** | `Passive:` Calm non-magical beasts; read mood/intent. |
| **2** | **Train Mount** | `Craft:` Tack and training — mount obeys commands in combat (GM companion rules). |
| **2** | **Scent Partner** | `Action:` Animal alerts to poison, disease, or hidden creature within 30ft. |
| **2** | **Veterinary** | `Action:` Stabilise beast; heal 1d6 HP or remove minor condition. |
| **3** | **Falcon’s Eye** | `Action:` Send scout animal — report layout of area ahead (limited range). |
| **3** | **Pack Tactics** | `Passive:` When you and a beast attack same target, +1 accuracy for both. |
| **3** | **Call the Wild** | `Action:` Summon mundane animals for distraction or transport (once per day, GM). |

---

## 14. Cleric (Lay)

*Faith, wards, and support — not the full light magic tree.*

| Tier | Skill | Description |
|------|--------|-------------|
| **1** | **Lay Blessing** | `Action:` Touch ally — +1 Magical Defence for 8 hours (once per ally per day). |
| **2** | **Last Rites** | `Passive:` Prevent undead rise from bodies you sanctify. |
| **2** | **Comfort the Dying** | `Action:` Ally at 0 HP hears you — advantage on death saves (GM). |
| **2** | **Holy Symbol Craft** | `Craft:` Symbols that grant +1 vs fear/mind control while worn. |
| **3** | **Turn Unholy** | `Action:` Warded area 10ft — undead/demons hesitate to enter (GM save). |
| **3** | **Sanctuary Camp** | `Action:` Short rest in consecrated camp — remove one fear/charm. |
| **3** | **Faith’s Reservoir** | `Passive:` Once per day, double HP restored by a potion you administer. |

---

## Mapping old profession trees → careers

| Old tree | Suggested career | Notes |
|----------|------------------|--------|
| Smithing | **Blacksmith** | Keep weapon/armour craft; drop “divine artifacts” to Enchanter |
| Cooking | **Chef** | Meals = buffs |
| Herbalism | **Farmer** + **Medic** | Split grow vs heal |
| Alchemy | **Alchemist** + **Medic** | Bombs vs clinical |
| Enchanting | **Enchanter** | Wait for enchant UI |
| Archaeology | **Archaeologist** | Investigation + relics |

---

## Next steps (when you want code)

1. Pick **12–14 careers** from this list (or rename/merge).
2. Replace `SKILLS_DATA.professions` with `SKILLS_DATA.careers` (or keep key `professions` for save compatibility).
3. Tag recipes with `requiredSkills` using new IDs.
4. Unhide category only after **Career** panel shows entry + unlocks + recipes.

---

*14 careers · 7 skills each · 98 skill slots in template. Trim or merge before data entry.*

---

## What the app needs to support these careers

Career skills assume features the **current rebuild does not have**. Below: **cross-cutting systems** first (build once, many careers use them), then **per-career gaps**. “GM only” = workable at the table with narration; no new UI required.

### What exists today (baseline)

| Feature | Status |
|---------|--------|
| Learn / refund skills (Lumens) | Yes — Skills tab |
| Inventory (stacked entries, equip) | Yes — Shop / inventory |
| Item tooltips, compare vs equipped | Yes |
| Status effects (apply, duration, turns) | Yes — Effects panel |
| Basic Attack + action bar skills | Yes |
| GM initiative tracker | Yes — GM tab |
| Profession items in catalogue (`source: profession`) | Loaded, not craftable |
| `materials` + `requiredSkills` on recipes | In data, **not shown in UI** |
| Enchantment slots on items | Display only — **no enchant UI** (`ENCHANTMENTS_PLANNED`) |
| Crafting page / consume item | **No** |
| “Crafted by” on inventory rows | **No** |
| Death saves / 0 HP state | **No** (HP number only) |
| Rest tracking (short / long) | **No** |
| Investigation / clue journal | **No** |
| Companion / mount characters | **No** (familiar summon is ascension-tier elsewhere) |

---

### A. Cross-cutting systems (priority order)

**Design note:** This game deliberately has **no item durability or wear** — gear does not degrade over time. Blacksmith and Engineer skills focus on **crafting better items** and **field prep**, not maintaining condition meters.

These unlock the most careers with the least one-off code.

#### 1. Craft page (tab or panel)

**Needed for:** Every `Craft:` skill (all 14 careers).

| UI / logic | Detail |
|------------|--------|
| **Craft tab** | New tab or Shop sub-mode: “Craft” beside Buy / inventory. |
| **Recipe list** | Filter by career, tier, `requiredSkills ⊆ character.skills`. |
| **Recipe card** | Output item, materials from inventory (have / need), skill gate, Craft button. |
| **Craft action** | Validate → decrement materials → add item to inventory (see §2). |
| **GM craft** | Craft without materials (GM mode). |
| **Data** | Unify `profession-items`(rename to `Career-items`) `materials` + `requiredSkills`; tooltips use same shape as `formatCraftingRecipe`. |

#### 2. Crafted item metadata

**Needed for:** Blacksmith (+damage / +PD on *your* gear), Medic (+2 HP on *your* potions), Chef (meal buffs from *your* kitchen), Enchanter (bound owner), Tempered Steel (forged-by tag).

| Field (on inventory entry) | Purpose |
|----------------------------|---------|
| `craftedBy` (character id or name) | Who made it |
| `craftedWithSkills` (skill ids[]) | Which career bonuses apply |
| `craftBonuses` (optional stat overrides) | e.g. +1 damage, +1 PD — or derive from skills at craft time |
| `quality` / `makerTier` | Future scaling |

**UI:** Small pill on inventory row — “Crafted by Thief” / “Field Medic +2”.  
**Logic:** On use/equip, apply crafter perks if `craftedBy` matches active character or defined ally rules.

#### 3. Use consumable (Eat / Drink / Throw)

**Needed for:** Chef, Medic, Alchemist, Farmer (food), Cleric (indirect).

| Feature | Detail |
|---------|--------|
| **Use button** | On inventory row for `type: consumable` / meals / potions / bombs. |
| **HP / Stamina** | Roll or fixed heal; respect Medic “+2 on your potions” via `craftedBy`. |
| **Apply effect** | Meals → temporary effect (Accuracy +1, etc.) via existing effects system. |
| **Thrown alchemy** | Optional: log damage in toast + GM note; full combat integration later. |
| **Qty** | Decrement stack on use. |

#### 4. Food & meal buffs (timed effects)

**Needed for:** Chef (all tiers), Farmer (+1 HP natural food).

| Feature | Detail |
|---------|--------|
| **Meal effect template** | Data: `onConsume: { hp, stamina, effectId, durationRounds }`. |
| **Party feast** | One craft → apply buff to all characters in roster (or “active party” checklist). |
| **Battle Breakfast** | Buff flagged `firstCombatOnly` — needs combat session flag or manual clear. |
| **Spoilage / Chef’s Instinct** | Optional `spoiled` / `poisoned` flags on food items; Instinct shows warning in tooltip. |

#### 5. Enchantments (full loop)

**Needed for:** Enchanter (entire tree); Blacksmith Master Alloy less so.

| Feature | Detail |
|---------|--------|
| **Enchant definitions** | In `effects.json` or item modifiers list (fire +1d6, +1 PD, curse). |
| **Enchant UI** | On equipped or inventory gear: list slots, pick enchant, validate Enchanter skill. |
| **Apply / remove** | Write to inventory entry `enchantments: [{ id, ... }]`. |
| **Soul Bind** | `boundToCharacterId` — others get penalty when equipping. |
| **Identify Magic** | Reveal hidden enchants / curse before equip. |
| **Dispel Touch** | Strip one enchant or suppress for 1 hour. |

Already stubbed: `enchantmentSlots` on items, compare tooltips mention “planned”.

#### 6. Career Actions (non-combat skills)

**Needed for:** Detective, Archaeologist, Scholar, Scout, Merchant, Engineer, Beast Handler, Cleric — most `Action:` rows.

| Feature | Detail |
|---------|--------|
| **Careers panel** | List learned career skills with **Use** (not on combat action bar). |
| **Cooldown / uses** | e.g. “once per scene”, “once per long rest” — character flags or notes. |
| **Outcome log** | Toast + optional Notes append (“Keen Eye: found hidden blood”). |
| **GM mode** | Free use + editable result text. |

*Minimal v1:* Skills tab → career skill → “Mark used” + player/GM fills Notes.

#### 7. Investigation & lore journal

**Needed for:** Detective, Archaeologist, Scholar (partial).

| Feature | Detail |
|---------|--------|
| **Clues log** | Structured notes: clue text, tier (obvious/hidden/secret), linked scene. |
| **Known facts** | Scholar / Detective deductions — checklist GM can tick. |
| **Item study** | Button on item: “Identify” → reveal full tooltip / curse flag. |
| **Bestiary stub** | Creature name → player-visible blurb (resistances, habits). |

Could start as **enhanced Notes tab** with templates rather than new DB.

#### 8. Rest, downtime & economy

**Needed for:** Chef (Second Serving / long rest), Merchant (Invest), Farmer (Crop Rotation), Cleric (Sanctuary Camp).

| Feature | Detail |
|---------|--------|
| **Rest button** | Short rest / long rest — reset per-rest limits, optional stamina regen. |
| **Downtime ledger** | Merchant invest; Farmer extra loot — GM journal or simple “days passed”. |
| **Shop modifiers** | Merchant Haggler: `%` on buy/sell in shop math (`buyItem` / sell if added). |

#### 9. Death, stabilise & HP bands

**Needed for:** Medic (Triage, Clean Bandage), Cleric (Comfort the Dying).

| Feature | Detail |
|---------|--------|
| **HP band display** | Triage: “bloodied / critical” thresholds without exact HP optional. |
| **Dying state** | At 0 HP: flag `dying` + death save counter (or GM-only). |
| **Stabilise** | Clean Bandage: set 1 HP, clear dying. |
| **Faith’s Reservoir** | On potion Use, if medic administers → double heal once/day. |

#### 10. Companions & mounts

**Needed for:** Beast Handler (Train Mount, Falcon’s Eye, Call the Wild, Pack Tactics).

| Feature | Detail |
|---------|--------|
| **Companion slot** | Secondary mini-character or tagged NPC on roster. |
| **Mount flag** | Travel speed flavour; optional combat turn. |
| **Scout report** | Structured note from Falcon’s Eye. |

*Heavy lift* — early version: **GM Notes template** only.

#### 11. Environment & structures

**Needed for:** Engineer (Siege Kit, Demolition), Blacksmith (Siege Breaker), Scout (snares, camp).

| Feature | Detail |
|---------|--------|
| **Placed objects** | Optional GM list: snare, camp hidden, ward zone — not full map engine. |
| **Structure HP** | Doors/walls for breaching — GM tab only at first. |

#### 12. Party-wide & aura passives

**Needed for:** Medic Plague Ward, Blacksmith Tempered Steel, Chef Banquet, Cleric Turn Unholy.

| Feature | Detail |
|---------|--------|
| **Aura radius** | Mostly narrative; optional “active character within 10ft” party UI. |
| **Party buff apply** | Feast, Lost Technique — multi-select characters on roster. |

---

### B. Per-career checklist

| Career | Main gaps beyond §A |
|--------|---------------------|
| **Blacksmith** | §2 forge bonuses on craft, §6 Field Fit (career action), §11 siege/locks (GM or structure list), Tempered Steel needs `craftedBy` rule clarified |
| **Chef** | §3 §4 meals, §8 Second Serving per long rest, poison/spoil flags for Instinct |
| **Farmer** | §1 craft herbs/rations, §8 downtime loot hook, Bountiful Plot = loot table or GM +1 button |
| **Medic** | §2 potion craft bonus, §3 use potion, §9 triage/stabilise, §12 ward (effect or GM), Revival Draft = effect remove |
| **Alchemist** | §1 bombs/acids, §3 throw/use, Volatile Expert needs friendly-fire tagging on items |
| **Enchanter** | §5 full enchant loop, Identify Magic on unknown items, Dispel on character effects |
| **Detective** | §6 career actions, §7 clue journal, Case Notes = reroll token (manual or counter) |
| **Archaeologist** | §7 identify relic + curse, Trap Sense passive (GM), Replicate Relic = craft from studied item id |
| **Scout** | §1 snares/camouflage craft, §6 track actions, Ambush/initiative needs combat round hook or GM initiative note |
| **Engineer** | §1 tools/cover craft, §6 fix mechanisms, §11 structures, Overcharge = one-shot device flag |
| **Merchant** | Shop §8 price %, Appraise reveals true `price`/`value`, Find Buyer / Black Market = GM prompts |
| **Scholar** | §7 lore journal, Bestiary = creature db or freeform, Teach = temp skill grant (complex — GM easier) |
| **Beast Handler** | §10 companion, Veterinary on companion HP, Pack Tactics combat assist (accuracy buff when targeting same) |
| **Cleric (Lay)** | §6 blessing action → apply timed MD buff effect, Last Rites on corpse (GM), Sanctuary Camp on rest, holy symbol craft = wearable with effect |

---

### C. Suggested build phases (careers-friendly)

| Phase | Build | Careers unlocked (partially) |
|-------|--------|------------------------------|
| **C1** | Craft page + recipe tooltips + `craftedBy` metadata | Blacksmith, Farmer, Medic, Alchemist, Chef, Engineer, Enchanter (recipes only) |
| **C2** | Use consumable + meal/potion effects | Chef, Medic, Alchemist, Cleric |
| **C3** | Enchant UI + soul bind | Enchanter |
| **C4** | Career Actions panel + Notes/clue journal | Detective, Archaeologist, Scholar, Scout, Merchant, Blacksmith (Field Fit) |
| **C5** | Rest/dying/stabilise + shop haggle | Medic, Cleric, Chef, Merchant |
| **C6** | Companions + advanced environment | Beast Handler, Engineer, Scout |

Unhide the **Careers** skill category when **C1 + C2** are playable for at least one career end-to-end (e.g. **Medic** or **Chef** only).

---

### D. Skills to simplify if we *don’t* build the system

If a system is deferred, soften skill text to **GM adjudication** so trees stay honest:

| System deferred | Soften skill text to… |
|-----------------|------------------------|
| No craft page | “Craft: you know the recipe (see Craft catalogue when added).” |
| No craftedBy | “Potions you brew” → all potions if you have Field Medic |
| No enchant UI | Enchanter tier-1 = “GM applies +1 stat enchant” |
| No companions | Beast Handler = roleplay + GM notes only |

---

### E. New UI elements (summary)

| Element | Where |
|---------|--------|
| **Craft** tab or Shop mode | Main nav |
| **Craft** button on recipe row | Craft page |
| **Use** / **Eat** / **Throw** on consumables | Inventory row |
| **Identify** / **Enchant** on gear | Inventory / equip context |
| **Career skill Use** | Careers panel or Skills → career filter |
| **Stabilise** / **Bless** | GM tab or character header |
| **Clue / lore entry** | Notes tab template |
| **Rest (short/long)** | Stats or GM tab |
| **Crafted-by** pill | Inventory + tooltips |
| **Party buff** (feast) | Craft success modal → pick allies |

This list is the minimum to make career skills **feel implemented** rather than lore-only — chiefly the Craft page, crafted markers, consumable use, and enchantments.

