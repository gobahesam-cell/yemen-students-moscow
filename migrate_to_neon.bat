@echo off
set "NEON_URL=postgresql://neondb_owner:npg_Zy7ILhYEbQV9@ep-long-fog-ai537dzn-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"

echo Connecting to Neon and pushing full database schema...
echo (This will ensure ALL tables like courses, events, and quizzes are created)
echo.

set "DATABASE_URL=%NEON_URL%"
npx prisma db push --accept-data-loss

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Full database schema pushed to Neon successfully!
    echo.
    echo Would you like to seed the database with initial data? (y/n)
    set /p choice=
    if /i "%choice%"=="y" (
        echo Seeding database...
        npx prisma db seed
    )
) else (
    echo.
    echo [ERROR] Failed to push schema. Please check your internet connection or the URL.
)

pause
