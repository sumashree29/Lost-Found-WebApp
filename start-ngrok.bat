@echo off
echo ===============================================
echo   CAMPUS LOST & FOUND - MOBILE ACCESS SETUP
echo ===============================================
echo.
echo Starting ngrok tunnel for mobile access...
echo This will create a secure public URL for your app.
echo.
echo After ngrok starts:
echo 1. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
echo 2. Open that URL on your mobile device
echo 3. Scan QR codes will also work with this URL
echo.
echo Press Ctrl+C to stop ngrok when done.
echo.
pause
ngrok http 5173
