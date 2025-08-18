@echo off
echo ====================================
echo  Lost & Found App - Mobile Setup
echo ====================================
echo.

echo Finding your network IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4 Address"') do (
    for /f "tokens=1 delims= " %%b in ("%%a") do (
        set "IP=%%b"
        if not "%%b"=="127.0.0.1" (
            echo Found IP: %%b
        )
    )
)

echo.
echo Your app will be available at:
echo   - Local:   http://localhost:5173
echo   - Network: http://%IP%:5173
echo.
echo ================================
echo  MOBILE INSTRUCTIONS:
echo ================================
echo 1. Make sure your phone is on the same WiFi
echo 2. The QR code will use your network IP
echo 3. If Windows Firewall prompts, click "Allow access"
echo 4. Scan QR code or manually enter the network URL
echo.
echo Starting server with mobile access...
echo Press Ctrl+C to stop when done.
echo.

npm run dev:mobile
