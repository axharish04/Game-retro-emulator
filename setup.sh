#!/bin/bash

# WebRetro Docker Setup Script
# This script helps you set up and manage your WebRetro emulator

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

print_header() {
    echo "=================================="
    print_color $CYAN "$1"
    echo "=================================="
}

print_step() {
    print_color $BLUE "→ $1"
}

print_success() {
    print_color $GREEN "✓ $1"
}

print_warning() {
    print_color $YELLOW "⚠ $1"
}

print_error() {
    print_color $RED "✗ $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Create directory structure
setup_directories() {
    print_step "Creating directory structure..."
    
    # Create main directories
    mkdir -p roms/{nes,gba,snes,genesis,n64,psx,gbc,nds}
    mkdir -p roms/{atari2600,atari5200,colecovision,intellivision}
    mkdir -p roms/{lynx,ngp,wonderswan,virtualboy,saturn,3do}
    mkdir -p roms/{jaguar,vectrex,odyssey2,channelf,neocd}
    mkdir -p saves
    
    # Create ROM directory README
    cat > roms/README.md << 'EOF'
# ROM Directory Structure

Place your ROM files in the appropriate directories:

## Nintendo Systems
- `nes/` - Nintendo Entertainment System (.nes)
- `snes/` - Super Nintendo (.sfc, .smc)
- `n64/` - Nintendo 64 (.n64, .z64, .v64)
- `gbc/` - Game Boy Color (.gbc, .gb)
- `gba/` - Game Boy Advance (.gba)
- `nds/` - Nintendo DS (.nds)
- `virtualboy/` - Virtual Boy (.vb)

## Sega Systems
- `genesis/` - Sega Genesis/Mega Drive (.md, .gen, .bin)
- `saturn/` - Sega Saturn (.bin/.cue)

## Sony Systems
- `psx/` - PlayStation (.bin/.cue, .pbp)

## Atari Systems
- `atari2600/` - Atari 2600 (.a26, .bin)
- `atari5200/` - Atari 5200 (.a52, .bin)
- `lynx/` - Atari Lynx (.lnx)
- `jaguar/` - Atari Jaguar (.j64, .jag)

## Other Systems
- `colecovision/` - ColecoVision (.col)
- `intellivision/` - Intellivision (.int)
- `ngp/` - Neo Geo Pocket (.ngp, .ngc)
- `wonderswan/` - WonderSwan (.ws, .wsc)
- `3do/` - 3DO (.iso, .bin/.cue)
- `vectrex/` - Vectrex (.vec, .bin)
- `odyssey2/` - Odyssey 2 (.bin)
- `channelf/` - Channel F (.bin)
- `neocd/` - Neo Geo CD (.bin/.cue)

## Usage
1. Place ROM files in the appropriate system folder
2. Restart the WebRetro container
3. Access the emulator at http://localhost:8000
4. Select your system and ROM to start playing!

## File Management
- Use the file browser at http://localhost:8080 for easy ROM management
- Default credentials: admin/admin (change after first login!)
EOF
    
    print_success "Directory structure created"
}

# Build and start the containers
start_containers() {
    print_step "Building and starting containers..."
    
    # Build the Docker image
    docker-compose build
    
    # Start the containers
    docker-compose up -d
    
    print_success "Containers started successfully"
}

# Stop containers
stop_containers() {
    print_step "Stopping containers..."
    docker-compose down
    print_success "Containers stopped"
}

# Show logs
show_logs() {
    print_step "Showing container logs..."
    docker-compose logs -f
}

# Show status
show_status() {
    print_header "Container Status"
    docker-compose ps
    
    echo ""
    print_header "Service URLs"
    print_color $GREEN "🎮 WebRetro Emulator: http://localhost:8000"
    print_color $BLUE "📁 File Browser: http://localhost:8080"
    print_color $YELLOW "📊 Health Check: http://localhost:8000/health"
    print_color $PURPLE "🎯 Available Systems: http://localhost:8000/api/systems"
    print_color $CYAN "📂 Available ROMs: http://localhost:8000/api/roms"
}

# Update containers
update_containers() {
    print_step "Updating containers..."
    docker-compose pull
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Containers updated"
}

# Clean up
cleanup() {
    print_step "Cleaning up..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Main menu
show_menu() {
    print_header "WebRetro Docker Manager"
    echo "1. Setup and start emulator"
    echo "2. Stop emulator"
    echo "3. Show status"
    echo "4. Show logs"
    echo "5. Update containers"
    echo "6. Cleanup"
    echo "7. Exit"
    echo ""
    read -p "Choose an option [1-7]: " choice
    
    case $choice in
        1)
            check_docker
            setup_directories
            start_containers
            show_status
            ;;
        2)
            stop_containers
            ;;
        3)
            show_status
            ;;
        4)
            show_logs
            ;;
        5)
            update_containers
            show_status
            ;;
        6)
            cleanup
            ;;
        7)
            print_success "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please try again."
            show_menu
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        setup)
            check_docker
            setup_directories
            start_containers
            show_status
            ;;
        start)
            start_containers
            show_status
            ;;
        stop)
            stop_containers
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        update)
            update_containers
            show_status
            ;;
        cleanup)
            cleanup
            ;;
        *)
            echo "Usage: $0 {setup|start|stop|status|logs|update|cleanup}"
            exit 1
            ;;
    esac
fi
