# 🎮 WebRetro Docker - Complete Setup Guide

## 📋 Project Overview

You now have a fully functional **WebRetro Docker project** that provides:

- **Multi-System Emulator**: Supports 20+ retro gaming systems
- **Web-Based Interface**: Play games directly in your browser
- **Docker Containerized**: Easy deployment and management
- **File Management**: Built-in web file browser
- **Persistent Storage**: Game saves and states are preserved
- **REST API**: Programmatic access to ROMs and system info

## 🏗️ Project Structure

```
gameserv2/
├── 🐳 Docker Configuration
│   ├── Dockerfile              # Main container build instructions
│   ├── docker-compose.yml      # Multi-container orchestration
│   ├── .dockerignore           # Files to exclude from build
│   └── server.js              # Enhanced Node.js server with API
│
├── 🎮 WebRetro Emulator
│   └── webretro/              # Complete emulator with cores
│       ├── index.html         # Main emulator interface
│       ├── cores/             # Emulation cores for different systems
│       ├── assets/            # UI assets and scripts
│       └── utils/             # Utilities and original server
│
├── 🛠️ Setup & Management
│   ├── setup.bat             # Windows setup script
│   ├── setup.sh              # Linux/Mac setup script
│   ├── validate.bat          # Windows validation script
│   └── validate.sh           # Linux/Mac validation script
│
├── 📚 Documentation
│   ├── README.md             # Complete documentation
│   ├── QUICKSTART.md         # Quick start guide
│   └── .gitignore            # Git ignore rules
│
└── 🎯 Configuration
    └── filebrowser.json       # File browser settings
```

## 🚀 Getting Started

### Option 1: Automated Setup (Recommended)

**Windows:**
```cmd
cd "d:\aravind\A 4TH YR STUFF\docker build\gameserv2"
setup.bat
```

**Linux/Mac:**
```bash
cd "/path/to/gameserv2"
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Validate Environment:**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Build and Start:**
   ```bash
   docker-compose up -d --build
   ```

3. **Create ROM Structure:**
   ```bash
   mkdir -p roms/{nes,gba,snes,genesis,n64,psx}
   ```

## 🎯 Supported Gaming Systems

| System | Core Used | File Types | Examples |
|--------|-----------|------------|----------|
| **Nintendo Entertainment System** | nestopia_libretro | .nes | Super Mario Bros, Zelda |
| **Game Boy Advance** | mgba_libretro | .gba | Pokemon, Mario Kart |
| **Super Nintendo** | snes9x_libretro | .sfc, .smc | Super Mario World, F-Zero |
| **Sega Genesis** | genesis_plus_gx_libretro | .md, .gen, .bin | Sonic, Streets of Rage |
| **Nintendo 64** | mupen64plus_next_libretro | .n64, .z64, .v64 | Mario 64, Zelda OoT |
| **PlayStation** | mednafen_psx_hw_libretro | .bin/.cue, .pbp | Final Fantasy VII, Crash |
| **Game Boy Color** | mgba_libretro | .gbc, .gb | Pokemon Gold/Silver |
| **Nintendo DS** | melonds_libretro | .nds | New Super Mario Bros |
| **Atari 2600** | stella2014_libretro | .a26, .bin | Pac-Man, Space Invaders |
| **And 15+ more systems!** | Various | Multiple | Tons of classics! |

## 📁 Adding ROMs

### Method 1: Web File Manager (Easiest)
1. Go to **http://localhost:8080**
2. Login: `admin` / `admin` (change after first login!)
3. Navigate to `roms` → choose system folder
4. Upload your ROM files
5. Refresh emulator page

### Method 2: Direct Copy
```bash
# Copy ROMs to appropriate directories
cp your-game.nes ./roms/nes/
cp your-game.gba ./roms/gba/
# etc.
```

### Method 3: Drag & Drop (Windows)
1. Open `roms` folder in Windows Explorer
2. Navigate to appropriate system folder
3. Drag and drop ROM files
4. Restart container if needed

## 🌐 Service Access

| Service | URL | Purpose | Credentials |
|---------|-----|---------|-------------|
| **🎮 Emulator** | http://localhost:8000 | Play games | None |
| **📁 File Manager** | http://localhost:8080 | Upload ROMs | admin/admin |
| **📊 Health Check** | http://localhost:8000/health | Monitor status | None |
| **🎯 Systems API** | http://localhost:8000/api/systems | System info | None |
| **📂 ROMs API** | http://localhost:8000/api/roms | ROM listings | None |

## 🔧 Management Commands

### Windows (setup.bat)
```cmd
setup.bat
# Choose from menu:
# 1. Setup and start emulator
# 2. Stop emulator  
# 3. Show status
# 4. Show logs
# 5. Update containers
# 6. Cleanup
# 7. Open emulator in browser
# 8. Open file manager in browser
```

### Linux/Mac (setup.sh)
```bash
./setup.sh setup    # Setup and start
./setup.sh start    # Start containers
./setup.sh stop     # Stop containers
./setup.sh status   # Show status
./setup.sh logs     # Show logs
./setup.sh update   # Update containers
./setup.sh cleanup  # Remove everything
```

### Docker Compose Direct
```bash
docker-compose up -d --build    # Start
docker-compose down             # Stop
docker-compose logs -f          # View logs
docker-compose restart          # Restart
```

## 🎮 How to Play

1. **Start the emulator** (using setup scripts or docker-compose)
2. **Add ROM files** to appropriate directories
3. **Open browser** to http://localhost:8000
4. **Select system** from the available cores
5. **Choose ROM file** from the list
6. **Start playing!** 🎉

### Game Controls
- **Keyboard**: Arrow keys + Z/X for A/B buttons (Nintendo-style)
- **Gamepad**: Connect USB controller for best experience
- **Touch**: On mobile devices (limited support)

### Save System
- **In-Game Saves**: Use game's built-in save system
- **Save States**: Save at any point with emulator
- **Auto-Save**: Automatic saves every 5 minutes
- **Export/Import**: Backup saves to files

## 🔧 Customization

### Modify Ports
Edit `docker-compose.yml`:
```yaml
ports:
  - "8000:8000"  # Change first 8000 to desired port
  - "8080:80"    # Change first 8080 to desired port
```

### Add Storage
```yaml
volumes:
  - ./custom-saves:/app/webretro/custom-saves
```

### Environment Variables
```yaml
environment:
  - PORT=8000
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

## 🐛 Troubleshooting

### Common Issues

**1. Container won't start**
```bash
docker-compose logs webretro
```

**2. ROM files not appearing**
- Check file extensions match supported formats
- Ensure files are in correct directories
- Restart containers: `docker-compose restart`

**3. Emulator not loading games**
- Use Chrome or Firefox browser
- Check browser console (F12) for errors
- Verify ROM file isn't corrupted

**4. Performance issues**
- Close other browser tabs
- Increase Docker resources (CPU/Memory)
- Use Chrome for best performance

**5. Save states not working**
- Clear browser cache
- Check browser supports IndexedDB
- Ensure saves directory is mounted

### Getting Help

1. **Check logs**: `docker-compose logs`
2. **Validate setup**: Run `validate.bat` or `validate.sh`
3. **Restart clean**: `setup.bat` → option 6 → option 1
4. **Browser console**: F12 → Console tab for JavaScript errors

## 🔒 Security & Legal

### Security Notes
- **Change default passwords** in file browser
- **Network exposure**: Emulator accessible on all interfaces
- **ROM storage**: Files are stored in plain text
- **Resource limits**: Consider setting Docker limits

### Legal Considerations
- **Only use ROMs you legally own**
- **Respect copyright laws** in your jurisdiction
- **BIOS files**: Some systems require BIOS files you must provide
- **Distribution**: Don't share copyrighted ROMs

## 📈 Next Steps

### Enhancements You Can Add
1. **NGINX Reverse Proxy** for HTTPS and custom domains
2. **Authentication System** for multi-user access
3. **ROM Library Management** with metadata and thumbnails
4. **Backup System** for automated save file backups
5. **Network Play** for multiplayer games
6. **Mobile App** wrapper for better mobile experience

### Integration Ideas
1. **Home Assistant** integration for smart home control
2. **Discord Bot** for game status and challenges
3. **Twitch Integration** for streaming gameplay
4. **Achievement System** with progress tracking

## 🎉 Enjoy Your Retro Gaming!

Your WebRetro Docker setup is now complete and ready for endless retro gaming fun! 

**Happy Gaming! 🎮🕹️👾**

---

*Built with ❤️ using WebRetro by BinBashBanana, Docker, and lots of nostalgia!*
