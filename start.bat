@echo off
echo 🚀 Starting TNP Portal Development Environment
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "client\node_modules" (
    echo 📦 Installing client dependencies...
    cd client
    npm install
    cd ..
)

if not exist "server\node_modules" (
    echo 📦 Installing server dependencies...
    cd server
    npm install
    cd ..
)

REM Seed the database with sample data
echo 🌱 Seeding database with sample data...
cd server
npm run seed
cd ..

echo.
echo ✅ Setup complete! Starting development servers...
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo 📝 Sample login credentials:
echo    Admin: john@example.com / password123
echo    User:  jane@example.com / password123
echo.

REM Start the development servers
npm run dev
