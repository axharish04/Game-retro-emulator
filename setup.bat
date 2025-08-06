@echo off
REM WebRetro Docker Setup Script for Windows
REM This script helps you set up and manage your WebRetro emulator on Windows

setlocal enabledelayedexpansion

echo ===================================
echo     WebRetro Docker Manager
echo ===================================

REM Check if Docker is installed
where docker >nul 2>nul
if errorlevel 1 (
    echo Error: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if errorlevel 1 (
    echo Error: Docker Compose is not available. Please ensure Docker Desktop is running.
    pause
    exit /b 1
)

echo Docker and Docker Compose are available.

:menu
echo.
echo ===================================
echo    WebRetro Docker Manager
echo ===================================
echo 1. Setup and start emulator
echo 2. Stop emulator
echo 3. Show status
echo 4. Show logs
echo 5. Update containers
echo 6. Cleanup
echo 7. Open emulator in browser
echo 8. Open file manager in browser
echo 9. Exit
echo.

set /p choice="Choose an option [1-9]: "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto status
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto update
if "%choice%"=="6" goto cleanup
if "%choice%"=="7" goto open_emulator
if "%choice%"=="8" goto open_filemanager
if "%choice%"=="9" goto exit
echo Invalid option. Please try again.
goto menu

:setup
echo Setting up directory structure...

REM Create ROM directories
mkdir roms\nes 2>nul
mkdir roms\gba 2>nul
mkdir roms\snes 2>nul
mkdir roms\genesis 2>nul
mkdir roms\n64 2>nul
mkdir roms\psx 2>nul
mkdir roms\gbc 2>nul
mkdir roms\nds 2>nul
mkdir roms\atari2600 2>nul
mkdir roms\atari5200 2>nul
mkdir roms\colecovision 2>nul
mkdir roms\intellivision 2>nul
mkdir roms\lynx 2>nul
mkdir roms\ngp 2>nul
mkdir roms\wonderswan 2>nul
mkdir roms\virtualboy 2>nul
mkdir roms\saturn 2>nul
mkdir roms\3do 2>nul
mkdir roms\jaguar 2>nul
mkdir roms\vectrex 2>nul
mkdir roms\odyssey2 2>nul
mkdir roms\channelf 2>nul
mkdir roms\neocd 2>nul
mkdir saves 2>nul

echo Directory structure created.

REM Create README for ROMs
echo # ROM Directory Structure > roms\README.md
echo. >> roms\README.md
echo Place your ROM files in the appropriate directories: >> roms\README.md
echo. >> roms\README.md
echo ## Nintendo Systems >> roms\README.md
echo - nes/        - Nintendo Entertainment System (.nes) >> roms\README.md
echo - snes/       - Super Nintendo (.sfc, .smc) >> roms\README.md
echo - n64/        - Nintendo 64 (.n64, .z64, .v64) >> roms\README.md
echo - gbc/        - Game Boy Color (.gbc, .gb) >> roms\README.md
echo - gba/        - Game Boy Advance (.gba) >> roms\README.md
echo - nds/        - Nintendo DS (.nds) >> roms\README.md
echo - virtualboy/ - Virtual Boy (.vb) >> roms\README.md
echo. >> roms\README.md
echo ## Sega Systems >> roms\README.md
echo - genesis/    - Sega Genesis/Mega Drive (.md, .gen, .bin) >> roms\README.md
echo - saturn/     - Sega Saturn (.bin/.cue) >> roms\README.md
echo. >> roms\README.md
echo ## Sony Systems >> roms\README.md
echo - psx/        - PlayStation (.bin/.cue, .pbp) >> roms\README.md
echo. >> roms\README.md
echo ## Usage >> roms\README.md
echo 1. Place ROM files in the appropriate system folder >> roms\README.md
echo 2. Restart the WebRetro container >> roms\README.md
echo 3. Access the emulator at http://localhost:8000 >> roms\README.md
echo 4. Select your system and ROM to start playing! >> roms\README.md

echo Building and starting containers...
docker-compose build
docker-compose up -d

echo.
echo ✓ Setup completed successfully!
echo.
echo Service URLs:
echo 🎮 WebRetro Emulator: http://localhost:8000
echo 📁 File Browser: http://localhost:8080
echo 📊 Health Check: http://localhost:8000/health
echo.
pause
goto menu

:stop
echo Stopping containers...
docker-compose down
echo ✓ Containers stopped
pause
goto menu

:status
echo Container Status:
docker-compose ps
echo.
echo Service URLs:
echo 🎮 WebRetro Emulator: http://localhost:8000
echo 📁 File Browser: http://localhost:8080
echo 📊 Health Check: http://localhost:8000/health
echo 🎯 Available Systems: http://localhost:8000/api/systems
echo 📂 Available ROMs: http://localhost:8000/api/roms
pause
goto menu

:logs
echo Showing container logs...
docker-compose logs -f
goto menu

:update
echo Updating containers...
docker-compose pull
docker-compose build --no-cache
docker-compose up -d
echo ✓ Containers updated
pause
goto menu

:cleanup
echo Cleaning up...
docker-compose down -v
docker system prune -f
echo ✓ Cleanup completed
pause
goto menu

:open_emulator
echo Opening WebRetro emulator in default browser...
start http://localhost:8000
goto menu

:open_filemanager
echo Opening file manager in default browser...
start http://localhost:8080
echo Default credentials: admin/admin
echo Please change the password after first login!
goto menu

:exit
echo Goodbye!
exit /b 0
