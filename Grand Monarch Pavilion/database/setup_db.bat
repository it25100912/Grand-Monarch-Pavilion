@echo off
echo ====================================================================
echo  Setting up MySQL Database: restaurant_event_db
echo ====================================================================

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "source schema.sql"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Database schema and initial seed data created successfully!
) else (
    echo [ERROR] Failed to execute schema.sql. Check MySQL service status and credentials.
)
pause
