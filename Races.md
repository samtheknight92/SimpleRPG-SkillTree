# Fantasy Races & Racial Skills

## Overview
Each race provides unique passive abilities and access to exclusive racial skill trees. Racial skills follow the same tier system (1-5) and cost structure as other skills, but can only be learned by characters of that specific race.

**Design Philosophy:**
- Racial skills enhance playstyle diversity without creating power imbalances
- Each race has 3-5 unique skills that reflect their cultural/biological heritage
- Skills promote different tactical approaches and roleplay opportunities
- Compatible with multiplayer TTRPG shared lumen system

---

## 🧝 **ELVES** - *Masters of Magic and Nature*

### **Racial Passive Traits:**
- **Keen Senses**: +2 to perception and awareness checks
- **Magical Affinity**: +1 Magic Power when using staves
- **Longevity**: Immune to aging effects and diseases

### **Racial Skills:**
```javascript
elven: [
    // Tier 1
    { id: 'elven_accuracy', name: 'Elven Accuracy', tier: 1, cost: 5, staminaCost: 0, 
      desc: 'Passive: +1 accuracy with ranged weapons and spells', 
      icon: '🎯', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2  
    { id: 'forest_step', name: 'Forest Step', tier: 2, cost: 10, staminaCost: 3,
      desc: 'Action: Move through natural terrain without movement penalty, +2 stealth in forests',
      icon: '🌲', prerequisites: { type: 'AND', skills: ['elven_accuracy'] } },
    
    // Tier 3
    { id: 'moonbeam', name: 'Moonbeam', tier: 3, cost: 15, staminaCost: 6,
      desc: 'Spell: Create beam of silver light (2d6 light damage + reveals invisible enemies)',
      icon: '🌙', prerequisites: { type: 'AND', skills: ['forest_step'] } },
    
    // Tier 4
    { id: 'elven_high_magic', name: 'Elven High Magic', tier: 4, cost: 20, staminaCost: 0,
      desc: 'Passive: All spells cost -1 stamina (minimum 1), immune to magical charm effects',
      icon: '✨', prerequisites: { type: 'AND', skills: ['moonbeam'] } },
    
    // Tier 5
    { id: 'starlight_mastery', name: 'Starlight Mastery', tier: 5, cost: 25, staminaCost: 12,
      desc: 'Ultimate: Summon starfall in 30ft radius (4d8 light damage, heals allies 2d6)',
      icon: '⭐', prerequisites: { type: 'AND', skills: ['elven_high_magic'] } }
]
```

---

## 🛡️ **DWARVES** - *Masters of Craft and Stone*

### **Racial Passive Traits:**
- **Stone Sense**: Detect secret doors, traps, and structural weaknesses
- **Dwarven Resilience**: +2 Physical Defence, poison resistance
- **Craftsman Heritage**: all Smithing Craftables require 1 less of each item (Minimum 1)

### **Racial Skills:**
```javascript
dwarven: [
    // Tier 1
    { id: 'dwarven_toughness', name: 'Dwarven Toughness', tier: 1, cost: 5, staminaCost: 0,
      desc: 'Passive: +5 max HP, resistance to knockdown effects',
      icon: '💪', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'forge_blessing', name: 'Forge Blessing', tier: 2, cost: 10, staminaCost: 0,
      desc: 'Passive: Crafted weapons/armor gain +1 enchantment slot and +1 to all stat bonuses',
      icon: '🔨', prerequisites: { type: 'AND', skills: ['dwarven_toughness'] } },
    
    // Tier 3
    { id: 'mountain_charge', name: 'Mountain Charge', tier: 3, cost: 15, staminaCost: 5,
      desc: 'Action: Charge 20ft ignoring difficult terrain (+3 damage, knockdown on hit)',
      icon: '🏔️', prerequisites: { type: 'AND', skills: ['forge_blessing'] } },
    
    // Tier 4
    { id: 'runic_weapon', name: 'Runic Weapon', tier: 4, cost: 20, staminaCost: 8,
      desc: 'Enhancement: Inscribe runes on weapon (+2d6 damage, bypasses resistances for 10 attacks)',
      icon: '🔤', prerequisites: { type: 'AND', skills: ['mountain_charge'] } },
    
    // Tier 5
    { id: 'ancestral_might', name: 'Ancestral Might', tier: 5, cost: 25, staminaCost: 10,
      desc: 'Toggle: Channel ancient dwarven spirits (+4 Strength, +3 AC, +5 crafting bonus)',
      icon: '👑', prerequisites: { type: 'AND', skills: ['runic_weapon'] } }
]
```

---

## 🦶 **HALFLINGS** - *Masters of Luck and Stealth*

### **Racial Passive Traits:**
- **Lucky**: Reroll natural 1s on any dice roll (once per Rest)
- **Small Size**: +2 stealth, can move through larger creatures' spaces
- **Brave Heart**: Resistance to fear and intimidation effects

### **Racial Skills:**
```javascript
halfling: [
    // Tier 1
    { id: 'lucky_dodge', name: 'Lucky Dodge', tier: 1, cost: 5, staminaCost: 3,
      desc: 'Reaction: Force an enemy's attack to reroll (once per attack)',
      icon: '🍀', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'sneaky_strike', name: 'Sneaky Strike', tier: 2, cost: 10, staminaCost: 4,
      desc: 'Action: Attack from stealth gains +3 attack roll',
      icon: '🤫', prerequisites: { type: 'AND', skills: ['lucky_dodge'] } },
    
    // Tier 3
    { id: 'fortune_favor', name: "Fortune's Favor", tier: 3, cost: 15, staminaCost: 6,
      desc: 'Action: Grant luck to ally (next 3 rolls are advantage) or curse enemy (disadvantage)',
      icon: '🎲', prerequisites: { type: 'AND', skills: ['sneaky_strike'] } },
    
    // Tier 4
    { id: 'miraculous_escape', name: 'Miraculous Escape', tier: 4, cost: 20, staminaCost: 8,
      desc: 'Reaction: When reduced to 0 HP, teleport to safety with 1 HP (once per day)',
      icon: '💨', prerequisites: { type: 'AND', skills: ['fortune_favor'] } },
    
    // Tier 5
    { id: 'legendary_luck', name: 'Legendary Luck', tier: 5, cost: 25, staminaCost: 0,
      desc: 'Passive: Reroll any failed save or critical failure, allies within 10ft gain the same effect',
      icon: '⭐', prerequisites: { type: 'AND', skills: ['miraculous_escape'] } }
]
```

---

## 👹 **ORCS** - *Masters of Fury and Might*

### **Racial Passive Traits:**
- **Savage Attacks**: Critical hits deal extra damage die
- **Relentless Endurance**: When reduced to 0 HP from full health, drop to 1 HP instead (once per day)
- **Powerful Build**: Count as one size larger for carrying capacity and grappling (Note - This one to change)

### **Racial Skills:**
```javascript
orcish: [
    // Tier 1
    { id: 'orcish_fury', name: 'Orcish Fury', tier: 1, cost: 5, staminaCost: 3,
      desc: 'Action: Next attack deals +1d6 damage and gains advantage',
      icon: '😡', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'intimidating_roar', name: 'Intimidating Roar', tier: 2, cost: 10, staminaCost: 4,
      desc: 'Action: 15ft cone, apply Mind Controlled (fear variant) for 2 turns',
      icon: '🦁', prerequisites: { type: 'AND', skills: ['orcish_fury'] } },
    
    // Tier 3
    { id: 'blood_frenzy', name: 'Blood Frenzy', tier: 3, cost: 15, staminaCost: 0,
      desc: 'Passive: When an enemy dies within 30ft, gain +2 damage for rest of combat (stackable up to +10 damage)',
      icon: '🩸', prerequisites: { type: 'AND', skills: ['intimidating_roar'] } },
    
    // Tier 4
    { id: 'unstoppable_charge', name: 'Unstoppable Charge', tier: 4, cost: 20, staminaCost: 8,
      desc: 'Action: Charge through multiple enemies (each takes 2d6)',
      icon: '🐂', prerequisites: { type: 'AND', skills: ['blood_frenzy'] } },
    
    // Tier 5
    { id: 'warchief_presence', name: 'Warchief Presence', tier: 5, cost: 25, staminaCost: 10,
      desc: 'Aura: Allies within 20ft gain +2 damage and immunity to fear effects',
      icon: '👑', prerequisites: { type: 'AND', skills: ['unstoppable_charge'] } }
]
```

---

## 👤 **HUMANS** - *Masters of Adaptability and Determination*

### **Racial Passive Traits:**
- **Versatile**: All Weapon beginner skills unlocked upon creation.
- **Ambitious**: Earn money 10% faster from all sources
- **Adaptable**: Can learn basic tier-1 skills from any race (but not higher tiers)

### **Racial Skills:**
```javascript
human: [
    // Tier 1
    { id: 'human_determination', name: 'Human Determination', tier: 1, cost: 5, staminaCost: 0,
      desc: 'Passive: +1 to all saving throws, resistance to Incapacitated',
      icon: '💪', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'quick_learner', name: 'Quick Learner', tier: 2, cost: 10, staminaCost: 0,
      desc: 'Passive: Gain (2 x per Ally, including self) extra lumens when Defeating an Enemy',
      icon: '📚', prerequisites: { type: 'AND', skills: ['human_determination'] } },
    
    // Tier 3
    { id: 'heroic_surge', name: 'Heroic Surge', tier: 3, cost: 15, staminaCost: 8,
      desc: 'Action: Take an extra action this turn (once per combat encounter)',
      icon: '⚡', prerequisites: { type: 'AND', skills: ['quick_learner'] } },
    
    // Tier 4
    { id: 'inspiring_leadership', name: 'Inspiring Leadership', tier: 4, cost: 20, staminaCost: 6,
      desc: 'Action: Grant all allies within 30ft advantage on their next attack or save',
      icon: '🗣️', prerequisites: { type: 'AND', skills: ['heroic_surge'] } },
    
    // Tier 5
    { id: 'legendary_hero', name: 'Legendary Hero', tier: 5, cost: 25, staminaCost: 0,
      desc: 'Ultimate: Once per day, automatically succeed on any one roll or save',
      icon: '🏆', prerequisites: { type: 'AND', skills: ['inspiring_leadership'] } }
]
```

---

## 🐉 **DRAGONBORN** - *Masters of Elements and Honor*

### **Racial Passive Traits:**
- **Draconic Heritage**: Choose element at creation (Fire/Ice/Water/Wind/Lightning/Light/Dark)
- **Scaled Hide**: +1 Natural AC, resistance to chosen element (See elemental Resistance/weaknesses)
- **Draconic Senses**: Detect magic and see in darkness

### **Racial Skills:**
```javascript
dragonborn: [
    // Tier 1
    { id: 'breath_weapon', name: 'Draconic Breath', tier: 1, cost: 5, staminaCost: 10,
      desc: 'Action: 15ft cone of chosen element (2d6 + low chance of status effect based on element)',
      icon: '🔥', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'draconic_presence', name: 'Draconic Presence', tier: 2, cost: 10, staminaCost: 4,
      desc: 'Action: Project intimidating aura (enemies within 10ft must save vs fear)', (note: needs a limit/maintainence cost, current "Intimidating Aura" has 30ft range)
      icon: '👁️', prerequisites: { type: 'AND', skills: ['breath_weapon'] } },
    
    // Tier 3
    { id: 'elemental_mastery', name: 'Elemental Mastery', tier: 3, cost: 15, staminaCost: 0,
      desc: 'Passive: All attacks deal +1d4 elemental damage of chosen element, immunity to said element',
      icon: '⚡', prerequisites: { type: 'AND', skills: ['draconic_presence'] } },
    
    // Tier 4
    { id: 'dragon_wings', name: 'Dragon Wings', tier: 4, cost: 20, staminaCost: 5,
      desc: 'Toggle: Manifest wings for flight (60ft speed, lasts 10 minutes)',
      icon: '🦅', prerequisites: { type: 'AND', skills: ['elemental_mastery'] } },
    
    // Tier 5
    { id: 'ancient_fury', name: 'Ancient Fury', tier: 5, cost: 25, staminaCost: 15,
      desc: 'Ultimate: Channel ancient dragon (30ft breath, 4d8 damage, + high chance of status effect based on element)',
      icon: '🐲', prerequisites: { type: 'AND', skills: ['dragon_wings'] } }
]
```

---

## 😈 **TIEFLINGS** - *Masters of Chaos and Contracts*

### **Racial Passive Traits:**
- **Infernal Heritage**: Resistance to fire and charm (mind control) effects
- **Darkvision**: See perfectly in complete darkness up to 60ft
- **Fiendish Cunning**: +2 to deception and persuasion checks

### **Racial Skills:**
```javascript
tiefling: [
    // Tier 1
    { id: 'hellish_rebuke', name: 'Hellish Rebuke', tier: 1, cost: 5, staminaCost: 4,
      desc: 'Reaction: When damaged, attacker takes 1d6 fire damage',
      icon: '🔥', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'infernal_constitution', name: 'Infernal Constitution', tier: 2, cost: 10, staminaCost: 0,
      desc: 'Passive: Immunity to fire, resistance to Dark elemental damage, +2 max stamina',
      icon: '😈', prerequisites: { type: 'AND', skills: ['hellish_rebuke'] } },
    
    // Tier 3
    { id: 'devils_bargain', name: "Devil's Bargain", tier: 3, cost: 15, staminaCost: 8,
      desc: 'Action: Offer deal to enemy (they take -2 to all rolls but you take +1 damage from them)',
      icon: '📜', prerequisites: { type: 'AND', skills: ['infernal_constitution'] } },
    
    // Tier 4
    { id: 'summon_imp', name: 'Summon Imp', tier: 4, cost: 20, staminaCost: 10,
      desc: 'Action: Summon imp familiar (fights alongside you for 5 minutes)', (note: Part of the Drop-down list of pre-made monsters list, we will need "Imp" as a choice)
      icon: '👺', prerequisites: { type: 'AND', skills: ['devils_bargain'] } },
    
    // Tier 5
    { id: 'infernal_dominion', name: 'Infernal Dominion', tier: 5, cost: 25, staminaCost: 12,
      desc: 'Ultimate: Create 30ft radius hellish terrain for 5 turns (enemies take 1d8 fire damage when in terrain, allies gain Enhanced Effect while in terrain)',
      icon: '🔥', prerequisites: { type: 'AND', skills: ['summon_imp'] } }
]
```

---

## 🌙 **DARK ELVES (DROW)** - *Masters of Shadow and Poison*

### **Racial Passive Traits:**
- **Superior Darkvision**: See in complete darkness up to 120ft
- **Sunlight Sensitivity**: -1 to attacks in bright sunlight
- **Poison Mastery**: Immune to poison, can identify all toxins

### **Racial Skills:**
```javascript
drow: [
    // Tier 1
    { id: 'shadow_affinity', name: 'Shadow Affinity', tier: 1, cost: 5, staminaCost: 0,
      desc: 'Passive: +3 stealth in dim light or darkness, darkvision extends to 150ft',
      icon: '🌑', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'drow_poison', name: 'Drow Poison', tier: 2, cost: 10, staminaCost: 3,
      desc: 'Enhancement: Coat weapons with drow poison for entire combat encounter (medium chance of Daze (Incapacitated) effect + 1d4 poison damage)',
      icon: '☠️', prerequisites: { type: 'AND', skills: ['shadow_affinity'] } },
    
    // Tier 3
    { id: 'darkness_spell', name: 'Darkness', tier: 3, cost: 15, staminaCost: 8,
      desc: 'Spell: Create 20ft radius of magical darkness for 3 turns (only you can see inside)',
      icon: '⚫', prerequisites: { type: 'AND', skills: ['drow_poison'] } },
    
    // Tier 4
    { id: 'spider_climb', name: 'Spider Climb', tier: 4, cost: 20, staminaCost: 6,
      desc: 'Action: Walk on walls and ceilings for 10 minutes (normal movement speed)',
      icon: '🕷️', prerequisites: { type: 'AND', skills: ['darkness_spell'] } },
    
    // Tier 5
    { id: 'drow_matron', name: 'Drow Matron Magic', tier: 5, cost: 25, staminaCost: 15,
      desc: 'Ultimate: Summon 3 "shadows" to fight for you until the end of combat', (note: create shadow's as a selectable monster choice)
      icon: '👸', prerequisites: { type: 'AND', skills: ['spider_climb'] } }
]
```

---

## 🐺 **GNOLLS** - *Masters of Pack Hunting and Savagery*

### **Racial Passive Traits:**
- **Pack Tactics**: +1 attack when ally is adjacent to same target
- **Keen Smell**: Track creatures by scent, detect invisible enemies nearby
- **Savage Instincts**: Bonus damage against wounded enemies (below 50% HP)

### **Racial Skills:**
```javascript
gnoll: [
    // Tier 1
    { id: 'pack_coordination', name: 'Pack Coordination', tier: 1, cost: 5, staminaCost: 0,
      desc: 'Passive: When ally hits same target, your next attack gains +2 damage',
      icon: '🐺', prerequisites: { type: 'NONE', skills: [] } },
    
    // Tier 2
    { id: 'savage_bite', name: 'Savage Bite', tier: 2, cost: 10, staminaCost: 4,
      desc: 'Action: Bite attack (1d8 + Strength, applies Poison)',
      icon: '🦷', prerequisites: { type: 'AND', skills: ['pack_coordination'] } },
    
    // Tier 3
    { id: 'howl_of_the_pack', name: 'Howl of the Pack', tier: 3, cost: 15, staminaCost: 6,
      desc: 'Action: Rally allies within 30ft (+2 damage for 5 turns, immune to Mind Control)',
      icon: '🌙', prerequisites: { type: 'AND', skills: ['savage_bite'] } },
    
    // Tier 4
    { id: 'rampage', name: 'Rampage', tier: 4, cost: 20, staminaCost: 8,
      desc: 'Trigger: When you kill an enemy, immediately move and attack another',
      icon: '⚡', prerequisites: { type: 'AND', skills: ['howl_of_the_pack'] } },
    
    // Tier 5
    { id: 'alpha_dominance', name: 'Alpha Dominance', tier: 5, cost: 25, staminaCost: 12,
      desc: 'Ultimate: All allies gain Pack Coordination and Rampage for 10 turns',
      icon: '👑', prerequisites: { type: 'AND', skills: ['rampage'] } }
]
```

---

## 📊 **RACIAL BALANCE NOTES**

### **Design Principles:**
1. **Flavour Over Power**: Each race feels unique without being overpowered
2. **Multiplayer Friendly**: No race steals resources from other players
3. **Team Synergy**: Many racial abilities benefit the whole party
4. **Lumen Economy**: All racial skills use standard lumen costs
5. **Equipment Compatible**: Racial abilities work with existing weapon/magic systems

### **Gameplay Integration:**
- **Character Creation**: Choose race for passive traits + access to racial skills
- **Skill Trees**: Racial skills appear as separate trees in the UI
- **Prerequisites**: Racial skills only available to appropriate race
- **Multiclassing**: Humans can learn tier-1 skills from other races
- **Balance**: Each race has different power curves and strategic niches

### **TTRPG Considerations:**
- **Shared Lumens**: Players negotiate who gets racial upgrades first
- **Role Specialization**: Different races excel in different party roles
- **Equipment Trading**: Racial abilities enhance but don't replace equipment
- **Communication**: Many racial abilities require tactical coordination

---

*This system provides 9 distinct races with 45 unique racial skills, adding significant depth and replayability to character creation while maintaining balance in multiplayer TTRPG sessions.*
