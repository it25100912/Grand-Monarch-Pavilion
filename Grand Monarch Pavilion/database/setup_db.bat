@echo off
setlocal enabledelayedexpansion
echo ====================================================================
echo  Setting up MySQL Database: restaurant_event_db
echo ====================================================================

set "MYSQL_CMD="
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 set "MYSQL_CMD=mysql"

if not defined MYSQL_CMD (
    if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
        set "MYSQL_CMD=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    )
)
if not defined MYSQL_CMD (
    if exist "C:\Program Files\MySQL\MySQL Workbench 8.0\mysql.exe" (
        set "MYSQL_CMD=C:\Program Files\MySQL\MySQL Workbench 8.0\mysql.exe"
    )
)

if not defined MYSQL_CMD (
    echo [ERROR] mysql.exe not found in PATH or standard MySQL directories.
    pause
    exit /b 1
)

echo [INFO] Running schema.sql ...
"!MYSQL_CMD!" -u root -proot --default-character-set=utf8mb4 -e "source schema.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to execute schema.sql.
    pause
    exit /b 1
)

echo [INFO] Running seed.sql ...
"!MYSQL_CMD!" -u root -proot --default-character-set=utf8mb4 -e "source seed.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to execute seed.sql.
    pause
    exit /b 1
)

echo ====================================================================
echo  [SUCCESS] Database schema and comprehensive sample data loaded!
echo ====================================================================
pause
