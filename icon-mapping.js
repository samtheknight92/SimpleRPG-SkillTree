// Icon Mapping System for RPG
class IconMapper {
    constructor() {
        this.basePath = './icons_renamed_improved'
        this.iconMappings = {
            // Character Types
            characters: {
                warrior: 'sword_shield.png',
                mage: 'staff.png',
                rogue: 'dagger.png',
                archer: 'bow.png',
                paladin: 'silver_shield.png',
                barbarian: 'battle_axe.png',
                monk: 'staff_1.png',
                cleric: 'blue_shield.png',
                ranger: 'bow_and_arrow.png',
                bard: 'staff_crystal.png',
                warlock: 'skull_icon.png',
                sorcerer: 'magic_staff.png',
                necromancer: 'skull_item.png',
                assassin: 'curved_dagger.png',
                ninja: 'dagger_1.png',
                hooded_assassin: 'dagger_2.png',
                hooded_figure: 'dark_cape.png',
                dwarf_king: 'crown_icon.png',
                old_king: 'crown_icon.png',
                nun: 'white_robe.png',
                witch: 'magic_staff_1.png',
                swordsman: 'sword_blue.png',
                swordswoman: 'sword_blue_1.png'
            },

            // Status Effects
            statusEffects: {
                // Damage Over Time
                burn: 'fire.png',
                burning: 'fire_1.png',
                poison: 'poison_flask.png',
                toxic: 'toxic_armor.png',
                acid_corrosion: 'green_potion.png',
                acid: 'green_potion_1.png',
                bleeding: 'red_potion.png',
                disease: 'purple_potion.png',
                decay: 'skull_icon.png',

                // Debuffs
                cursed: 'black.png',
                weakened: 'shield_red.png',
                slowed: 'blue_potion.png',
                stunned: 'yellow_potion.png',
                paralyzed: 'orange_potion.png',
                frozen: 'ice_crystal.png',
                petrified: 'crystal.png',
                silenced: 'black_1.png',
                blinded: 'dark_cape.png',
                deafened: 'black_1.png',
                charmed: 'pink_potion.png',
                feared: 'skull_item.png',
                confused: 'sword_slash.png',
                mind_controlled: 'purple_mask.png',

                // Control Effects
                incapacitated: 'skull_icon_1.png',
                immobilized: 'wooden_shield.png',

                // Buffs
                regeneration: 'health_potion.png',
                enhanced: 'orange_armor.png',
                empowered: 'blue_armor.png',
                blessed: 'blue_shield.png',
                protected: 'shield_armor.png',
                hasted: 'bow_and_arrow.png',
                enlarged: 'sword_shield.png',
                invisible: 'magic_orb.png',
                flying: 'dark_cape.png',

                // Weapon Enchantments
                weapon_enchanted: 'magic_sword.png',
                flaming_weapon: 'fire_sword.png',
                frost_weapon: 'ice_sword.png',
                shock_weapon: 'blue_sword.png',
                holy_weapon: 'golden_sword.png',

                // Magical Protections
                spell_warded: 'blue_shield_1.png',
                spell_resistance: 'shield_armor_1.png',
                damage_resistance: 'armor_chest_16.png',

                // Enhanced Abilities
                enhanced_mobility: 'boot.png',
                enhanced_strength: 'sword_shield.png',
                enhanced_dexterity: 'bow_and_arrow.png',
                enhanced_magicDefence: 'magic_staff.png',

                // Special Abilities
                stealth_mastery: 'dark_cape.png',
                intimidating_aura: 'skull_icon_2.png',
                toxic_presence: 'poison_flask.png',
                vampiric: 'blood_crystal.png',
                berserker_rage: 'helmet.png',

                // Environmental
                underwater_breathing: 'blue_potion.png',
                fire_immunity: 'fire_shield.png',
                cold_immunity: 'shield_blue.png',
                shock_immunity: 'blue_shield.png',

                // Transformation
                shapechanged: 'wolf_head.png',
                lycanthropy: 'wolf_head.png',
                undead: 'skull_item.png'
            },

            // Weapon Types and Skills
            weapons: {
                // Melee Weapons - Bladed
                sword: 'sword.png',
                longsword: 'long_sword.png',
                shortsword: 'sword_1.png',
                rapier: 'sword_2.png',
                scimitar: 'sword_3.png',
                katana: 'sword_4.png',
                sabre: 'sword_5.png',
                greatsword: 'sword_6.png',
                claymore: 'sword_7.png',

                // Melee Weapons - Axes
                axe: 'axe.png',
                handaxe: 'axe_1.png',
                battleaxe: 'battle_axe.png',
                greataxe: 'axe_2.png',
                hatchet: 'axe_3.png',

                // Melee Weapons - Blunt
                mace: 'hammer.png',
                club: 'wooden_hammer.png',
                warhammer: 'hammer_1.png',
                maul: 'hammer_2.png',
                flail: 'hammer_3.png',
                morningstar: 'hammer_4.png',

                // Melee Weapons - Stabbing
                dagger: 'dagger.png',
                stiletto: 'dagger_1.png',
                knife: 'dagger_2.png',
                dirk: 'dagger_3.png',
                kris: 'curved_dagger.png',

                // Polearms
                spear: 'spear_weapon.png',
                pike: 'spear_weapon.png',
                halberd: 'double_blade.png',
                glaive: 'double_blade_1.png',
                lance: 'spear_weapon.png',
                trident: 'spear_weapon.png',
                quarterstaff: 'staff.png',

                // Ranged Weapons
                bow: 'bow.png',
                longbow: 'bow_and_arrow.png',
                shortbow: 'bow_1.png',
                crossbow: 'bow_2.png',
                sling: 'bow_3.png',
                blowgun: 'bow_4.png',
                javelin: 'spear_weapon.png',

                // Exotic Weapons
                whip: 'sword_slash.png',
                chain: 'sword_slash.png',
                nunchaku: 'wooden_hammer.png',
                sai: 'dagger_1.png',
                kama: 'axe.png',
                chakram: 'magic_pink.png',
                boomerang: 'wooden_shield.png',
                kusarigama: 'sword_slash.png',
                shuriken: 'star_icon.png',
                ninja_star: 'star_icon.png',
                throwing_star: 'star_icon.png',

                // Magic Weapons
                staff: 'magic_staff.png',
                wand: 'magic_wand.png',
                orb: 'magic_orb.png',
                orb_wand: 'magic_wand_1.png',
                tome: 'book.png',

                // Firearms
                pistol: 'bow.png',
                rifle: 'bow_1.png',
                shotgun: 'bow_2.png',
                musket: 'bow_3.png',

                // Skill subcategories
                swordplay: 'sword_slash.png',
                archery: 'bow_and_arrow.png',
                polearms: 'spear_weapon.png',
                throwing: 'star_icon.png',
                gunslinging: 'bow.png'
            },

            // Magic Schools
            magic: {
                // Elemental Magic
                elemental: 'magic.png',
                fire: 'fire.png',
                water: 'water_wave.png',
                earth: 'crystal.png',
                air: 'magic_1.png',
                wind: 'magic_1.png',
                ice: 'ice_crystal.png',
                lightning: 'blue_magic.png',
                light: 'crystal.png',
                darkness: 'dark_energy_orb.png',

                // Arcane Schools
                arcane: 'magic_orb.png',
                evocation: 'magic_sword.png',
                conjuration: 'portal_blue.png',
                transmutation: 'crystal_growth.png',
                enchantment: 'magic_pink.png',
                illusion: 'magic_orb_1.png',
                divination: 'crystal_orb.png',
                abjuration: 'magic_shield.png',

                // Divine Magic
                divine: 'blue_shield.png',
                healing: 'health_potion.png',
                protection: 'shield_armor.png',
                blessing: 'blue_shield.png',
                smiting: 'golden_sword.png',

                // Nature Magic
                nature: 'leaf_item.png',
                druidcraft: 'branch_item.png',
                animal: 'wolf_head.png',
                plant: 'magical_flower.png',
                weather: 'waterfall_icon.png',

                // Dark Magic
                necromancy: 'skull_item.png',
                shadow: 'dark_cape.png',
                blood: 'blood_crystal.png',
                curse: 'skull_icon.png',
                undeath: 'spooky_ghost.png',

                // Psionic/Mental
                psionics: 'magic_pink.png',
                telepathy: 'purple_mask.png',
                telekinesis: 'portal_white.png',
                mind_control: 'dark_energy_orb.png',

                // Exotic Schools
                chaos: 'magic_orb.png',
                time: 'clock.png',
                space: 'portal_blue.png',
                dimensional: 'glowing_portal.png'
            },

            // Armor Types
            armor: {
                // Light Armor
                light: 'leather_armor.png',
                leather: 'leather_armor_1.png',
                studded_leather: 'leather_armor_2.png',
                padded: 'padded_armor.png',

                // Medium Armor
                medium: 'armor_piece.png',
                chain_mail: 'armor_piece_1.png',
                scale_mail: 'armor_chest_2.png',
                breastplate: 'chest_armor.png',

                // Heavy Armor
                heavy: 'armor_chest_16.png',
                splint: 'armor_chest_17.png',
                plate: 'armor_chest_18.png',
                full_plate: 'armor_chest_19.png',

                // Shields
                shield: 'shield.png',
                buckler: 'shield_1.png',
                tower_shield: 'shield_2.png',
                kite_shield: 'shield_3.png',

                // Helmets
                helmet: 'helmet.png',
                cap: 'helmet_1.png',
                coif: 'helmet_2.png',
                barbute: 'helmet_3.png',
                great_helm: 'helmet_4.png',
                brutal_helm: 'helmet_5.png',
                dwarf_helmet: 'helmet_6.png',
                elf_helmet: 'helmet_7.png',
                warlord_helmet: 'helmet_8.png',
                frog_mouth_helm: 'helmet_9.png',

                // Extremities
                boots: 'boot.png',
                gloves: 'glove.png',
                gauntlets: 'glove.png',
                bracers: 'armor_piece.png',
                greaves: 'boot_1.png',
                armored_pants: 'armor_piece_1.png',

                // Accessories
                cloak: 'dark_cape.png',
                cape: 'dark_cape.png',
                robe: 'robe_armor.png',
                belt: 'leather_armor.png',
                sash: 'leather_armor_1.png',
                necklace: 'gem.png',
                shirt: 'leather_armor_2.png',
                trousers: 'leather_armor_3.png'
            },

            // Skills Categories
            skills: {
                // Combat Skills
                weapons: 'sword_shield.png',
                melee_combat: 'sword_slash.png',
                ranged_combat: 'bow_and_arrow.png',
                unarmed_combat: 'hammer.png',
                dual_wielding: 'sword_shield.png',
                weapon_mastery: 'sword.png',

                // Magic Skills
                magic: 'magic_staff.png',
                spellcasting: 'spell_book.png',
                mana_control: 'magic_orb.png',
                ritual_magic: 'magic_crystal.png',

                // Defense Skills
                defense: 'shield.png',
                armor_training: 'armor_chest_16.png',
                shield_mastery: 'shield_armor.png',
                dodging: 'boot.png',
                parrying: 'sword_shield.png',

                // Stealth & Subterfuge
                stealth: 'dark_cape.png',
                lockpicking: 'key.png',
                pickpocketing: 'dagger.png',
                traps: 'bow.png',
                assassination: 'dagger_1.png',
                ninja_skills: 'dagger_2.png',
                acrobatics: 'boot.png',
                dodging: 'boot_1.png',

                // Survival Skills
                survival: 'branch_item.png',
                hunting: 'bow_and_arrow.png',
                tracking: 'wolf_head.png',
                foraging: 'magical_flower.png',
                herbalism: 'leaf_item.png',

                // Social Skills
                social: 'crown_icon.png',
                persuasion: 'pink_gem.png',
                intimidation: 'skull_icon.png',
                deception: 'dark_cape.png',
                leadership: 'blue_shield.png',

                // Crafting Skills
                crafting: 'hammer.png',
                smithing: 'hammer_1.png',
                alchemy: 'potion.png',
                enchanting: 'magic_orb.png',
                cooking: 'meat_chunk.png',

                // Knowledge Skills
                knowledge: 'book.png',
                lore: 'book_1.png',
                investigation: 'crystal_orb.png',
                medicine: 'health_potion.png',
                academics: 'book_2.png',

                // Physical Skills
                athletics: 'sword_shield.png',
                acrobatics: 'boot.png',
                climbing: 'bow_and_arrow.png',
                swimming: 'water_wave.png',
                catch: 'shield.png',

                // Profession Skills
                trading: 'coin.png',
                farming: 'branch_item.png',
                mining: 'hammer.png',
                sailing: 'blue.png',
                construction: 'hammer_1.png',

                // Combat Techniques
                riposte: 'sword_shield.png',
                overhead_strike: 'sword_slash.png',
                thrust: 'sword.png',
                sideswipe: 'sword_1.png',
                underhand: 'sword_2.png'
            },

            // UI Elements
            ui: {
                // Basic Resources
                health: 'health.png',
                mana: 'magic_orb.png',
                stamina: 'boot.png',
                experience: 'star_icon.png',

                // Currency
                gold: 'gold_coin.png',
                silver: 'silver.png',
                copper: 'coin.png',
                gems: 'gem.png',
                crystals: 'crystal.png',

                // Inventory & Equipment
                inventory: 'chest.png',
                backpack: 'chest_1.png',
                chest: 'chest_2.png',
                bag: 'chest_3.png',
                quiver: 'bow.png',

                // Shop & Trading
                shop: 'coin.png',
                merchant: 'gold_coin.png',
                bank: 'golden_coin.png',
                auction: 'coin_1.png',

                // Navigation
                map: 'portal_blue.png',
                compass: 'star_icon.png',
                waypoint: 'portal_white.png',
                teleport: 'portal_green.png',

                // Interface Controls
                settings: 'sword_shield.png',
                options: 'sword_shield.png',
                close: 'skull_icon.png',
                check: 'shield_green.png',
                cancel: 'shield_red.png',

                // Status Indicators
                warning: 'fire.png',
                error: 'skull_icon.png',
                info: 'blue_orb.png',
                success: 'green_orb.png',

                // Time & Processes
                clock: 'silver_shield.png',
                timer: 'shield_blue.png',
                process: 'portal_blue.png',
                loading: 'portal_white.png',

                // Game Actions
                save: 'book.png',
                load: 'book_1.png',
                pause: 'shield.png',
                play: 'shield_1.png',

                // Character Management
                select: 'sword_shield.png',
                create: 'magic_staff.png',
                monster: 'skull_item.png',
                delete: 'skull_icon.png',
                duplicate: 'magic_orb.png',

                // Stats & Combat
                primary_stats: 'sword_shield.png',
                combat_stats: 'sword_slash.png',
                mobility_defense: 'shield_armor.png',
                calculated_values: 'magic_orb.png',
                level_up: 'star_icon.png',

                // Transaction Operations
                buy: 'gold_coin.png',
                purchase: 'gold_coin.png',
                sell: 'coin.png',
                refund: 'coin_1.png',
                upgrade: 'star_icon.png',
                downgrade: 'shield_red.png',
                max_level: 'star_icon.png',
                mass_refund: 'golden_coin.png',

                // Combat & Testing
                combat_testing: 'sword_shield.png',
                process_turn: 'portal_blue.png',
                clear_effects: 'magic_orb.png',
                reset: 'portal_white.png',

                // Skill & Profession Categories
                professions: 'hammer.png',
                monster_skills: 'skull_item.png',
                fusion_skills: 'sword_shield.png',
                passive_skills: 'magic_orb.png',
                active_skills: 'sword_slash.png',

                // Game Mechanics
                dice: 'book.png',
                random: 'book_1.png',
                chance: 'book_2.png',
                luck: 'star_icon.png',

                // Weather & Environment
                day: 'fire.png',
                night: 'dark_cape.png',
                weather: 'water_wave.png',
                temperature: 'fire.png',

                // Social & Communication
                chat: 'book.png',
                mail: 'book_1.png',
                guild: 'blue_shield.png',

                // Achievements & Progress
                achievement: 'star_icon.png',
                trophy: 'crown_icon.png',
                medal: 'gold_coin.png',
                rank: 'blue_shield.png',
                progress: 'portal_blue.png'
            },

            // Accessories & Jewelry
            accessories: {
                ring: 'magic_ring.png',
                amulet: 'amulet_icon.png',
                pendant: 'amulet_with_frame.png',
                necklace: 'gem.png',
                boots: 'boot.png',
                gloves: 'glove.png',
                belt: 'leather_armor.png',
                bracers: 'armor_piece.png',
                gauntlets: 'glove.png',
                cloak: 'dark_cape.png',
                cape: 'dark_cape.png'
            },

            // Consumables
            consumables: {
                // Potions
                health_potion: 'health_potion.png',
                mana_potion: 'mana_potion.png',
                stamina_potion: 'blue_potion.png',
                strength_potion: 'red_potion.png',
                speed_potion: 'yellow_potion.png',
                invisibility_potion: 'purple_potion.png',
                madness_potion: 'green_potion.png',

                // Medicine & Healing
                antidote: 'green_potion.png',
                healing_herb: 'leaf_item.png',
                bandage: 'green_money_bag.png',
                medical_kit: 'health_potion.png',

                // Food & Drink
                food: 'meat_chunk.png',
                meat: 'meat_chunk.png',
                fruit: 'magical_flower.png',
                ale: 'blue_potion.png',
                wine: 'red_potion.png',

                // Explosives & Tools
                bomb: 'fire.png',
                smoke_bomb: 'black.png',
                flash_bomb: 'yellow_potion.png',
                acid_vial: 'green_potion.png',

                // Scrolls & Magic Items
                scroll: 'book.png',
                spell_scroll: 'spell_book.png',
                magic_crystal: 'crystal.png',
                runestone: 'magic_crystal.png',
                black_book: 'book_1.png',
                white_book: 'book_2.png',

                // Ammunition
                arrows: 'bow_and_arrow.png',
                broken_arrow: 'bow_1.png',
                bolts: 'bow_2.png',
                bullets: 'bow_3.png',
                stones: 'crystal.png',

                // Tools & Utilities
                torch: 'fire.png',
                rope: 'green_money_bag.png',
                lockpicks: 'key.png',
                trap_kit: 'bow.png'
            },

            // Materials & Crafting
            materials: {
                ore: 'crystal.png',
                iron_ore: 'magic_crystal.png',
                gold_ore: 'gem.png',
                silver_ore: 'crystal_1.png',
                wood: 'leaf_item.png',
                stone: 'crystal.png',
                leather: 'leather_armor.png',
                cloth: 'green_money_bag.png',
                gem: 'gem.png',
                crystal: 'magic_crystal.png',
                generic: 'anvil_icon.png'
            },

            // Monsters & Creatures
            monsters: {
                // Humanoids
                orc: 'helmet.png',
                goblin: 'skull_item.png',
                troll: 'skull_icon.png',
                ogre: 'helmet_1.png',
                giant: 'helmet_2.png',

                // Undead
                skeleton: 'skull_icon.png',
                zombie: 'skull_item.png',
                ghost: 'dark_cape.png',
                lich: 'crown_skull.png',
                vampire: 'dark_mask.png',

                // Dragons & Dragonkin
                dragon: 'dragon_head.png',
                drake: 'dragon_wing.png',
                kobold: 'lizard_scale.png',

                // Beasts
                wolf: 'lorc/wolf-head.svg',
                bear: 'delapouite/bear-head.svg',
                lion: 'lorc/lion.svg',
                tiger: 'delapouite/tiger.svg',
                boar: 'lorc/boar-tusks.svg',

                // Magical Creatures
                unicorn: 'delapouite/unicorn.svg',
                griffon: 'delapouite/griffin-symbol.svg',
                phoenix: 'fire_bird.png',
                elemental: 'fire.png',

                // Aberrations
                tentacle_monster: 'dark_cape.png',
                blob: 'green_potion.png',
                eye_beast: 'magic_orb.png',

                // Insects & Arachnids
                spider: 'dark_mask.png',
                scorpion: 'curved_dagger.png',
                centipede: 'dagger_2.png',

                // Aquatic
                shark: 'water_wave.png',
                kraken: 'dark_cape.png',
                sea_serpent: 'dragon_head.png'
            },

            // Environments & Locations
            environments: {
                dungeon: 'dark_gate.png',
                cave: 'stone_wall.png',
                forest: 'branch_item.png',
                mountain: 'stone_block.png',
                desert: 'sand.png',
                swamp: 'green_orb.png',
                city: 'blue_shield.png',
                castle: 'crown_icon.png',
                tower: 'magic_tower.png',
                ruins: 'stone_block.png',
                temple: 'blue_shield.png',
                graveyard: 'skull_icon.png',
                volcano: 'fire.png',
                ice_cave: 'ice_crystal.png',
                underwater: 'water_wave.png'
            },

            // Quest & Adventure Elements
            quests: {
                main_quest: 'star_icon.png',
                side_quest: 'book.png',
                delivery: 'chest.png',
                escort: 'blue_shield.png',
                kill_target: 'skull_icon.png',
                collect_items: 'chest_1.png',
                exploration: 'portal_blue.png',
                puzzle: 'magic_orb.png',
                rescue: 'blue_shield.png'
            },

            // Card Game Elements
            cards: {
                // Playing Cards - Hearts
                ace_hearts: 'heart_1.png',
                two_hearts: 'heart_2.png',
                three_hearts: 'heart_3.png',
                four_hearts: 'heart_4.png',
                five_hearts: 'heart_5.png',
                six_hearts: 'heart_6.png',
                seven_hearts: 'heart_7.png',
                eight_hearts: 'heart_8.png',
                nine_hearts: 'heart_9.png',
                ten_hearts: 'heart_10.png',
                jack_hearts: 'heart_jack.png',
                queen_hearts: 'heart_queen.png',
                king_hearts: 'heart_king.png',

                // Card Actions
                draw: 'book.png',
                discard: 'book_1.png',
                pick: 'book_2.png',
                random: 'book_3.png',
                pickup: 'book_4.png',
                play: 'book_5.png'
            },

            // Power & Energy Systems
            power: {
                battery_empty: 'shield_red.png',
                battery_low: 'shield_orange.png',
                battery_half: 'shield_yellow.png',
                battery_high: 'shield_green.png',
                battery_full: 'shield_blue.png',
                battery_plus: 'plus_icon.png',
                battery_minus: 'minus_icon.png',
                power_button: 'magic_orb.png'
            },

            // Game Mechanics
            mechanics: {
                rock: 'crystal.png',
                paper: 'book.png',
                scissors: 'dagger.png',
                coinflip: 'coin.png',
                infinity: 'portal_blue.png',
                ricochet: 'sword_slash.png'
            },

            // Media Controls
            media: {
                play: 'shield.png',
                pause: 'shield_1.png'
            },

            // Equipment Slots
            slots: {
                weapon: 'sword_shield.png',
                armor: 'armor_chest_16.png',
                accessory: 'gem.png',
                helmet: 'helmet.png',
                boots: 'boot.png',
                gloves: 'green_money_bag.png',
                ring: 'ring.png',
                necklace: 'gem.png'
            }
        }
    }

    // Get icon path for a specific category and type
    getIcon(category, type) {
        if (this.iconMappings[category] && this.iconMappings[category][type]) {
            return `${this.basePath}/${this.iconMappings[category][type]}`
        }
        return this.getDefaultIcon(category)
    }

    // Get default icon for category if specific type not found
    getDefaultIcon(category) {
        const defaults = {
            characters: `${this.basePath}/magic_staff.png`,
            statusEffects: `${this.basePath}/magic_orb.png`,
            weapons: `${this.basePath}/sword.png`,
            armor: `${this.basePath}/armor_chest_16.png`,
            accessories: `${this.basePath}/magic_ring.png`,
            consumables: `${this.basePath}/potion.png`,
            materials: `${this.basePath}/anvil_icon.png`,
            skills: `${this.basePath}/sword_shield.png`,
            ui: `${this.basePath}/book.png`,
            slots: `${this.basePath}/shield.png`,
            magic: `${this.basePath}/magic_staff.png`,
            monsters: `${this.basePath}/skull_item.png`,
            environments: `${this.basePath}/branch_item.png`,
            quests: `${this.basePath}/book.png`,
            cards: `${this.basePath}/book_1.png`,
            power: `${this.basePath}/shield_blue.png`,
            mechanics: `${this.basePath}/magic_orb.png`,
            media: `${this.basePath}/shield.png`
        }
        return defaults[category] || `${this.basePath}/magic_orb.png`
    }

    // Create icon element (PNG image with emoji fallback)
    createIconElement(category, type, size = 24, className = '') {
        // Emoji fallbacks for common status effects and UI elements
        const emojiFallbacks = {
            statusEffects: {
                burn: '🔥', burning: '🔥', poison: '☠️', toxic: '☠️', acid: '🧪',
                bleeding: '🩸', disease: '🦠', cursed: '😈', weakened: '💔',
                slowed: '🐌', stunned: '😵', paralyzed: '⚡', frozen: '🧊',
                petrified: '🗿', mind_controlled: '🧠', incapacitated: '😵',
                immobilized: '🔒', regeneration: '💚', enhanced: '💪',
                empowered: '⚡', blessed: '✨', protected: '🛡️', hasted: '💨',
                enlarged: '📏', invisible: '👻', flying: '🪶',
                weapon_enchanted: '✨', flaming_weapon: '🔥', frost_weapon: '❄️',
                spell_warded: '🔮', enhanced_mobility: '🏃'
            },
            weapons: {
                sword: '⚔️', dirk: '🗡️', battle_axe: '🪓', bow: '🏹'
            },
            armor: {
                armor: '🛡️', ring: '💍'
            },
            accessories: {
                ring: '💍', amulet: '🔮', pendant: '📿', necklace: '📿',
                boots: '👢', gloves: '🧤', belt: '🔗', cloak: '🧥'
            },
            consumables: {
                health_potion: '🧪', mana_potion: '🔵', stamina_potion: '🟡',
                strength_potion: '🔴', speed_potion: '💨', scroll: '📜',
                food: '🍖', meat: '🥩', bread: '🍞'
            },
            materials: {
                ore: '⛏️', wood: '🪵', stone: '🪨', gem: '💎',
                crystal: '💎', generic: '🔨'
            },
            ui: {
                select: '👆', monster: '👹', delete: '🗑️', create: '➕',
                purchase: '💰', refund: '↩️', mass_refund: '↩️',
                calculated_values: '🧮', combat_testing: '⚔️',
                fusion_skills: '🔗', clear: '🧹', process: '⚙️'
            },
            skills: {
                smithing: '🔨'
            },
            magic: {
                fire: '🔥'
            }
        }

        // Try to get emoji fallback first
        const emoji = emojiFallbacks[category]?.[type]
        if (emoji) {
            return `<span class="icon emoji-icon ${className}" style="font-size: ${size}px;" title="${type}">${emoji}</span>`
        }

        // Fallback to SVG (this may still cause 404 errors, but won't break the UI)
        const iconPath = this.getIcon(category, type)
        return `<img src="${iconPath}" width="${size}" height="${size}" class="icon ${className}" alt="${type}" onerror="this.style.display='none';" />`
    }

    // Create icon for shop/inventory items (PNG first, then emoji fallback)
    createItemIcon(category, type, size = 24, className = '') {
        // Try to get PNG icon first
        const iconPath = this.getIcon(category, type)

        // Return PNG image with emoji fallback
        const emojiFallbacks = {
            weapons: {
                sword: '⚔️', longsword: '⚔️', shortsword: '🗡️', rapier: '🗡️',
                scimitar: '🗡️', katana: '🗡️', axe: '🪓', battleaxe: '🪓',
                dagger: '🗡️', knife: '🗡️', bow: '🏹', staff: '🪄', mace: '🔨'
            },
            armor: {
                light: '🛡️', leather: '🛡️', chain_mail: '🛡️', scale_mail: '🛡️',
                plate: '🛡️', shield: '🛡️', helmet: '⛑️', boots: '👢',
                gloves: '🧤', cloak: '🧥', robe: '👘'
            },
            accessories: {
                ring: '💍', amulet: '🔮', pendant: '📿', necklace: '📿',
                boots: '👢', gloves: '🧤', belt: '🔗', cloak: '🧥'
            },
            consumables: {
                health_potion: '🧪', mana_potion: '🔵', stamina_potion: '🟡',
                strength_potion: '🔴', speed_potion: '💨', scroll: '📜',
                food: '🍖', meat: '🥩', bread: '🍞'
            },
            materials: {
                ore: '⛏️', wood: '🪵', stone: '🪨', gem: '💎',
                crystal: '💎', generic: '📦'
            }
        }

        const emojiBackup = emojiFallbacks[category]?.[type] || '📦'

        return `<img src="${iconPath}" width="${size}" height="${size}" class="icon ${className}" alt="${type}" 
                 onerror="this.outerHTML='<span class=\\"icon emoji-icon ${className}\\" style=\\"font-size: ${size}px;\\" title=\\"${type}\\">${emojiBackup}</span>'" />`
    }

    // Create inline SVG (for better styling control)
    async createInlineSVG(category, type, size = 24, className = '') {
        const iconPath = this.getIcon(category, type)
        try {
            const response = await fetch(iconPath)
            const svgText = await response.text()
            const parser = new DOMParser()
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
            const svgElement = svgDoc.querySelector('svg')

            if (svgElement) {
                svgElement.setAttribute('width', size)
                svgElement.setAttribute('height', size)
                svgElement.setAttribute('class', `icon ${className}`)
                return svgElement.outerHTML
            }
        } catch (error) {
            console.warn(`Failed to load SVG: ${iconPath}`, error)
        }
        return this.createIconElement(category, type, size, className)
    }

    // Enhanced method to automatically detect and add icons to buttons
    enhanceButtonsWithIcons() {
        // Status effect buttons
        document.querySelectorAll('.status-btn[data-effect]').forEach(button => {
            const effect = button.getAttribute('data-effect')
            if (this.iconMappings.statusEffects[effect]) {
                const iconHTML = this.createIconElement('statusEffects', effect, 16, 'status-effect')
                if (!button.innerHTML.includes('<img')) {
                    button.innerHTML = iconHTML + button.innerHTML
                }
            }
        })

        // Skill category buttons
        document.querySelectorAll('.skill-category-btn').forEach(button => {
            const category = button.textContent.toLowerCase().trim()
            if (this.iconMappings.skills[category]) {
                const iconHTML = this.createIconElement('skills', category, 16)
                if (!button.innerHTML.includes('<img')) {
                    button.innerHTML = iconHTML + button.innerHTML
                }
            }
        })

        // Process turn and clear buttons
        document.querySelectorAll('#process-effects-btn').forEach(button => {
            const iconHTML = this.createIconElement('ui', 'process', 16)
            if (!button.innerHTML.includes('<img')) {
                button.innerHTML = iconHTML + button.innerHTML
            }
        })

        document.querySelectorAll('#clear-all-effects-btn').forEach(button => {
            const iconHTML = this.createIconElement('ui', 'clear', 16)
            if (!button.innerHTML.includes('<img')) {
                button.innerHTML = iconHTML + button.innerHTML
            }
        })
    }

    // Bulk icon loading for performance
    preloadIcons(categories) {
        const iconPaths = []
        categories.forEach(category => {
            if (this.iconMappings[category]) {
                Object.values(this.iconMappings[category]).forEach(path => {
                    iconPaths.push(`${this.basePath}/${path}`)
                })
            }
        })

        // Preload images
        iconPaths.forEach(path => {
            const img = new Image()
            img.src = path
        })
    }
}

// Create global instance
window.iconMapper = new IconMapper()

// Global renderItemIcon function for shop and inventory
window.renderItemIcon = function (item, size = 24, className = '') {
    if (!item || !window.iconMapper) {
        return `<span class="item-icon ${className}" style="font-size: ${size}px;">📦</span>`
    }

    // Map item types to icon categories and types
    const getIconMapping = (item) => {
        // Weapons
        if (item.type === 'weapon') {
            // Specific sword type mapping
            if (item.id.includes('longsword')) return { category: 'weapons', type: 'longsword' }
            if (item.id.includes('shortsword')) return { category: 'weapons', type: 'shortsword' }
            if (item.id.includes('greatsword')) return { category: 'weapons', type: 'greatsword' }
            if (item.id.includes('rapier')) return { category: 'weapons', type: 'rapier' }
            if (item.id.includes('scimitar')) return { category: 'weapons', type: 'scimitar' }
            if (item.id.includes('katana')) return { category: 'weapons', type: 'katana' }
            if (item.id.includes('sabre')) return { category: 'weapons', type: 'sabre' }
            if (item.id.includes('claymore')) return { category: 'weapons', type: 'claymore' }

            // Generic sword/blade mapping
            if (item.id.includes('sword') || item.id.includes('blade')) {
                return { category: 'weapons', type: 'sword' }
            }

            // Specific axe type mapping
            if (item.id.includes('battleaxe') || item.id.includes('battle_axe')) return { category: 'weapons', type: 'battleaxe' }
            if (item.id.includes('greataxe')) return { category: 'weapons', type: 'greataxe' }
            if (item.id.includes('handaxe')) return { category: 'weapons', type: 'handaxe' }
            if (item.id.includes('hatchet')) return { category: 'weapons', type: 'hatchet' }
            if (item.id.includes('axe')) return { category: 'weapons', type: 'axe' }

            // Specific dagger type mapping
            if (item.id.includes('stiletto')) return { category: 'weapons', type: 'stiletto' }
            if (item.id.includes('dirk')) return { category: 'weapons', type: 'dirk' }
            if (item.id.includes('kris')) return { category: 'weapons', type: 'kris' }
            if (item.id.includes('dagger') || item.id.includes('knife')) {
                return { category: 'weapons', type: 'dagger' }
            }

            // Specific bow type mapping
            if (item.id.includes('longbow')) return { category: 'weapons', type: 'longbow' }
            if (item.id.includes('shortbow')) return { category: 'weapons', type: 'shortbow' }
            if (item.id.includes('crossbow')) return { category: 'weapons', type: 'crossbow' }
            if (item.id.includes('bow')) return { category: 'weapons', type: 'bow' }

            // Magic weapons mapping
            if (item.id.includes('wand')) return { category: 'weapons', type: 'wand' }
            if (item.id.includes('orb')) return { category: 'weapons', type: 'orb' }
            if (item.id.includes('tome')) return { category: 'weapons', type: 'tome' }
            if (item.id.includes('staff') || item.id.includes('rod')) {
                return { category: 'weapons', type: 'staff' }
            }

            // Hammer/mace type mapping
            if (item.id.includes('warhammer')) return { category: 'weapons', type: 'warhammer' }
            if (item.id.includes('maul')) return { category: 'weapons', type: 'maul' }
            if (item.id.includes('flail')) return { category: 'weapons', type: 'flail' }
            if (item.id.includes('morningstar')) return { category: 'weapons', type: 'morningstar' }
            if (item.id.includes('club')) return { category: 'weapons', type: 'club' }
            if (item.id.includes('mace') || item.id.includes('hammer')) {
                return { category: 'weapons', type: 'mace' }
            }

            // Polearm mapping
            if (item.id.includes('halberd')) return { category: 'weapons', type: 'halberd' }
            if (item.id.includes('glaive')) return { category: 'weapons', type: 'glaive' }
            if (item.id.includes('pike')) return { category: 'weapons', type: 'pike' }
            if (item.id.includes('lance')) return { category: 'weapons', type: 'lance' }
            if (item.id.includes('trident')) return { category: 'weapons', type: 'trident' }
            if (item.id.includes('quarterstaff')) return { category: 'weapons', type: 'quarterstaff' }
            if (item.id.includes('spear') || item.id.includes('javelin')) {
                return { category: 'weapons', type: 'spear' }
            }

            // Exotic weapons
            if (item.id.includes('whip')) return { category: 'weapons', type: 'whip' }
            if (item.id.includes('chain')) return { category: 'weapons', type: 'chain' }
            if (item.id.includes('shuriken') || item.id.includes('throwing_star')) return { category: 'weapons', type: 'shuriken' }

            return { category: 'weapons', type: 'sword' } // Default weapon
        }

        // Armor
        if (item.type === 'armor') {
            // Specific armor type mapping
            if (item.id.includes('full_plate')) return { category: 'armor', type: 'full_plate' }
            if (item.id.includes('plate') || item.id.includes('knight')) return { category: 'armor', type: 'plate' }
            if (item.id.includes('splint')) return { category: 'armor', type: 'splint' }
            if (item.id.includes('scale_mail') || item.id.includes('scale')) return { category: 'armor', type: 'scale_mail' }
            if (item.id.includes('chain_mail') || item.id.includes('chain') || item.id.includes('mail')) return { category: 'armor', type: 'chain_mail' }
            if (item.id.includes('breastplate')) return { category: 'armor', type: 'breastplate' }
            if (item.id.includes('studded_leather') || item.id.includes('studded')) return { category: 'armor', type: 'studded_leather' }
            if (item.id.includes('leather')) return { category: 'armor', type: 'leather' }
            if (item.id.includes('padded')) return { category: 'armor', type: 'padded' }
            if (item.id.includes('cloth') || item.id.includes('robes')) return { category: 'armor', type: 'robe' }

            // Specific pieces
            if (item.id.includes('helmet') || item.id.includes('helm')) return { category: 'armor', type: 'helmet' }
            if (item.id.includes('boots') || item.id.includes('greaves')) return { category: 'armor', type: 'boots' }
            if (item.id.includes('gloves') || item.id.includes('gauntlets')) return { category: 'armor', type: 'gloves' }
            if (item.id.includes('cloak') || item.id.includes('cape')) return { category: 'armor', type: 'cloak' }
            if (item.id.includes('shield')) return { category: 'armor', type: 'shield' }

            return { category: 'armor', type: 'leather' } // Default armor
        }

        // Accessories
        if (item.type === 'accessory') {
            if (item.id.includes('ring')) {
                return { category: 'accessories', type: 'ring' }
            }
            if (item.id.includes('amulet') || item.id.includes('pendant')) {
                return { category: 'accessories', type: 'amulet' }
            }
            if (item.id.includes('boots') || item.id.includes('shoes')) {
                return { category: 'accessories', type: 'boots' }
            }
            if (item.id.includes('belt')) {
                return { category: 'accessories', type: 'belt' }
            }
            if (item.id.includes('gloves') || item.id.includes('gauntlets')) {
                return { category: 'accessories', type: 'gloves' }
            }
            return { category: 'accessories', type: 'ring' } // Default accessory
        }

        // Consumables
        if (item.type === 'consumable') {
            if (item.id.includes('potion') || item.id.includes('elixir')) {
                if (item.id.includes('health') || item.id.includes('healing')) {
                    return { category: 'consumables', type: 'health_potion' }
                }
                if (item.id.includes('stamina') || item.id.includes('energy')) {
                    return { category: 'consumables', type: 'stamina_potion' }
                }
                if (item.id.includes('strength')) {
                    return { category: 'consumables', type: 'strength_potion' }
                }
                if (item.id.includes('speed')) {
                    return { category: 'consumables', type: 'speed_potion' }
                }
                if (item.id.includes('magic') || item.id.includes('mana')) {
                    return { category: 'consumables', type: 'mana_potion' }
                }
                if (item.id.includes('invisibility')) {
                    return { category: 'consumables', type: 'invisibility_potion' }
                }
                return { category: 'consumables', type: 'health_potion' } // Default potion
            }
            if (item.id.includes('scroll')) {
                return { category: 'consumables', type: 'scroll' }
            }
            if (item.id.includes('food') || item.id.includes('bread') || item.id.includes('meat') ||
                item.id.includes('cheese') || item.id.includes('apple') || item.id.includes('ration')) {
                return { category: 'consumables', type: 'food' }
            }
            if (item.id.includes('wine') || item.id.includes('ale')) {
                return { category: 'consumables', type: 'ale' }
            }
            return { category: 'consumables', type: 'health_potion' } // Default consumable
        }

        // Materials
        if (item.type === 'material') {
            return { category: 'materials', type: 'generic' }
        }

        // Default fallback
        return { category: 'ui', type: 'default' }
    }

    const mapping = getIconMapping(item)

    // Try to get proper icon from iconMapper
    try {
        return window.iconMapper.createItemIcon(mapping.category, mapping.type, size, className)
    } catch (error) {
        console.warn('Icon mapping failed for', item.name, error)
        // Fallback to emoji if iconMapper fails
        const emojiMap = {
            weapon: '⚔️',
            armor: '🛡️',
            accessory: '💍',
            consumable: '🧪',
            material: '�'
        }
        const emoji = emojiMap[item.type] || '📦'
        return `<span class="item-icon ${className}" style="font-size: ${size}px;" title="${item.name}">${emoji}</span>`
    }
}

// Auto-enhance buttons when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Preload commonly used icons
    iconMapper.preloadIcons(['statusEffects', 'skills', 'ui', 'weapons', 'armor', 'accessories', 'consumables', 'materials'])

    // Initial enchantment
    setTimeout(() => {
        iconMapper.enhanceButtonsWithIcons()
    }, 500)
})
