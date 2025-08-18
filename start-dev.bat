@echo off
echo ====================================
echo  Lost & Found App - Mobile Ready
echo ====================================
echo.
echo Starting development server with mobile access...
echo.
echo Your app will be available at:
echo   - Local:   http://localhost:5173
echo   - Network: http://YOUR_IP:5173
echo.
echo The QR code will now work on mobile devices!
echo Press Ctrl+C to stop the server when you're done.
echo.
npm run dev:mobile
pause
