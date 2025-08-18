@echo off
echo ====================================
echo  Lost & Found App Deployment Script
echo ====================================
echo.

echo Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/downloads
    echo Then run this script again.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

echo Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [OK] Build completed successfully
echo.

echo Initializing Git repository...
git init

echo Adding files to Git...
git add .

echo Creating initial commit...
git commit -m "Initial commit - Lost & Found App ready for deployment"

echo.
echo ====================================
echo  BUILD SUCCESSFUL!
echo ====================================
echo.
echo Your app is now ready for deployment!
echo.
echo NEXT STEPS:
echo 1. Create a new repository on GitHub.com
echo 2. Copy and run the following commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Enable GitHub Pages in your repository settings
echo 4. Select "GitHub Actions" as the source
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions.
echo.
pause
