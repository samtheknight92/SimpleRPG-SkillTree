# Monster Loot System Guide - Dynamic Design

## Overview

The dynamic monster loot system generates items based on the monster's level and skills. When a monster is defeated, it drops:
1. **Lumen Rewards** - Based on monster level and player count
2. **Loot Items** - Based on monster skills and level, with thematic matching

## How the Dynamic System Works

### 1. **Level Calculation**
Monster level is calculated based on total skills:
- **Formula**: 1 level per 3 skills (minimum level 1)
- **Example**: 6 skills = Level 2, 12 skills = Level 4

### 2. **Skill Analysis**
The system analyzes the monster's skills and matches them to item keywords:
- **Combat Skills** → Weapon-related items
- **Magic Skills** → Magical items and essences
- **Defense Skills** → Armor and defensive items
- **Utility Skills** → Specialized equipment

### 3. **Loot Tier Determination**
Loot tiers are based on monster level:

**Level 1-3 (Basic Monsters):**
- 3 Common items (25% chance each)
- 1 Uncommon item (15% chance)
- 1 Rare item (10% chance)

**Level 4-7 (Intermediate Monsters):**
- 2 Common items (25% chance each)
- 2 Uncommon items (15% chance each)
- 1 Rare item (10% chance)

**Level 8-10 (Advanced Monsters):**
- 3 Uncommon items (15% chance each)
- 2 Rare items (10% chance each)
- 1 Epic item (5% chance)

**Level 11+ (Elite Monsters):**
- 4 Uncommon items (15% chance each)
- 3 Rare items (10% chance each)
- 2 Epic items (5% chance each)

## Skill-Based Loot Matching

### Combat Skills
**Skills**: Claws, Bite Attack, Tail Swipe, Charge Attack, Rend, Pounce
**Keywords**: claw, sharp, blade, weapon, fang, tooth, bite, tail, sweep, charge, rush, tear, rip, leap, jump
**Example Items**: Sharp weapons, combat gear, battle equipment

### Fire Magic Skills
**Skills**: Fire Breath, Fire-based spells
**Keywords**: fire, flame, burn, heat, magic
**Example Items**: Fire essence, flame weapons, heat-resistant armor

### Ice Magic Skills
**Skills**: Ice Breath, Ice-based spells
**Keywords**: ice, frost, cold, freeze, magic
**Example Items**: Ice essence, frost weapons, cold-resistant gear

### Lightning Magic Skills
**Skills**: Lightning Breath, Lightning spells
**Keywords**: lightning, thunder, spark, electric, magic
**Example Items**: Lightning essence, electric weapons, conductive materials

### Poison/Acid Skills
**Skills**: Poison Breath, Acid Spit
**Keywords**: poison, venom, toxic, acid, corrosion, magic
**Example Items**: Poison essence, toxic weapons, acid-resistant gear

### Defense Skills
**Skills**: Tough Skin, Rock Skin, Metal Skin, Magical Resistance
**Keywords**: leather, hide, skin, armor, stone, rock, metal, steel, iron, magic, resistance, ward, defense
**Example Items**: Armor pieces, defensive equipment, protective gear

### Utility Skills
**Skills**: Flight, Burrow, Climb, Swim, Camouflage
**Keywords**: wing, flight, air, earth, ground, tunnel, climb, grip, water, swim, aquatic, stealth, hide, utility
**Example Items**: Specialized equipment, utility items, environmental gear

## Lootable Items

### What Items Can Drop

**All items that cannot be purchased in shops are automatically lootable:**
- Monster-specific materials and essences
- Special crafting components
- Unique items

**First 50% of each category (sorted by price/tier):**
- **Weapons**: First 50% of swords, bows, staves, axes, daggers, hammers, polearms
- **Armor**: First 50% of light, medium, and heavy armor
- **Consumables**: First 50% of all consumable items

### Rarity System

Items use the following rarity levels:
- **Common** - Basic items, high drop rates
- **Uncommon** - Enhanced items, moderate drop rates  
- **Rare** - Superior items, low drop rates
- **Epic** - Exceptional items, very low drop rates
- **Legendary** - Ultimate items, extremely rare

## Example Monster Loot Generation

### Example 1: Level 2 Monster with Natural Claws
**Skills**: Natural Claws
**Level**: 1 (1 skill ÷ 3 = 0.33, minimum level 1)
**Loot Tiers**: 3 Common, 1 Uncommon, 1 Rare
**Skill Keywords**: claw, sharp, blade, weapon
**Expected Loot**: 
- Common items with weapon-related names/descriptions
- Uncommon items matching combat themes
- Rare items that are weapon-focused

### Example 2: Level 5 Monster with Fire Magic
**Skills**: Fire Breath, Fire Spark, Fireball
**Level**: 1 (3 skills ÷ 3 = 1)
**Loot Tiers**: 2 Common, 2 Uncommon, 1 Rare
**Skill Keywords**: fire, flame, burn, heat, magic
**Expected Loot**:
- Common items with fire-related themes
- Uncommon items like Fire Essence, flame weapons
- Rare items that are fire-magical in nature

### Example 3: Level 10 Monster with Sword Skills and Metal Skin
**Skills**: Sword Basics, Quick Strike, Metal Skin, Tough Skin
**Level**: 1 (4 skills ÷ 3 = 1.33, minimum level 1)
**Loot Tiers**: 3 Uncommon, 2 Rare, 1 Epic
**Skill Keywords**: weapon, blade, metal, steel, iron, armor, defense
**Expected Loot**:
- Uncommon items: Steel weapons, metal armor
- Rare items: Enhanced weapons, defensive equipment
- Epic items: Master-crafted weapons or armor

## Loot Generation Process

### Step-by-Step Process

1. **Monster Analysis**: System calculates level and extracts skills
2. **Tier Determination**: Based on level, determines loot tiers and chances
3. **Item Pool Creation**: Gets all lootable items for each tier
4. **Skill Filtering**: Filters items based on monster skill keywords
5. **Keyword Scoring**: Items are scored based on keyword matches
6. **Top Selection**: Top 70% of items by score are selected
7. **Random Selection**: Items are randomly selected based on tier chances
8. **Loot Assembly**: Final loot list is compiled

### Keyword Matching Algorithm

```javascript
// Example of how items are scored
const itemText = "Steel Sword - A sharp blade made of steel"
const keywords = ["steel", "blade", "weapon"]
let score = 0

keywords.forEach(keyword => {
    if (itemText.toLowerCase().includes(keyword)) {
        score += 1
    }
})
// This item would score 3 (matches all keywords)
```

## Lumen Reward Calculation

### Base Formula
- **Base Reward**: Monster Level × 5
- **Player Count Scaling**:
  - 1 player: ×1.0 (base)
  - 2-3 players: ×1.5
  - 4-5 players: ×2.0
  - 6+ players: ×2.5

### Example Calculations
- **Level 2 monster, 1 player**: 2 × 5 × 1.0 = 10 lumens
- **Level 5 monster, 4 players**: 5 × 5 × 2.0 = 50 lumens
- **Level 10 monster, 6 players**: 10 × 5 × 2.5 = 125 lumens

## Strategic Considerations

### For Players
- **Skill Analysis**: Check monster skills to predict loot themes
- **Level Targeting**: Higher-level monsters have better loot tiers
- **Party Scaling**: Larger parties get significantly better lumen rewards
- **Thematic Farming**: Target monsters with skills matching desired loot

### For Game Masters
- **Skill Customization**: Modify monster skills to control loot themes
- **Level Balancing**: Adjust skill count to control loot tier access
- **Thematic Consistency**: Skills should match desired loot themes
- **Progression Control**: Use level-based tier restrictions

## System Benefits

### Dynamic Nature
- **No Static Tables**: Every monster generates unique loot based on its build
- **Infinite Variety**: Different skill combinations create different loot pools
- **Thematic Consistency**: Loot always matches monster abilities
- **Scalable**: Works with any number of monsters or skills

### Predictable Patterns
- **Level-Based Tiers**: Clear progression from common to epic loot
- **Skill-Based Themes**: Consistent loot themes based on monster abilities
- **Percentage-Based**: Transparent drop rates for each tier
- **Keyword Matching**: Logical connection between skills and loot

## Technical Implementation

### Key Functions
- `generateDynamicLoot(monster)` - Main loot generation function
- `calculateMonsterLevel(monster)` - Determines monster level
- `getAllMonsterSkills(monster)` - Extracts skills from monster
- `filterItemsBySkills(items, skills)` - Matches items to skills
- `getLootTiersByLevel(level)` - Determines available tiers

### Integration Points
- **Monster System**: Integrates with existing monster presets
- **Item System**: Uses existing item database and rarity system
- **UI System**: Can display loot analysis and predictions
- **Character Manager**: Works with monster character objects

## Notes

- **Independent Rolls**: Each item rolls independently - multiple items can drop
- **No Guarantees**: Even with high chances, items may not drop due to RNG
- **Skill Impact**: More skills = higher level = better loot tiers
- **Keyword Matching**: Items are scored based on name and description text
- **Top 70% Rule**: Only the best-matching items are considered for drops
- **No Duplicates**: Each item can only drop once per monster
- **Shop Integration**: Items that can't be bought in shops are always lootable
- **Tier Progression**: First 50% of each item category are available as loot
