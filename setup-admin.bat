@echo off
echo ========================================
echo   Automytee Admin Panel Setup
echo ========================================
echo.

if exist .env.local (
    echo .env.local already exists!
    echo.
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        pause
        exit /b
    )
)

echo Creating .env.local file...
echo.

set /p mongodb_uri="Enter your MongoDB connection string: "

echo # MongoDB Connection String > .env.local
echo MONGODB_URI=%mongodb_uri% >> .env.local

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo .env.local file has been created.
echo.
echo Next steps:
echo 1. Run: npm install (if not done already)
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000/admin
echo.
echo For detailed setup instructions, see ADMIN_SETUP.md
echo.
pause
