/** Combat rolls, damage types, and area shapes — plain language for casual tables. */

export const COMBAT_GLOSSARY_ENTRIES = [
  {
    id: 'attack-roll',
    term: 'Attack roll',
    aliases: ['to hit', 'hit roll', 'd20 attack'],
    category: 'Combat & rolls',
    summary: 'Roll d20 + Accuracy — meet or beat the target\'s defence to hit.',
    detail: 'Physical attacks use Physical Defence as the target number. Magical attacks use Magical Defence. Rolling a 20 on the die usually always hits; rolling a 1 usually misses (see Natural 1 and Unerring Aim if you maxed Accuracy). Some skills treat 18–20 as extra-good hits. Add bonus damage only after you know the attack landed.\n\nAt the table: “Roll the d20, add Accuracy, and compare to their defence number.”'
  },
  {
    id: 'natural-1',
    term: 'Natural 1 (attack roll)',
    aliases: ['nat 1', 'critical failure', 'auto miss', 'rolled a one'],
    category: 'Combat & rolls',
    summary: 'Rolling a 1 on the d20 before bonuses — usually an automatic miss.',
    detail: 'By default, a natural 1 on an attack roll misses even if your Accuracy would have beaten the target\'s defence. Some tables also treat it as a critical failure (fumble) — follow your GM. Halfling Lucky may let you reroll natural 1s.\n\nIf you maxed Accuracy and have Unerring Aim: a miss still deals half total damage (round down), but a natural 1 only deals basic attack damage — weapon die and similar, no Accuracy or other bonuses.\n\nAt the table: “Snake eyes on the d20 — that’s a miss unless a rule says otherwise.”'
  },
  {
    id: 'saving-throw',
    term: 'Saving throw (save)',
    aliases: ['save', 'saving throw', 'endurance save'],
    category: 'Combat & rolls',
    summary: 'Roll d20 + a stat to shrug off a spell, trap, or nasty effect.',
    detail: 'When text says “save or…” you roll d20 plus the stat the skill or GM names. Meet the target number to resist or reduce the effect. Rally Cry lets an ally reroll a failed save. We use plain stat names — not extra save categories from other RPGs.\n\nAt the table: “Roll to see if the bad thing sticks.”'
  },
  {
    id: 'roll-twice-higher',
    term: 'Roll twice, keep higher',
    aliases: ['fortune', 'lucky roll', 'good luck on the roll'],
    category: 'Combat & rolls',
    summary: 'Roll two d20s and use the better one.',
    detail: 'Used instead of “advantage” from other games. Halfling luck and similar effects say when this applies — attacks, saves, or checks. You only get one extra die, not more.\n\nAt the table: “Roll two dice, pick the nicer one.”'
  },
  {
    id: 'roll-twice-lower',
    term: 'Roll twice, keep lower',
    aliases: ['unlucky', 'jinxed', 'bad luck on the roll'],
    category: 'Combat & rolls',
    summary: 'Roll two d20s and use the worse one.',
    detail: 'Used when fear or a curse makes things harder. Some enemy tricks force you to reroll and keep the worse result.\n\nAt the table: “Roll two dice, pick the worse one.”'
  },
  {
    id: 'critical-hit',
    term: 'Critical hit (crit)',
    aliases: ['crit', 'natural 20', 'extra good hit'],
    category: 'Combat & rolls',
    summary: 'An especially good hit — often on a natural 20, sometimes 18–20.',
    detail: 'Read the weapon or skill. Crits often add extra dice or trigger bonus effects (Burn, Bleeding). There is no shared crit chart — follow the card that gave you the attack.\n\nAt the table: “That was a crit — add the extra dice or effect from the skill.”'
  },
  {
    id: 'physical-damage',
    term: 'Physical damage',
    aliases: ['weapon damage', 'melee damage', 'ranged damage'],
    category: 'Damage types',
    summary: 'Hits from weapons, claws, and arrows — checked against Physical Defence.',
    detail: 'Swords, bites, and bolts are physical unless the text adds an element (like +1d6 fire). Strong resistance to physical damage means you take only a quarter or half — same idea as elemental resist.\n\nAt the table: “Normal weapon hit — compare to Physical Defence.”'
  },
  {
    id: 'magical-damage',
    term: 'Magical damage',
    aliases: ['spell damage', 'magic attack'],
    category: 'Damage types',
    summary: 'Damage from spells and magic skills — checked against Magical Defence.',
    detail: 'Fireball-style blasts use Magical Defence unless the skill says otherwise. Magic Power often adds to the total. If the spell also has an element (fire, ice…), apply elemental resist after you know the hit damage.\n\nAt the table: “Spell hit — compare to Magical Defence, then apply any element rules.”'
  },
  {
    id: 'force-damage',
    term: 'Force damage',
    aliases: ['force', '1d6 force', 'raw magic energy'],
    category: 'Damage types',
    summary: 'Pure magic push — not fire, ice, or lightning.',
    detail: 'Force is magical energy without an element tag (example: “3d8 force + Magic Power”). Fire resist does not help. Used for telekinesis blasts and arcane bolts. Usually vs Magical Defence.\n\nAt the table: “It’s magic force — no elemental resist, use Magical Defence.”'
  },
  {
    id: 'poison-damage',
    term: 'Poison damage (instant)',
    aliases: ['toxic damage', 'venom damage'],
    category: 'Damage types',
    summary: 'Immediate poison harm — different from the Poison status that ticks over time.',
    detail: 'A skill may say “1d8 poison” on hit. That is instant damage. The Poison status is separate (damage over several turns). Poison Immunity blocks both.\n\nAt the table: “Poison hit now — subtract HP. Poison status is tracked separately.”'
  },
  {
    id: 'void-damage',
    term: 'Void damage',
    aliases: ['void', '1d6 void'],
    category: 'Damage types',
    summary: 'Shadowy anti-magic strike — good vs shields and barriers.',
    detail: 'Void shows up on special weapons and high-tier skills. It is its own tag, not one of the eight elements. Often strong vs magical shields.\n\nAt the table: “Void hit — follow the item text for barriers and bonus dice.”'
  },
  {
    id: 'slashing-damage',
    term: 'Slashing damage',
    aliases: ['slashing', 'slash', 'blade cut'],
    category: 'Damage types',
    summary: 'Cuts from blades and claws — still a physical hit.',
    detail: 'A flavour tag on some attacks. A few monsters resist slashing better than other physical hits — the GM applies that.\n\nAt the table: “It’s a cut — physical defence, unless the skill says magic.”'
  },
  {
    id: 'piercing-damage',
    term: 'Piercing damage',
    aliases: ['piercing', 'pierce', 'arrow damage'],
    category: 'Damage types',
    summary: 'Stabs and arrows — physical; some attacks ignore part of armour.',
    detail: 'Spears and arrows use piercing. Armour-piercing attacks ignore some Physical Defence — read the skill.\n\nAt the table: “Arrow or stab — physical defence, maybe ignore some armour.”'
  },
  {
    id: 'bludgeoning-damage',
    term: 'Bludgeoning damage',
    aliases: ['bludgeoning', 'blunt', 'hammer damage'],
    category: 'Damage types',
    summary: 'Crushing hits from hammers and clubs.',
    detail: 'Blunt physical damage. Thunder on hammers may add lightning element on top.\n\nAt the table: “Bonk — physical defence.”'
  },
  {
    id: 'acid-damage',
    term: 'Acid damage',
    aliases: ['acid', 'corrosive'],
    category: 'Damage types',
    summary: 'Acid harm — may also weaken armour over time.',
    detail: 'Instant acid subtracts HP if listed. Acid Corrosion is a separate effect that lowers Physical Defence each turn.\n\nAt the table: “Acid splash now; corrosion effect tracks armour separately.”'
  },
  {
    id: 'fire-damage',
    term: 'Fire damage (element)',
    aliases: ['fire', '1d6 fire', 'flame damage'],
    category: 'Damage types',
    summary: 'Fire element — apply fire resist or weakness after other bonuses.',
    detail: 'Half fire damage if you resist (50%), quarter if strong resist (25%), double if weak (200%). Burn status is separate — ongoing fire plus feeling weaker.\n\nAt the table: “Count fire damage, then multiply if they resist or are weak to fire.”'
  },
  {
    id: 'ice-damage',
    term: 'Ice damage (element)',
    aliases: ['ice', 'cold damage', 'frost'],
    category: 'Damage types',
    summary: 'Ice element — often leaves targets stuck in place (Immobilized).',
    detail: 'Apply ice resist/weak like other elements. “Freeze” usually means Immobilized — feet stuck, can still act unless also dazed.\n\nAt the table: “Cold damage, then check if they’re frozen in place.”'
  },
  {
    id: 'thunder-damage',
    term: 'Thunder / lightning damage',
    aliases: ['thunder', 'lightning', '1d6 thunder', 'electric'],
    category: 'Damage types',
    summary: 'Lightning counts as Thunder — one element in this game.',
    detail: 'Thunder strikes may daze targets (Incapacitated for a turn on a failed save). Apply thunder/lightning resist to the typed portion.\n\nAt the table: “Zap — thunder element, maybe daze on a bad save.”'
  },
  {
    id: 'on-hit',
    term: 'On hit',
    aliases: ['on a hit', 'when you hit', 'on hit:'],
    category: 'Combat & rolls',
    summary: 'Only if the attack actually landed — not on a miss.',
    detail: '“On hit: may Burn” means roll to hit first. Miss = no bonus effect. Some blasts auto-hit everything in an area — the skill will say so.\n\nAt the table: “Did the attack connect? If yes, roll the extra effect.”'
  },
  {
    id: 'ignore-defence',
    term: 'Ignore defence / armour piercing',
    aliases: ['ignore physical defence', 'armor piercing', 'armour piercing', 'ignore barriers'],
    category: 'Combat & rolls',
    summary: 'The attack treats armour as lower or skips part of it.',
    detail: 'Only subtract or ignore what the text names — not full invulnerability unless it says so. Example: ignore 3 Physical Defence, or ignore armour bonuses once per scene.\n\nAt the table: “Lower their defence number by what the card says.”'
  },
  {
    id: 'push',
    term: 'Push (forced movement)',
    aliases: ['push 10ft', 'shove', 'knock back'],
    category: 'Combat & rolls',
    summary: 'Move the target back — distance in feet.',
    detail: 'Wind and thunder hits often push 5–10ft. Does not automatically knock them down unless stated. GM decides cliffs and furniture.\n\nAt the table: “Move their mini back X feet.”'
  },
  {
    id: 'cone-burst-line',
    term: 'Cone, burst, line & aura',
    aliases: ['30ft cone', '20ft burst', '15ft aura', 'area effect'],
    category: 'Combat & rolls',
    summary: 'Shape and size of a spell or song area.',
    detail: 'Cone: triangle in front of you (breath). Burst: circle (fireball). Line: straight shot (lightning). Aura: bubble around you while active. Songs often use “hearing range” — about 30ft at a friendly table.\n\nAt the table: “Who is inside the shape? They are affected.”'
  },
  {
    id: 'once-per-combat',
    term: 'Once per combat / day / scene',
    aliases: ['once per combat', 'once per day', 'once per scene', '1/day'],
    category: 'Combat & rolls',
    summary: 'Strong effect with a limit — tick a box when used.',
    detail: 'Per combat resets after the fight. Per day resets after a rest (GM decides). Per scene is once until the story moves on.\n\nAt the table: “Mark it used so we remember.”'
  },
  {
    id: 'reaction',
    term: 'Reaction',
    aliases: ['harmony reaction', 'quick response'],
    category: 'Combat & rolls',
    summary: 'Something you do outside your normal turn — Harmony Reaction is the team version.',
    detail: 'Harmony Reaction lets allies join a career skill (see Team harmony). Other reactions are skill-specific — read each card for cost (often skipping your next turn).\n\nAt the table: “I join in!” — GM counts helpers and applies the bonus.'
  },
  {
    id: 'temp-hp',
    term: 'Temporary health (temp HP)',
    aliases: ['temp hp', 'temporary hit points', 'shield hp', 'bonus health'],
    category: 'Combat & rolls',
    summary: 'Extra health buffer that goes away first — not healed back.',
    detail: 'Chef meals and buffs may grant dice of temp health at fight start. Damage eats temp health before your real HP. Track separately; it usually does not stack forever. Barrier Crystal-style pools are different — they soak only magical damage on an enchant slot, not general temp HP.\n\nAt the table: “Extra bubbles on the HP track — gone when hit.”'
  },
  {
    id: 'bloodied',
    term: 'Hurt (below half health)',
    aliases: ['bloodied', 'below half hp', 'half health', 'wounded'],
    category: 'Combat & rolls',
    summary: 'Shorthand for “lost at least half their max health.”',
    detail: 'Some weapons and skills care if a target is hurt (below half max HP). The app does not flag this — compare current HP to max, or ask the GM.\n\nAt the table: “Are they below half health? Then the bonus applies.”'
  },
  {
    id: 'incorporeal',
    term: 'Ghost form / immune to physical',
    aliases: ['incorporeal', 'immune to physical damage', 'mist form'],
    category: 'Combat & rolls',
    summary: 'Normal weapons pass through — use magic or special attacks.',
    detail: 'Mist spells and some monsters ignore physical hits for a few turns. Use magical attacks or force damage as the skill allows.\n\nAt the table: “Swords whiff — try a spell.”'
  },
  {
    id: 'dice-notation',
    term: 'Dice notation (1d6, 2d8, etc.)',
    aliases: ['1d6', '2d8', '3d20', 'damage dice'],
    category: 'Combat & rolls',
    summary: 'How many dice to roll — count × sides.',
    detail: '1d6 = one six-sided die. 2d8+3 = roll two eight-sided dice, add them, then add 3. Strength or Magic Power may add more if the skill says so.\n\nAt the table: “Roll the dice shown, add bonuses, tell the table the total.”'
  }
]
