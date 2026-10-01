@echo off
setlocal enabledelayedexpansion
echo ====================================================================
echo  Grand Monarch Pavilion - Spring Boot Backend (SE2030)
echo  Group: 2026-Y2-S1-MLB-B3G2-09
echo  Architecture: entity, controller, dto, repository, service
echo ====================================================================
echo.

set "MVN_CMD="

rem 1. Check if mvn is on PATH
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "MVN_CMD=mvn"
)

rem 2. Check IntelliJ IDEA Maven installation
if not defined MVN_CMD (
    if exist "D:\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd" (
        set "MVN_CMD=D:\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd"
    )
)
if not defined MVN_CMD (
    if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3\plugins\maven\lib\maven3\bin\mvn.cmd" (
        set "MVN_CMD=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3\plugins\maven\lib\maven3\bin\mvn.cmd"
    )
)

rem 3. Search other JetBrains IDEA paths if available
if not defined MVN_CMD (
    for /d %%d in ("D:\IntelliJ IDEA*") do (
        if exist "%%d\plugins\maven\lib\maven3\bin\mvn.cmd" (
            set "MVN_CMD=%%d\plugins\maven\lib\maven3\bin\mvn.cmd"
        )
    )
)
if not defined MVN_CMD (
    for /d %%d in ("C:\Program Files\JetBrains\IntelliJ IDEA*") do (
        if exist "%%d\plugins\maven\lib\maven3\bin\mvn.cmd" (
            set "MVN_CMD=%%d\plugins\maven\lib\maven3\bin\mvn.cmd"
        )
    )
)

if not defined MVN_CMD (
    echo [ERROR] Maven not detected in PATH or IntelliJ directory.
    echo Please ensure Maven is installed or run through IntelliJ IDEA.
    pause
    exit /b 1
)

echo [OK] Using Maven: "!MVN_CMD!"
echo Starting Spring Boot Application on http://localhost:8080 ...
echo.

"!MVN_CMD!" spring-boot:run
pause
