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
// Do not invent new status effects or durations; use standard effect names from the Effects list.
// This rule applies to ALL skills, not just fusion skills.
// Weapon & element design pillars: DESIGN-WEAPON-ELEMENT-IDENTITY.md
// (every skill reinforces ≥1 trait; fusion skills reinforce ≥1 from each parent)
// -----------------------------------------------------------------------------
// SKILL SYSTEM DATA
// ===========================================
// 
// TERMINOLOGY DEFINITIONS:
// - "Magic Power": Character stat that increases magical spell effectiveness (like Strength for physical)
// - "Magic Damage": The actual damage output of magical spells (calculated from Magic Power + spell base)  
// - "Damage": Generic term referring to all attack damage (physical or magical)
// - Physical Defence (PD) and Magical Defence (MD) are AC values, not damage reduction.
// - Physical attacks: roll d20 + accuracy vs target PD to hit; damage on hit only.
// - Magical attacks/spells: roll d20 + accuracy vs target MD to hit; damage on hit only.
// - "Ignores N Physical/Magical Defence" means treat the target's AC as N lower for that attack.
//
// COMBAT: Physical attacks roll d20 + accuracy vs target Physical Defence (PD).
// Magical attacks/spells roll d20 + accuracy vs target Magical Defence (MD).
// PD and MD are AC values — meet or beat to hit; damage applies only on a hit.
// BALANCE NOTES:
// - Toggle skills have stamina costs and mutual exclusivity
// - Immunity skills have doubled costs to reflect their power
// - Tier level gates: T1→Lv1 · T2→Lv5 · T3→Lv9 · T4→Lv14 · T5→Lv21
// - Tier Lumen floors: 8 / 20 / 40 / 65 / 100 (premiums scale from legacy costs)
// - Weapon-based skills require appropriate equipment
//
// ELEMENTAL DAMAGE SCALE (typed damage only — multiply after other bonuses):
//   25% resistance = quarter damage (÷4)   |   50% resistance = half damage (÷2)
//   200% weakness = double damage (×2)     |   400% weakness = quadruple damage (×4)
// Write both % and plain words in GRANTS lines so tables can multiply without a chart.
// ===========================================

// Skills Data - 25+ skills per category with proper tier structure
const SKILLS_DATA = {
    "weapons": {
        "sword": [
            {
                "id": "sword_basics",
                "name": "Sword Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy while wielding a sword.",
                "icon": "⚔️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "sword_stance",
                "name": "Combat Stance",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Physical Defence while wielding a sword.",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "quick_strike",
                "name": "Quick Strike",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Action: Sword attack. Attack roll d20 + accuracy vs Physical Defence; weapon damage on hit.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "parry",
                "name": "Parry",
                "tier": 2,
                "cost": 20,
                "staminaCost": 1,
                "desc": "Reaction: When hit by a melee attack, roll d20 + accuracy vs the attacker's accuracy; on success, block the hit (no damage).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_basics",
                        "sword_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "lunge_attack",
                "name": "Lunge Attack",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Extended-reach sword attack (+5ft range). Attack roll d20 + accuracy vs Physical Defence; weapon damage +1 on hit.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "riposte",
                "name": "Riposte",
                "tier": 3,
                "cost": 40,
                "staminaCost": 2,
                "desc": "Reaction: After a successful Parry, counter with a Basic Attack (+2 damage on hit). Costs 1 stamina.",
                "icon": "⚔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "parry",
                        "quick_strike"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "sweeping_slash",
                "name": "Sweeping Slash",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Wide sword arc. Up to 3 adjacent enemies; separate attack roll (d20 + accuracy vs Physical Defence) vs each; weapon damage on each hit.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "blade_dance",
                "name": "Blade Dance",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action: Sword combo of 3 attacks. Each attack roll is d20 + accuracy vs Physical Defence −1; weapon damage +1 on each hit.",
                "icon": "💃",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lunge_attack",
                        "quick_strike"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "defensive_stance",
                "name": "Defensive Stance",
                "tier": 3,
                "cost": 40,
                "staminaCost": 1,
                "desc": "Toggle: +2 Physical Defence and +2 Magical Defence, but −1 damage on your attacks. Costs 1 stamina per turn (max 10 turns).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "parry"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "master_parry",
                "name": "Master Parry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 3,
                "desc": "Reaction: On a successful Parry, reflect the melee attack back at the attacker for full damage.",
                "icon": "✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "riposte",
                        "defensive_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "whirlwind",
                "name": "Whirlwind Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action: Spinning sword attack. One attack roll per enemy within 10ft (d20 + accuracy vs Physical Defence −2); weapon damage on each hit. Friendly fire possible.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweeping_slash",
                        "blade_dance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "piercing_thrust",
                "name": "Piercing Thrust",
                "tier": 4,
                "cost": 65,
                "staminaCost": 4,
                "desc": "Action: Precise thrust through an opening. Attack roll d20 + accuracy +1 vs Physical Defence; weapon damage +1 on hit. Critical hit on natural 18–20.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lunge_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "sword_mastery",
                "name": "Sword Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +3 damage on sword hits; critical hits restore 1 stamina.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "master_parry",
                        "whirlwind",
                        "piercing_thrust"
                    ]
                },
                "specialEffects": []
            }
        ],
        "ranged": [
            {
                "id": "ranged_basics",
                "name": "Ranged Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy and +1 Strength while wielding a ranged weapon.",
                "icon": "🏹",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "steady_aim",
                "name": "Steady Aim",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +2 Accuracy while wielding a ranged weapon and you did not move this turn.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "grappling_shot",
                "name": "Grappling Shot",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Fire a grappling arrow at a surface or creature within 30ft. Pull yourself to it, or pull a target toward you (GM may call for a contest). No damage unless your table combines it with a separate attack.",
                "icon": "🪝",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ranged_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "aimed_shot",
                "name": "Aimed Shot",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Ranged weapon attack with extra aim time. Attack roll d20 + accuracy (+3) vs Physical Defence; on a hit, weapon damage +2.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "steady_aim"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "power_shot",
                "name": "Power Shot",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Ranged weapon attack at full draw. Attack roll d20 + accuracy (−1) vs Physical Defence; on a hit, weapon damage +4.",
                "icon": "💪",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ranged_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "covering_fire",
                "name": "Covering Fire",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Ranged weapon attack to suppress a foe. d20 + accuracy vs Physical Defence; weapon damage on hit; 20% chance to apply Weakened. Until your next turn, one ally you choose gains +2 accuracy against that target.",
                "icon": "🤝",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "steady_aim"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "multi_shot",
                "name": "Multi Shot",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action: Make 2 ranged weapon attacks as one action. Each attack roll is d20 + accuracy vs that target's Physical Defence; weapon damage on each hit. Target one foe twice or two foes once each.",
                "icon": "⬇️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "piercing_shot",
                "name": "Piercing Shot",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Fire one ranged weapon shot along a straight line. Separate attack roll (d20 + accuracy) vs each enemy in that line; weapon damage on each hit. Does not ignore Physical Defence.",
                "icon": "➡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "aimed_shot",
                        "power_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "explosive_shot",
                "name": "Explosive Shot",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Action: Fire a prepared explosive arrow or bolt (requires Explosive Compounds). Attack roll d20 + accuracy −1 vs primary target's Physical Defence; weapon damage on hit. Each other creature in 10ft: separate attack roll (d20 + accuracy −1) vs each target's Physical Defence; weapon damage on each hit. You must not have moved this turn. Friendly fire possible.",
                "icon": "💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "power_shot",
                        "explosive_compounds"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "parting_shot",
                "name": "Parting Shot",
                "tier": 3,
                "cost": 40,
                "staminaCost": 3,
                "desc": "Action: Ranged weapon attack (d20 + accuracy vs Physical Defence; weapon damage on hit), then move up to 15ft without provoking opportunity attacks. If you know Quick Draw, that 15ft is in addition to your normal movement this turn.",
                "icon": "↩️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "aimed_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "quick_draw",
                "name": "Quick Draw",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: You may attack with ranged weapons the same turn you move (others cannot).",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "grappling_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "barrage",
                "name": "Projectile Barrage",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Action: Rain shots into a 20ft area after aiming (you did not move this turn). One attack roll per enemy inside (d20 + accuracy −2 vs Physical Defence); weapon damage on each hit. Friendly fire possible.",
                "icon": "🌧️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "explosive_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "homing_shot",
                "name": "Homing Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 6,
                "desc": "Action: One aimed shot at a target you hit last turn. Attack roll d20 + accuracy +5 vs Physical Defence; weapon damage +2 on hit. Once per combat.",
                "icon": "🧭",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "piercing_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "rapid_fire",
                "name": "Rapid Fire",
                "tier": 4,
                "cost": 65,
                "staminaCost": 5,
                "desc": "Action: Make 4 ranged weapon attacks. Each attack roll is d20 + accuracy −1 vs Physical Defence; weapon damage on each hit.",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "parting_shot",
                        "multi_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "siege_shot",
                "name": "Siege Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 6,
                "desc": "Action: One heavy ranged weapon shot along a 120ft line. Separate attack roll (d20 + accuracy) vs each enemy in the line; weapon damage on each hit.",
                "icon": "🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "grappling_shot",
                        "explosive_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ranged_mastery",
                "name": "Ranged Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +50% weapon range, +3 damage on ranged weapon hits, and critical hits do not consume ammunition.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "barrage",
                        "homing_shot",
                        "rapid_fire",
                        "siege_shot"
                    ]
                },
                "specialEffects": []
            }
        ],
        "axe": [
            {
                "id": "axe_basics",
                "name": "Axe Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy while wielding an axe.",
                "icon": "🪓",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "heavy_swing",
                "name": "Heavy Swing",
                "tier": 1,
                "cost": 8,
                "staminaCost": 3,
                "desc": "Action: Overhead axe chop. Attack roll d20 + accuracy vs Physical Defence; weapon damage +3 on hit.",
                "icon": "⬇️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "cleave",
                "name": "Cleave",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Passive: When you kill an enemy, make a Basic Attack against an adjacent foe (costs 1 stamina).",
                "icon": "〰️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "axe_basics"
                    ]
                },
                "specialEffects": [
                    "cleave"
                ],
                "activationEffects": [
                    {
                        "effectId": "cleave",
                        "duration": 0,
                        "potency": 0
                    }
                ]
            },
            {
                "id": "armor_break",
                "name": "Armor Break",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Action: Sunder armour. On a successful melee attack roll (d20 + accuracy vs Physical Defence), reduce the target's Physical Defence by 2 for 1 day (once per enemy).",
                "icon": "🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heavy_swing"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "throwing_axe",
                "name": "Throwing Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Hurl your axe with brutal force (30ft). Attack roll d20 + accuracy vs Physical Defence; weapon damage +2 on hit. Axe returns to your hand.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "axe_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "berserker_rage",
                "name": "Berserker Rage",
                "tier": 3,
                "cost": 40,
                "staminaCost": 2,
                "desc": "Toggle: +2 Strength and +2 Speed, but −1 Physical Defence. Costs 2 stamina per turn (max 5 turns).",
                "icon": "😤",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "crushing_blow",
                "name": "Crushing Blow",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Action: Axe smash. Attack roll d20 + accuracy vs Physical Defence; weapon damage on hit. 50% chance to apply Incapacitated (1 turn) and knock prone.",
                "icon": "💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_break",
                        "heavy_swing"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "ricochet_axe",
                "name": "Ricochet Axe",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Enhancement: When you throw an axe, it may cleave through to one adjacent foe (separate attack roll per target; weapon damage on each hit).",
                "icon": "🔄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "throwing_axe"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "wide_cleave",
                "name": "Wide Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Action: Cleave arc (15ft). One attack roll (d20 + accuracy vs Physical Defence) per enemy in the arc; weapon damage on each hit.",
                "icon": "〰️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "earthquake_slam",
                "name": "Earthquake Slam",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Action: Ground slam (20ft radius). One attack roll per creature (d20 + accuracy vs Physical Defence −2); weapon damage on each hit; knockdown on hit. Friendly fire possible.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "crushing_blow"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "whirling_axes",
                "name": "Whirling Axes",
                "tier": 4,
                "cost": 65,
                "staminaCost": 11,
                "desc": "Action: Spin with axes (10ft radius). One attack roll per enemy (d20 + accuracy vs Physical Defence −2); weapon damage on each hit. You may move while spinning. Friendly fire possible.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "berserker_rage",
                        "wide_cleave"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "axe_storm",
                "name": "Axe Storm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Action: Throw 6 axes (360°). Six attack rolls (d20 + accuracy vs Physical Defence); weapon damage on each hit.",
                "icon": "🌩️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ricochet_axe"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "axe_mastery",
                "name": "Axe Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +3 damage on axe hits; axe attacks have a 25% chance to Cleave.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "earthquake_slam",
                        "whirling_axes",
                        "axe_storm"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "cleave",
                        "duration": 0,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.25
                    }
                ]
            }
        ],
        "staff": [
            {
                "id": "staff_basics",
                "name": "Staff Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Magic Power while wielding a staff.",
                "icon": "🪄",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "mana_focus",
                "name": "Mana Focus",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: Sustain long battles — restore +1 stamina per turn while a staff is equipped (feeds your spellcasting).",
                "icon": "💙",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "spell_power",
                "name": "Spell Power",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "Passive: +2 Magic Power on magical attacks while using a staff.",
                "icon": "✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "arcane_shield",
                "name": "Arcane Shield",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Apply Spell Warded to yourself (magical immunity + magical damage halved, 8 turns).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "mana_focus"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "spell_warded",
                        "duration": 8,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "staff_strike",
                "name": "Staff Strike",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Channel a short arc through the staff (10ft). Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d6 + Magic Power force damage. Weaker than your spells — use when you cannot cast.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "spell_penetration",
                "name": "Spell Penetration",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Your spell attack rolls treat the target's Magical Defence as 2 lower.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power"
                    ]
                },
                "specialEffects": [
                    "spell_penetration"
                ]
            },
            {
                "id": "mana_burn",
                "name": "Mana Burn",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action: Arcane drain through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, apply Weakened (all stats −2 for 4 turns) and you recover 1d4+2 stamina.",
                "icon": "💔",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "arcane_shield"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "elemental_staff",
                "name": "Elemental Staff",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Action: Channel Fire, Ice, or Lightning into your staff for 10 turns. While active, your spells and staff strikes deal +2 typed damage of the chosen element.",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "dispel_ward",
                "name": "Dispel Ward",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Remove all magical effects from one target (ally or enemy).",
                "icon": "🚫",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "arcane_shield"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "arcane_mastery",
                "name": "Arcane Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: All spells cost −1 stamina (minimum 1).",
                "icon": "🧙",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_penetration",
                        "mana_burn"
                    ]
                },
                "specialEffects": [
                    "arcane_mastery"
                ]
            },
            {
                "id": "staff_of_power",
                "name": "Staff of Power",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action: Release power you have built up (requires Elemental Staff active, or pay +3 stamina if not). Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d8 force damage + Magic Power at up to 60ft.",
                "icon": "💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "elemental_staff"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "reality_tear",
                "name": "Reality Tear",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Action: Open a dimensional rift — teleport anywhere within 100ft.",
                "icon": "🌀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dispel_ward"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "staff_mastery",
                "name": "Staff Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +4 Magic Power; once per day, cast two spells in one turn.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "arcane_mastery",
                        "staff_of_power",
                        "reality_tear"
                    ]
                },
                "specialEffects": []
            }
        ],
        "dagger": [
            {
                "id": "dagger_basics",
                "name": "Dagger Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy while wielding a dagger.",
                "icon": "🗡️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "light_step",
                "name": "Light Step",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Speed and silent movement while a dagger is equipped.",
                "icon": "👣",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "dual_wield",
                "name": "Dual Wield",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "Passive: With a dagger in your main hand, unlock an off-hand dagger slot. Basic Attack rolls damage for both daggers.",
                "icon": "⚔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dagger_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "sneak_attack",
                "name": "Sneak Attack",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Dagger attack from behind or while hidden. Attack roll d20 + accuracy vs Physical Defence; weapon damage +3 on hit.",
                "icon": "👤",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_step"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "poison_blade",
                "name": "Poison Blade",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Enhancement: Your cuts leave bleeding wounds — escalating 1→2→3 damage over 3 turns on hit (stack refreshes). Has a 20% chance to apply Bleeding.",
                "icon": "☠️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dagger_basics"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "bleeding",
                        "duration": 3,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "flurry",
                "name": "Flurry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Action: Make 4 dagger attacks. Each attack roll is d20 + accuracy vs Physical Defence −1; weapon damage on each hit.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "shadowstep",
                "name": "Shadowstep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action: Teleport behind a target within 30ft. Your next attack qualifies as Sneak Attack.",
                "icon": "🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sneak_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "vital_strike",
                "name": "Vital Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Dagger vital strike. Attack roll d20 + accuracy vs Physical Defence; weapon damage on hit. Critical hit on natural 15–20.",
                "icon": "💔",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "poison_blade",
                        "sneak_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "evasion",
                "name": "Evasion",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: +2 Physical Defence and +2 Magical Defence; GM may allow a dodge roll to avoid area attacks.",
                "icon": "💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_step"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "thousand_cuts",
                "name": "Thousand Cuts",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action: Eight rapid cuts. Each attack roll is d20 + accuracy −2 vs Physical Defence; weapon damage on each hit. Each hit has a 40% chance to apply Bleeding.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry",
                        "vital_strike"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "bleeding",
                        "duration": 3,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "shadow_clone",
                "name": "Shadow Clone",
                "tier": 4,
                "cost": 65,
                "staminaCost": 7,
                "desc": "Action: After you hit with a dagger attack, teleport up to 15ft and gain +2 Physical Defence until your next turn. Once per combat, you may immediately make one Basic Attack from your new position.",
                "icon": "👥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadowstep",
                        "evasion"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "assassinate",
                "name": "Assassinate",
                "tier": 4,
                "cost": 65,
                "staminaCost": 6,
                "desc": "Action: Lethal strike. Attack roll d20 + accuracy vs Physical Defence; on a critical hit, instant kill on most enemies (GM discretion).",
                "icon": "💀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "dagger_mastery",
                "name": "Dagger Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +2 Speed, +3 damage on dagger hits; attacks have 25% critical chance.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "thousand_cuts",
                        "shadow_clone",
                        "assassinate"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "critical_chance",
                        "duration": 10,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.25
                    }
                ]
            }
        ],
        "polearm": [
            {
                "id": "polearm_basics",
                "name": "Polearm Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy while wielding a polearm.",
                "icon": "🔱",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "reach_advantage",
                "name": "Reach Advantage",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: You may attack enemies 10ft away; they cannot reach you with melee unless they close distance.",
                "icon": "📏",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "thrust_attack",
                "name": "Thrust Attack",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Piercing polearm thrust. Attack roll d20 + accuracy vs Physical Defence (treat target Physical Defence as 1 lower); weapon damage +2 on hit.",
                "icon": "➡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "polearm_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "polearm_defensive_stance",
                "name": "Reach Guard",
                "tier": 2,
                "cost": 20,
                "staminaCost": 1,
                "desc": "Toggle: +2 Physical Defence and +2 Magical Defence, but you cannot move. Costs 1 stamina per turn (max 10 turns).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "reach_advantage"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "sweep_attack",
                "name": "Sweep Attack",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Wide sweep. Up to 3 enemies in front; separate attack roll (d20 + accuracy vs Physical Defence) vs each; weapon damage on each hit.",
                "icon": "〰️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "polearm_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "spear_wall",
                "name": "Spear Wall",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action: Set a 10ft-wide block. Enemies entering the zone are attacked (d20 + accuracy vs Physical Defence); weapon damage on hit.",
                "icon": "🏗️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "polearm_defensive_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "polearm_charge_attack",
                "name": "Charge Attack",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Action: Controlled lunge up to 15ft in a straight line, then thrust. Attack roll d20 + accuracy vs Physical Defence; weapon damage +2 on hit. You may attack enemies 10ft away without closing to melee.",
                "icon": "🏃",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "trip_attack",
                "name": "Trip Attack",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Trip with polearm. Attack roll d20 + accuracy vs Physical Defence; on a hit, knock target prone (they lose next turn, GM).",
                "icon": "🦵",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "phalanx_formation",
                "name": "Phalanx Formation",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: +1 Physical Defence and +1 Magical Defence per polearm ally within 10ft. + Harmony: No Reaction — when polearm allies within 10ft all attack the same target that round, +1 accuracy per polearm in that volley on that attack.",
                "icon": "👥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "polearm_defensive_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "impale",
                "name": "Impale",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action: Impaling thrust. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 damage and target cannot move for 3 turns.",
                "icon": "📌",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spear_wall",
                        "polearm_charge_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "whirlwind_sweep",
                "name": "Whirlwind Sweep",
                "tier": 4,
                "cost": 65,
                "staminaCost": 9,
                "desc": "Action: Measured full-circle sweep while holding your ground (you cannot move this turn). One attack roll per enemy within 15ft (d20 + accuracy −1 vs Physical Defence); weapon damage on each hit. Enemies you hit cannot move toward you until your next turn.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "trip_attack",
                        "phalanx_formation"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "fortress_stance",
                "name": "Fortress Stance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 3,
                "desc": "Toggle: +4 Physical Defence and +4 Magical Defence; reflect 50% damage to attackers. Costs 3 stamina per turn (max 5 turns).",
                "icon": "🏰",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "phalanx_formation"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "polearm_mastery",
                "name": "Polearm Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +20ft reach, +3 damage on polearm hits; opportunity attacks when enemies move (GM).",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "impale",
                        "whirlwind_sweep",
                        "fortress_stance"
                    ]
                },
                "specialEffects": []
            }
        ],
        "hammer": [
            {
                "id": "hammer_basics",
                "name": "Hammer Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy while wielding a hammer.",
                "icon": "🔨",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "heavy_impact",
                "name": "Heavy Impact",
                "tier": 1,
                "cost": 8,
                "staminaCost": 3,
                "desc": "Action: Hammer blow. Attack roll d20 + accuracy vs Physical Defence; weapon damage +4 on hit.",
                "icon": "💥",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "armor_crusher",
                "name": "Armor Crusher",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Passive: Hammer attack rolls treat the target's Physical Defence as 2 lower.",
                "icon": "💔",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "hammer_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "stunning_blow",
                "name": "Stunning Blow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Action: Stunning hammer blow. Attack roll d20 + accuracy vs Physical Defence; weapon damage on hit. 50% chance to apply Incapacitated (1 turn).",
                "icon": "⭐",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heavy_impact"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "ground_slam",
                "name": "Ground Slam",
                "tier": 2,
                "cost": 20,
                "staminaCost": 8,
                "desc": "Action: Ground slam (10ft). One attack roll per enemy (d20 + accuracy vs Physical Defence −1); weapon damage on each hit; knockdown on hit. Friendly fire possible.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "hammer_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "thunderstrike",
                "name": "Thunderstrike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Action: Thunderous hammer blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage +2d6 thunder damage. One adjacent foe takes half that thunder damage (no roll).",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "stunning_blow"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "earth_shaker",
                "name": "Earth Shaker",
                "tier": 3,
                "cost": 40,
                "staminaCost": 10,
                "desc": "Action: Earthquake hammer slam (20ft). One attack roll per creature (d20 + accuracy vs Physical Defence −2); weapon damage on each hit; difficult terrain. Friendly fire possible.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "berserker_swing",
                "name": "Berserker Swing",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Action: Wind up a crushing blow (you cannot move this turn). Attack roll d20 + accuracy vs Physical Defence; weapon damage +6 on hit. You are immune to Incapacitated until your next turn.",
                "icon": "😤",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heavy_impact"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "shield_breaker",
                "name": "Shield Breaker",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action: Destroy a target's shield and remove Protected status (attack roll vs shield/holder, GM).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "mjolnir_strike",
                "name": "Mjolnir Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Action: Hurl your hammer in a 60ft line. One attack roll per enemy in the line; weapon damage on each hit. The impact sends a shockwave — each hit foe is knocked prone. Hammer returns.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thunderstrike",
                        "earth_shaker"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "apocalypse_slam",
                "name": "Apocalypse Slam",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Action: Devastating slam (40ft radius). One attack roll per creature (d20 + accuracy vs Physical Defence −4); on each hit, 4d6 damage. Friendly fire possible.",
                "icon": "☄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "berserker_swing",
                        "shield_breaker"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "fortress_buster",
                "name": "Fortress Buster",
                "tier": 4,
                "cost": 65,
                "staminaCost": 9,
                "desc": "Action: Destroy structures or barriers (walls, doors) — no attack roll vs creatures.",
                "icon": "🏗️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shield_breaker"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "hammer_mastery",
                "name": "Hammer Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +4 damage on hammer hits; attacks cause knockdown; immune to Incapacitated.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "mjolnir_strike",
                        "apocalypse_slam",
                        "fortress_buster"
                    ]
                },
                "specialEffects": [
                    "hammer_mastery_passive"
                ]
            }
        ],
        "striker": [
            {
                "id": "striker_basics",
                "name": "Striker Basics",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Accuracy while both hands are empty. Unarmed Basic Attack uses 1d4 + Strength instead of 1 + Strength.",
                "icon": "🥊",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "open_stance",
                "name": "Open Stance",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +1 Speed and +1 Magical Defence while both hands are empty.",
                "icon": "🧘",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "stone_fists",
                "name": "Stone Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "Passive: Unarmed Basic Attack uses 1d6 + Strength while both hands are empty.",
                "icon": "🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "slip_parry",
                "name": "Slip Parry",
                "tier": 2,
                "cost": 20,
                "staminaCost": 1,
                "desc": "Reaction: When hit by a melee attack, roll d20 + accuracy vs the attacker's accuracy; on success, block the hit (no damage). Requires both hands empty.",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "open_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "feint_strike",
                "name": "Feint Strike",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Action: Make 1 Basic Attack with +2 accuracy on the attack roll. Requires both hands empty.",
                "icon": "🎭",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "open_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "iron_palm",
                "name": "Iron Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: +1 Physical Defence while both hands are empty. Unarmed Basic Attack uses 1d10 + Strength.",
                "icon": "✋",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_fists"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "flurry_of_blows",
                "name": "Flurry of Blows",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Make 2 Basic Attacks while both hands are empty (each uses your striker basic dice + Strength).",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_fists"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "joint_lock",
                "name": "Joint Lock",
                "tier": 3,
                "cost": 40,
                "staminaCost": 3,
                "desc": "Action: One Basic Attack; on hit, target's next attack is at −2 accuracy (1 round, GM). Requires both hands empty.",
                "icon": "🔒",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "slip_parry",
                        "stone_fists"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "iron_body",
                "name": "Iron Body",
                "tier": 3,
                "cost": 40,
                "staminaCost": 1,
                "desc": "Toggle: +2 Physical Defence and +2 Magical Defence while both hands empty. Costs 1 stamina per turn (max 10 turns).",
                "icon": "🧱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "iron_palm"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "crushing_fist",
                "name": "Crushing Fist",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Your combo finishers hit hardest — unarmed Basic Attack uses 1d12 + Strength while both hands are empty (pairs with Flurry of Blows and Striker Volley).",
                "icon": "💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "iron_palm"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "striker_volley",
                "name": "Striker Volley",
                "tier": 4,
                "cost": 65,
                "staminaCost": 5,
                "desc": "Action: Make 3 Basic Attacks while both hands are empty (each uses your striker basic dice + Strength).",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "iron_reversal",
                "name": "Iron Reversal",
                "tier": 4,
                "cost": 65,
                "staminaCost": 2,
                "desc": "Reaction: After a successful Slip Parry, counter with as many Basic Attacks as your striker combo allows — 1 by default, 2 if you know Flurry of Blows, or 3 if you know Striker Volley (each uses your striker dice + Strength). Costs 2 stamina. Requires both hands empty.",
                "icon": "↩️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "joint_lock",
                        "slip_parry"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "striker_mastery",
                "name": "Striker Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: +2 Accuracy and +1 Strength while both hands are empty. Unarmed Basic Attack uses 2d10 + Strength.",
                "icon": "👑",
                "prerequisites": {
                    "type": "OR",
                    "skills": [
                        "crushing_fist",
                        "striker_volley",
                        "iron_reversal"
                    ]
                },
                "specialEffects": [
                    "striker_mastery_passive"
                ]
            }
        ]
    },
    "magic": {
        "fire": [
            {
                "id": "fire_spark",
                "name": "Fire Spark",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d4 fire damage + Magic Power. 30ft range.",
                "icon": "🔥",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "warm_hands",
                "name": "Warm Hands",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: Ignite a small flame (30ft light). Touch one ally to soothe minor burns — restore 1 HP.",
                "icon": "🤲",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "fireball",
                "name": "Fireball",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 Fire damage + Magic Power. 60ft range.",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_spark"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "fire_shield",
                "name": "Fire Shield",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: Apply Protected (absorb 3 attacks). Attackers that hit the shield take 1d4 fire damage and have a 20% chance to apply Burn.",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "warm_hands"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "protected",
                        "duration": 6,
                        "potency": 3,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "ignite",
                "name": "Ignite",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: Apply Burn (1 fire damage/turn + Strength -2 for 4 turns)",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_spark"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "fire_wall",
                "name": "Fire Wall",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Create 30ft wall of flames, blocks passage and damages (2d4/turn)",
                "icon": "🧱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "explosion",
                "name": "Explosion",
                "tier": 3,
                "cost": 40,
                "staminaCost": 9,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 fire damage + Magic Power. 15ft.",
                "icon": "💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "ignite"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "phoenix_form",
                "name": "Phoenix Form",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: Apply Enhanced Mobility (flight + immunity to immobilization). Your flames burn hotter — fire spells deal +1d4 fire damage while active. GRANTS: Fire resistance 50% (half fire damage); Ice weakness 200% (double ice damage)",
                "icon": "🦅",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_shield"
                    ]
                },
                "elementalType": "fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "enhanced_mobility",
                        "duration": 10,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "fire_attunement",
                "name": "Fire Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to fire magic. GRANTS: Fire resistance 50% (half fire damage); Ice weakness 200% (double ice damage)",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_shield",
                        "ignite"
                    ]
                },
                "elementalType": "fire",
                "specialEffects": [
                    "fire_resistance",
                    "ice_weakness"
                ]
            },
            {
                "id": "fire_whip",
                "name": "Fire Whip",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: 15ft reach fire lash. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire damage + Magic Power. May grapple (GM).",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_wall"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "meteor",
                "name": "Meteor",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 6d6 fire damage + Magic Power. 20ft radius, -2 accuracy, friendly fire possible.",
                "icon": "☄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "explosion"
                    ]
                },
                "elementalType": "fire",
                "specialEffects": []
            },
            {
                "id": "inferno",
                "name": "Inferno",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: 20ft raging flames. One attack roll per creature (d20 + accuracy vs Magical Defence −4); on each hit, 2d6 fire damage + Magic Power. Has a 40% chance to apply Burn. Friendly fire possible.",
                "icon": "🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "phoenix_form",
                        "fire_whip"
                    ]
                },
                "elementalType": "fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "fire_tornado",
                "name": "Fire Tornado",
                "tier": 4,
                "cost": 65,
                "staminaCost": 11,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 4d6 fire damage + Magic Power. 30ft/turn.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_wall",
                        "explosion"
                    ]
                },
                "elementalType": "fire",
                "specialEffects": []
            },
            {
                "id": "fire_supremacy",
                "name": "Fire Supremacy",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with fire for 3 rounds. Gain immunity to fire damage, +50% fire spell damage, all attacks apply Burn, and regenerate 3 HP/turn. Can ignite objects by touch.",
                "icon": "�",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "meteor",
                        "inferno",
                        "fire_tornado"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 3,
                        "potency": 3,
                        "applyTo": "target"
                    }
                ]
            }
        ],
        "ice": [
            {
                "id": "ice_shard",
                "name": "Ice Shard",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d4 ice damage + Magic Power. 30ft range.",
                "icon": "🧊",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "frost_touch",
                "name": "Frost Touch",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: Touch attack. Attack roll d20 + accuracy vs Magical Defence; on a hit, applies Weakened (all stats −2 for 4 turns). Has a 20% chance to apply Immobilized.",
                "icon": "❄️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 4,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ice_armor",
                "name": "Ice Armor",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Gain +3 Physical Defence and +3 Magical Defence (10 rounds). While active, fire damage against you is halved (does not stack with Ice Attunement).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_touch"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ice_spear",
                "name": "Ice Spear",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice damage + Magic Power. 60ft.",
                "icon": "🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "freeze",
                "name": "Freeze",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Apply Immobilized (cannot move but can attack for 3 turns)",
                "icon": "🧊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_touch"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ice_wall",
                "name": "Ice Wall",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Create 30ft wall of ice (blocks passage, 20 HP)",
                "icon": "🧱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_armor"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "blizzard",
                "name": "Blizzard",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: 20ft radius cold storm. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 2d4 damage + Magic Power. Apply Weakened to all inside. Friendly fire possible.",
                "icon": "🌨️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_spear",
                        "freeze"
                    ]
                },
                "elementalType": "ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ice_attunement",
                "name": "Ice Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to ice magic. GRANTS: Ice resistance 50% (half ice damage); Fire weakness 200% (double fire damage)",
                "icon": "❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_armor",
                        "freeze"
                    ]
                },
                "elementalType": "ice",
                "specialEffects": [
                    "ice_resistance",
                    "fire_weakness"
                ]
            },
            {
                "id": "ice_prison",
                "name": "Ice Prison",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Spell: Trap one target in ice. Attack roll d20 + accuracy vs Magical Defence; on a hit, target is immobile in ice until the cage takes 15 damage.",
                "icon": "🔒",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "freeze"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "frost_nova",
                "name": "Frost Nova",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: 15ft burst. All enemies inside: has a 40% chance to apply Immobilized (1 turn) and Weakened (Speed −2 for 4 turns).",
                "icon": "💫",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_wall"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "absolute_zero",
                "name": "Absolute Zero",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: Instantly freeze any target (no save, 3 turns). GRANTS: Ice resistance 50% (half ice damage); Water resistance 25% (quarter water damage); Fire weakness 200% (double fire damage); Lightning weakness 400% (quadruple lightning damage)",
                "icon": "❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_prison"
                    ]
                },
                "elementalType": "ice",
                "specialEffects": []
            },
            {
                "id": "ice_age",
                "name": "Ice Age",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d6 ice damage + Magic Power. 200ft. On a hit, target is Weakened and has a 40% chance to apply Immobilized — frozen foes are easier for allies to shatter.",
                "icon": "🧊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "blizzard",
                        "frost_nova"
                    ]
                },
                "elementalType": "ice",
                "specialEffects": []
            },
            {
                "id": "glacier",
                "name": "Glacier",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Spell: Massive 50ft ice wall that moves 20ft/turn. GRANTS: Ice resistance 50% (half ice damage); Water resistance 25% (quarter water damage); Fire weakness 200% (double fire damage); Lightning weakness 400% (quadruple lightning damage)",
                "icon": "🏔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_wall"
                    ]
                },
                "elementalType": "ice",
                "specialEffects": []
            },
            {
                "id": "ice_dominion",
                "name": "Ice Dominion",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master ice magic, enhanced ice spell effects. GRANTS: Ice resistance 50% (half ice damage); Fire weakness 200% (double fire damage)",
                "icon": "❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_attunement"
                    ]
                },
                "elementalType": "ice",
                "specialEffects": [
                    "ice_resistance",
                    "fire_weakness"
                ]
            },
            {
                "id": "ice_supremacy",
                "name": "Ice Supremacy",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with ice for 3 rounds. Gain immunity to ice/cold damage, +50% ice spell damage, all attacks apply Weakened, and create frozen terrain (difficult terrain) in 10ft radius. Temperature drops 50°F around you.",
                "icon": "❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "absolute_zero",
                        "ice_age",
                        "glacier"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 3,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            }
        ],
        "lightning": [
            {
                "id": "spark",
                "name": "Spark",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d4 lightning damage + Magic Power. 20ft.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "static_charge",
                "name": "Static Charge",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: Charge your next lightning spell (+1d6 lightning damage) and gain +1 Speed until you cast again.",
                "icon": "🔋",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "lightning_bolt",
                "name": "Lightning Bolt",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 Lightning damage + Magic Power. 100ft range.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "lightning_bolt",
                        "duration": 0,
                        "potency": 0
                    }
                ]
            },
            {
                "id": "shock",
                "name": "Shock",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: Stun target for 1 turn (save negates)",
                "icon": "😵",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "static_charge"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "chain_lightning",
                "name": "Chain Lightning",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence per target; on each hit, 2d6 damage + Magic Power.",
                "icon": "🔗",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "thunder_clap",
                "name": "Thunder Clap",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: 20ft thunder burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 2d4 lightning damage + Magic Power. Has a 40% chance to apply Incapacitated. Friendly fire possible.",
                "icon": "🔊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lightning_bolt"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "electric_field",
                "name": "Electric Field",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: 30ft zone deals 1d6 lightning to anyone entering (1 min)",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shock",
                        "chain_lightning"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "lightning_attunement",
                "name": "Lightning Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to lightning magic. GRANTS: Lightning resistance 50% (half lightning damage); Water weakness 200% (double water damage)",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shock",
                        "chain_lightning"
                    ]
                },
                "elementalType": "lightning",
                "specialEffects": [
                    "lightning_resistance",
                    "water_weakness"
                ]
            },
            {
                "id": "lightning_speed",
                "name": "Lightning Speed",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: +3 Speed, extra move action (3 turns)",
                "icon": "💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shock"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "overcharge",
                "name": "Overcharge",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Spell: Next spell deals maximum damage (no rolling)",
                "icon": "🔋",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "static_charge"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "lightning_storm",
                "name": "Lightning Storm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: 60ft line. Separate attack roll per creature in the line (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning damage + Magic Power. Lightning jumps — each hit after the first deals +1d6. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thunder_clap",
                        "electric_field"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "ball_lightning",
                "name": "Ball Lightning",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Spell: Hurl a fast orb to a point within 60ft; it detonates immediately for 4d6 lightning damage in a 15ft radius. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lightning_speed"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "emp",
                "name": "EMP",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell: 40ft radius disables all magic for 1 round",
                "icon": "📵",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "overcharge"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "storm_mastery",
                "name": "Storm Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master lightning magic, enhanced electrical control. GRANTS: Lightning resistance 50% (half lightning damage); Water weakness 200% (double water damage)",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lightning_attunement"
                    ]
                },
                "elementalType": "lightning",
                "specialEffects": [
                    "lightning_resistance",
                    "water_weakness"
                ]
            },
            {
                "id": "lightning_supremacy",
                "name": "Lightning Supremacy",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with lightning for 3 rounds. Gain immunity to lightning damage, +50% movement speed, +50% lightning spell damage, all attacks apply Incapacitated, and can teleport 30ft as bonus action each turn.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lightning_storm",
                        "ball_lightning",
                        "emp"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            }
        ],
        "earth": [
            {
                "id": "stone_throw",
                "name": "Stone Throw",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d6 earth damage + Magic Power. 40ft. On a hit, target has a 20% chance to be knocked down.",
                "icon": "🪨",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "earth_sense",
                "name": "Earth Sense",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: Sense vibrations through stone and soil (100ft). You know where creatures are moving and where the ground is unstable — +2 to place earth spikes and walls for 1 round.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "stone_armor",
                "name": "Stone Armor",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Rock shell (+3 Physical Defence and +3 Magical Defence (AC bonus), -1 Speed for 10 rounds)",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_throw"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "earth_spike",
                "name": "Earth Spike",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Ground spike under one target. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 earth damage + Magic Power and knockdown.",
                "icon": "⬆️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earth_sense"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "knockdown",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "mud_trap",
                "name": "Mud Trap",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: Create 15ft difficult terrain, slows enemies 50%",
                "icon": "🟫",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earth_sense"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "stone_wall",
                "name": "Stone Wall",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Create 40ft stone barrier (blocks movement, provides cover)",
                "icon": "🧱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_armor"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "earthquake",
                "name": "Earthquake",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: 25ft tremor. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 2d6 earth damage + Magic Power and knockdown.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earth_spike",
                        "mud_trap"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "knockdown",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "earth_attunement",
                "name": "Earth Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to earth magic. GRANTS: Earth resistance 50% (half earth damage); Wind weakness 200% (double wind damage)",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_armor",
                        "mud_trap"
                    ]
                },
                "elementalType": "earth",
                "specialEffects": [
                    "earth_resistance",
                    "wind_weakness"
                ]
            },
            {
                "id": "stone_spear",
                "name": "Stone Spear",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d4 earth damage + Magic Power. 60ft. Ignores 2 Magical Defence (piercing stone).",
                "icon": "🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earth_spike"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "earth_shield",
                "name": "Earth Shield",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: Apply Protected (floating stones absorb next 3 attacks completely)",
                "icon": "🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_armor"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "protected",
                        "duration": 6,
                        "potency": 3,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "mountain_crush",
                "name": "Mountain Crush",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 5d6 damage + Magic Power. 20ft radius.",
                "icon": "🏔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_wall",
                        "earthquake"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "petrify",
                "name": "Petrify",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Spell: Apply Immobilized (encased in stone — cannot move but can attack) and +5 Physical Defence and +5 Magical Defence for 3 turns.",
                "icon": "🗿",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_spear",
                        "earth_shield"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "tectonic_shift",
                "name": "Tectonic Shift",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: Reshape 100ft area terrain for 1 day",
                "icon": "🌋",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earthquake"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "stone_mastery",
                "name": "Stone Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master earth magic, enhanced stone manipulation. GRANTS: Earth resistance 50% (half earth damage); Wind weakness 200% (double wind damage)",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earth_attunement"
                    ]
                },
                "elementalType": "earth",
                "specialEffects": [
                    "earth_resistance",
                    "wind_weakness"
                ]
            },
            {
                "id": "earth_supremacy",
                "name": "Earth Supremacy",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with earth for 3 rounds. Gain immunity to earth damage, +5 Physical Defence and +5 Magical Defence from stone skin, +50% earth spell damage, all attacks apply Immobilized, and can burrow through ground at half speed.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "mountain_crush",
                        "petrify",
                        "tectonic_shift"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            }
        ],
        "wind": [
            {
                "id": "gust",
                "name": "Gust",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Wind push (knockback 10ft, extinguish flames)",
                "icon": "💨",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "feather_fall",
                "name": "Feather Fall",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: Slow falling (no fall damage for 1 round)",
                "icon": "🪶",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "wind_blade",
                "name": "Wind Blade",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 wind damage + Magic Power. 50ft. On a hit, push the target 5ft.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gust"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "levitate",
                "name": "Levitate",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Float in air (20ft height, 5 rounds)",
                "icon": "🎈",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "feather_fall"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "wind_barrier",
                "name": "Wind Barrier",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: Deflect projectiles (+4 Physical Defence and +4 Magical Defence (AC bonus) vs ranged for 5 turns)",
                "icon": "🌀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gust"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "flight",
                "name": "Flight",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: True flight (60ft speed, 10 rounds)",
                "icon": "🕊️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "levitate",
                        "wind_barrier"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "tornado",
                "name": "Tornado",
                "tier": 3,
                "cost": 40,
                "staminaCost": 10,
                "desc": "Spell: 30ft tornado. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d4 wind damage + Magic Power. You may move up to 10ft before or after casting. Friendly fire possible.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_blade"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "wind_attunement",
                "name": "Wind Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to wind magic. GRANTS: Wind resistance 50% (half wind damage); Lightning weakness 200% (double lightning damage)",
                "icon": "💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_barrier",
                        "wind_blade"
                    ]
                },
                "elementalType": "wind",
                "specialEffects": [
                    "wind_resistance",
                    "lightning_weakness"
                ]
            },
            {
                "id": "suffocate",
                "name": "Suffocate",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Remove air around target (2d4/turn for 3 turns)",
                "icon": "😵",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_blade"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "wind_walk",
                "name": "Wind Walk",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: Become incorporeal mist (immune to physical damage)",
                "icon": "☁️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "levitate"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "hurricane",
                "name": "Hurricane",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: 30ft storm. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 wind damage + Magic Power. Pull all enemies 10ft toward the storm's center. Friendly fire possible.",
                "icon": "🌀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flight",
                        "tornado"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "wind_prison",
                "name": "Wind Prison",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell: Trap target in air pocket (cannot move or act)",
                "icon": "🟦",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "suffocate",
                        "wind_walk"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "atmospheric_control",
                "name": "Atmospheric Control",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: Control weather in 1 mile radius for 10 rounds",
                "icon": "⛅",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_walk"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "gale_mastery",
                "name": "Gale Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master wind magic, enhanced atmospheric control. GRANTS: Wind resistance 50% (half wind damage); Lightning weakness 200% (double lightning damage)",
                "icon": "💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_attunement"
                    ]
                },
                "elementalType": "wind",
                "specialEffects": [
                    "wind_resistance",
                    "lightning_weakness"
                ]
            },
            {
                "id": "wind_mastery",
                "name": "Wind Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with the wind for 3 rounds. Gain flight, immunity to ground effects, +50% movement speed, and all attacks push enemies back 10ft. Can pass through enemy spaces without provoking attacks.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_walk",
                        "hurricane",
                        "wind_barrier"
                    ]
                },
                "specialEffects": []
            }
        ],
        "water": [
            {
                "id": "water_splash",
                "name": "Water Splash",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d4 water damage + Magic Power. 30ft. On a hit, target's Speed is −1 until your next turn (slippery splash).",
                "icon": "💧",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "purify_water",
                "name": "Purify Water",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Utility: Clean any liquid, remove poison from drinks",
                "icon": "🚰",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "water_whip",
                "name": "Water Whip",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 water damage + Magic Power. 20ft reach.",
                "icon": "🌊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_splash"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "heal_wounds",
                "name": "Heal Wounds",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Restore 2d4+2 HP instantly OR apply Regeneration status",
                "icon": "💚",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "purify_water"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "regeneration",
                        "duration": 5,
                        "potency": 2,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "create_water",
                "name": "Create Water",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Utility: Summon fresh water (10 gallons), put out fires",
                "icon": "🫗",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_splash"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "tidal_wave",
                "name": "Tidal Wave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Summon a wave of water and debris dealing 3d6 water or earth damage (whichever each target is weak to). Has a 75% chance to apply both Immobilized and Weakened",
                "icon": "🌊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_whip",
                        "create_water"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "water_breathing",
                "name": "Water Breathing",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Apply Enhanced Mobility (water breathing + swim speed)",
                "icon": "🫧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heal_wounds"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "enhanced_mobility",
                        "duration": 10,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "blood_control",
                "name": "Blood Control",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Spell: Grip a foe with pressurized blood inside their veins. Attack roll d20 + accuracy vs Magical Defence; on a hit, apply Weakened (all stats −2 for 4 turns) and has a 40% chance to apply Immobilized.",
                "icon": "🩸",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heal_wounds"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 4,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "water_attunement",
                "name": "Water Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to water magic. GRANTS: Water resistance 50% (half water damage); Lightning weakness 200% (double lightning damage)",
                "icon": "💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heal_wounds",
                        "create_water"
                    ]
                },
                "elementalType": "water",
                "specialEffects": [
                    "water_resistance",
                    "lightning_weakness"
                ]
            },
            {
                "id": "water_shield",
                "name": "Water Shield",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: Apply Protected (flowing barrier absorbs 3 attacks + fire immunity)",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "create_water"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "protected",
                        "duration": 6,
                        "potency": 3,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "maelstrom",
                "name": "Maelstrom",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: 40ft whirlpool (ongoing zone). Attack roll d20 + accuracy vs Magical Defence each turn per creature inside; on a hit, 4d4 water damage + Magic Power.",
                "icon": "🌀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tidal_wave",
                        "water_breathing"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "blood_boil",
                "name": "Blood Boil",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Spell: Superheat fluids in the target's body. Attack roll d20 + accuracy vs Magical Defence; on a hit, 5d4 water damage + Magic Power (scalding steam). Has a 40% chance to apply Burn.",
                "icon": "🩸",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "blood_control",
                        "water_shield"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tsunami",
                "name": "Tsunami",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: 40ft wave. One attack roll per creature (d20 + accuracy vs Magical Defence −2); on each hit, 6d4 water damage + Magic Power and push 15ft. Has a 40% chance to apply Immobilized. Friendly fire possible.",
                "icon": "🌊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_shield"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hydro_mastery",
                "name": "Hydro Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master water magic, enhanced fluid manipulation. GRANTS: Water resistance 50% (half water damage); Lightning weakness 200% (double lightning damage)",
                "icon": "💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_attunement"
                    ]
                },
                "elementalType": "water",
                "specialEffects": [
                    "water_resistance",
                    "lightning_weakness"
                ]
            },
            {
                "id": "water_mastery",
                "name": "Water Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with water for 3 rounds. Gain immunity to water damage, can move through any liquid at normal speed, +50% water spell damage, all attacks heal you for 25% of damage dealt, and can breathe underwater indefinitely.",
                "icon": "🌊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "maelstrom",
                        "blood_boil",
                        "tsunami"
                    ]
                },
                "specialEffects": []
            }
        ],
        "darkness": [
            {
                "id": "shadow_bolt",
                "name": "Shadow Bolt",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d6 darkness damage + Magic Power. 40ft. Has a 20% chance to apply Weakened (all stats −2 for 4 turns).",
                "icon": "🌑",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 1
                    }
                ]
            },
            {
                "id": "darkvision",
                "name": "Darkvision",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: See in complete darkness (10 rounds)",
                "icon": "👁️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "shadow_step",
                "name": "Shadow Step",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Applies Shadow Step. Teleport between shadows (60ft range)",
                "icon": "👤",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_bolt"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "shadow_step",
                        "duration": 0,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "fear",
                "name": "Fear",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Apply Mind Controlled (target flees in terror — cannot approach you for 3 turns).",
                "icon": "😱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "darkvision"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "darkness",
                "name": "Darkness",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: Create 20ft radius of magical darkness",
                "icon": "⚫",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_bolt"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "shadow_duplicate",
                "name": "Shadow Duplicate",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: Create dark duplicate (50% your stats, 5 turns)",
                "icon": "👥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_step",
                        "darkness"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "nightmare",
                "name": "Nightmare",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Assault a sleeping target's mind — automatically hits (no attack roll). 2d6 darkness damage + Magic Power.",
                "icon": "💭",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fear"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "life_drain",
                "name": "Life Drain",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Spell: Steal 2d4 HP from target, heal yourself same amount",
                "icon": "🖤",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fear"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "darkness_attunement",
                "name": "Darkness Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to darkness magic. GRANTS: Darkness resistance 50% (half darkness damage); Light weakness 200% (double light damage)",
                "icon": "🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fear",
                        "darkness"
                    ]
                },
                "elementalType": "darkness",
                "specialEffects": [
                    "darkness_resistance",
                    "light_weakness"
                ]
            },
            {
                "id": "shadow_armor",
                "name": "Shadow Armor",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: Darkness cloaks you (+3 Physical Defence and +3 Magical Defence (AC bonus), +2 Stealth)",
                "icon": "🥷",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "darkness"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "void_prison",
                "name": "Void Prison",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: Banish target to shadow realm (removed for 3 turns)",
                "icon": "🕳️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_duplicate",
                        "nightmare"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "soul_steal",
                "name": "Soul Steal",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Spell: Drain 1 point from all target stats for 1 day (curse). You regain 2d4 HP.",
                "icon": "👻",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "life_drain",
                        "shadow_armor"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "eclipse",
                "name": "Eclipse",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: 30ft void. One attack roll per enemy (d20 + accuracy vs Magical Defence); on each hit, 3d6 darkness damage + Magic Power. Enemies inside have a 75% chance to apply Mind Controlled (cower in terror). You gain +2 Stealth while the eclipse lasts.",
                "icon": "🌚",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_armor"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "void_mastery",
                "name": "Void Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master darkness magic, enhanced shadow manipulation. GRANTS: Darkness resistance 50% (half darkness damage); Light weakness 200% (double light damage)",
                "icon": "🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "darkness_attunement"
                    ]
                },
                "elementalType": "darkness",
                "specialEffects": [
                    "darkness_resistance",
                    "light_weakness"
                ]
            },
            {
                "id": "darkness_mastery",
                "name": "Darkness Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with darkness for 3 rounds. Gain immunity to darkness damage, permanent invisibility while in shadows, +50% darkness spell damage, all attacks apply Mind Controlled (fear), and can phase through walls for 1 turn per use.",
                "icon": "🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "void_prison",
                        "soul_steal",
                        "eclipse"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            }
        ],
        "light": [
            {
                "id": "light_ray",
                "name": "Light Ray",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Spell: Radiant beam. Attack roll d20 + accuracy vs Magical Defence; on a hit, 1d6 light damage + Magic Power and blind for 1 turn. Deals +1d6 light damage vs undead, demons, and darkness creatures.",
                "icon": "☀️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "illuminate",
                "name": "Illuminate",
                "tier": 1,
                "cost": 8,
                "staminaCost": 1,
                "desc": "Spell: Bright light (60ft radius, reveals invisible)",
                "icon": "💡",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "healing_light",
                "name": "Healing Light",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell: Restore 2d4+3 HP instantly + apply Regeneration (immunity to poison)",
                "icon": "✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_ray"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "regeneration",
                        "duration": 5,
                        "potency": 2,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "purify",
                "name": "Purify",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Spell: Applies Purify. Remove poison, disease, and curses",
                "icon": "🧽",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "illuminate"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "purify",
                        "duration": 0,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "blinding_flash",
                "name": "Blinding Flash",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Spell: 15ft radius flash blinds all enemies for 1 turn",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_ray"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "holy_weapon",
                "name": "Holy Weapon",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell: Apply Weapon Enchanted (+1d6 radiant damage, extra vs undead)",
                "icon": "⚔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "healing_light",
                        "purify"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weapon_enchanted",
                        "duration": 10,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "sanctuary",
                "name": "Sanctuary",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Spell: Protected area (enemies cannot enter 20ft radius)",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "purify"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "light_attunement",
                "name": "Light Attunement",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Become attuned to light magic. GRANTS: Light resistance 50% (half light damage); Darkness weakness 200% (double darkness damage)",
                "icon": "☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "healing_light",
                        "purify"
                    ]
                },
                "elementalType": "light",
                "specialEffects": [
                    "light_resistance",
                    "darkness_weakness"
                ]
            },
            {
                "id": "laser_beam",
                "name": "Laser Beam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 7,
                "desc": "Spell: Concentrated light beam. Attack roll d20 + accuracy vs Magical Defence (treat target Magical Defence as 3 lower); on a hit, 3d6 light damage + Magic Power.",
                "icon": "🔆",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "blinding_flash"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "light_shield",
                "name": "Light Shield",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell: Radiant barrier (+3 Physical Defence and +3 Magical Defence (AC bonus), reflects dark magic)",
                "icon": "🌟",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "blinding_flash"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "resurrection",
                "name": "Resurrection",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "Spell: Bring ally back to life (once per day)",
                "icon": "🕊️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "holy_weapon",
                        "sanctuary"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "solar_flare",
                "name": "Solar Flare",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Spell: 40ft radius explosion. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 5d6 light damage + Magic Power. Allies in the radius gain Protected (absorb 1 attack). Friendly fire possible.",
                "icon": "🌟",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "laser_beam",
                        "light_shield"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "divine_judgment",
                "name": "Divine Judgment",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Spell: Attack roll d20 + accuracy vs Magical Defence; on a hit, 4d6 light damage + Magic Power vs normal foes, or 6d6 vs undead, demons, and corrupted creatures.",
                "icon": "⚖️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_shield"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "radiant_mastery",
                "name": "Radiant Mastery",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Master light magic, enhanced radiant energy. GRANTS: Light resistance 50% (half light damage); Darkness weakness 200% (double darkness damage)",
                "icon": "☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_attunement"
                    ]
                },
                "elementalType": "light",
                "specialEffects": [
                    "light_resistance",
                    "darkness_weakness"
                ]
            },
            {
                "id": "light_mastery",
                "name": "Light Mastery",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Action (3 uses per day): Become one with light for 3 rounds. Gain immunity to light damage, emit bright light (30ft — enemies are Blinded), +50% light spell damage, all allies within 10ft gain Enhanced (+2 all stats), and you can teleport to any bright light within 100ft as a bonus action.",
                "icon": "☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "resurrection",
                        "solar_flare",
                        "divine_judgment"
                    ]
                },
                "specialEffects": []
            }
        ]
    },
    "monster": {
        "defense": [
            {
                "id": "tough_skin",
                "name": "Tough Skin",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Passive: +2 Physical Defence.",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "defense",
                "specialEffects": []
            },
            {
                "id": "rock_skin",
                "name": "Rock Skin",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "Passive: +3 Physical Defence; resist piercing (GM).",
                "icon": "🗿",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tough_skin"
                    ]
                },
                "lootType": "defense",
                "specialEffects": []
            },
            {
                "id": "metal_skin",
                "name": "Metal Skin",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: +4 Physical Defence; resist slashing (GM).",
                "icon": "⚙️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "rock_skin"
                    ]
                },
                "lootType": "defense",
                "specialEffects": []
            },
            {
                "id": "magical_resistance",
                "name": "Magical Resistance",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "Passive: +3 Magical Defence.",
                "icon": "🔮",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "defense",
                "specialEffects": []
            },
            {
                "id": "damage_reduction",
                "name": "Damage Reduction",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Reduce all incoming damage by 2 (applied after a hit).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tough_skin",
                        "magical_resistance"
                    ]
                },
                "specialEffects": [
                    "damage_reduction"
                ]
            },
            {
                "id": "regeneration",
                "name": "Regeneration",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: Apply Regeneration status (2 HP/turn + poison resistance) - does not stack with other regeneration",
                "icon": "💚",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "damage_reduction"
                    ]
                },
                "specialEffects": [
                    "regeneration"
                ]
            },
            {
                "id": "rapid_healing",
                "name": "Rapid Healing",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: Enhanced Regeneration (3 HP/turn + strong DoT resistance) - replaces basic regeneration",
                "icon": "✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "regeneration"
                    ]
                },
                "specialEffects": [
                    "rapid_regeneration"
                ]
            },
            {
                "id": "armored_plates",
                "name": "Armored Plates",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: +2 Physical Defence and +2 Magical Defence; immune to critical hits.",
                "icon": "🦀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "rock_skin"
                    ]
                },
                "lootType": "defense",
                "specialEffects": [
                    "critical_immunity"
                ]
            },
            {
                "id": "spell_turning",
                "name": "Spell Turning",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "25% chance to reflect spells back at caster",
                "icon": "🔄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "magical_resistance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "immunity_poison",
                "name": "Poison Resistance",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Passive: Strong resistance to all poisons and diseases (25% damage from poison effects)",
                "icon": "☠️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": [
                    "poison_resistance",
                    "disease_immunity"
                ]
            }
        ],
        "combat": [
            {
                "id": "claws",
                "name": "Natural Claws",
                "tier": 1,
                "cost": 8,
                "staminaCost": 2,
                "desc": "Action: Claw attack. Attack roll d20 + accuracy vs Physical Defence; on a hit, 1d6+2 slashing damage.",
                "icon": "🦅",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "razor_claws",
                "name": "Razor Claws",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Claw attack. Attack roll d20 + accuracy vs Physical Defence; on a hit, 1d8+3 slashing damage; causes bleeding (GM).",
                "icon": "🩸",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "claws"
                    ]
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "venomous_claws",
                "name": "Venomous Claws",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Claw attack. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + poison 1d4/turn (GM).",
                "icon": "🟢",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "razor_claws"
                    ]
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "bite_attack",
                "name": "Powerful Bite",
                "tier": 1,
                "cost": 8,
                "staminaCost": 3,
                "desc": "Action: Bite. Attack roll d20 + accuracy vs Physical Defence; on a hit, 1d8+1 piercing damage.",
                "icon": "🦷",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "crushing_bite",
                "name": "Crushing Bite",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Bite. Attack roll d20 + accuracy vs Physical Defence (treat Physical Defence as 2 lower); on a hit, 2d6+2 damage.",
                "icon": "💀",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "bite_attack"
                    ]
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "tail_swipe",
                "name": "Tail Swipe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Action: Tail sweep — adjacent enemies. Separate attack roll (d20 + accuracy vs Physical Defence) vs each; 1d6 damage on each hit.",
                "icon": "🦎",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "spiked_tail",
                "name": "Spiked Tail",
                "tier": 3,
                "cost": 40,
                "staminaCost": 4,
                "desc": "Action: Tail strike (10ft reach). Attack roll d20 + accuracy vs Physical Defence; on a hit, 1d10+3 piercing damage.",
                "icon": "🦂",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tail_swipe"
                    ]
                },
                "lootType": "combat",
                "specialEffects": []
            },
            {
                "id": "monster_charge_attack",
                "name": "Monster Charge",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Action: Charge 20ft and attack. Attack roll d20 + accuracy vs Physical Defence; double weapon/natural damage on hit.",
                "icon": "🐂",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "monster_berserker_rage",
                "name": "Monster Rage",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Toggle: +4 damage, +2 attacks per turn, −2 Physical Defence and −2 Magical Defence for 3 turns.",
                "icon": "😡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "monster_charge_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "multiattack",
                "name": "Multiattack",
                "tier": 4,
                "cost": 163,
                "staminaCost": 0,
                "desc": "Passive: Each turn, make 2 different attacks (each pays its own stamina cost).",
                "icon": "⚔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "claws",
                        "bite_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "rend",
                "name": "Rend",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Passive: If both claw attacks hit the same target in one turn, deal bonus 1d6 damage.",
                "icon": "🩸",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "razor_claws"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "pounce",
                "name": "Pounce",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Leap 15ft and attack. Attack roll d20 + accuracy vs Physical Defence; on a hit, knock prone.",
                "icon": "🦘",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "claws"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "gore",
                "name": "Gore Attack",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Horn attack. Attack roll d20 + accuracy vs Physical Defence; on a hit, 1d8+2 piercing and push 5ft.",
                "icon": "🐗",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "trample",
                "name": "Trample",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Action: Move through enemies; each takes 1d6 damage (GM: attack roll or save as appropriate).",
                "icon": "🦏",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "monster_charge_attack"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "monster_blood_frenzy",
                "name": "Blood Frenzy",
                "tier": 4,
                "cost": 65,
                "staminaCost": 0,
                "desc": "Passive: When an enemy drops below 25% HP, gain +3 damage until end of combat.",
                "icon": "🩸",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "monster_berserker_rage"
                    ]
                },
                "specialEffects": []
            }
        ],
        "magic": [
            {
                "id": "fire_breath",
                "name": "Fire Breath",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Action: 30ft cone. Attack roll d20 + accuracy vs Magical Defence vs each target; on a hit, 2d8 fire + apply Burn. Grants fire resistance; ice/water weakness.",
                "icon": "🔥",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ice_breath",
                "name": "Ice Breath",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Action: 30ft cone. Attack roll d20 + accuracy vs Magical Defence vs each target; on a hit, 2d6 cold + apply Weakened. Grants ice/water resistance; fire/lightning weakness.",
                "icon": "❄️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "poison_breath",
                "name": "Poison Breath",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Action: 25ft cone. Attack roll d20 + accuracy vs Magical Defence vs each target; on a hit, 1d8 poison + apply Poison. Grants poison resistance; light/fire weakness.",
                "icon": "☠️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "poison",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "poison",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "lightning_breath",
                "name": "Lightning Breath",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Action: 60ft line. Attack roll d20 + accuracy vs Magical Defence vs each target; on a hit, 2d10 lightning + apply Immobilized. Grants lightning resistance; earth/water weakness.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "acid_spit",
                "name": "Acid Spit",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "Action: Spit acid (ranged). Attack roll d20 + accuracy vs Physical Defence; on a hit, 1d8 acid + apply Acid Corrosion. Grants poison resistance; ice/water weakness.",
                "icon": "🟢",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "acid",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "acid_corrosion",
                        "duration": 5,
                        "potency": 1,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "fear_aura",
                "name": "Fear Aura",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Passive: Apply Intimidating Aura (enemies must save vs Mind Control)",
                "icon": "😨",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": [
                    "intimidating_aura"
                ]
            },
            {
                "id": "paralyzing_gaze",
                "name": "Paralyzing Gaze",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Target within 60ft: Apply Immobilized (cannot move but can attack)",
                "icon": "👁️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "invisibility",
                "name": "Invisibility",
                "tier": 4,
                "cost": 65,
                "staminaCost": 12,
                "desc": "Apply Stealth Mastery (invisible + strong mind control resistance)",
                "icon": "👻",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "stealth_mastery",
                        "duration": 5,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "teleport",
                "name": "Teleport",
                "tier": 3,
                "cost": 40,
                "staminaCost": 8,
                "desc": "Instantly move up to 60ft to visible location",
                "icon": "✨",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": []
            },
            {
                "id": "web_shot",
                "name": "Web Shot",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Action: Ranged: Apply Immobilized (cannot move for 3 turns)",
                "icon": "🕸️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "monster_earthquake",
                "name": "Monster Earthquake",
                "tier": 4,
                "cost": 65,
                "staminaCost": 15,
                "desc": "30ft radius: 3d6 damage, knock prone, difficult terrain. Grants earth resistance, wind/lightning weakness",
                "icon": "🌍",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "earth",
                "specialEffects": []
            },
            {
                "id": "mind_control",
                "name": "Mind Control",
                "tier": 5,
                "cost": 100,
                "staminaCost": 15,
                "desc": "Apply Mind Controlled (control enemy actions for 3 turns)",
                "icon": "🧠",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "paralyzing_gaze"
                    ]
                },
                "lootType": "magic",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "energy_drain",
                "name": "Energy Drain",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action: Touch: Apply Weakened (all stats -2) and drain 1d4 stamina",
                "icon": "🖤",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "monster_shadow_step",
                "name": "Monster Shadow Step",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Move from shadow to shadow within 40ft. Grants darkness resistance, light weakness",
                "icon": "🌑",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "elementalType": "shadow",
                "specialEffects": []
            },
            {
                "id": "roar",
                "name": "Terrifying Roar",
                "tier": 2,
                "cost": 20,
                "staminaCost": 5,
                "desc": "20ft radius: Apply Mind Controlled (fear variant - enemies flee)",
                "icon": "🦁",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "magic",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            }
        ],
        "utility": [
            {
                "id": "monster_flight",
                "name": "Monster Flight",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: Apply Enhanced Mobility (flight + strong immobilization resistance)",
                "icon": "🦅",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": [
                    "enhanced_mobility"
                ]
            },
            {
                "id": "burrow",
                "name": "Burrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "Dig through earth at half speed, surprise attacks",
                "icon": "🕳️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "climb",
                "name": "Natural Climber",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Climb speed equal to land speed, no checks needed",
                "icon": "🧗",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "swim",
                "name": "Aquatic",
                "tier": 1,
                "cost": 8,
                "staminaCost": 0,
                "desc": "Swim speed, hold breath for 30 rounds",
                "icon": "🏊",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "echolocation",
                "name": "Echolocation",
                "tier": 2,
                "cost": 20,
                "staminaCost": 0,
                "desc": "See in complete darkness within 60ft",
                "icon": "🦇",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "camouflage",
                "name": "Camouflage",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Blend with surroundings: +8 to stealth checks",
                "icon": "🦎",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "pack_leader",
                "name": "Pack Leader",
                "tier": 3,
                "cost": 40,
                "staminaCost": 0,
                "desc": "Summon 1d4 lesser creatures to fight for 5 turns",
                "icon": "🐺",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "size_change",
                "name": "Size Change",
                "tier": 4,
                "cost": 65,
                "staminaCost": 10,
                "desc": "Double size for 5 turns: +4 Str, +2 reach, -2 Physical Defence and -2 Magical Defence",
                "icon": "📏",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "phase_shift",
                "name": "Phase Shift",
                "tier": 5,
                "cost": 100,
                "staminaCost": 12,
                "desc": "Become incorporeal for 3 turns, strong resistance to physical damage (25%)",
                "icon": "👻",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "invisibility"
                    ]
                },
                "lootType": "utility",
                "specialEffects": []
            },
            {
                "id": "monster_ancient_knowledge",
                "name": "Ancient Knowledge",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive: Know weakness of any creature (+4 damage vs that type)",
                "icon": "📚",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "lootType": "utility",
                "specialEffects": []
            }
        ]
    },
    "fusion": {
        "ranged_magic": [
            {
                "id": "flame_arrow",
                "name": "Flame Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🏹🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "fireball"
                    ]
                },
                "fusionType": "bow_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "inferno_volley",
                "name": "Inferno Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 ranged attacks from cover (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🔥🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "fire_wall"
                    ]
                },
                "fusionType": "bow_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "phoenix_shot",
                "name": "Phoenix Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One devastating aimed shot from safety. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "🦅🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_arrow",
                        "inferno_volley"
                    ]
                },
                "fusionType": "bow_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_arrow",
                "name": "Frost Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🏹❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "ice_shard"
                    ]
                },
                "fusionType": "bow_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "glacier_volley",
                "name": "Glacier Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 ice-empowered shots (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "❄️🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "ice_wall"
                    ]
                },
                "fusionType": "bow_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "blizzard_shot",
                "name": "Blizzard Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One devastating ranged shot from safety. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_arrow",
                        "glacier_volley"
                    ]
                },
                "fusionType": "bow_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_arrow",
                "name": "Storm Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🏹⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "spark"
                    ]
                },
                "fusionType": "bow_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_volley",
                "name": "Thunder Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 lightning-empowered shots (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "thunder_clap"
                    ]
                },
                "fusionType": "bow_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "bow_lightning_storm",
                "name": "Lightning Volley",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): Fire an arrow that chains lightning between up to three targets within 30ft. Attack roll d20 + accuracy vs Physical Defence per jump; on each hit, weapon damage + 3d6 lightning damage. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_arrow",
                        "thunder_volley"
                    ]
                },
                "fusionType": "bow_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "stone_arrow",
                "name": "Stone Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🏹🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "stone_throw"
                    ]
                },
                "fusionType": "bow_earth",
                "specialEffects": []
            },
            {
                "id": "crystal_volley",
                "name": "Crystal Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 earth-empowered shots (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🪨🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "stone_wall"
                    ]
                },
                "fusionType": "bow_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "mountain_shot",
                "name": "Mountain Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One devastating ranged shot from safety. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🏔️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_arrow",
                        "crystal_volley"
                    ]
                },
                "fusionType": "bow_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "wind_arrow",
                "name": "Wind Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🏹💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "gust"
                    ]
                },
                "fusionType": "bow_wind",
                "specialEffects": []
            },
            {
                "id": "gale_volley",
                "name": "Gale Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 wind-curved shots that ignore half cover (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 wind damage. Has a 40% chance to apply Weakened.",
                "icon": "💨🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "wind_barrier"
                    ]
                },
                "fusionType": "bow_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hurricane_shot",
                "name": "Hurricane Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One devastating ranged shot from safety. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_arrow",
                        "gale_volley"
                    ]
                },
                "fusionType": "bow_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "water_arrow",
                "name": "Water Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🏹💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "water_splash"
                    ]
                },
                "fusionType": "bow_water",
                "specialEffects": []
            },
            {
                "id": "tide_volley",
                "name": "Tide Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 flowing water arrows (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 water damage and you heal for half the damage dealt. Has a 40% chance to apply Weakened.",
                "icon": "💧🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "water_shield"
                    ]
                },
                "fusionType": "bow_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tsunami_shot",
                "name": "Tsunami Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One arrow that bursts into a wave on impact (30ft). Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 water damage and push the target 10ft. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_arrow",
                        "tide_volley"
                    ]
                },
                "fusionType": "bow_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_arrow",
                "name": "Shadow Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🏹🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "bow_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_volley",
                "name": "Void Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 darkness-empowered shots (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "shadow_armor"
                    ]
                },
                "fusionType": "bow_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "eclipse_shot",
                "name": "Eclipse Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One devastating ranged shot from safety. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🌑✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_arrow",
                        "void_volley"
                    ]
                },
                "fusionType": "bow_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "light_arrow",
                "name": "Light Arrow",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Preparation): While active, ranged attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🏹☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_draw",
                        "light_ray"
                    ]
                },
                "fusionType": "bow_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "radiant_volley",
                "name": "Radiant Volley",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fire 2 light-empowered shots (Multi Shot). Each attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "☀️🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "light_shield"
                    ]
                },
                "fusionType": "bow_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "solar_shot",
                "name": "Solar Shot",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Distance): One devastating ranged shot from safety. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 3d6 light damage. Has a 75% chance to apply Blinded.",
                "icon": "☀️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_arrow",
                        "radiant_volley"
                    ]
                },
                "fusionType": "bow_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            }
        ],
        "melee_magic": [
            {
                "id": "flame_edge",
                "name": "Flame Edge",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "⚔️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "fireball"
                    ]
                },
                "fusionType": "sword_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "inferno_parry",
                "name": "Inferno Parry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry and riposte with a fire-charged slash. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🛡️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "fire_wall"
                    ]
                },
                "fusionType": "sword_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "blazing_tempest",
                "name": "Blazing Tempest",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Spinning flame strike — separate attack roll per enemy within 10ft (d20 + accuracy vs Physical Defence −2); on each hit, weapon damage + 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "🌪️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_edge",
                        "inferno_parry"
                    ]
                },
                "fusionType": "sword_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frostbrand",
                "name": "Frostbrand",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "⚔️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "ice_shard"
                    ]
                },
                "fusionType": "sword_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "glacial_riposte",
                "name": "Glacial Riposte",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry and riposte with a freezing slash. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "🛡️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "ice_wall"
                    ]
                },
                "fusionType": "sword_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "winters_fury",
                "name": "Winter's Fury",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Whirling finish — separate attack roll per enemy within 10ft (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frostbrand",
                        "glacial_riposte"
                    ]
                },
                "fusionType": "sword_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_blade",
                "name": "Storm Blade",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "⚔️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "spark"
                    ]
                },
                "fusionType": "sword_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_parry",
                "name": "Thunder Parry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry and riposte with a lightning-charged slash. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🛡️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "thunder_clap"
                    ]
                },
                "fusionType": "sword_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "lightning_surge",
                "name": "Lightning Surge",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Whirling finish — separate attack roll per enemy within 10ft (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🌩️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_blade",
                        "thunder_parry"
                    ]
                },
                "fusionType": "sword_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "stonecutter",
                "name": "Stonecutter",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "⚔️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "stone_throw"
                    ]
                },
                "fusionType": "sword_earth",
                "specialEffects": []
            },
            {
                "id": "earthen_guard",
                "name": "Earthen Guard",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry and raise a stone barrier. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 earth damage. You gain Enhanced (+2 all stats) for 2 turns. Has a 40% chance to apply Incapacitated.",
                "icon": "🛡️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "stone_wall"
                    ]
                },
                "fusionType": "sword_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "quake_slash",
                "name": "Quake Slash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Finishing slash. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🌋🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stonecutter",
                        "earthen_guard"
                    ]
                },
                "fusionType": "sword_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "gale_blade",
                "name": "Gale Blade",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "⚔️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "gust"
                    ]
                },
                "fusionType": "sword_wind",
                "specialEffects": []
            },
            {
                "id": "cyclone_parry",
                "name": "Cyclone Parry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry inside a swirling wind barrier. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 wind damage. You gain Enhanced Mobility for 1 turn. Has a 40% chance to apply Weakened.",
                "icon": "🛡️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "wind_barrier"
                    ]
                },
                "fusionType": "sword_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 1,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tempest_dance",
                "name": "Tempest Dance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Finishing slash. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gale_blade",
                        "cyclone_parry"
                    ]
                },
                "fusionType": "sword_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "tidecutter",
                "name": "Tidecutter",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "⚔️💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "water_splash"
                    ]
                },
                "fusionType": "sword_water",
                "specialEffects": []
            },
            {
                "id": "aqua_parry",
                "name": "Aqua Parry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry into a rebounding wave. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 water damage, heal yourself for 1d6 HP, and push the attacker 5ft. Has a 40% chance to apply Weakened.",
                "icon": "🛡️💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "water_shield"
                    ]
                },
                "fusionType": "sword_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "maelstrom_slash",
                "name": "Maelstrom Slash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Spinning water slash — separate attack roll per enemy within 10ft (d20 + accuracy vs Physical Defence); on each hit, weapon damage + 3d6 water damage. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tidecutter",
                        "aqua_parry"
                    ]
                },
                "fusionType": "sword_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_edge",
                "name": "Shadow Edge",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "⚔️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "sword_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "night_parry",
                "name": "Night Parry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry and slip into shadow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 darkness damage. You gain Stealth Mastery until your next turn. Has a 40% chance to apply Mind Controlled.",
                "icon": "🛡️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "shadow_armor"
                    ]
                },
                "fusionType": "sword_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "umbral_onslaught",
                "name": "Umbral Onslaught",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Whirling finish — separate attack roll per enemy within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🌑🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_edge",
                        "night_parry"
                    ]
                },
                "fusionType": "sword_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "radiant_blade",
                "name": "Radiant Blade",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Technique): While active, sword attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "⚔️☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quick_strike",
                        "light_ray"
                    ]
                },
                "fusionType": "sword_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "solar_parry",
                "name": "Solar Parry",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Reaction (Counterplay): Parry and flash radiant light. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 light damage. Allies within 10ft heal 1d6 HP. Has a 40% chance to apply Blinded.",
                "icon": "🛡️☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "light_shield"
                    ]
                },
                "fusionType": "sword_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "judgment_slash",
                "name": "Judgment Slash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Momentum): Radiant finishing slash. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 light damage and remove all debuffs from allies within 10ft. Has a 75% chance to apply Blinded.",
                "icon": "⚖️☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "radiant_blade",
                        "solar_parry"
                    ]
                },
                "fusionType": "sword_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "flame_dagger",
                "name": "Flame Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🗡️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "fireball"
                    ]
                },
                "fusionType": "dagger_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "inferno_strike",
                "name": "Inferno Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fast vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🔥🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "fire_wall"
                    ]
                },
                "fusionType": "dagger_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "phoenix_dance",
                "name": "Phoenix Dance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "🦅🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_dagger",
                        "inferno_strike"
                    ]
                },
                "fusionType": "dagger_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_dagger",
                "name": "Frost Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🗡️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "ice_shard"
                    ]
                },
                "fusionType": "dagger_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "freezing_strike",
                "name": "Freezing Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fast vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "❄️🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "ice_wall"
                    ]
                },
                "fusionType": "dagger_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "arctic_barrage",
                "name": "Arctic Barrage",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_dagger",
                        "freezing_strike"
                    ]
                },
                "fusionType": "dagger_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_dagger",
                "name": "Storm Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🗡️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "spark"
                    ]
                },
                "fusionType": "dagger_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_strike",
                "name": "Thunder Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fast vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "thunder_clap"
                    ]
                },
                "fusionType": "dagger_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "storm_flurry",
                "name": "Storm Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 lightning damage. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_dagger",
                        "thunder_strike"
                    ]
                },
                "fusionType": "dagger_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "stone_dagger",
                "name": "Stone Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🗡️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "stone_throw"
                    ]
                },
                "fusionType": "dagger_earth",
                "specialEffects": []
            },
            {
                "id": "crystal_strike",
                "name": "Crystal Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fast vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "💎🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "stone_wall"
                    ]
                },
                "fusionType": "dagger_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "earthen_assault",
                "name": "Earthen Assault",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🌋🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_dagger",
                        "crystal_strike"
                    ]
                },
                "fusionType": "dagger_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "wind_dagger",
                "name": "Wind Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🗡️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "gust"
                    ]
                },
                "fusionType": "dagger_wind",
                "specialEffects": []
            },
            {
                "id": "zephyr_strike",
                "name": "Zephyr Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Wind-quick vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 wind damage. You gain +2 Speed until your next turn. Has a 40% chance to apply Weakened.",
                "icon": "💨🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "wind_barrier"
                    ]
                },
                "fusionType": "dagger_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hurricane_dance",
                "name": "Hurricane Dance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Magical Defence); on each hit, 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_dagger",
                        "zephyr_strike"
                    ]
                },
                "fusionType": "dagger_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "water_dagger",
                "name": "Water Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🗡️💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "water_splash"
                    ]
                },
                "fusionType": "dagger_water",
                "specialEffects": []
            },
            {
                "id": "tide_strike",
                "name": "Tide Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Flowing vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 water damage and heal yourself for half the damage dealt. Has a 40% chance to apply Weakened.",
                "icon": "🌊🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "water_shield"
                    ]
                },
                "fusionType": "dagger_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tsunami_dance",
                "name": "Tsunami Dance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Water-flow flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 water damage. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_dagger",
                        "tide_strike"
                    ]
                },
                "fusionType": "dagger_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_dagger",
                "name": "Shadow Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🗡️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "dagger_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_strike",
                "name": "Void Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fast vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "shadow_armor"
                    ]
                },
                "fusionType": "dagger_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "night_dance",
                "name": "Night Dance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🌑✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_dagger",
                        "void_strike"
                    ]
                },
                "fusionType": "dagger_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "light_dagger",
                "name": "Light Dagger",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Speed): While active, dagger attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🗡️☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dual_wield",
                        "light_ray"
                    ]
                },
                "fusionType": "dagger_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "radiant_strike",
                "name": "Radiant Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Precision): Fast vital strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "✨🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "vital_strike",
                        "light_shield"
                    ]
                },
                "fusionType": "dagger_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "dawn_dance",
                "name": "Dawn Dance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Agility): Rapid flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 light damage. Has a 75% chance to apply Blinded.",
                "icon": "☀️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_dagger",
                        "radiant_strike"
                    ]
                },
                "fusionType": "dagger_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "flame_glaive",
                "name": "Flame Glaive",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🔱🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "fireball"
                    ]
                },
                "fusionType": "polearm_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "blazing_sweep",
                "name": "Blazing Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Reach sweep — separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🔥🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "fire_wall"
                    ]
                },
                "fusionType": "polearm_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "solar_lance",
                "name": "Solar Lance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "☀️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_glaive",
                        "blazing_sweep"
                    ]
                },
                "fusionType": "polearm_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_halberd",
                "name": "Frost Halberd",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🔱❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "ice_shard"
                    ]
                },
                "fusionType": "polearm_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "glacier_sweep",
                "name": "Glacier Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Reach sweep — separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "❄️🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "ice_wall"
                    ]
                },
                "fusionType": "polearm_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "winter_vortex",
                "name": "Winter Vortex",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_halberd",
                        "glacier_sweep"
                    ]
                },
                "fusionType": "polearm_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_glaive",
                "name": "Storm Glaive",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🔱⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "spark"
                    ]
                },
                "fusionType": "polearm_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_sweep",
                "name": "Thunder Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Reach sweep — separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "thunder_clap"
                    ]
                },
                "fusionType": "polearm_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "lightning_spiral",
                "name": "Lightning Spiral",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 lightning damage. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_glaive",
                        "thunder_sweep"
                    ]
                },
                "fusionType": "polearm_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "stone_halberd",
                "name": "Stone Halberd",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🔱🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "stone_throw"
                    ]
                },
                "fusionType": "polearm_earth",
                "specialEffects": []
            },
            {
                "id": "earthen_sweep",
                "name": "Earthen Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Reach sweep — separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🪨🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "stone_wall"
                    ]
                },
                "fusionType": "polearm_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tectonic_spiral",
                "name": "Tectonic Spiral",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🌋🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_halberd",
                        "earthen_sweep"
                    ]
                },
                "fusionType": "polearm_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "wind_glaive",
                "name": "Wind Glaive",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🔱💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "gust"
                    ]
                },
                "fusionType": "polearm_wind",
                "specialEffects": []
            },
            {
                "id": "cyclone_sweep",
                "name": "Cyclone Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Wind-empowered reach sweep. Separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 wind damage. You gain +2 Speed until your next turn. Has a 40% chance to apply Weakened.",
                "icon": "💨🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "wind_barrier"
                    ]
                },
                "fusionType": "polearm_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tempest_spiral",
                "name": "Tempest Spiral",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_glaive",
                        "cyclone_sweep"
                    ]
                },
                "fusionType": "polearm_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "water_glaive",
                "name": "Water Glaive",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🔱💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "water_splash"
                    ]
                },
                "fusionType": "polearm_water",
                "specialEffects": []
            },
            {
                "id": "wave_sweep",
                "name": "Wave Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Flowing reach sweep. Separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 water damage and heal yourself for half the total damage dealt. Has a 40% chance to apply Weakened.",
                "icon": "🌊🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "water_shield"
                    ]
                },
                "fusionType": "polearm_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "maelstrom_spiral",
                "name": "Maelstrom Spiral",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Spiral water sweep — separate attack roll per enemy within 15ft (d20 + accuracy vs Magical Defence); on each hit, 3d6 water damage. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_glaive",
                        "wave_sweep"
                    ]
                },
                "fusionType": "polearm_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_glaive",
                "name": "Shadow Glaive",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🔱🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "polearm_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_sweep",
                "name": "Void Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Reach sweep — separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "shadow_armor"
                    ]
                },
                "fusionType": "polearm_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "eclipse_spiral",
                "name": "Eclipse Spiral",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🌑✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_glaive",
                        "void_sweep"
                    ]
                },
                "fusionType": "polearm_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "light_glaive",
                "name": "Light Glaive",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Reach): While active, polearm attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🔱☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thrust_attack",
                        "light_ray"
                    ]
                },
                "fusionType": "polearm_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "radiant_sweep",
                "name": "Radiant Sweep",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Battlefield Control): Reach sweep — separate attack roll per target within 15ft (d20 + accuracy vs Magical Defence); on each hit, 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "✨🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sweep_attack",
                        "light_shield"
                    ]
                },
                "fusionType": "polearm_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "solar_spiral",
                "name": "Solar Spiral",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Discipline): Measured finishing thrust at reach. Attack roll d20 + accuracy vs Magical Defence; on a hit, 3d6 light damage. Has a 75% chance to apply Blinded.",
                "icon": "☀️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_glaive",
                        "radiant_sweep"
                    ]
                },
                "fusionType": "polearm_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "flame_hammer",
                "name": "Flame Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🔨🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "fireball"
                    ]
                },
                "fusionType": "hammer_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "magma_smash",
                "name": "Magma Smash",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Crushing ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🌋🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "fire_wall"
                    ]
                },
                "fusionType": "hammer_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "volcanic_eruption",
                "name": "Volcanic Eruption",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous finishing blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "🌋💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_hammer",
                        "magma_smash"
                    ]
                },
                "fusionType": "hammer_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_hammer",
                "name": "Frost Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🔨❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "ice_shard"
                    ]
                },
                "fusionType": "hammer_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "glacial_pound",
                "name": "Glacial Pound",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Freezing ground slam. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 ice damage. Enemies within 10ft are Slowed and have a 40% chance to apply Immobilized.",
                "icon": "❄️🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "ice_wall"
                    ]
                },
                "fusionType": "hammer_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "permafrost_crash",
                "name": "Permafrost Crash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous finishing blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "❄️💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_hammer",
                        "glacial_pound"
                    ]
                },
                "fusionType": "hammer_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_hammer",
                "name": "Storm Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🔨⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "spark"
                    ]
                },
                "fusionType": "hammer_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_slam",
                "name": "Thunder Slam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Crushing ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "thunder_clap"
                    ]
                },
                "fusionType": "hammer_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "storm_surge",
                "name": "Storm Surge",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 lightning damage. One adjacent foe takes half that lightning damage (no roll). Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_hammer",
                        "thunder_slam"
                    ]
                },
                "fusionType": "hammer_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "earthshaker_hammer",
                "name": "Earthshaker Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🔨🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "stone_throw"
                    ]
                },
                "fusionType": "hammer_earth",
                "specialEffects": []
            },
            {
                "id": "tectonic_slam",
                "name": "Tectonic Slam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Crushing ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🪨🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "stone_wall"
                    ]
                },
                "fusionType": "hammer_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "mountain_crash",
                "name": "Mountain Crash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous finishing blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🏔️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earthshaker_hammer",
                        "tectonic_slam"
                    ]
                },
                "fusionType": "hammer_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "gale_hammer",
                "name": "Gale Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🔨💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "gust"
                    ]
                },
                "fusionType": "hammer_wind",
                "specialEffects": []
            },
            {
                "id": "cyclone_slam",
                "name": "Cyclone Slam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Crushing ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 wind damage. Has a 40% chance to apply Weakened.",
                "icon": "💨🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "wind_barrier"
                    ]
                },
                "fusionType": "hammer_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tempest_crash",
                "name": "Tempest Crash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous finishing blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gale_hammer",
                        "cyclone_slam"
                    ]
                },
                "fusionType": "hammer_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "tide_hammer",
                "name": "Tide Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🔨💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "water_splash"
                    ]
                },
                "fusionType": "hammer_water",
                "specialEffects": []
            },
            {
                "id": "wave_slam",
                "name": "Wave Slam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Tidal hammer blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 water damage and heal yourself for half the damage dealt. Has a 40% chance to apply Weakened.",
                "icon": "🌊🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "water_shield"
                    ]
                },
                "fusionType": "hammer_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tsunami_crash",
                "name": "Tsunami Crash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Massive water hammer crash — separate attack roll per enemy within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 water damage. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tide_hammer",
                        "wave_slam"
                    ]
                },
                "fusionType": "hammer_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_hammer",
                "name": "Shadow Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🔨🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "hammer_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_slam",
                "name": "Void Slam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Crushing ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "shadow_armor"
                    ]
                },
                "fusionType": "hammer_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "eclipse_crash",
                "name": "Eclipse Crash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous finishing blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🌑✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_hammer",
                        "void_slam"
                    ]
                },
                "fusionType": "hammer_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "radiant_hammer",
                "name": "Radiant Hammer",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Fortitude): While active, hammer attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🔨☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "armor_crusher",
                        "light_ray"
                    ]
                },
                "fusionType": "hammer_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "solar_slam",
                "name": "Solar Slam",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Crushing Power): Crushing ground strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "☀️🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ground_slam",
                        "light_shield"
                    ]
                },
                "fusionType": "hammer_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "divine_crash",
                "name": "Divine Crash",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Shockwaves): Thunderous finishing blow. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 light damage. Has a 75% chance to apply Blinded.",
                "icon": "☀️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "radiant_hammer",
                        "solar_slam"
                    ]
                },
                "fusionType": "hammer_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "flame_axe",
                "name": "Flame Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🪓🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "fireball"
                    ]
                },
                "fusionType": "axe_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "inferno_cleave",
                "name": "Inferno Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🔥🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "fire_wall"
                    ]
                },
                "fusionType": "axe_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "meteor_strike",
                "name": "Meteor Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "☄️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_axe",
                        "inferno_cleave"
                    ]
                },
                "fusionType": "axe_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_axe",
                "name": "Frost Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🪓❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "ice_shard"
                    ]
                },
                "fusionType": "axe_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "frozen_cleave",
                "name": "Frozen Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "❄️🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "ice_wall"
                    ]
                },
                "fusionType": "axe_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "avalanche_strike",
                "name": "Avalanche Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_axe",
                        "frozen_cleave"
                    ]
                },
                "fusionType": "axe_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_axe",
                "name": "Storm Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🪓⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "spark"
                    ]
                },
                "fusionType": "axe_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "stone_axe",
                "name": "Stone Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🪓🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "stone_throw"
                    ]
                },
                "fusionType": "axe_earth",
                "specialEffects": []
            },
            {
                "id": "wind_axe",
                "name": "Wind Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🪓💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "gust"
                    ]
                },
                "fusionType": "axe_wind",
                "specialEffects": []
            },
            {
                "id": "water_axe",
                "name": "Water Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🪓💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "water_splash"
                    ]
                },
                "fusionType": "axe_water",
                "specialEffects": []
            },
            {
                "id": "shadow_axe",
                "name": "Shadow Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🪓🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "axe_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "light_axe",
                "name": "Light Axe",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Relentlessness): While active, axe attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🪓☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "cleave",
                        "light_ray"
                    ]
                },
                "fusionType": "axe_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_cleave",
                "name": "Thunder Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "electric_field"
                    ]
                },
                "fusionType": "axe_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "storm_strike",
                "name": "Storm Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 lightning damage. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_axe",
                        "thunder_cleave"
                    ]
                },
                "fusionType": "axe_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "earthen_cleave",
                "name": "Earthen Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🪨🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "earth_shield"
                    ]
                },
                "fusionType": "axe_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "quake_strike",
                "name": "Quake Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🌋🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_axe",
                        "earthen_cleave"
                    ]
                },
                "fusionType": "axe_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "gale_cleave",
                "name": "Gale Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 wind damage. Has a 40% chance to apply Weakened.",
                "icon": "💨🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "tornado"
                    ]
                },
                "fusionType": "axe_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hurricane_strike",
                "name": "Hurricane Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_axe",
                        "gale_cleave"
                    ]
                },
                "fusionType": "axe_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "tidal_cleave",
                "name": "Tidal Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 water damage. Has a 40% chance to apply Weakened.",
                "icon": "💧🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "water_shield"
                    ]
                },
                "fusionType": "axe_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "deluge_strike",
                "name": "Deluge Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 water damage. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_axe",
                        "tidal_cleave"
                    ]
                },
                "fusionType": "axe_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "void_cleave",
                "name": "Void Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "shadow_armor"
                    ]
                },
                "fusionType": "axe_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "abyss_strike",
                "name": "Abyss Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🕳️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_axe",
                        "void_cleave"
                    ]
                },
                "fusionType": "axe_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "radiant_cleave",
                "name": "Radiant Cleave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Cleaving): Wide cleave — separate attack roll per target (d20 + accuracy vs Physical Defence); on each hit, 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "☀️🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wide_cleave",
                        "holy_weapon"
                    ]
                },
                "fusionType": "axe_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "dawn_strike",
                "name": "Dawn Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Brute Force): Devastating overhead chop. Attack roll d20 + accuracy vs Physical Defence; on a hit, 3d6 light damage. Has a 75% chance to apply Blinded.",
                "icon": "🌅☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_axe",
                        "radiant_cleave"
                    ]
                },
                "fusionType": "axe_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "flame_staff",
                "name": "Flame Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🪄🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "fireball"
                    ]
                },
                "fusionType": "staff_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "inferno_channel",
                "name": "Inferno Channel",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel fire through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🔥🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "fire_wall"
                    ]
                },
                "fusionType": "staff_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "phoenix_staff",
                "name": "Phoenix Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored fire in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire damage. Has a 75% chance to apply Burn.",
                "icon": "🦅🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flame_staff",
                        "inferno_channel"
                    ]
                },
                "fusionType": "staff_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_staff",
                "name": "Frost Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🪄❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "ice_shard"
                    ]
                },
                "fusionType": "staff_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "glacial_focus",
                "name": "Glacial Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel ice through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "❄️🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "ice_wall"
                    ]
                },
                "fusionType": "staff_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "winter_staff",
                "name": "Winter Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored ice in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice damage. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_staff",
                        "glacial_focus"
                    ]
                },
                "fusionType": "staff_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_staff",
                "name": "Storm Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🪄⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "spark"
                    ]
                },
                "fusionType": "staff_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_focus",
                "name": "Thunder Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel lightning through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "thunder_clap"
                    ]
                },
                "fusionType": "staff_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tempest_staff",
                "name": "Tempest Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored lightning in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning damage. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_staff",
                        "thunder_focus"
                    ]
                },
                "fusionType": "staff_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "stone_staff",
                "name": "Stone Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🪄🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "stone_throw"
                    ]
                },
                "fusionType": "staff_earth",
                "specialEffects": []
            },
            {
                "id": "crystal_focus",
                "name": "Crystal Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel earth through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🪨🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "stone_wall"
                    ]
                },
                "fusionType": "staff_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "mountain_staff",
                "name": "Mountain Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored earth in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 earth damage. Has a 75% chance to apply Incapacitated.",
                "icon": "🏔️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_staff",
                        "crystal_focus"
                    ]
                },
                "fusionType": "staff_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "wind_staff",
                "name": "Wind Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🪄💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "gust"
                    ]
                },
                "fusionType": "staff_wind",
                "specialEffects": []
            },
            {
                "id": "gale_focus",
                "name": "Gale Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel wind through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 wind damage. Has a 40% chance to apply Weakened.",
                "icon": "💨🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "wind_barrier"
                    ]
                },
                "fusionType": "staff_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hurricane_staff",
                "name": "Hurricane Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored wind in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 wind damage. Has a 75% chance to apply Weakened.",
                "icon": "🌪️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_staff",
                        "gale_focus"
                    ]
                },
                "fusionType": "staff_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "water_staff",
                "name": "Water Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 3,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🪄💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "water_splash"
                    ]
                },
                "fusionType": "staff_water",
                "specialEffects": []
            },
            {
                "id": "tide_focus",
                "name": "Tide Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel water through your staff in a 20ft cone. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 2d6 water damage and heal yourself for half the total damage dealt. Has a 40% chance to apply Weakened.",
                "icon": "💧🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "water_shield"
                    ]
                },
                "fusionType": "staff_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tsunami_staff",
                "name": "Tsunami Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Staff becomes a crashing wave — separate attack roll per enemy in a 20ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 water damage. Has a 75% chance to apply Weakened.",
                "icon": "🌊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_staff",
                        "tide_focus"
                    ]
                },
                "fusionType": "staff_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_staff",
                "name": "Shadow Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🪄🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "staff_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_focus",
                "name": "Void Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel darkness through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "shadow_armor"
                    ]
                },
                "fusionType": "staff_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "eclipse_staff",
                "name": "Eclipse Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored darkness in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "🌑✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_staff",
                        "void_focus"
                    ]
                },
                "fusionType": "staff_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "light_staff",
                "name": "Light Staff",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Channeling): While active, staff attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🪄☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spell_power",
                        "light_ray"
                    ]
                },
                "fusionType": "staff_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "radiant_focus",
                "name": "Radiant Focus",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Arcane Focus): Channel light through your staff. Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "☀️🪄",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_strike",
                        "light_shield"
                    ]
                },
                "fusionType": "staff_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "solar_staff",
                "name": "Solar Staff",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Mana Mastery): Release stored light in a 20ft burst. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 light damage. Has a 75% chance to apply Blinded.",
                "icon": "☀️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_staff",
                        "radiant_focus"
                    ]
                },
                "fusionType": "staff_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "ember_fists",
                "name": "Ember Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 fire damage on hit and have a 20% chance to apply Burn. Costs stamina per turn while active.",
                "icon": "🥊🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "fireball"
                    ]
                },
                "fusionType": "striker_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "inferno_palm",
                "name": "Inferno Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 fire damage. Has a 40% chance to apply Burn.",
                "icon": "🔥🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "fire_wall"
                    ]
                },
                "fusionType": "striker_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "phoenix_flurry",
                "name": "Phoenix Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 fire damage. Requires both hands empty. Has a 75% chance to apply Burn.",
                "icon": "🦅🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ember_fists",
                        "inferno_palm"
                    ]
                },
                "fusionType": "striker_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 4,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_fists",
                "name": "Frost Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 ice damage on hit and have a 20% chance to apply Immobilized. Costs stamina per turn while active.",
                "icon": "🥊❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "ice_shard"
                    ]
                },
                "fusionType": "striker_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "glacial_palm",
                "name": "Glacial Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 ice damage. Has a 40% chance to apply Immobilized.",
                "icon": "❄️🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "ice_wall"
                    ]
                },
                "fusionType": "striker_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "avalanche_flurry",
                "name": "Avalanche Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 ice damage. Requires both hands empty. Has a 75% chance to apply Immobilized.",
                "icon": "🌨️🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_fists",
                        "glacial_palm"
                    ]
                },
                "fusionType": "striker_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_fists",
                "name": "Storm Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 lightning damage on hit and have a 20% chance to apply Incapacitated. Costs stamina per turn while active.",
                "icon": "🥊⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "spark"
                    ]
                },
                "fusionType": "striker_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thunder_palm",
                "name": "Thunder Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 lightning damage. Has a 40% chance to apply Incapacitated.",
                "icon": "⚡🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "electric_field"
                    ]
                },
                "fusionType": "striker_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "lightning_flurry",
                "name": "Lightning Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 lightning damage. Requires both hands empty. Has a 75% chance to apply Incapacitated.",
                "icon": "⛈️🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_fists",
                        "thunder_palm"
                    ]
                },
                "fusionType": "striker_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "granite_fists",
                "name": "Granite Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.",
                "icon": "🥊🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "stone_throw"
                    ]
                },
                "fusionType": "striker_earth",
                "specialEffects": []
            },
            {
                "id": "earthen_palm",
                "name": "Earthen Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 earth damage. Has a 40% chance to apply Incapacitated.",
                "icon": "🪨🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "earth_shield"
                    ]
                },
                "fusionType": "striker_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "quake_flurry",
                "name": "Quake Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 earth damage. Requires both hands empty. Has a 75% chance to apply Incapacitated.",
                "icon": "🌋🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "granite_fists",
                        "earthen_palm"
                    ]
                },
                "fusionType": "striker_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "gale_fists",
                "name": "Gale Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.",
                "icon": "🥊💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "gust"
                    ]
                },
                "fusionType": "striker_wind",
                "specialEffects": []
            },
            {
                "id": "cyclone_palm",
                "name": "Cyclone Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 wind damage. Has a 40% chance to apply Weakened.",
                "icon": "💨🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "tornado"
                    ]
                },
                "fusionType": "striker_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hurricane_flurry",
                "name": "Hurricane Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 wind damage. Requires both hands empty. Has a 75% chance to apply Weakened.",
                "icon": "🌪️🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gale_fists",
                        "cyclone_palm"
                    ]
                },
                "fusionType": "striker_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "tide_fists",
                "name": "Tide Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.",
                "icon": "🥊💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "water_splash"
                    ]
                },
                "fusionType": "striker_water",
                "specialEffects": []
            },
            {
                "id": "tidal_palm",
                "name": "Tidal Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 water damage. Has a 40% chance to apply Weakened.",
                "icon": "💧🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "water_shield"
                    ]
                },
                "fusionType": "striker_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tsunami_flurry",
                "name": "Tsunami Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 water damage. Requires both hands empty. Has a 75% chance to apply Weakened.",
                "icon": "🌊🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tide_fists",
                        "tidal_palm"
                    ]
                },
                "fusionType": "striker_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_fists",
                "name": "Shadow Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 darkness damage on hit and have a 20% chance to apply Mind Controlled. Costs stamina per turn while active.",
                "icon": "🥊🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "striker_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "umbral_palm",
                "name": "Umbral Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 darkness damage. Has a 40% chance to apply Mind Controlled.",
                "icon": "🌑🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "shadow_armor"
                    ]
                },
                "fusionType": "striker_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "void_flurry",
                "name": "Void Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 darkness damage. Requires both hands empty. Has a 75% chance to apply Mind Controlled.",
                "icon": "🕳️🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_fists",
                        "umbral_palm"
                    ]
                },
                "fusionType": "striker_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "radiant_fists",
                "name": "Radiant Fists",
                "tier": 2,
                "cost": 20,
                "staminaCost": 2,
                "desc": "Toggle (Empty Hands): While both hands are empty and active, unarmed attacks gain +1d6 light damage on hit and have a 20% chance to apply Blinded. Costs stamina per turn while active.",
                "icon": "🥊☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_basics",
                        "light_ray"
                    ]
                },
                "fusionType": "striker_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "solar_palm",
                "name": "Solar Palm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Action (Feints & Control): Feint into an elemental palm strike (both hands empty). Attack roll d20 + accuracy vs Physical Defence; on a hit, 2d6 light damage. Has a 40% chance to apply Blinded.",
                "icon": "☀️🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "flurry_of_blows",
                        "holy_weapon"
                    ]
                },
                "fusionType": "striker_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "dawn_flurry",
                "name": "Dawn Flurry",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Action (Combo Flow): Elemental flurry — separate attack roll per target within 10ft (d20 + accuracy vs Physical Defence); on each hit, 3d6 light damage. Requires both hands empty. Has a 75% chance to apply Blinded.",
                "icon": "🌅🥊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "radiant_fists",
                        "solar_palm"
                    ]
                },
                "fusionType": "striker_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            }
        ],
        "utility_combat": [
            {
                "id": "alchemical_blade",
                "name": "Alchemical Blade",
                "tier": 4,
                "cost": 65,
                "staminaCost": 5,
                "desc": "Action (Technique): Coat your blade in volatile reagents before striking. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage on hit and apply Poison (escalating 1→2→3 damage over 3 turns).",
                "icon": "⚔️⚗️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "acid_vials"
                    ]
                },
                "fusionType": "sword_alchemy",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "poison",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "enchanted_arrows",
                "name": "Enchanted Arrows",
                "tier": 4,
                "cost": 65,
                "staminaCost": 5,
                "desc": "Enhancement (Preparation): Inscribe runes on a quiver of arrows — your ranged attacks apply Weapon Enchanted (+1 damage and typed effect) for 10 turns.",
                "icon": "🏹✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "multi_shot",
                        "rune_apprentice"
                    ]
                },
                "fusionType": "bow_enchanting",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weapon_enchanted",
                        "duration": 10,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "blessed_weapon",
                "name": "Blessed Weapon",
                "tier": 5,
                "cost": 100,
                "staminaCost": 0,
                "desc": "Passive (Technique): Your weapon radiates holy power — melee attacks deal +1d6 light damage and apply Weapon Enchanted vs undead and corrupted foes.",
                "icon": "⚔️☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "holy_weapon"
                    ]
                },
                "fusionType": "weapon_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weapon_enchanted",
                        "duration": 10,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            }
        ],
        "monster_fusion": [
            {
                "id": "draconic_breath",
                "name": "Draconic Breath",
                "tier": 5,
                "cost": 100,
                "staminaCost": 8,
                "desc": "Action: Unleash draconic fire breath in a 30ft cone. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 4d6 fire damage + Magic Power. Has a 95% chance to apply Burn. You gain Enhanced (+2 all stats) for 3 turns.",
                "icon": "🐉🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_breath",
                        "fire_supremacy"
                    ]
                },
                "fusionType": "monster_fire",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 3,
                        "potency": 1,
                        "applyTo": "target",
                        "chance": 0.95
                    }
                ]
            },
            {
                "id": "shadow_strike",
                "name": "Shadow Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 6,
                "desc": "Action: Teleport up to 20ft, gain Stealth Mastery, then claw strike. Attack roll d20 + accuracy vs Physical Defence; on a hit, weapon damage + 2d6 darkness damage. Has a 75% chance to apply Mind Controlled.",
                "icon": "👥🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "razor_claws",
                        "monster_shadow_step"
                    ]
                },
                "fusionType": "monster_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "arcane_roar",
                "name": "Arcane Roar",
                "tier": 4,
                "cost": 65,
                "staminaCost": 7,
                "desc": "Action: Arcane-enhanced roar in a 20ft cone. Enemies have a 75% chance to apply Intimidating Aura; one attack roll per foe (d20 + accuracy vs Magical Defence) for 2d6 force damage + Magic Power.",
                "icon": "🦁✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "roar",
                        "spell_power"
                    ]
                },
                "fusionType": "monster_arcane",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "intimidating_aura",
                        "duration": 3,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            }
        ],
        "pure_magic": [
            {
                "id": "steam_burst",
                "name": "Steam Burst",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + ice): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or ice damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Immobilized.",
                "icon": "🔥❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "ice_shard"
                    ]
                },
                "fusionType": "fire_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "thermal_shock",
                "name": "Thermal Shock",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (fire + ice): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or ice damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Immobilized.",
                "icon": "🌡️💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "steam_burst",
                        "ice_wall"
                    ]
                },
                "fusionType": "fire_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "conflicting_elements",
                "name": "Conflicting Elements",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + ice): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or ice damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Immobilized.",
                "icon": "☯️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "thermal_shock",
                        "inferno"
                    ]
                },
                "fusionType": "fire_ice",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "plasma_bolt",
                "name": "Plasma Bolt",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + lightning): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or lightning damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Incapacitated.",
                "icon": "⚡🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "spark"
                    ]
                },
                "fusionType": "fire_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "storm_of_cinders",
                "name": "Storm of Cinders",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (fire + lightning): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or lightning damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Incapacitated.",
                "icon": "🌩️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "plasma_bolt",
                        "thunder_clap"
                    ]
                },
                "fusionType": "fire_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "fusion_strike",
                "name": "Fusion Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + lightning): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or lightning damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Incapacitated.",
                "icon": "⚡💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_of_cinders",
                        "chain_lightning"
                    ]
                },
                "fusionType": "fire_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "magma_surge",
                "name": "Magma Surge",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or earth damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Incapacitated.",
                "icon": "🌋🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "stone_throw"
                    ]
                },
                "fusionType": "fire_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "volcanic_rupture",
                "name": "Volcanic Rupture",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (fire + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or earth damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Incapacitated.",
                "icon": "🌋💥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "magma_surge",
                        "stone_wall"
                    ]
                },
                "fusionType": "fire_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "tectonic_fury",
                "name": "Tectonic Fury",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + earth): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or earth damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Incapacitated.",
                "icon": "🌋⚔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "volcanic_rupture",
                        "earthquake"
                    ]
                },
                "fusionType": "fire_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "static_freeze",
                "name": "Static Freeze",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (ice + lightning): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice or lightning damage (use whichever the target is weak to). Has a 20% chance to apply Immobilized and Incapacitated.",
                "icon": "❄️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard",
                        "spark"
                    ]
                },
                "fusionType": "ice_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "crystalline_surge",
                "name": "Crystalline Surge",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (ice + lightning): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice or lightning damage (use whichever the target is weak to). Has a 40% chance to apply Immobilized and Incapacitated.",
                "icon": "💎⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "static_freeze",
                        "thunder_clap"
                    ]
                },
                "fusionType": "ice_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "arctic_storm",
                "name": "Arctic Storm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (ice + lightning): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice or lightning damage (use whichever each target is weak to). Has a 75% chance to apply Immobilized and Incapacitated.",
                "icon": "❄️🌩️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "crystalline_surge",
                        "blizzard"
                    ]
                },
                "fusionType": "ice_lightning",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "twilight_balance",
                "name": "Twilight Balance",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (darkness + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 darkness or light damage (use whichever the target is weak to). Has a 20% chance to apply Mind Controlled and Blinded.",
                "icon": "🌓✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_bolt",
                        "light_ray"
                    ]
                },
                "fusionType": "darkness_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "duality_surge",
                "name": "Duality Surge",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (darkness + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 darkness or light damage (use whichever the target is weak to). Has a 40% chance to apply Mind Controlled and Blinded.",
                "icon": "☯️✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "twilight_balance",
                        "shadow_armor"
                    ]
                },
                "fusionType": "darkness_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "darkness_light_eclipse",
                "name": "Twilight Eclipse",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (Judgment + Concealment): Perfect balance of light and dark in a 30ft burst. One attack roll per enemy (d20 + accuracy vs Magical Defence); on each hit, 3d6 darkness or light damage (use whichever each target is weak to). Has a 75% chance to apply Mind Controlled and Blinded.",
                "icon": "🌑☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "duality_surge",
                        "dawn_dance"
                    ]
                },
                "fusionType": "darkness_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "sandstorm",
                "name": "Sandstorm",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (earth + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 earth or wind damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Weakened.",
                "icon": "🌪️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_throw",
                        "gust"
                    ]
                },
                "fusionType": "earth_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "desert_winds",
                "name": "Desert Winds",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (earth + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 earth or wind damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Weakened.",
                "icon": "🏜️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sandstorm",
                        "wind_barrier"
                    ]
                },
                "fusionType": "earth_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "terra_tempest",
                "name": "Terra Tempest",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (earth + wind): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 earth or wind damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Weakened.",
                "icon": "🌪️🗿",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "desert_winds",
                        "earthquake"
                    ]
                },
                "fusionType": "earth_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "typhoon_strike",
                "name": "Typhoon Strike",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (wind + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 wind or water damage (use whichever the target is weak to). Has a 20% chance to apply Weakened and Weakened.",
                "icon": "🌊💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gust",
                        "water_splash"
                    ]
                },
                "fusionType": "wind_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "monsoon",
                "name": "Monsoon",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (wind + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 wind or water damage (use whichever the target is weak to). Has a 40% chance to apply Weakened and Weakened.",
                "icon": "🌧️🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "typhoon_strike",
                        "water_shield"
                    ]
                },
                "fusionType": "wind_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "wind_water_hurricane",
                "name": "Typhoon",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (Momentum + Flow): Devastating storm in a 30ft area. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 3d6 wind or water damage (use whichever each target is weak to). Pull all enemies 10ft toward the center. Has a 75% chance to apply Weakened.",
                "icon": "🌀💫",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "monsoon",
                        "tsunami"
                    ]
                },
                "fusionType": "wind_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "mud_slash",
                "name": "Mud Slash",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (water + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 water or earth damage (use whichever the target is weak to). Has a 20% chance to apply Weakened and Incapacitated.",
                "icon": "💧🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_splash",
                        "stone_throw"
                    ]
                },
                "fusionType": "water_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "quicksand",
                "name": "Quicksand",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (water + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 water or earth damage (use whichever the target is weak to). Has a 40% chance to apply Weakened and Incapacitated.",
                "icon": "🏖️💫",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "mud_slash",
                        "stone_wall"
                    ]
                },
                "fusionType": "water_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "water_earth_tidal_wave",
                "name": "Deluge Break",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (Flow + Endurance): Wave of water and debris in a 40ft line. One attack roll per creature (d20 + accuracy vs Magical Defence −2); on each hit, 3d6 water or earth damage (use whichever each target is weak to). Has a 75% chance to apply Weakened and Incapacitated.",
                "icon": "🌊🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "quicksand",
                        "tsunami"
                    ]
                },
                "fusionType": "water_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "scalding_jet",
                "name": "Scalding Jet",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or water damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Weakened.",
                "icon": "💧🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "water_splash"
                    ]
                },
                "fusionType": "fire_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "steam_cloud",
                "name": "Steam Cloud",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (fire + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or water damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Weakened.",
                "icon": "💨🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "scalding_jet",
                        "water_shield"
                    ]
                },
                "fusionType": "fire_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "geyser_burst",
                "name": "Geyser Burst",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + water): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or water damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Weakened.",
                "icon": "⛲🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "steam_cloud",
                        "inferno"
                    ]
                },
                "fusionType": "fire_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_wind",
                "name": "Shadow Wind",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (wind + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 wind or darkness damage (use whichever the target is weak to). Has a 20% chance to apply Weakened and Mind Controlled.",
                "icon": "🌫️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gust",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "wind_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_tempest",
                "name": "Void Tempest",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (wind + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 wind or darkness damage (use whichever the target is weak to). Has a 40% chance to apply Weakened and Mind Controlled.",
                "icon": "🌪️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_wind",
                        "shadow_armor"
                    ]
                },
                "fusionType": "wind_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "dark_cyclone",
                "name": "Dark Cyclone",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (wind + darkness): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 wind or darkness damage (use whichever each target is weak to). Has a 75% chance to apply Weakened and Mind Controlled.",
                "icon": "🌀🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "void_tempest",
                        "hurricane"
                    ]
                },
                "fusionType": "wind_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "prismatic_breeze",
                "name": "Prismatic Breeze",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (wind + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 wind or light damage (use whichever the target is weak to). Has a 20% chance to apply Weakened and Blinded.",
                "icon": "🌈💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "gust",
                        "light_ray"
                    ]
                },
                "fusionType": "wind_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "rainbow_gale",
                "name": "Rainbow Gale",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (wind + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 wind or light damage (use whichever the target is weak to). Has a 40% chance to apply Weakened and Blinded.",
                "icon": "🌈🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "prismatic_breeze",
                        "light_shield"
                    ]
                },
                "fusionType": "wind_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "aurora_storm",
                "name": "Aurora Storm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (wind + light): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 wind or light damage (use whichever each target is weak to). Has a 75% chance to apply Weakened and Blinded.",
                "icon": "🎆💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "rainbow_gale",
                        "dawn_dance"
                    ]
                },
                "fusionType": "wind_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "inferno_cyclone",
                "name": "Inferno Cyclone",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or wind damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Weakened.",
                "icon": "🔥💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "gust"
                    ]
                },
                "fusionType": "fire_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "heat_vacuum",
                "name": "Heat Vacuum",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (fire + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or wind damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Weakened.",
                "icon": "🌪️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "inferno_cyclone",
                        "wind_barrier"
                    ]
                },
                "fusionType": "fire_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "phoenix_storm",
                "name": "Phoenix Storm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + wind): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or wind damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Weakened.",
                "icon": "🦅🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "heat_vacuum",
                        "inferno"
                    ]
                },
                "fusionType": "fire_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadowflame",
                "name": "Shadowflame",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or darkness damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Mind Controlled.",
                "icon": "🔥🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "fire_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "dark_pyre",
                "name": "Dark Pyre",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (fire + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or darkness damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Mind Controlled.",
                "icon": "🏮🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadowflame",
                        "shadow_armor"
                    ]
                },
                "fusionType": "fire_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "hellfire",
                "name": "Hellfire",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + darkness): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or darkness damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Mind Controlled.",
                "icon": "👿🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dark_pyre",
                        "inferno"
                    ]
                },
                "fusionType": "fire_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "glacial_spike",
                "name": "Glacial Spike",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (ice + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice or earth damage (use whichever the target is weak to). Has a 20% chance to apply Immobilized and Incapacitated.",
                "icon": "❄️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard",
                        "stone_throw"
                    ]
                },
                "fusionType": "ice_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "permafrost",
                "name": "Permafrost",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (ice + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice or earth damage (use whichever the target is weak to). Has a 40% chance to apply Immobilized and Incapacitated.",
                "icon": "❄️🌍",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "glacial_spike",
                        "stone_wall"
                    ]
                },
                "fusionType": "ice_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "avalanche",
                "name": "Avalanche",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (ice + earth): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice or earth damage (use whichever each target is weak to). Has a 75% chance to apply Immobilized and Incapacitated.",
                "icon": "🏔️❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "permafrost",
                        "blizzard"
                    ]
                },
                "fusionType": "ice_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_current",
                "name": "Frost Current",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (ice + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice or water damage (use whichever the target is weak to). Has a 20% chance to apply Immobilized and Weakened.",
                "icon": "❄️💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard",
                        "water_splash"
                    ]
                },
                "fusionType": "ice_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ice_flow",
                "name": "Ice Flow",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (ice + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice or water damage (use whichever the target is weak to). Has a 40% chance to apply Immobilized and Weakened.",
                "icon": "🌊❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_current",
                        "water_shield"
                    ]
                },
                "fusionType": "ice_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "glacier_tsunami",
                "name": "Glacier Tsunami",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (ice + water): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice or water damage (use whichever each target is weak to). Has a 75% chance to apply Immobilized and Weakened.",
                "icon": "🌊❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_flow",
                        "tsunami"
                    ]
                },
                "fusionType": "ice_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "dark_frost",
                "name": "Dark Frost",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (ice + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice or darkness damage (use whichever the target is weak to). Has a 20% chance to apply Immobilized and Mind Controlled.",
                "icon": "❄️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "ice_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_freeze",
                "name": "Void Freeze",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (ice + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice or darkness damage (use whichever the target is weak to). Has a 40% chance to apply Immobilized and Mind Controlled.",
                "icon": "🌌❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dark_frost",
                        "shadow_armor"
                    ]
                },
                "fusionType": "ice_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "eternal_winter",
                "name": "Eternal Winter",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (ice + darkness): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice or darkness damage (use whichever each target is weak to). Has a 75% chance to apply Immobilized and Mind Controlled.",
                "icon": "❄️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "void_freeze",
                        "blizzard"
                    ]
                },
                "fusionType": "ice_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "crystal_ray",
                "name": "Crystal Ray",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (ice + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice or light damage (use whichever the target is weak to). Has a 20% chance to apply Immobilized and Blinded.",
                "icon": "💎☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard",
                        "light_ray"
                    ]
                },
                "fusionType": "ice_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "aurora_flash",
                "name": "Aurora Flash",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (ice + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice or light damage (use whichever the target is weak to). Has a 40% chance to apply Immobilized and Blinded.",
                "icon": "🎆❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "crystal_ray",
                        "light_shield"
                    ]
                },
                "fusionType": "ice_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "diamond_radiance",
                "name": "Diamond Radiance",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (ice + light): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice or light damage (use whichever each target is weak to). Has a 75% chance to apply Immobilized and Blinded.",
                "icon": "💎✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "aurora_flash",
                        "blizzard"
                    ]
                },
                "fusionType": "ice_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "storm_front",
                "name": "Storm Front",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (lightning + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 lightning or wind damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Weakened.",
                "icon": "⚡💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark",
                        "gust"
                    ]
                },
                "fusionType": "lightning_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "charged_cyclone",
                "name": "Charged Cyclone",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (lightning + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 lightning or wind damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Weakened.",
                "icon": "🌪️⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "storm_front",
                        "wind_barrier"
                    ]
                },
                "fusionType": "lightning_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "thunderstorm",
                "name": "Thunderstorm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (lightning + wind): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning or wind damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Weakened.",
                "icon": "⛈️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "charged_cyclone",
                        "chain_lightning"
                    ]
                },
                "fusionType": "lightning_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "conductivity",
                "name": "Conductivity",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (lightning + water): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 lightning or water damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Weakened.",
                "icon": "⚡💧",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark",
                        "water_splash"
                    ]
                },
                "fusionType": "lightning_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "lightning_water_storm_surge",
                "name": "Lightning Deluge",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (Conductivity + Flow): Electrified wave in a 20ft area. One attack roll per creature (d20 + accuracy vs Magical Defence); on each hit, 2d6 lightning or water damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Weakened.",
                "icon": "🌊⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "conductivity",
                        "water_shield"
                    ]
                },
                "fusionType": "lightning_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "maelstrom_strike",
                "name": "Maelstrom Strike",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (lightning + water): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning or water damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Weakened.",
                "icon": "🌊⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lightning_water_storm_surge",
                        "chain_lightning"
                    ]
                },
                "fusionType": "lightning_water",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "dark_lightning",
                "name": "Dark Lightning",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (lightning + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 lightning or darkness damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Mind Controlled.",
                "icon": "⚡🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "lightning_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "void_thunder",
                "name": "Void Thunder",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (lightning + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 lightning or darkness damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Mind Controlled.",
                "icon": "🌩️🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dark_lightning",
                        "shadow_armor"
                    ]
                },
                "fusionType": "lightning_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "eclipse_storm",
                "name": "Eclipse Storm",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (lightning + darkness): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning or darkness damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Mind Controlled.",
                "icon": "⚡🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "void_thunder",
                        "chain_lightning"
                    ]
                },
                "fusionType": "lightning_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "radiant_bolt",
                "name": "Radiant Bolt",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (lightning + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 lightning or light damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Blinded.",
                "icon": "⚡☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark",
                        "light_ray"
                    ]
                },
                "fusionType": "lightning_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "divine_thunder",
                "name": "Divine Thunder",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (lightning + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 lightning or light damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Blinded.",
                "icon": "⚡✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "radiant_bolt",
                        "light_shield"
                    ]
                },
                "fusionType": "lightning_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "heavens_wrath",
                "name": "Heaven's Wrath",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (lightning + light): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning or light damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Blinded.",
                "icon": "⚡☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "divine_thunder",
                        "chain_lightning"
                    ]
                },
                "fusionType": "lightning_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "shadow_stone",
                "name": "Shadow Stone",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (earth + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 earth or darkness damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Mind Controlled.",
                "icon": "🪨🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_throw",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "earth_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "obsidian_strike",
                "name": "Obsidian Strike",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (earth + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 earth or darkness damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Mind Controlled.",
                "icon": "🌑🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "shadow_stone",
                        "shadow_armor"
                    ]
                },
                "fusionType": "earth_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "void_eruption",
                "name": "Void Eruption",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (earth + darkness): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 earth or darkness damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Mind Controlled.",
                "icon": "🌋🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "obsidian_strike",
                        "earthquake"
                    ]
                },
                "fusionType": "earth_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "crystal_light",
                "name": "Crystal Light",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (earth + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 earth or light damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Blinded.",
                "icon": "💎☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "stone_throw",
                        "light_ray"
                    ]
                },
                "fusionType": "earth_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "prismatic_earth",
                "name": "Prismatic Earth",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (earth + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 earth or light damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Blinded.",
                "icon": "🌈🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "crystal_light",
                        "light_shield"
                    ]
                },
                "fusionType": "earth_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "sacred_ground",
                "name": "Sacred Ground",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (earth + light): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 earth or light damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Blinded.",
                "icon": "⚖️🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "prismatic_earth",
                        "earthquake"
                    ]
                },
                "fusionType": "earth_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "abyssal_current",
                "name": "Abyssal Current",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (water + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 water or darkness damage (use whichever the target is weak to). Has a 20% chance to apply Weakened and Mind Controlled.",
                "icon": "🌊🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_splash",
                        "shadow_bolt"
                    ]
                },
                "fusionType": "water_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "deep_surge",
                "name": "Deep Surge",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (water + darkness): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 water or darkness damage (use whichever the target is weak to). Has a 40% chance to apply Weakened and Mind Controlled.",
                "icon": "🌊🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "abyssal_current",
                        "shadow_armor"
                    ]
                },
                "fusionType": "water_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "drowning_darkness",
                "name": "Drowning Darkness",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (water + darkness): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 water or darkness damage (use whichever each target is weak to). Has a 75% chance to apply Weakened and Mind Controlled.",
                "icon": "🌊🖤",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "deep_surge",
                        "tsunami"
                    ]
                },
                "fusionType": "water_darkness",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "mind_controlled",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "holy_spring",
                "name": "Holy Spring",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (water + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 water or light damage (use whichever the target is weak to). Has a 20% chance to apply Weakened and Blinded.",
                "icon": "💧✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_splash",
                        "light_ray"
                    ]
                },
                "fusionType": "water_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "purifying_wave",
                "name": "Purifying Wave",
                "tier": 3,
                "cost": 40,
                "staminaCost": 6,
                "desc": "Spell (water + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 water or light damage (use whichever the target is weak to). Has a 40% chance to apply Weakened and Blinded.",
                "icon": "🌊✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "holy_spring",
                        "light_shield"
                    ]
                },
                "fusionType": "water_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "blessed_tsunami",
                "name": "Blessed Tsunami",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (water + light): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 water or light damage (use whichever each target is weak to). Has a 75% chance to apply Weakened and Blinded.",
                "icon": "🌊☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "purifying_wave",
                        "tsunami"
                    ]
                },
                "fusionType": "water_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "sunspark",
                "name": "Sunspark",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (fire + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 fire or light damage (use whichever the target is weak to). Has a 20% chance to apply Burn and Blinded.",
                "icon": "☀️🔥",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fireball",
                        "light_ray"
                    ]
                },
                "fusionType": "fire_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "purifying_flame",
                "name": "Purifying Flame",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell (fire + light): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 fire or light damage (use whichever the target is weak to). Has a 40% chance to apply Burn and Blinded.",
                "icon": "🌅✨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sunspark",
                        "holy_weapon"
                    ]
                },
                "fusionType": "fire_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "dawn_judgment",
                "name": "Dawn Judgment",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (fire + light): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 fire or light damage (use whichever each target is weak to). Has a 75% chance to apply Burn and Blinded.",
                "icon": "⚖️☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "purifying_flame",
                        "solar_flare"
                    ]
                },
                "fusionType": "fire_light",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "blinded",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            },
            {
                "id": "frost_gale",
                "name": "Frost Gale",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (ice + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 ice or wind damage (use whichever the target is weak to). Has a 20% chance to apply Immobilized and Weakened.",
                "icon": "❄️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_shard",
                        "gust"
                    ]
                },
                "fusionType": "ice_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "blizzard_squall",
                "name": "Blizzard Squall",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell (ice + wind): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 ice or wind damage (use whichever the target is weak to). Has a 40% chance to apply Immobilized and Weakened.",
                "icon": "🌨️💨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "frost_gale",
                        "tornado"
                    ]
                },
                "fusionType": "ice_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "arctic_cyclone",
                "name": "Arctic Cyclone",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (ice + wind): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 ice or wind damage (use whichever each target is weak to). Has a 75% chance to apply Immobilized and Weakened.",
                "icon": "🌀❄️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "blizzard_squall",
                        "hurricane"
                    ]
                },
                "fusionType": "ice_wind",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    },
                    {
                        "effectId": "weakened",
                        "duration": 4,
                        "potency": 2,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "tremor_spark",
                "name": "Tremor Spark",
                "tier": 2,
                "cost": 20,
                "staminaCost": 4,
                "desc": "Spell (lightning + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d4 lightning or earth damage (use whichever the target is weak to). Has a 20% chance to apply Incapacitated and Incapacitated.",
                "icon": "⚡🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "spark",
                        "stone_throw"
                    ]
                },
                "fusionType": "lightning_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.2
                    }
                ]
            },
            {
                "id": "magnet_storm",
                "name": "Magnet Storm",
                "tier": 3,
                "cost": 40,
                "staminaCost": 5,
                "desc": "Spell (lightning + earth): Attack roll d20 + accuracy vs Magical Defence; on a hit, 2d6 lightning or earth damage (use whichever the target is weak to). Has a 40% chance to apply Incapacitated and Incapacitated.",
                "icon": "🧲⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "tremor_spark",
                        "earth_shield"
                    ]
                },
                "fusionType": "lightning_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.4
                    }
                ]
            },
            {
                "id": "earth_thunder",
                "name": "Earth Thunder",
                "tier": 4,
                "cost": 65,
                "staminaCost": 8,
                "desc": "Spell (lightning + earth): One attack roll per enemy in a 30ft area (d20 + accuracy vs Magical Defence); on each hit, 3d6 lightning or earth damage (use whichever each target is weak to). Has a 75% chance to apply Incapacitated and Incapacitated.",
                "icon": "🌋⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "magnet_storm",
                        "earthquake"
                    ]
                },
                "fusionType": "lightning_earth",
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "incapacitated",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target",
                        "chance": 0.75
                    }
                ]
            }
        ]
    },
    "ascension": {
        "unique": [
            {
                "id": "familiar_summon",
                "name": "Lesser Familiar",
                "tier": 3,
                "cost": 133,
                "staminaCost": 12,
                "desc": "Action (once per day): Summon a small loyal companion (build with 25 Lumens — GM). Lasts until end of encounter or dismissed; weaker than a full monster ally. One familiar at a time.",
                "icon": "👹",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "aetherial_reflex",
                "name": "Aetherial Reflex",
                "tier": 4,
                "cost": 163,
                "staminaCost": 15,
                "desc": "Reaction: When you would take damage from one attack, ignore that damage (15 Stamina). You cannot take Actions or Reactions until the end of your next turn.",
                "icon": "👻",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "nova_unleashed",
                "name": "Nova Unleashed",
                "tier": 4,
                "cost": 163,
                "staminaCost": 25,
                "desc": "Action: 15ft burst centered on you — every creature in range is hit automatically (no attack roll). Each takes 2d20 physical damage (allies included). You are Incapacitated until the end of your next turn.",
                "icon": "⭐",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "mind_shield",
                "name": "Mind Shield",
                "tier": 4,
                "cost": 163,
                "staminaCost": 0,
                "desc": "Passive: Advantage on saves vs mind control, charm, fear, and illusions. Halve magical damage from direct mental assaults (GM decides what counts). Extreme effects may still land on a very bad roll.",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": [
                    "mind_shield"
                ]
            },
            {
                "id": "cosmic_awareness",
                "name": "Cosmic Awareness",
                "tier": 5,
                "cost": 320,
                "staminaCost": 0,
                "desc": "Passive: +5 Accuracy to notice active magic, hidden creatures, and obvious illusions within 60ft. Does not read minds, reveal plot secrets, or see through solid walls. GM decides borderline cases.",
                "icon": "👁️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": [
                    "magic_sight"
                ]
            },
            {
                "id": "probability_shift",
                "name": "Probability Shift",
                "tier": 4,
                "cost": 163,
                "staminaCost": 10,
                "desc": "Reaction (10 Stamina each use): (1) When you fail a d20 roll, reroll and keep the better result. (2) When an enemy rolls a d20 against you, force them to reroll and keep the worse result.",
                "icon": "🎲",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "instinctive_dodge",
                "name": "Instinctive Dodge",
                "tier": 3,
                "cost": 133,
                "staminaCost": 1,
                "desc": "Reaction: When a single-target attack would hit you, roll d20 + Speed; if you beat the attacker's accuracy, negate the hit (1 Stamina). Does not work vs area effects.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "burst_of_speed",
                "name": "Burst of Speed",
                "tier": 3,
                "cost": 133,
                "staminaCost": 5,
                "desc": "Action: Move up to 2× your normal movement this turn. You cannot use Burst of Speed on your next turn.",
                "icon": "💨",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "analyze",
                "name": "Analyze",
                "tier": 4,
                "cost": 163,
                "staminaCost": 5,
                "desc": "Action: Study one creature within 30ft — learn HP band, elemental resistances and weaknesses (25%/50%/200%/400% tiers), and one special trait (GM picks). Obvious nearby traps or hazards are revealed.",
                "icon": "🔍",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "echo_location",
                "name": "Echo Location",
                "tier": 3,
                "cost": 133,
                "staminaCost": 10,
                "desc": "Action: Pulse reveals creatures and large objects within 50ft. Works in darkness; does not pass solid walls or pinpoint silent, motionless targets (GM).",
                "icon": "🔊",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "phase_step",
                "name": "Phase Step",
                "tier": 4,
                "cost": 163,
                "staminaCost": 15,
                "desc": "Action: Teleport up to 30ft to an unoccupied space you can see. You may pass through thin obstacles; cannot end inside solid matter.",
                "icon": "👣",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "mind_read",
                "name": "Mind Read",
                "tier": 4,
                "cost": 163,
                "staminaCost": 20,
                "desc": "Action: Read surface thoughts and recent memories from one creature within 30ft for 1 round. Reveals desires and intent, not deep secrets — GM filters what comes through. Works without a shared language.",
                "icon": "🧠",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "eternal_moment",
                "name": "Eternal Moment",
                "tier": 5,
                "cost": 320,
                "staminaCost": 40,
                "desc": "Action (once per day): Stop time for everyone but you — take 1 extra turn immediately while enemies cannot act or react. You skip your entire next turn afterward (no move, actions, or reactions).",
                "icon": "⌛",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "soul_transference",
                "name": "Soul Transference",
                "tier": 5,
                "cost": 320,
                "staminaCost": 50,
                "desc": "Action (once per lifetime): With GM approval, transfer your mind into a willing or helpless body — you use their form and abilities; your original body falls into a coma. Reversal or consequences are a major story beat (GM).",
                "icon": "💫",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "gravity_manipulation",
                "name": "Gravity Manipulation",
                "tier": 3,
                "cost": 133,
                "staminaCost": 12,
                "desc": "Action: For 2 rounds, alter gravity in a 10ft radius centered on you. Enemies halve movement; allies double movement in that area.",
                "icon": "🌍",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_second_wind",
                "name": "Second Wind",
                "tier": 3,
                "cost": 133,
                "staminaCost": 0,
                "desc": "Action: When you are below half HP, restore 2d6 + Strength HP and 8 Stamina. Cannot use while Incapacitated.",
                "icon": "🌬️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_stamina_reserve",
                "name": "Stamina Reserve",
                "tier": 3,
                "cost": 133,
                "staminaCost": 0,
                "desc": "Passive (once per day): The first time your Stamina would reach 0 in an encounter, restore 10 Stamina instead (cannot exceed your maximum).",
                "icon": "🔋",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_battle_focus",
                "name": "Battle Focus",
                "tier": 4,
                "cost": 163,
                "staminaCost": 5,
                "desc": "Action: For 3 rounds, gain +3 Accuracy on weapon and unarmed attacks. You cannot cast spells while Battle Focus is active.",
                "icon": "🎯",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_arcane_surge",
                "name": "Arcane Surge",
                "tier": 4,
                "cost": 163,
                "staminaCost": 0,
                "desc": "Action: This skill can be used in addition to any Spell skill. Your next spell this turn costs 2 less Stamina (minimum 0) and deals +1d6 damage of its element on a hit. Cannot stack with other cost-reduction effects.",
                "icon": "✴️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_guardians_stand",
                "name": "Guardian's Stand",
                "tier": 4,
                "cost": 163,
                "staminaCost": 8,
                "desc": "Reaction: When an adjacent ally would take damage from a single-target attack, you become the target instead and take the full damage (8 Stamina).",
                "icon": "🛡️",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_rally_the_line",
                "name": "Rally the Line",
                "tier": 4,
                "cost": 163,
                "staminaCost": 10,
                "desc": "Action: Allies within 15ft gain +2 Physical Defence and +2 Magical Defence for 2 rounds. You must be able to shout or signal — silence zones block this (GM).",
                "icon": "📣",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            },
            {
                "id": "ascension_purge_affliction",
                "name": "Purge Affliction",
                "tier": 4,
                "cost": 163,
                "staminaCost": 6,
                "desc": "Action: Remove one poison, disease, charm, or fear effect from yourself or one ally within 30ft.",
                "icon": "🧴",
                "prerequisites": {
                    "type": "NONE",
                    "skills": []
                },
                "specialEffects": []
            }
        ]
    },
    "ultimate": {
        "legendary": [
            {
                "id": "monster_summoning",
                "name": "Monster Summoning",
                "tier": 5,
                "cost": 320,
                "staminaCost": 35,
                "desc": "Action: Summon a loyal monster companion (build with 50 Lumens — GM). Full combat ally with its own turns; lasts until dismissed or slain. One companion at a time.",
                "icon": "👹",
                "prerequisites": {
                    "type": "OR_WEAPON_MASTERY_AND_DARKNESS",
                    "skills": [
                        "sword_mastery",
                        "axe_mastery",
                        "polearm_mastery",
                        "hammer_mastery",
                        "dagger_mastery",
                        "ranged_mastery",
                        "staff_mastery",
                        "striker_mastery",
                        "darkness_mastery"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "aetherial_shift",
                "name": "Aetherial Shift",
                "tier": 5,
                "cost": 320,
                "staminaCost": 20,
                "desc": "Action: Phase out for 1 round — immune to damage, pass through walls; you cannot attack, cast spells, or interact with objects. Each extra consecutive round costs 2 Stamina.",
                "icon": "👻",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "resurrection",
                        "void_prison",
                        "wind_walk"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "chronos_rewind",
                "name": "Chronos Rewind",
                "tier": 6,
                "cost": 450,
                "staminaCost": 30,
                "desc": "Reaction: Undo the last completed action you or one ally within 30ft took — reroll its dice or pick a different legal target. Cannot undo death, permanent transformation, or major story beats (GM).",
                "icon": "⏪",
                "prerequisites": {
                    "type": "ALL_LIGHT_MAGIC",
                    "skills": [
                        "light_ray",
                        "healing_light",
                        "light_shield",
                        "resurrection",
                        "divine_judgment"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_nova",
                "name": "Ultimate Nova",
                "tier": 6,
                "cost": 450,
                "staminaCost": 40,
                "desc": "Action: 100ft explosion centered on you — each creature makes a save or takes 8d6 physical damage (half on success). Allies use the same save. You are Exhausted for 3 rounds and cannot cast spells for 1 round.",
                "icon": "💥",
                "prerequisites": {
                    "type": "THREE_TIER5_MAGIC",
                    "skills": []
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "exhausted",
                        "duration": 3,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "soul_link",
                "name": "Soul Link",
                "tier": 6,
                "cost": 450,
                "staminaCost": 18,
                "desc": "Action: For 10 rounds, link HP with one willing ally within 30ft — combine both max HP into one shared pool; damage and healing split evenly between you. If the pool hits 0, both fall unconscious. Either partner may end the link early.",
                "icon": "💕",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "soul_steal",
                        "divine_judgment",
                        "revival_draft"
                    ]
                },
                "alternativePrerequisite": {
                    "type": "AND",
                    "skills": [
                        "revival_draft",
                        "volatile_expert"
                    ]
                },
                "specialEffects": []
            }
        ],
        "weapon_ultimates": [
            {
                "id": "ultimate_perfect_riposte",
                "name": "Perfect Riposte",
                "tier": 5,
                "cost": 320,
                "staminaCost": 18,
                "desc": "Reaction: When a melee attack misses you, immediately counter with one weapon attack at +5 Accuracy. On a hit, deal double weapon damage + Strength. You must be wielding a sword.",
                "icon": "⚔️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "sword_mastery",
                        "master_parry"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_skyfall_volley",
                "name": "Skyfall Volley",
                "tier": 5,
                "cost": 320,
                "staminaCost": 28,
                "desc": "Action: Choose up to 5 enemies within 120ft line of sight — separate attack roll (d20 + Accuracy) vs each; on a hit, weapon damage + 2d6. You cannot move on the turn you use this.",
                "icon": "🏹",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ranged_mastery",
                        "homing_shot"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_worldbreaker_cleave",
                "name": "Worldbreaker Cleave",
                "tier": 5,
                "cost": 320,
                "staminaCost": 24,
                "desc": "Action: 15ft cone weapon attack vs every enemy — one attack roll each; on a hit, weapon damage + Strength. Shields and heavy armour may crack on a crit (GM). You suffer −2 Physical Defence until your next turn.",
                "icon": "🪓",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "axe_mastery",
                        "earthquake_slam"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "temp_defense",
                        "duration": 1,
                        "potency": -2,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "ultimate_archmage_awakening",
                "name": "Archmage's Awakening",
                "tier": 5,
                "cost": 320,
                "staminaCost": 0,
                "desc": "Passive: Your spells cost 1 less Stamina (minimum 0). When you cast a spell, you may spend 5 Stamina to heal one ally within 30ft for 1d6 + Magic Power HP.",
                "icon": "🔮",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "staff_mastery",
                        "staff_of_power"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_death_by_cuts",
                "name": "Death by a Thousand Cuts",
                "tier": 5,
                "cost": 320,
                "staminaCost": 22,
                "desc": "Action: Make three dagger attacks as one Action (each at -2 Accuracy). Each hit applies Bleeding — lose 1d4 HP at the start of each turn for 3 rounds. You must wield a dagger.",
                "icon": "🗡️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "dagger_mastery",
                        "thousand_cuts"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "bleeding",
                        "duration": 3,
                        "potency": 4,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ultimate_impregnable_reach",
                "name": "Impregnable Reach",
                "tier": 5,
                "cost": 320,
                "staminaCost": 20,
                "desc": "Action: For 3 rounds, +2 Physical Defence and enemies entering your weapon reach provoke a free polearm attack (once per enemy per round). You cannot charge or sprint while active.",
                "icon": "🔱",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "polearm_mastery",
                        "fortress_stance"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_seismic_judgment",
                "name": "Seismic Judgment",
                "tier": 5,
                "cost": 320,
                "staminaCost": 28,
                "desc": "Action: 10ft radius slam — each enemy saves or is knocked down; they must spend their next movement standing up. On a failed save they take 4d6 bludgeoning + Strength. Objects, armour, and fortifications take double damage (GM). You lose your next Action.",
                "icon": "🔨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "hammer_mastery",
                        "apocalypse_slam"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "knockdown",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ultimate_flowing_perfection",
                "name": "Flowing Perfection",
                "tier": 5,
                "cost": 320,
                "staminaCost": 20,
                "desc": "Action: Until the end of your next turn, each successful unarmed hit grants +1 Accuracy and +1 Speed (max +3). After each hit you may move 10ft for free. Hands must be empty.",
                "icon": "🥋",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "striker_mastery",
                        "iron_reversal"
                    ]
                },
                "specialEffects": []
            }
        ],
        "magic_ultimates": [
            {
                "id": "ultimate_inferno_crown",
                "name": "Inferno Crown",
                "tier": 5,
                "cost": 320,
                "staminaCost": 28,
                "desc": "Action: 30ft burst centered on you — each creature saves or takes 6d6 fire + Magic Power and Burn (2d4, 3 rounds). Allies in the burst use the same save. You are Exhausted for 1 round afterward.",
                "icon": "👑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "fire_supremacy",
                        "inferno"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "burn",
                        "duration": 3,
                        "potency": 5,
                        "applyTo": "target"
                    },
                    {
                        "effectId": "exhausted",
                        "duration": 1,
                        "potency": 0,
                        "applyTo": "self"
                    }
                ]
            },
            {
                "id": "ultimate_absolute_zero",
                "name": "World of Stillness",
                "tier": 5,
                "cost": 320,
                "staminaCost": 24,
                "desc": "Action: 20ft radius — enemies save or take 4d6 ice + Magic Power and are Immobilized for 2 rounds. The next hit on each frozen target deals +50% damage.",
                "icon": "🧊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "ice_supremacy",
                        "glacier"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "immobilized",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ultimate_tempest_sovereign",
                "name": "Tempest Sovereign",
                "tier": 5,
                "cost": 320,
                "staminaCost": 22,
                "desc": "Action: Lightning jumps to up to 4 enemies within 30ft of your first target — each takes 3d6 lightning + Magic Power (separate attack rolls). You act first in initiative next round.",
                "icon": "⚡",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "lightning_supremacy",
                        "storm_mastery"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_living_bastion",
                "name": "Living Bastion",
                "tier": 5,
                "cost": 320,
                "staminaCost": 22,
                "desc": "Action: For 5 rounds, raise a 20ft-radius earth bulwark — allies inside gain +4 Physical Defence and +4 Magical Defence. Enemies entering the area must save or stop at the edge.",
                "icon": "🪨",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "earth_supremacy",
                        "tectonic_shift"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_zephyr_sovereign",
                "name": "Zephyr Sovereign",
                "tier": 5,
                "cost": 320,
                "staminaCost": 20,
                "desc": "Action: For 2 rounds, move up to 60ft per turn (including vertical if open air) and attacks against you take -3 Accuracy. You cannot cast non-Wind spells while soaring.",
                "icon": "🌪️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "wind_mastery",
                        "gale_mastery"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_tidal_aegis",
                "name": "Tidal Aegis",
                "tier": 5,
                "cost": 320,
                "staminaCost": 22,
                "desc": "Action: 30ft radius — allies heal 3d6 + Magic Power and lose poison; enemies save or are pushed 15ft and take 2d6 water damage.",
                "icon": "🌊",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "water_mastery",
                        "tsunami"
                    ]
                },
                "specialEffects": []
            },
            {
                "id": "ultimate_eclipse_dominion",
                "name": "Eclipse Dominion",
                "tier": 5,
                "cost": 320,
                "staminaCost": 26,
                "desc": "Action: 30ft radius of shadow — enemies save or take 4d6 darkness + Magic Power, gain Fear for 2 rounds, and suffer -2 Accuracy for 3 rounds. You heal HP equal to half the damage you dealt (GM).",
                "icon": "🌑",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "darkness_mastery",
                        "eclipse"
                    ]
                },
                "specialEffects": [],
                "activationEffects": [
                    {
                        "effectId": "fear",
                        "duration": 2,
                        "potency": 0,
                        "applyTo": "target"
                    }
                ]
            },
            {
                "id": "ultimate_radiant_ascension",
                "name": "Crown of Dawn",
                "tier": 5,
                "cost": 320,
                "staminaCost": 22,
                "desc": "Action: 40ft holy burst — undead, demons, and corrupted foes take 6d6 light + Magic Power; others take 3d6. Allies in the burst lose poison or curse and gain +2 Magical Defence for 2 rounds.",
                "icon": "☀️",
                "prerequisites": {
                    "type": "AND",
                    "skills": [
                        "light_mastery",
                        "divine_judgment"
                    ]
                },
                "specialEffects": []
            }
        ]
    }
};

window.SKILLS_DATA = SKILLS_DATA;
