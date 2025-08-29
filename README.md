# 🎮 RPG Skill Tree System

A comprehensive web-based RPG character builder and skill tree system with crafting, inventory management, and dynamic skill bonuses.

## ✨ Features

- **Character Creation & Management** - Create, save, and manage multiple characters
- **Dynamic Skill Trees** - Multiple skill categories with upgrade paths and prerequisites
- **Crafting System** - Craft items with material requirements and skill prerequisites
- **Inventory Management** - Equip items, manage stats, and track equipment
- **Dice Rolling Widget** - Built-in dice roller for tabletop gaming
- **Monster System** - Create and manage monster encounters
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
├── index.html              # Main application interface
├── app.js                  # Main application controller
├── styles.css              # Main stylesheet
├── skills-data.js          # Skill definitions and data
├── items-data.js           # Item definitions and crafting data
├── races-data.js           # Race definitions and bonuses
├── icon-mapping.js         # Icon system management
├── skill-dynamic-bonuses.js # Dynamic skill bonus parsing
├── inventory-system.js     # Inventory and equipment management
├── character-manager.js    # Character creation and management
├── monster-system.js       # Monster creation and encounters
├── dice-roller-widget.js   # Dice rolling functionality
├── ui-components.js        # Reusable UI components
├── icons_renamed_improved/ # Icon assets (5800+ icons)
└── README.md              # This file
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
3. Allocate starting stats
4. Save your character

### Skill System
1. Navigate through skill categories (Weapons, Professions, etc.)
2. Click on skills to see descriptions and requirements
3. Unlock skills by meeting prerequisites
4. Skills provide automatic stat bonuses

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

## 🔧 Customization

### Adding New Skills
Edit `skills-data.js` to add new skills:
```javascript
new_skill: {
    id: "new_skill",
    name: "New Skill",
    desc: "Skill description with +5 Strength bonus",
    category: "weapons",
    subcategory: "swords",
    requirements: ["basic_sword_mastery"],
    upgrade: "advanced_skill"
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
3. Open an issue on GitHub

---

**Happy Gaming! 🎲⚔️🛡️**