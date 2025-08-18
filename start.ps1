Write-Host "Starting Campus Lost & Found App..." -ForegroundColor Green
Write-Host "Directory: $PWD" -ForegroundColor Yellow
Write-Host "Server will be available at: http://localhost:5173/" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the lost-found-app directory" -ForegroundColor Red
    exit 1
}

# Start the development server
Write-Host "Starting Vite development server..." -ForegroundColor Green
npm run dev 