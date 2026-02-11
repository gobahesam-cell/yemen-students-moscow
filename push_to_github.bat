@echo off
echo Initializing Git...
git init
if %errorlevel% neq 0 (
    echo Error initializing Git. Please install Git: https://git-scm.com/downloads
    pause
    exit /b
)

echo Adding files...
git add .

echo Committing files...
git commit -m "First commit for Yemen Students Moscow project"

echo Renaming branch to main...
git branch -M main

echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/gobahesam-cell/yemen-students-moscow.git

echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo Successfully pushed to GitHub!
) else (
    echo Error pushing to GitHub. Please check your internet connection and GitHub credentials.
)
pause
