# TODO List

## Current Tasks

### 🔍 Character Skills Audit & Enhancement
**✅ COMPLETED**: All character skills have been audited and enhanced with appropriate racial, monster, weapon, and elemental skills

#### Task Overview:
This task requires a comprehensive audit of all 166 characters in `premade-characters-data.js` to verify and enhance their skill configurations. Each character must have skills that logically match their race, elemental alignment, equipment, and thematic role.

#### ✅ COMPLETED SUB-TASKS:
- **Elemental Characters Enhanced**: Added appropriate elemental resistance skills to 25+ elemental characters (Fire Giant, Ice Golem, Earth Golem, Dragonborn variants, Water Golem, Light Angel, etc.)
- **Darkness Characters Enhanced**: Added darkness-themed skills to 10+ darkness characters (Shadow Dragon, Drow Necromancer, Cursed Knight, Assassin Rogue, Hell Knight, Devil Lord, etc.)
- **Elemental Attunement Stacking**: Confirmed and fixed system to allow multiple elemental attunements to stack on characters
- **Skill ID Mismatch Fixed**: Corrected `dark_attunement` vs `darkness_attunement` mismatch between `skills-data.js` and `monster-system.js`
- **Darkness Skills Contamination Fixed**: Removed incorrectly added darkness skills from inappropriate characters (Goblin Shaman, Mercenary, Duelist, etc.)
- **isEnemy Field Added**: Added `isEnemy: true` field to all 166 characters in `premade-characters-data.js`
- **Enemy Checkbox UI Added**: Added "Enemy (can drop Lumen when killed)" checkbox to character creation dialog in `itemadmin.html`
- **Checkbox CSS Styling**: Added custom CSS styling for the new Enemy checkbox to match game's golden theme
- **Human Racial Skills Complete**: Added `human_determination` to all 4 human characters (Mercenary, Assassin Rogue, Battle Mage, Bandit Raider)
- **Elf Racial Skills Complete**: Added `elven_accuracy` to all 9 elf characters (Elven Archer, Elven Scout, Pedestrian Elf, Elven Enchanter, Elven Heretic, Elven Politician, Elven Scout, Elven Archer, Elven Time Mage) - corrected from `elven_grace`
- **Dwarf Racial Skills Complete**: Added `dwarven_toughness` to all 4 dwarf characters (Dwarf Bounty Hunter, Pedestrian Dwarf, Dwarven Sergeant, Dwarven Zealot) - corrected from `dwarven_resilience`
- **Halfling Racial Skills Complete**: Added `lucky_dodge` to all 5 halfling characters (Halfling Thief, Pedestrian Halfling, Halfling Crime Boss, Halfling Smuggler, Halfling Thief) - corrected from `lucky`
- **Orc Racial Skills Complete**: Added `orcish_fury` to all 14 orc characters (Orc Brute, Orc Chief, Berserker, Orc Raider, Orc Scout, Orc Shaman, Orc Warlord, Orc Torturer, and duplicates) - corrected from `orc_rage`
- **Dragonborn Racial Skills Complete**: Added `breath_weapon` to all 11 dragonborn characters (Cursed Knight, Pedestrian Dragonborn-fire, Dragonborn Elementalist, Dragonborn Gladiator, Fallen Paladin, Pedestrian Dragonborn-darkness, Pedestrian Dragonborn-earth, and remaining variants) - corrected from `draconic_heritage` and `draconic_breath`
- **Tiefling Racial Skills Complete**: Added `hellish_rebuke` to all 6 tiefling characters (Tiefling Duelist, Pedestrian Tiefling, Tiefling Con Artist, Tiefling Gambler, Tiefling Pyromancer, and duplicate) - corrected from `infernal_heritage`
- **Drow Racial Skills Complete**: Added `shadow_affinity` to all 5 drow characters (Drow Necromancer, Pedestrian Drow, Drow Poisoner, Drow Warlock, and duplicate) - corrected from `dark_vision`
- **Gnoll Racial Skills Complete**: Added `pack_coordination` to all 3 gnoll characters (Gnoll Alchemist, Gnoll Beast Tamer, and duplicate) - corrected from `pack_hunter`
- **Monster Skills Assessment Complete**: Updated monster skills for 97 monster characters, replacing non-standard skills with appropriate standard monster skills from the system (defense, combat, magic, utility categories)
- **Lumen System Implementation Complete**: Updated the Lumen reward system to use `isEnemy` instead of `isMonster`, allowing all enemies (not just monsters) to drop Lumen when killed
- **Weapon Proficiency Matching Complete**: Verified and fixed weapon/skill mismatches for characters with equipped weapons, ensuring all characters have appropriate weapon proficiencies matching their equipment
- **Skill Tree Logic Validation Complete**: Fixed skill count mismatches for 9 characters, ensuring `totalSkillsUnlocked` accurately reflects the actual number of skills each character has
- **Enemy Toggle Button Complete**: Added enemy toggle button next to Item Admin button in character header, allowing players to easily switch characters between enemy/player status with confirmation dialog
- **Enemy Lumen Drop Display Fix**: Fixed Lumen drop display to show for all enemies (using `isEnemy`) instead of only monsters (using `isMonster`), ensuring enemy characters properly display their Lumen drop values
- **Critical Data Integrity Fix**: Fixed duplicate `isEnemy` fields in character data that were causing data corruption and potential game loading issues
- **Critical JavaScript Bug Fix**: Fixed variable hoisting issue in `skill-dynamic-bonuses.js` where `equipmentRequirement` was used before declaration, causing "Cannot access before initialization" errors when loading characters
- **Save as Preset System Complete**: Added comprehensive preset management system allowing users to create custom character groups, assign custom types, and filter by both presets and custom types for better character organization
- **Character Creation Bug Fix**: Fixed character creation error where code was trying to access non-existent enemy checkbox, causing "Cannot read properties of null" errors when creating new characters
- **Monster Presets Button Removal**: Removed redundant "Monster Presets" button from character interface since the new "Save as Preset" system provides superior functionality for creating custom character groups
- **Save as Preset System Bug Fixes**: Fixed critical issues with the Save as Preset and Assign Type functionality including duplicate function conflicts, broken modal button handlers, and missing showMessage function
- **Save Active Character as Pre-made**: Added functionality to save the currently active character as a new pre-made character that appears in the character selector list, allowing users to create and share custom characters
- **Custom Character Management System**: Replaced "Save as Preset" with proper custom character management, including edit/delete functionality for user-created pre-made characters
- **Assign Type Button Removal**: Removed "Assign Type" button from character selector interface to simplify the UI
- **Comprehensive Instructions System**: Added accessible Instructions button in Notes section with detailed guide covering all system features, character management, custom pre-made characters, Dev Mode, and troubleshooting
- **TTRPG-Focused Instructions Enhancement**: Completely rewrote System Instructions modal to include comprehensive TTRPG basics, dice mechanics, character stats explanations, enemy management, and gameplay guidance for new players unfamiliar with tabletop RPGs
- **System Instructions Accuracy Fix**: Corrected System Instructions to accurately reflect the actual character builder/simulator system, removing incorrect TTRPG content and adding proper explanations of Lumen economy, toggle skills, dynamic loot generation, and stat progression mechanics

#### 🎉 **MAJOR MILESTONE ACHIEVED**: 
**Character Skills Audit & Enhancement is now COMPLETE!** All 166 characters have been thoroughly reviewed and enhanced with appropriate skills. The system now includes:
- ✅ Complete racial skill sets for all races
- ✅ Proper monster abilities for all monster characters  
- ✅ Weapon proficiencies matching equipped weapons
- ✅ Accurate skill counts and logical prerequisites
- ✅ Full isEnemy system with UI toggle functionality
- ✅ Proper Lumen drop display for all enemies

#### Detailed Requirements:

##### 1. Elemental Character Analysis
**Target**: Characters with elemental names or themes (Fire Dragon, Ice Golem, Thunder Sprite, etc.)
**Required Actions**:
- Identify characters with elemental keywords in their names
- Verify they have corresponding elemental affinity skills in their `unlockedSkills.magic` section
- Add missing elemental skills (e.g., Fire Dragon should have `fire_affinity`, `fire_mastery`)
- Ensure elemental skills match their primary element (no Fire Dragon with only ice skills)

##### 2. Racial Skills Verification
**Target**: All characters based on their `race` field
**Required Actions**:
- Check each character's `race` field
- Verify they have appropriate racial skills in `unlockedSkills.racial.[race]` section
- Add missing racial skills (e.g., dragons should have dragon-specific skills)
- Ensure racial skills are populated and not empty arrays

##### 3. Monster Skills Assessment
**Target**: Characters with `"isMonster": true`
**Required Actions**:
- Verify monster characters have skills in `unlockedSkills.monster` sections
- Check for appropriate monster skills (combat, defense, magic, utility)
- Add missing monster-specific abilities
- Ensure monster skills match their creature type and level

##### 4. Weapon Proficiency Matching
**Target**: All characters with equipped weapons
**Required Actions**:
- Check `equipped.primaryWeapon` and `equipped.secondaryWeapon` fields
- Verify corresponding weapon skills exist in `unlockedSkills.weapons.[weapon_type]`
- Add missing weapon proficiencies (e.g., character with sword should have `sword_basics`)
- Ensure weapon skills are not empty arrays when weapons are equipped

##### 5. Skill Tree Logic Validation
**Target**: All characters
**Required Actions**:
- Verify skill prerequisites make logical sense
- Check that advanced skills have basic prerequisites
- Ensure skill counts match character level and theme
- Validate that `totalSkillsUnlocked` matches actual unlocked skills

#### Implementation Process:

##### Phase 1: Data Analysis
1. Read `premade-characters-data.js` file
2. Parse all character objects
3. Create analysis report identifying:
   - Characters missing elemental affinities
   - Characters with empty racial skills
   - Characters with weapon/equipment mismatches
   - Characters with illogical skill combinations

##### Phase 2: Elemental Characters (Priority 1)
1. Identify all elemental-themed characters by name patterns:
   - Fire: Fire Dragon, Fire Golem, Fire Sprite, etc.
   - Ice: Ice Golem, Ice Serpent, Ice Sprite, etc.
   - Thunder: Thunder Golem, Thunder Sprite, Storm Giant, etc.
   - Earth: Earth Golem, Stone Giant, etc.
   - Wind: Wind Golem, Wind Sprite, etc.
   - Water: Water Golem, Water Sprite, Sea Serpent, etc.
   - Darkness: Shadow Dragon, Shadow Knight, etc.
   - Light: Light Angel, Light Sprite, etc.
2. For each elemental character:
   - Add corresponding elemental affinity skill
   - Add elemental mastery skill if high-level
   - Add elemental resistance if appropriate

##### Phase 3: Racial Skills (Priority 2)
1. Group characters by race field
2. For each race group:
   - Identify standard racial skills for that race
   - Add missing racial skills to characters
   - Ensure racial skills are not empty arrays

##### Phase 4: Monster Skills (Priority 3)
1. Filter characters with `"isMonster": true`
2. For each monster:
   - Add appropriate monster combat skills
   - Add monster defense skills if high-level
   - Add monster utility skills if appropriate
   - Add monster magic skills if magical creature

##### Phase 5: Weapon Proficiency (Priority 4)
1. Check all equipped weapons
2. For each weapon-equipped character:
   - Add corresponding weapon skill if missing
   - Ensure weapon skills are not empty arrays

##### Phase 6: Validation & Testing
1. Verify all changes are syntactically correct
2. Check that no skill arrays are empty when they should have skills
3. Ensure `totalSkillsUnlocked` counts are accurate
4. Validate that character themes are properly supported by skills

#### Success Criteria:
- [x] All elemental characters have appropriate elemental affinity skills
- [x] All characters have non-empty racial skills matching their race
- [x] All monster characters have appropriate monster skills
- [x] All weapon-equipped characters have corresponding weapon skills
- [x] No character has empty skill arrays when they should have skills
- [x] All `totalSkillsUnlocked` counts are accurate
- [x] Character themes are properly supported by their skill sets

---

## 🚧 REMAINING PENDING TASKS

### 1. 🔍 Racial Skills Verification
**PRIORITY: HIGH** - **STATUS: ✅ COMPLETED**

#### Task Description:
Verify that all 166 characters have appropriate racial skills based on their `race` field. Many characters currently have empty racial skill arrays when they should have race-specific abilities.

#### Detailed Requirements:
- **Target**: All characters in `premade-characters-data.js`
- **Focus**: `unlockedSkills.racial.[race]` sections
- **Action**: Add missing racial skills for each race type

#### Race-Specific Skills to Add:
- **Human**: `human_adaptability`, `human_versatility`, `human_determination`
- **Elf**: `elf_agility`, `elf_nature_affinity`, `elf_archery_mastery`
- **Dwarf**: `dwarf_stone_sense`, `dwarf_axe_mastery`, `dwarf_resilience`
- **Dragonborn**: `dragonborn_breath_weapon`, `dragonborn_draconic_heritage`, `dragonborn_scales`
- **Tiefling**: `tiefling_infernal_heritage`, `tiefling_darkvision`, `tiefling_resistance`
- **Goblin**: `goblin_stealth`, `goblin_cunning`, `goblin_pack_tactics`
- **Orc**: `orc_brutal_strength`, `orc_aggressive`, `orc_intimidation`
- **Devil**: `devil_infernal_power`, `devil_teleportation`, `devil_immunity`
- **Dragon**: `dragon_flight`, `dragon_breath_weapon`, `dragon_immunity`
- **Shadow**: `shadow_stealth`, `shadow_teleportation`, `shadow_immunity`
- **Drow**: `drow_darkvision`, `drow_magic_resistance`, `drow_stealth`

#### Implementation Steps:
1. **Analyze Current State**: Use grep to find all characters with empty racial skill arrays
2. **Group by Race**: Identify all unique race values in the character data
3. **Add Racial Skills**: For each character, add appropriate racial skills based on their race
4. **Verify Completeness**: Ensure no character has empty racial skills when they should have them

#### Files to Modify:
- `premade-characters-data.js` - Add racial skills to character data

---

### 2. 🐉 Monster Skills Assessment
**PRIORITY: HIGH** - **STATUS: ✅ COMPLETED**

#### Task Description:
Review all characters with `"isMonster": true` to ensure they have appropriate monster-specific skills in their `unlockedSkills.monster` sections.

#### Detailed Requirements:
- **Target**: All characters with `"isMonster": true` (approximately 101 characters)
- **Focus**: `unlockedSkills.monster` sections
- **Action**: Add missing monster skills based on creature type and level

#### Monster Skills to Add by Type:
- **Dragons**: `dragon_flight`, `dragon_breath_weapon`, `dragon_immunity`, `dragon_fear_aura`
- **Goblins**: `goblin_stealth`, `goblin_cunning`, `goblin_pack_tactics`, `goblin_swarm_attack`
- **Devils**: `devil_infernal_power`, `devil_teleportation`, `devil_immunity`, `devil_fear_aura`
- **Elemental Creatures**: `elemental_immunity`, `elemental_absorption`, `elemental_aura`
- **Undead**: `undead_immunity`, `undead_fear_aura`, `undead_regeneration`
- **Beasts**: `beast_ferocity`, `beast_instincts`, `beast_pack_hunting`

#### Implementation Steps:
1. **Identify Monster Characters**: Find all characters with `"isMonster": true`
2. **Categorize by Type**: Group monsters by creature type (dragon, goblin, devil, etc.)
3. **Add Monster Skills**: Add appropriate monster skills based on type and level
4. **Verify Level Appropriateness**: Ensure high-level monsters have advanced monster skills

#### Files to Modify:
- `premade-characters-data.js` - Add monster skills to monster characters

---

### 3. ⚔️ Weapon Proficiency Matching
**PRIORITY: MEDIUM** - **STATUS: ✅ COMPLETED**

#### Task Description:
Verify that all characters with equipped weapons have corresponding weapon skills in their `unlockedSkills.weapons` sections.

#### Detailed Requirements:
- **Target**: All characters with `equipped.primaryWeapon` or `equipped.secondaryWeapon`
- **Focus**: `unlockedSkills.weapons.[weapon_type]` sections
- **Action**: Add missing weapon proficiencies

#### Weapon Skills to Add:
- **Sword**: `sword_basics`, `sword_techniques`, `sword_mastery`
- **Axe**: `axe_basics`, `axe_techniques`, `axe_mastery`
- **Staff**: `staff_basics`, `staff_techniques`, `staff_mastery`
- **Dagger**: `dagger_basics`, `dagger_techniques`, `dagger_mastery`
- **Polearm**: `polearm_basics`, `polearm_techniques`, `polearm_mastery`
- **Hammer**: `hammer_basics`, `hammer_techniques`, `hammer_mastery`
- **Bow**: `bow_basics`, `bow_techniques`, `bow_mastery`
- **Unarmed**: `unarmed_basics`, `unarmed_techniques`, `unarmed_mastery`

#### Implementation Steps:
1. **Find Equipped Weapons**: Identify all characters with equipped weapons
2. **Check Weapon Skills**: Verify they have corresponding weapon skills
3. **Add Missing Skills**: Add appropriate weapon proficiencies
4. **Verify Skill Levels**: Ensure skill levels match character level

#### Files to Modify:
- `premade-characters-data.js` - Add weapon skills to characters with equipped weapons

---

### 4. 🔢 Skill Tree Logic Validation
**PRIORITY: MEDIUM** - **STATUS: ✅ COMPLETED**

#### Task Description:
Validate that all characters have logical skill combinations and accurate `totalSkillsUnlocked` counts.

#### Detailed Requirements:
- **Target**: All 166 characters
- **Focus**: Skill prerequisites, skill counts, and `totalSkillsUnlocked` field
- **Action**: Fix illogical skill combinations and update skill counts

#### Validation Checks:
- **Prerequisites**: Advanced skills should have basic prerequisites
- **Skill Counts**: `totalSkillsUnlocked` should match actual unlocked skills
- **Logical Combinations**: Skills should make sense for character theme
- **No Empty Arrays**: Skill arrays shouldn't be empty when character should have skills

#### Implementation Steps:
1. **Count Actual Skills**: Calculate total skills for each character
2. **Compare with totalSkillsUnlocked**: Fix mismatches
3. **Check Prerequisites**: Ensure skill prerequisites are logical
4. **Validate Themes**: Ensure skills match character themes

#### Files to Modify:
- `premade-characters-data.js` - Fix skill counts and prerequisites

---

### 5. 🎮 Lumen System Implementation
**PRIORITY: HIGH** - **STATUS: ✅ COMPLETED**

#### Task Description:
Complete the implementation of the new Lumen reward system that applies to all enemies (not just monsters).

#### Detailed Requirements:
- **Target**: Game logic and UI text
- **Focus**: Lumen drop mechanics and UI labels
- **Action**: Update system to use `isEnemy` instead of `isMonster`

#### Implementation Tasks:

##### 5.1 Update UI Text
**PRIORITY: HIGH** - **STATUS: PENDING**
- **File**: `itemadmin.html` or relevant UI file
- **Action**: Change "Defeated Monster Drops" to "Drops when killed"
- **Location**: Find and replace the text in the UI

##### 5.2 Update Lumen Drop Logic
**PRIORITY: HIGH** - **STATUS: PENDING**
- **File**: `monster-system.js` or relevant game logic file
- **Action**: Update Lumen drop mechanics to use `isEnemy` instead of `isMonster`
- **Logic**: All characters with `isEnemy: true` should drop Lumen when defeated

##### 5.3 Update Character Creation Logic
**PRIORITY: MEDIUM** - **STATUS: PENDING**
- **File**: JavaScript file handling character creation
- **Action**: Update character creation to use checkbox value for `isEnemy` field
- **Logic**: New characters should have `isEnemy` set based on checkbox state

#### Implementation Steps:
1. **Find UI Text**: Locate "Defeated Monster Drops" text in UI files
2. **Update Text**: Change to "Drops when killed"
3. **Find Lumen Logic**: Locate Lumen drop mechanics in game files
4. **Update Logic**: Change from `isMonster` to `isEnemy` check
5. **Find Character Creation**: Locate character creation JavaScript
6. **Update Creation**: Use checkbox value for `isEnemy` field

#### Files to Modify:
- `itemadmin.html` - Update UI text
- `monster-system.js` - Update Lumen drop logic
- Character creation JavaScript file - Update creation logic

---

## 📋 TASK PRIORITY ORDER

### Phase 1: Critical Fixes (Do First)
1. ✅ **Racial Skills Verification** - COMPLETED: All racial skills added to characters
2. ✅ **Monster Skills Assessment** - COMPLETED: Monster skills updated for all monster characters
3. ✅ **Lumen System Implementation** - COMPLETED: isEnemy system fully implemented with UI toggle

### Phase 2: Important Enhancements (Do Second)
4. ✅ **Weapon Proficiency Matching** - COMPLETED: Weapon skills matched to equipped weapons
5. ✅ **Skill Tree Logic Validation** - COMPLETED: Skill counts and prerequisites validated

### Phase 3: Polish & Verification (Do Last)
6. ✅ **Final Validation** - COMPLETED: All changes tested and validated, critical data integrity issues fixed

#### Categories to Review:
- [x] **Common Monsters** (101 characters) - COMPLETED: Elemental variants and monster skills added
- [x] **Human Enemies** (46 characters) - COMPLETED: Class-appropriate skills and weapon proficiencies added
- [x] **Pedestrian NPCs** (16 characters) - COMPLETED: Racial skills and basic proficiencies added

#### Expected Outcomes:
- Enhanced character depth and thematic consistency
- Proper elemental affinities for elemental characters
- Complete racial skill sets for all races
- Appropriate monster abilities for creatures
- Weapon proficiencies matching equipment
- Logical and balanced skill distributions

---

## Completed Projects

### ✅ Character Migration Project
**COMPLETED**: Successfully migrated all 163 characters from "Potential Pre-made characters" folders to `premade-characters-data.js`
- **101 Common Monsters** added
- **46 Human Enemies** added  
- **16 Pedestrian NPCs** added
- **Total: 166 characters** in data file (3 bonus characters included)

### ✅ Lightning to Thunder Conversion
**COMPLETED**: All instances of "Lightning" converted to "Thunder" throughout the entire RPG Skill Tree System
- **297+ instances** updated across multiple files
- All functionality tested and working
- No broken references or missing items

---

## Notes for Future Improvements
*Consider these only with explicit consent:*
- Consider adding more utility items and quest items
- Consider adding item enchantment slots