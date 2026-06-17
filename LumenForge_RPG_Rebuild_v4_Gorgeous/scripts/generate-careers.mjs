#!/usr/bin/env node
/**
 * Generates data/careers-skills-data.js and rewrites profession-items requiredSkills
 * to use new career skill ids.
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')

function skill(id, name, tier, icon, desc, prerequisites) {
  const costs = { 1: 5, 2: 10, 3: 15, 4: 20 }
  return {
    id,
    name,
    tier,
    cost: costs[tier] || 15,
    staminaCost: 0,
    desc,
    icon,
    prerequisites,
    specialEffects: []
  }
}

function careerTree(entry, tier2, tier3) {
  const rows = [
    skill(entry.id, entry.name, 1, entry.icon, entry.desc, { type: 'NONE', skills: [] })
  ]
  for (const row of tier2) {
    rows.push(skill(row.id, row.name, 2, row.icon, row.desc, { type: 'AND', skills: [entry.id] }))
  }
  for (const row of tier3) {
    const t2 = row.prereqT2 || tier2[0].id
    rows.push(skill(row.id, row.name, 3, row.icon, row.desc, { type: 'AND', skills: [entry.id, t2] }))
  }
  return rows
}

const CAREERS_SKILLS_DATA = {
  blacksmith: careerTree(
    { id: 'apprentice_smith', name: 'Apprentice Smith', icon: '🔨', desc: 'Craft: Basic weapons and armour.' },
    [
      { id: 'weaponwright', name: 'Weaponwright', icon: '⚔️', desc: 'Craft: Martial weapons. Weapons you forge gain +1 damage.' },
      { id: 'armourer', name: 'Armourer', icon: '🛡️', desc: 'Craft: Armour and shields. Armour you forge grants +1 Physical Defence and +1 Magical Defence.' },
      { id: 'field_fit', name: 'Field Fit', icon: '🔧', desc: 'Action: Tune an ally\'s weapon or armour before a fight (10 minutes). They gain +1 on their first attack roll or +1 Physical Defence for the first round (choose one). Once per ally per long rest.' }
    ],
    [
      { id: 'master_alloy', name: 'Master Alloy', icon: '⚗️', desc: 'Craft: Advanced metals (mithril, adamantine recipes).', prereqT2: 'weaponwright' },
      { id: 'tempered_steel', name: 'Tempered Steel', icon: '🔥', desc: 'Passive: Allies using your forged gear gain +1 to physical attack rolls (weapon damage unchanged).', prereqT2: 'armourer' },
      { id: 'siege_breaker', name: 'Siege Breaker', icon: '🪓', desc: 'Action: Bypass mundane locks, hinges, or chains with tools (GM: one object per use).', prereqT2: 'field_fit' }
    ]
  ),
  chef: careerTree(
    { id: 'camp_cook', name: 'Camp Cook', icon: '🍳', desc: 'Craft: Simple meals. Meal restores 1d4+1 HP when eaten.' },
    [
      { id: 'hearty_rations', name: 'Hearty Rations', icon: '🥘', desc: 'Craft: Travel food. After eating, +2 Stamina for 10 rounds.' },
      { id: 'spice_box', name: 'Spice Box', icon: '🧂', desc: 'Passive: Meals you cook gain +1 HP restored or +1 round of meal buff duration.' },
      { id: 'second_serving', name: 'Second Serving', icon: '🍽️', desc: 'Action: Prepare one extra portion from the same ingredients (once per long rest).' }
    ],
    [
      { id: 'banquet_planner', name: 'Banquet Planner', icon: '🎉', desc: 'Craft: Feast for the whole party — one shared buff (e.g. +1 Accuracy for 20 rounds).', prereqT2: 'hearty_rations' },
      { id: 'battle_breakfast', name: 'Battle Breakfast', icon: '🥞', desc: 'Craft: Pre-combat meal; eater gains +2 to initiative or +1 Physical Defence for first combat only.', prereqT2: 'spice_box' },
      { id: 'chefs_instinct', name: 'Chef\'s Instinct', icon: '👃', desc: 'Passive: Detect spoiled, drugged, or poisonous food by taste/smell (GM may require no roll).', prereqT2: 'second_serving' }
    ]
  ),
  farmer: careerTree(
    { id: 'hands_in_soil', name: 'Hands in the Soil', icon: '🌱', desc: 'Craft: Common herbs and rations from farm goods. Passive: +1 HP from natural food.' },
    [
      { id: 'crop_rotation', name: 'Crop Rotation', icon: '🔄', desc: 'Craft: Reliable herb yields when resting in wilderness or farmland (GM: extra herb loot).' },
      { id: 'animal_sense', name: 'Animal Sense', icon: '🐾', desc: 'Passive: Notice disturbed earth, tracks, and grazing signs within 30ft.' },
      { id: 'preserve_harvest', name: 'Preserve Harvest', icon: '🫙', desc: 'Craft: Salves and preserved goods that don\'t spoil for a week.' }
    ],
    [
      { id: 'green_thumb', name: 'Green Thumb', icon: '🌿', desc: 'Craft: Magical or rare plants (ties to herbalism recipes).', prereqT2: 'crop_rotation' },
      { id: 'landmark_memory', name: 'Landmark Memory', icon: '🗺️', desc: 'Action: Recall terrain — advantage on navigation checks in regions you\'ve worked (GM).', prereqT2: 'animal_sense' },
      { id: 'bountiful_plot', name: 'Bountiful Plot', icon: '🌾', desc: 'Passive: Party gains +1 material find when looting plants/organics after a fight.', prereqT2: 'preserve_harvest' }
    ]
  ),
  medic: careerTree(
    { id: 'field_medic', name: 'Field Medic', icon: '💊', desc: 'Craft: Health potions. Potions you brew restore +2 HP.' },
    [
      { id: 'triage', name: 'Triage', icon: '🩺', desc: 'Action: Assess a creature — learn HP band, bleeding, poison, disease (not exact HP unless GM allows).' },
      { id: 'antidote_training', name: 'Antidote Training', icon: '🧪', desc: 'Passive: +2 effective MD vs poison/disease effects on yourself; identify poison on sight.' },
      { id: 'clean_bandage', name: 'Clean Bandage', icon: '🩹', desc: 'Action: Stabilise a downed ally (0 HP) so they don\'t worsen; restore 1 HP.' }
    ],
    [
      { id: 'surgical_touch', name: 'Surgical Touch', icon: '✂️', desc: 'Craft: Advanced potions and antidotes. Healing items you use on others gain +1d4 HP.', prereqT2: 'triage' },
      { id: 'plague_ward', name: 'Plague Ward', icon: '🛡️', desc: 'Passive: Allies within 10ft gain +1 Magical Defence vs disease/poison saves (GM).', prereqT2: 'antidote_training' },
      { id: 'revival_draft', name: 'Revival Draft', icon: '💉', desc: 'Craft: Rare stimulant — remove Incapacitated or one minor debuff (once per target per day).', prereqT2: 'clean_bandage' }
    ]
  ),
  alchemist: careerTree(
    { id: 'apothecary', name: 'Apothecary', icon: '⚗️', desc: 'Craft: Basic potions and reagents.' },
    [
      { id: 'acid_vials', name: 'Acid Vials', icon: '🧴', desc: 'Craft: Acid flasks (throw: attack roll d20 + accuracy vs PD; on hit, 1d6 acid; 40% chance to apply Weakened).' },
      { id: 'smoke_and_flash', name: 'Smoke & Flash', icon: '💨', desc: 'Craft: Distraction devices (smoke, blinding powder) — no damage, utility.' },
      { id: 'label_reader', name: 'Label Reader', icon: '🏷️', desc: 'Passive: Identify unknown liquids/powders safely (poison, potion, inert).' }
    ],
    [
      { id: 'explosive_compounds', name: 'Explosive Compounds', icon: '💣', desc: 'Craft: Bombs (3d6 in 15ft; separate attack roll per target vs MD).', prereqT2: 'acid_vials' },
      { id: 'transmute_salts', name: 'Transmute Salts', icon: '🧂', desc: 'Craft: Convert common materials into alchemical bases (GM: daily quota).', prereqT2: 'smoke_and_flash' },
      { id: 'volatile_expert', name: 'Volatile Expert', icon: '☢️', desc: 'Passive: You and allies take −1 damage from your own alchemical friendly fire (min 0).', prereqT2: 'label_reader' }
    ]
  ),
  enchanter: careerTree(
    { id: 'rune_apprentice', name: 'Rune Apprentice', icon: '✨', desc: 'Craft: Apply one minor enchant (+1 stat or flavour effect).' },
    [
      { id: 'elemental_ink', name: 'Elemental Ink', icon: '🔥', desc: 'Craft: Fire/Ice/Lightning +1d6 on weapon (as fusion-lite, not a toggle).' },
      { id: 'ward_scribe', name: 'Ward Scribe', icon: '📜', desc: 'Craft: Protective charms (+1 Magical Defence permanent slot enchant on armour).' },
      { id: 'identify_magic', name: 'Identify Magic', icon: '🔍', desc: 'Action: Inspect a magic item — learn properties and curse risk.' }
    ],
    [
      { id: 'soul_bind', name: 'Soul Bind', icon: '👻', desc: 'Craft: Bind item to owner (others suffer −2 using it).', prereqT2: 'elemental_ink' },
      { id: 'artifact_shaping', name: 'Artifact Shaping', icon: '🏆', desc: 'Craft: Items with 2 enchantment slots.', prereqT2: 'ward_scribe' },
      { id: 'dispel_touch', name: 'Dispel Touch', icon: '✋', desc: 'Action: Suppress one magical effect on an object or creature for 1 hour.', prereqT2: 'identify_magic' }
    ]
  ),
  detective: careerTree(
    { id: 'keen_eye', name: 'Keen Eye', icon: '👁️', desc: 'Action: Examine a scene — GM reveals one clue tier (obvious / hidden / secret).' },
    [
      { id: 'trace_evidence', name: 'Trace Evidence', icon: '🔎', desc: 'Passive: Spot disturbed objects, footprints, blood, recent magic residue.' },
      { id: 'interview', name: 'Interview', icon: '💬', desc: 'Action: Conversation grants +2 to read lies or pressure answers (GM social roll).' },
      { id: 'case_notes', name: 'Case Notes', icon: '📓', desc: 'Passive: Once per scene, reroll a failed investigation check.' }
    ],
    [
      { id: 'reconstruct', name: 'Reconstruct', icon: '🕰️', desc: 'Action: Visualise past events in a location (last 24 hours, GM narrative).', prereqT2: 'trace_evidence' },
      { id: 'follow_the_trail', name: 'Follow the Trail', icon: '👣', desc: 'Action: Determine direction a specific person/creature went within last 8 hours.', prereqT2: 'interview' },
      { id: 'deduction', name: 'Deduction', icon: '🧠', desc: 'Passive: Connect two prior clues — GM must give a useful inference if both are known.', prereqT2: 'case_notes' }
    ]
  ),
  archaeologist: careerTree(
    { id: 'artifact_study', name: 'Artifact Study', icon: '🏺', desc: 'Action: Identify relics — true properties, era, curse flags.' },
    [
      { id: 'ancient_tongues', name: 'Ancient Tongues', icon: '📜', desc: 'Passive: Read common dead languages; translate inscriptions slowly.' },
      { id: 'trap_sense', name: 'Trap Sense', icon: '⚠️', desc: 'Passive: +2 to notice ancient traps and structural weak points.' },
      { id: 'careful_extraction', name: 'Careful Extraction', icon: '🧤', desc: 'Action: Remove relic without triggering trap (GM check).' }
    ],
    [
      { id: 'lost_technique', name: 'Lost Technique', icon: '💀', desc: 'Passive: Once per adventure, recognise a weakness in an undead/construct type (+2 damage for party for one fight).', prereqT2: 'ancient_tongues' },
      { id: 'divine_dig', name: 'Divine Dig', icon: '⛏️', desc: 'Action: Sense consecrated/desecrated ground and major burials within 60ft.', prereqT2: 'trap_sense' },
      { id: 'replicate_relic', name: 'Replicate Relic', icon: '📋', desc: 'Craft: Reproduce a studied artifact\'s mundane copy (not full magic without Enchanter).', prereqT2: 'careful_extraction' }
    ]
  ),
  scout: careerTree(
    { id: 'trail_reader', name: 'Trail Reader', icon: '🌲', desc: 'Passive: Follow tracks in wilderness; know number and rough size of group.' },
    [
      { id: 'ambush_spotter', name: 'Ambush Spotter', icon: '🎯', desc: 'Passive: Party gains +1 initiative when you have 1 minute to scout ahead.' },
      { id: 'snare_craft', name: 'Snare Craft', icon: '🪤', desc: 'Craft: Simple traps (snare, alarm) — GM sets DC/effect.' },
      { id: 'weather_nose', name: 'Weather Nose', icon: '🌤️', desc: 'Passive: Predict weather 12 hours ahead in region you know.' }
    ],
    [
      { id: 'long_watch', name: 'Long Watch', icon: '🔭', desc: 'Action: Track a quarry for a day — learn camp sites and direction.', prereqT2: 'ambush_spotter' },
      { id: 'camouflage_net', name: 'Camouflage Net', icon: '🕸️', desc: 'Craft: Hide camp from casual search (+2 Stealth for camp).', prereqT2: 'snare_craft' },
      { id: 'eagles_route', name: 'Eagle\'s Route', icon: '🦅', desc: 'Passive: Party ignores difficult terrain from undergrowth on overland travel (GM).', prereqT2: 'weather_nose' }
    ]
  ),
  engineer: careerTree(
    { id: 'tinker', name: 'Tinker', icon: '🔩', desc: 'Craft: Basic tools, crossbow bolts, simple mechanisms.' },
    [
      { id: 'clockwork_repair', name: 'Clockwork Repair', icon: '⚙️', desc: 'Action: Fix a jammed lock or stuck mechanism (GM).' },
      { id: 'reinforced_frame', name: 'Reinforced Frame', icon: '🧱', desc: 'Craft: Portable cover (+3 PD while behind it).' },
      { id: 'schematic_mind', name: 'Schematic Mind', icon: '📐', desc: 'Passive: Understand how unfamiliar machines work after 1 minute study.' }
    ],
    [
      { id: 'siege_kit', name: 'Siege Kit', icon: '🏗️', desc: 'Craft: Breaching tools, pulleys, collapsible bridge sections.', prereqT2: 'clockwork_repair' },
      { id: 'overcharge', name: 'Overcharge', icon: '⚡', desc: 'Action: Boost ally\'s mechanical device — double effect once, then it is spent until rebuilt (GM).', prereqT2: 'reinforced_frame' },
      { id: 'demolition_plan', name: 'Demolition Plan', icon: '💥', desc: 'Craft: Shaped charges — target structure weak point (not creature HP).', prereqT2: 'schematic_mind' }
    ]
  ),
  merchant: careerTree(
    { id: 'haggler', name: 'Haggler', icon: '💰', desc: 'Passive: Buy at 10% discount, sell at 10% premium (mundane goods).' },
    [
      { id: 'appraise', name: 'Appraise', icon: '💎', desc: 'Action: True market value and obvious fakes on items.' },
      { id: 'ledger', name: 'Ledger', icon: '📒', desc: 'Passive: Track party expenses; never "lose" change to bookkeeping errors (flavour + GM trust).' },
      { id: 'find_buyer', name: 'Find Buyer', icon: '🤝', desc: 'Action: Locate a purchaser for unusual loot in a settlement (GM).' }
    ],
    [
      { id: 'black_market', name: 'Black Market', icon: '🕶️', desc: 'Passive: Access illegal or rare goods in cities (GM availability).', prereqT2: 'appraise' },
      { id: 'invest', name: 'Invest', icon: '📈', desc: 'Action: Seed capital — chance of return after downtime (GM economy).', prereqT2: 'ledger' },
      { id: 'caravan_lead', name: 'Caravan Lead', icon: '🐪', desc: 'Passive: Overland travel: −20% random encounter chance when you plan the route (GM).', prereqT2: 'find_buyer' }
    ]
  ),
  scholar: careerTree(
    { id: 'well_read', name: 'Well Read', icon: '📚', desc: 'Action: Recall lore on a topic — GM gives one true fact.' },
    [
      { id: 'polyglot', name: 'Polyglot', icon: '🗣️', desc: 'Passive: Speak/read two extra common languages.' },
      { id: 'bestiary_notes', name: 'Bestiary Notes', icon: '📖', desc: 'Action: Identify creature type — resistances, habits (not exact stat block unless GM).' },
      { id: 'map_archive', name: 'Map Archive', icon: '🗺️', desc: 'Passive: Copy or remember maps; never lost in mapped dungeons without magic.' }
    ],
    [
      { id: 'forbidden_index', name: 'Forbidden Index', icon: '📕', desc: 'Action: Know danger level of magic/curse on touch (safe study).', prereqT2: 'polyglot' },
      { id: 'teach', name: 'Teach', icon: '👨‍🏫', desc: 'Action: Ally gains your tier-1 knowledge skill for one task this session.', prereqT2: 'bestiary_notes' },
      { id: 'sages_conclusion', name: 'Sage\'s Conclusion', icon: '💡', desc: 'Passive: Once per adventure, declare a lore-based solution — GM must make it viable if plausible.', prereqT2: 'map_archive' }
    ]
  ),
  beast_handler: careerTree(
    { id: 'animal_kin', name: 'Animal Kin', icon: '🐕', desc: 'Passive: Calm non-magical beasts; read mood/intent.' },
    [
      { id: 'train_mount', name: 'Train Mount', icon: '🐴', desc: 'Craft: Tack and training — mount obeys commands in combat (GM companion rules).' },
      { id: 'scent_partner', name: 'Scent Partner', icon: '👃', desc: 'Action: Animal alerts to poison, disease, or hidden creature within 30ft.' },
      { id: 'veterinary', name: 'Veterinary', icon: '🩺', desc: 'Action: Stabilise beast; heal 1d6 HP or remove minor condition.' }
    ],
    [
      { id: 'falcons_eye', name: 'Falcon\'s Eye', icon: '🦅', desc: 'Action: Send scout animal — report layout of area ahead (limited range).', prereqT2: 'train_mount' },
      { id: 'pack_tactics', name: 'Pack Tactics', icon: '🐺', desc: 'Passive: When you and a beast attack same target, +1 accuracy for both.', prereqT2: 'scent_partner' },
      { id: 'call_the_wild', name: 'Call the Wild', icon: '🌲', desc: 'Action: Summon mundane animals for distraction or transport (once per day, GM).', prereqT2: 'veterinary' }
    ]
  ),
  cleric_lay: careerTree(
    { id: 'lay_blessing', name: 'Lay Blessing', icon: '✝️', desc: 'Action: Touch ally — +1 Magical Defence for 8 hours (once per ally per day).' },
    [
      { id: 'last_rites', name: 'Last Rites', icon: '⚰️', desc: 'Passive: Prevent undead rise from bodies you sanctify.' },
      { id: 'comfort_the_dying', name: 'Comfort the Dying', icon: '🕊️', desc: 'Action: Ally at 0 HP hears you — advantage on death saves (GM).' },
      { id: 'holy_symbol_craft', name: 'Holy Symbol Craft', icon: '✨', desc: 'Craft: Symbols that grant +1 vs fear/mind control while worn.' }
    ],
    [
      { id: 'turn_unholy', name: 'Turn Unholy', icon: '☀️', desc: 'Action: Warded area 10ft — undead/demons hesitate to enter (GM save).', prereqT2: 'last_rites' },
      { id: 'sanctuary_camp', name: 'Sanctuary Camp', icon: '⛺', desc: 'Action: Short rest in consecrated camp — remove one fear/charm.', prereqT2: 'comfort_the_dying' },
      { id: 'faiths_reservoir', name: 'Faith\'s Reservoir', icon: '💧', desc: 'Passive: Once per day, double HP restored by a potion you administer.', prereqT2: 'holy_symbol_craft' }
    ]
  )
}

/** Old profession skill id → new career skill id (for recipe gates). */
const RECIPE_SKILL_MAP = {
  basic_smithing: 'apprentice_smith',
  weapon_smithing: 'weaponwright',
  armor_smithing: 'armourer',
  enchanted_smithing: 'master_alloy',
  alloy_crafting: 'master_alloy',
  advanced_smithing: 'master_alloy',
  legendary_smithing: 'tempered_steel',
  divine_smithing: 'tempered_steel',
  dragon_smithing: 'tempered_steel',
  titan_smithing: 'tempered_steel',
  void_smithing: 'siege_breaker',
  basic_cooking: 'camp_cook',
  hearty_meals: 'hearty_rations',
  agility_cooking: 'spice_box',
  stat_boosting_food: 'spice_box',
  magical_cooking: 'banquet_planner',
  legendary_cooking: 'banquet_planner',
  culinary_mastery: 'battle_breakfast',
  master_chef: 'chefs_instinct',
  void_cooking: 'chefs_instinct',
  scent_masking: 'chefs_instinct',
  plant_identification: 'hands_in_soil',
  herbal_remedies: 'hands_in_soil',
  healing_salves: 'preserve_harvest',
  elemental_herbalism: 'crop_rotation',
  magical_herbs: 'green_thumb',
  strength_herbalism: 'green_thumb',
  moon_herbalism: 'green_thumb',
  phoenix_herbalism: 'green_thumb',
  spirit_herbalism: 'green_thumb',
  void_herbalism: 'green_thumb',
  cosmic_herbalism: 'bountiful_plot',
  herbalism_mastery: 'bountiful_plot',
  basic_alchemy: 'field_medic',
  poison_brewing: 'acid_vials',
  elixir_brewing: 'surgical_touch',
  barrier_brewing: 'plague_ward',
  explosive_compounds: 'explosive_compounds',
  transmutation: 'transmute_salts',
  phase_brewing: 'volatile_expert',
  dragon_alchemy: 'volatile_expert',
  void_alchemy: 'volatile_expert',
  immortality_brewing: 'revival_draft',
  grand_alchemist: 'volatile_expert',
  elixir_of_life: 'revival_draft',
  basic_enchanting: 'rune_apprentice',
  elemental_infusion: 'elemental_ink',
  soul_binding: 'soul_bind',
  artifact_creation: 'artifact_shaping',
  archenchanter: 'dispel_touch',
  barrier_enchanting: 'ward_scribe',
  dimensional_enchanting: 'elemental_ink',
  divine_enchanting: 'soul_bind',
  divine_runecarving: 'artifact_shaping',
  weapon_enchanting: 'elemental_ink',
  infinity_binding: 'artifact_shaping',
  reality_binding: 'dispel_touch',
  artifact_study: 'artifact_study',
  ancient_knowledge: 'ancient_tongues',
  crystal_archaeology: 'trap_sense',
  dimensional_archaeology: 'careful_extraction',
  divine_archaeology: 'divine_dig',
  genesis_archaeology: 'lost_technique',
  legendary_discovery: 'replicate_relic',
  master_archaeologist: 'deduction',
  royal_archaeology: 'deduction',
  shadow_archaeology: 'trap_sense',
  titan_archaeology: 'lost_technique'
}

const careersOut = `// Auto-generated by scripts/generate-careers.mjs — do not edit by hand\nconst CAREERS_SKILLS_DATA = ${JSON.stringify(CAREERS_SKILLS_DATA, null, 4)}\n\nif (typeof window !== 'undefined') {\n  window.CAREERS_SKILLS_DATA = CAREERS_SKILLS_DATA\n}\n`
fs.writeFileSync(path.join(dataDir, 'careers-skills-data.js'), careersOut, 'utf8')

const profPath = path.join(dataDir, 'profession-items-data.js')
let profCode = fs.readFileSync(profPath, 'utf8')
const mapSkill = id => RECIPE_SKILL_MAP[id] || id
profCode = profCode.replace(/"requiredSkills":\s*\[([\s\S]*?)\]/g, (match, inner) => {
  const ids = [...inner.matchAll(/"([^"]+)"/g)].map(m => m[1])
  if (!ids.length) return match
  const mapped = [...new Set(ids.map(mapSkill))]
  return `"requiredSkills": [\n                ${mapped.map(id => `"${id}"`).join(',\n                ')}\n            ]`
})
fs.writeFileSync(profPath, profCode, 'utf8')

console.log(`Wrote careers-skills-data.js (${Object.keys(CAREERS_SKILLS_DATA).length} careers)`)
console.log('Updated profession-items requiredSkills')
