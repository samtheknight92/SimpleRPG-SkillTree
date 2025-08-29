# 🚀 Deployment Guide - RPG Skill Tree System

## Option 1: GitHub Pages (Recommended - Free)

### Step 1: Prepare Your Repository
1. **Create a GitHub account** (if you don't have one)
2. **Create a new repository**:
   - Go to github.com
   - Click "New repository"
   - Name it: `rpg-skill-tree`
   - Make it Public
   - Don't initialize with README (we'll upload files)

### Step 2: Upload Your Files
1. **Clone the repository locally**:
   ```bash
   git clone https://github.com/yourusername/rpg-skill-tree.git
   cd rpg-skill-tree
   ```

2. **Copy all your project files** into the repository folder:
   - `app.js`
   - `index-new.html` (rename to `index.html`)
   - `styles.css`
   - `skills-data.js`
   - `items-data.js`
   - `races-data.js`
   - `icon-mapping.js`
   - `skill-dynamic-bonuses.js`
   - `inventory-system.js`
   - `character-manager.js`
   - `monster-system.js`
   - `dice-roller-widget.js`
   - `ui-components.js`
   - `icons_renamed_improved/` folder
   - All other project files

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Initial commit - RPG Skill Tree System"
   git push origin main
   ```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch
6. Click **Save**
7. Your site will be available at: `https://yourusername.github.io/rpg-skill-tree`

## Option 2: Netlify (Also Free)

### Step 1: Prepare Your Site
1. **Rename `index-new.html` to `index.html`**
2. **Remove server.js** (not needed for static hosting)
3. **Update any absolute paths** to relative paths

### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag your entire project folder to the deploy area
4. Get instant URL: `https://random-name.netlify.app`

### Step 3: Custom Domain (Optional)
1. In Netlify dashboard, go to **Domain settings**
2. Add custom domain (if you have one)
3. Configure DNS settings

## Option 3: Vercel (Free Tier)

### Step 1: Prepare for Vercel
1. **Create `vercel.json`** in your project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "*.html",
         "use": "@vercel/static"
       }
     ]
   }
   ```

### Step 2: Deploy
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically

## 🔧 **Pre-Deployment Checklist**

### ✅ File Preparation
- [ ] Rename `index-new.html` to `index.html`
- [ ] Remove `server.js` (for static hosting)
- [ ] Remove `package.json` (for static hosting)
- [ ] Ensure all file paths are relative (not absolute)
- [ ] Test locally by opening `index.html` in browser

### ✅ Code Updates Needed
- [ ] Remove any `localhost:3000` references
- [ ] Update any hardcoded URLs
- [ ] Ensure all JavaScript files load correctly
- [ ] Test all features work without server

### ✅ Content Review
- [ ] All images/icons load correctly
- [ ] All JavaScript files are included
- [ ] CSS files are properly linked
- [ ] No broken links or missing resources

## 🌐 **Custom Domain Setup**

### Option 1: Free Domain
- **Freenom.com** - Get free `.tk`, `.ml`, `.ga` domains
- **GitHub Pages** - Use `yourusername.github.io`

### Option 2: Paid Domain
- **Namecheap** - ~$10/year
- **GoDaddy** - ~$12/year
- **Google Domains** - ~$12/year

## 📱 **Mobile Optimization**

### Before Deploying
- [ ] Test on mobile devices
- [ ] Ensure touch controls work
- [ ] Check responsive design
- [ ] Verify hamburger menu works
- [ ] Test dice roller on mobile

## 🔒 **Security Considerations**

### For Public Deployment
- [ ] Remove any sensitive data
- [ ] No API keys in client-side code
- [ ] Use HTTPS (automatic with most hosts)
- [ ] Consider rate limiting for high traffic

## 📊 **Analytics Setup**

### Google Analytics (Free)
1. Create Google Analytics account
2. Add tracking code to `index.html`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🚨 **Common Issues & Solutions**

### Issue: Files not loading
**Solution:** Check file paths are relative, not absolute

### Issue: Icons not showing
**Solution:** Ensure `icons_renamed_improved/` folder is uploaded

### Issue: JavaScript errors
**Solution:** Check browser console, ensure all files are uploaded

### Issue: Mobile not working
**Solution:** Test locally on mobile, check viewport meta tag

## 🎯 **Recommended Deployment Path**

1. **Start with GitHub Pages** (free, easy)
2. **Test thoroughly** on different devices
3. **Get feedback** from users
4. **Upgrade to paid hosting** if needed for more features

## 📈 **Post-Deployment**

### Monitor Your Site
- [ ] Check analytics
- [ ] Monitor for errors
- [ ] Gather user feedback
- [ ] Plan updates and improvements

### Share Your Site
- [ ] Social media
- [ ] Gaming communities
- [ ] RPG forums
- [ ] Discord servers

---

## 🎮 **Quick Start Commands**

```bash
# For GitHub Pages deployment
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/yourusername/rpg-skill-tree.git
git push -u origin main
```

**Your site will be live at:** `https://yourusername.github.io/rpg-skill-tree`
