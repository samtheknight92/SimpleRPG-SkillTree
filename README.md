# 🎮 RPG Skill Tree System

A comprehensive web-based RPG character builder and skill tree system with dynamic loot, toggle skills, crafting, inventory management, and advanced skill bonuses.

## ✨ Features

- **Character Creation & Management** - Create, save, and manage multiple characters with advanced stat progression
- **Dynamic Skill Trees** - Multiple skill categories with upgrade paths and prerequisites (Tiers 0-5)
- **Toggle Skill System** - Stamina-based skills with activation and maintenance costs
- **Dynamic Monster Loot System** - Loot generation based on monster level and skills with thematic matching
- **Tiered Pricing System** - Balanced lumen economy with progressive costs for stats and skills
- **Crafting System** - Craft items with material requirements and skill prerequisites
- **Inventory Management** - Equip items, manage stats, and track equipment
- **Dice Rolling Widget** - Built-in dice roller for tabletop gaming
- **Monster System** - Create and manage monster encounters with dynamic scaling
- **Responsive Design** - Works on desktop and mobile devices
- **Local Storage** - Save progress locally in your browser

## 🚀 Live Demo

[Coming Soon - Deploy to GitHub Pages]

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Custom icon system with PNG assets
- **Storage**: Local Storage API
- **Deployment**: Static hosting (GitHub Pages, Netlify, etc.)

## 📁 Project Structure

```
rpg-skill-tree/
├── index.html                           # Main application interface
├── app.js                               # Main application controller
├── styles.css                           # Main stylesheet
├── skills-data.js                       # Skill definitions and data (Tiers 0-5)
├── items-data.js                        # Item definitions and crafting data
├── races-data.js                        # Race definitions and bonuses
├── icon-mapping.js                      # Icon system management
├── skill-dynamic-bonuses.js             # Dynamic skill bonus parsing
├── inventory-system.js                  # Inventory and equipment management
├── character-manager.js                 # Character creation and management
├── monster-system.js                    # Monster creation and encounters
├── monster-loot-system.js               # Dynamic loot generation system
├── toggle-skill-system.js               # Toggle skill management
├── game-logic.js                        # Game rules and stat calculations
├── dice-roller-widget.js                # Dice rolling functionality
├── ui-components.js                     # Reusable UI components
├── icons_renamed_improved/              # Icon assets (5800+ icons)
├── COMPREHENSIVE_SYSTEM_DOCUMENTATION.txt # Complete system documentation
└── README.md                           # This file
```

## 🎯 Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/rpg-skill-tree.git
   cd rpg-skill-tree
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000`

3. **Start creating characters and exploring skills!**

### Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🎮 How to Use

### Creating a Character
1. Click "New Character" button
2. Choose a race and name
3. Allocate starting stats (150 Lumens, 65 Gil)
4. Save your character

### Skill System (Tiers 0-5)
1. Navigate through skill categories (Weapons, Magic, Professions, Racial)
2. Click on skills to see descriptions, requirements, and costs
3. Unlock skills by meeting prerequisites and paying lumen costs
4. Skills provide automatic stat bonuses and special abilities

### Toggle Skills
1. Toggle skills require stamina to activate and maintain
2. Click to activate (pays activation cost)
3. Each turn consumes maintenance cost
4. Skills deactivate if insufficient stamina

### Dynamic Loot System
1. Monster loot is generated based on level and skills
2. Higher level monsters drop better items
3. Skill-themed monsters drop relevant equipment
4. Lumen rewards scale with monster level and player count

### Stat Progression
1. Purchase stat upgrades with lumens
2. Different stats have different cost tiers:
   - **Tier 1 (High Impact)**: Accuracy, Speed (Max 400L)
   - **Tier 2 (Medium Impact)**: Strength, Magic Power (Max 300L)
   - **Tier 3 (Low Impact)**: Physical Defence, Magical Defence (Max 200L)
3. Equipment can boost stats beyond lumen-purchased limits

### Crafting System
1. Access the crafting interface
2. Browse craftable items
3. Ensure you have required materials and skills
4. Craft items to add to your inventory

### Inventory Management
1. Open inventory panel
2. Equip/unequip items
3. View stat modifications
4. Items automatically apply bonuses

## 💰 Lumen Economy

### Skill Costs (Tiered Pricing)
- **Tier 0**: 3 Lumens (weapon basics and core proficiencies)
- **Tier 1**: 8 Lumens (basic combat skills)
- **Tier 2**: 15 Lumens (intermediate combat skills)
- **Tier 3**: 25 Lumens (advanced combat skills)
- **Tier 4**: 35 Lumens (expert-level skills)
- **Tier 5**: 50 Lumens (master-level skills)

### Stat Upgrade Costs
- **HP/Stamina**: Flat costs (3L/5L per upgrade)
- **Combat Stats**: Progressive costs based on tier and upgrade level
- **Maximum Costs**: Capped to prevent excessive grinding

### Lumen Rewards
- **Shared Rewards**: Lumen drops are shared among all players
- **Scaling**: Rewards increase with monster level and player count
- **Progression**: Balanced to allow meaningful character development

## 🔧 Customization

### Adding New Skills
Edit `skills-data.js` to add new skills:
```javascript
new_skill: {
    id: "new_skill",
    name: "New Skill",
    tier: 2,
    cost: 15,
    desc: "Skill description with +5 Strength bonus",
    category: "weapons",
    subcategory: "swords",
    prerequisites: { type: 'AND', skills: ['basic_sword_mastery'] }
}
```

### Adding Toggle Skills
Add to `toggle-skill-system.js`:
```javascript
new_toggle_skill: {
    name: "New Toggle Skill",
    activationCost: 2,
    maintenanceCost: 2,
    description: "Toggle: Skill description. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
}
```

### Adding New Items
Edit `items-data.js` to add new items:
```javascript
new_item: {
    id: "new_item",
    name: "New Item",
    type: "weapon",
    craftableItem: true,
    craftingMaterials: [
        { id: "material1", quantity: 2 }
    ],
    statModifiers: { strength: 3 },
    desc: "A powerful weapon. +3 Strength"
}
```

## 🐛 Troubleshooting

### Common Issues

**Icons not showing**: Ensure the `icons_renamed_improved/` folder is included in deployment

**Skills not loading**: Check browser console for JavaScript errors

**Data not saving**: Ensure Local Storage is enabled in your browser

**Toggle skills not working**: Check stamina costs and incompatible skill conflicts

**Loot not generating**: Verify monster level calculation and skill assignments

**Mobile issues**: Test on different devices and screen sizes

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icon assets from various open-source icon packs
- Inspired by tabletop RPG systems
- Built for the gaming community

## 📞 Support

If you encounter any issues or have questions:
1. Check the [SYSTEM_CHECKLIST.md](SYSTEM_CHECKLIST.md) for troubleshooting
2. Review the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment help
3. Consult [COMPREHENSIVE_SYSTEM_DOCUMENTATION.txt](COMPREHENSIVE_SYSTEM_DOCUMENTATION.txt) for detailed system information
4. Open an issue on GitHub

---

**Happy Gaming! 🎲⚔️🛡️**