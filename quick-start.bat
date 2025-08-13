@echo off
echo 🐺 Wolf Edu Store Dashboard - Quick Start
echo ========================================
echo.

echo 📦 Installing dependencies...
npm install

echo.
echo 🔐 Creating environment file...
if not exist .env.local (
    copy env.example .env.local
    echo ✅ Environment file created from template
    echo ⚠️  Please edit .env.local with your actual values
) else (
    echo ℹ️  Environment file already exists
)

echo.
echo 🗄️  Initializing database...
npm run db:init

echo.
echo 🚀 Starting development server...
echo 📱 Visit: http://localhost:3000
echo 🔑 Login: admin / admin123
echo.
npm run dev
