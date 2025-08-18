Write-Host "====================================" -ForegroundColor Cyan
Write-Host " Lost & Found App Deployment Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "[OK] Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Building the application..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "[OK] Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .

Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Lost & Found App ready for deployment"

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host " BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your app is now ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub.com" -ForegroundColor White
Write-Host "2. Copy and run the following commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Enable GitHub Pages in your repository settings" -ForegroundColor White
Write-Host "4. Select 'GitHub Actions' as the source" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT_GUIDE.md for detailed instructions." -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to continue"
