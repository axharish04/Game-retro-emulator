# GameServ2 - Enhanced WebRetro Docker Platform 

##  LEGAL NOTICE - READ FIRST

**This project contains NO copyrighted ROMs or BIOS files. You must provide your own legally obtained content.**

### ⚖ Legal Requirements:
- **Own Physical Copies**: You must own the original cartridge/disc
- **Personal Backups Only**: ROMs must be your own backups
- **Follow Local Laws**: Copyright laws vary by jurisdiction
- **No Distribution**: Do not share copyrighted ROMs

**See [LEGAL_USAGE.md](LEGAL_USAGE.md) for complete legal guidelines**

---

A fully containerized retro gaming experience using WebRetro emulator with Docker. Play classic games from multiple consoles directly in your web browser!

##  Features

- **Multi-System Support**: Play games from 20+ retro consoles
- **Web-Based**: No installation required, runs in any modern browser
- **Docker Containerized**: Easy deployment and management
- **File Management**: Built-in web file browser for ROM management
- **Save States**: Persistent game saves and state management
- **API Endpoints**: REST API for ROM and system information
- **Health Monitoring**: Built-in health checks and monitoring

## Supported Systems

| System | Core | File Extensions |
|--------|------|----------------|
| Nintendo Entertainment System | nestopia_libretro | .nes |
| Game Boy Advance | mgba_libretro | .gba |
| Super Nintendo | snes9x_libretro | .sfc, .smc |
| Sega Genesis/Mega Drive | genesis_plus_gx_libretro | .md, .gen, .bin |
| Nintendo 64 | mupen64plus_next_libretro | .n64, .z64, .v64 |
| Sony PlayStation | mednafen_psx_hw_libretro | .bin/.cue, .pbp |
| Game Boy Color | mgba_libretro | .gbc, .gb |
| Nintendo DS | melonds_libretro | .nds |
| Atari 2600 | stella2014_libretro | .a26, .bin |
| Atari 5200 | a5200_libretro | .a52, .bin |
| ColecoVision | gearcoleco_libretro | .col |
| Intellivision | freeintv_libretro | .int |
| Atari Lynx | handy_libretro | .lnx |
| Neo Geo Pocket | mednafen_ngp_libretro | .ngp, .ngc |
| WonderSwan | mednafen_wswan_libretro | .ws, .wsc |
| Virtual Boy | mednafen_vb_libretro | .vb |
| Sega Saturn | yabause_libretro | .bin/.cue |
| 3DO | opera_libretro | .iso, .bin/.cue |
| Atari Jaguar | virtualjaguar_libretro | .j64, .jag |
| Vectrex | vecx_libretro | .vec, .bin |
| Odyssey 2 | o2em_libretro | .bin |
| Channel F | freechaf_libretro | .bin |
| Neo Geo CD | neocd_libretro | .bin/.cue |

## ---> Quick Start

### Windows Users

1. **Run the setup script:**
   ```cmd
   setup.bat
   ```

2. **Choose option 1** to setup and start the emulator

3. **Access the emulator** at http://localhost:8000

### Linux/Mac Users

1. **Make the script executable:**
   ```bash
   chmod +x setup.sh
   ```

2. **Run the setup:**
   ```bash
   ./setup.sh setup
   ```

3. **Access the emulator** at http://localhost:8000

### Manual Setup

1. **Clone or download this repository**

2. **Create ROM directories:**
   ```bash
   mkdir -p roms/{nes,gba,snes,genesis,n64,psx,gbc,nds}
   mkdir -p saves
   ```

3. **Build and run:**
   ```bash
   docker-compose up -d --build
   ```

##  Directory Structure

```
gameserv2/
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile             # Docker build instructions
├── server.js              # Enhanced Node.js server
├── setup.sh              # Linux/Mac setup script
├── setup.bat             # Windows setup script
├── filebrowser.json      # File browser configuration
├── webretro/             # WebRetro emulator files
├── roms/                 # ROM files directory (create this)
│   ├── nes/              # Nintendo Entertainment System ROMs
│   ├── gba/              # Game Boy Advance ROMs
│   ├── snes/             # Super Nintendo ROMs
│   ├── genesis/          # Sega Genesis ROMs
│   ├── n64/              # Nintendo 64 ROMs
│   ├── psx/              # PlayStation ROMs
│   └── ...               # Other system directories
└── saves/                # Game saves directory
```

## 🌐 Service URLs

- **# WebRetro Emulator**: http://localhost:8000
- **# File Browser**: http://localhost:8080 (admin/admin)
- **# Health Check**: http://localhost:8000/health
- **# Systems API**: http://localhost:8000/api/systems

##  How to Add ROMs

### Method 1: File Browser (Recommended)
1. Access the file browser at http://localhost:8080
2. Login with username: `admin`, password: `admin`
3. Navigate to the appropriate system folder
4. Upload your ROM files
5. Refresh the emulator page

### Method 2: Direct Copy
1. Copy ROM files to the appropriate folder in `roms/`
2. Restart the container: `docker-compose restart`

### Method 3: Command Line
```bash
# Copy ROMs to appropriate directories
cp /path/to/your/game.nes ./roms/nes/
cp /path/to/your/game.gba ./roms/gba/
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 8000)
- `NODE_ENV`: Environment mode (default: production)

### Volume Mounts

- `./roms:/app/webretro/roms` - ROM files
- `./saves:/app/webretro/saves` - Game saves (optional)

### Custom Configuration

Edit `docker-compose.yml` to modify:
- Port mappings
- Volume mounts
- Environment variables
- Resource limits

## 🛠️ Management Commands

### Using Setup Scripts

**Windows:**
```cmd
setup.bat         # Interactive menu
```

**Linux/Mac:**
```bash
./setup.sh        # Interactive menu
./setup.sh setup  # Setup and start
./setup.sh start  # Start containers
./setup.sh stop   # Stop containers
./setup.sh status # Show status
./setup.sh logs   # Show logs
./setup.sh update # Update containers
./setup.sh cleanup # Clean up
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update images
docker-compose pull && docker-compose up -d

# Remove everything
docker-compose down -v
```

##  Security Notes

1. **Change default passwords**: The file browser uses `admin/admin` by default
2. **Network access**: The emulator is accessible on all network interfaces
3. **ROM legality**: Only use ROMs you legally own
4. **Resource limits**: Consider setting Docker resource limits for production use


### Performance Optimization

1. **Increase Docker resources** (CPU/Memory)
2. **Use SSD storage** for better performance
3. **Close unnecessary browser tabs**
4. **Use Chrome/Firefox** for best compatibility

## 📄 License

This project uses the WebRetro emulator by BinBashBanana, which is released under the MIT License.

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

##  Support

- Create an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information about your environment

##  Acknowledgments

- **WebRetro** by BinBashBanana - The amazing web-based emulator
- **Libretro/RetroArch** - The emulation cores
- **Emscripten** - WebAssembly compilation
- **Docker** - Containerization platform

---

**Happy Gaming! 🎮**
