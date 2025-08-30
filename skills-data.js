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
// - "Magic Damage": The actual damage output of magical spells (calculated from Magic Power + spell base)  
// - "Damage": Generic term referring to all attack damage (physical or magical)
// - Physical damage uses Strength stat, magical damage uses Magic Power stat
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
      { id: 'sword_beginner', name: 'Sword Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a sword', icon: '⚔️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'sword_basics', name: 'Sword Basics', tier: 1, cost: 5, staminaCost: 0, desc: '+1 attack bonus with swords, learn basic combat maneuvers', icon: '⚔️', prerequisites: { type: 'AND', skills: ['sword_beginner'] } },
      { id: 'sword_stance', name: 'Sword Stance', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Proper fighting stance: +1 Physical Defence while wielding a sword', icon: '🛡️', prerequisites: { type: 'AND', skills: ['sword_beginner'] } },

      // Tier 2
      { id: 'quick_strike', name: 'Quick Strike', tier: 2, cost: 10, staminaCost: 2, desc: 'Action: Fast sword attack with +2 accuracy bonus', icon: '⚡', prerequisites: { type: 'AND', skills: ['sword_basics'] } },
      { id: 'parry', name: 'Parry', tier: 2, cost: 10, staminaCost: 1, desc: 'Reaction: Block incoming melee attack, negate damage on successful roll (16 or higher)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['sword_basics', 'sword_stance'] } },
      { id: 'lunge_attack', name: 'Lunge Attack', tier: 2, cost: 10, staminaCost: 3, desc: 'Action: Extended reach attack (+5ft range), +1 damage on hit', icon: '🎯', prerequisites: { type: 'AND', skills: ['sword_basics'] } },

      // Tier 3
      { id: 'riposte', name: 'Riposte', tier: 3, cost: 15, staminaCost: 2, desc: 'Reaction: After successful parry, basic counter-attack with +2 damage', icon: '⚔️', prerequisites: { type: 'AND', skills: ['parry', 'quick_strike'] } },
      { id: 'sweeping_slash', name: 'Sweeping Slash', tier: 3, cost: 15, staminaCost: 4, desc: 'Action: Wide arc attack hits up to 3 adjacent enemies', icon: '🌪️', prerequisites: { type: 'AND', skills: ['quick_strike'] } },
      { id: 'blade_dance', name: 'Blade Dance', tier: 3, cost: 15, staminaCost: 5, desc: 'Action: Fluid combo of 3 attacks, each at -1 accuracy but +1 damage (first; -1 accuracy +1 damage - second; -2 accuracy +2 damage - third; -3 accuracy +3 damage)', icon: '💃', prerequisites: { type: 'AND', skills: ['lunge_attack', 'quick_strike'] } },
      { id: 'defensive_stance', name: 'Defensive Stance', tier: 3, cost: 15, staminaCost: 1, desc: 'Toggle: +2 Physical Defence but -2 attack damage. Costs 1 stamina per turn, lasts max 10 turns', icon: '🛡️', prerequisites: { type: 'AND', skills: ['parry'] } },

      // Tier 4
      { id: 'master_parry', name: 'Master Parry', tier: 4, cost: 20, staminaCost: 3, upgrade: 'parry', desc: 'Reaction: Reflect melee attacks back at attacker for full damage, Must have defence_stance active', icon: '✨', prerequisites: { type: 'AND', skills: ['riposte', 'defensive_stance'] } },
      { id: 'whirlwind', name: 'Whirlwind Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'Action: Spinning attack hits all enemies within 10ft radius (-2 accuracy, friendly fire possible)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['sweeping_slash', 'blade_dance'] } },
      { id: 'piercing_thrust', name: 'Piercing Thrust', tier: 4, cost: 20, staminaCost: 4, desc: 'Action: Ignores armor completely (minimum roll of 10 on d20), critical hit on 17-20', icon: '🎯', prerequisites: { type: 'AND', skills: ['lunge_attack'] } },

      // Tier 5
      { id: 'sword_mastery', name: 'Sword Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +3 damage with all Melee attacks while Sword is equipped and All Sword related skills, critical hits restore 5 stamina', icon: '👑', prerequisites: { type: 'OR', skills: ['master_parry', 'whirlwind', 'piercing_thrust'] } }
    ],

    // RANGED SKILLS (Tier 1-5) - Bows, Crossbows, and Ranged Weapons
    Bow: [
      // Tier 0
      { id: 'bow_beginner', name: 'Bow Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a bow', icon: '🏹', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'ranged_basics', name: 'Ranged Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 Damage with Bow weapons, learn proper form and operation', icon: '🏹', prerequisites: { type: 'AND', skills: ['bow_beginner'] } },
      { id: 'steady_aim', name: 'Steady Aim', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +2 accuracy when you didn\'t move this turn, requires full action to maintain', icon: '🎯', prerequisites: { type: 'AND', skills: ['bow_beginner'] } },

      // Tier 2
      { id: 'quick_draw', name: 'Quick Draw', tier: 2, cost: 10, staminaCost: 2, desc: 'Action: gain steady_aim\'s bonus even if you moved this turn', icon: '⚡', prerequisites: { type: 'AND', skills: ['ranged_basics'] } },
      { id: 'aimed_shot', name: 'Aimed Shot', tier: 2, cost: 10, staminaCost: 3, desc: 'Action: Take extra time to aim (full action), +4 accuracy and +3 damage on next ranged attack, requires steady_aim active', icon: '🎯', prerequisites: { type: 'AND', skills: ['steady_aim'] } },
      { id: 'power_shot', name: 'Power Shot', tier: 2, cost: 10, staminaCost: 4, desc: 'Action: Full power shot for +4 damage but -2 accuracy, cannot be used with quick_draw', icon: '💪', prerequisites: { type: 'AND', skills: ['ranged_basics'] } },
      { id: 'long_range', name: 'Long Range', tier: 2, cost: 10, staminaCost: 0, desc: 'Passive: Increase effective range by 50%, no accuracy penalty at maximum range, applies to all bow attacks. NOTE: give all ranged weapons a Maximum range. - weak bow > 60ft, Strong bow > 150ft', icon: '🔭', prerequisites: { type: 'AND', skills: ['steady_aim'] } },

      // Tier 3
      { id: 'multi_shot', name: 'Multi Shot', tier: 3, cost: 15, staminaCost: 5, desc: 'Action: Fire 2 projectiles at same target or split between 2 targets, Roll for each at -1 accuracy', icon: '⬇️', prerequisites: { type: 'AND', skills: ['quick_draw'] } },
      { id: 'piercing_shot', name: 'Piercing Shot', tier: 3, cost: 15, staminaCost: 4, desc: 'Action: Projectile penetrates through enemies in straight line (50% of Max range of equipped bow), deals +2 damage to each target hit', icon: '➡️', prerequisites: { type: 'AND', skills: ['aimed_shot', 'power_shot'] } },
      { id: 'explosive_shot', name: 'Explosive Shot', tier: 3, cost: 15, staminaCost: 8, desc: 'Action: Projectile explodes in 10ft radius dealing AoE damage (-1 accuracy, friendly fire possible)', icon: '💥', prerequisites: { type: 'AND', skills: ['power_shot', 'fire_spark'] } },
      { id: 'blinding_shot', name: 'Blinding Shot', tier: 3, cost: 15, staminaCost: 3, desc: 'Action: A shot that targets the enemies eyes. On hit, the enemy loses -5 Accuracy for 10 turns', icon: '👁️', prerequisites: { type: 'AND', skills: ['quick_draw'] } },
      { id: 'grappling_shot', name: 'Grappling Shot', tier: 3, cost: 15, staminaCost: 4, desc: 'Action: Pull self to target or pull target to you (45ft range), if successful in battle, Roll to punch/kick the enemy (d4+1 damage)', icon: '🪝', prerequisites: { type: 'AND', skills: ['quick_draw'] } },

      // Tier 4
      { id: 'barrage', name: 'Projectile Barrage', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Rain projectiles over 20ft radius area, hits all enemies inside (-3 accuracy, friendly fire possible)', icon: '🌧️', prerequisites: { type: 'AND', skills: ['multi_shot', 'explosive_shot'] } },
      { id: 'homing_shot', name: 'Homing Shot', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Magical projectile that automatically hits target ignores cover and concealment. Critical Hit on a roll of 18-20', icon: '🧭', prerequisites: { type: 'AND', skills: ['piercing_shot'] } },
      { id: 'rapid_fire', name: 'Rapid Fire', tier: 4, cost: 20, staminaCost: 5, desc: 'Action: Fire 4 projectiles in rapid succession', icon: '🔥', prerequisites: { type: 'AND', skills: ['blinding_shot', 'multi_shot'] } },
      { id: 'siege_shot', name: 'Siege Shot', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Massive projectile pierces through multiple enemies (To maximum range), Can not be reflected, deals double damage to enemies with rock_skin or metal_skin', icon: '🏹', prerequisites: { type: 'AND', skills: ['grappling_shot', 'explosive_shot'] } },

      // Tier 5
      { id: 'Bow_mastery', name: 'Bow Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +50% range, +3 damage with all Bow attacks, critical hits apply additional 2 damage dice', icon: '👑', prerequisites: { type: 'OR', skills: ['barrage', 'homing_shot', 'rapid_fire', 'siege_shot'] } }
    ],

    // AXE SKILLS (Tier 1-5)
    axe: [
      // Tier 0
      { id: 'axe_beginner', name: 'Axe Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip an axe', icon: '🪓', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'axe_basics', name: 'Axe Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 Damage with axes, learn proper grip and swing techniques', icon: '🪓', prerequisites: { type: 'AND', skills: ['axe_beginner'] } },
      { id: 'heavy_swing', name: 'Heavy Swing', tier: 1, cost: 5, staminaCost: 3, desc: 'Action: Powerful overhead chop, +3 damage but -3 accuracy', icon: '⬇️', prerequisites: { type: 'AND', skills: ['axe_beginner'] } },

      // Tier 2
      { id: 'cleave', name: 'Cleave', tier: 2, cost: 10, staminaCost: 1, desc: 'Passive: When you kill an enemy, make basic attack on adjacent foe (costs 1 stamina, once per turn)', icon: '〰️', prerequisites: { type: 'AND', skills: ['axe_basics'] } },
      { id: 'armor_break', name: 'Armor Break', tier: 2, cost: 10, staminaCost: 5, desc: 'Action: Reduce target\'s Physical Defence by 2 for 10 turns (once per enemy), ignores armor completely', icon: '🔨', prerequisites: { type: 'AND', skills: ['heavy_swing'] } },
      { id: 'throwing_axe', name: 'Throwing Axe', tier: 2, cost: 10, staminaCost: 3, desc: 'Action: Ranged axe attack (30ft range), axe returns to hand at beginning of next turn', icon: '🎯', prerequisites: { type: 'AND', skills: ['axe_basics'] } },

      // Tier 3
      { id: 'berserker_rage', name: 'Berserker Rage', tier: 3, cost: 15, staminaCost: 5, desc: 'Toggle: +4 Strength and Physical Defence and additional basic attack. Costs 2 stamina per additional turn, lasts max 5 turns. Applies Incapacitated (cannot act 2 turns) after', icon: '😤', prerequisites: { type: 'AND', skills: ['cleave'] } },
      { id: 'crushing_blow', name: 'Crushing Blow', tier: 3, cost: 15, staminaCost: 6, desc: 'Action: 50% chance to apply Incapacitated (cannot act 2 turns) +2 damage on hit', icon: '💥', prerequisites: { type: 'AND', skills: ['armor_break', 'heavy_swing'] } },
      { id: 'ricochet_axe', name: 'Ricochet Axe', tier: 3, cost: 15, staminaCost: 5, desc: 'Enchantment: Thrown axes bounce to hit 1 additional target within 15ft of original target', icon: '🔄', prerequisites: { type: 'AND', skills: ['throwing_axe'] } },
      { id: 'wide_cleave', name: 'Wide Cleave', tier: 3, cost: 15, staminaCost: 7, desc: 'Action: Cleave attack hits all enemies in 15ft arc, each target takes -1 accuracy penalty', icon: '〰️', prerequisites: { type: 'AND', skills: ['cleave'] } },

      // Tier 4
      { id: 'earthquake_slam', name: 'Earthquake Slam', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Ground slam in 20ft radius, knockdown + damage to all (-2 accuracy, friendly fire possible), creates difficult terrain for 3 turns', icon: '🌍', prerequisites: { type: 'AND', skills: ['crushing_blow'] } },
      { id: 'whirling_axes', name: 'Whirling Axes', tier: 4, cost: 20, staminaCost: 11, desc: 'Action: Spin attack hits all enemies within 10ft, move while spinning (-2 accuracy, friendly fire possible), can move up to 20ft during attack', icon: '🌪️', prerequisites: { type: 'AND', skills: ['berserker_rage', 'wide_cleave'] } },
      { id: 'axe_storm', name: 'Axe Storm', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Throw up to 6 axes in all directions (360° coverage), each axe deals normal damage, requires axes in inventory', icon: '🌩️', prerequisites: { type: 'AND', skills: ['ricochet_axe'] } },

      // Tier 5
      { id: 'axe_mastery', name: 'Axe Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +3 damage with all axe attacks, all axe attacks have additional 25% Incapacitated (cannot act 2 turns) chance, critical hits restore 3 stamina', icon: '👑', prerequisites: { type: 'OR', skills: ['earthquake_slam', 'whirling_axes', 'axe_storm'] } }
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
      { id: 'arcane_shield', name: 'Arcane Shield', tier: 2, cost: 10, staminaCost: 4, desc: 'Action: Apply Spell Warded (magic immunity + magic damage halved for 8 turns)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['mana_focus'] } },
      { id: 'staff_strike', name: 'Staff Strike', tier: 2, cost: 10, staminaCost: 3, desc: 'Action: Melee attack with staff (1d6 + magic power damage)', icon: '⚡', prerequisites: { type: 'AND', skills: ['staff_basics'] } },

      // Tier 3
      { id: 'spell_penetration', name: 'Spell Penetration', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Spells ignore 2 points of magical defense', icon: '🎯', prerequisites: { type: 'AND', skills: ['spell_power'] } },
      { id: 'mana_burn', name: 'Mana Burn', tier: 3, cost: 15, staminaCost: 5, desc: 'Action: Apply Weakened (all stats -2) and drain target stamina (1d4+2)', icon: '💔', prerequisites: { type: 'AND', skills: ['staff_strike', 'arcane_shield'] } },
      { id: 'elemental_staff', name: 'Elemental Staff', tier: 3, cost: 15, staminaCost: 6, desc: 'Action: Imbue staff with element (Fire/Ice/Lightning) for 10 turns', icon: '🔥', prerequisites: { type: 'AND', skills: ['spell_power'] } },
      { id: 'dispel_ward', name: 'Dispel Ward', tier: 3, cost: 15, staminaCost: 4, desc: 'Action: Remove all magical effects from target (ally or enemy)', icon: '🚫', prerequisites: { type: 'AND', skills: ['arcane_shield'] } },

      // Tier 4
      { id: 'arcane_mastery', name: 'Arcane Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: All spells cost -1 stamina (minimum 1)', icon: '🧙', prerequisites: { type: 'AND', skills: ['spell_penetration', 'mana_burn'] } },
      { id: 'staff_of_power', name: 'Staff of Power', tier: 4, cost: 20, staminaCost: 8, desc: 'Action: 2 turn move. 1st turn charge staff. 2nd turn Unleash stored energy (5d10 force damage, 60ft range)', icon: '💥', prerequisites: { type: 'AND', skills: ['elemental_staff'] } },
      { id: 'reality_tear', name: 'Reality Tear', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Create dimensional rift (Teleport anywhere within 100ft)', icon: '🌀', prerequisites: { type: 'AND', skills: ['dispel_ward'] } },

      // Tier 5
      { id: 'staff_mastery', name: 'Staff Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +4 magic power, can cast two spells per turn (once per day)', icon: '👑', prerequisites: { type: 'OR', skills: ['arcane_mastery', 'staff_of_power', 'reality_tear'] } }
    ],

    // DAGGER SKILLS (Tier 1-5) - Speed and precision weapon
    dagger: [
      // Tier 0
      { id: 'dagger_beginner', name: 'Dagger Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a dagger', icon: '🗡️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'dagger_basics', name: 'Dagger Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 attack bonus with daggers, learn swift strikes', icon: '🗡️', prerequisites: { type: 'AND', skills: ['dagger_beginner'] } },
      { id: 'light_step', name: 'Light Step', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 speed when wielding daggers, silent movement (requires dagger equipped)', icon: '👣', prerequisites: { type: 'AND', skills: ['dagger_beginner'] } },

      // Tier 2
      { id: 'dual_wield', name: 'Dual Wield', tier: 2, cost: 25, staminaCost: 0, desc: 'Passive: When you have a second weapon equipped, you gain +1 attack per turn. If your equipped weapons are not both daggers, you suffer -6 Accuracy on all attacks.', icon: '⚔️', prerequisites: { type: 'AND', skills: ['dagger_basics'] } },
      { id: 'sneak_attack', name: 'Sneak Attack', tier: 2, cost: 10, staminaCost: 4, desc: 'Action: +3 damage when attacking from behind or hidden', icon: '👤', prerequisites: { type: 'AND', skills: ['light_step'] } },
      { id: 'poison_blade', name: 'Poison Blade', tier: 2, cost: 10, staminaCost: 2, desc: 'Enchantment: Coat daggers with poison (escalating: 1→2→3 damage over 3 turns)', icon: '☠️', prerequisites: { type: 'AND', skills: ['dagger_basics'] } },

      // Tier 3
      { id: 'flurry', name: 'Flurry', tier: 3, cost: 15, staminaCost: 6, desc: 'Action: Make 4 rapid attacks, each at -1 accuracy', icon: '🌪️', prerequisites: { type: 'AND', skills: ['dual_wield'] } },
      { id: 'shadowstep', name: 'Shadowstep', tier: 3, cost: 15, staminaCost: 5, desc: 'Action: Teleport behind target within 30ft, next attack is sneak attack', icon: '🌑', prerequisites: { type: 'AND', skills: ['sneak_attack'] } },
      { id: 'vital_strike', name: 'Vital Strike', tier: 3, cost: 15, staminaCost: 4, desc: 'Action: Target vital points (Critical hit on 15-20). Has a 40% chance to apply Bleed status effect (status-effects.js lines 42-50)', icon: '💔', prerequisites: { type: 'AND', skills: ['poison_blade', 'sneak_attack'] } },
      { id: 'evasion', name: 'Evasion', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: +2 AC, can dodge area attacks with successful roll', icon: '💨', prerequisites: { type: 'AND', skills: ['light_step'] } },

      // Tier 4
      { id: 'thousand_cuts', name: 'Thousand Cuts', tier: 4, cost: 20, staminaCost: 8, desc: 'Action: Unleash 8 strikes in blur of motion (auto-hit)', icon: '⚡', prerequisites: { type: 'AND', skills: ['flurry', 'vital_strike'] } },
      { id: 'shadow_clone', name: 'Shadow Clone', tier: 4, cost: 20, staminaCost: 7, desc: 'Action: Create mirror image that fights alongside you (5 turns)', icon: '👥', prerequisites: { type: 'AND', skills: ['shadowstep', 'evasion'] } },
      { id: 'assassinate', name: 'Assassinate', tier: 4, cost: 20, staminaCost: 6, desc: 'Action: Instant kill on critical hit (works on most enemies)', icon: '💀', prerequisites: { type: 'AND', skills: ['vital_strike'] } },

      // Tier 5
      { id: 'dagger_mastery', name: 'Dagger Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +2 speed, +3 damage, all attacks have 25% critical chance', icon: '👑', prerequisites: { type: 'OR', skills: ['thousand_cuts', 'shadow_clone', 'assassinate'] } }
    ],

    // POLEARM SKILLS (Tier 1-5) - Reach and defensive weapon
    polearm: [
      // Tier 0
      { id: 'polearm_beginner', name: 'Polearm Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a polearm', icon: '🔱', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'polearm_basics', name: 'Polearm Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 attack bonus with polearms, learn extended reach combat', icon: '🔱', prerequisites: { type: 'AND', skills: ['polearm_beginner'] } },
      { id: 'reach_advantage', name: 'Reach Advantage', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: Attack enemies 10ft away, they cannot reach you in melee', icon: '📏', prerequisites: { type: 'AND', skills: ['polearm_beginner'] } },

      // Tier 2
      { id: 'thrust_attack', name: 'Thrust Attack', tier: 2, cost: 10, staminaCost: 3, desc: 'Action: Piercing attack (+2 damage, ignores 1 AC)', icon: '➡️', prerequisites: { type: 'AND', skills: ['polearm_basics'] } },
      { id: 'polearm_defensive_stance', name: 'Defensive Stance', tier: 2, cost: 10, staminaCost: 1, desc: 'Toggle: +2 AC but cannot move. Costs 1 stamina per turn, lasts max 10 turns', icon: '🛡️', prerequisites: { type: 'AND', skills: ['reach_advantage'] } },
      { id: 'sweep_attack', name: 'Sweep Attack', tier: 2, cost: 10, staminaCost: 4, desc: 'Action: Wide arc hits up to 3 enemies in front of you', icon: '〰️', prerequisites: { type: 'AND', skills: ['polearm_basics'] } },

      // Tier 3
      { id: 'spear_wall', name: 'Spear Wall', tier: 3, cost: 15, staminaCost: 5, desc: 'Action: Block area (10ft wide), enemies take damage entering', icon: '🏗️', prerequisites: { type: 'AND', skills: ['thrust_attack', 'polearm_defensive_stance'] } },
      { id: 'polearm_charge_attack', name: 'Charge Attack', tier: 3, cost: 15, staminaCost: 6, desc: 'Action: Move + attack (+1 damage per 5ft moved, max +6)', icon: '🏃', prerequisites: { type: 'AND', skills: ['thrust_attack'] } },
      { id: 'trip_attack', name: 'Trip Attack', tier: 3, cost: 15, staminaCost: 4, desc: 'Action: Knock target off their feet, causing them to lose their next turn. All attacks against the tripped target gain advantage until their next turn.', icon: '🦵', prerequisites: { type: 'AND', skills: ['sweep_attack'] } },
      { id: 'phalanx_formation', name: 'Phalanx Formation', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: +1 AC for each ally with polearm within 10ft', icon: '👥', prerequisites: { type: 'AND', skills: ['defensive_stance'] } },

      // Tier 4
      { id: 'impale', name: 'Impale', tier: 4, cost: 20, staminaCost: 8, desc: 'Action: Pin target in place (3d6 damage, cannot move for 3 turns)', icon: '📌', prerequisites: { type: 'AND', skills: ['spear_wall', 'polearm_charge_attack'] } },
      { id: 'whirlwind_sweep', name: 'Whirlwind Sweep', tier: 4, cost: 20, staminaCost: 9, desc: 'Action: 360° attack hits all enemies within 15ft (-2 accuracy, friendly fire possible)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['trip_attack', 'phalanx_formation'] } },
      { id: 'fortress_stance', name: 'Fortress Stance', tier: 4, cost: 20, staminaCost: 3, desc: 'Toggle: +4 AC, reflect 50% damage back to attackers. Costs 3 stamina per turn, lasts max 5 turns', icon: '🏰', prerequisites: { type: 'AND', skills: ['phalanx_formation'] } },

      // Tier 5
      { id: 'polearm_mastery', name: 'Polearm Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +20ft reach, +3 damage, opportunity attacks on anyone who moves', icon: '👑', prerequisites: { type: 'OR', skills: ['impale', 'whirlwind_sweep', 'fortress_stance'] } }
    ],

    // HAMMER SKILLS (Tier 1-5) - Heavy crushing weapon
    hammer: [
      // Tier 0
      { id: 'hammer_beginner', name: 'Hammer Beginner', tier: 0, cost: 5, staminaCost: 0, desc: 'Passive: You can now equip a hammer', icon: '🔨', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'hammer_basics', name: 'Hammer Basics', tier: 1, cost: 5, staminaCost: 0, desc: 'Passive: +1 attack bonus with hammers, learn crushing techniques', icon: '🔨', prerequisites: { type: 'AND', skills: ['hammer_beginner'] } },
      { id: 'heavy_impact', name: 'Heavy Impact', tier: 1, cost: 5, staminaCost: 3, desc: 'Action: Slow but devastating blow (+4 damage, -2 accuracy)', icon: '💥', prerequisites: { type: 'AND', skills: ['hammer_beginner'] } },

      // Tier 2
      { id: 'armor_crusher', name: 'Armor Crusher', tier: 2, cost: 10, staminaCost: 4, desc: 'Passive: Hammer attacks ignore 2 points of armor', icon: '💔', prerequisites: { type: 'AND', skills: ['hammer_basics'] } },
      { id: 'stunning_blow', name: 'Stunning Blow', tier: 2, cost: 10, staminaCost: 5, desc: 'Action: 50% chance to apply Incapacitated (cannot act for 1 turn)', icon: '⭐', prerequisites: { type: 'AND', skills: ['heavy_impact'] } },
      { id: 'ground_slam', name: 'Ground Slam', tier: 2, cost: 10, staminaCost: 8, desc: 'Action: Strike ground, knockdown all enemies within 10ft (-1 accuracy, friendly fire possible)', icon: '🌍', prerequisites: { type: 'AND', skills: ['hammer_basics'] } },

      // Tier 3
      { id: 'thunderstrike', name: 'Thunderstrike', tier: 3, cost: 15, staminaCost: 7, desc: 'Action: Lightning-infused attack (2d6 electric + normal damage)', icon: '⚡', prerequisites: { type: 'AND', skills: ['armor_crusher', 'stunning_blow'] } },
      { id: 'earth_shaker', name: 'Earth Shaker', tier: 3, cost: 15, staminaCost: 10, desc: 'Action: Create 20ft radius earthquake (difficult terrain + damage, -2 accuracy, friendly fire possible)', icon: '🌍', prerequisites: { type: 'AND', skills: ['ground_slam'] } },
      { id: 'berserker_swing', name: 'Berserker Swing', tier: 3, cost: 15, staminaCost: 6, desc: 'Action: Wild attack (+6 damage, -3 AC until next turn)', icon: '😤', prerequisites: { type: 'AND', skills: ['heavy_impact'] } },
      { id: 'shield_breaker', name: 'Shield Breaker', tier: 3, cost: 15, staminaCost: 5, desc: 'Action: Destroy shields and remove Protected status from enemies', icon: '🛡️', prerequisites: { type: 'AND', skills: ['armor_crusher'] } },

      // Tier 4
      { id: 'mjolnir_strike', name: 'Mjolnir Strike', tier: 4, cost: 20, staminaCost: 10, desc: 'Action: Hammer returns after thrown (60ft range, pierces through)', icon: '⚡', prerequisites: { type: 'AND', skills: ['thunderstrike', 'earth_shaker'] } },
      { id: 'apocalypse_slam', name: 'Apocalypse Slam', tier: 4, cost: 20, staminaCost: 15, desc: 'Action: Devastating area attack (40ft radius, 4d6 damage, -4 accuracy, friendly fire possible)', icon: '☄️', prerequisites: { type: 'AND', skills: ['berserker_swing', 'shield_breaker'] } },
      { id: 'fortress_buster', name: 'Fortress Buster', tier: 4, cost: 20, staminaCost: 9, desc: 'Action: Destroy any structure or barrier (breaks walls, doors)', icon: '🏗️', prerequisites: { type: 'AND', skills: ['shield_breaker'] } },

      // Tier 5
      { id: 'hammer_mastery', name: 'Hammer Mastery', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: +4 damage, all attacks cause knockdown, immune to Incapacitated', icon: '👑', prerequisites: { type: 'OR', skills: ['mjolnir_strike', 'apocalypse_slam', 'fortress_buster'] } }
    ],

    // UNARMED SKILLS (Tier 1-5) - Martial arts and hand-to-hand combat
    unarmed: [
      // Tier 0
      { id: 'unarmed_beginner', name: 'Unarmed Beginner', tier: 0, cost: 0, staminaCost: 0, desc: 'Passive: All characters can do unarmed attacks of 1d4 damage', icon: '👊', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 1
      { id: 'basic_mix_martial_arts', name: 'Basic Mix Martial Arts', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: +2 damage to all unarmed attacks', icon: '🥊', prerequisites: { type: 'AND', skills: ['unarmed_beginner'] } },
      { id: 'basic_combo', name: 'Basic Combo - "The Ol\' 1 - 2"', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: Can do 2 basic attacks per turn when unarmed', icon: '👊', prerequisites: { type: 'AND', skills: ['unarmed_beginner'] } },
      { id: 'stance_training', name: 'Stance Training', tier: 1, cost: 8, staminaCost: 0, desc: 'Passive: +1 to accuracy with unarmed attacks', icon: '🧘', prerequisites: { type: 'AND', skills: ['unarmed_beginner'] } },

      // Tier 2
      { id: 'flurry_of_blows', name: 'Flurry of Blows', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Can make 3 Basic attacks per turn when unarmed (upgrade of Basic combo)', icon: '⚡', prerequisites: { type: 'AND', skills: ['basic_combo'] } },
      { id: 'hardened_fists', name: 'Hardened Fists', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Unarmed attacks roll 1d6 each', icon: '💪', prerequisites: { type: 'AND', skills: ['basic_mix_martial_arts'] } },
      { id: 'defensive_maneuvers', name: 'Defensive Maneuvers', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Cannot equip Medium or Heavy Armor, but gain +2 Physical Defence and +2 Magical Defence when unarmed', icon: '🛡️', prerequisites: { type: 'AND', skills: ['stance_training'] } },
      { id: 'air_fist_blast', name: 'Air Fist Blast', tier: 2, cost: 15, staminaCost: 0, desc: 'Passive: Unarmed attacks can hit targets up to 15 feet away', icon: '💨', prerequisites: { type: 'AND', skills: ['basic_mix_martial_arts'] } },

      // Tier 3
      { id: 'counter_strike', name: 'Counter Strike', tier: 3, cost: 23, staminaCost: 2, desc: 'Reaction: When hit by a physical attack, can make an unarmed attack as a reaction', icon: '🔄', prerequisites: { type: 'AND', skills: ['flurry_of_blows'] } },
      { id: 'vital_strike', name: 'Vital Strike', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Critical Hits deal 1 extra damage die', icon: '💔', prerequisites: { type: 'AND', skills: ['hardened_fists'] } },
      { id: 'flow_state', name: 'Flow State', tier: 3, cost: 23, staminaCost: 3, desc: 'Active: +1 to accuracy and damage for each consecutive unarmed attack in a turn (3 Stamina per attack)', icon: '🌀', prerequisites: { type: 'AND', skills: ['vital_strike'] } },
      { id: 'unbreakable', name: 'Unbreakable', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: +4 Physical Defence and +4 Magical Defence (upgrade of Defensive Maneuvers)', icon: '💎', prerequisites: { type: 'AND', skills: ['defensive_maneuvers'] } },
      { id: 'combo_mastery', name: 'Combo Mastery', tier: 3, cost: 23, staminaCost: 0, desc: 'Passive: Can chain up to 4 Basic attacks per turn when unarmed (upgrade of Flurry of Blows)', icon: '⚡', prerequisites: { type: 'AND', skills: ['flurry_of_blows'] } },

      // Tier 4
      { id: 'perfect_form', name: 'Perfect Form', tier: 4, cost: 30, staminaCost: 0, desc: 'Passive: Unarmed basic attacks deal 1d10 +4 damage (upgrade of Hardened Fists and Basic Mix martial arts)', icon: '✨', prerequisites: { type: 'AND', skills: ['hardened_fists', 'basic_mix_martial_arts'] } },
      { id: 'death_touch', name: 'Death Touch', tier: 4, cost: 30, staminaCost: 5, desc: 'Active: Attempt to Immobilize a target with an unarmed attack (50% chance, roll 11 or higher)', icon: '💀', prerequisites: { type: 'AND', skills: ['vital_strike'] } },
      { id: 'whirlwind_strike', name: 'Whirlwind Strike', tier: 4, cost: 30, staminaCost: 8, desc: 'Active: Attack all enemies within 10 feet for 2d10 damage + 1d8 wind damage', icon: '🌪️', prerequisites: { type: 'AND', skills: ['combo_mastery'] } },
      { id: 'face_the_elements', name: 'Face the Elements', tier: 4, cost: 30, staminaCost: 1, desc: 'Reaction: Reduce 3 damage you would take by using 1 Stamina each (up to 30 damage)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['unbreakable'] } },
      { id: 'pressure_point_mastery', name: 'Pressure Point Mastery', tier: 4, cost: 30, staminaCost: 4, desc: 'Action: Unarmed attacks have a 75% chance (roll 6 or higher) to apply Incapacitated (reference to status-effects.js)', icon: '👆', prerequisites: { type: 'AND', skills: ['death_touch'] } },

      // Tier 5
      { id: 'unarmed_mastery', name: 'Unarmed Mastery', tier: 5, cost: 38, staminaCost: 0, desc: 'Passive: Unarmed basic attacks deal 2d10 base damage, and gain +4 damage with all unarmed skill attacks, critical hits restore 5 stamina', icon: '👑', prerequisites: { type: 'OR', skills: ['perfect_form', 'whirlwind_strike', 'pressure_point_mastery'] } },
      { id: 'one_punch_style', name: 'One Punch Style', tier: 5, cost: 38, staminaCost: 30, desc: 'Ultimate: Deal 10d10 damage. If you miss, take 3d10 damage. If you hit, Skip your next turn', icon: '💥', prerequisites: { type: 'AND', skills: ['unarmed_mastery'] } }
    ]
  },

  magic: {
    // FIRE MAGIC (Tier 1-5)
    fire: [
      // Tier 1
      { id: 'fire_spark', name: 'Fire Spark', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Small fire projectile (1d4 fire damage, 30ft range)', icon: '🔥', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'warm_hands', name: 'Warm Hands', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: Create light (30ft radius) and restore 10% of Max HP of self, or nearby (5ft) ally', icon: '🤲', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'fireball', name: 'Fireball', tier: 2, cost: 10, staminaCost: 4, upgrade: 'fire_spark', desc: 'Spell: Fire projectile (2d6 fire damage, 60ft range)', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_spark'] } },
      { id: 'fire_shield', name: 'Fire Shield', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: Apply Protected (absorb 3 attacks + attackers take 1d4 fire damage)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['warm_hands'] } },
      { id: 'ignite', name: 'Ignite', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: Apply Burn (1 fire damage/turn + Strength -2 for 4 turns)', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_spark'] } },

      // Tier 3
      { id: 'fire_wall', name: 'Fire Wall', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Create 30ft wall of flames, blocks passage and damages (2d4/turn)', icon: '🧱', prerequisites: { type: 'AND', skills: ['fireball'] } },
      { id: 'explosion', name: 'Explosion', tier: 3, cost: 15, staminaCost: 9, desc: 'Spell: 15ft radius explosion (3d6 fire damage to all inside, -1 accuracy, friendly fire possible)', icon: '💥', prerequisites: { type: 'AND', skills: ['fireball', 'ignite'] } },
      { id: 'phoenix_form', name: 'Phoenix Form', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: Apply Enhanced Mobility (flight + immunity to immobilization). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '🦅', prerequisites: { type: 'AND', skills: ['fire_shield'] }, elementalType: 'fire' },
      { id: 'fire_attunement', name: 'Fire Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to fire magic. GRANTS: Fire resistance 50% (-1), Ice weakness 200% (+1)', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_shield', 'ignite'] }, elementalType: 'fire' },
      { id: 'fire_whip', name: 'Fire Whip', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: 15ft reach fire attack (2d4 damage), can grapple', icon: '🔥', prerequisites: { type: 'AND', skills: ['fire_wall'] } },

      // Tier 4
      { id: 'meteor', name: 'Meteor', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: Devastating overhead attack (6d6 fire damage, 20ft radius, -2 accuracy, friendly fire possible). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '☄️', prerequisites: { type: 'AND', skills: ['explosion'] }, elementalType: 'fire' },
      { id: 'inferno', name: 'Inferno', tier: 4, cost: 20, staminaCost: 15, desc: 'Spell: Set 100ft radius ablaze (2d6/turn for 1 minute, -4 accuracy, friendly fire possible). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '🔥', prerequisites: { type: 'AND', skills: ['phoenix_form', 'fire_whip'] }, elementalType: 'fire' },
      { id: 'fire_tornado', name: 'Fire Tornado', tier: 4, cost: 20, staminaCost: 11, desc: 'Spell: Moving 30ft tall fire column (4d6 damage, moves 30ft/turn). GRANTS: Fire resistance (50%), Ice weakness (200%)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['fire_wall', 'explosion'] }, elementalType: 'fire' },

      // Tier 5
      { id: 'fire_supremacy', name: 'Fire Supremacy', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with fire for 3 rounds. Gain immunity to fire damage, +50% fire spell damage, all attacks apply Burn, and regenerate 3 HP/turn. Can ignite objects by touch.', icon: '�', prerequisites: { type: 'AND', skills: ['meteor', 'inferno', 'fire_tornado'] } }
    ],

    // ICE MAGIC (Tier 1-5)
    ice: [
      // Tier 1
      { id: 'ice_shard', name: 'Ice Shard', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Sharp ice projectile (1d4 cold damage, 30ft range)', icon: '🧊', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'frost_touch', name: 'Frost Touch', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: Touch attack applies Weakened (all stats -2 for 4 turns)', icon: '❄️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'ice_armor', name: 'Ice Armor', tier: 2, cost: 10, staminaCost: 4, desc: 'Spell: +3 AC, immunity to fire damage (10 minutes)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['frost_touch'] } },
      { id: 'ice_spear', name: 'Ice Spear', tier: 2, cost: 10, staminaCost: 4, upgrade: 'ice_shard', desc: 'Spell: Long range piercing ice attack (2d4 cold damage, 60ft)', icon: '🏹', prerequisites: { type: 'AND', skills: ['ice_shard'] } },
      { id: 'freeze', name: 'Freeze', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Apply Immobilized (cannot move but can attack for 3 turns)', icon: '🧊', prerequisites: { type: 'AND', skills: ['frost_touch'] } },

      // Tier 3
      { id: 'ice_wall', name: 'Ice Wall', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Create 30ft wall of ice (blocks passage, 20 HP)', icon: '🧱', prerequisites: { type: 'AND', skills: ['ice_armor'] } },
      { id: 'blizzard', name: 'Blizzard', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: 20ft radius cold storm (2d4 damage + apply Weakened to all inside). GRANTS: Ice resistance (50%), Fire weakness (200%)', icon: '🌨️', prerequisites: { type: 'AND', skills: ['ice_spear', 'freeze'] }, elementalType: 'ice' },
      { id: 'ice_attunement', name: 'Ice Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to ice magic. GRANTS: Ice resistance 50% (-1), Fire weakness 200% (+1)', icon: '❄️', prerequisites: { type: 'AND', skills: ['ice_armor', 'freeze'] }, elementalType: 'ice' },
      { id: 'ice_prison', name: 'Ice Prison', tier: 3, cost: 15, staminaCost: 7, desc: 'Spell: Trap enemy in ice cage (immobile until 15 damage dealt)', icon: '🔒', prerequisites: { type: 'AND', skills: ['freeze'] } },
      { id: 'frost_nova', name: 'Frost Nova', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Freeze all enemies within 15ft (1 turn + slow)', icon: '💫', prerequisites: { type: 'AND', skills: ['ice_wall'] } },

      // Tier 4
      { id: 'absolute_zero', name: 'Absolute Zero', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: Instantly freeze any target (no save, 3 turns). GRANTS: Ice resistance (50%), Water resistance (25%), Fire weakness (200%), Lightning weakness (400%)', icon: '❄️', prerequisites: { type: 'AND', skills: ['ice_prison'] }, elementalType: 'ice' },
      { id: 'ice_age', name: 'Ice Age', tier: 4, cost: 20, staminaCost: 15, desc: 'Spell: Freeze 200ft radius (1d6 cold/turn, all slowed). GRANTS: Ice resistance (50%), Water resistance (25%), Fire weakness (200%), Lightning weakness (400%)', icon: '🧊', prerequisites: { type: 'AND', skills: ['blizzard', 'frost_nova'] }, elementalType: 'ice' },
      { id: 'glacier', name: 'Glacier', tier: 4, cost: 20, staminaCost: 10, desc: 'Spell: Massive 50ft ice wall that moves 20ft/turn. GRANTS: Ice resistance (50%), Water resistance (25%), Fire weakness (200%), Lightning weakness (400%)', icon: '🏔️', prerequisites: { type: 'AND', skills: ['ice_wall'] }, elementalType: 'ice' },
      { id: 'ice_dominion', name: 'Ice Dominion', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master ice magic, enhanced ice spell effects. GRANTS: Ice resistance 50% (-1), Fire weakness 200% (+1)', icon: '❄️', prerequisites: { type: 'AND', skills: ['ice_attunement'] }, elementalType: 'ice' },

      // Tier 5
      { id: 'ice_supremacy', name: 'Ice Supremacy', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with ice for 3 rounds. Gain immunity to ice/cold damage, +50% ice spell damage, all attacks apply Weakened, and create frozen terrain (difficult terrain) in 10ft radius. Temperature drops 50°F around you.', icon: '❄️', prerequisites: { type: 'AND', skills: ['absolute_zero', 'ice_age', 'glacier'] } }
    ],

    // LIGHTNING MAGIC (Tier 1-5)
    lightning: [
      // Tier 1
      { id: 'spark', name: 'Spark', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Small electrical discharge (1d4 lightning damage, 20ft)', icon: '⚡', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'static_charge', name: 'Static Charge', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: Build electrical energy (+1 damage to next lightning spell)', icon: '🔋', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'lightning_bolt', name: 'Lightning Bolt', tier: 2, cost: 10, staminaCost: 4, upgrade: 'spark', desc: 'Spell: Fast electrical line attack (2d6 lightning, 100ft range)', icon: '⚡', prerequisites: { type: 'AND', skills: ['spark'] } },
      { id: 'shock', name: 'Shock', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: Stun target for 1 turn (save negates)', icon: '😵', prerequisites: { type: 'AND', skills: ['static_charge'] } },
      { id: 'chain_lightning', name: 'Chain Lightning', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Lightning jumps to 3 additional targets (-1 damage each)', icon: '🔗', prerequisites: { type: 'AND', skills: ['spark'] } },

      // Tier 3
      { id: 'thunder_clap', name: 'Thunder Clap', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: 20ft radius sound blast (2d4 damage + deafen 1 turn)', icon: '🔊', prerequisites: { type: 'AND', skills: ['lightning_bolt'] } },
      { id: 'electric_field', name: 'Electric Field', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: 30ft zone deals 1d6 lightning to anyone entering (1 min)', icon: '⚡', prerequisites: { type: 'AND', skills: ['shock', 'chain_lightning'] } },
      { id: 'lightning_attunement', name: 'Lightning Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to lightning magic. GRANTS: Lightning resistance 50% (-1), Water weakness 200% (+1)', icon: '⚡', prerequisites: { type: 'AND', skills: ['shock', 'chain_lightning'] }, elementalType: 'lightning' },
      { id: 'lightning_speed', name: 'Lightning Speed', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: +3 Speed, extra move action (3 turns)', icon: '💨', prerequisites: { type: 'AND', skills: ['shock'] } },
      { id: 'overcharge', name: 'Overcharge', tier: 3, cost: 15, staminaCost: 7, desc: 'Spell: Next spell deals maximum damage (no rolling)', icon: '🔋', prerequisites: { type: 'AND', skills: ['static_charge'] } },

      // Tier 4
      { id: 'lightning_storm', name: 'Lightning Storm', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: 8 random lightning strikes in 50ft radius (3d6 each)', icon: '⛈️', prerequisites: { type: 'AND', skills: ['thunder_clap', 'electric_field'] } },
      { id: 'ball_lightning', name: 'Ball Lightning', tier: 4, cost: 20, staminaCost: 10, desc: 'Spell: Slow orb (20ft/turn) explodes for 4d6 in 15ft radius', icon: '⚡', prerequisites: { type: 'AND', skills: ['lightning_speed'] } },
      { id: 'emp', name: 'EMP', tier: 4, cost: 20, staminaCost: 8, desc: 'Spell: 40ft radius disables all magic for 1 minute', icon: '📵', prerequisites: { type: 'AND', skills: ['overcharge'] } },
      { id: 'storm_mastery', name: 'Storm Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master lightning magic, enhanced electrical control. GRANTS: Lightning resistance 50% (-1), Water weakness 200% (+1)', icon: '⚡', prerequisites: { type: 'AND', skills: ['lightning_attunement'] }, elementalType: 'lightning' },

      // Tier 5
      { id: 'lightning_supremacy', name: 'Lightning Supremacy', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with lightning for 3 rounds. Gain immunity to lightning damage, +50% movement speed, +50% lightning spell damage, all attacks apply Incapacitated, and can teleport 30ft as bonus action each turn.', icon: '⚡', prerequisites: { type: 'AND', skills: ['lightning_storm', 'ball_lightning', 'emp'] } }
    ],

    // EARTH MAGIC (Tier 1-5)
    earth: [
      // Tier 1
      { id: 'stone_throw', name: 'Stone Throw', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Hurl rock projectile (1d6 damage, 40ft range)', icon: '🪨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'earth_sense', name: 'Earth Sense', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: Detect movement through ground (100ft radius)', icon: '🌍', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'stone_armor', name: 'Stone Armor', tier: 2, cost: 10, staminaCost: 4, desc: 'Spell: Rock shell (+3 AC, -1 Speed for 10 minutes)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['stone_throw'] } },
      { id: 'earth_spike', name: 'Earth Spike', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Ground spike erupts (2d4 damage, knockdown)', icon: '⬆️', prerequisites: { type: 'AND', skills: ['earth_sense'] } },
      { id: 'mud_trap', name: 'Mud Trap', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: Create 15ft difficult terrain, slows enemies 50%', icon: '🟫', prerequisites: { type: 'AND', skills: ['earth_sense'] } },

      // Tier 3
      { id: 'stone_wall', name: 'Stone Wall', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Create 40ft stone barrier (blocks movement, provides cover)', icon: '🧱', prerequisites: { type: 'AND', skills: ['stone_armor'] } },
      { id: 'earthquake', name: 'Earthquake', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: 25ft radius tremor (2d6 damage, knockdown all)', icon: '🌍', prerequisites: { type: 'AND', skills: ['earth_spike', 'mud_trap'] } },
      { id: 'earth_attunement', name: 'Earth Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to earth magic. GRANTS: Earth resistance 50% (-1), Wind weakness 200% (+1)', icon: '🌍', prerequisites: { type: 'AND', skills: ['stone_armor', 'mud_trap'] }, elementalType: 'earth' },
      { id: 'stone_spear', name: 'Stone Spear', tier: 3, cost: 15, staminaCost: 7, desc: 'Spell: Piercing rock lance (3d4 damage, 60ft range)', icon: '🗡️', prerequisites: { type: 'AND', skills: ['earth_spike'] } },
      { id: 'earth_shield', name: 'Earth Shield', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: Apply Protected (floating stones absorb next 3 attacks completely)', icon: '🪨', prerequisites: { type: 'AND', skills: ['stone_armor'] } },

      // Tier 4
      { id: 'mountain_crush', name: 'Mountain Crush', tier: 4, cost: 20, staminaCost: 12, upgrade: 'stone_throw', desc: 'Spell: Massive boulder falls from sky (5d6 in 20ft radius)', icon: '🏔️', prerequisites: { type: 'AND', skills: ['stone_wall', 'earthquake'] } },
      { id: 'petrify', name: 'Petrify', tier: 4, cost: 20, staminaCost: 10, desc: 'Spell: Apply Immobilized (cannot move but can attack + +5 AC for 3 turns)', icon: '🗿', prerequisites: { type: 'AND', skills: ['stone_spear', 'earth_shield'] } },
      { id: 'tectonic_shift', name: 'Tectonic Shift', tier: 4, cost: 20, staminaCost: 15, desc: 'Spell: Reshape 100ft area terrain for 24 hours', icon: '🌋', prerequisites: { type: 'AND', skills: ['earthquake'] } },
      { id: 'stone_mastery', name: 'Stone Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master earth magic, enhanced stone manipulation. GRANTS: Earth resistance 50% (-1), Wind weakness 200% (+1)', icon: '🌍', prerequisites: { type: 'AND', skills: ['earth_attunement'] }, elementalType: 'earth' },

      // Tier 5
      { id: 'earth_supremacy', name: 'Earth Supremacy', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with earth for 3 rounds. Gain immunity to earth damage, +5 AC from stone skin, +50% earth spell damage, all attacks apply Immobilized, and can burrow through ground at half speed.', icon: '🌍', prerequisites: { type: 'AND', skills: ['mountain_crush', 'petrify', 'tectonic_shift'] } }
    ],

    // WIND MAGIC (Tier 1-5)
    wind: [
      // Tier 1
      { id: 'gust', name: 'Gust', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Wind push (knockback 10ft, extinguish flames)', icon: '💨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'feather_fall', name: 'Feather Fall', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: Slow falling (no fall damage for 1 minute)', icon: '🪶', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'wind_blade', name: 'Wind Blade', tier: 2, cost: 10, staminaCost: 4, desc: 'Spell: Cutting air slash (2d4 damage, 50ft range)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['gust'] } },
      { id: 'levitate', name: 'Levitate', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Float in air (20ft height, 5 minutes)', icon: '🎈', prerequisites: { type: 'AND', skills: ['feather_fall'] } },
      { id: 'wind_barrier', name: 'Wind Barrier', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: Deflect projectiles (+4 AC vs ranged for 5 turns)', icon: '🌀', prerequisites: { type: 'AND', skills: ['gust'] } },

      // Tier 3
      { id: 'flight', name: 'Flight', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: True flight (60ft speed, 10 minutes)', icon: '🕊️', prerequisites: { type: 'AND', skills: ['levitate', 'wind_barrier'] } },
      { id: 'tornado', name: 'Tornado', tier: 3, cost: 15, staminaCost: 10, desc: 'Spell: 15ft radius whirlwind (3d4 damage, pulls enemies in)', icon: '🌪️', prerequisites: { type: 'AND', skills: ['wind_blade'] } },
      { id: 'wind_attunement', name: 'Wind Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to wind magic. GRANTS: Wind resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💨', prerequisites: { type: 'AND', skills: ['wind_barrier', 'wind_blade'] }, elementalType: 'wind' },
      { id: 'suffocate', name: 'Suffocate', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Remove air around target (2d4/turn for 3 turns)', icon: '😵', prerequisites: { type: 'AND', skills: ['wind_blade'] } },
      { id: 'wind_walk', name: 'Wind Walk', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: Become incorporeal mist (immune to physical damage)', icon: '☁️', prerequisites: { type: 'AND', skills: ['levitate'] } },

      // Tier 4
      { id: 'hurricane', name: 'Hurricane', tier: 4, cost: 20, staminaCost: 15, upgrade: 'gust', desc: 'Spell: Massive storm 50ft radius (4d6 damage, difficult terrain)', icon: '🌀', prerequisites: { type: 'AND', skills: ['flight', 'tornado'] } },
      { id: 'wind_prison', name: 'Wind Prison', tier: 4, cost: 20, staminaCost: 8, desc: 'Spell: Trap target in air pocket (cannot move or act)', icon: '🟦', prerequisites: { type: 'AND', skills: ['suffocate', 'wind_walk'] } },
      { id: 'atmospheric_control', name: 'Atmospheric Control', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: Control weather in 1 mile radius for 1 hour', icon: '⛅', prerequisites: { type: 'AND', skills: ['wind_walk'] } },
      { id: 'gale_mastery', name: 'Gale Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master wind magic, enhanced atmospheric control. GRANTS: Wind resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💨', prerequisites: { type: 'AND', skills: ['wind_attunement'] }, elementalType: 'wind' },

      // Tier 5
      { id: 'wind_mastery', name: 'Wind Mastery', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with the wind for 3 rounds. Gain flight, immunity to ground effects, +50% movement speed, and all attacks push enemies back 10ft. Can pass through enemy spaces without provoking attacks.', icon: '🌪️', prerequisites: { type: 'AND', skills: ['wind_walk', 'hurricane', 'wind_barrier'] } }
    ],

    // WATER MAGIC (Tier 1-5)
    water: [
      // Tier 1
      { id: 'water_splash', name: 'Water Splash', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Water projectile (1d4 damage, extinguish fire)', icon: '💧', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'purify_water', name: 'Purify Water', tier: 1, cost: 5, staminaCost: 1, desc: 'Utility: Clean any liquid, remove poison from drinks', icon: '🚰', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'water_whip', name: 'Water Whip', tier: 2, cost: 10, staminaCost: 4, desc: 'Spell: Flexible water tendril (2d4 damage, 20ft reach)', icon: '🌊', prerequisites: { type: 'AND', skills: ['water_splash'] } },
      { id: 'heal_wounds', name: 'Heal Wounds', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Restore 2d4+2 HP instantly OR apply Regeneration status', icon: '💚', prerequisites: { type: 'AND', skills: ['purify_water'] } },
      { id: 'create_water', name: 'Create Water', tier: 2, cost: 10, staminaCost: 3, desc: 'Utility: Summon fresh water (10 gallons), put out fires', icon: '🫗', prerequisites: { type: 'AND', skills: ['water_splash'] } },

      // Tier 3
      { id: 'tidal_wave', name: 'Tidal Wave', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: 30ft cone wave (3d4 damage, knockdown)', icon: '🌊', prerequisites: { type: 'AND', skills: ['water_whip', 'create_water'] } },
      { id: 'water_breathing', name: 'Water Breathing', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Apply Enhanced Mobility (water breathing + swim speed)', icon: '🫧', prerequisites: { type: 'AND', skills: ['heal_wounds'] } },
      { id: 'blood_control', name: 'Blood Control', tier: 3, cost: 15, staminaCost: 7, desc: 'Spell: Apply Mind Controlled (target moves as you direct for 3 turns)', icon: '🩸', prerequisites: { type: 'AND', skills: ['heal_wounds'] } },
      { id: 'water_attunement', name: 'Water Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to water magic. GRANTS: Water resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💧', prerequisites: { type: 'AND', skills: ['heal_wounds', 'create_water'] }, elementalType: 'water' },
      { id: 'water_shield', name: 'Water Shield', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: Apply Protected (flowing barrier absorbs 3 attacks + fire immunity)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['create_water'] } },

      // Tier 4
      { id: 'maelstrom', name: 'Maelstrom', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: 40ft whirlpool pulls enemies in (4d4 damage/turn)', icon: '🌀', prerequisites: { type: 'AND', skills: ['tidal_wave', 'water_breathing'] } },
      { id: 'blood_boil', name: 'Blood Boil', tier: 4, cost: 20, staminaCost: 10, desc: 'Spell: Superheat target\'s blood (5d4 damage, no save)', icon: '🩸', prerequisites: { type: 'AND', skills: ['blood_control', 'water_shield'] } },
      { id: 'tsunami', name: 'Tsunami', tier: 4, cost: 20, staminaCost: 15, upgrade: 'water_splash', desc: 'Spell: Massive wave 100ft long (6d4 damage, reshape terrain)', icon: '🌊', prerequisites: { type: 'AND', skills: ['water_shield'] } },
      { id: 'hydro_mastery', name: 'Hydro Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master water magic, enhanced fluid manipulation. GRANTS: Water resistance 50% (-1), Lightning weakness 200% (+1)', icon: '💧', prerequisites: { type: 'AND', skills: ['water_attunement'] }, elementalType: 'water' },

      // Tier 5
      { id: 'water_mastery', name: 'Water Mastery', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with water for 3 rounds. Gain immunity to water damage, can move through any liquid at normal speed, +50% water spell damage, all attacks heal you for 25% of damage dealt, and can breathe underwater indefinitely.', icon: '🌊', prerequisites: { type: 'AND', skills: ['maelstrom', 'blood_boil', 'tsunami'] } }
    ],

    // DARKNESS MAGIC (Tier 1-5)
    darkness: [
      // Tier 1
      { id: 'shadow_bolt', name: 'Shadow Bolt', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Dark energy projectile (1d6 damage, 40ft range)', icon: '🌑', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'darkvision', name: 'Darkvision', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: See in complete darkness (1 hour)', icon: '👁️', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'shadow_step', name: 'Shadow Step', tier: 2, cost: 10, staminaCost: 4, desc: 'Spell: Teleport between shadows (60ft range)', icon: '👤', prerequisites: { type: 'AND', skills: ['shadow_bolt'] } },
      { id: 'fear', name: 'Fear', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Apply Mind Controlled (target flees in terror for 3 turns)', icon: '😱', prerequisites: { type: 'AND', skills: ['darkvision'] } },
      { id: 'darkness', name: 'Darkness', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: Create 20ft radius of magical darkness', icon: '⚫', prerequisites: { type: 'AND', skills: ['shadow_bolt'] } },

      // Tier 3
      { id: 'shadow_duplicate', name: 'Shadow Clone', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: Create dark duplicate (50% your stats, 5 turns)', icon: '👥', prerequisites: { type: 'AND', skills: ['shadow_step', 'darkness'] } },
      { id: 'nightmare', name: 'Nightmare', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Sleeping target takes 2d6 psychic damage', icon: '💭', prerequisites: { type: 'AND', skills: ['fear'] } },
      { id: 'life_drain', name: 'Life Drain', tier: 3, cost: 15, staminaCost: 7, desc: 'Spell: Steal 2d4 HP from target, heal yourself same amount', icon: '🖤', prerequisites: { type: 'AND', skills: ['fear'] } },
      { id: 'darkness_attunement', name: 'Darkness Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to darkness magic. GRANTS: Darkness resistance 50% (-1), Light weakness 200% (+1)', icon: '🌑', prerequisites: { type: 'AND', skills: ['fear', 'darkness'] }, elementalType: 'darkness' },
      { id: 'shadow_armor', name: 'Shadow Armor', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: Darkness cloaks you (+3 AC, +2 Stealth)', icon: '🥷', prerequisites: { type: 'AND', skills: ['darkness'] } },

      // Tier 4
      { id: 'void_prison', name: 'Void Prison', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: Banish target to shadow realm (removed for 3 turns)', icon: '🕳️', prerequisites: { type: 'AND', skills: ['shadow_duplicate', 'nightmare'] } },
      { id: 'soul_steal', name: 'Soul Steal', tier: 4, cost: 20, staminaCost: 10, desc: 'Spell: Drain 1 point from all target stats for 24 hours', icon: '👻', prerequisites: { type: 'AND', skills: ['life_drain', 'shadow_armor'] } },
      { id: 'eclipse', name: 'Eclipse', tier: 4, cost: 20, staminaCost: 15, desc: 'Spell: 200ft radius darkness, all enemies take 1d6/turn', icon: '🌚', prerequisites: { type: 'AND', skills: ['shadow_armor'] } },
      { id: 'void_mastery', name: 'Void Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master darkness magic, enhanced shadow manipulation. GRANTS: Darkness resistance 50% (-1), Light weakness 200% (+1)', icon: '🌑', prerequisites: { type: 'AND', skills: ['darkness_attunement'] }, elementalType: 'darkness' },

      // Tier 5
      { id: 'darkness_mastery', name: 'Darkness Mastery', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with darkness for 3 rounds. Gain immunity to darkness damage, permanent invisibility while in shadows, +50% darkness spell damage, all attacks apply Mind Controlled (fear), and can phase through walls for 1 turn per use.', icon: '🌑', prerequisites: { type: 'AND', skills: ['void_prison', 'soul_steal', 'eclipse'] } }
    ],

    // LIGHT MAGIC (Tier 1-5)
    light: [
      // Tier 1
      { id: 'light_ray', name: 'Light Ray', tier: 1, cost: 5, staminaCost: 2, desc: 'Spell: Radiant beam (1d6 damage, blinds for 1 turn)', icon: '☀️', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'illuminate', name: 'Illuminate', tier: 1, cost: 5, staminaCost: 1, desc: 'Spell: Bright light (60ft radius, reveals invisible)', icon: '💡', prerequisites: { type: 'NONE', skills: [] } },

      // Tier 2
      { id: 'healing_light', name: 'Healing Light', tier: 2, cost: 10, staminaCost: 4, desc: 'Spell: Restore 2d4+3 HP instantly + apply Regeneration (immunity to poison)', icon: '✨', prerequisites: { type: 'AND', skills: ['light_ray'] } },
      { id: 'purify', name: 'Purify', tier: 2, cost: 10, staminaCost: 5, desc: 'Spell: Remove poison, disease, and curses', icon: '🧽', prerequisites: { type: 'AND', skills: ['illuminate'] } },
      { id: 'blinding_flash', name: 'Blinding Flash', tier: 2, cost: 10, staminaCost: 3, desc: 'Spell: 15ft radius flash blinds all enemies for 1 turn', icon: '⚡', prerequisites: { type: 'AND', skills: ['light_ray'] } },

      // Tier 3
      { id: 'holy_weapon', name: 'Holy Weapon', tier: 3, cost: 15, staminaCost: 6, desc: 'Spell: Apply Weapon Enchanted (+1d6 radiant damage, extra vs undead)', icon: '⚔️', prerequisites: { type: 'AND', skills: ['healing_light', 'purify'] } },
      { id: 'sanctuary', name: 'Sanctuary', tier: 3, cost: 15, staminaCost: 8, desc: 'Spell: Protected area (enemies cannot enter 20ft radius)', icon: '🛡️', prerequisites: { type: 'AND', skills: ['purify'] } },
      { id: 'light_attunement', name: 'Light Attunement', tier: 3, cost: 15, staminaCost: 0, desc: 'Passive: Become attuned to light magic. GRANTS: Light resistance 50% (-1), Darkness weakness 200% (+1)', icon: '☀️', prerequisites: { type: 'AND', skills: ['healing_light', 'purify'] }, elementalType: 'light' },
      { id: 'laser_beam', name: 'Laser Beam', tier: 3, cost: 15, staminaCost: 7, desc: 'Spell: Concentrated light (3d6 damage, pierces armor)', icon: '🔆', prerequisites: { type: 'AND', skills: ['blinding_flash'] } },
      { id: 'light_shield', name: 'Light Shield', tier: 3, cost: 15, staminaCost: 5, desc: 'Spell: Radiant barrier (+3 AC, reflects dark magic)', icon: '🌟', prerequisites: { type: 'AND', skills: ['blinding_flash'] } },

      // Tier 4
      { id: 'resurrection', name: 'Resurrection', tier: 4, cost: 20, staminaCost: 15, desc: 'Spell: Bring ally back to life (once per day)', icon: '🕊️', prerequisites: { type: 'AND', skills: ['holy_weapon', 'sanctuary'] } },
      { id: 'solar_flare', name: 'Solar Flare', tier: 4, cost: 20, staminaCost: 12, desc: 'Spell: 40ft radius explosion (5d6 radiant damage)', icon: '🌟', prerequisites: { type: 'AND', skills: ['laser_beam', 'light_shield'] } },
      { id: 'divine_judgment', name: 'Divine Judgment', tier: 4, cost: 20, staminaCost: 10, desc: 'Spell: Target takes damage equal to their max HP × 0.5', icon: '⚖️', prerequisites: { type: 'AND', skills: ['light_shield'] } },
      { id: 'radiant_mastery', name: 'Radiant Mastery', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Master light magic, enhanced radiant energy. GRANTS: Light resistance 50% (-1), Darkness weakness 200% (+1)', icon: '☀️', prerequisites: { type: 'AND', skills: ['light_attunement'] }, elementalType: 'light' },

      // Tier 5
      { id: 'light_mastery', name: 'Light Mastery', tier: 5, cost: 25, staminaCost: 15, desc: 'Action (3 uses per day): Become one with light for 3 rounds. Gain immunity to light/radiant damage, emit bright light (30ft radius blinds enemies), +50% light spell damage, all attacks apply Mind Controlled (charm), and can teleport to any bright light source within 100ft.', icon: '☀️', prerequisites: { type: 'AND', skills: ['resurrection', 'solar_flare', 'divine_judgment'] } }
    ]
  },

  professions: {
    // SIMPLIFIED PROFESSIONS SYSTEM
    smithing: [
      { id: 'smithing_basic', name: 'Smithing: Basic', tier: 1, cost: 15, staminaCost: 0, desc: 'Craft basic weapons and armor.', icon: '🔨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'smithing_advanced', name: 'Smithing: Advanced', tier: 2, cost: 50, staminaCost: 0, desc: 'Craft advanced weapons and armor (+1 bonus).', icon: '⚔️', prerequisites: { type: 'AND', skills: ['smithing_basic'] } },
      { id: 'smithing_master', name: 'Smithing: Master', tier: 3, cost: 100, staminaCost: 0, desc: 'Craft masterwork items (+2 bonus, access rare materials).', icon: '🏆', prerequisites: { type: 'AND', skills: ['smithing_advanced'] } }
    ],
    alchemy: [
      { id: 'alchemy_basic', name: 'Alchemy: Basic', tier: 1, cost: 15, staminaCost: 0, desc: 'Mix basic potions and remedies.', icon: '🧪', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'alchemy_advanced', name: 'Alchemy: Advanced', tier: 2, cost: 50, staminaCost: 0, desc: 'Create advanced potions and toxins (+1 effect).', icon: '☠️', prerequisites: { type: 'AND', skills: ['alchemy_basic'] } },
      { id: 'alchemy_master', name: 'Alchemy: Master', tier: 3, cost: 100, staminaCost: 0, desc: 'Brew masterwork potions (+2 effect, rare ingredients).', icon: '💥', prerequisites: { type: 'AND', skills: ['alchemy_advanced'] } }
    ],
    enchanting: [
      { id: 'enchanting_basic', name: 'Enchanting: Basic', tier: 1, cost: 15, staminaCost: 0, desc: 'Add simple magical effects to items.', icon: '✨', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'enchanting_advanced', name: 'Enchanting: Advanced', tier: 2, cost: 50, staminaCost: 0, desc: 'Add advanced magical effects (+1 property).', icon: '🔥', prerequisites: { type: 'AND', skills: ['enchanting_basic'] } },
      { id: 'enchanting_master', name: 'Enchanting: Master', tier: 3, cost: 100, staminaCost: 0, desc: 'Create masterwork enchantments (+2 properties, rare effects).', icon: '🌟', prerequisites: { type: 'AND', skills: ['enchanting_advanced'] } }
    ]
  },

  // Monster Skills - Organized by category for easier navigation
  // Note: Monsters cannot learn profession skills (smithing, alchemy, etc.) - they are wild beasts
  monster: {
    defense: [
      // Defensive/Armor Skills (1-10)
      { id: 'tough_skin', name: 'Tough Skin', tier: 1, cost: 5, staminaCost: 0, desc: 'Natural armor (+2 Physical Defence)', icon: '🛡️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'defense' },
      { id: 'rock_skin', name: 'Rock Skin', tier: 2, cost: 10, staminaCost: 0, desc: 'Stone-like hide (+3 Physical Defence, resist piercing)', icon: '🗿', prerequisites: { type: 'AND', skills: ['tough_skin'] }, lootType: 'defense' },
      { id: 'metal_skin', name: 'Metal Skin', tier: 3, cost: 15, staminaCost: 0, desc: 'Metallic armor (+4 Physical Defence, resist slashing)', icon: '⚙️', prerequisites: { type: 'AND', skills: ['rock_skin'] }, lootType: 'defense' },
      { id: 'magical_resistance', name: 'Magical Resistance', tier: 2, cost: 10, staminaCost: 0, desc: 'Innate magic protection (+3 Magical Defence)', icon: '🔮', prerequisites: { type: 'NONE', skills: [] }, lootType: 'defense' },
      { id: 'damage_reduction', name: 'Damage Reduction', tier: 3, cost: 15, staminaCost: 0, desc: 'Reduce all incoming damage by 2 points', icon: '🛡️', prerequisites: { type: 'AND', skills: ['tough_skin', 'magical_resistance'] } },
      { id: 'regeneration', name: 'Regeneration', tier: 4, cost: 20, staminaCost: 0, desc: 'Passive: Apply Regeneration status (2 HP/turn + poison resistance) - does not stack with other regeneration', icon: '💚', prerequisites: { type: 'AND', skills: ['damage_reduction'] } },
      { id: 'rapid_healing', name: 'Rapid Healing', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: Enhanced Regeneration (3 HP/turn + strong DoT resistance) - replaces basic regeneration', icon: '✨', prerequisites: { type: 'AND', skills: ['regeneration'] } },
      { id: 'armored_plates', name: 'Armored Plates', tier: 3, cost: 15, staminaCost: 0, desc: 'Segmented armor (+2 AC, immune to critical hits)', icon: '🦀', prerequisites: { type: 'AND', skills: ['rock_skin'] }, lootType: 'defense' },
      { id: 'spell_turning', name: 'Spell Turning', tier: 4, cost: 20, staminaCost: 0, desc: '25% chance to reflect spells back at caster', icon: '🔄', prerequisites: { type: 'AND', skills: ['magical_resistance'] } },
      { id: 'immunity_poison', name: 'Poison Resistance', tier: 3, cost: 15, staminaCost: 0, desc: 'Strong resistance to all poisons and diseases (25% damage from poison effects)', icon: '☠️', prerequisites: { type: 'NONE', skills: [] } }
    ],

    combat: [
      // Combat/Attack Skills (11-25)
      { id: 'claws', name: 'Natural Claws', tier: 1, cost: 5, staminaCost: 2, desc: 'Melee attack: 1d6+2 slashing damage', icon: '🦅', prerequisites: { type: 'NONE', skills: [] }, lootType: 'combat' },
      { id: 'razor_claws', name: 'Razor Claws', tier: 2, cost: 10, staminaCost: 3, desc: 'Enhanced claws: 1d8+3 slashing, causes bleeding', icon: '🩸', prerequisites: { type: 'AND', skills: ['claws'] }, lootType: 'combat' },
      { id: 'venomous_claws', name: 'Venomous Claws', tier: 3, cost: 15, staminaCost: 4, desc: 'Poisonous claws: normal damage + poison (1d4 per turn)', icon: '🟢', prerequisites: { type: 'AND', skills: ['razor_claws'] }, lootType: 'combat' },
      { id: 'bite_attack', name: 'Powerful Bite', tier: 1, cost: 5, staminaCost: 3, desc: 'Bite attack: 1d8+1 piercing damage', icon: '🦷', prerequisites: { type: 'NONE', skills: [] }, lootType: 'combat' },
      { id: 'crushing_bite', name: 'Crushing Bite', tier: 2, cost: 10, staminaCost: 4, desc: 'Devastating bite: 2d6+2 damage, ignores 2 AC', icon: '💀', prerequisites: { type: 'AND', skills: ['bite_attack'] }, lootType: 'combat' },
      { id: 'tail_swipe', name: 'Tail Swipe', tier: 2, cost: 10, staminaCost: 3, desc: 'Sweep attack: 1d6 damage to all adjacent enemies', icon: '🦎', prerequisites: { type: 'NONE', skills: [] }, lootType: 'combat' },
      { id: 'spiked_tail', name: 'Spiked Tail', tier: 3, cost: 15, staminaCost: 4, desc: 'Piercing tail: 1d10+3 damage, 10ft reach', icon: '🦂', prerequisites: { type: 'AND', skills: ['tail_swipe'] }, lootType: 'combat' },
      { id: 'monster_charge_attack', name: 'Charge Attack', tier: 2, cost: 10, staminaCost: 5, desc: 'Rush forward 20ft and attack for double damage', icon: '🐂', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'monster_berserker_rage', name: 'Berserker Rage', tier: 3, cost: 15, staminaCost: 8, desc: '+4 damage, +2 attacks per turn, -2 AC for 3 turns', icon: '😡', prerequisites: { type: 'AND', skills: ['monster_charge_attack'] } },
      { id: 'multiattack', name: 'Multiattack', tier: 4, cost: 20, staminaCost: 6, desc: 'Make 2 different attacks in one action', icon: '⚔️', prerequisites: { type: 'AND', skills: ['claws', 'bite_attack'] } },
      { id: 'rend', name: 'Rend', tier: 3, cost: 15, staminaCost: 5, desc: 'If both claws hit same target, deal bonus 1d6 damage', icon: '🩸', prerequisites: { type: 'AND', skills: ['razor_claws'] } },
      { id: 'pounce', name: 'Pounce', tier: 2, cost: 10, staminaCost: 4, desc: 'Leap 15ft and knock target prone on hit', icon: '🦘', prerequisites: { type: 'AND', skills: ['claws'] } },
      { id: 'gore', name: 'Gore Attack', tier: 2, cost: 10, staminaCost: 4, desc: 'Horn attack: 1d8+2 piercing, push target 5ft', icon: '🐗', prerequisites: { type: 'NONE', skills: [] } },
      { id: 'trample', name: 'Trample', tier: 3, cost: 15, staminaCost: 6, desc: 'Move through enemies, each takes 1d6 damage', icon: '🦏', prerequisites: { type: 'AND', skills: ['monster_charge_attack'] } },
      { id: 'blood_frenzy', name: 'Blood Frenzy', tier: 4, cost: 20, staminaCost: 0, desc: 'When enemy drops below 25% HP, gain +3 damage', icon: '🩸', prerequisites: { type: 'AND', skills: ['monster_berserker_rage'] } }
    ],

    magic: [
      // Magical/Breath/Special Abilities (26-40) - Each grants elemental affinity
      { id: 'fire_breath', name: 'Fire Breath', tier: 3, cost: 15, staminaCost: 8, desc: '30ft cone, 2d8 fire damage + apply Burn (1 dmg/turn + Str -2). Grants fire resistance, ice/water weakness', icon: '🔥', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'fire' },
      { id: 'ice_breath', name: 'Ice Breath', tier: 3, cost: 15, staminaCost: 8, desc: '30ft cone, 2d6 cold damage + apply Weakened (all stats -2). Grants ice/water resistance, fire/lightning weakness', icon: '❄️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'ice' },
      { id: 'poison_breath', name: 'Poison Breath', tier: 3, cost: 15, staminaCost: 8, desc: '25ft cone, 1d8 poison + apply Poison (escalating 1→2→3 damage). Grants poison resistance, light/fire weakness', icon: '☠️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'poison' },
      { id: 'lightning_breath', name: 'Lightning Breath', tier: 3, cost: 15, staminaCost: 8, desc: '60ft line, 2d10 lightning + apply Immobilized (cannot move). Grants lightning resistance, earth/water weakness', icon: '⚡', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'lightning' },
      { id: 'acid_spit', name: 'Acid Spit', tier: 2, cost: 10, staminaCost: 5, desc: 'Ranged attack: 1d8 acid + apply Acid Corrosion (armor decay). Grants poison resistance, ice/water weakness', icon: '🟢', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'acid' },
      { id: 'fear_aura', name: 'Fear Aura', tier: 3, cost: 15, staminaCost: 6, desc: 'Passive: Apply Intimidating Aura (enemies must save vs Mind Control)', icon: '😨', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'paralyzing_gaze', name: 'Paralyzing Gaze', tier: 4, cost: 20, staminaCost: 10, desc: 'Target within 60ft: Apply Immobilized (cannot move but can attack)', icon: '👁️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'invisibility', name: 'Invisibility', tier: 4, cost: 20, staminaCost: 12, desc: 'Apply Stealth Mastery (invisible + strong mind control resistance)', icon: '👻', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'teleport', name: 'Teleport', tier: 3, cost: 15, staminaCost: 8, desc: 'Instantly move up to 60ft to visible location', icon: '✨', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'web_shot', name: 'Web Shot', tier: 2, cost: 10, staminaCost: 4, desc: 'Ranged: Apply Immobilized (cannot move for 3 turns)', icon: '🕸️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'monster_earthquake', name: 'Earthquake', tier: 4, cost: 20, staminaCost: 15, desc: '30ft radius: 3d6 damage, knock prone, difficult terrain. Grants earth resistance, wind/lightning weakness', icon: '🌍', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'earth' },
      { id: 'mind_control', name: 'Mind Control', tier: 5, cost: 25, staminaCost: 15, desc: 'Apply Mind Controlled (control enemy actions for 3 turns)', icon: '🧠', prerequisites: { type: 'AND', skills: ['paralyzing_gaze'] }, lootType: 'magic' },
      { id: 'energy_drain', name: 'Energy Drain', tier: 4, cost: 20, staminaCost: 8, desc: 'Touch: Apply Weakened (all stats -2) and drain 1d4 stamina', icon: '🖤', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' },
      { id: 'monster_shadow_step', name: 'Shadow Step', tier: 3, cost: 15, staminaCost: 6, desc: 'Move from shadow to shadow within 40ft. Grants darkness resistance, light weakness', icon: '🌑', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic', elementalType: 'shadow' },
      { id: 'roar', name: 'Terrifying Roar', tier: 2, cost: 10, staminaCost: 5, desc: '20ft radius: Apply Mind Controlled (fear variant - enemies flee)', icon: '🦁', prerequisites: { type: 'NONE', skills: [] }, lootType: 'magic' }
    ],

    utility: [
      // Utility/Movement/Special (41-50)
      { id: 'monster_flight', name: 'Flight', tier: 5, cost: 25, staminaCost: 0, desc: 'Passive: Apply Enhanced Mobility (flight + strong immobilization resistance)', icon: '🦅', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'burrow', name: 'Burrow', tier: 2, cost: 10, staminaCost: 0, desc: 'Dig through earth at half speed, surprise attacks', icon: '🕳️', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'climb', name: 'Natural Climber', tier: 1, cost: 5, staminaCost: 0, desc: 'Climb speed equal to land speed, no checks needed', icon: '🧗', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'swim', name: 'Aquatic', tier: 1, cost: 5, staminaCost: 0, desc: 'Swim speed, hold breath for 30 minutes', icon: '🏊', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'echolocation', name: 'Echolocation', tier: 2, cost: 10, staminaCost: 0, desc: 'See in complete darkness within 60ft', icon: '🦇', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'camouflage', name: 'Camouflage', tier: 2, cost: 10, staminaCost: 3, desc: 'Blend with surroundings: +8 to stealth checks', icon: '🦎', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'pack_leader', name: 'Pack Leader', tier: 3, cost: 15, staminaCost: 0, desc: 'Summon 1d4 lesser creatures to fight for 5 turns', icon: '🐺', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'size_change', name: 'Size Change', tier: 4, cost: 20, staminaCost: 10, desc: 'Double size for 5 turns: +4 Str, +2 reach, -2 AC', icon: '📏', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' },
      { id: 'phase_shift', name: 'Phase Shift', tier: 5, cost: 25, staminaCost: 12, desc: 'Become incorporeal for 3 turns, strong resistance to physical damage (25%)', icon: '👻', prerequisites: { type: 'AND', skills: ['invisibility'] }, lootType: 'utility' },
      { id: 'monster_ancient_knowledge', name: 'Ancient Knowledge', tier: 5, cost: 25, staminaCost: 0, desc: 'Know weakness of any creature (+4 damage vs that type)', icon: '📚', prerequisites: { type: 'NONE', skills: [] }, lootType: 'utility' }
    ]
  },

  // Fusion Skills - Unlocked by combining skills from different trees
  fusion: {
    ranged_magic: [
      // Bow/Ranged + Magic combinations
      // Fire
      { id: 'flame_arrow', name: 'Flame Arrow', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🏹🔥', prerequisites: { type: 'AND', skills: ['quick_draw', 'fireball'] }, fusionType: 'bow_fire' },
      { id: 'inferno_volley', name: 'Inferno Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple burning arrows, each dealing 2d6 fire damage. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'fire_wall'] }, fusionType: 'bow_fire' },
      { id: 'phoenix_shot', name: 'Phoenix Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that explodes in flames, dealing 3d6 fire damage in an area. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🦅🔥', prerequisites: { type: 'AND', skills: ['flame_arrow', 'inferno_volley'] }, fusionType: 'bow_fire' },
      // Ice
      { id: 'frost_arrow', name: 'Frost Arrow', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🏹❄️', prerequisites: { type: 'AND', skills: ['quick_draw', 'ice_shard'] }, fusionType: 'bow_ice' },
      { id: 'glacier_volley', name: 'Glacier Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple freezing arrows, each dealing 2d6 ice damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'ice_wall'] }, fusionType: 'bow_ice' },
      { id: 'blizzard_shot', name: 'Blizzard Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that creates a freezing zone, dealing 3d6 ice damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_arrow', 'glacier_volley'] }, fusionType: 'bow_ice' },
      // Lightning
      { id: 'storm_arrow', name: 'Storm Arrow', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🏹⚡', prerequisites: { type: 'AND', skills: ['quick_draw', 'spark'] }, fusionType: 'bow_lightning' },
      { id: 'thunder_volley', name: 'Thunder Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple charged arrows, each dealing 2d6 lightning damage. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'thunder_clap'] }, fusionType: 'bow_lightning' },
      { id: 'lightning_storm', name: 'Lightning Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that chains lightning between targets, dealing 3d6 lightning damage. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_arrow', 'thunder_volley'] }, fusionType: 'bow_lightning' },
      // Earth
      { id: 'stone_arrow', name: 'Stone Arrow', tier: 2, cost: 10, staminaCost: 3, desc: 'Ranged attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '🏹🪨', prerequisites: { type: 'AND', skills: ['quick_draw', 'stone_throw'] }, fusionType: 'bow_earth' },
      { id: 'crystal_volley', name: 'Crystal Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple stone arrows, each dealing 2d6 earth damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'stone_wall'] }, fusionType: 'bow_earth' },
      { id: 'mountain_shot', name: 'Mountain Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that creates stone spikes on impact, dealing 3d6 earth damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️🪨', prerequisites: { type: 'AND', skills: ['stone_arrow', 'crystal_volley'] }, fusionType: 'bow_earth' },
      // Wind
      { id: 'wind_arrow', name: 'Wind Arrow', tier: 2, cost: 10, staminaCost: 3, desc: 'Ranged attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '🏹💨', prerequisites: { type: 'AND', skills: ['quick_draw', 'gust'] }, fusionType: 'bow_wind' },
      { id: 'gale_volley', name: 'Gale Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple wind-empowered arrows that curve around obstacles, dealing 2d6 wind damage.', icon: '💨🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'wind_barrier'] }, fusionType: 'bow_wind' },
      { id: 'hurricane_shot', name: 'Hurricane Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that creates a whirlwind, dealing 3d6 wind damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_arrow', 'gale_volley'] }, fusionType: 'bow_wind' },
      // Water
      { id: 'water_arrow', name: 'Water Arrow', tier: 2, cost: 10, staminaCost: 3, desc: 'Ranged attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '🏹�', prerequisites: { type: 'AND', skills: ['quick_draw', 'water_splash'] }, fusionType: 'bow_water' },
      { id: 'tide_volley', name: 'Tide Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple water arrows, each dealing 2d6 water damage and healing you for half the damage dealt (no status effect)', icon: '💧🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'water_shield'] }, fusionType: 'bow_water' },
      { id: 'tsunami_shot', name: 'Tsunami Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that creates a wave of water on impact, dealing 3d6 water damage (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_arrow', 'tide_volley'] }, fusionType: 'bow_water' },
      // Shadow
      { id: 'shadow_arrow', name: 'Shadow Arrow', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🏹🌑', prerequisites: { type: 'AND', skills: ['quick_draw', 'shadow_bolt'] }, fusionType: 'bow_darkness' },
      { id: 'void_volley', name: 'Void Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple shadow arrows, each dealing 2d6 darkness damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'shadow_armor'] }, fusionType: 'bow_darkness' },
      { id: 'eclipse_shot', name: 'Eclipse Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that creates a zone of darkness, dealing 3d6 darkness damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_arrow', 'void_volley'] }, fusionType: 'bow_darkness' },
      // Light
      { id: 'light_arrow', name: 'Light Arrow', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Ranged attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🏹☀️', prerequisites: { type: 'AND', skills: ['quick_draw', 'light_ray'] }, fusionType: 'bow_light' },
      { id: 'radiant_volley', name: 'Radiant Volley', tier: 3, cost: 15, staminaCost: 5, desc: 'Fire multiple light arrows, each dealing 2d6 light damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️🏹', prerequisites: { type: 'AND', skills: ['multi_shot', 'light_shield'] }, fusionType: 'bow_light' },
      { id: 'solar_shot', name: 'Solar Shot', tier: 4, cost: 20, staminaCost: 8, desc: 'Fire an arrow that creates a burst of holy light, dealing 3d6 light damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_arrow', 'radiant_volley'] }, fusionType: 'bow_light' }
    ],

    melee_magic: [
      // Sword + Magic combinations
      // --- FIRE ---
      { id: 'flame_edge', name: 'Flame Edge', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '⚔️🔥', prerequisites: { type: 'AND', skills: ['quick_strike', 'fireball'] }, fusionType: 'sword_fire' },
      { id: 'inferno_parry', name: 'Inferno Parry', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry an attack and unleash a burst of flames, dealing 2d6 fire damage to the attacker. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🛡️🔥', prerequisites: { type: 'AND', skills: ['sword_mastery', 'fire_wall'] }, fusionType: 'sword_fire' },
      { id: 'blazing_tempest', name: 'Blazing Tempest', tier: 4, cost: 20, staminaCost: 8, desc: 'Spin and release a fiery whirlwind, hitting all adjacent enemies for 3d6 fire damage and has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌪️🔥', prerequisites: { type: 'AND', skills: ['flame_edge', 'inferno_parry'] }, fusionType: 'sword_fire' },
      // --- ICE ---
      { id: 'frostbrand', name: 'Frostbrand', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '⚔️❄️', prerequisites: { type: 'AND', skills: ['quick_strike', 'ice_shard'] }, fusionType: 'sword_ice' },
      { id: 'glacial_riposte', name: 'Glacial Riposte', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and counter with a freezing slash, has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🛡️❄️', prerequisites: { type: 'AND', skills: ['sword_mastery', 'ice_wall'] }, fusionType: 'sword_ice' },
      { id: 'winters_fury', name: "Winter's Fury", tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash a storm of ice, dealing 3d6 ice damage to all nearby enemies and has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frostbrand', 'glacial_riposte'] }, fusionType: 'sword_ice' },
      // --- LIGHTNING ---
      { id: 'storm_blade', name: 'Storm Blade', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '⚔️⚡', prerequisites: { type: 'AND', skills: ['quick_strike', 'spark'] }, fusionType: 'sword_lightning' },
      { id: 'thunder_parry', name: 'Thunder Parry', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and release a thunderclap, dealing 2d6 lightning damage to the attacker and nearby enemies. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '🛡️⚡', prerequisites: { type: 'AND', skills: ['sword_mastery', 'thunder_clap'] }, fusionType: 'sword_lightning' },
      { id: 'lightning_surge', name: 'Lightning Surge', tier: 4, cost: 20, staminaCost: 8, desc: 'Dash through enemies in a line, dealing 3d6 lightning damage. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27) to each target.', icon: '🌩️⚡', prerequisites: { type: 'AND', skills: ['storm_blade', 'thunder_parry'] }, fusionType: 'sword_lightning' },
      // --- EARTH ---
      { id: 'stonecutter', name: 'Stonecutter', tier: 2, cost: 10, staminaCost: 3, desc: 'Sword attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '⚔️🪨', prerequisites: { type: 'AND', skills: ['quick_strike', 'stone_throw'] }, fusionType: 'sword_earth' },
      { id: 'earthen_guard', name: 'Earthen Guard', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and create a stone barrier, gaining Enhanced (status-effects.js lines 90-100) for 2 turns', icon: '🛡️🪨', prerequisites: { type: 'AND', skills: ['sword_mastery', 'stone_wall'] }, fusionType: 'sword_earth' },
      { id: 'quake_slash', name: 'Quake Slash', tier: 4, cost: 20, staminaCost: 8, desc: 'Slam the ground, sending a shockwave that deals 3d6 earth damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🪨', prerequisites: { type: 'AND', skills: ['stonecutter', 'earthen_guard'] }, fusionType: 'sword_earth' },
      // --- WIND ---
      { id: 'gale_blade', name: 'Gale Blade', tier: 2, cost: 10, staminaCost: 3, desc: 'Sword attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '⚔️💨', prerequisites: { type: 'AND', skills: ['quick_strike', 'gust'] }, fusionType: 'sword_wind' },
      { id: 'cyclone_parry', name: 'Cyclone Parry', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and create a swirling wind barrier, gaining Enhanced Mobility (status-effects.js lines 130-140) for 1 turn', icon: '🛡️💨', prerequisites: { type: 'AND', skills: ['sword_mastery', 'wind_barrier'] }, fusionType: 'sword_wind' },
      { id: 'tempest_dance', name: 'Tempest Dance', tier: 4, cost: 20, staminaCost: 8, desc: 'Move through enemies in a whirlwind, dealing 3d6 wind damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['gale_blade', 'cyclone_parry'] }, fusionType: 'sword_wind' },
      // --- WATER ---
      { id: 'tidecutter', name: 'Tidecutter', tier: 2, cost: 10, staminaCost: 3, desc: 'Sword attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '⚔️💧', prerequisites: { type: 'AND', skills: ['quick_strike', 'water_splash'] }, fusionType: 'sword_water' },
      { id: 'aqua_parry', name: 'Aqua Parry', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and create a wave, healing self for 1d6 HP and pushing attacker back (no status effect)', icon: '🛡️💧', prerequisites: { type: 'AND', skills: ['sword_mastery', 'water_shield'] }, fusionType: 'sword_water' },
      { id: 'maelstrom_slash', name: 'Maelstrom Slash', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash a spinning slash that deals 3d6 water damage (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['tidecutter', 'aqua_parry'] }, fusionType: 'sword_water' },
      // --- DARKNESS ---
      { id: 'shadow_edge', name: 'Shadow Edge', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '⚔️🌑', prerequisites: { type: 'AND', skills: ['quick_strike', 'shadow_bolt'] }, fusionType: 'sword_darkness' },
      { id: 'night_parry', name: 'Night Parry', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and become Stealth Mastery (status-effects.js lines 150-160) until your next turn', icon: '🛡️🌑', prerequisites: { type: 'AND', skills: ['sword_mastery', 'shadow_armor'] }, fusionType: 'sword_darkness' },
      { id: 'umbral_onslaught', name: 'Umbral Onslaught', tier: 4, cost: 20, staminaCost: 8, desc: 'Strike all enemies in darkness for 3d6 damage and has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🗡️', prerequisites: { type: 'AND', skills: ['shadow_edge', 'night_parry'] }, fusionType: 'sword_darkness' },
      // --- LIGHT ---
      { id: 'radiant_blade', name: 'Radiant Blade', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Sword attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '⚔️☀️', prerequisites: { type: 'AND', skills: ['quick_strike', 'light_ray'] }, fusionType: 'sword_light' },
      { id: 'solar_parry', name: 'Solar Parry', tier: 3, cost: 15, staminaCost: 5, desc: 'Parry and unleash a flash of light, healing allies for 1d6 HP (no status effect)', icon: '🛡️☀️', prerequisites: { type: 'AND', skills: ['sword_mastery', 'light_shield'] }, fusionType: 'sword_light' },
      { id: 'judgment_slash', name: 'Judgment Slash', tier: 4, cost: 20, staminaCost: 8, desc: 'Deliver a powerful slash that deals 3d6 light damage and removes all debuffs from allies (no status effect)', icon: '⚖️☀️', prerequisites: { type: 'AND', skills: ['radiant_blade', 'solar_parry'] }, fusionType: 'sword_light' },

      // --- DAGGER + MAGIC ---
      // Fire
      { id: 'flame_dagger', name: 'Flame Dagger', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🗡️🔥', prerequisites: { type: 'AND', skills: ['dual_wield', 'fireball'] }, fusionType: 'dagger_fire' },
      { id: 'inferno_strike', name: 'Inferno Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A blazing strike dealing 2d6 fire damage. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'fire_wall'] }, fusionType: 'dagger_fire' },
      { id: 'phoenix_dance', name: 'Phoenix Dance', tier: 4, cost: 20, staminaCost: 8, desc: 'A series of fiery strikes hitting all adjacent enemies for 3d6 fire damage. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🦅🔥', prerequisites: { type: 'AND', skills: ['flame_dagger', 'inferno_strike'] }, fusionType: 'dagger_fire' },
      // Ice
      { id: 'frost_dagger', name: 'Frost Dagger', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🗡️❄️', prerequisites: { type: 'AND', skills: ['dual_wield', 'ice_shard'] }, fusionType: 'dagger_ice' },
      { id: 'freezing_strike', name: 'Freezing Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A frigid strike dealing 2d6 ice damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'ice_wall'] }, fusionType: 'dagger_ice' },
      { id: 'arctic_barrage', name: 'Arctic Barrage', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash a flurry of icy strikes dealing 3d6 ice damage to a single target. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_dagger', 'freezing_strike'] }, fusionType: 'dagger_ice' },
      // Lightning
      { id: 'storm_dagger', name: 'Storm Dagger', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🗡️⚡', prerequisites: { type: 'AND', skills: ['dual_wield', 'spark'] }, fusionType: 'dagger_lightning' },
      { id: 'thunder_strike', name: 'Thunder Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A lightning-fast strike dealing 2d6 lightning damage. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'thunder_clap'] }, fusionType: 'dagger_lightning' },
      { id: 'storm_flurry', name: 'Storm Flurry', tier: 4, cost: 20, staminaCost: 8, desc: 'Chain lightning enhances your daggers, dealing 3d6 lightning damage to multiple targets. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_dagger', 'thunder_strike'] }, fusionType: 'dagger_lightning' },
      // Earth
      { id: 'stone_dagger', name: 'Stone Dagger', tier: 2, cost: 10, staminaCost: 3, desc: 'Dagger attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '🗡️🪨', prerequisites: { type: 'AND', skills: ['dual_wield', 'stone_throw'] }, fusionType: 'dagger_earth' },
      { id: 'crystal_strike', name: 'Crystal Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A crystalline strike dealing 2d6 earth damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '💎🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'stone_wall'] }, fusionType: 'dagger_earth' },
      { id: 'earthen_assault', name: 'Earthen Assault', tier: 4, cost: 20, staminaCost: 8, desc: 'Your daggers become deadly crystals, dealing 3d6 earth damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🪨', prerequisites: { type: 'AND', skills: ['stone_dagger', 'crystal_strike'] }, fusionType: 'dagger_earth' },
      // Wind
      { id: 'wind_dagger', name: 'Wind Dagger', tier: 2, cost: 10, staminaCost: 3, desc: 'Dagger attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '🗡️💨', prerequisites: { type: 'AND', skills: ['dual_wield', 'gust'] }, fusionType: 'dagger_wind' },
      { id: 'zephyr_strike', name: 'Zephyr Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A wind-enhanced strike dealing 2d6 wind damage and increases your movement speed.', icon: '💨🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'wind_barrier'] }, fusionType: 'dagger_wind' },
      { id: 'hurricane_dance', name: 'Hurricane Dance', tier: 4, cost: 20, staminaCost: 8, desc: 'Become a whirlwind of blades, dealing 3d6 wind damage to all nearby enemies. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_dagger', 'zephyr_strike'] }, fusionType: 'dagger_wind' },
      // Water
      { id: 'water_dagger', name: 'Water Dagger', tier: 2, cost: 10, staminaCost: 3, desc: 'Dagger attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '🗡️💧', prerequisites: { type: 'AND', skills: ['dual_wield', 'water_splash'] }, fusionType: 'dagger_water' },
      { id: 'tide_strike', name: 'Tide Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A flowing strike dealing 2d6 water damage and healing you for half the damage dealt (no status effect)', icon: '🌊🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'water_shield'] }, fusionType: 'dagger_water' },
      { id: 'tsunami_dance', name: 'Tsunami Dance', tier: 4, cost: 20, staminaCost: 8, desc: 'Your daggers flow like water, dealing 3d6 water damage to multiple targets (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_dagger', 'tide_strike'] }, fusionType: 'dagger_water' },
      // Shadow
      { id: 'shadow_dagger', name: 'Shadow Dagger', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🗡️🌑', prerequisites: { type: 'AND', skills: ['dual_wield', 'shadow_bolt'] }, fusionType: 'dagger_darkness' },
      { id: 'void_strike', name: 'Void Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'Strike from the shadows for 2d6 darkness damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'shadow_armor'] }, fusionType: 'dagger_darkness' },
      { id: 'night_dance', name: 'Night Dance', tier: 4, cost: 20, staminaCost: 8, desc: 'Become one with the shadows, dealing 3d6 darkness damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_dagger', 'void_strike'] }, fusionType: 'dagger_darkness' },
      // Light
      { id: 'light_dagger', name: 'Light Dagger', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Dagger attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🗡️☀️', prerequisites: { type: 'AND', skills: ['dual_wield', 'light_ray'] }, fusionType: 'dagger_light' },
      { id: 'radiant_strike', name: 'Radiant Strike', tier: 3, cost: 15, staminaCost: 5, desc: 'A holy strike dealing 2d6 light damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '✨🗡️', prerequisites: { type: 'AND', skills: ['vital_strike', 'light_shield'] }, fusionType: 'dagger_light' },
      { id: 'dawn_dance', name: 'Dawn Dance', tier: 4, cost: 20, staminaCost: 8, desc: 'Your daggers blaze with holy light, dealing 3d6 light damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_dagger', 'radiant_strike'] }, fusionType: 'dagger_light' },

      // --- POLEARM + MAGIC ---
      // Fire
      { id: 'flame_glaive', name: 'Flame Glaive', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🔱🔥', prerequisites: { type: 'AND', skills: ['thrust_attack', 'fireball'] }, fusionType: 'polearm_fire' },
      { id: 'blazing_sweep', name: 'Blazing Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A burning arc attack dealing 2d6 fire damage to all enemies in front. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'fire_wall'] }, fusionType: 'polearm_fire' },
      { id: 'solar_lance', name: 'Solar Lance', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel flames into a powerful thrust, dealing 3d6 fire damage in a line. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '☀️🔥', prerequisites: { type: 'AND', skills: ['flame_glaive', 'blazing_sweep'] }, fusionType: 'polearm_fire' },
      // Ice
      { id: 'frost_halberd', name: 'Frost Halberd', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🔱❄️', prerequisites: { type: 'AND', skills: ['thrust_attack', 'ice_shard'] }, fusionType: 'polearm_ice' },
      { id: 'glacier_sweep', name: 'Glacier Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A freezing sweep dealing 2d6 ice damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'ice_wall'] }, fusionType: 'polearm_ice' },
      { id: 'winter_vortex', name: 'Winter Vortex', tier: 4, cost: 20, staminaCost: 8, desc: 'Spin your polearm creating an icy vortex, dealing 3d6 ice damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_halberd', 'glacier_sweep'] }, fusionType: 'polearm_ice' },
      // Lightning
      { id: 'storm_glaive', name: 'Storm Glaive', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🔱⚡', prerequisites: { type: 'AND', skills: ['thrust_attack', 'spark'] }, fusionType: 'polearm_lightning' },
      { id: 'thunder_sweep', name: 'Thunder Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A charged sweep dealing 2d6 lightning damage. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'thunder_clap'] }, fusionType: 'polearm_lightning' },
      { id: 'lightning_spiral', name: 'Lightning Spiral', tier: 4, cost: 20, staminaCost: 8, desc: 'Spin your polearm creating a spiral of lightning, dealing 3d6 lightning damage. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_glaive', 'thunder_sweep'] }, fusionType: 'polearm_lightning' },
      // Earth
      { id: 'stone_halberd', name: 'Stone Halberd', tier: 2, cost: 10, staminaCost: 3, desc: 'Polearm attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '🔱🪨', prerequisites: { type: 'AND', skills: ['thrust_attack', 'stone_throw'] }, fusionType: 'polearm_earth' },
      { id: 'earthen_sweep', name: 'Earthen Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A rocky sweep dealing 2d6 earth damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'stone_wall'] }, fusionType: 'polearm_earth' },
      { id: 'tectonic_spiral', name: 'Tectonic Spiral', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a spiral of stone spikes, dealing 3d6 earth damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🪨', prerequisites: { type: 'AND', skills: ['stone_halberd', 'earthen_sweep'] }, fusionType: 'polearm_earth' },
      // Wind
      { id: 'wind_glaive', name: 'Wind Glaive', tier: 2, cost: 10, staminaCost: 3, desc: 'Polearm attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '🔱💨', prerequisites: { type: 'AND', skills: ['thrust_attack', 'gust'] }, fusionType: 'polearm_wind' },
      { id: 'cyclone_sweep', name: 'Cyclone Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A wind-empowered sweep dealing 2d6 wind damage and increasing your movement speed.', icon: '💨🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'wind_barrier'] }, fusionType: 'polearm_wind' },
      { id: 'tempest_spiral', name: 'Tempest Spiral', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a massive whirlwind, dealing 3d6 wind damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_glaive', 'cyclone_sweep'] }, fusionType: 'polearm_wind' },
      // Water
      { id: 'water_glaive', name: 'Water Glaive', tier: 2, cost: 10, staminaCost: 3, desc: 'Polearm attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '🔱💧', prerequisites: { type: 'AND', skills: ['thrust_attack', 'water_splash'] }, fusionType: 'polearm_water' },
      { id: 'wave_sweep', name: 'Wave Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A flowing sweep dealing 2d6 water damage and healing you for half the damage dealt (no status effect)', icon: '🌊🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'water_shield'] }, fusionType: 'polearm_water' },
      { id: 'maelstrom_spiral', name: 'Maelstrom Spiral', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a spiral of water, dealing 3d6 water damage to all nearby enemies (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_glaive', 'wave_sweep'] }, fusionType: 'polearm_water' },
      // Shadow
      { id: 'shadow_glaive', name: 'Shadow Glaive', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🔱🌑', prerequisites: { type: 'AND', skills: ['thrust_attack', 'shadow_bolt'] }, fusionType: 'polearm_darkness' },
      { id: 'void_sweep', name: 'Void Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A shadowy sweep dealing 2d6 darkness damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'shadow_armor'] }, fusionType: 'polearm_darkness' },
      { id: 'eclipse_spiral', name: 'Eclipse Spiral', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a spiral of darkness, dealing 3d6 darkness damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_glaive', 'void_sweep'] }, fusionType: 'polearm_darkness' },
      // Light
      { id: 'light_glaive', name: 'Light Glaive', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Polearm attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🔱☀️', prerequisites: { type: 'AND', skills: ['thrust_attack', 'light_ray'] }, fusionType: 'polearm_light' },
      { id: 'radiant_sweep', name: 'Radiant Sweep', tier: 3, cost: 15, staminaCost: 5, desc: 'A holy sweep dealing 2d6 light damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '✨🔱', prerequisites: { type: 'AND', skills: ['sweep_attack', 'light_shield'] }, fusionType: 'polearm_light' },
      { id: 'solar_spiral', name: 'Solar Spiral', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a spiral of holy light, dealing 3d6 light damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_glaive', 'radiant_sweep'] }, fusionType: 'polearm_light' },

      // --- HAMMER + MAGIC ---
      // Fire
      { id: 'flame_hammer', name: 'Flame Hammer', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🔨🔥', prerequisites: { type: 'AND', skills: ['armor_crusher', 'fireball'] }, fusionType: 'hammer_fire' },
      { id: 'magma_smash', name: 'Magma Smash', tier: 3, cost: 15, staminaCost: 5, desc: 'A burning hammer strike that deals 2d6 fire damage and creates a pool of magma. Enemies in the area take 1d4 fire damage per turn. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌋🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'fire_wall'] }, fusionType: 'hammer_fire' },
      { id: 'volcanic_eruption', name: 'Volcanic Eruption', tier: 4, cost: 20, staminaCost: 8, desc: 'A devastating hammer slam that creates an explosion of fire, dealing 3d6 fire damage in a large area. Has a 75% chance to apply both Burn and Stagger (status-effects.js lines 4-14, 34-44)', icon: '🌋💥', prerequisites: { type: 'AND', skills: ['flame_hammer', 'magma_smash'] }, fusionType: 'hammer_fire' },
      // Ice
      { id: 'frost_hammer', name: 'Frost Hammer', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🔨❄️', prerequisites: { type: 'AND', skills: ['armor_crusher', 'ice_shard'] }, fusionType: 'hammer_ice' },
      { id: 'glacial_pound', name: 'Glacial Pound', tier: 3, cost: 15, staminaCost: 5, desc: 'A freezing hammer strike that deals 2d6 ice damage and creates a field of ice. Enemies in the area become Slowed and have a 40% chance to be Immobilized (status-effects.js lines 54-64)', icon: '❄️🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'ice_wall'] }, fusionType: 'hammer_ice' },
      { id: 'permafrost_crash', name: 'Permafrost Crash', tier: 4, cost: 20, staminaCost: 8, desc: 'A massive hammer strike that creates an explosion of ice, dealing 3d6 ice damage in a large area. Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '❄️💥', prerequisites: { type: 'AND', skills: ['frost_hammer', 'glacial_pound'] }, fusionType: 'hammer_ice' },
      // Lightning
      { id: 'storm_hammer', name: 'Storm Hammer', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🔨⚡', prerequisites: { type: 'AND', skills: ['armor_crusher', 'spark'] }, fusionType: 'hammer_lightning' },
      { id: 'thunder_slam', name: 'Thunder Slam', tier: 3, cost: 15, staminaCost: 5, desc: 'A thunder-charged strike dealing 2d6 lightning damage in an area. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'thunder_clap'] }, fusionType: 'hammer_lightning' },
      { id: 'storm_surge', name: 'Storm Surge', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel lightning through your hammer, dealing 3d6 lightning damage to all nearby enemies. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_hammer', 'thunder_slam'] }, fusionType: 'hammer_lightning' },
      // Earth
      { id: 'earthshaker_hammer', name: 'Earthshaker Hammer', tier: 2, cost: 10, staminaCost: 3, desc: 'Hammer attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '🔨🪨', prerequisites: { type: 'AND', skills: ['armor_crusher', 'stone_throw'] }, fusionType: 'hammer_earth' },
      { id: 'tectonic_slam', name: 'Tectonic Slam', tier: 3, cost: 15, staminaCost: 5, desc: 'A ground-shattering strike dealing 2d6 earth damage. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'stone_wall'] }, fusionType: 'hammer_earth' },
      { id: 'mountain_crash', name: 'Mountain Crash', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel the power of the earth into a devastating strike, dealing 3d6 earth damage. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️🪨', prerequisites: { type: 'AND', skills: ['earthshaker_hammer', 'tectonic_slam'] }, fusionType: 'hammer_earth' },
      // Wind
      { id: 'gale_hammer', name: 'Gale Hammer', tier: 2, cost: 10, staminaCost: 3, desc: 'Hammer attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '🔨💨', prerequisites: { type: 'AND', skills: ['armor_crusher', 'gust'] }, fusionType: 'hammer_wind' },
      { id: 'cyclone_slam', name: 'Cyclone Slam', tier: 3, cost: 15, staminaCost: 5, desc: 'A wind-empowered strike dealing 2d6 wind damage. Has a 40% chance to apply Weakened (status-effects.js lines 47-57)', icon: '💨🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'wind_barrier'] }, fusionType: 'hammer_wind' },
      { id: 'tempest_crash', name: 'Tempest Crash', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a massive whirlwind with your hammer, dealing 3d6 wind damage. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['gale_hammer', 'cyclone_slam'] }, fusionType: 'hammer_wind' },
      // Water
      { id: 'tide_hammer', name: 'Tide Hammer', tier: 2, cost: 10, staminaCost: 3, desc: 'Hammer attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '🔨💧', prerequisites: { type: 'AND', skills: ['armor_crusher', 'water_splash'] }, fusionType: 'hammer_water' },
      { id: 'wave_slam', name: 'Wave Slam', tier: 3, cost: 15, staminaCost: 5, desc: 'A water-empowered strike dealing 2d6 water damage and healing you for half the damage dealt (no status effect)', icon: '🌊🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'water_shield'] }, fusionType: 'hammer_water' },
      { id: 'tsunami_crash', name: 'Tsunami Crash', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a massive wave with your hammer, dealing 3d6 water damage to all nearby enemies (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['tide_hammer', 'wave_slam'] }, fusionType: 'hammer_water' },
      // Shadow
      { id: 'shadow_hammer', name: 'Shadow Hammer', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🔨🌑', prerequisites: { type: 'AND', skills: ['armor_crusher', 'shadow_bolt'] }, fusionType: 'hammer_darkness' },
      { id: 'void_slam', name: 'Void Slam', tier: 3, cost: 15, staminaCost: 5, desc: 'A shadow-infused strike dealing 2d6 darkness damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'shadow_armor'] }, fusionType: 'hammer_darkness' },
      { id: 'eclipse_crash', name: 'Eclipse Crash', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel dark energy into a devastating strike, dealing 3d6 darkness damage. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_hammer', 'void_slam'] }, fusionType: 'hammer_darkness' },
      // Light
      { id: 'radiant_hammer', name: 'Radiant Hammer', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Hammer attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🔨☀️', prerequisites: { type: 'AND', skills: ['armor_crusher', 'light_ray'] }, fusionType: 'hammer_light' },
      { id: 'solar_slam', name: 'Solar Slam', tier: 3, cost: 15, staminaCost: 5, desc: 'A light-infused strike dealing 2d6 light damage. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️🔨', prerequisites: { type: 'AND', skills: ['ground_slam', 'light_shield'] }, fusionType: 'hammer_light' },
      { id: 'divine_crash', name: 'Divine Crash', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel holy energy into a powerful strike, dealing 3d6 light damage and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['radiant_hammer', 'solar_slam'] }, fusionType: 'hammer_light' },

      // --- AXE + MAGIC ---
      // Fire
      { id: 'flame_axe', name: 'Flame Axe', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🪓🔥', prerequisites: { type: 'AND', skills: ['cleave', 'fireball'] }, fusionType: 'axe_fire' },
      { id: 'inferno_cleave', name: 'Inferno Cleave', tier: 3, cost: 15, staminaCost: 5, desc: 'A burning cleave attack dealing 2d6 fire damage to all adjacent enemies. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🪓', prerequisites: { type: 'AND', skills: ['wide_cleave', 'fire_wall'] }, fusionType: 'axe_fire' },
      { id: 'meteor_strike', name: 'Meteor Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'A devastating overhead strike dealing 3d6 fire damage in an area. Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '☄️🔥', prerequisites: { type: 'AND', skills: ['flame_axe', 'inferno_cleave'] }, fusionType: 'axe_fire' },
      // Ice
      { id: 'frost_axe', name: 'Frost Axe', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🪓❄️', prerequisites: { type: 'AND', skills: ['cleave', 'ice_shard'] }, fusionType: 'axe_ice' },
      { id: 'frozen_cleave', name: 'Frozen Cleave', tier: 3, cost: 15, staminaCost: 5, desc: 'A freezing cleave attack dealing 2d6 ice damage to all adjacent enemies. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🪓', prerequisites: { type: 'AND', skills: ['wide_cleave', 'ice_wall'] }, fusionType: 'axe_ice' },
      { id: 'avalanche_strike', name: 'Avalanche Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'A massive overhead strike dealing 3d6 ice damage in an area. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_axe', 'frozen_cleave'] }, fusionType: 'axe_ice' },
      // Lightning
      { id: 'storm_axe', name: 'Storm Axe', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🪓⚡', prerequisites: { type: 'AND', skills: ['cleave', 'spark'] }, fusionType: 'axe_lightning' },
      // Earth
      { id: 'stone_axe', name: 'Stone Axe', tier: 2, cost: 10, staminaCost: 3, desc: 'Axe attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '🪓🪨', prerequisites: { type: 'AND', skills: ['cleave', 'stone_throw'] }, fusionType: 'axe_earth' },
      // Wind
      { id: 'wind_axe', name: 'Wind Axe', tier: 2, cost: 10, staminaCost: 3, desc: 'Axe attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '🪓💨', prerequisites: { type: 'AND', skills: ['cleave', 'gust'] }, fusionType: 'axe_wind' },
      // Water
      { id: 'water_axe', name: 'Water Axe', tier: 2, cost: 10, staminaCost: 3, desc: 'Axe attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '🪓💧', prerequisites: { type: 'AND', skills: ['cleave', 'water_splash'] }, fusionType: 'axe_water' },
      // Shadow
      { id: 'shadow_axe', name: 'Shadow Axe', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🪓🌑', prerequisites: { type: 'AND', skills: ['cleave', 'shadow_bolt'] }, fusionType: 'axe_darkness' },
      // Light
      { id: 'light_axe', name: 'Light Axe', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Axe attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🪓☀️', prerequisites: { type: 'AND', skills: ['cleave', 'light_ray'] }, fusionType: 'axe_light' },

      // --- STAFF + MAGIC ---
      // Fire
      { id: 'flame_staff', name: 'Flame Staff', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 fire damage and have a 20% chance to apply Burn (status-effects.js lines 4-14). Costs 2 stamina per turn while active.', icon: '🪄🔥', prerequisites: { type: 'AND', skills: ['spell_power', 'fireball'] }, fusionType: 'staff_fire' },
      { id: 'inferno_channel', name: 'Inferno Channel', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel flames through your staff, dealing 2d6 fire damage in a cone. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'fire_wall'] }, fusionType: 'staff_fire' },
      { id: 'phoenix_staff', name: 'Phoenix Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Transform your staff into pure flame, dealing 3d6 fire damage in an area. Has a 75% chance to apply both Burn and Enhanced (status-effects.js lines 4-14, 90-100)', icon: '🦅🔥', prerequisites: { type: 'AND', skills: ['flame_staff', 'inferno_channel'] }, fusionType: 'staff_fire' },
      // Ice
      { id: 'frost_staff', name: 'Frost Staff', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 ice damage and have a 20% chance to apply Immobilized (status-effects.js lines 54-64). Costs 2 stamina per turn while active.', icon: '🪄❄️', prerequisites: { type: 'AND', skills: ['spell_power', 'ice_shard'] }, fusionType: 'staff_ice' },
      { id: 'glacial_focus', name: 'Glacial Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Focus ice magic through your staff, dealing 2d6 ice damage in a cone. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'ice_wall'] }, fusionType: 'staff_ice' },
      { id: 'winter_staff', name: 'Winter Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure ice, dealing 3d6 ice damage in an area. Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🌨️❄️', prerequisites: { type: 'AND', skills: ['frost_staff', 'glacial_focus'] }, fusionType: 'staff_ice' },
      // Lightning
      { id: 'storm_staff', name: 'Storm Staff', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 lightning damage and have a 20% chance to apply Incapacitated (status-effects.js lines 17-27). Costs 2 stamina per turn while active.', icon: '🪄⚡', prerequisites: { type: 'AND', skills: ['spell_power', 'spark'] }, fusionType: 'staff_lightning' },
      { id: 'thunder_focus', name: 'Thunder Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel lightning through your staff, dealing 2d6 lightning damage in a cone. Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'thunder_clap'] }, fusionType: 'staff_lightning' },
      { id: 'tempest_staff', name: 'Tempest Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure lightning, dealing 3d6 lightning damage in an area. Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️⚡', prerequisites: { type: 'AND', skills: ['storm_staff', 'thunder_focus'] }, fusionType: 'staff_lightning' },
      // Earth
      { id: 'stone_staff', name: 'Stone Staff', tier: 2, cost: 10, staminaCost: 3, desc: 'Staff attacks deal +1d6 earth damage and ignore 2 points of armor.', icon: '🪄🪨', prerequisites: { type: 'AND', skills: ['spell_power', 'stone_throw'] }, fusionType: 'staff_earth' },
      { id: 'crystal_focus', name: 'Crystal Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel earth magic through your staff, dealing 2d6 earth damage in a cone. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🪨🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'stone_wall'] }, fusionType: 'staff_earth' },
      { id: 'mountain_staff', name: 'Mountain Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure stone, dealing 3d6 earth damage in an area. Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️🪨', prerequisites: { type: 'AND', skills: ['stone_staff', 'crystal_focus'] }, fusionType: 'staff_earth' },
      // Wind
      { id: 'wind_staff', name: 'Wind Staff', tier: 2, cost: 10, staminaCost: 3, desc: 'Staff attacks deal +1d6 wind damage and push enemies back 5ft.', icon: '🪄💨', prerequisites: { type: 'AND', skills: ['spell_power', 'gust'] }, fusionType: 'staff_wind' },
      { id: 'gale_focus', name: 'Gale Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel wind magic through your staff, dealing 2d6 wind damage in a cone. Has a 40% chance to apply Weakened (status-effects.js lines 47-57)', icon: '💨🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'wind_barrier'] }, fusionType: 'staff_wind' },
      { id: 'hurricane_staff', name: 'Hurricane Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure wind, dealing 3d6 wind damage in an area. Has a 75% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️💨', prerequisites: { type: 'AND', skills: ['wind_staff', 'gale_focus'] }, fusionType: 'staff_wind' },
      // Water
      { id: 'water_staff', name: 'Water Staff', tier: 2, cost: 10, staminaCost: 3, desc: 'Staff attacks deal +1d6 water damage and reduce enemy AC by 1 for 2 turns (no status effect)', icon: '🪄💧', prerequisites: { type: 'AND', skills: ['spell_power', 'water_splash'] }, fusionType: 'staff_water' },
      { id: 'tide_focus', name: 'Tide Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel water magic through your staff, dealing 2d6 water damage in a cone and healing you for half the damage dealt (no status effect)', icon: '💧🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'water_shield'] }, fusionType: 'staff_water' },
      { id: 'tsunami_staff', name: 'Tsunami Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure water, dealing 3d6 water damage in an area (no status effect)', icon: '🌊💧', prerequisites: { type: 'AND', skills: ['water_staff', 'tide_focus'] }, fusionType: 'staff_water' },
      // Shadow
      { id: 'shadow_staff', name: 'Shadow Staff', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 darkness damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant). Costs 2 stamina per turn while active.', icon: '🪄🌑', prerequisites: { type: 'AND', skills: ['spell_power', 'shadow_bolt'] }, fusionType: 'staff_darkness' },
      { id: 'void_focus', name: 'Void Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel shadow magic through your staff, dealing 2d6 darkness damage in a cone. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'shadow_armor'] }, fusionType: 'staff_darkness' },
      { id: 'eclipse_staff', name: 'Eclipse Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure darkness, dealing 3d6 darkness damage in an area. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌑✨', prerequisites: { type: 'AND', skills: ['shadow_staff', 'void_focus'] }, fusionType: 'staff_darkness' },
      // Light
      { id: 'light_staff', name: 'Light Staff', tier: 2, cost: 10, staminaCost: 2, desc: 'Toggle: Staff attacks deal +1d6 light damage and have a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant). Costs 2 stamina per turn while active.', icon: '🪄☀️', prerequisites: { type: 'AND', skills: ['spell_power', 'light_ray'] }, fusionType: 'staff_light' },
      { id: 'radiant_focus', name: 'Radiant Focus', tier: 3, cost: 15, staminaCost: 5, desc: 'Channel holy magic through your staff, dealing 2d6 light damage in a cone. Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️🪄', prerequisites: { type: 'AND', skills: ['staff_strike', 'light_shield'] }, fusionType: 'staff_light' },
      { id: 'solar_staff', name: 'Solar Staff', tier: 4, cost: 20, staminaCost: 8, desc: 'Your staff becomes pure light, dealing 3d6 light damage in an area and healing allies. Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '☀️✨', prerequisites: { type: 'AND', skills: ['light_staff', 'radiant_focus'] }, fusionType: 'staff_light' },
    ],

    utility_combat: [
      // Profession + Combat combinations
      {
        id: 'alchemical_blade', name: 'Alchemical Blade', tier: 4, cost: 20, staminaCost: 5, desc: 'Weapon coated with deadly poison: Apply Poison (escalating damage)', icon: '⚔️⚗️',
        prerequisites: { type: 'AND', skills: ['blade_mastery', 'poison_crafting'] }, fusionType: 'sword_alchemy'
      },
      {
        id: 'enchanted_arrows', name: 'Enchanted Arrows', tier: 4, cost: 20, staminaCost: 5, desc: 'Arrows with magical effects: Apply Weapon Enchanted status', icon: '🏹✨',
        prerequisites: { type: 'AND', skills: ['multishot', 'weapon_enchanting'] }, fusionType: 'bow_enchanting'
      },
      {
        id: 'blessed_weapon', name: 'Blessed Weapon', tier: 5, cost: 25, staminaCost: 0, desc: 'Weapon deals radiant damage: Apply Weapon Enchanted vs undead/evil', icon: '⚔️☀️',
        prerequisites: { type: 'AND', skills: ['weapon_mastery', 'divine_light'] }, fusionType: 'weapon_light'
      }
    ],

    monster_fusion: [
      // Monster + Regular skill combinations
      {
        id: 'draconic_breath', name: 'Draconic Breath', tier: 5, cost: 25, staminaCost: 8, desc: 'Fire breath + fire mastery: Apply Burn + Enhanced status', icon: '🐉🔥',
        prerequisites: { type: 'AND', skills: ['fire_breath', 'fire_mastery'] }, fusionType: 'monster_fire'
      },
      {
        id: 'shadow_strike', name: 'Shadow Strike', tier: 4, cost: 20, staminaCost: 6, desc: 'Teleport + claws: Apply Stealth Mastery then strike', icon: '👥🗡️',
        prerequisites: { type: 'AND', skills: ['razor_claws', 'monster_shadow_step'] }, fusionType: 'monster_darkness'
      },
    ],

    pure_magic: [
      // Fire + Ice combinations
      {
        id: 'steam_burst', name: 'Steam Burst', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a burst of superheated steam, dealing 2d4 fire or ice damage (whichever the target is weak to) and has a 20% chance to apply both Burn and Weakened (status-effects.js lines 4-14, 47-57)', icon: '🔥❄️',
        prerequisites: { type: 'AND', skills: ['fireball', 'ice_shard'] }, fusionType: 'fire_ice'
      },
      {
        id: 'thermal_shock', name: 'Thermal Shock', tier: 3, cost: 15, staminaCost: 6, desc: 'Rapid temperature change deals 2d6 fire or ice damage (whichever the target is weak to) to an area. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌡️💥',
        prerequisites: { type: 'AND', skills: ['steam_burst', 'ice_wall'] }, fusionType: 'fire_ice'
      },
      {
        id: 'conflicting_elements', name: 'Conflicting Elements', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel opposing forces to deal 3d6 fire or ice damage (whichever the target is weak to) in an expanding ring. Has a 75% chance to apply both Burn and Immobilized (status-effects.js lines 4-14, 54-64)', icon: '☯️❄️',
        prerequisites: { type: 'AND', skills: ['thermal_shock', 'inferno'] }, fusionType: 'fire_ice'
      },

      // Fire + Lightning combinations
      {
        id: 'plasma_bolt', name: 'Plasma Bolt', tier: 2, cost: 10, staminaCost: 4, desc: 'Fire an energized bolt dealing 2d4 fire or lightning damage (whichever the target is weak to). Has a 20% chance to apply both Burn and Incapacitated (status-effects.js lines 4-14, 17-27)', icon: '⚡🔥',
        prerequisites: { type: 'AND', skills: ['fireball', 'spark'] }, fusionType: 'fire_lightning'
      },
      {
        id: 'storm_of_cinders', name: 'Storm of Cinders', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a swirling storm of electrified flames dealing 2d6 fire or lightning damage (whichever the target is weak to) to an area. Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌩️✨',
        prerequisites: { type: 'AND', skills: ['plasma_bolt', 'thunder_clap'] }, fusionType: 'fire_lightning'
      },
      {
        id: 'fusion_strike', name: 'Fusion Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel pure energy to strike all enemies for 3d6 fire or lightning damage (whichever each target is weak to). Has a 75% chance to apply both Burn and Incapacitated (status-effects.js lines 4-14, 17-27)', icon: '⚡💥',
        prerequisites: { type: 'AND', skills: ['storm_of_cinders', 'chain_lightning'] }, fusionType: 'fire_lightning'
      },

      // Fire + Earth combinations
      {
        id: 'magma_surge', name: 'Magma Surge', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a wave of molten rock dealing 2d4 fire or earth damage (whichever the target is weak to) and ignoring 2 armor. Has a 20% chance to apply Burn (status-effects.js lines 4-14)', icon: '🌋🔥',
        prerequisites: { type: 'AND', skills: ['fireball', 'stone_throw'] }, fusionType: 'fire_earth'
      },
      {
        id: 'volcanic_rupture', name: 'Volcanic Rupture', tier: 3, cost: 15, staminaCost: 6, desc: 'Rupture the ground with molten fury, dealing 2d6 fire or earth damage (whichever the target is weak to) in a line. Has a 40% chance to apply both Burn and Immobilized (status-effects.js lines 4-14, 54-64)', icon: '🌋💥',
        prerequisites: { type: 'AND', skills: ['magma_surge', 'stone_wall'] }, fusionType: 'fire_earth'
      },
      {
        id: 'tectonic_fury', name: 'Tectonic Fury', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash the earth\'s fury, dealing 3d6 fire or earth damage (whichever the target is weak to) in an eruption. Has a 75% chance to apply both Burn and Immobilized (status-effects.js lines 4-14, 54-64)', icon: '🌋⚔️',
        prerequisites: { type: 'AND', skills: ['volcanic_rupture', 'earthquake'] }, fusionType: 'fire_earth'
      },

      // Ice + Lightning combinations
      {
        id: 'static_freeze', name: 'Static Freeze', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a field of electrically charged ice dealing 2d4 ice or lightning damage (whichever the target is weak to). Has a 20% chance to apply both Weakened and Incapacitated (status-effects.js lines 47-57, 17-27)', icon: '❄️⚡',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'spark'] }, fusionType: 'ice_lightning'
      },
      {
        id: 'crystalline_surge', name: 'Crystalline Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Lightning arcs between ice crystals, dealing 2d6 ice or lightning damage (whichever the target is weak to) in a chain. Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '💎⚡',
        prerequisites: { type: 'AND', skills: ['static_freeze', 'thunder_clap'] }, fusionType: 'ice_lightning'
      },
      {
        id: 'arctic_storm', name: 'Arctic Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash a devastating winter storm dealing 3d6 ice or lightning damage (whichever each target is weak to) to all enemies. Has a 75% chance to apply both Immobilized and Incapacitated (status-effects.js lines 54-64, 17-27)', icon: '❄️🌩️',
        prerequisites: { type: 'AND', skills: ['crystalline_surge', 'blizzard'] }, fusionType: 'ice_lightning'
      },

      // Darkness + Light combinations  
      {
        id: 'twilight_balance', name: 'Twilight Balance', tier: 2, cost: 10, staminaCost: 4, desc: 'Channel opposing forces to deal 2d4 darkness or light damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; both fear and charm variants)', icon: '🌓✨',
        prerequisites: { type: 'AND', skills: ['shadow_bolt', 'light_ray'] }, fusionType: 'darkness_light'
      },
      {
        id: 'duality_surge', name: 'Duality Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a field of opposing energies dealing 2d6 darkness or light damage (whichever the target is weak to). Has a 40% chance to apply Enhanced (status-effects.js lines 90-100)', icon: '☯️✨',
        prerequisites: { type: 'AND', skills: ['twilight_balance', 'shadow_armor'] }, fusionType: 'darkness_light'
      },
      {
        id: 'eclipse', name: 'Eclipse', tier: 4, cost: 20, staminaCost: 8, desc: 'Perfect balance of light and dark dealing 3d6 darkness or light damage (whichever each target is weak to) to all enemies. Applies Enhanced to allies and has a 75% chance to apply Mind Controlled to enemies (status-effects.js lines 90-100, 67-77)', icon: '🌑☀️',
        prerequisites: { type: 'AND', skills: ['duality_surge', 'dawn_strike'] }, fusionType: 'darkness_light'
      },

      // Earth + Wind combinations
      {
        id: 'sandstorm', name: 'Sandstorm', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a swirling cloud of debris dealing 2d4 earth or wind damage (whichever the target is weak to). Has a 20% chance to apply Weakened (status-effects.js lines 47-57)', icon: '🌪️🪨',
        prerequisites: { type: 'AND', skills: ['stone_throw', 'gust'] }, fusionType: 'earth_wind'
      },
      {
        id: 'desert_winds', name: 'Desert Winds', tier: 3, cost: 15, staminaCost: 6, desc: 'Launch a barrage of wind-propelled stones dealing 2d6 earth or wind damage (whichever the target is weak to). Has a 40% chance to apply both Weakened and Immobilized (status-effects.js lines 47-57, 54-64)', icon: '🏜️💨',
        prerequisites: { type: 'AND', skills: ['sandstorm', 'wind_barrier'] }, fusionType: 'earth_wind'
      },
      {
        id: 'terra_tempest', name: 'Terra Tempest', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a massive dust storm dealing 3d6 earth or wind damage (whichever each target is weak to) in a large area. Has a 75% chance to apply both Weakened and Immobilized (status-effects.js lines 47-57, 54-64)', icon: '🌪️🗿',
        prerequisites: { type: 'AND', skills: ['desert_winds', 'earthquake'] }, fusionType: 'earth_wind'
      },

      // Wind + Water combinations
      {
        id: 'typhoon_strike', name: 'Typhoon Strike', tier: 2, cost: 10, staminaCost: 4, desc: 'Launch a spiraling water jet dealing 2d4 wind or water damage (whichever the target is weak to). Pushes target back 5ft', icon: '🌊💨',
        prerequisites: { type: 'AND', skills: ['gust', 'water_splash'] }, fusionType: 'wind_water'
      },
      {
        id: 'monsoon', name: 'Monsoon', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a storm of wind and rain dealing 2d6 wind or water damage (whichever the target is weak to) in an area. Reduces enemy accuracy by 2', icon: '🌧️🌪️',
        prerequisites: { type: 'AND', skills: ['typhoon_strike', 'water_shield'] }, fusionType: 'wind_water'
      },
      {
        id: 'hurricane', name: 'Hurricane', tier: 4, cost: 20, staminaCost: 8, desc: 'Summon a devastating storm dealing 3d6 wind or water damage (whichever each target is weak to) to all enemies. Pushes enemies to storm\'s center', icon: '🌀💫',
        prerequisites: { type: 'AND', skills: ['monsoon', 'tsunami'] }, fusionType: 'wind_water'
      },

      // Water + Earth combinations
      {
        id: 'mud_slash', name: 'Mud Slash', tier: 2, cost: 10, staminaCost: 4, desc: 'Launch sticky mud dealing 2d4 water or earth damage (whichever the target is weak to). Has a 20% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '💧🪨',
        prerequisites: { type: 'AND', skills: ['water_splash', 'stone_throw'] }, fusionType: 'water_earth'
      },
      {
        id: 'quicksand', name: 'Quicksand', tier: 3, cost: 15, staminaCost: 6, desc: 'Create unstable ground dealing 2d6 water or earth damage (whichever the target is weak to). Has a 40% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🏖️💫',
        prerequisites: { type: 'AND', skills: ['mud_slash', 'stone_wall'] }, fusionType: 'water_earth'
      },
      {
        id: 'tidal_wave', name: 'Tidal Wave', tier: 4, cost: 20, staminaCost: 8, desc: 'Summon a wave of water and debris dealing 3d6 water or earth damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🌊🪨',
        prerequisites: { type: 'AND', skills: ['quicksand', 'tsunami'] }, fusionType: 'water_earth'
      },

      // Fire + Water combinations
      {
        id: 'scalding_jet', name: 'Scalding Jet', tier: 2, cost: 10, staminaCost: 4, desc: 'Launch boiling water dealing 2d4 fire or water damage (whichever the target is weak to). Has a 20% chance to apply Burn (status-effects.js lines 4-14)', icon: '💧🔥',
        prerequisites: { type: 'AND', skills: ['fireball', 'water_splash'] }, fusionType: 'fire_water'
      },
      {
        id: 'steam_cloud', name: 'Steam Cloud', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a cloud of scalding steam dealing 2d6 fire or water damage (whichever the target is weak to) in an area. Has a 40% chance to apply both Burn and Weakened (status-effects.js lines 4-14, 47-57)', icon: '💨🔥',
        prerequisites: { type: 'AND', skills: ['scalding_jet', 'water_shield'] }, fusionType: 'fire_water'
      },
      {
        id: 'geyser_burst', name: 'Geyser Burst', tier: 4, cost: 20, staminaCost: 8, desc: 'Erupt super-heated water dealing 3d6 fire or water damage (whichever each target is weak to). Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '⛲🔥',
        prerequisites: { type: 'AND', skills: ['steam_cloud', 'inferno'] }, fusionType: 'fire_water'
      },

      // Wind + Darkness combinations
      {
        id: 'shadow_wind', name: 'Shadow Wind', tier: 2, cost: 10, staminaCost: 4, desc: 'Launch dark winds dealing 2d4 wind or darkness damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌫️🌑',
        prerequisites: { type: 'AND', skills: ['gust', 'shadow_bolt'] }, fusionType: 'wind_darkness'
      },
      {
        id: 'void_tempest', name: 'Void Tempest', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a storm of shadowy energy dealing 2d6 wind or darkness damage (whichever the target is weak to). Has a 40% chance to apply both Mind Controlled and Weakened (status-effects.js lines 67-77, 47-57)', icon: '🌪️🌑',
        prerequisites: { type: 'AND', skills: ['shadow_wind', 'shadow_armor'] }, fusionType: 'wind_darkness'
      },
      {
        id: 'dark_cyclone', name: 'Dark Cyclone', tier: 4, cost: 20, staminaCost: 8, desc: 'Summon a vortex of darkness dealing 3d6 wind or darkness damage (whichever each target is weak to). Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌀🌑',
        prerequisites: { type: 'AND', skills: ['void_tempest', 'hurricane'] }, fusionType: 'wind_darkness'
      },

      // Wind + Light combinations
      {
        id: 'prismatic_breeze', name: 'Prismatic Breeze', tier: 2, cost: 10, staminaCost: 4, desc: 'Create shimmering winds dealing 2d4 wind or light damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '🌈💨',
        prerequisites: { type: 'AND', skills: ['gust', 'light_ray'] }, fusionType: 'wind_light'
      },
      {
        id: 'rainbow_gale', name: 'Rainbow Gale', tier: 3, cost: 15, staminaCost: 6, desc: 'Summon colorful winds dealing 2d6 wind or light damage (whichever the target is weak to). Has a 40% chance to apply Enhanced (status-effects.js lines 90-100)', icon: '🌈🌪️',
        prerequisites: { type: 'AND', skills: ['prismatic_breeze', 'light_shield'] }, fusionType: 'wind_light'
      },
      {
        id: 'aurora_storm', name: 'Aurora Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a magnificent storm dealing 3d6 wind or light damage (whichever each target is weak to). Applies Enhanced to allies and has a 75% chance to apply Mind Controlled to enemies (status-effects.js lines 90-100, 67-77)', icon: '🎆💨',
        prerequisites: { type: 'AND', skills: ['rainbow_gale', 'dawn_strike'] }, fusionType: 'wind_light'
      },

      // Fire + Wind combinations
      {
        id: 'inferno_cyclone', name: 'Inferno Cyclone', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a spinning vortex of flames dealing 2d4 fire or wind damage (whichever the target is weak to). Has a 20% chance to apply Burn (status-effects.js lines 4-14)', icon: '🔥💨',
        prerequisites: { type: 'AND', skills: ['fireball', 'gust'] }, fusionType: 'fire_wind'
      },
      {
        id: 'heat_vacuum', name: 'Heat Vacuum', tier: 3, cost: 15, staminaCost: 6, desc: 'Create an imploding heat wave dealing 2d6 fire or wind damage (whichever the target is weak to). Has a 40% chance to apply both Burn and Weakened (status-effects.js lines 4-14, 47-57)', icon: '🌪️🔥',
        prerequisites: { type: 'AND', skills: ['inferno_cyclone', 'wind_barrier'] }, fusionType: 'fire_wind'
      },
      {
        id: 'phoenix_storm', name: 'Phoenix Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Summon a storm of burning feathers dealing 3d6 fire or wind damage (whichever each target is weak to). Has a 75% chance to apply Burn (status-effects.js lines 4-14)', icon: '🦅🔥',
        prerequisites: { type: 'AND', skills: ['heat_vacuum', 'inferno'] }, fusionType: 'fire_wind'
      },

      // Fire + Darkness combinations
      {
        id: 'shadowflame', name: 'Shadowflame', tier: 2, cost: 10, staminaCost: 4, desc: 'Launch dark flames dealing 2d4 fire or darkness damage (whichever the target is weak to). Has a 20% chance to apply both Burn and Mind Controlled (status-effects.js lines 4-14, 67-77; fear variant)', icon: '🔥🌑',
        prerequisites: { type: 'AND', skills: ['fireball', 'shadow_bolt'] }, fusionType: 'fire_darkness'
      },
      {
        id: 'dark_pyre', name: 'Dark Pyre', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a field of black flames dealing 2d6 fire or darkness damage (whichever the target is weak to). Has a 40% chance to apply Burn (status-effects.js lines 4-14)', icon: '🏮🌑',
        prerequisites: { type: 'AND', skills: ['shadowflame', 'shadow_armor'] }, fusionType: 'fire_darkness'
      },
      {
        id: 'hellfire', name: 'Hellfire', tier: 4, cost: 20, staminaCost: 8, desc: 'Release waves of dark fire dealing 3d6 fire or darkness damage (whichever each target is weak to). Has a 75% chance to apply both Burn and Mind Controlled (status-effects.js lines 4-14, 67-77; fear variant)', icon: '👿🔥',
        prerequisites: { type: 'AND', skills: ['dark_pyre', 'inferno'] }, fusionType: 'fire_darkness'
      },

      // Ice + Earth combinations
      {
        id: 'glacial_spike', name: 'Glacial Spike', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a spike of frozen earth dealing 2d4 ice or earth damage (whichever the target is weak to). Has a 20% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '❄️🪨',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'stone_throw'] }, fusionType: 'ice_earth'
      },
      {
        id: 'permafrost', name: 'Permafrost', tier: 3, cost: 15, staminaCost: 6, desc: 'Freeze the ground solid, dealing 2d6 ice or earth damage (whichever the target is weak to). Has a 40% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '❄️🌍',
        prerequisites: { type: 'AND', skills: ['glacial_spike', 'stone_wall'] }, fusionType: 'ice_earth'
      },
      {
        id: 'avalanche', name: 'Avalanche', tier: 4, cost: 20, staminaCost: 8, desc: 'Trigger a massive slide of ice and rock dealing 3d6 ice or earth damage (whichever each target is weak to). Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🏔️❄️',
        prerequisites: { type: 'AND', skills: ['permafrost', 'blizzard'] }, fusionType: 'ice_earth'
      },

      // Ice + Water combinations
      {
        id: 'frost_current', name: 'Frost Current', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a freezing stream dealing 2d4 ice or water damage (whichever the target is weak to). Has a 20% chance to apply Weakened (status-effects.js lines 47-57)', icon: '❄️💧',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'water_splash'] }, fusionType: 'ice_water'
      },
      {
        id: 'ice_flow', name: 'Ice Flow', tier: 3, cost: 15, staminaCost: 6, desc: 'Summon a wave of freezing water dealing 2d6 ice or water damage (whichever the target is weak to). Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌊❄️',
        prerequisites: { type: 'AND', skills: ['frost_current', 'water_shield'] }, fusionType: 'ice_water'
      },
      {
        id: 'glacier_tsunami', name: 'Glacier Tsunami', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a massive wave of ice dealing 3d6 ice or water damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Weakened (status-effects.js lines 54-64, 47-57)', icon: '🌊❄️',
        prerequisites: { type: 'AND', skills: ['ice_flow', 'tsunami'] }, fusionType: 'ice_water'
      },

      // Ice + Darkness combinations
      {
        id: 'dark_frost', name: 'Dark Frost', tier: 2, cost: 10, staminaCost: 4, desc: 'Create shadowy ice dealing 2d4 ice or darkness damage (whichever the target is weak to). Has a 20% chance to apply both Weakened and Mind Controlled (status-effects.js lines 47-57, 67-77; fear variant)', icon: '❄️🌑',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'shadow_bolt'] }, fusionType: 'ice_darkness'
      },
      {
        id: 'void_freeze', name: 'Void Freeze', tier: 3, cost: 15, staminaCost: 6, desc: 'Channel the cold of the void, dealing 2d6 ice or darkness damage (whichever the target is weak to). Has a 40% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌌❄️',
        prerequisites: { type: 'AND', skills: ['dark_frost', 'shadow_armor'] }, fusionType: 'ice_darkness'
      },
      {
        id: 'eternal_winter', name: 'Eternal Winter', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash primordial cold dealing 3d6 ice or darkness damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Mind Controlled (status-effects.js lines 54-64, 67-77; fear variant)', icon: '❄️🌑',
        prerequisites: { type: 'AND', skills: ['void_freeze', 'blizzard'] }, fusionType: 'ice_darkness'
      },

      // Ice + Light combinations
      {
        id: 'crystal_ray', name: 'Crystal Ray', tier: 2, cost: 10, staminaCost: 4, desc: 'Fire a beam of crystalline light dealing 2d4 ice or light damage (whichever the target is weak to). Has a 20% chance to apply Weakened (status-effects.js lines 47-57)', icon: '💎☀️',
        prerequisites: { type: 'AND', skills: ['ice_shard', 'light_ray'] }, fusionType: 'ice_light'
      },
      {
        id: 'aurora_flash', name: 'Aurora Flash', tier: 3, cost: 15, staminaCost: 6, desc: 'Create dancing lights in ice crystals dealing 2d6 ice or light damage (whichever the target is weak to). Has a 40% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '🎆❄️',
        prerequisites: { type: 'AND', skills: ['crystal_ray', 'light_shield'] }, fusionType: 'ice_light'
      },
      {
        id: 'diamond_radiance', name: 'Diamond Radiance', tier: 4, cost: 20, staminaCost: 8, desc: 'Release pure crystalline energy dealing 3d6 ice or light damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Mind Controlled (status-effects.js lines 54-64, 67-77; charm variant)', icon: '💎✨',
        prerequisites: { type: 'AND', skills: ['aurora_flash', 'blizzard'] }, fusionType: 'ice_light'
      },

      // Lightning + Wind combinations
      {
        id: 'storm_front', name: 'Storm Front', tier: 2, cost: 10, staminaCost: 4, desc: 'Create a moving electrical storm dealing 2d4 lightning or wind damage (whichever the target is weak to). Has a 20% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡💨',
        prerequisites: { type: 'AND', skills: ['spark', 'gust'] }, fusionType: 'lightning_wind'
      },
      {
        id: 'charged_cyclone', name: 'Charged Cyclone', tier: 3, cost: 15, staminaCost: 6, desc: 'Form a spinning vortex of electricity dealing 2d6 lightning or wind damage (whichever the target is weak to). Has a 40% chance to apply both Incapacitated and Weakened (status-effects.js lines 17-27, 47-57)', icon: '🌪️⚡',
        prerequisites: { type: 'AND', skills: ['storm_front', 'wind_barrier'] }, fusionType: 'lightning_wind'
      },
      {
        id: 'thunderstorm', name: 'Thunderstorm', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash nature\'s fury dealing 3d6 lightning or wind damage (whichever each target is weak to). Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⛈️💨',
        prerequisites: { type: 'AND', skills: ['charged_cyclone', 'chain_lightning'] }, fusionType: 'lightning_wind'
      },

      // Lightning + Water combinations
      {
        id: 'conductivity', name: 'Conductivity', tier: 2, cost: 10, staminaCost: 4, desc: 'Electrify water dealing 2d4 lightning or water damage (whichever the target is weak to). Has a 20% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '⚡💧',
        prerequisites: { type: 'AND', skills: ['spark', 'water_splash'] }, fusionType: 'lightning_water'
      },
      {
        id: 'storm_surge', name: 'Storm Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a wave of electrified water dealing 2d6 lightning or water damage (whichever the target is weak to). Has a 40% chance to apply both Incapacitated and Weakened (status-effects.js lines 17-27, 47-57)', icon: '🌊⚡',
        prerequisites: { type: 'AND', skills: ['conductivity', 'water_shield'] }, fusionType: 'lightning_water'
      },
      {
        id: 'maelstrom_strike', name: 'Maelstrom Strike', tier: 4, cost: 20, staminaCost: 8, desc: 'Summon a whirlpool of lightning dealing 3d6 lightning or water damage (whichever each target is weak to). Has a 75% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '🌊⚡',
        prerequisites: { type: 'AND', skills: ['storm_surge', 'chain_lightning'] }, fusionType: 'lightning_water'
      },

      // Lightning + Darkness combinations
      {
        id: 'dark_lightning', name: 'Dark Lightning', tier: 2, cost: 10, staminaCost: 4, desc: 'Strike with shadowy electricity dealing 2d4 lightning or darkness damage (whichever the target is weak to). Has a 20% chance to apply both Incapacitated and Mind Controlled (status-effects.js lines 17-27, 67-77; fear variant)', icon: '⚡🌑',
        prerequisites: { type: 'AND', skills: ['spark', 'shadow_bolt'] }, fusionType: 'lightning_darkness'
      },
      {
        id: 'void_thunder', name: 'Void Thunder', tier: 3, cost: 15, staminaCost: 6, desc: 'Channel darkness through lightning dealing 2d6 lightning or darkness damage (whichever the target is weak to). Has a 40% chance to apply Incapacitated (status-effects.js lines 17-27)', icon: '🌩️🌑',
        prerequisites: { type: 'AND', skills: ['dark_lightning', 'shadow_armor'] }, fusionType: 'lightning_darkness'
      },
      {
        id: 'eclipse_storm', name: 'Eclipse Storm', tier: 4, cost: 20, staminaCost: 8, desc: 'Unleash a storm of dark energy dealing 3d6 lightning or darkness damage (whichever each target is weak to). Has a 75% chance to apply both Incapacitated and Mind Controlled (status-effects.js lines 17-27, 67-77; fear variant)', icon: '⚡🌑',
        prerequisites: { type: 'AND', skills: ['void_thunder', 'chain_lightning'] }, fusionType: 'lightning_darkness'
      },

      // Lightning + Light combinations
      {
        id: 'radiant_bolt', name: 'Radiant Bolt', tier: 2, cost: 10, staminaCost: 4, desc: 'Fire a beam of pure energy dealing 2d4 lightning or light damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '⚡☀️',
        prerequisites: { type: 'AND', skills: ['spark', 'light_ray'] }, fusionType: 'lightning_light'
      },
      {
        id: 'divine_thunder', name: 'Divine Thunder', tier: 3, cost: 15, staminaCost: 6, desc: 'Call down judgment dealing 2d6 lightning or light damage (whichever the target is weak to). Has a 40% chance to apply both Incapacitated and Mind Controlled (status-effects.js lines 17-27, 67-77; charm variant)', icon: '⚡✨',
        prerequisites: { type: 'AND', skills: ['radiant_bolt', 'light_shield'] }, fusionType: 'lightning_light'
      },
      {
        id: 'heavens_wrath', name: 'Heaven\'s Wrath', tier: 4, cost: 20, staminaCost: 8, desc: 'Channel celestial power dealing 3d6 lightning or light damage (whichever each target is weak to). Has a 75% chance to apply both Incapacitated and Enhanced (status-effects.js lines 17-27, 90-100)', icon: '⚡☀️',
        prerequisites: { type: 'AND', skills: ['divine_thunder', 'chain_lightning'] }, fusionType: 'lightning_light'
      },

      // Earth + Darkness combinations
      {
        id: 'shadow_stone', name: 'Shadow Stone', tier: 2, cost: 10, staminaCost: 4, desc: 'Launch rocks infused with darkness dealing 2d4 earth or darkness damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🪨🌑',
        prerequisites: { type: 'AND', skills: ['stone_throw', 'shadow_bolt'] }, fusionType: 'earth_darkness'
      },
      {
        id: 'obsidian_strike', name: 'Obsidian Strike', tier: 3, cost: 15, staminaCost: 6, desc: 'Create spikes of dark stone dealing 2d6 earth or darkness damage (whichever the target is weak to). Has a 40% chance to apply both Immobilized and Mind Controlled (status-effects.js lines 54-64, 67-77; fear variant)', icon: '🌑🪨',
        prerequisites: { type: 'AND', skills: ['shadow_stone', 'shadow_armor'] }, fusionType: 'earth_darkness'
      },
      {
        id: 'void_eruption', name: 'Void Eruption', tier: 4, cost: 20, staminaCost: 8, desc: 'Trigger an eruption of dark matter dealing 3d6 earth or darkness damage (whichever each target is weak to). Has a 75% chance to apply Immobilized (status-effects.js lines 54-64)', icon: '🌋🌑',
        prerequisites: { type: 'AND', skills: ['obsidian_strike', 'earthquake'] }, fusionType: 'earth_darkness'
      },

      // Earth + Light combinations
      {
        id: 'crystal_light', name: 'Crystal Light', tier: 2, cost: 10, staminaCost: 4, desc: 'Channel light through crystals dealing 2d4 earth or light damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '💎☀️',
        prerequisites: { type: 'AND', skills: ['stone_throw', 'light_ray'] }, fusionType: 'earth_light'
      },
      {
        id: 'prismatic_earth', name: 'Prismatic Earth', tier: 3, cost: 15, staminaCost: 6, desc: 'Create pillars of illuminated crystal dealing 2d6 earth or light damage (whichever the target is weak to). Has a 40% chance to apply both Enhanced and Immobilized (status-effects.js lines 90-100, 54-64)', icon: '🌈🪨',
        prerequisites: { type: 'AND', skills: ['crystal_light', 'light_shield'] }, fusionType: 'earth_light'
      },
      {
        id: 'sacred_ground', name: 'Sacred Ground', tier: 4, cost: 20, staminaCost: 8, desc: 'Consecrate the earth dealing 3d6 earth or light damage (whichever each target is weak to). Has a 75% chance to apply Immobilized while granting Enhanced to allies (status-effects.js lines 54-64, 90-100)', icon: '⚖️🪨',
        prerequisites: { type: 'AND', skills: ['prismatic_earth', 'earthquake'] }, fusionType: 'earth_light'
      },

      // Water + Darkness combinations
      {
        id: 'abyssal_current', name: 'Abyssal Current', tier: 2, cost: 10, staminaCost: 4, desc: 'Control dark waters dealing 2d4 water or darkness damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌊🌑',
        prerequisites: { type: 'AND', skills: ['water_splash', 'shadow_bolt'] }, fusionType: 'water_darkness'
      },
      {
        id: 'deep_surge', name: 'Deep Surge', tier: 3, cost: 15, staminaCost: 6, desc: 'Summon waters from the depths dealing 2d6 water or darkness damage (whichever the target is weak to). Has a 40% chance to apply both Weakened and Mind Controlled (status-effects.js lines 47-57, 67-77; fear variant)', icon: '🌊🌑',
        prerequisites: { type: 'AND', skills: ['abyssal_current', 'shadow_armor'] }, fusionType: 'water_darkness'
      },
      {
        id: 'drowning_darkness', name: 'Drowning Darkness', tier: 4, cost: 20, staminaCost: 8, desc: 'Create a zone of dark water dealing 3d6 water or darkness damage (whichever each target is weak to). Has a 75% chance to apply Mind Controlled (status-effects.js lines 67-77; fear variant)', icon: '🌊🖤',
        prerequisites: { type: 'AND', skills: ['deep_surge', 'tsunami'] }, fusionType: 'water_darkness'
      },

      // Water + Light combinations
      {
        id: 'holy_spring', name: 'Holy Spring', tier: 2, cost: 10, staminaCost: 4, desc: 'Summon blessed water dealing 2d4 water or light damage (whichever the target is weak to). Has a 20% chance to apply Mind Controlled (status-effects.js lines 67-77; charm variant)', icon: '💧✨',
        prerequisites: { type: 'AND', skills: ['water_splash', 'light_ray'] }, fusionType: 'water_light'
      },
      {
        id: 'purifying_wave', name: 'Purifying Wave', tier: 3, cost: 15, staminaCost: 6, desc: 'Create a wave of sacred water dealing 2d6 water or light damage (whichever the target is weak to). Has a 40% chance to apply Enhanced (status-effects.js lines 90-100)', icon: '🌊✨',
        prerequisites: { type: 'AND', skills: ['holy_spring', 'light_shield'] }, fusionType: 'water_light'
      },
      {
        id: 'blessed_tsunami', name: 'Blessed Tsunami', tier: 4, cost: 20, staminaCost: 8, desc: 'Summon a wave of divine water dealing 3d6 water or light damage (whichever each target is weak to). Has a 75% chance to apply Mind Controlled while granting Enhanced to allies (status-effects.js lines 67-77; charm variant, 90-100)', icon: '🌊☀️',
        prerequisites: { type: 'AND', skills: ['purifying_wave', 'tsunami'] }, fusionType: 'water_light'
      }
    ],

    monster_fusion: [
      // Monster + Regular skill combinations
      {
        id: 'draconic_breath', name: 'Draconic Breath', tier: 5, cost: 25, staminaCost: 8, desc: 'Fire breath + fire mastery: Apply Burn + Enhanced status', icon: '🐉🔥',
        prerequisites: { type: 'AND', skills: ['fire_breath', 'fire_mastery'] }, fusionType: 'monster_fire'
      },
      {
        id: 'shadow_strike', name: 'Shadow Strike', tier: 4, cost: 20, staminaCost: 6, desc: 'Teleport + claws: Apply Stealth Mastery then strike', icon: '👥🗡️',
        prerequisites: { type: 'AND', skills: ['razor_claws', 'monster_shadow_step'] }, fusionType: 'monster_darkness'
      },
      {
        id: 'arcane_roar', name: 'Arcane Roar', tier: 4, cost: 20, staminaCost: 7, desc: 'Roar + magic: Apply Intimidating Aura + magical damage', icon: '🦁✨',
        prerequisites: { type: 'AND', skills: ['roar', 'magic_missile'] }, fusionType: 'monster_arcane'
      }
    ]
  },

  // ULTIMATE SKILLS - Legendary endgame abilities
  ultimate: {
    legendary: [
      // Monster Summoning
      {
        id: 'monster_summoning',
        name: 'Monster Summoning',
        tier: 5,
        cost: 50,
        staminaCost: 20,
        desc: 'Action (Once per day): Summon a loyal monster companion (Player creates monster character with 50 Lumen to spend). Lasts until dismissed or slain. Can transfer your Lumen to improve companion.',
        icon: '👹',
        prerequisites: { type: 'OR_WEAPON_MASTERY_AND_DARKNESS', skills: ['sword_mastery', 'axe_mastery', 'polearm_mastery', 'hammer_mastery', 'dagger_mastery', 'ranged_mastery', 'darkness_mastery'] }
      },

      // Aetherial Shift
      {
        id: 'aetherial_shift',
        name: 'Aetherial Shift',
        tier: 4,
        cost: 35,
        staminaCost: 15,
        desc: 'Action (3 uses per day): Phase out of reality for 1 round. Immune to all damage, can pass through walls/obstacles. Cannot attack or interact while phased. -2 stamina per extra round maintained.',
        icon: '👻',
        prerequisites: { type: 'AND', skills: ['resurrection', 'void_prison', 'wind_walk'] }
      },

      // Chronos Rewind
      {
        id: 'chronos_rewind',
        name: 'Chronos Rewind',
        tier: 5,
        cost: 40,
        staminaCost: 12,
        desc: 'Reaction (Once per encounter): Rewind 1 action/attack. Reroll any dice or make different choice for last action taken (yours or ally). Cannot rewind death or critical story moments.',
        icon: '⏪',
        prerequisites: { type: 'ALL_LIGHT_MAGIC', skills: ['light_ray', 'healing_light', 'light_shield', 'resurrection', 'divine_judgment'] }
      },

      // Ultimate Nova
      {
        id: 'ultimate_nova',
        name: 'Ultimate Nova',
        tier: 5,
        cost: 60,
        staminaCost: 25,
        desc: 'Action (Once per day): Devastating 100ft radius explosion dealing 8d6 damage (DEX save halves). All creatures in area affected. User gains Exhausted (3 rounds) and cannot use magic for 1 minute.',
        icon: '💥',
        prerequisites: { type: 'THREE_TIER5_MAGIC', skills: [] }
      },

      // Soul Link
      {
        id: 'soul_link',
        name: 'Soul Link',
        tier: 4,
        cost: 30,
        staminaCost: 10,
        desc: 'Action (1 hour duration): Link HP pools with willing ally within 30ft. Combine max HP, share all damage/healing equally. If either reaches 0 HP, both fall unconscious. Can be ended early by either participant.',
        icon: '💕',
        prerequisites: { type: 'AND', skills: ['soul_steal', 'divine_judgment', 'elixir_of_life'] },
        alternativePrerequisite: { type: 'OR', skills: ['elixir_of_life', 'grand_alchemist'] }
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

// Skill cost calculation based on tier (linear scaling)
function getSkillCost(tier) {
  return tier * 5
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
