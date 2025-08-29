@echo off
echo ========================================
echo RPG Skill Tree - Deployment Preparation
echo ========================================
echo.

echo [1/4] Checking files...
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please ensure index-new.html has been renamed to index.html
    pause
    exit /b 1
)

if not exist "app.js" (
    echo ERROR: app.js not found!
    pause
    exit /b 1
)

if not exist "styles.css" (
    echo ERROR: styles.css not found!
    pause
    exit /b 1
)

echo ✓ All required files found
echo.

echo [2/4] Creating deployment folder...
if not exist "deploy" mkdir deploy
echo ✓ Deployment folder created
echo.

echo [3/4] Copying files to deployment folder...
xcopy /E /I /Y "*.js" "deploy\"
xcopy /E /I /Y "*.css" "deploy\"
xcopy /E /I /Y "*.html" "deploy\"
xcopy /E /I /Y "*.md" "deploy\"
xcopy /E /I /Y "icons_renamed_improved" "deploy\icons_renamed_improved\"
echo ✓ Files copied to deploy folder
echo.

echo [4/4] Deployment preparation complete!
echo.
echo Next steps:
echo 1. Go to github.com and create a new repository
echo 2. Upload the contents of the 'deploy' folder
echo 3. Enable GitHub Pages in repository settings
echo 4. Your site will be live at: https://yourusername.github.io/repository-name
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
