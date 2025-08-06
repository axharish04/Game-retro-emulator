@echo off
REM WebRetro Docker Validation Script for Windows
REM This script validates the Docker setup without starting the full containers

echo 🧪 WebRetro Docker Validation
echo ==================================

REM Check Docker
echo ✓ Checking Docker...
where docker >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('docker --version') do set DOCKER_VERSION=%%a
echo ✓ Docker: %DOCKER_VERSION%

REM Check Docker Compose
echo ✓ Checking Docker Compose...
where docker-compose >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker Compose is not available
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('docker-compose --version') do set COMPOSE_VERSION=%%a
echo ✓ Docker Compose: %COMPOSE_VERSION%

REM Validate Dockerfile
echo ✓ Validating Dockerfile...
if not exist "Dockerfile" (
    echo ❌ Dockerfile not found
    pause
    exit /b 1
)
echo ✓ Dockerfile exists

REM Validate docker-compose.yml
echo ✓ Validating docker-compose.yml...
if not exist "docker-compose.yml" (
    echo ❌ docker-compose.yml not found
    pause
    exit /b 1
)

REM Test docker-compose config
docker-compose config >nul 2>nul
if errorlevel 1 (
    echo ❌ docker-compose.yml is invalid
    pause
    exit /b 1
)
echo ✓ docker-compose.yml is valid

REM Check WebRetro directory
echo ✓ Checking WebRetro files...
if not exist "webretro" (
    echo ❌ webretro directory not found
    pause
    exit /b 1
)

if not exist "webretro\index.html" (
    echo ❌ webretro\index.html not found
    pause
    exit /b 1
)

if not exist "webretro\cores" (
    echo ❌ webretro\cores directory not found
    pause
    exit /b 1
)

echo ✓ WebRetro files are present

REM Check server.js
echo ✓ Checking server configuration...
if not exist "server.js" (
    echo ❌ server.js not found
    pause
    exit /b 1
)
echo ✓ server.js exists

REM Test Node.js syntax (if Node.js is available)
where node >nul 2>nul
if not errorlevel 1 (
    echo ✓ Validating Node.js syntax...
    node -c server.js
    if errorlevel 1 (
        echo ❌ server.js has syntax errors
        pause
        exit /b 1
    )
    echo ✓ server.js syntax is valid
) else (
    echo ⚠ Node.js not found locally (will be provided by Docker)
)

echo.
echo 🎉 All validations passed!
echo.
echo Your WebRetro Docker setup is ready!
echo.
echo Next steps:
echo 1. Run: docker-compose up -d --build
echo 2. Wait for containers to start
echo 3. Open: http://localhost:8000
echo 4. Add ROMs to the roms\ directory
echo.
echo Or use the setup script:
echo - Run: setup.bat (choose option 1)
echo.
pause
