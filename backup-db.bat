@echo off
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set filename=backup_%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,4%.sql
echo Creating backup: %filename% ...
docker exec ysm_db pg_dump -U ysm -d ysm_db > %filename%
if %errorlevel% equ 0 (
    echo Backup created successfully: %filename%
) else (
    echo Error creating backup!
)
pause
