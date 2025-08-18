@echo off
echo ===============================================
echo   CAMPUS LOST AND FOUND - PRODUCTION SERVER
echo ===============================================
echo.
echo Starting production server...
echo This serves the built version of your app.
echo.
echo URLs:
echo Local:   http://localhost:8080/
echo Network: http://192.168.1.33:8080/
echo.
echo Press Ctrl+C to stop the server.
echo.
cd dist
npx http-server -p 8080 -a 0.0.0.0
