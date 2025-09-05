// ===========================================
// -----------------------------------------------------------------------------
// Status Effect Application Chance Rule (ALL Skills)
// -----------------------------------------------------------------------------
// If any skill "may apply" a status effect, the chance is based on the skill's tier:
//   - Tier 2: 20% chance
//   - Tier 3: 40% chance
//   - Tier 4: 75% chance
//   - Tier 5: 95% chance
// All status effect chances must be written as:
//   "Has a X% chance to apply [Status Effect] ([reference to status-effects.js])"
// Do not invent new status effects or durations; always reference status-effects.js.
// This rule applies to ALL skills, not just fusion skills.
// -----------------------------------------------------------------------------
// SKILL SYSTEM DATA
// ===========================================
// 
// TERMINOLOGY DEFINITIONS:
// - "Magic Power": Character stat that increases magical spell effectiveness (like Strength for physical)
// - "Magical Damage": The actual damage output of magical spells (calculated from Magic Power + spell base)  
// - "Damage": Generic term referring to all attack damage (physical or magical)
// - Physical Damage uses Strength stat, Magical Damage uses Magic Power stat
//
// BALANCE NOTES:
// - Toggle skills have stamina costs and mutual exclusivity
// - Immunity skills have doubled costs to reflect their power
// - Weapon-based skills require appropriate equipment
// ===========================================

// Skills Data - 25+ skills per category with proper tier structure
const SKILLS_DATA = {
  weapons: {
    // SWORD SKILLS (Tier 1-5)
    sword: [
      // Tier 0
      { id: 'sword_beginner', name: 'Sword Beginner', tier: 0, cost: 3, staminaCost: 0, desc: 'Passive: You can now equip a sword', icon: '⚔️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'sword_basics', name: 'Sword Basics', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: +1 accuracy with swords, learn basic combat maneuvers', icon: '⚔️', prerequisites: { type: 'AND', skills: ['sword_beginner'] } },
      { id: 'sword_stance', name: 'Sword Stance', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: Proper fighting stance: +1 Physical Defence while wielding a sword', icon: '🛡️', prerequisites: { type: 'AND', skills: ['sword_beginner'] } },

      // Tier 2
      { id: 'quick_strike', name: 'Quick Strike', tier: 2, cost: 10, staminaCost: 2, desc: 'Active: Fast sword attack with +2 accuracy', icon: '⚡', prerequisites: { type: 'AND', skills: ['sword_basics'] } },
      { id: 'parry', name: 'Parry', tier: 2, cost: 10, staminaCost: 1, desc: 'Reaction: Block incoming melee attack, negate Physical Damage on successful roll (16 or higher)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['sword_basics', 'sword_stance'] } },
      { id: 'lunge_attack', name: 'Lunge Attack', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Extended range attack (+5ft range), +1 Physical Damage on hit', icon: '🎯', prerequisites: { type: 'AND', skills: ['sword_basics'] } },

      // Tier 3
      { id: 'riposte', name: 'Riposte', tier: 3, cost: 15, staminaCost: 2, desc: 'Reaction: After successful parry, basic counter-attack with +2 Physical Damage', icon: '⚔️', prerequisites: { type: 'AND', skills: ['parry', 'quick_strike'] } },
      { id: 'sweeping_slash', name: 'Sweeping Slash', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Wide arc attack hits up to 3 adjacent enemies', icon: '🌪️', prerequisites: { type: 'AND', skills: ['quick_strike'] } },
      { id: 'blade_dance', name: 'Blade Dance', tier: 3, cost: 15, staminaCost: 5, desc: 'Active: Fluid combo of 3 attacks, each at -1 accuracy but +1 Physical Damage (first; -1 accuracy +1 Physical Damage - second; -2 accuracy +2 Physical Damage - third; -3 accuracy +3 Physical Damage)', icon: '💃', prerequisites: { type: 'AND', skills: ['lunge_attack', 'quick_strike'] } },
      { id: 'defensive_stance', name: 'Defensive Stance', tier: 3, cost: 15, staminaCost: 1, desc: 'Toggle: +2 Physical Defence but they lose -2 to accuracy against you. Costs 1 stamina per turn, lasts max 10 turns', icon: '🛡️', prerequisites: { type: 'AND', skills: ['parry'] } },

      // Tier 4
      { id: 'master_parry', name: 'Master Parry', tier: 4, cost: 20, staminaCost: 3, upgrade: 'parry', desc: 'Reaction: Reflect melee attacks back at attacker for full Physical Damage, Must have defence_stance active', icon: '✨', prerequisites: { type: 'AND', skills: ['riposte', 'defensive_stance'] } },
      { id: 'whirlwind', name: 'Whirlwind Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Spinning attack hits all enemies within 10ft radius (-2 accuracy, friendly fire possible)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['sweeping_slash', 'blade_dance'] } },
      { id: 'piercing_thrust', name: 'Piercing Thrust', tier: 4, cost: 20, staminaCost: 4, desc: 'Active: Ignores armor completely (minimum roll of 10 on d20), Rolls of 17-20 are considered Critical Hits', icon: '🎯', prerequisites: { type: 'AND', skills: ['lunge_attack'] } },

      // Tier 5
      { id: 'sword_mastery', name: 'Sword Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +3 Physical Damage with all Melee attacks while Sword is equipped and All Sword related skills, critical hits restore 5 stamina', icon: '👑', prerequisites: { type: 'OR', skills: ['master_parry', 'whirlwind', 'piercing_thrust'] } }
    ],

    // RANGED SKILLS (Tier 1-5) - Bows, Crossbows, and Ranged Weapons
    bow: [
      // Tier 0
      { id: 'bow_beginner', name: 'Bow Beginner', tier: 0, cost: 3, staminaCost: 0, desc: 'Passive: You can now equip a bow', icon: '🏹', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'ranged_basics', name: 'Ranged Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 Physical Damage with Bow weapons, learn proper form and operation', icon: '🏹', prerequisites: { type: 'AND', skills: ['bow_beginner'] } },
      { id: 'steady_aim', name: 'Steady Aim', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +2 accuracy when you didn\'t move this turn, requires full action to maintain', icon: '🎯', prerequisites: { type: 'AND', skills: ['bow_beginner'] } },

      // Tier 2
      { id: 'quick_draw', name: 'Quick Draw', tier: 2, cost: 10, staminaCost: 2, desc: 'Active: gain steady_aim\'s bonus even if you moved this turn', icon: '⚡', prerequisites: { type: 'AND', skills: ['ranged_basics'] } },
      { id: 'aimed_shot', name: 'Aimed Shot', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Take extra time to aim (full action), +4 accuracy and +3 Physical Damage on next ranged attack, requires steady_aim active', icon: '🎯', prerequisites: { type: 'AND', skills: ['steady_aim'] } },
      { id: 'power_shot', name: 'Power Shot', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Full power shot for +4 Physical Damage but -2 accuracy, cannot be used with quick_draw', icon: '💪', prerequisites: { type: 'AND', skills: ['ranged_basics'] } },
      { id: 'long_range', name: 'Long Range', tier: 2, cost: 10, staminaCost: 0, desc: 'Passive: Increase effective range by 50%, no accuracy penalty at maximum range, applies to all bow attacks. NOTE: give all ranged weapons a Maximum range. - weak bow > 60ft, Strong bow > 150ft', icon: '🔭', prerequisites: { type: 'AND', skills: ['steady_aim'] } },

      // Tier 3
      { id: 'multi_shot', name: 'Multi Shot', tier: 3, cost: 15, staminaCost: 5, desc: 'Active: Fire 2 projectiles at same target or split between 2 targets, Roll for each at -1 accuracy', icon: '⬇️', prerequisites: { type: 'AND', skills: ['quick_draw'] } },
      { id: 'piercing_shot', name: 'Piercing Shot', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Projectile penetrates through enemies in straight line (50% of Max range of equipped bow), deals +2 Physical Damage to each target hit', icon: '➡️', prerequisites: { type: 'AND', skills: ['aimed_shot', 'power_shot'] } },
      { id: 'explosive_shot', name: 'Explosive Shot', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: Projectile explodes in 10ft radius dealing AoE Physical Damage (-1 accuracy, friendly fire possible)', icon: '💥', prerequisites: { type: 'AND', skills: ['power_shot', 'fire_spark'] } },
      { id: 'blinding_shot', name: 'Blinding Shot', tier: 3, cost: 15, staminaCost: 3, desc: 'Active: A shot that targets the enemies eyes. On hit, the enemy loses -5 Accuracy for 10 turns', icon: '👁️', prerequisites: { type: 'AND', skills: ['quick_draw'] } },
      { id: 'grappling_shot', name: 'Grappling Shot', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Pull self to target or pull target to you (45ft range), if successful in battle, Roll to punch/kick the enemy (d4+1 Physical Damage)', icon: '🪝', prerequisites: { type: 'AND', skills: ['quick_draw'] } },

      // Tier 4
      { id: 'barrage', name: 'Projectile Barrage', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Rain projectiles over 20ft radius area, hits all enemies inside (-3 accuracy, friendly fire possible)', icon: '🌧️', prerequisites: { type: 'AND', skills: ['multi_shot', 'explosive_shot'] } },
      { id: 'homing_shot', name: 'Homing Shot', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Magical projectile that automatically hits target ignores cover and concealment. Rolls of 18-20 are considered Critical Hits', icon: '🧭', prerequisites: { type: 'AND', skills: ['piercing_shot'] } },
      { id: 'rapid_fire', name: 'Rapid Fire', tier: 4, cost: 20, staminaCost: 5, desc: 'Active: Fire 4 projectiles in rapid succession', icon: '🔥', prerequisites: { type: 'AND', skills: ['blinding_shot', 'multi_shot'] } },
      { id: 'siege_shot', name: 'Siege Shot', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Massive projectile pierces through multiple enemies (To maximum range), Can not be reflected, deals double Physical Damage to enemies with rock_skin or metal_skin', icon: '🏹', prerequisites: { type: 'AND', skills: ['grappling_shot', 'explosive_shot'] } },

      // Tier 5
      { id: 'Bow_mastery', name: 'Bow Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +50% range, +3 Physical Damage with all Bow attacks, critical hits apply additional 2 Physical Damage dice', icon: '👑', prerequisites: { type: 'OR', skills: ['barrage', 'homing_shot', 'rapid_fire', 'siege_shot'] } }
    ],

    // AXE SKILLS (Tier 1-5)
    axe: [
      // Tier 0
      { id: 'axe_beginner', name: 'Axe Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip an axe', icon: '🪓', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'axe_basics', name: 'Axe Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 Physical Damage with axes, learn proper grip and swing techniques', icon: '🪓', prerequisites: { type: 'AND', skills: ['axe_beginner'] } },
      { id: 'heavy_swing', name: 'Heavy Swing', tier: 1, cost: 5, staminaCost: 3, desc: 'Active: Powerful overhead chop, +3 Physical Damage but -3 accuracy', icon: '⬇️', prerequisites: { type: 'AND', skills: ['axe_beginner'] } },

      // Tier 2
      { id: 'cleave', name: 'Cleave', tier: 2, cost: 10, staminaCost: 1, desc: 'Passive: When you kill an enemy, make basic attack on adjacent foe (costs 1 stamina, once per turn)', icon: '〰️', prerequisites: { type: 'AND', skills: ['axe_basics'] } },
      { id: 'armor_break', name: 'Armor Break', tier: 2, cost: 10, staminaCost: 5, desc: 'Active: Reduce target\'s Physical Defence by 2 for 10 turns (once per enemy), ignores armor completely', icon: '🔨', prerequisites: { type: 'AND', skills: ['heavy_swing'] } },
      { id: 'throwing_axe', name: 'Throwing Axe', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Ranged axe attack (30ft range), axe returns to hand at beginning of next turn', icon: '🎯', prerequisites: { type: 'AND', skills: ['axe_basics'] } },

      // Tier 3
      { id: 'berserker_rage', name: 'Berserker Rage', tier: 3, cost: 15, staminaCost: 5, desc: 'Toggle: +4 Strength and Physical Defence and additional basic attack. Costs 2 stamina per additional turn, lasts max 5 turns. Applies Incapacitated (cannot act 2 turns) after', icon: '😤', prerequisites: { type: 'AND', skills: ['cleave'] } },
      { id: 'crushing_blow', name: 'Crushing Blow', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: 50% chance to apply Incapacitated (cannot act 2 turns) +2 Physical Damage on hit', icon: '💥', prerequisites: { type: 'AND', skills: ['armor_break', 'heavy_swing'] } },
      { id: 'ricochet_axe', name: 'Ricochet Axe', tier: 3, cost: 25, staminaCost: 3, desc: 'Toggle: Thrown axes bounce to hit 1 additional target within 15ft of original target. Costs 3 stamina per turn while active.', icon: '🔄', prerequisites: { type: 'AND', skills: ['throwing_axe'] } },
      { id: 'wide_cleave', name: 'Wide Cleave', tier: 3, cost: 15, staminaCost: 7, desc: 'Active: Cleave attack hits all enemies in 15ft arc, each target takes -1 accuracy penalty', icon: '〰️', prerequisites: { type: 'AND', skills: ['cleave'] } },

      // Tier 4
      { id: 'earthquake_slam', name: 'Earthquake Slam', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Ground slam in 20ft radius, knockdown + Physical Damage to all (-2 accuracy, friendly fire possible), creates difficult terrain for 3 turns', icon: '🌍', prerequisites: { type: 'AND', skills: ['crushing_blow'] } },
      { id: 'whirling_axes', name: 'Whirling Axes', tier: 4, cost: 20, staminaCost: 11, desc: 'Active: Spin attack hits all enemies within 10ft, move while spinning (-2 accuracy, friendly fire possible), can move up to 20ft during attack', icon: '🌪️', prerequisites: { type: 'AND', skills: ['berserker_rage', 'wide_cleave'] } },
      { id: 'axe_storm', name: 'Axe Storm', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Throw up to 6 axes in all directions (360° coverage), each axe deals normal Physical Damage, requires axes in inventory', icon: '🌩️', prerequisites: { type: 'AND', skills: ['ricochet_axe'] } },

      // Tier 5
      { id: 'axe_mastery', name: 'Axe Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +3 Physical Damage with all axe attacks, all axe attacks have additional 25% Incapacitated (cannot act 2 turns) chance, critical hits restore 3 stamina', icon: '👑', prerequisites: { type: 'OR', skills: ['earthquake_slam', 'whirling_axes', 'axe_storm'] } }
    ],

    // STAFF SKILLS (Tier 1-5) - Spellcasting weapon
    staff: [
      // Tier 0
      { id: 'staff_beginner', name: 'Staff Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a staff', icon: '🪄', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'staff_basics', name: 'Staff Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 magic power with staves, learn to channel magical energy', icon: '🪄', prerequisites: { type: 'AND', skills: ['staff_beginner'] } },
      { id: 'mana_focus', name: 'Mana Focus', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Restore +1 stamina per turn when holding staff (requires staff equipped)', icon: '💙', prerequisites: { type: 'AND', skills: ['staff_beginner'] } },

      // Tier 2
      { id: 'spell_power', name: 'Spell Power', tier: 2, cost: 10, staminaCost: 0, desc: 'Passive: +2 magic power to all magical attacks when using staff', icon: '✨', prerequisites: { type: 'AND', skills: ['staff_basics'] } },
      { id: 'arcane_shield', name: 'Arcane Shield', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Apply Spell Warded (magic immunity + Magical Damage halved for 8 turns)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['mana_focus'] } },
      { id: 'staff_strike', name: 'Staff Strike', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Melee attack with staff (1d6 + magic power Magical Damage)', icon: '⚡', prerequisites: { type: 'AND', skills: ['staff_basics'] } },

      // Tier 3
      { id: 'spell_penetration', name: 'Spell Penetration', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Spells ignore 2 points of magical defense', icon: '🎯', prerequisites: { type: 'AND', skills: ['spell_power'] } },
      { id: 'mana_burn', name: 'Mana Burn', tier: 3, cost: 15, staminaCost: 5, desc: 'Active: Apply Weakened (all stats -2) and drain target stamina (1d4+2)', icon: '💔', prerequisites: { type: 'AND', skills: ['staff_strike', 'arcane_shield'] } },
      { id: 'elemental_staff', name: 'Elemental Staff', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Imbue staff with element (Fire/Ice/Lightning) for 10 turns', icon: '🔥', prerequisites: { type: 'AND', skills: ['spell_power'] } },
      { id: 'dispel_ward', name: 'Dispel Ward', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Remove all magical effects from target (ally or enemy)', icon: '🚫', prerequisites: { type: 'AND', skills: ['arcane_shield'] } },

      // Tier 4
      { id: 'arcane_mastery', name: 'Arcane Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: All spells cost -1 stamina (minimum 1)', icon: '🧙', prerequisites: { type: 'AND', skills: ['spell_penetration', 'mana_burn'] } },
      { id: 'staff_of_power', name: 'Staff of Power', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: 2 turn move. 1st turn charge staff. 2nd turn Unleash stored energy (5d10 Magical Damage, 60ft range)', icon: '💥', prerequisites: { type: 'AND', skills: ['elemental_staff'] } },
      { id: 'reality_tear', name: 'Reality Tear', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Create dimensional rift (Teleport anywhere within 100ft)', icon: '🌀', prerequisites: { type: 'AND', skills: ['dispel_ward'] } },

      // Tier 5
      { id: 'staff_mastery', name: 'Staff Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +4 magic power, can cast two spells per turn', icon: '👑', prerequisites: { type: 'OR', skills: ['arcane_mastery', 'staff_of_power', 'reality_tear'] } }
    ],

    // DAGGER SKILLS (Tier 1-5) - Speed and precision weapon
    dagger: [
      // Tier 0
      { id: 'dagger_beginner', name: 'Dagger Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a dagger', icon: '🗡️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'dagger_basics', name: 'Dagger Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 accuracy with daggers, learn swift strikes', icon: '🗡️', prerequisites: { type: 'AND', skills: ['dagger_beginner'] } },
      { id: 'light_step', name: 'Light Step', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 speed when wielding daggers, silent movement (requires dagger equipped)', icon: '👣', prerequisites: { type: 'AND', skills: ['dagger_beginner'] } },

      // Tier 2
      { id: 'dual_wield', name: 'Dual Wield', tier: 2, cost: 25, staminaCost: 0, desc: 'Passive: When you have a second weapon equipped, you gain +1 attack per turn. If your equipped weapons are not both daggers, you suffer -6 Accuracy on all attacks.', icon: '⚔️', prerequisites: { type: 'AND', skills: ['dagger_basics'] } },
      { id: 'sneak_attack', name: 'Sneak Attack', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: +3 Physical Damage when attacking from behind or hidden', icon: '👤', prerequisites: { type: 'AND', skills: ['light_step'] } },
      { id: 'poison_blade', name: 'Poison Blade', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Coat daggers with poison (escalating: 1→2→3 damage over 3 turns). Costs 2 stamina per turn while active.', icon: '☠️', prerequisites: { type: 'AND', skills: ['dagger_basics'] } },

      // Tier 3
      { id: 'flurry', name: 'Flurry', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Make 4 rapid attacks, each at -1 accuracy', icon: '🌪️', prerequisites: { type: 'AND', skills: ['dual_wield'] } },
      { id: 'shadowstep', name: 'Shadowstep', tier: 3, cost: 15, staminaCost: 5, desc: 'Active: Teleport behind target within 30ft, next attack is sneak attack', icon: '🌑', prerequisites: { type: 'AND', skills: ['sneak_attack'] } },
      { id: 'vital_strike', name: 'Vital Strike', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Target vital points (Rolls of 15-20 are considered Critical Hits). Has a 40% chance to apply Bleed status effect (status-effects.js lines 42-50)', icon: '💔', prerequisites: { type: 'AND', skills: ['poison_blade', 'sneak_attack'] } },
      { id: 'evasion', name: 'Evasion', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: +2 Physical Defence, can dodge area attacks with successful roll', icon: '💨', prerequisites: { type: 'AND', skills: ['light_step'] } },

      // Tier 4
      { id: 'thousand_cuts', name: 'Thousand Cuts', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Unleash 8 strikes in blur of motion (auto-hit)', icon: '⚡', prerequisites: { type: 'AND', skills: ['flurry', 'vital_strike'] } },
      { id: 'shadow_clone', name: 'Shadow Clone', tier: 4, cost: 20, staminaCost: 7, desc: 'Active: Create mirror image that fights alongside you (5 turns)', icon: '👥', prerequisites: { type: 'AND', skills: ['shadowstep', 'evasion'] } },
      { id: 'assassinate', name: 'Assassinate', tier: 4, cost: 20, staminaCost: 6, desc: 'Active: Instant kill on critical hit (works on most enemies)', icon: '💀', prerequisites: { type: 'AND', skills: ['vital_strike'] } },

      // Tier 5
      { id: 'dagger_mastery', name: 'Dagger Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +2 speed, +3 Physical Damage, all attacks have 25% critical chance', icon: '👑', prerequisites: { type: 'OR', skills: ['thousand_cuts', 'shadow_clone', 'assassinate'] } }
    ],

    // POLEARM SKILLS (Tier 1-5) - Reach and defensive weapon
    polearm: [
      // Tier 0
      { id: 'polearm_beginner', name: 'Polearm Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a polearm', icon: '🔱', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'polearm_basics', name: 'Polearm Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 accuracy with polearms, learn extended range combat', icon: '🔱', prerequisites: { type: 'AND', skills: ['polearm_beginner'] } },
      { id: 'reach_advantage', name: 'Range Advantage', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Attack enemies 10ft away, they cannot attack you in melee', icon: '📏', prerequisites: { type: 'AND', skills: ['polearm_beginner'] } },

      // Tier 2
      { id: 'thrust_attack', name: 'Thrust Attack', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Piercing attack (+2 Physical Damage, ignores 1 Physical Defence)', icon: '➡️', prerequisites: { type: 'AND', skills: ['polearm_basics'] } },
      { id: 'polearm_defensive_stance', name: 'Defensive Stance', tier: 2, cost: 10, staminaCost: 1, desc: 'Toggle: +2 Physical Defence but cannot move. Costs 1 stamina per turn, lasts max 10 turns', icon: '🛡️', prerequisites: { type: 'AND', skills: ['range_advantage'] } },
      { id: 'sweep_attack', name: 'Sweep Attack', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Wide arc hits up to 3 enemies in front of you', icon: '〰️', prerequisites: { type: 'AND', skills: ['polearm_basics'] } },

      // Tier 3
      { id: 'spear_wall', name: 'Spear Wall', tier: 3, cost: 15, staminaCost: 5, desc: 'Active: Block area (10ft wide), enemies take Physical Damage entering', icon: '🏗️', prerequisites: { type: 'AND', skills: ['thrust_attack', 'polearm_defensive_stance'] } },
      { id: 'polearm_charge_attack', name: 'Charge Attack', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Move + attack (+1 Physical Damage per 5ft moved, max +6)', icon: '🏃', prerequisites: { type: 'AND', skills: ['thrust_attack'] } },
      { id: 'trip_attack', name: 'Trip Attack', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Knock target off their feet, causing them to lose their next turn. All attacks against the tripped target gain advantage until their next turn.', icon: '🦵', prerequisites: { type: 'AND', skills: ['sweep_attack'] } },
      { id: 'phalanx_formation', name: 'Phalanx Formation', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: +1 Physical Defence for each ally with polearm within 10ft', icon: '👥', prerequisites: { type: 'AND', skills: ['defensive_stance'] } },

      // Tier 4
      { id: 'impale', name: 'Impale', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Pin target in place (3d6 Physical Damage, cannot move for 3 turns)', icon: '📌', prerequisites: { type: 'AND', skills: ['spear_wall', 'polearm_charge_attack'] } },
      { id: 'whirlwind_sweep', name: 'Whirlwind Sweep', tier: 4, cost: 20, staminaCost: 9, desc: 'Active: 360° attack hits all enemies within 15ft (-2 accuracy, friendly fire possible)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['trip_attack', 'phalanx_formation'] } },
      { id: 'fortress_stance', name: 'Fortress Stance', tier: 4, cost: 20, staminaCost: 3, desc: 'Toggle: +4 Physical Defence, reflect 50% Physical Damage back to attackers. Costs 3 stamina per turn, lasts max 5 turns', icon: '🏰', prerequisites: { type: 'AND', skills: ['phalanx_formation'] } },

      // Tier 5
      { id: 'polearm_mastery', name: 'Polearm Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +20ft range, +3 Physical Damage, opportunity attacks on anyone who moves', icon: '👑', prerequisites: { type: 'OR', skills: ['impale', 'whirlwind_sweep', 'fortress_stance'] } }
    ],

    // HAMMER SKILLS (Tier 1-5) - Heavy crushing weapon
    hammer: [
      // Tier 0
      { id: 'hammer_beginner', name: 'Hammer Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a hammer', icon: '🔨', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'hammer_basics', name: 'Hammer Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 accuracy with hammers, learn crushing techniques', icon: '🔨', prerequisites: { type: 'AND', skills: ['hammer_beginner'] } },
      { id: 'heavy_impact', name: 'Heavy Impact', tier: 1, cost: 5, staminaCost: 3, desc: 'Active: Slow but devastating blow (+4 Physical Damage, -2 accuracy)', icon: '💥', prerequisites: { type: 'AND', skills: ['hammer_beginner'] } },

      // Tier 2
      { id: 'armor_crusher', name: 'Armor Crusher', tier: 2, cost: 10, staminaCost: 4, desc: 'Passive: Hammer attacks ignore 2 points of armor', icon: '💔', prerequisites: { type: 'AND', skills: ['hammer_basics'] } },
      { id: 'stunning_blow', name: 'Stunning Blow', tier: 2, cost: 10, staminaCost: 5, desc: 'Active: 50% chance to apply Incapacitated (cannot act for 1 turn)', icon: '⭐', prerequisites: { type: 'AND', skills: ['heavy_impact'] } },
      { id: 'ground_slam', name: 'Ground Slam', tier: 2, cost: 10, staminaCost: 8, desc: 'Active: Strike ground, knockdown all enemies within 10ft (-1 accuracy, friendly fire possible)', icon: '🌍', prerequisites: { type: 'AND', skills: ['hammer_basics'] } },

      // Tier 3
      { id: 'thunderstrike', name: 'Thunderstrike', tier: 3, cost: 15, staminaCost: 7, desc: 'Active: Lightning-infused attack (2d6 Lightning Damage + normal Physical Damage)', icon: '⚡', prerequisites: { type: 'AND', skills: ['armor_crusher', 'stunning_blow'] } },
      { id: 'earth_shaker', name: 'Earth Shaker', tier: 3, cost: 15, staminaCost: 10, desc: 'Active: Create 20ft radius earthquake (difficult terrain + Physical Damage, -2 accuracy, friendly fire possible)', icon: '🌍', prerequisites: { type: 'AND', skills: ['ground_slam'] } },
      { id: 'berserker_swing', name: 'Berserker Swing', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Wild attack (+6 Physical Damage, -3 Physical Defence until next turn)', icon: '😤', prerequisites: { type: 'AND', skills: ['heavy_impact'] } },
      { id: 'shield_breaker', name: 'Shield Breaker', tier: 3, cost: 15, staminaCost: 5, desc: 'Active: Destroy shields and remove Protected status from enemies', icon: '🛡️', prerequisites: { type: 'AND', skills: ['armor_crusher'] } },

      // Tier 4
      { id: 'mjolnir_strike', name: 'Mjolnir Strike', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Hammer returns after thrown (60ft range, pierces through)', icon: '⚡', prerequisites: { type: 'AND', skills: ['thunderstrike', 'earth_shaker'] } },
      { id: 'apocalypse_slam', name: 'Apocalypse Slam', tier: 4, cost: 20, staminaCost: 15, desc: 'Active: Devastating area attack (40ft radius, 4d6 Physical Damage, -4 accuracy, friendly fire possible)', icon: '☄️', prerequisites: { type: 'AND', skills: ['berserker_swing', 'shield_breaker'] } },
      { id: 'fortress_buster', name: 'Fortress Buster', tier: 4, cost: 20, staminaCost: 9, desc: 'Active: Destroy any structure or barrier (breaks walls, doors)', icon: '🏗️', prerequisites: { type: 'AND', skills: ['shield_breaker'] } },

      // Tier 5
      { id: 'hammer_mastery', name: 'Hammer Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +4 Physical Damage, all attacks cause knockdown, immune to Incapacitated', icon: '👑', prerequisites: { type: 'OR', skills: ['mjolnir_strike', 'apocalypse_slam', 'fortress_buster'] } }
    ],

    // UNARMED SKILLS (Tier 1-5) - Martial arts and hand-to-hand combat
    unarmed: [
      // Tier 0
      { id: 'unarmed_beginner', name: 'Unarmed Beginner', tier: 0, cost: 0, staminaCost: 0, desc: 'Passive: All characters can do unarmed attacks of 1d4 Physical Damage', icon: '👊', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'basic_mix_martial_arts', name: 'Basic Mix Martial Arts', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: +2 Physical Damage to all unarmed attacks', icon: '🥊', prerequisites: { type: 'AND', skills: ['unarmed_beginner'] } },
      { id: 'basic_combo', name: 'Basic Combo - "The Ol\' 1 - 2"', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: Can do 2 basic attacks per turn when unarmed', icon: '👊', prerequisites: { type: 'AND', skills: ['unarmed_beginner'] } },
      { id: 'stance_training', name: 'Stance Training', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: +1 to accuracy with unarmed attacks', icon: '🧘', prerequisites: { type: 'AND', skills: ['unarmed_beginner'] } },

      // Tier 2
      { id: 'flurry_of_blows', name: 'Flurry of Blows', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Can make 3 Basic attacks per turn when unarmed (upgrade of Basic combo)', icon: '⚡', prerequisites: { type: 'AND', skills: ['basic_combo'] } },
      { id: 'hardened_fists', name: 'Hardened Fists', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Unarmed attacks roll 1d6 each', icon: '💪', prerequisites: { type: 'AND', skills: ['basic_mix_martial_arts'] } },
      { id: 'defensive_maneuvers', name: 'Defensive Maneuvers', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Cannot equip Medium or Heavy Armor, but gain +2 Physical Defence and +2 Magical Defence when unarmed', icon: '🛡️', prerequisites: { type: 'AND', skills: ['stance_training'] } },
      { id: 'air_fist_blast', name: 'Air Fist Blast', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Unarmed attacks can hit targets up to 15ft away', icon: '💨', prerequisites: { type: 'AND', skills: ['basic_mix_martial_arts'] } },

      // Tier 3
      { id: 'counter_strike', name: 'Counter Strike', tier: 3, cost: 23, staminaCost: 2, desc: 'Reaction: When hit by a physical attack, can make an unarmed attack as a reaction', icon: '🔄', prerequisites: { type: 'AND', skills: ['flurry_of_blows'] } },
      { id: 'vital_strike', name: 'Vital Strike', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Critical Hits deal 1 extra Physical Damage die', icon: '💔', prerequisites: { type: 'AND', skills: ['hardened_fists'] } },
      { id: 'flow_state', name: 'Flow State', tier: 3, cost: 23, staminaCost: 3, desc: 'Active: +1 to accuracy and Physical Damage for each consecutive unarmed attack in a turn (3 Stamina per attack)', icon: '🌀', prerequisites: { type: 'AND', skills: ['vital_strike'] } },
      { id: 'unbreakable', name: 'Unbreakable', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: +4 Physical Defence and +4 Magical Defence (upgrade of Defensive Maneuvers)', icon: '💎', prerequisites: { type: 'AND', skills: ['defensive_maneuvers'] } },
      { id: 'combo_mastery', name: 'Combo Mastery', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Can chain up to 4 Basic attacks per turn when unarmed (upgrade of Flurry of Blows)', icon: '⚡', prerequisites: { type: 'AND', skills: ['flurry_of_blows'] } },

      // Tier 4
      { id: 'perfect_form', name: 'Perfect Form', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Unarmed basic attacks deal 1d10 +4 Physical Damage (upgrade of Hardened Fists and Basic Mix martial arts)', icon: '✨', prerequisites: { type: 'AND', skills: ['hardened_fists', 'basic_mix_martial_arts'] } },
      { id: 'death_touch', name: 'Death Touch', tier: 4, cost: 30, staminaCost: 5, desc: 'Active: Attempt to Immobilize a target with an unarmed attack (50% chance, roll 11 or higher)', icon: '💀', prerequisites: { type: 'AND', skills: ['vital_strike'] } },
      { id: 'whirlwind_strike', name: 'Whirlwind Strike', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Attack all enemies within 10ft for 2d10 Physical Damage + 1d8 Wind Damage', icon: '🌪️', prerequisites: { type: 'AND', skills: ['combo_mastery'] } },
      { id: 'face_the_elements', name: 'Face the Elements', tier: 4, cost: 30, staminaCost: 1, desc: 'Reaction: Reduce 3 damage you would take by using 1 Stamina each (up to 30 damage)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['unbreakable'] } },
      { id: 'pressure_point_mastery', name: 'Pressure Point Mastery', tier: 4, cost: 30, staminaCost: 4, desc: 'Active: Unarmed attacks have a 75% chance (roll 6 or higher) to apply Incapacitated (reference to status-effects.js)', icon: '👆', prerequisites: { type: 'AND', skills: ['death_touch'] } },

      // Tier 5
      { id: 'unarmed_mastery', name: 'Unarmed Mastery', tier: 5, cost: 38, staminaCost: 0, desc: 'Passive: Unarmed basic attacks deal 2d10 base Physical Damage, and gain +4 Physical Damage with all unarmed skill attacks, critical hits restore 5 stamina', icon: '👑', prerequisites: { type: 'OR', skills: ['perfect_form', 'whirlwind_strike', 'pressure_point_mastery'] } },
      { id: 'one_punch_style', name: 'One Punch Style', tier: 5, cost: 38, staminaCost: 30, desc: 'Ultimate: Deal 10d10 Physical Damage. If you miss, take 3d10 Physical Damage. If you hit, Skip your next turn', icon: '💥', prerequisites: { type: 'AND', skills: ['perfect_form', 'whirlwind_strike', 'pressure_point_mastery', 'face_the_elements', 'death_touch'] } }
    ]
  },

  magic: {
    // FIRE MAGIC (Tier 1-5)
    fire: [
      // Tier 1
      { id: 'fire_spark', name: 'Fire Spark', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Small fire projectile (1d4 Fire Damage, 30ft range)', icon: '🔥', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'warm_hands', name: 'Warm Hands', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Create light (30ft radius) and restore 10% of Max HP of self, or nearby (5ft) ally', icon: '🤲', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'fireball', name: 'Fireball', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Fire projectile (2d6 Fire Damage, 60ft range)', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_spark'] } },
      { id: 'fire_shield', name: 'Fire Shield', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Apply Protected (absorb 3 attacks + attackers take 1d4 Fire Damage)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['warm_hands'] } },
      { id: 'ignite', name: 'Ignite', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Apply Burn (1 Fire Damage/turn + Strength -2 for 4 turns)', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_spark'] } },

      // Tier 3
      { id: 'fire_wall', name: 'Fire Wall', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Create 30ft wall of flames, blocks passage and deals 2d4 Fire Damage/turn', icon: '🧱', prerequisites: { type: 'AND', skills: ['fireball'] } },
      { id: 'explosion', name: 'Explosion', tier: 3, cost: 23, staminaCost: 9, desc: 'Active: 15ft radius explosion (3d6 Fire Damage to all inside, -1 accuracy, friendly fire possible)', icon: '💥', prerequisites: { type: 'AND', skills: ['fireball', 'ignite'] } },
      { id: 'phoenix_form', name: 'Phoenix Form', tier: 3, cost: 23, staminaCost: 10, desc: 'Toggle: Transform into phoenix form. Costs 10 stamina to activate, 5 stamina to maintain. All basic attacks gain +1d4 Fire Damage. GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '🦅', prerequisites: { type: 'AND', skills: ['fire_shield'] }, elementalType: 'fire' },
      { id: 'fire_attunement', name: 'Fire Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to fire magic. GRANTS: Fire resistance 50% (-1), Ice weakness 200% (+1)', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_shield', 'ignite'] }, elementalType: 'fire' },
      { id: 'fire_whip', name: 'Fire Whip', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: 15ft range fire attack (2d4 Fire Damage), can grapple', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_wall'] } },

      // Tier 4
      { id: 'meteor', name: 'Meteor', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: Devastating overhead attack (6d6 Fire Damage, 20ft radius, -2 accuracy, friendly fire possible). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '☄️', prerequisites: { type: 'AND', skills: ['explosion'] }, elementalType: 'fire' },
      { id: 'inferno', name: 'Inferno', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: Set 100ft radius ablaze (2d6 Fire Damage/turn for 1 minute, -4 accuracy, friendly fire possible). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '🔥', prerequisites: { type: 'AND', skills: ['phoenix_form', 'fire_whip'] }, elementalType: 'fire' },
      { id: 'fire_tornado', name: 'Fire Tornado', tier: 4, cost: 30, staminaCost: 11, desc: 'Active: Moving 30ft tall fire column (4d6 Fire Damage, moves 30ft/turn). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['fire_wall', 'explosion'] }, elementalType: 'fire' },

      // Tier 5
      { id: 'fire_supremacy', name: 'Fire Supremacy', tier: 5, cost: 38, staminaCost: 25, desc: 'Ultimate: Become one with fire for 3 rounds. Gain immunity to Fire Damage, +50% fire spell damage, all attacks apply Burn, and regenerate 3 HP/turn. Can ignite objects by touch.', icon: '', prerequisites: { type: 'AND', skills: ['meteor', 'inferno', 'fire_tornado'] } }
    ],

    // ICE MAGIC (Tier 1-5)
    ice: [
      // Tier 1
      { id: 'ice_shard', name: 'Ice Shard', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Sharp ice projectile (1d4 Ice Damage, 30ft range)', icon: '🧊', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'frost_touch', name: 'Frost Touch', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Touch attack applies Weakened (all stats -2 for 4 turns)', icon: '❄️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'ice_armor', name: 'Ice Armor', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: +3 Physical Defence, immunity to Fire Damage (10 minutes)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['frost_touch'] } },
      { id: 'ice_spear', name: 'Ice Spear', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Long range piercing ice attack (2d4 Ice Damage, 60ft)', icon: '🏹', prerequisites: { type: 'AND', skills: ['ice_shard'] } },
      { id: 'freeze', name: 'Freeze', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Apply Immobilized (cannot move but can attack for 3 turns)', icon: '🧊', prerequisites: { type: 'AND', skills: ['frost_touch'] } },

      // Tier 3
      { id: 'ice_wall', name: 'Ice Wall', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Create 30ft wall of ice (blocks passage, 20 HP)', icon: '🧱', prerequisites: { type: 'AND', skills: ['ice_armor'] } },
      { id: 'blizzard', name: 'Blizzard', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: 20ft radius cold storm (2d4 Ice Damage + apply Weakened to all inside). GRANTS: Ice resistance (50%), Fire weakness (200%)', icon: '🌨️', prerequisites: { type: 'AND', skills: ['ice_spear', 'freeze'] }, elementalType: 'ice' },
      { id: 'ice_attunement', name: 'Ice Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to ice magic. GRANTS: Ice resistance 50% (-1), Fire weakness 200% (+1)', icon: '❄️', prerequisites: { type: 'AND', skills: ['ice_armor', 'freeze'] }, elementalType: 'ice' },
      { id: 'ice_prison', name: 'Ice Prison', tier: 3, cost: 23, staminaCost: 7, desc: 'Active: Trap enemy in ice cage (immobile until 15 Ice Damage dealt)', icon: '🔒', prerequisites: { type: 'AND', skills: ['freeze'] } },
      { id: 'frost_nova', name: 'Frost Nova', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Freeze all enemies within 15ft (1 turn + slow)', icon: '💫', prerequisites: { type: 'AND', skills: ['ice_wall'] } },

      // Tier 4
      { id: 'absolute_zero', name: 'Absolute Zero', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: Instantly freeze any target (no resistance, 3 turns). GRANTS: Ice resistance (50%), Water resistance (25%), Fire weakness (200%), Lightning weakness (400%)', icon: '❄️', prerequisites: { type: 'AND', skills: ['ice_prison'] }, elementalType: 'ice' },
      { id: 'ice_age', name: 'Ice Age', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: Freeze 200ft radius (1d6 Ice Damage/turn, all slowed). GRANTS: Ice resistance (50%), Water resistance (25%), Fire weakness (200%), Lightning weakness (400%)', icon: '🧊', prerequisites: { type: 'AND', skills: ['blizzard', 'frost_nova'] }, elementalType: 'ice' },
      { id: 'glacier', name: 'Glacier', tier: 4, cost: 30, staminaCost: 10, desc: 'Active: Massive 50ft ice wall that moves 20ft/turn. GRANTS: Ice resistance (50%), Water resistance (25%), Fire weakness (200%), Lightning weakness (400%)', icon: '🏔️', prerequisites: { type: 'AND', skills: ['ice_wall'] }, elementalType: 'ice' },
      { id: 'ice_dominion', name: 'Ice Dominion', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master ice magic, enhanced ice spell effects. GRANTS: Ice resistance 50% (-1), Fire weakness 200% (+1)', icon: '❄️', prerequisites: { type: 'AND', skills: ['ice_attunement'] }, elementalType: 'ice' },

      // Tier 5
      { id: 'ice_supremacy', name: 'Ice Supremacy', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with ice for 3 rounds. Gain immunity to Ice Damage, +50% ice spell damage, all attacks apply Weakened, and create frozen terrain (difficult terrain) in 10ft radius. Temperature drops 50°F around you.', icon: '❄️', prerequisites: { type: 'AND', skills: ['absolute_zero', 'ice_age', 'glacier'] } }
    ],

    // LIGHTNING MAGIC (Tier 1-5)
    lightning: [
      // Tier 1
      { id: 'spark', name: 'Spark', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Small electrical discharge (1d4 Lightning Damage, 20ft)', icon: '⚡', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'static_charge', name: 'Static Charge', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Build electrical energy (+1 Lightning Damage to next lightning spell)', icon: '🔋', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'lightning_bolt', name: 'Lightning Bolt', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Fast electrical line attack (2d6 Lightning Damage, 100ft range)', icon: '⚡', prerequisites: { type: 'AND', skills: ['spark'] } },
      { id: 'shock', name: 'Shock', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Stun target for 1 turn (resistance negates)', icon: '😵', prerequisites: { type: 'AND', skills: ['static_charge'] } },
      { id: 'chain_lightning', name: 'Chain Lightning', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Lightning jumps to 3 additional targets (-1 Lightning Damage each)', icon: '🔗', prerequisites: { type: 'AND', skills: ['spark'] } },

      // Tier 3
      { id: 'thunder_clap', name: 'Thunder Clap', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: 20ft radius sound blast (2d4 Thunder Damage + deafen 1 turn)', icon: '🔊', prerequisites: { type: 'AND', skills: ['lightning_bolt'] } },
      { id: 'electric_field', name: 'Electric Field', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: 30ft zone deals 1d6 Lightning Damage to anyone entering (1 min)', icon: '⚡', prerequisites: { type: 'AND', skills: ['shock', 'chain_lightning'] } },
      { id: 'lightning_attunement', name: 'Lightning Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to lightning magic. GRANTS: Lightning resistance 50% (-1), Water weakness 200% (+1)', icon: '⚡', prerequisites: { type: 'AND', skills: ['shock', 'chain_lightning'] }, elementalType: 'lightning' },
      { id: 'lightning_speed', name: 'Lightning Speed', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: +3 Speed, extra move action (3 turns)', icon: '💨', prerequisites: { type: 'AND', skills: ['shock'] } },
      { id: 'overcharge', name: 'Overcharge', tier: 3, cost: 23, staminaCost: 7, desc: 'Active: Next spell deals maximum damage (no rolling)', icon: '🔋', prerequisites: { type: 'AND', skills: ['static_charge'] } },

      // Tier 4
      { id: 'lightning_storm', name: 'Lightning Storm', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: 8 random lightning strikes in 50ft radius (3d6 Lightning Damage each)', icon: '⛈️', prerequisites: { type: 'AND', skills: ['thunder_clap', 'electric_field'] } },
      { id: 'ball_lightning', name: 'Ball Lightning', tier: 4, cost: 30, staminaCost: 10, desc: 'Active: Slow orb (20ft/turn) explodes for 4d6 Lightning Damage in 15ft radius', icon: '⚡', prerequisites: { type: 'AND', skills: ['lightning_speed'] } },
      { id: 'emp', name: 'EMP', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: 40ft radius disables all magic for 1 minute', icon: '📵', prerequisites: { type: 'AND', skills: ['overcharge'] } },
      { id: 'storm_mastery', name: 'Storm Mastery', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master lightning magic, enhanced electrical control. GRANTS: Lightning resistance 50% (-1), Water weakness 200% (+1)', icon: '⚡', prerequisites: { type: 'AND', skills: ['lightning_attunement'] }, elementalType: 'lightning' },

      // Tier 5
      { id: 'lightning_supremacy', name: 'Lightning Supremacy', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with lightning for 3 rounds. Gain immunity to Lightning Damage, +50% movement speed, +50% lightning spell damage, all attacks apply Incapacitated, and can teleport 30ft as bonus action each turn.', icon: '⚡', prerequisites: { type: 'AND', skills: ['lightning_storm', 'ball_lightning', 'emp'] } }
    ],

    // EARTH MAGIC (Tier 1-5)
    earth: [
      // Tier 1
      { id: 'stone_throw', name: 'Stone Throw', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Hurl rock projectile (1d6 Earth Damage, 40ft range)', icon: '🪨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'earth_sense', name: 'Earth Sense', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Detect movement through ground (100ft radius)', icon: '🌍', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'stone_armor', name: 'Stone Armor', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Rock shell (+3 Physical Defence, -1 Speed for 10 minutes)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['stone_throw'] } },
      { id: 'earth_spike', name: 'Earth Spike', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Ground spike erupts (2d4 Earth Damage, knockdown)', icon: '⬆️', prerequisites: { type: 'AND', skills: ['earth_sense'] } },
      { id: 'mud_trap', name: 'Mud Trap', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Create 15ft difficult terrain, slows enemies 50%', icon: '🟫', prerequisites: { type: 'AND', skills: ['earth_sense'] } },

      // Tier 3
      { id: 'stone_wall', name: 'Stone Wall', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Create 40ft stone barrier (blocks movement, provides cover)', icon: '🧱', prerequisites: { type: 'AND', skills: ['stone_armor'] } },
      { id: 'earthquake', name: 'Earthquake', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: 25ft radius tremor (2d6 Earth Damage, knockdown all)', icon: '🌍', prerequisites: { type: 'AND', skills: ['earth_spike', 'mud_trap'] } },
      { id: 'earth_attunement', name: 'Earth Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to earth magic. GRANTS: Earth resistance 50% (-1), Wind weakness 200% (+1)', icon: '🌍', prerequisites: { type: 'AND', skills: ['stone_armor', 'mud_trap'] }, elementalType: 'earth' },
      { id: 'stone_spear', name: 'Stone Spear', tier: 3, cost: 23, staminaCost: 7, desc: 'Active: Piercing rock lance (3d4 Earth Damage, 60ft range)', icon: '🗡️', prerequisites: { type: 'AND', skills: ['earth_spike'] } },
      { id: 'earth_shield', name: 'Earth Shield', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Apply Protected (floating stones absorb next 3 attacks completely)', icon: '🪨', prerequisites: { type: 'AND', skills: ['stone_armor'] } },

      // Tier 4
      { id: 'mountain_crush', name: 'Mountain Crush', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: Massive boulder falls from sky (5d6 Earth Damage in 20ft radius)', icon: '🏔️', prerequisites: { type: 'AND', skills: ['stone_wall', 'earthquake'] } },
      { id: 'petrify', name: 'Petrify', tier: 4, cost: 30, staminaCost: 10, desc: 'Active: Apply Immobilized (cannot move but can attack + +5 Physical Defence for 3 turns)', icon: '🗿', prerequisites: { type: 'AND', skills: ['stone_spear', 'earth_shield'] } },
      { id: 'tectonic_shift', name: 'Tectonic Shift', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: Reshape 100ft area terrain for 24 hours', icon: '🌋', prerequisites: { type: 'AND', skills: ['earthquake'] } },
      { id: 'stone_mastery', name: 'Stone Mastery', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master earth magic, enhanced stone manipulation. GRANTS: Earth resistance 50% (-1), Wind weakness 200% (+1)', icon: '🌍', prerequisites: { type: 'AND', skills: ['earth_attunement'] }, elementalType: 'earth' },

      // Tier 5
      { id: 'earth_supremacy', name: 'Earth Supremacy', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with earth for 3 rounds. Gain immunity to Earth Damage, +5 Physical Defence from stone skin, +50% earth spell damage, all attacks apply Immobilized, and can burrow through ground at half speed.', icon: '🌍', prerequisites: { type: 'AND', skills: ['mountain_crush', 'petrify', 'tectonic_shift'] } }
    ],

    // WIND MAGIC (Tier 1-5)
    wind: [
      // Tier 1
      { id: 'gust', name: 'Gust', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Wind push (knockback 10ft, extinguish flames)', icon: '💨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'feather_fall', name: 'Feather Fall', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Slow falling (no fall damage for 1 minute)', icon: '🪶', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'wind_blade', name: 'Wind Blade', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Cutting air slash (2d4 Wind Damage, 50ft range)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['gust'] } },
      { id: 'levitate', name: 'Levitate', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Float in air (20ft height, 5 minutes)', icon: '🎈', prerequisites: { type: 'AND', skills: ['feather_fall'] } },
      { id: 'wind_barrier', name: 'Wind Barrier', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Deflect projectiles (+4 Physical Defence vs ranged for 5 turns)', icon: '🌀', prerequisites: { type: 'AND', skills: ['gust'] } },

      // Tier 3
      { id: 'flight', name: 'Flight', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: True flight (60ft speed, 10 minutes)', icon: '🕊️', prerequisites: { type: 'AND', skills: ['levitate', 'wind_barrier'] } },
      { id: 'tornado', name: 'Tornado', tier: 3, cost: 23, staminaCost: 10, desc: 'Active: 15ft radius whirlwind (3d4 Wind Damage, pulls enemies in)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['wind_blade'] } },
      { id: 'wind_attunement', name: 'Wind Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to wind magic. GRANTS: Wind resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💨', prerequisites: { type: 'AND', skills: ['wind_barrier', 'wind_blade'] }, elementalType: 'wind' },
      { id: 'suffocate', name: 'Suffocate', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Remove air around target (2d4 Wind Damage/turn for 3 turns)', icon: '😵', prerequisites: { type: 'AND', skills: ['wind_blade'] } },
      { id: 'wind_walk', name: 'Wind Walk', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Become incorporeal mist (immune to Physical Damage)', icon: '☁️', prerequisites: { type: 'AND', skills: ['levitate'] } },

      // Tier 4
      { id: 'hurricane', name: 'Hurricane', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: Massive storm 50ft radius (4d6 Wind Damage, difficult terrain)', icon: '🌀', prerequisites: { type: 'AND', skills: ['flight', 'tornado'] } },
      { id: 'wind_prison', name: 'Wind Prison', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Trap target in air pocket (cannot move or act)', icon: '🟦', prerequisites: { type: 'AND', skills: ['suffocate', 'wind_walk'] } },
      { id: 'atmospheric_control', name: 'Atmospheric Control', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: Control weather in the area for 1 hour', icon: '⛅', prerequisites: { type: 'AND', skills: ['wind_walk'] } },
      { id: 'gale_mastery', name: 'Gale Mastery', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master wind magic, enhanced atmospheric control. GRANTS: Wind resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💨', prerequisites: { type: 'AND', skills: ['wind_attunement'] }, elementalType: 'wind' },

      // Tier 5
      { id: 'wind_mastery', name: 'Wind Mastery', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with the wind for 3 rounds. Gain flight, immunity to ground effects, +50% movement speed, and all attacks push enemies back 10ft. Can pass through enemy spaces without provoking attacks.', icon: '🌪️', prerequisites: { type: 'AND', skills: ['wind_walk', 'hurricane', 'wind_barrier'] } }
    ],

    // WATER MAGIC (Tier 1-5)
    water: [
      // Tier 1
      { id: 'water_splash', name: 'Water Splash', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Water projectile (1d4 Water Damage, extinguish fire)', icon: '💧', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'purify_water', name: 'Purify Water', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Clean any liquid, remove poison from drinks', icon: '🚰', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'water_whip', name: 'Water Whip', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Flexible water tendril (2d4 Water Damage, 20ft range)', icon: '🌊', prerequisites: { type: 'AND', skills: ['water_splash'] } },
      { id: 'heal_wounds', name: 'Heal Wounds', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Restore 2d4+2 HP instantly OR apply Regeneration status', icon: '💚', prerequisites: { type: 'AND', skills: ['purify_water'] } },
      { id: 'create_water', name: 'Create Water', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Summon fresh water (10 gallons), put out fires', icon: '🫗', prerequisites: { type: 'AND', skills: ['water_splash'] } },

      // Tier 3
      { id: 'tidal_wave', name: 'Tidal Wave', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: 30ft cone wave (3d4 Water Damage, knockdown)', icon: '🌊', prerequisites: { type: 'AND', skills: ['water_whip', 'create_water'] } },
      { id: 'water_breathing', name: 'Water Breathing', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Apply Enhanced Mobility (water breathing + swim speed)', icon: '🫧', prerequisites: { type: 'AND', skills: ['heal_wounds'] } },
      { id: 'blood_control', name: 'Blood Control', tier: 3, cost: 23, staminaCost: 7, desc: 'Active: Apply Mind Controlled (target moves as you direct for 3 turns)', icon: '🩸', prerequisites: { type: 'AND', skills: ['heal_wounds'] } },
      { id: 'water_attunement', name: 'Water Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to water magic. GRANTS: Water resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💧', prerequisites: { type: 'AND', skills: ['heal_wounds', 'create_water'] }, elementalType: 'water' },
      { id: 'water_shield', name: 'Water Shield', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Apply Protected (flowing barrier absorbs 3 attacks + fire immunity)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['create_water'] } },

      // Tier 4
      { id: 'maelstrom', name: 'Maelstrom', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: 40ft whirlpool pulls enemies in (4d4 Water Damage/turn)', icon: '🌀', prerequisites: { type: 'AND', skills: ['tidal_wave', 'water_breathing'] } },
      { id: 'blood_boil', name: 'Blood Boil', tier: 4, cost: 30, staminaCost: 10, desc: 'Active: Superheat target\'s blood (5d4 Fire Damage, no resistance)', icon: '🩸', prerequisites: { type: 'AND', skills: ['blood_control', 'water_shield'] } },
      { id: 'tsunami', name: 'Tsunami', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: Massive wave 100ft long (6d4 Water Damage, reshape terrain)', icon: '🌊', prerequisites: { type: 'AND', skills: ['water_shield'] } },
      { id: 'hydro_mastery', name: 'Hydro Mastery', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master water magic, enhanced fluid manipulation. GRANTS: Water resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💧', prerequisites: { type: 'AND', skills: ['water_attunement'] }, elementalType: 'water' },

      // Tier 5
      { id: 'water_mastery', name: 'Water Mastery', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with water for 3 rounds. Gain immunity to Water Damage, can move through any liquid at normal speed, +50% water spell damage, all attacks heal you for 25% of damage dealt, and can breathe underwater indefinitely.', icon: '🌊', prerequisites: { type: 'AND', skills: ['maelstrom', 'blood_boil', 'tsunami'] } }
    ],

    // DARKNESS MAGIC (Tier 1-5)
    darkness: [
      // Tier 1
      { id: 'shadow_bolt', name: 'Shadow Bolt', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Dark energy projectile (1d6 Darkness Damage, 40ft range)', icon: '🌑', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'darkvision', name: 'Darkvision', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: See in complete darkness (1 hour)', icon: '👁️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'shadow_step', name: 'Shadow Step', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Teleport between shadows (60ft range)', icon: '👤', prerequisites: { type: 'AND', skills: ['shadow_bolt'] } },
      { id: 'fear', name: 'Fear', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Apply Mind Controlled (target flees in terror for 3 turns)', icon: '😱', prerequisites: { type: 'AND', skills: ['darkvision'] } },
      { id: 'darkness', name: 'Darkness', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: Create 20ft radius of magical darkness', icon: '⚫', prerequisites: { type: 'AND', skills: ['shadow_bolt'] } },

      // Tier 3
      { id: 'shadow_duplicate', name: 'Shadow Clone', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: Create dark duplicate (50% your stats, 5 turns)', icon: '👥', prerequisites: { type: 'AND', skills: ['shadow_step', 'darkness'] } },
      { id: 'nightmare', name: 'Nightmare', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Sleeping target takes 2d6 Psychic Damage', icon: '💭', prerequisites: { type: 'AND', skills: ['fear'] } },
      { id: 'life_drain', name: 'Life Drain', tier: 3, cost: 23, staminaCost: 7, desc: 'Active: Steal 2d4 HP from target, heal yourself same amount', icon: '🖤', prerequisites: { type: 'AND', skills: ['fear'] } },
      { id: 'darkness_attunement', name: 'Darkness Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to darkness magic. GRANTS: Darkness resistance 50% (-1), Light weakness 200% (+1)', icon: '🌑', prerequisites: { type: 'AND', skills: ['fear', 'darkness'] }, elementalType: 'darkness' },
      { id: 'shadow_armor', name: 'Shadow Armor', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Darkness cloaks you (+3 Physical Defence, gain advantage on rolls to stay hidden)', icon: '🥷', prerequisites: { type: 'AND', skills: ['darkness'] } },

      // Tier 4
      { id: 'void_prison', name: 'Void Prison', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: Banish target to shadow realm (removed for 3 turns)', icon: '🕳️', prerequisites: { type: 'AND', skills: ['shadow_duplicate', 'nightmare'] } },
      { id: 'soul_steal', name: 'Soul Steal', tier: 4, cost: 30, staminaCost: 10, desc: 'Active: Drain 1 point from all target stats for 24 hours', icon: '👻', prerequisites: { type: 'AND', skills: ['life_drain', 'shadow_armor'] } },
      { id: 'eclipse', name: 'Eclipse', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: 200ft radius darkness, all enemies take 1d6 Darkness Damage/turn', icon: '🌚', prerequisites: { type: 'AND', skills: ['shadow_armor'] } },
      { id: 'void_mastery', name: 'Void Mastery', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master darkness magic, enhanced shadow manipulation. GRANTS: Darkness resistance 50% (-1), Light weakness 200% (+1)', icon: '🌑', prerequisites: { type: 'AND', skills: ['darkness_attunement'] }, elementalType: 'darkness' },

      // Tier 5
      { id: 'darkness_mastery', name: 'Darkness Mastery', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with darkness for 3 rounds. Gain immunity to Darkness Damage, permanent invisibility while in shadows, +50% darkness spell damage, all attacks apply Mind Controlled (fear), and can phase through walls for 1 turn per use.', icon: '🌑', prerequisites: { type: 'AND', skills: ['void_prison', 'soul_steal', 'eclipse'] } }
    ],

    // LIGHT MAGIC (Tier 1-5)
    light: [
      // Tier 1
      { id: 'light_ray', name: 'Light Ray', tier: 1, cost: 8, staminaCost: 2, desc: 'Active: Radiant beam (1d6 Light Damage, blinds for 1 turn)', icon: '☀️', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'illuminate', name: 'Illuminate', tier: 1, cost: 8, staminaCost: 1, desc: 'Active: Bright light (60ft radius, reveals invisible)', icon: '💡', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'healing_light', name: 'Healing Light', tier: 2, cost: 15, staminaCost: 4, desc: 'Active: Restore 2d4+3 HP instantly + apply Regeneration (immunity to poison)', icon: '✨', prerequisites: { type: 'AND', skills: ['light_ray'] } },
      { id: 'purify', name: 'Purify', tier: 2, cost: 15, staminaCost: 5, desc: 'Active: Remove poison, disease, and curses', icon: '🧽', prerequisites: { type: 'AND', skills: ['illuminate'] } },
      { id: 'blinding_flash', name: 'Blinding Flash', tier: 2, cost: 15, staminaCost: 3, desc: 'Active: 15ft radius flash blinds all enemies for 1 turn', icon: '⚡', prerequisites: { type: 'AND', skills: ['light_ray'] } },

      // Tier 3
      { id: 'holy_weapon', name: 'Holy Weapon', tier: 3, cost: 23, staminaCost: 6, desc: 'Active: Apply Weapon Enchanted (+1d6 Radiant Damage, extra vs undead)', icon: '⚔️', prerequisites: { type: 'AND', skills: ['healing_light', 'purify'] } },
      { id: 'sanctuary', name: 'Sanctuary', tier: 3, cost: 23, staminaCost: 8, desc: 'Active: Protected area (enemies cannot enter 20ft radius)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['purify'] } },
      { id: 'light_attunement', name: 'Light Attunement', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Become attuned to light magic. GRANTS: Light resistance 50% (-1), Darkness weakness 200% (+1)', icon: '☀️', prerequisites: { type: 'AND', skills: ['healing_light', 'purify'] }, elementalType: 'light' },
      { id: 'laser_beam', name: 'Laser Beam', tier: 3, cost: 23, staminaCost: 7, desc: 'Active: Concentrated light (3d6 Light Damage, pierces armor)', icon: '🔆', prerequisites: { type: 'AND', skills: ['blinding_flash'] } },
      { id: 'light_shield', name: 'Light Shield', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Radiant barrier (+3 AC, reflects dark magic)', icon: '🌟', prerequisites: { type: 'AND', skills: ['blinding_flash'] } },

      // Tier 4
      { id: 'resurrection', name: 'Resurrection', tier: 4, cost: 30, staminaCost: 15, desc: 'Active: Bring ally back to life (once per day)', icon: '🕊️', prerequisites: { type: 'AND', skills: ['holy_weapon', 'sanctuary'] } },
      { id: 'solar_flare', name: 'Solar Flare', tier: 4, cost: 30, staminaCost: 12, desc: 'Active: 40ft radius explosion (5d6 Radiant Damage)', icon: '🌟', prerequisites: { type: 'AND', skills: ['laser_beam', 'light_shield'] } },
      { id: 'divine_judgment', name: 'Divine Judgment', tier: 4, cost: 30, staminaCost: 10, desc: 'Active: Target takes damage equal to their max HP × 0.5', icon: '⚖️', prerequisites: { type: 'AND', skills: ['light_shield'] } },
      { id: 'radiant_mastery', name: 'Radiant Mastery', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Master light magic, enhanced radiant energy. GRANTS: Light resistance 50% (-1), Darkness weakness 200% (+1)', icon: '☀️', prerequisites: { type: 'AND', skills: ['light_attunement'] }, elementalType: 'light' },

      // Tier 5
      { id: 'light_mastery', name: 'Light Mastery', tier: 5, cost: 38, staminaCost: 15, desc: 'Ultimate: Become one with light for 3 rounds. Gain immunity to Light/Radiant Damage, emit bright light (30ft radius blinds enemies), +50% light spell damage, all attacks apply Mind Controlled (charm), and can teleport to any bright light source within 100ft.', icon: '☀️', prerequisites: { type: 'AND', skills: ['resurrection', 'solar_flare', 'divine_judgment'] } }
    ]
  },

  professions: {
    // SIMPLIFIED PROFESSIONS SYSTEM
    smithing: [
      { id: 'smithing_basic', name: 'Smithing: Basic', tier: 1, cost: 15, staminaCost: 0, desc: 'Active: Craft basic weapons and armor.', icon: '🔨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'smithing_advanced', name: 'Smithing: Advanced', tier: 2, cost: 50, staminaCost: 0, desc: 'Active: Craft advanced weapons and armor (+1 to all crafted item stats).', icon: '⚔️', prerequisites: { type: 'AND', skills: ['smithing_basic'] } },
      { id: 'smithing_master', name: 'Smithing: Master', tier: 3, cost: 100, staminaCost: 0, desc: 'Active: Craft masterwork items (+2 to all crafted item stats, access rare materials).', icon: '🏆', prerequisites: { type: 'AND', skills: ['smithing_advanced'] } }
    ],
    alchemy: [
      { id: 'alchemy_basic', name: 'Alchemy: Basic', tier: 1, cost: 15, staminaCost: 0, desc: 'Active: Mix basic potions and remedies.', icon: '🧪', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'alchemy_advanced', name: 'Alchemy: Advanced', tier: 2, cost: 50, staminaCost: 0, desc: 'Active: Create advanced potions and toxins (+1 effect).', icon: '☠️', prerequisites: { type: 'AND', skills: ['alchemy_basic'] } },
      { id: 'alchemy_master', name: 'Alchemy: Master', tier: 3, cost: 100, staminaCost: 0, desc: 'Active: Brew masterwork potions (+2 effect, rare ingredients).', icon: '💥', prerequisites: { type: 'AND', skills: ['alchemy_advanced'] } }
    ],
    enchanting: [
      { id: 'enchanting_basic', name: 'Enchanting: Basic', tier: 1, cost: 15, staminaCost: 0, desc: 'Active: Add simple magical effects to items.', icon: '✨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'enchanting_advanced', name: 'Enchanting: Advanced', tier: 2, cost: 50, staminaCost: 0, desc: 'Active: Add advanced magical effects (+1 property).', icon: '🔥', prerequisites: { type: 'AND', skills: ['enchanting_basic'] } },
      { id: 'enchanting_master', name: 'Enchanting: Master', tier: 3, cost: 100, staminaCost: 0, desc: 'Active: Create masterwork enchantments (+2 properties, rare effects).', icon: '🌟', prerequisites: { type: 'AND', skills: ['enchanting_advanced'] } }
    ]
  },

  // Monster Skills - Organized by category for easier navigation
  // Note: Monsters cannot learn profession skills (smithing, alchemy, etc.) - they are wild beasts
  monster: {
    defense: [
      // Defensive/Armor Skills (1-10)
      { id: 'tough_skin', name: 'Tough Skin', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Natural armor (+2 Physical Defence)', icon: '🛡️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'defense' },
      { id: 'rock_skin', name: 'Rock Skin', tier: 2, cost: 10, staminaCost: 0, desc: 'Passive: Stone-like hide (+3 Physical Defence, resist piercing)', icon: '🗿', prerequisites: { type: 'AND', skills: ['tough_skin'] }, lootType: 'defense' },
      { id: 'metal_skin', name: 'Metal Skin', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Metallic armor (+4 Physical Defence, resist slashing)', icon: '⚙️', prerequisites: { type: 'AND', skills: ['rock_skin'] }, lootType: 'defense' },
      { id: 'magical_resistance', name: 'Magical Resistance', tier: 2, cost: 10, staminaCost: 0, desc: 'Passive: Innate magic protection (+3 Magical Defence)', icon: '🔮', prerequisites: { type: 'NONE', skills: [] }, lootType: 'defense' },
      { id: 'damage_reduction', name: 'Damage Reduction', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Reduce all incoming damage by 2 points', icon: '🛡️', prerequisites: { type: 'AND', skills: ['tough_skin', 'magical_resistance'] } },
      { id: 'regeneration', name: 'Regeneration', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Apply Regeneration status (2 HP/turn + poison resistance) - does not stack with other regeneration', icon: '💚', prerequisites: { type: 'AND', skills: ['damage_reduction'] } },
      { id: 'rapid_healing', name: 'Rapid Healing', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: Enhanced Regeneration (3 HP/turn + strong DoT resistance) - replaces basic regeneration', icon: '✨', prerequisites: { type: 'AND', skills: ['regeneration'] } },
      { id: 'armored_plates', name: 'Armored Plates', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Segmented armor (+2 Physical Defence, immune to critical hits)', icon: '🦀', prerequisites: { type: 'AND', skills: ['rock_skin'] }, lootType: 'defense' },
      { id: 'spell_turning', name: 'Spell Turning', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: 25% chance to reflect spells back at caster', icon: '🔄', prerequisites: { type: 'AND', skills: ['magical_resistance'] } },
      { id: 'immunity_poison', name: 'Poison Resistance', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Strong resistance to all poisons and diseases (25% damage from poison effects)', icon: '☠️', prerequisites: { type: 'NONE', skills: [] } }
    ],

    combat: [
      // Combat/Attack Skills (11-25)
      { id: 'claws', name: 'Natural Claws', tier: 1, cost: 5, staminaCost: 2, desc: 'Active: Melee attack: 1d6+2 slashing damage', icon: '🦅', prerequisites: { type: 'NONE', skills: [] }, lootType: 'combat' },
      { id: 'razor_claws', name: 'Razor Claws', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Enhanced claws: 1d8+3 slashing, causes bleeding', icon: '🩸', prerequisites: { type: 'AND', skills: ['claws'] }, lootType: 'combat' },
      { id: 'venomous_claws', name: 'Venomous Claws', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Poisonous claws: normal Physical Damage + poison (1d4 per turn)', icon: '🟢', prerequisites: { type: 'AND', skills: ['razor_claws'] }, lootType: 'combat' },
      { id: 'bite_attack', name: 'Powerful Bite', tier: 1, cost: 5, staminaCost: 3, desc: 'Active: Bite attack: 1d8+1 piercing damage', icon: '🦷', prerequisites: { type: 'NONE', skills: [] }, lootType: 'combat' },
      { id: 'crushing_bite', name: 'Crushing Bite', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Devastating bite: 2d6+2 Physical Damage, ignores 2 Physical Defence', icon: '💀', prerequisites: { type: 'AND', skills: ['bite_attack'] }, lootType: 'combat' },
      { id: 'tail_swipe', name: 'Tail Swipe', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Sweep attack: 1d6 Physical Damage to all adjacent enemies', icon: '🦎', prerequisites: { type: 'NONE', skills: [] }, lootType: 'combat' },
      { id: 'spiked_tail', name: 'Spiked Tail', tier: 3, cost: 15, staminaCost: 4, desc: 'Active: Piercing tail: 1d10+3 Physical Damage, 10ft range', icon: '🦂', prerequisites: { type: 'AND', skills: ['tail_swipe'] }, lootType: 'combat' },
      { id: 'monster_charge_attack', name: 'Charge Attack', tier: 2, cost: 10, staminaCost: 5, desc: 'Active: Rush forward 20ft and attack for double Physical Damage', icon: '🐂', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'monster_berserker_rage', name: 'Berserker Rage', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: +4 Physical Damage, +2 attacks per turn, -2 Physical Defence for 3 turns', icon: '😡', prerequisites: { type: 'AND', skills: ['monster_charge_attack'] } },
      { id: 'multiattack', name: 'Multiattack', tier: 4, cost: 20, staminaCost: 6, desc: 'Active: Make 2 different attacks in one action', icon: '⚔️', prerequisites: { type: 'AND', skills: ['claws', 'bite_attack'] } },
      { id: 'rend', name: 'Rend', tier: 3, cost: 15, staminaCost: 5, desc: 'Passive: If both claws hit same target, deal +1d6 Physical Damage', icon: '🩸', prerequisites: { type: 'AND', skills: ['razor_claws'] } },
      { id: 'pounce', name: 'Pounce', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Leap 15ft and knock target prone on hit', icon: '🦘', prerequisites: { type: 'AND', skills: ['claws'] } },
      { id: 'gore', name: 'Gore Attack', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Horn attack: 1d8+2 piercing, push target 5ft', icon: '🐗', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'trample', name: 'Trample', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Move through enemies, each takes 1d6 Physical Damage', icon: '🦏', prerequisites: { type: 'AND', skills: ['monster_charge_attack'] } },
      { id: 'blood_frenzy', name: 'Blood Frenzy', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: When enemy drops below 25% HP, gain +3 Physical Damage', icon: '🩸', prerequisites: { type: 'AND', skills: ['monster_berserker_rage'] } }
    ],

    magic: [
      // Magical/Breath/Special Abilities (26-40) - Each grants elemental affinity
      { id: 'fire_breath', name: 'Fire Breath', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: 30ft cone, 2d8 Fire Damage + apply Burn (1 dmg/turn + Str -2). Grants fire resistance, ice/water weakness', icon: '🔥', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'fire' },
      { id: 'ice_breath', name: 'Ice Breath', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: 30ft cone, 2d6 Ice Damage + apply Weakened (all stats -2). Grants ice/water resistance, fire/lightning weakness', icon: '❄️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'ice' },
      { id: 'poison_breath', name: 'Poison Breath', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: 25ft cone, 1d8 Poison Damage + apply Poison (escalating 1→2→3 damage). Grants poison resistance, light/fire weakness', icon: '☠️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'poison' },
      { id: 'lightning_breath', name: 'Lightning Breath', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: 60ft line, 2d10 Lightning Damage + apply Immobilized (cannot move). Grants lightning resistance, earth/water weakness', icon: '⚡', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'lightning' },
      { id: 'acid_spit', name: 'Acid Spit', tier: 2, cost: 10, staminaCost: 5, desc: 'Active: Ranged attack: 1d8 Acid Damage + apply Acid Corrosion (armor decay). Grants poison resistance, ice/water weakness', icon: '🟢', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'acid' },
      { id: 'fear_aura', name: 'Fear Aura', tier: 3, cost: 15, staminaCost: 6, desc: 'Passive: Apply Intimidating Aura (enemies must resist Mind Control)', icon: '😨', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'paralyzing_gaze', name: 'Paralyzing Gaze', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Target within 60ft: Apply Immobilized (cannot move but can attack)', icon: '👁️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'invisibility', name: 'Invisibility', tier: 4, cost: 20, staminaCost: 12, desc: 'Active: Apply Stealth Mastery (invisible + strong mind control resistance)', icon: '👻', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'teleport', name: 'Teleport', tier: 3, cost: 15, staminaCost: 8, desc: 'Active: Instantly move up to 60ft to visible location', icon: '✨', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'web_shot', name: 'Web Shot', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Ranged: Apply Immobilized (cannot move for 3 turns)', icon: '🕸️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'monster_earthquake', name: 'Earthquake', tier: 4, cost: 20, staminaCost: 15, desc: 'Active: 30ft radius: 3d6 Earth Damage, knock prone, difficult terrain. Grants earth resistance, wind/lightning weakness', icon: '🌍', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'earth' },
      { id: 'mind_control', name: 'Mind Control', tier: 5, cost: 25, staminaCost: 15, desc: 'Active: Apply Mind Controlled (control enemy actions for 3 turns)', icon: '🧠', prerequisites: { type: 'AND', skills: ['paralyzing_gaze'] }, lootType: 'magic' },
      { id: 'energy_drain', name: 'Energy Drain', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Touch: Apply Weakened (all stats -2) and drain 1d4 stamina', icon: '🖤', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'monster_shadow_step', name: 'Shadow Step', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Move from shadow to shadow within 40ft. Grants darkness resistance, light weakness', icon: '🌑', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'shadow' },
      { id: 'roar', name: 'Terrifying Roar', tier: 2, cost: 10, staminaCost: 5, desc: 'Active: 20ft radius: Apply Mind Controlled (fear variant - enemies flee)', icon: '🦁', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' }
    ],

    utility: [
      // Utility/Movement/Special (41-50)
      { id: 'monster_flight', name: 'Flight', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: Apply Enhanced Mobility (flight + strong immobilization resistance)', icon: '🦅', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'burrow', name: 'Burrow', tier: 2, cost: 10, staminaCost: 0, desc: 'Active: Dig through earth at half speed, surprise attacks', icon: '🕳️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'climb', name: 'Natural Climber', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Climb speed equal to land speed, no checks needed', icon: '🧗', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'swim', name: 'Aquatic', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Swim speed, hold breath for 30 minutes', icon: '🏊', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'echolocation', name: 'Echolocation', tier: 2, cost: 10, staminaCost: 0, desc: 'Passive: See in complete darkness within 60ft', icon: '🦇', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'camouflage', name: 'Camouflage', tier: 2, cost: 10, staminaCost: 3, desc: 'Active: Blend with surroundings: gain advantage on rolls to stay hidden', icon: '🦎', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'pack_leader', name: 'Pack Leader', tier: 3, cost: 15, staminaCost: 0, desc: 'Active: Summon 1d4 lesser creatures to fight for 5 turns', icon: '🐺', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'size_change', name: 'Size Change', tier: 4, cost: 20, staminaCost: 10, desc: 'Active: Double size for 5 turns: +4 Str, +2 range, -2 Physical Defence', icon: '📏', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'phase_shift', name: 'Phase Shift', tier: 5, cost: 25, staminaCost: 12, desc: 'Active: Become incorporeal for 3 turns, strong resistance to Physical Damage (25%)', icon: '👻', prerequisites: { type: 'AND', skills: ['invisibility'] }, lootType: 'utility' },
      { id: 'monster_ancient_knowledge', name: 'Ancient Knowledge', tier: 5, cost: 25, staminaCost: 0, desc: 'Active: Know weakness of any creature (+4 Physical Damage vs that type)', icon: '📚', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' }
    ]
  },

  // Fusion Skills - Unlocked by combining skills from different trees
  fusion: {
    ranged_magic: [
      // Bow/Ranged + Magic combinations
      // Fire
      { id: 'flame_arrow', name: 'Flame Arrow', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🏹🔥', prerequisites: { type: 'AND', skills: ['quick_draw', 'fireball'] }, fusionType: 'bow_fire' },
      { id: 'inferno_volley', name: 'Inferno Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple burning arrows, each dealing 2d6 Fire Damage. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'fire_wall'] }, fusionType: 'bow_fire' },
      { id: 'phoenix_shot', name: 'Phoenix Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that explodes in flames, dealing 3d6 Fire Damage in an area. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🦅🔥', prerequisites: { type: 'AND', skills: ['flame_arrow', 'inferno_volley'] }, fusionType: 'bow_fire' },
      // Ice
      { id: 'frost_arrow', name: 'Frost Arrow', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🏹❄️', prerequisites: { type: 'AND', skills: ['quick_draw', 'ice_shard'] }, fusionType: 'bow_ice' },
      { id: 'glacier_volley', name: 'Glacier Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple freezing arrows, each dealing 2d6 Ice Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'ice_wall'] }, fusionType: 'bow_ice' },
      { id: 'blizzard_shot', name: 'Blizzard Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that creates a freezing zone, dealing 3d6 Ice Damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_arrow', 'glacier_volley'] }, fusionType: 'bow_ice' },
      // Lightning
      { id: 'storm_arrow', name: 'Storm Arrow', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🏹⚡', prerequisites: { type: 'AND', skills: ['quick_draw', 'spark'] }, fusionType: 'bow_lightning' },
      { id: 'thunder_volley', name: 'Thunder Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple charged arrows, each dealing 2d6 Lightning Damage. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'thunder_clap'] }, fusionType: 'bow_lightning' },
      { id: 'lightning_storm', name: 'Lightning Storm', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that chains lightning between targets, dealing 3d6 Lightning Damage. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_arrow', 'thunder_volley'] }, fusionType: 'bow_lightning' },
      // Earth
      { id: 'stone_arrow', name: 'Stone Arrow', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Ranged attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '🏹🪨', prerequisites: { type: 'AND', skills: ['quick_draw', 'stone_throw'] }, fusionType: 'bow_earth' },
      { id: 'crystal_volley', name: 'Crystal Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple stone arrows, each dealing 2d6 Earth Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'stone_wall'] }, fusionType: 'bow_earth' },
      { id: 'mountain_shot', name: 'Mountain Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that creates stone spikes on impact, dealing 3d6 Earth Damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️🪨', prerequisites: { type: 'AND', skills: ['stone_arrow', 'crystal_volley'] }, fusionType: 'bow_earth' },
      // Wind
      { id: 'wind_arrow', name: 'Wind Arrow', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Ranged attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '🏹💨', prerequisites: { type: 'AND', skills: ['quick_draw', 'gust'] }, fusionType: 'bow_wind' },
      { id: 'gale_volley', name: 'Gale Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple wind-empowered arrows that curve around obstacles, dealing 2d6 Wind Damage.', icon: '💨🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'wind_barrier'] }, fusionType: 'bow_wind' },
      { id: 'hurricane_shot', name: 'Hurricane Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that creates a whirlwind, dealing 3d6 Wind Damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_arrow', 'gale_volley'] }, fusionType: 'bow_wind' },
      // Water
      { id: 'water_arrow', name: 'Water Arrow', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Ranged attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '🏹', prerequisites: { type: 'AND', skills: ['quick_draw', 'water_splash'] }, fusionType: 'bow_water' },
      { id: 'tide_volley', name: 'Tide Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple water arrows, each dealing 2d6 Water Damage and healing you for half the damage dealt (no status effect)', icon: '💧🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'water_shield'] }, fusionType: 'bow_water' },
      { id: 'tsunami_shot', name: 'Tsunami Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that creates a wave of water on impact, dealing 3d6 Water Damage (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_arrow', 'tide_volley'] }, fusionType: 'bow_water' },
      // Darkness

      { id: 'shadow_arrow', name: 'Shadow Arrow', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🏹🌑', prerequisites: { type: 'AND', skills: ['quick_draw', 'shadow_bolt'] }, fusionType: 'bow_darkness' },
      { id: 'void_volley', name: 'Void Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple shadow arrows (2 arrows + 3 Stamina for each additional arrow), each dealing 2d6 Darkness Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'shadow_armor'] }, fusionType: 'bow_darkness' },
      { id: 'eclipse_shot', name: 'Eclipse Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that creates a zone of darkness, dealing 3d6 Darkness Damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_arrow', 'void_volley'] }, fusionType: 'bow_darkness' },
      // Light
      { id: 'light_arrow', name: 'Light Arrow', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🏹☀️', prerequisites: { type: 'AND', skills: ['quick_draw', 'light_ray'] }, fusionType: 'bow_light' },
      { id: 'radiant_volley', name: 'Radiant Volley', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Fire multiple light arrows, each dealing 2d6 Light Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'light_shield'] }, fusionType: 'bow_light' },
      { id: 'solar_shot', name: 'Solar Shot', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Fire an arrow that creates a burst of holy light, dealing 3d6 Light Damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_arrow', 'radiant_volley'] }, fusionType: 'bow_light' }
    ],

    melee_magic: [
      // Sword + Magic combinations
      // --- FIRE ---
      { id: 'flame_edge', name: 'Flame Edge', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '⚔️🔥', prerequisites: { type: 'AND', skills: ['quick_strike', 'fireball'] }, fusionType: 'sword_fire' },
      { id: 'inferno_parry', name: 'Inferno Parry', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry an attack and unleash a burst of flames, dealing 2d6 Fire Damage to the attacker. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🛡️🔥', prerequisites: { type: 'AND', skills: ['sword_mastery', 'fire_wall'] }, fusionType: 'sword_fire' },
      { id: 'blazing_tempest', name: 'Blazing Tempest', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Spin and release a fiery whirlwind, hitting all adjacent enemies for 3d6 Fire Damage and has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌪️🔥', prerequisites: { type: 'AND', skills: ['flame_edge', 'inferno_parry'] }, fusionType: 'sword_fire' },
      // --- ICE ---
      { id: 'frostbrand', name: 'Frostbrand', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '⚔️❄️', prerequisites: { type: 'AND', skills: ['quick_strike', 'ice_shard'] }, fusionType: 'sword_ice' },
      { id: 'glacial_riposte', name: 'Glacial Riposte', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and counter with a freezing slash, has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🛡️❄️', prerequisites: { type: 'AND', skills: ['sword_mastery', 'ice_wall'] }, fusionType: 'sword_ice' },
      { id: 'winters_fury', name: "Winter's Fury", tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Unleash a storm of ice, dealing 3d6 Ice Damage to all nearby enemies and has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frostbrand', 'glacial_riposte'] }, fusionType: 'sword_ice' },
      // --- LIGHTNING ---
      { id: 'storm_blade', name: 'Storm Blade', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '⚔️⚡', prerequisites: { type: 'AND', skills: ['quick_strike', 'spark'] }, fusionType: 'sword_lightning' },
      { id: 'thunder_parry', name: 'Thunder Parry', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and release a thunderclap, dealing 2d6 Lightning Damage to the attacker and nearby enemies. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '🛡️⚡', prerequisites: { type: 'AND', skills: ['sword_mastery', 'thunder_clap'] }, fusionType: 'sword_lightning' },
      { id: 'lightning_surge', name: 'Lightning Surge', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Dash through enemies in a line, dealing 3d6 Lightning Damage. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27) to each target.', icon: '🌩️⚡', prerequisites: { type: 'AND', skills: ['storm_blade', 'thunder_parry'] }, fusionType: 'sword_lightning' },
      // --- EARTH ---
      { id: 'stonecutter', name: 'Stonecutter', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Sword attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '⚔️🪨', prerequisites: { type: 'AND', skills: ['quick_strike', 'stone_throw'] }, fusionType: 'sword_earth' },
      { id: 'earthen_guard', name: 'Earthen Guard', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and create a stone barrier, gaining Enhanced (status-effects.js lines 90-100) for 2 turns', icon: '🛡️🪨', prerequisites: { type: 'AND', skills: ['sword_mastery', 'stone_wall'] }, fusionType: 'sword_earth' },
      { id: 'quake_slash', name: 'Quake Slash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Slam the ground, sending a shockwave that deals 3d6 Earth Damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🪨', prerequisites: { type: 'AND', skills: ['stonecutter', 'earthen_guard'] }, fusionType: 'sword_earth' },
      // --- WIND ---
      { id: 'gale_blade', name: 'Gale Blade', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Sword attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '⚔️💨', prerequisites: { type: 'AND', skills: ['quick_strike', 'gust'] }, fusionType: 'sword_wind' },
      { id: 'cyclone_parry', name: 'Cyclone Parry', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and create a swirling wind barrier, gaining Enhanced Mobility (status-effects.js lines 130-140) for 1 turn', icon: '🛡️💨', prerequisites: { type: 'AND', skills: ['sword_mastery', 'wind_barrier'] }, fusionType: 'sword_wind' },
      { id: 'tempest_dance', name: 'Tempest Dance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Move through enemies in a whirlwind, dealing 3d6 Wind Damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['gale_blade', 'cyclone_parry'] }, fusionType: 'sword_wind' },
      // --- WATER ---
      { id: 'tidecutter', name: 'Tidecutter', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Sword attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '⚔️💧', prerequisites: { type: 'AND', skills: ['quick_strike', 'water_splash'] }, fusionType: 'sword_water' },
      { id: 'aqua_parry', name: 'Aqua Parry', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and create a wave, healing self for 1d6 HP and pushing attacker back (no status effect)', icon: '🛡️💧', prerequisites: { type: 'AND', skills: ['sword_mastery', 'water_shield'] }, fusionType: 'sword_water' },
      { id: 'maelstrom_slash', name: 'Maelstrom Slash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Unleash a spinning slash that deals 3d6 Water Damage (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['tidecutter', 'aqua_parry'] }, fusionType: 'sword_water' },
      // --- DARKNESS ---
      { id: 'shadow_edge', name: 'Shadow Edge', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '⚔️🌑', prerequisites: { type: 'AND', skills: ['quick_strike', 'shadow_bolt'] }, fusionType: 'sword_darkness' },
      { id: 'night_parry', name: 'Night Parry', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and become Stealth Mastery (status-effects.js lines 150-160) until your next turn', icon: '🛡️🌑', prerequisites: { type: 'AND', skills: ['sword_mastery', 'shadow_armor'] }, fusionType: 'sword_darkness' },
      { id: 'umbral_onslaught', name: 'Umbral Onslaught', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Strike all enemies in darkness for 3d6 Darkness Damage and has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🗡️', prerequisites: { type: 'AND', skills: ['shadow_edge', 'night_parry'] }, fusionType: 'sword_darkness' },
      // --- LIGHT ---
      { id: 'radiant_blade', name: 'Radiant Blade', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '⚔️☀️', prerequisites: { type: 'AND', skills: ['quick_strike', 'light_ray'] }, fusionType: 'sword_light' },
      { id: 'solar_parry', name: 'Solar Parry', tier: 3, cost: 23, staminaCost: 5, desc: 'Reaction: Parry and unleash a flash of light, healing allies for 1d6 HP (no status effect)', icon: '🛡️☀️', prerequisites: { type: 'AND', skills: ['sword_mastery', 'light_shield'] }, fusionType: 'sword_light' },
      { id: 'judgment_slash', name: 'Judgment Slash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Deliver a powerful slash that deals 3d6 Light Damage and removes all debuffs from allies (no status effect)', icon: '⚖️☀️', prerequisites: { type: 'AND', skills: ['radiant_blade', 'solar_parry'] }, fusionType: 'sword_light' },

      // --- DAGGER + MAGIC ---
      // Fire
      { id: 'flame_dagger', name: 'Flame Dagger', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🗡️🔥', prerequisites: { type: 'AND', skills: ['dual_wield', 'fireball'] }, fusionType: 'dagger_fire' },
      { id: 'inferno_strike', name: 'Inferno Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A blazing strike dealing 2d6 Fire Damage. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'fire_wall'] }, fusionType: 'dagger_fire' },
      { id: 'phoenix_dance', name: 'Phoenix Dance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: A series of fiery strikes hitting all adjacent enemies for 3d6 Fire Damage. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🦅🔥', prerequisites: { type: 'AND', skills: ['flame_dagger', 'inferno_strike'] }, fusionType: 'dagger_fire' },
      // Ice
      { id: 'frost_dagger', name: 'Frost Dagger', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🗡️❄️', prerequisites: { type: 'AND', skills: ['dual_wield', 'ice_shard'] }, fusionType: 'dagger_ice' },
      { id: 'freezing_strike', name: 'Freezing Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A frigid strike dealing 2d6 Ice Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'ice_wall'] }, fusionType: 'dagger_ice' },
      { id: 'arctic_barrage', name: 'Arctic Barrage', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Unleash a flurry of icy strikes dealing 3d6 Ice Damage to a single target. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_dagger', 'freezing_strike'] }, fusionType: 'dagger_ice' },
      // Lightning
      { id: 'storm_dagger', name: 'Storm Dagger', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🗡️⚡', prerequisites: { type: 'AND', skills: ['dual_wield', 'spark'] }, fusionType: 'dagger_lightning' },
      { id: 'thunder_strike', name: 'Thunder Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A lightning-fast strike dealing 2d6 Lightning Damage. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'thunder_clap'] }, fusionType: 'dagger_lightning' },
      { id: 'storm_flurry', name: 'Storm Flurry', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Chain lightning enhances your daggers, dealing 3d6 Lightning Damage to multiple targets. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_dagger', 'thunder_strike'] }, fusionType: 'dagger_lightning' },
      // Earth
      { id: 'stone_dagger', name: 'Stone Dagger', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Dagger attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '🗡️🪨', prerequisites: { type: 'AND', skills: ['dual_wield', 'stone_throw'] }, fusionType: 'dagger_earth' },
      { id: 'crystal_strike', name: 'Crystal Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A crystalline strike dealing 2d6 Earth Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '💎🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'stone_wall'] }, fusionType: 'dagger_earth' },
      { id: 'earthen_assault', name: 'Earthen Assault', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your daggers become deadly crystals, dealing 3d6 Earth Damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🪨', prerequisites: { type: 'AND', skills: ['stone_dagger', 'crystal_strike'] }, fusionType: 'dagger_earth' },
      // Wind
      { id: 'wind_dagger', name: 'Wind Dagger', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Dagger attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '🗡️💨', prerequisites: { type: 'AND', skills: ['dual_wield', 'gust'] }, fusionType: 'dagger_wind' },
      { id: 'zephyr_strike', name: 'Zephyr Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A wind-enhanced strike dealing 2d6 Wind Damage and increases your movement speed.', icon: '💨🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'wind_barrier'] }, fusionType: 'dagger_wind' },
      { id: 'hurricane_dance', name: 'Hurricane Dance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Become a whirlwind of blades, dealing 3d6 Wind Damage to all nearby enemies. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_dagger', 'zephyr_strike'] }, fusionType: 'dagger_wind' },
      // Water
      { id: 'water_dagger', name: 'Water Dagger', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Dagger attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '🗡️💧', prerequisites: { type: 'AND', skills: ['dual_wield', 'water_splash'] }, fusionType: 'dagger_water' },
      { id: 'tide_strike', name: 'Tide Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A flowing strike dealing 2d6 Water Damage and healing you for half the damage dealt (no status effect)', icon: '🌊🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'water_shield'] }, fusionType: 'dagger_water' },
      { id: 'tsunami_dance', name: 'Tsunami Dance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your daggers flow like water, dealing 3d6 Water Damage to multiple targets (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_dagger', 'tide_strike'] }, fusionType: 'dagger_water' },
      // Shadow
      { id: 'shadow_dagger', name: 'Shadow Dagger', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🗡️🌑', prerequisites: { type: 'AND', skills: ['dual_wield', 'shadow_bolt'] }, fusionType: 'dagger_darkness' },
      { id: 'void_strike', name: 'Void Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Strike from the shadows for 2d6 Darkness Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'shadow_armor'] }, fusionType: 'dagger_darkness' },
      { id: 'night_dance', name: 'Night Dance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Become one with the shadows, dealing 3d6 Darkness Damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_dagger', 'void_strike'] }, fusionType: 'dagger_darkness' },
      // Light
      { id: 'light_dagger', name: 'Light Dagger', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🗡️☀️', prerequisites: { type: 'AND', skills: ['dual_wield', 'light_ray'] }, fusionType: 'dagger_light' },
      { id: 'radiant_strike', name: 'Radiant Strike', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A holy strike dealing 2d6 Light Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '✨🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'light_shield'] }, fusionType: 'dagger_light' },
      { id: 'dawn_dance', name: 'Dawn Dance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your daggers blaze with holy light, dealing 3d6 Light Damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_dagger', 'radiant_strike'] }, fusionType: 'dagger_light' },

      // --- POLEARM + MAGIC ---
      // Fire
      { id: 'flame_glaive', name: 'Flame Glaive', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🔱🔥', prerequisites: { type: 'AND', skills: ['thrust_attack', 'fireball'] }, fusionType: 'polearm_fire' },
      { id: 'blazing_sweep', name: 'Blazing Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A burning arc attack dealing 2d6 Fire Damage to all enemies in front. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'fire_wall'] }, fusionType: 'polearm_fire' },
      { id: 'solar_lance', name: 'Solar Lance', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Channel flames into a powerful thrust, dealing 3d6 Fire Damage in a line. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '☀️🔥', prerequisites: { type: 'AND', skills: ['flame_glaive', 'blazing_sweep'] }, fusionType: 'polearm_fire' },
      // Ice
      { id: 'frost_halberd', name: 'Frost Halberd', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🔱❄️', prerequisites: { type: 'AND', skills: ['thrust_attack', 'ice_shard'] }, fusionType: 'polearm_ice' },
      { id: 'glacier_sweep', name: 'Glacier Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A freezing sweep dealing 2d6 Ice Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'ice_wall'] }, fusionType: 'polearm_ice' },
      { id: 'winter_vortex', name: 'Winter Vortex', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Spin your polearm creating an icy vortex, dealing 3d6 Ice Damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_halberd', 'glacier_sweep'] }, fusionType: 'polearm_ice' },
      // Lightning
      { id: 'storm_glaive', name: 'Storm Glaive', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🔱⚡', prerequisites: { type: 'AND', skills: ['thrust_attack', 'spark'] }, fusionType: 'polearm_lightning' },
      { id: 'thunder_sweep', name: 'Thunder Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A charged sweep dealing 2d6 Lightning Damage. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'thunder_clap'] }, fusionType: 'polearm_lightning' },
      { id: 'lightning_spiral', name: 'Lightning Spiral', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Spin your polearm creating a spiral of lightning, dealing 3d6 Lightning Damage. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_glaive', 'thunder_sweep'] }, fusionType: 'polearm_lightning' },
      // Earth
      { id: 'stone_halberd', name: 'Stone Halberd', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Polearm attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '🔱🪨', prerequisites: { type: 'AND', skills: ['thrust_attack', 'stone_throw'] }, fusionType: 'polearm_earth' },
      { id: 'earthen_sweep', name: 'Earthen Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A rocky sweep dealing 2d6 Earth Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'stone_wall'] }, fusionType: 'polearm_earth' },
      { id: 'tectonic_spiral', name: 'Tectonic Spiral', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a spiral of stone spikes, dealing 3d6 Earth Damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🪨', prerequisites: { type: 'AND', skills: ['stone_halberd', 'earthen_sweep'] }, fusionType: 'polearm_earth' },
      // Wind
      { id: 'wind_glaive', name: 'Wind Glaive', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Polearm attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '🔱💨', prerequisites: { type: 'AND', skills: ['thrust_attack', 'gust'] }, fusionType: 'polearm_wind' },
      { id: 'cyclone_sweep', name: 'Cyclone Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A wind-empowered sweep dealing 2d6 Wind Damage and increasing your movement speed.', icon: '💨🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'wind_barrier'] }, fusionType: 'polearm_wind' },
      { id: 'tempest_spiral', name: 'Tempest Spiral', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a massive whirlwind, dealing 3d6 Wind Damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_glaive', 'cyclone_sweep'] }, fusionType: 'polearm_wind' },
      // Water
      { id: 'water_glaive', name: 'Water Glaive', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Polearm attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '🔱💧', prerequisites: { type: 'AND', skills: ['thrust_attack', 'water_splash'] }, fusionType: 'polearm_water' },
      { id: 'wave_sweep', name: 'Wave Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A flowing sweep dealing 2d6 Water Damage and healing you for half the damage dealt (no status effect)', icon: '🌊🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'water_shield'] }, fusionType: 'polearm_water' },
      { id: 'maelstrom_spiral', name: 'Maelstrom Spiral', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a spiral of water, dealing 3d6 Water Damage to all nearby enemies (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_glaive', 'wave_sweep'] }, fusionType: 'polearm_water' },
      // Shadow
      { id: 'shadow_glaive', name: 'Shadow Glaive', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🔱🌑', prerequisites: { type: 'AND', skills: ['thrust_attack', 'shadow_bolt'] }, fusionType: 'polearm_darkness' },
      { id: 'void_sweep', name: 'Void Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A shadowy sweep dealing 2d6 Darkness Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'shadow_armor'] }, fusionType: 'polearm_darkness' },
      { id: 'eclipse_spiral', name: 'Eclipse Spiral', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a spiral of darkness, dealing 3d6 Darkness Damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_glaive', 'void_sweep'] }, fusionType: 'polearm_darkness' },
      // Light
      { id: 'light_glaive', name: 'Light Glaive', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🔱☀️', prerequisites: { type: 'AND', skills: ['thrust_attack', 'light_ray'] }, fusionType: 'polearm_light' },
      { id: 'radiant_sweep', name: 'Radiant Sweep', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A holy sweep dealing 2d6 Light Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '✨🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'light_shield'] }, fusionType: 'polearm_light' },
      { id: 'solar_spiral', name: 'Solar Spiral', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a spiral of holy light, dealing 3d6 Light Damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_glaive', 'radiant_sweep'] }, fusionType: 'polearm_light' },

      // --- HAMMER + MAGIC ---
      // Fire
      { id: 'flame_hammer', name: 'Flame Hammer', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🔨🔥', prerequisites: { type: 'AND', skills: ['armor_crusher', 'fireball'] }, fusionType: 'hammer_fire' },
      { id: 'magma_smash', name: 'Magma Smash', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A burning hammer strike that deals 2d6 Fire Damage and creates a pool of magma. Enemies in the area take 1d4 Fire Damage per turn. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌋🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'fire_wall'] }, fusionType: 'hammer_fire' },
      { id: 'volcanic_eruption', name: 'Volcanic Eruption', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: A devastating hammer slam that creates an explosion of fire, dealing 3d6 Fire Damage in a large area. Has a 75% chance to apply both Burn and Stagger (status-effects.js lines 4-14, 34-44)', icon: '🌋💥', prerequisites: { type: 'AND', skills: ['flame_hammer', 'magma_smash'] }, fusionType: 'hammer_fire' },
      // Ice
      { id: 'frost_hammer', name: 'Frost Hammer', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🔨❄️', prerequisites: { type: 'AND', skills: ['armor_crusher', 'ice_shard'] }, fusionType: 'hammer_ice' },
      { id: 'glacial_pound', name: 'Glacial Pound', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A freezing hammer strike that deals 2d6 Ice Damage and creates a field of ice. Enemies in the area become Slowed and have a 40% chance to be Immobilized (status-effects.js lines 54-64)', icon: '❄️🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'ice_wall'] }, fusionType: 'hammer_ice' },
      { id: 'permafrost_crash', name: 'Permafrost Crash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: A massive hammer strike that creates an explosion of ice, dealing 3d6 Ice Damage in a large area. Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '❄️💥', prerequisites: { type: 'AND', skills: ['frost_hammer', 'glacial_pound'] }, fusionType: 'hammer_ice' },
      // Lightning
      { id: 'storm_hammer', name: 'Storm Hammer', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🔨⚡', prerequisites: { type: 'AND', skills: ['armor_crusher', 'spark'] }, fusionType: 'hammer_lightning' },
      { id: 'thunder_slam', name: 'Thunder Slam', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A thunder-charged strike dealing 2d6 Lightning Damage in an area. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'thunder_clap'] }, fusionType: 'hammer_lightning' },
      { id: 'storm_surge', name: 'Storm Surge', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Channel lightning through your hammer, dealing 3d6 Lightning Damage to all nearby enemies. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_hammer', 'thunder_slam'] }, fusionType: 'hammer_lightning' },
      // Earth
      { id: 'earthshaker_hammer', name: 'Earthshaker Hammer', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Hammer attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '🔨🪨', prerequisites: { type: 'AND', skills: ['armor_crusher', 'stone_throw'] }, fusionType: 'hammer_earth' },
      { id: 'tectonic_slam', name: 'Tectonic Slam', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A ground-shattering strike dealing 2d6 Earth Damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'stone_wall'] }, fusionType: 'hammer_earth' },
      { id: 'mountain_crash', name: 'Mountain Crash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Channel the power of the earth into a devastating strike, dealing 3d6 Earth Damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️🪨', prerequisites: { type: 'AND', skills: ['earthshaker_hammer', 'tectonic_slam'] }, fusionType: 'hammer_earth' },
      // Wind
      { id: 'gale_hammer', name: 'Gale Hammer', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Hammer attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '🔨💨', prerequisites: { type: 'AND', skills: ['armor_crusher', 'gust'] }, fusionType: 'hammer_wind' },
      { id: 'cyclone_slam', name: 'Cyclone Slam', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A wind-empowered strike dealing 2d6 Wind Damage. Has a 40% chance to apply Weakened (status-effects.js lines 47-57)', icon: '💨🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'wind_barrier'] }, fusionType: 'hammer_wind' },
      { id: 'tempest_crash', name: 'Tempest Crash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a massive whirlwind with your hammer, dealing 3d6 Wind Damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['gale_hammer', 'cyclone_slam'] }, fusionType: 'hammer_wind' },
      // Water
      { id: 'tide_hammer', name: 'Tide Hammer', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Hammer attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '🔨💧', prerequisites: { type: 'AND', skills: ['armor_crusher', 'water_splash'] }, fusionType: 'hammer_water' },
      { id: 'wave_slam', name: 'Wave Slam', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A water-empowered strike dealing 2d6 Water Damage and healing you for half the damage dealt (no status effect)', icon: '🌊🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'water_shield'] }, fusionType: 'hammer_water' },
      { id: 'tsunami_crash', name: 'Tsunami Crash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Create a massive wave with your hammer, dealing 3d6 Water Damage to all nearby enemies (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['tide_hammer', 'wave_slam'] }, fusionType: 'hammer_water' },
      // Shadow
      { id: 'shadow_hammer', name: 'Shadow Hammer', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🔨🌑', prerequisites: { type: 'AND', skills: ['armor_crusher', 'shadow_bolt'] }, fusionType: 'hammer_darkness' },
      { id: 'void_slam', name: 'Void Slam', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A shadow-infused strike dealing 2d6 Darkness Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'shadow_armor'] }, fusionType: 'hammer_darkness' },
      { id: 'eclipse_crash', name: 'Eclipse Crash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Channel dark energy into a devastating strike, dealing 3d6 Darkness Damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_hammer', 'void_slam'] }, fusionType: 'hammer_darkness' },
      // Light
      { id: 'radiant_hammer', name: 'Radiant Hammer', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🔨☀️', prerequisites: { type: 'AND', skills: ['armor_crusher', 'light_ray'] }, fusionType: 'hammer_light' },
      { id: 'solar_slam', name: 'Solar Slam', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A light-infused strike dealing 2d6 Light Damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'light_shield'] }, fusionType: 'hammer_light' },
      { id: 'divine_crash', name: 'Divine Crash', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Channel holy energy into a powerful strike, dealing 3d6 Light Damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['radiant_hammer', 'solar_slam'] }, fusionType: 'hammer_light' },

      // --- AXE + MAGIC ---
      // Fire
      { id: 'flame_axe', name: 'Flame Axe', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🪓🔥', prerequisites: { type: 'AND', skills: ['cleave', 'fireball'] }, fusionType: 'axe_fire' },
      { id: 'inferno_cleave', name: 'Inferno Cleave', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A burning cleave attack dealing 2d6 Fire Damage to all adjacent enemies. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🪓', prerequisites: { type: 'AND', skills: ['wide_cleave', 'fire_wall'] }, fusionType: 'axe_fire' },
      { id: 'meteor_strike', name: 'Meteor Strike', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: A devastating overhead strike dealing 3d6 Fire Damage in an area. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '☄️🔥', prerequisites: { type: 'AND', skills: ['flame_axe', 'inferno_cleave'] }, fusionType: 'axe_fire' },
      // Ice
      { id: 'frost_axe', name: 'Frost Axe', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🪓❄️', prerequisites: { type: 'AND', skills: ['cleave', 'ice_shard'] }, fusionType: 'axe_ice' },
      { id: 'frozen_cleave', name: 'Frozen Cleave', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: A freezing cleave attack dealing 2d6 Ice Damage to all adjacent enemies. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🪓', prerequisites: { type: 'AND', skills: ['wide_cleave', 'ice_wall'] }, fusionType: 'axe_ice' },
      { id: 'avalanche_strike', name: 'Avalanche Strike', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: A massive overhead strike dealing 3d6 Ice Damage in an area. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_axe', 'frozen_cleave'] }, fusionType: 'axe_ice' },
      // Lightning
      { id: 'storm_axe', name: 'Storm Axe', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🪓⚡', prerequisites: { type: 'AND', skills: ['cleave', 'spark'] }, fusionType: 'axe_lightning' },
      // Earth
      { id: 'stone_axe', name: 'Stone Axe', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Axe attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '🪓🪨', prerequisites: { type: 'AND', skills: ['cleave', 'stone_throw'] }, fusionType: 'axe_earth' },
      // Wind
      { id: 'wind_axe', name: 'Wind Axe', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Axe attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '🪓💨', prerequisites: { type: 'AND', skills: ['cleave', 'gust'] }, fusionType: 'axe_wind' },
      // Water
      { id: 'water_axe', name: 'Water Axe', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Axe attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '🪓💧', prerequisites: { type: 'AND', skills: ['cleave', 'water_splash'] }, fusionType: 'axe_water' },
      // Shadow
      { id: 'shadow_axe', name: 'Shadow Axe', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🪓🌑', prerequisites: { type: 'AND', skills: ['cleave', 'shadow_bolt'] }, fusionType: 'axe_darkness' },
      // Light
      { id: 'light_axe', name: 'Light Axe', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🪓☀️', prerequisites: { type: 'AND', skills: ['cleave', 'light_ray'] }, fusionType: 'axe_light' },

      // --- STAFF + MAGIC ---
      // Fire
      { id: 'flame_staff', name: 'Flame Staff', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🪄🔥', prerequisites: { type: 'AND', skills: ['spell_power', 'fireball'] }, fusionType: 'staff_fire' },
      { id: 'inferno_channel', name: 'Inferno Channel', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel flames through your staff, dealing 2d6 Fire Damage in a cone. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'fire_wall'] }, fusionType: 'staff_fire' },
      { id: 'phoenix_staff', name: 'Phoenix Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Transform your staff into pure flame, dealing 3d6 Fire Damage in an area. Has a 75% chance to apply both Burn and Enhanced (status-effects.js lines 4-14, 90-100)', icon: '🦅🔥', prerequisites: { type: 'AND', skills: ['flame_staff', 'inferno_channel'] }, fusionType: 'staff_fire' },
      // Ice
      { id: 'frost_staff', name: 'Frost Staff', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🪄❄️', prerequisites: { type: 'AND', skills: ['spell_power', 'ice_shard'] }, fusionType: 'staff_ice' },
      { id: 'glacial_focus', name: 'Glacial Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Focus ice magic through your staff, dealing 2d6 Ice Damage in a cone. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'ice_wall'] }, fusionType: 'staff_ice' },
      { id: 'winter_staff', name: 'Winter Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure ice, dealing 3d6 Ice Damage in an area. Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_staff', 'glacial_focus'] }, fusionType: 'staff_ice' },
      // Lightning
      { id: 'storm_staff', name: 'Storm Staff', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🪄⚡', prerequisites: { type: 'AND', skills: ['spell_power', 'spark'] }, fusionType: 'staff_lightning' },
      { id: 'thunder_focus', name: 'Thunder Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel lightning through your staff, dealing 2d6 Lightning Damage in a cone. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'thunder_clap'] }, fusionType: 'staff_lightning' },
      { id: 'tempest_staff', name: 'Tempest Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure lightning, dealing 3d6 Lightning Damage in an area. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_staff', 'thunder_focus'] }, fusionType: 'staff_lightning' },
      // Earth
      { id: 'stone_staff', name: 'Stone Staff', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Staff attacks deal +1d6 Earth Damage and ignore 2 points of armor.', icon: '🪄🪨', prerequisites: { type: 'AND', skills: ['spell_power', 'stone_throw'] }, fusionType: 'staff_earth' },
      { id: 'crystal_focus', name: 'Crystal Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel earth magic through your staff, dealing 2d6 Earth Damage in a cone. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'stone_wall'] }, fusionType: 'staff_earth' },
      { id: 'mountain_staff', name: 'Mountain Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure stone, dealing 3d6 Earth Damage in an area. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️🪨', prerequisites: { type: 'AND', skills: ['stone_staff', 'crystal_focus'] }, fusionType: 'staff_earth' },
      // Wind
      { id: 'wind_staff', name: 'Wind Staff', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Staff attacks deal +1d6 Wind Damage and push enemies back 5ft.', icon: '🪄💨', prerequisites: { type: 'AND', skills: ['spell_power', 'gust'] }, fusionType: 'staff_wind' },
      { id: 'gale_focus', name: 'Gale Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel wind magic through your staff, dealing 2d6 Wind Damage in a cone. Has a 40% chance to apply Weakened (status-effects.js lines 47-57)', icon: '💨🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'wind_barrier'] }, fusionType: 'staff_wind' },
      { id: 'hurricane_staff', name: 'Hurricane Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure wind, dealing 3d6 Wind Damage in an area. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_staff', 'gale_focus'] }, fusionType: 'staff_wind' },
      // Water
      { id: 'water_staff', name: 'Water Staff', tier: 2, cost: 15, staminaCost: 3, desc: 'Passive: Staff attacks deal +1d6 Water Damage and reduce enemy Physical Defence by 1 for 2 turns (no status effect)', icon: '🪄💧', prerequisites: { type: 'AND', skills: ['spell_power', 'water_splash'] }, fusionType: 'staff_water' },
      { id: 'tide_focus', name: 'Tide Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel water magic through your staff, dealing 2d6 Water Damage in a cone and healing you for half the damage dealt (no status effect)', icon: '💧🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'water_shield'] }, fusionType: 'staff_water' },
      { id: 'tsunami_staff', name: 'Tsunami Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure water, dealing 3d6 Water Damage in an area (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_staff', 'tide_focus'] }, fusionType: 'staff_water' },
      // Shadow
      { id: 'shadow_staff', name: 'Shadow Staff', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🪄🌑', prerequisites: { type: 'AND', skills: ['spell_power', 'shadow_bolt'] }, fusionType: 'staff_darkness' },
      { id: 'void_focus', name: 'Void Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel shadow magic through your staff, dealing 2d6 Darkness Damage in a cone. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'shadow_armor'] }, fusionType: 'staff_darkness' },
      { id: 'eclipse_staff', name: 'Eclipse Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure darkness, dealing 3d6 Darkness Damage in an area. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_staff', 'void_focus'] }, fusionType: 'staff_darkness' },
      // Light
      { id: 'light_staff', name: 'Light Staff', tier: 2, cost: 15, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🪄☀️', prerequisites: { type: 'AND', skills: ['spell_power', 'light_ray'] }, fusionType: 'staff_light' },
      { id: 'radiant_focus', name: 'Radiant Focus', tier: 3, cost: 23, staminaCost: 5, desc: 'Active: Channel holy magic through your staff, dealing 2d6 Light Damage in a cone. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'light_shield'] }, fusionType: 'staff_light' },
      { id: 'solar_staff', name: 'Solar Staff', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Your staff becomes pure light, dealing 3d6 Light Damage in an area and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_staff', 'radiant_focus'] }, fusionType: 'staff_light' },
    ],

    pure_magic: [
      // Fire + Ice combinations
      {
        id: 'steam_burst', name: 'Steam Burst', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a burst of superheated steam, dealing 2d4 fire or Ice Damage (whichever the target is weak to) and has a 20% chance to apply both Burn and Weakened (status-effects.js lines 4-14, 47-57)', icon: '🔥❄️',
        prerequisites: { type: 'AND', skills: ['fireball', 'ice_shard'] }, fusionType: 'fire_ice'
      },
      {
        id: 'thermal_shock', name: 'Thermal Shock', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Rapid temperature change deals 2d6 fire or Ice Damage (whichever the target is weak to) to an area. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌡️💥',
        prerequisites: { type: 'AND', skills: ['steam_burst', 'ice_wall'] }, fusionType: 'fire_ice'
      },
      {
        id: 'conflicting_elements', name: 'Conflicting Elements', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Channel opposing forces to deal 3d6 fire or Ice Damage (whichever the target is weak to) in an expanding ring. Has a 75% chance to apply both Burn and Immobilized (status-effects.js lines 4-14, 54-64)', icon: '☯️❄️',
        prerequisites: { type: 'AND', skills: ['thermal_shock', 'inferno'] }, fusionType: 'fire_ice'
      },

      // Fire + Lightning combinations
      {
        id: 'plasma_bolt', name: 'Plasma Bolt', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Fire an energized bolt dealing 2d4 fire or Lightning Damage (whichever the target is weak to). Has a 20% chance to apply both Burn and Incapacitated (status-effects.js lines 4-14, 17-27)', icon: '⚡🔥',
        prerequisites: { type: 'AND', skills: ['fireball', 'spark'] }, fusionType: 'fire_lightning'
      },
      {
        id: 'storm_of_cinders', name: 'Storm of Cinders', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a swirling storm of electrified flames dealing 2d6 fire or Lightning Damage (whichever the target is weak to) to an area. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌩️✨',
        prerequisites: { type: 'AND', skills: ['plasma_bolt', 'thunder_clap'] }, fusionType: 'fire_lightning'
      },
      {
        id: 'fusion_strike', name: 'Fusion Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Channel pure energy to strike all enemies for 3d6 fire or Lightning Damage (whichever each target is weak to). Has a 75% chance to apply both Burn and Incapacitated (status-effects.js lines 4-14, 17-27)', icon: '⚡💥',
        prerequisites: { type: 'AND', skills: ['storm_of_cinders', 'chain_lightning'] }, fusionType: 'fire_lightning'
      },

      // Fire + Earth combinations
      {
        id: 'magma_surge', name: 'Magma Surge', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a wave of molten rock dealing 2d4 fire or Earth Damage (whichever the target is weak to) and ignoring 2 armor. Has a 20% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌋🔥',
        prerequisites: { type: 'AND', skills: ['fireball', 'stone_throw'] }, fusionType: 'fire_earth'
      },
      {
        id: 'volcanic_rupture', name: 'Volcanic Rupture', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Rupture the ground with molten fury, dealing 2d6 fire or Earth Damage (whichever the target is weak to) in a line. Has a 40% chance to apply both Burn and Immobilized (status-effects.js lines 4-14, 54-64)', icon: '🌋💥',
        prerequisites: { type: 'AND', skills: ['magma_surge', 'stone_wall'] }, fusionType: 'fire_earth'
      },
      {
        id: 'tectonic_fury', name: 'Tectonic Fury', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Unleash the earth\'s fury, dealing 3d6 fire or Earth Damage (whichever the target is weak to) in an eruption. Has a 75% chance to apply both Burn and Immobilized (status-effects.js lines 4-14, 54-64)', icon: '🌋⚔️',
        prerequisites: { type: 'AND', skills: ['volcanic_rupture', 'earthquake'] }, fusionType: 'fire_earth'
      },

      // Ice + Lightning combinations
      {
        id: 'static_freeze', name: 'Static Freeze', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a field of electrically charged ice dealing 2d4 Ice Damage or Lightning Damage (whichever the target is weak to). Has a 20% chance to apply both Weakened and Incapacitated (status-effects.js lines 47-57, 17-27)', icon: '❄️⚡',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'spark'] }, fusionType: 'ice_lightning'
      },
      {
        id: 'crystalline_surge', name: 'Crystalline Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Lightning arcs between ice crystals, dealing 2d6 Ice Damage or Lightning Damage (whichever the target is weak to) in a chain. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '💎⚡',
        prerequisites: { type: 'AND', skills: ['static_freeze', 'thunder_clap'] }, fusionType: 'ice_lightning'
      },
      {
        id: 'arctic_storm', name: 'Arctic Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Unleash a devastating winter storm dealing 3d6 Ice Damage or Lightning Damage (whichever each target is weak to) to all enemies. Has a 75% chance to apply both Immobilized and Incapacitated (status-effects.js lines 54-64, 17-27)', icon: '❄️🌩️',
        prerequisites: { type: 'AND', skills: ['crystalline_surge', 'blizzard'] }, fusionType: 'ice_lightning'
      },

      // Darkness + Light combinations  
      {
        id: 'twilight_balance', name: 'Twilight Balance', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Channel opposing forces to deal 2d4 darkness or Light Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; both fear and charm variants)', icon: '🌓✨',
        prerequisites: { type: 'AND', skills: ['shadow_bolt', 'light_ray'] }, fusionType: 'darkness_light'
      },
      {
        id: 'duality_surge', name: 'Duality Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a field of opposing energies dealing 2d6 darkness or Light Damage (whichever the target is weak to). Has a 40% chance to apply Enhanced (status-effects.js lines 90-100)', icon: '☯️✨',
        prerequisites: { type: 'AND', skills: ['twilight_balance', 'shadow_armor'] }, fusionType: 'darkness_light'
      },
      {
        id: 'eclipse', name: 'Eclipse', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Perfect balance of light and dark dealing 3d6 darkness or Light Damage (whichever each target is weak to) to all enemies. Applies Enhanced to allies and has a 75% chance to apply Mind Controlled to enemies (status-effects.js lines 90-100, 67-77)', icon: '🌑☀️',
        prerequisites: { type: 'AND', skills: ['duality_surge', 'dawn_strike'] }, fusionType: 'darkness_light'
      },

      // Earth + Wind combinations
      {
        id: 'sandstorm', name: 'Sandstorm', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a swirling cloud of debris dealing 2d4 earth or Wind Damage (whichever the target is weak to). Has a 20% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️🪨',
        prerequisites: { type: 'AND', skills: ['stone_throw', 'gust'] }, fusionType: 'earth_wind'
      },
      {
        id: 'desert_winds', name: 'Desert Winds', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Launch a barrage of wind-propelled stones dealing 2d6 earth or Wind Damage (whichever the target is weak to). Has a 40% chance to apply both Weakened and Immobilized (status-effects.js lines 47-57, 54-64)', icon: '🏜️💨',
        prerequisites: { type: 'AND', skills: ['sandstorm', 'wind_barrier'] }, fusionType: 'earth_wind'
      },
      {
        id: 'terra_tempest', name: 'Terra Tempest', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Create a massive dust storm dealing 3d6 earth or Wind Damage (whichever each target is weak to) in a large area. Has a 75% chance to apply both Weakened and Immobilized (status-effects.js lines 47-57, 54-64)', icon: '🌪️🗿',
        prerequisites: { type: 'AND', skills: ['desert_winds', 'earthquake'] }, fusionType: 'earth_wind'
      },

      // Wind + Water combinations
      {
        id: 'typhoon_strike', name: 'Typhoon Strike', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Launch a spiraling water jet dealing 2d4 Wind Damage or Water Damage (whichever the target is weak to). Pushes target back 5ft', icon: '🌊💨',
        prerequisites: { type: 'AND', skills: ['gust', 'water_splash'] }, fusionType: 'wind_water'
      },
      {
        id: 'monsoon', name: 'Monsoon', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a storm of wind and rain dealing 2d6 Wind Damage or Water Damage (whichever the target is weak to) in an area. Reduces enemy accuracy by 2', icon: '🌧️🌪️',
        prerequisites: { type: 'AND', skills: ['typhoon_strike', 'water_shield'] }, fusionType: 'wind_water'
      },
      {
        id: 'hurricane', name: 'Hurricane', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Summon a devastating storm dealing 3d6 Wind Damage or Water Damage (whichever each target is weak to) to all enemies. Pushes enemies to storm\'s center', icon: '🌀💫',
        prerequisites: { type: 'AND', skills: ['monsoon', 'tsunami'] }, fusionType: 'wind_water'
      },

      // Water + Earth combinations
      {
        id: 'mud_slash', name: 'Mud Slash', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Launch sticky mud dealing 2d4 water or Earth Damage (whichever the target is weak to). Has a 20% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '💧🪨',
        prerequisites: { type: 'AND', skills: ['water_splash', 'stone_throw'] }, fusionType: 'water_earth'
      },
      {
        id: 'quicksand', name: 'Quicksand', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create unstable ground dealing 2d6 water or Earth Damage (whichever the target is weak to). Has a 40% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🏖️💫',
        prerequisites: { type: 'AND', skills: ['mud_slash', 'stone_wall'] }, fusionType: 'water_earth'
      },
      {
        id: 'tidal_wave', name: 'Tidal Wave', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Summon a wave of water and debris dealing 3d6 water or Earth Damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🌊🪨',
        prerequisites: { type: 'AND', skills: ['quicksand', 'tsunami'] }, fusionType: 'water_earth'
      },

      // Fire + Water combinations
      {
        id: 'scalding_jet', name: 'Scalding Jet', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Launch boiling water dealing 2d4 fire or Water Damage (whichever the target is weak to). Has a 20% chance to apply Burn (status-effects.js lines 4-14)', icon: '💧🔥',
        prerequisites: { type: 'AND', skills: ['fireball', 'water_splash'] }, fusionType: 'fire_water'
      },
      {
        id: 'steam_cloud', name: 'Steam Cloud', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a cloud of scalding steam dealing 2d6 fire or Water Damage (whichever the target is weak to) in an area. Has a 40% chance to apply both Burn and Weakened (status-effects.js lines 4-14, 47-57)', icon: '💨🔥',
        prerequisites: { type: 'AND', skills: ['scalding_jet', 'water_shield'] }, fusionType: 'fire_water'
      },
      {
        id: 'geyser_burst', name: 'Geyser Burst', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Erupt super-heated water dealing 3d6 fire or Water Damage (whichever each target is weak to). Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '⛲🔥',
        prerequisites: { type: 'AND', skills: ['steam_cloud', 'inferno'] }, fusionType: 'fire_water'
      },

      // Wind + Darkness combinations
      {
        id: 'shadow_wind', name: 'Shadow Wind', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Launch dark winds dealing 2d4 Wind Damage or Darkness Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌫️🌑',
        prerequisites: { type: 'AND', skills: ['gust', 'shadow_bolt'] }, fusionType: 'wind_darkness'
      },
      {
        id: 'void_tempest', name: 'Void Tempest', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a storm of shadowy energy dealing 2d6 Wind Damage or Darkness Damage (whichever the target is weak to). Has a 40% chance to apply both Mind Controlled and Weakened (status-effects.js lines 67-77, 47-57)', icon: '🌪️🌑',
        prerequisites: { type: 'AND', skills: ['shadow_wind', 'shadow_armor'] }, fusionType: 'wind_darkness'
      },
      {
        id: 'dark_cyclone', name: 'Dark Cyclone', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Summon a vortex of darkness dealing 3d6 Wind Damage or Darkness Damage (whichever each target is weak to). Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌀🌑',
        prerequisites: { type: 'AND', skills: ['void_tempest', 'hurricane'] }, fusionType: 'wind_darkness'
      },

      // Wind + Light combinations
      {
        id: 'prismatic_breeze', name: 'Prismatic Breeze', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create shimmering winds dealing 2d4 Wind Damage or Light Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '🌈💨',
        prerequisites: { type: 'AND', skills: ['gust', 'light_ray'] }, fusionType: 'wind_light'
      },
      {
        id: 'rainbow_gale', name: 'Rainbow Gale', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Summon colorful winds dealing 2d6 Wind Damage or Light Damage (whichever the target is weak to). Has a 40% chance to apply Enhanced (status-effects.js lines 90-100)', icon: '🌈🌪️',
        prerequisites: { type: 'AND', skills: ['prismatic_breeze', 'light_shield'] }, fusionType: 'wind_light'
      },
      {
        id: 'aurora_storm', name: 'Aurora Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Create a magnificent storm dealing 3d6 Wind Damage or Light Damage (whichever each target is weak to). Applies Enhanced to allies and has a 75% chance to apply Mind Controlled to enemies (status-effects.js lines 90-100, 67-77)', icon: '🎆💨',
        prerequisites: { type: 'AND', skills: ['rainbow_gale', 'dawn_strike'] }, fusionType: 'wind_light'
      },

      // Fire + Wind combinations
      {
        id: 'inferno_cyclone', name: 'Inferno Cyclone', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a spinning vortex of flames dealing 2d4 fire or Wind Damage (whichever the target is weak to). Has a 20% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥💨',
        prerequisites: { type: 'AND', skills: ['fireball', 'gust'] }, fusionType: 'fire_wind'
      },
      {
        id: 'heat_vacuum', name: 'Heat Vacuum', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create an imploding heat wave dealing 2d6 fire or Wind Damage (whichever the target is weak to). Has a 40% chance to apply both Burn and Weakened (status-effects.js lines 4-14, 47-57)', icon: '🌪️🔥',
        prerequisites: { type: 'AND', skills: ['inferno_cyclone', 'wind_barrier'] }, fusionType: 'fire_wind'
      },
      {
        id: 'phoenix_storm', name: 'Phoenix Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Summon a storm of burning feathers dealing 3d6 fire or Wind Damage (whichever each target is weak to). Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🦅🔥',
        prerequisites: { type: 'AND', skills: ['heat_vacuum', 'inferno'] }, fusionType: 'fire_wind'
      },

      // Fire + Darkness combinations
      {
        id: 'shadowflame', name: 'Shadowflame', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Launch dark flames dealing 2d4 fire or Darkness Damage (whichever the target is weak to). Has a 20% chance to apply both Burn and Mind Controlled (status-effects.js lines 4-14, 67-77; fear variant)', icon: '🔥🌑',
        prerequisites: { type: 'AND', skills: ['fireball', 'shadow_bolt'] }, fusionType: 'fire_darkness'
      },
      {
        id: 'dark_pyre', name: 'Dark Pyre', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a field of black flames dealing 2d6 fire or Darkness Damage (whichever the target is weak to). Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🏮🌑',
        prerequisites: { type: 'AND', skills: ['shadowflame', 'shadow_armor'] }, fusionType: 'fire_darkness'
      },
      {
        id: 'hellfire', name: 'Hellfire', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Release waves of dark fire dealing 3d6 fire or Darkness Damage (whichever each target is weak to). Has a 75% chance to apply both Burn and Mind Controlled (status-effects.js lines 4-14, 67-77; fear variant)', icon: '👿🔥',
        prerequisites: { type: 'AND', skills: ['dark_pyre', 'inferno'] }, fusionType: 'fire_darkness'
      },

      // Ice + Earth combinations
      {
        id: 'glacial_spike', name: 'Glacial Spike', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a spike of frozen earth dealing 2d4 Ice Damage or Earth Damage (whichever the target is weak to). Has a 20% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🪨',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'stone_throw'] }, fusionType: 'ice_earth'
      },
      {
        id: 'permafrost', name: 'Permafrost', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Freeze the ground solid, dealing 2d6 Ice Damage or Earth Damage (whichever the target is weak to). Has a 40% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '❄️🌍',
        prerequisites: { type: 'AND', skills: ['glacial_spike', 'stone_wall'] }, fusionType: 'ice_earth'
      },
      {
        id: 'avalanche', name: 'Avalanche', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Trigger a massive slide of ice and rock dealing 3d6 Ice Damage or Earth Damage (whichever each target is weak to). Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️❄️',
        prerequisites: { type: 'AND', skills: ['permafrost', 'blizzard'] }, fusionType: 'ice_earth'
      },

      // Ice + Water combinations
      {
        id: 'frost_current', name: 'Frost Current', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a freezing stream dealing 2d4 Ice Damage or Water Damage (whichever the target is weak to). Has a 20% chance to apply Weakened (status-effects.js lines 47-57)', icon: '❄️💧',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'water_splash'] }, fusionType: 'ice_water'
      },
      {
        id: 'ice_flow', name: 'Ice Flow', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Summon a wave of freezing water dealing 2d6 Ice Damage or Water Damage (whichever the target is weak to). Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌊❄️',
        prerequisites: { type: 'AND', skills: ['frost_current', 'water_shield'] }, fusionType: 'ice_water'
      },
      {
        id: 'glacier_tsunami', name: 'Glacier Tsunami', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Create a massive wave of ice dealing 3d6 Ice Damage or Water Damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🌊❄️',
        prerequisites: { type: 'AND', skills: ['ice_flow', 'tsunami'] }, fusionType: 'ice_water'
      },

      // Ice + Darkness combinations
      {
        id: 'dark_frost', name: 'Dark Frost', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create shadowy ice dealing 2d4 Ice Damage or Darkness Damage (whichever the target is weak to). Has a 20% chance to apply both Weakened and Mind Controlled (status-effects.js lines 47-57, 67-77; fear variant)', icon: '❄️🌑',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'shadow_bolt'] }, fusionType: 'ice_darkness'
      },
      {
        id: 'void_freeze', name: 'Void Freeze', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Channel the cold of the void, dealing 2d6 Ice Damage or Darkness Damage (whichever the target is weak to). Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌌❄️',
        prerequisites: { type: 'AND', skills: ['dark_frost', 'shadow_armor'] }, fusionType: 'ice_darkness'
      },
      {
        id: 'eternal_winter', name: 'Eternal Winter', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Unleash primordial cold dealing 3d6 Ice Damage or Darkness Damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Mind Controlled (status-effects.js lines 54-64, 67-77; fear variant)', icon: '❄️🌑',
        prerequisites: { type: 'AND', skills: ['void_freeze', 'blizzard'] }, fusionType: 'ice_darkness'
      },

      // Ice + Light combinations
      {
        id: 'crystal_ray', name: 'Crystal Ray', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Fire a beam of crystalline light dealing 2d4 Ice Damage or Light Damage (whichever the target is weak to). Has a 20% chance to apply Weakened (status-effects.js lines 47-57)', icon: '💎☀️',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'light_ray'] }, fusionType: 'ice_light'
      },
      {
        id: 'aurora_flash', name: 'Aurora Flash', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create dancing lights in ice crystals dealing 2d6 Ice Damage or Light Damage (whichever the target is weak to). Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '🎆❄️',
        prerequisites: { type: 'AND', skills: ['crystal_ray', 'light_shield'] }, fusionType: 'ice_light'
      },
      {
        id: 'diamond_radiance', name: 'Diamond Radiance', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Release pure crystalline energy dealing 3d6 Ice Damage or Light Damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Mind Controlled (status-effects.js lines 54-64, 67-77; charm variant)', icon: '💎✨',
        prerequisites: { type: 'AND', skills: ['aurora_flash', 'blizzard'] }, fusionType: 'ice_light'
      },

      // Lightning + Wind combinations
      {
        id: 'storm_front', name: 'Storm Front', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Create a moving electrical storm dealing 2d4 Lightning Damage or Wind Damage (whichever the target is weak to). Has a 20% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡💨',
        prerequisites: { type: 'AND', skills: ['spark', 'gust'] }, fusionType: 'lightning_wind'
      },
      {
        id: 'charged_cyclone', name: 'Charged Cyclone', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Form a spinning vortex of electricity dealing 2d6 Lightning Damage or Wind Damage (whichever the target is weak to). Has a 40% chance to apply both Incapacitated and Weakened (status-effects.js lines 17-27, 47-57)', icon: '🌪️⚡',
        prerequisites: { type: 'AND', skills: ['storm_front', 'wind_barrier'] }, fusionType: 'lightning_wind'
      },
      {
        id: 'thunderstorm', name: 'Thunderstorm', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Unleash nature\'s fury dealing 3d6 Lightning Damage or Wind Damage (whichever each target is weak to). Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️💨',
        prerequisites: { type: 'AND', skills: ['charged_cyclone', 'chain_lightning'] }, fusionType: 'lightning_wind'
      },

      // Lightning + Water combinations
      {
        id: 'conductivity', name: 'Conductivity', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Electrify water dealing 2d4 Lightning Damage or Water Damage (whichever the target is weak to). Has a 20% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡💧',
        prerequisites: { type: 'AND', skills: ['spark', 'water_splash'] }, fusionType: 'lightning_water'
      },
      {
        id: 'storm_surge', name: 'Storm Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a wave of electrified water dealing 2d6 Lightning Damage or Water Damage (whichever the target is weak to). Has a 40% chance to apply both Incapacitated and Weakened (status-effects.js lines 17-27, 47-57)', icon: '🌊⚡',
        prerequisites: { type: 'AND', skills: ['conductivity', 'water_shield'] }, fusionType: 'lightning_water'
      },
      {
        id: 'maelstrom_strike', name: 'Maelstrom Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Summon a whirlpool of lightning dealing 3d6 Lightning Damage or Water Damage (whichever each target is weak to). Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '🌊⚡',
        prerequisites: { type: 'AND', skills: ['storm_surge', 'chain_lightning'] }, fusionType: 'lightning_water'
      },

      // Lightning + Darkness combinations
      {
        id: 'dark_lightning', name: 'Dark Lightning', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Strike with shadowy electricity dealing 2d4 Lightning Damage or Darkness Damage (whichever the target is weak to). Has a 20% chance to apply both Incapacitated and Mind Controlled (status-effects.js lines 17-27, 67-77; fear variant)', icon: '⚡🌑',
        prerequisites: { type: 'AND', skills: ['spark', 'shadow_bolt'] }, fusionType: 'lightning_darkness'
      },
      {
        id: 'void_thunder', name: 'Void Thunder', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Channel darkness through lightning dealing 2d6 Lightning Damage or Darkness Damage (whichever the target is weak to). Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '🌩️🌑',
        prerequisites: { type: 'AND', skills: ['dark_lightning', 'shadow_armor'] }, fusionType: 'lightning_darkness'
      },
      {
        id: 'eclipse_storm', name: 'Eclipse Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Unleash a storm of dark energy dealing 3d6 Lightning Damage or Darkness Damage (whichever each target is weak to). Has a 75% chance to apply both Incapacitated and Mind Controlled (status-effects.js lines 17-27, 67-77; fear variant)', icon: '⚡🌑',
        prerequisites: { type: 'AND', skills: ['void_thunder', 'chain_lightning'] }, fusionType: 'lightning_darkness'
      },

      // Lightning + Light combinations
      {
        id: 'radiant_bolt', name: 'Radiant Bolt', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Fire a beam of pure energy dealing 2d4 Lightning Damage or Light Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '⚡☀️',
        prerequisites: { type: 'AND', skills: ['spark', 'light_ray'] }, fusionType: 'lightning_light'
      },
      {
        id: 'divine_thunder', name: 'Divine Thunder', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Call down judgment dealing 2d6 Lightning Damage or Light Damage (whichever the target is weak to). Has a 40% chance to apply both Incapacitated and Mind Controlled (status-effects.js lines 17-27, 67-77; charm variant)', icon: '⚡✨',
        prerequisites: { type: 'AND', skills: ['radiant_bolt', 'light_shield'] }, fusionType: 'lightning_light'
      },
      {
        id: 'heavens_wrath', name: 'Heaven\'s Wrath', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Channel celestial power dealing 3d6 Lightning Damage or Light Damage (whichever each target is weak to). Has a 75% chance to apply both Incapacitated and Enhanced (status-effects.js lines 17-27, 90-100)', icon: '⚡☀️',
        prerequisites: { type: 'AND', skills: ['divine_thunder', 'chain_lightning'] }, fusionType: 'lightning_light'
      },

      // Earth + Darkness combinations
      {
        id: 'shadow_stone', name: 'Shadow Stone', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Launch rocks infused with darkness dealing 2d4 earth or Darkness Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🪨🌑',
        prerequisites: { type: 'AND', skills: ['stone_throw', 'shadow_bolt'] }, fusionType: 'earth_darkness'
      },
      {
        id: 'obsidian_strike', name: 'Obsidian Strike', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create spikes of dark stone dealing 2d6 earth or Darkness Damage (whichever the target is weak to). Has a 40% chance to apply both Immobilized and Mind Controlled (status-effects.js lines 54-64, 67-77; fear variant)', icon: '🌑🪨',
        prerequisites: { type: 'AND', skills: ['shadow_stone', 'shadow_armor'] }, fusionType: 'earth_darkness'
      },
      {
        id: 'void_eruption', name: 'Void Eruption', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Trigger an eruption of dark matter dealing 3d6 earth or Darkness Damage (whichever each target is weak to). Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🌑',
        prerequisites: { type: 'AND', skills: ['obsidian_strike', 'earthquake'] }, fusionType: 'earth_darkness'
      },

      // Earth + Light combinations
      {
        id: 'crystal_light', name: 'Crystal Light', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Channel light through crystals dealing 2d4 earth or Light Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '💎☀️',
        prerequisites: { type: 'AND', skills: ['stone_throw', 'light_ray'] }, fusionType: 'earth_light'
      },
      {
        id: 'prismatic_earth', name: 'Prismatic Earth', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create pillars of illuminated crystal dealing 2d6 earth or Light Damage (whichever the target is weak to). Has a 40% chance to apply both Enhanced and Immobilized (status-effects.js lines 90-100, 54-64)', icon: '🌈🪨',
        prerequisites: { type: 'AND', skills: ['crystal_light', 'light_shield'] }, fusionType: 'earth_light'
      },
      {
        id: 'sacred_ground', name: 'Sacred Ground', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Consecrate the earth dealing 3d6 earth or Light Damage (whichever each target is weak to). Has a 75% chance to apply Immobilized while granting Enhanced to allies (status-effects.js lines 54-64, 90-100)', icon: '⚖️🪨',
        prerequisites: { type: 'AND', skills: ['prismatic_earth', 'earthquake'] }, fusionType: 'earth_light'
      },

      // Water + Darkness combinations
      {
        id: 'abyssal_current', name: 'Abyssal Current', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Control dark waters dealing 2d4 water or Darkness Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌊🌑',
        prerequisites: { type: 'AND', skills: ['water_splash', 'shadow_bolt'] }, fusionType: 'water_darkness'
      },
      {
        id: 'deep_surge', name: 'Deep Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Summon waters from the depths dealing 2d6 water or Darkness Damage (whichever the target is weak to). Has a 40% chance to apply both Weakened and Mind Controlled (status-effects.js lines 47-57, 67-77; fear variant)', icon: '🌊🌑',
        prerequisites: { type: 'AND', skills: ['abyssal_current', 'shadow_armor'] }, fusionType: 'water_darkness'
      },
      {
        id: 'drowning_darkness', name: 'Drowning Darkness', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Create a zone of dark water dealing 3d6 water or Darkness Damage (whichever each target is weak to). Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌊🖤',
        prerequisites: { type: 'AND', skills: ['deep_surge', 'tsunami'] }, fusionType: 'water_darkness'
      },

      // Water + Light combinations
      {
        id: 'holy_spring', name: 'Holy Spring', tier: 2, cost: 10, staminaCost: 4, desc: 'Active: Summon blessed water dealing 2d4 water or Light Damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '💧✨',
        prerequisites: { type: 'AND', skills: ['water_splash', 'light_ray'] }, fusionType: 'water_light'
      },
      {
        id: 'purifying_wave', name: 'Purifying Wave', tier: 3, cost: 15, staminaCost: 6, desc: 'Active: Create a wave of sacred water dealing 2d6 water or Light Damage (whichever the target is weak to). Has a 40% chance to apply Enhanced (status-effects.js lines 90-100)', icon: '🌊✨',
        prerequisites: { type: 'AND', skills: ['holy_spring', 'light_shield'] }, fusionType: 'water_light'
      },
      {
        id: 'blessed_tsunami', name: 'Blessed Tsunami', tier: 4, cost: 20, staminaCost: 8, desc: 'Active: Summon a wave of divine water dealing 3d6 water or Light Damage (whichever each target is weak to). Has a 75% chance to apply Mind Controlled while granting Enhanced to allies (status-effects.js lines 67-77; charm variant, 90-100)', icon: '🌊☀️',
        prerequisites: { type: 'AND', skills: ['purifying_wave', 'tsunami'] }, fusionType: 'water_light'
      }
    ],
  },

  // ASCENSION SKILLS - Unique abilities/spells unlocked by character level
  ascension: {
    unique: [
      // 1. FAMILIAR SUMMON
      {
        id: 'familiar_summon',
        name: 'Familiar Summon',
        tier: 3,
        cost: 50,
        staminaCost: 20,
        desc: 'Active: Summon a loyal Monster companion (Player creates monster character with 50 Lumen to spend). Lasts until dismissed or slain. Can transfer your Lumen to improve companion.',
        icon: '👹',
        prerequisites: { type: 'LEVEL', level: 5 }
      },

      // 2. AETHERIAL SHIFT
      {
        id: 'aetherial_shift',
        name: 'Aetherial Shift',
        tier: 4,
        cost: 35,
        staminaCost: 30,
        desc: 'Reaction: When you would take damage, phase out of reality to ignore all damage from that attack. After phasing, you cannot use other Active/Reaction skills until the end of your next turn due to dimensional instability.',
        icon: '👻',
        prerequisites: { type: 'LEVEL', level: 8 }
      },

      // 3. ULTIMATE NOVA
      {
        id: 'ultimate_nova',
        name: 'Ultimate Nova',
        tier: 4,
        cost: 50,
        staminaCost: 30,
        desc: 'Active: Unleash devastating energy blast in all directions. Does not miss. Deals 3d20 Physical Damage to all enemies within 30ft radius. (friendly fire possible) Become "Incapacitated" afterwards.',
        icon: '⭐',
        prerequisites: { type: 'LEVEL', level: 10 }
      },

      // 4. MIND SHIELD
      {
        id: 'mind_shield',
        name: 'Mind Shield',
        tier: 4,
        cost: 45,
        staminaCost: 0,
        desc: 'Passive: Immune to mind control and illusions. Cannot be charmed, frightened, or possessed.',
        icon: '🛡️',
        prerequisites: { type: 'LEVEL', level: 8 }
      },

      // 5. COSMIC AWARENESS
      {
        id: 'cosmic_awareness',
        name: 'Cosmic Awareness',
        tier: 5,
        cost: 65,
        staminaCost: 0,
        desc: 'Passive: Sense all magical effects, hidden creatures, and dimensional rifts within 100ft. Can see through illusions and invisibility.',
        icon: '👁️',
        prerequisites: { type: 'LEVEL', level: 12 }
      },

      // 6. PROBABILITY SHIFT
      {
        id: 'probability_shift',
        name: 'Probability Shift',
        tier: 4,
        cost: 50,
        staminaCost: 10,
        desc: 'Reaction: When you fail a roll, reroll with advantage. Can also force an enemy to reroll a successful attack with disadvantage.',
        icon: '🎲',
        prerequisites: { type: 'LEVEL', level: 10 }
      },

      // 7. INSTINCTIVE DODGE
      {
        id: 'instinctive_dodge',
        name: 'Instinctive Dodge',
        tier: 3,
        cost: 30,
        staminaCost: 1,
        desc: 'Reaction: Automatically attempt to dodge any attacks that would hit you each round (Require roll higher than enemies Accuracy roll). Cannot dodge attacks that affect an area.',
        icon: '⚡',
        prerequisites: { type: 'LEVEL', level: 4 }
      },

      // 8. BURST OF SPEED
      {
        id: 'burst_of_speed',
        name: 'Burst of Speed',
        tier: 3,
        cost: 40,
        staminaCost: 5,
        desc: 'Active: Temporarily enhance your movement speed to supernatural levels. Move up to 2x your normal movement distance for 1 round. Cannot be used again on your next turn.',
        icon: '💨',
        prerequisites: { type: 'LEVEL', level: 6 }
      },

      // 9. ANALYZE
      {
        id: 'analyze',
        name: 'Analyze',
        tier: 4,
        cost: 35,
        staminaCost: 5,
        desc: 'Active: Analyze a target within 30ft to reveal their HP, elemental weaknesses, resistances, and special abilities. Also reveals hidden traps and environmental hazards in the area.',
        icon: '🔍',
        prerequisites: { type: 'LEVEL', level: 7 }
      },

      // 10. ECHO LOCATION
      {
        id: 'echo_location',
        name: 'Echo Location',
        tier: 3,
        cost: 35,
        staminaCost: 10,
        desc: 'Active: Emit a pulse that reveals all creatures and objects within 50ft radius. Works through darkness and reveals hidden enemies and traps. Does not work through solid walls.',
        icon: '🔊',
        prerequisites: { type: 'LEVEL', level: 6 }
      },

      // 11. PHASE STEP
      {
        id: 'phase_step',
        name: 'Phase Step',
        tier: 4,
        cost: 40,
        staminaCost: 15,
        desc: 'Active: Instantly teleport up to 30ft in any direction, passing through solid objects. Cannot teleport into occupied spaces.',
        icon: '👣',
        prerequisites: { type: 'LEVEL', level: 7 }
      },

      // 12. MIND READ
      {
        id: 'mind_read',
        name: 'Mind Read',
        tier: 4,
        cost: 45,
        staminaCost: 20,
        desc: 'Active: Read the recent memories of a creature within 30ft. Gain basic understanding of their desires and intentions. Can understand creatures even if they don\'t speak your language.',
        icon: '🧠',
        prerequisites: { type: 'LEVEL', level: 8 }
      },

      // 13. ETERNAL MOMENT
      {
        id: 'eternal_moment',
        name: 'Eternal Moment',
        tier: 5,
        cost: 70,
        staminaCost: 40,
        desc: 'Active: Stop time and gain 3 additional turns immediately. No creature you attack can activate reaction skills during these turns. After using this skill, you must skip your next turn due to temporal exhaustion.',
        icon: '⌛',
        prerequisites: { type: 'LEVEL', level: 12 }
      },

      // 14. SOUL TRANSFERENCE
      {
        id: 'soul_transference',
        name: 'Soul Transference',
        tier: 5,
        cost: 80,
        staminaCost: 50,
        desc: 'Active: Transfer your consciousness to another body, taking over their form and abilities. Original body becomes comatose. NOTE: Consider implementation challenges and potential for abuse on powerful NPCs.',
        icon: '💫',
        prerequisites: { type: 'LEVEL', level: 12 }
      },

      // 15. GRAVITY MANIPULATION
      {
        id: 'gravity_manipulation',
        name: 'Gravity Manipulation',
        tier: 3,
        cost: 30,
        staminaCost: 12,
        desc: 'Active: Alter gravity in a 10ft radius. Enemies in the area have their movement speed halved, while allies have their movement speed doubled. Lasts for 2 rounds.',
        icon: '🌍',
        prerequisites: { type: 'LEVEL', level: 4 }
      }
    ]
  }
}

// Make skills data globally available
window.SKILLS_DATA = SKILLS_DATA

// Helper function for finding skills - make it globally available
window.findSkillById = function (id) {
  // Search through racial skills first
  if (typeof window.RACE_SKILL_TREES !== 'undefined') {
    for (const raceKey in window.RACE_SKILL_TREES) {
      const raceSkills = window.RACE_SKILL_TREES[raceKey]
      if (Array.isArray(raceSkills)) {
        const found = raceSkills.find(skill => skill.id === id)
        if (found) return found
      }
    }
  }

  // Search through all categories
  for (const category in SKILLS_DATA) {
    const categoryData = SKILLS_DATA[category]

    // Handle nested categories (all categories should be nested now)
    for (const subcategory in categoryData) {
      const skills = categoryData[subcategory]
      if (Array.isArray(skills)) {
        const found = skills.find(skill => skill.id === id)
        if (found) return found
      }
    }
  }
  return null // Return null if skill not found
}

// Skill cost calculation based on tier (new tiered pricing system)
function getSkillCost(tier) {
  // New tiered pricing system
  const tierCosts = {
    0: 3,   // Tier 0: Weapon basics and core proficiencies
    1: 8,   // Tier 1: Basic combat skills
    2: 15,  // Tier 2: Intermediate combat skills
    3: 25,  // Tier 3: Advanced combat skills
    4: 35,  // Tier 4: Expert-level skills
    5: 50   // Tier 5: Master-level skills
  }

  return tierCosts[tier] || (tier * 5) // Fallback to old system for any other tiers
}

// Get all skills from all categories as a flat array
function getAllSkills() {
  const allSkills = []

  // Handle monster skills (nested structure like other categories)
  if (SKILLS_DATA.monster) {
    Object.values(SKILLS_DATA.monster).forEach(skillTree => {
      allSkills.push(...skillTree)
    })
  }

  // Handle fusion skills (nested structure like other categories)
  if (SKILLS_DATA.fusion) {
    Object.values(SKILLS_DATA.fusion).forEach(skillTree => {
      allSkills.push(...skillTree)
    })
  }

  // Handle other categories (nested structure)
  Object.entries(SKILLS_DATA).forEach(([category, categoryData]) => {
    if (category === 'monster' || category === 'fusion') return // Already handled above

    Object.values(categoryData).forEach(skillTree => {
      allSkills.push(...skillTree)
    })
  })

  return allSkills
}

// Find a skill by ID across all categories
function findSkillById(skillId) {
  const allSkills = getAllSkills()
  return allSkills.find(skill => skill.id === skillId)
}

// Get skills by category
function getSkillsByCategory(category) {
  return SKILLS_DATA[category] || {}
}

// Validate skill prerequisites
function validatePrerequisites(skillId, unlockedSkills) {
  const skill = findSkillById(skillId)
  if (!skill || skill.prerequisites.type === 'NONE') return true

  if (skill.prerequisites.type === 'AND') {
    return skill.prerequisites.skills.every(prereqId =>
      unlockedSkills.some(category => category.includes(prereqId))
    )
  } else if (skill.prerequisites.type === 'OR') {
    return skill.prerequisites.skills.some(prereqId =>
      unlockedSkills.some(category => category.includes(prereqId))
    )
  }

  return false
}

// RACIAL SKILL TREES - Add racial skills to the main skills system
if (typeof RACE_SKILL_TREES !== 'undefined') {
  // Add all racial skill trees to the main skills data
  SKILLS_DATA.racial = {}

  // For each race, add their skills
  Object.keys(RACE_SKILL_TREES).forEach(raceKey => {
    SKILLS_DATA.racial[raceKey] = RACE_SKILL_TREES[raceKey]
  })
}

// Skill incompatibilities - skills that cannot be learned together
const SKILL_INCOMPATIBILITIES = {
  // Toggle stances are mutually exclusive
  defensive_stance: ['berserker_rage', 'monster_berserker_rage', 'fortress_stance'],
  berserker_rage: ['defensive_stance', 'polearm_defensive_stance', 'fortress_stance', 'monster_berserker_rage'],
  monster_berserker_rage: ['defensive_stance', 'berserker_rage', 'polearm_defensive_stance', 'fortress_stance'],
  polearm_defensive_stance: ['berserker_rage', 'monster_berserker_rage', 'fortress_stance'],
  fortress_stance: ['defensive_stance', 'berserker_rage', 'monster_berserker_rage', 'polearm_defensive_stance'],

  // Regeneration effects don't stack - only one can be active
  regeneration: ['rapid_healing', 'water_mastery'],
  rapid_healing: ['regeneration', 'water_mastery'],
  water_mastery: ['regeneration', 'rapid_healing'],

  // Some fusion skills are incompatible with certain masteries to prevent game-breaking combinations
  sword_fire_fusion: ['ice_mastery', 'water_mastery'],
  sword_ice_fusion: ['fire_mastery'],
  bow_lightning_fusion: ['water_mastery'],

  // Mastery limitations - can't have too many elemental masteries
  fire_mastery: ['ice_mastery', 'water_mastery'],
  ice_mastery: ['fire_mastery'],
  water_mastery: ['fire_mastery', 'lightning_mastery'],
  lightning_mastery: ['water_mastery']
}

// Check if a skill is compatible with already unlocked skills
function checkSkillCompatibility(skillId, unlockedSkills) {
  const incompatibleSkills = SKILL_INCOMPATIBILITIES[skillId]
  if (!incompatibleSkills) return true

  const flatUnlockedSkills = unlockedSkills.flat()
  return !incompatibleSkills.some(incompatibleId => flatUnlockedSkills.includes(incompatibleId))
}
