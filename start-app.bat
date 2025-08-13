@echo off
echo 🐺 Wolf Edu Store Dashboard - Starting...
echo ========================================
echo.

cd /d "%~dp0"
echo 📁 Current directory: %CD%
echo.

echo 🚀 Starting development server...
echo 📱 Your app will be available at: http://localhost:3000
echo 🔑 Login: admin / admin123
echo.
echo ⚠️  Keep this window open while using the app
echo ⚠️  Press Ctrl+C to stop the server
echo.

npm run dev

pause
