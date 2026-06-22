# LumenForge RPG v5 — Nearly Complete · Fix Report

Applied data and code integrity fixes.

## Data fixes

- Renamed duplicate skill IDs while keeping display names intact:
  - `engineer_overcharge`
  - `bow_lightning_storm`
  - `wind_water_hurricane`
  - `water_earth_tidal_wave`
  - `darkness_light_eclipse`
  - `alchemist_explosive_compounds`
  - `archaeologist_artifact_study`
  - `lightning_water_storm_surge`
  - `monster_blood_frenzy`
- Repaired broken prerequisites by pointing them to existing equivalent skills:
  - `blade_mastery` → `sword_mastery`
  - `poison_crafting` → `poison_brewing`
  - `multishot` → `multi_shot`
  - `weapon_enchanting` → `basic_enchanting`
  - `weapon_mastery` → `sword_mastery`
  - `divine_light` → `holy_weapon`
  - `fire_mastery` → `fire_supremacy`
  - `magic_missile` → `spell_power`
  - `dawn_strike` → `dawn_dance`
- Renamed duplicate item IDs:
  - crafted alchemy version: `crafted_stamina_potion`
  - quest/discoverable version: `quest_phoenix_feather`
- Added missing crafting materials to the item catalogue:
  - `drake_scales`
  - `reinforcement_studs`
  - `reflective_scales`
  - `titan_bones`
  - `phase_essence`
  - `storm_organ`
  - `elemental_core`
  - `soul_essence`
  - `divine_essence`
  - `ghost_moss`
  - `flame_petals`
  - `cosmic_dust`
- Removed stale/ghost references from skill metadata.
- Fixed Battle Breakfast metadata so it points to the real `battle_breakfast` skill.
- Added icon sanitising to the build script so unrecoverable mojibake icons are blanked and the app uses fallback icons instead.

## Code fixes

- Added `getEffectiveSkillStaminaCost(character, skill)` as the shared stamina cost helper.
- Updated action bar stamina checks to use career stamina discounts.
- Updated skill usage stamina spending to use the same helper.
- Updated toggle upkeep stamina spending to use the same helper.
- Fixed `effectTone()` so lowercase `buff`/`debuff` effect types are styled correctly.

## New validation

Added `scripts/validate-data.mjs`.

It checks for:

- Duplicate skill IDs
- Duplicate item IDs
- Missing skill prerequisites
- Missing recipe material references
- Missing recipe skill references
- Missing skill-meta references
- Corrupt generated icon strings

## Checks run

- `node scripts/build-data.mjs`
- `node scripts/validate-data.mjs`
- `node --check` on all JS and MJS files

Current validation result:

`Data validation passed: 750 skills, 314 items/materials, no broken references.`
