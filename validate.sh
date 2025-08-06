#!/bin/bash

# WebRetro Docker Validation Script
# This script validates the Docker setup without starting the full containers

set -e

echo "🧪 WebRetro Docker Validation"
echo "=================================="

# Check Docker
echo "✓ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✓ Docker: $(docker --version)"

# Check Docker Compose
echo "✓ Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✓ Docker Compose: $(docker-compose --version)"

# Validate Dockerfile
echo "✓ Validating Dockerfile..."
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found"
    exit 1
fi
echo "✓ Dockerfile exists"

# Validate docker-compose.yml
echo "✓ Validating docker-compose.yml..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found"
    exit 1
fi

# Test docker-compose config
docker-compose config > /dev/null
echo "✓ docker-compose.yml is valid"

# Check WebRetro directory
echo "✓ Checking WebRetro files..."
if [ ! -d "webretro" ]; then
    echo "❌ webretro directory not found"
    exit 1
fi

if [ ! -f "webretro/index.html" ]; then
    echo "❌ webretro/index.html not found"
    exit 1
fi

if [ ! -d "webretro/cores" ]; then
    echo "❌ webretro/cores directory not found"
    exit 1
fi

echo "✓ WebRetro files are present"

# Check server.js
echo "✓ Checking server configuration..."
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found"
    exit 1
fi
echo "✓ server.js exists"

# Test Node.js syntax
echo "✓ Validating Node.js syntax..."
node -c server.js
echo "✓ server.js syntax is valid"

echo ""
echo "🎉 All validations passed!"
echo ""
echo "Your WebRetro Docker setup is ready!"
echo ""
echo "Next steps:"
echo "1. Run: docker-compose up -d --build"
echo "2. Wait for containers to start"
echo "3. Open: http://localhost:8000"
echo "4. Add ROMs to the roms/ directory"
echo ""
echo "Or use the setup script:"
echo "- Linux/Mac: ./setup.sh setup"
echo "- Windows: setup.bat (choose option 1)"
