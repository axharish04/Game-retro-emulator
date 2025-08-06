# 🚀 Quick Start Guide - WebRetro Docker

## Instant Setup (Windows)

1. **Open Command Prompt or PowerShell as Administrator**
2. **Navigate to the project directory:**
   ```cmd
   cd "d:\aravind\A 4TH YR STUFF\docker build\gameserv2"
   ```
3. **Run the setup:**
   ```cmd
   setup.bat
   ```
4. **Choose option 1** (Setup and start emulator)
5. **Open your browser** and go to http://localhost:8000

## What You Get

- 🎮 **WebRetro Emulator**: Full-featured retro game emulator in your browser
- 📁 **File Manager**: Easy ROM upload at http://localhost:8080 (admin/admin)
- 🔄 **Auto-Setup**: Automatic directory creation for 20+ game systems
- 💾 **Persistent Saves**: Your game progress is saved between sessions
- 🌐 **Web API**: REST endpoints for system info and ROM management

## Adding Your First ROM

### Method 1: File Browser (Easiest)
1. Go to http://localhost:8080
2. Login: username `admin`, password `admin`
3. Navigate to `roms` → choose system folder (e.g., `nes` for Nintendo games)
4. Click upload and select your ROM file
5. Go back to http://localhost:8000 and select your game!

### Method 2: Copy Directly
1. Copy your ROM file to the appropriate folder:
   - NES games → `roms/nes/`
   - Game Boy Advance → `roms/gba/`
   - SNES games → `roms/snes/`
   - etc.
2. Restart: `docker-compose restart` (or use setup.bat option 2 → 1)

## Supported File Types

| System | Folder | Extensions |
|--------|--------|------------|
| NES | `roms/nes/` | .nes |
| Game Boy Advance | `roms/gba/` | .gba |
| SNES | `roms/snes/` | .sfc, .smc |
| Sega Genesis | `roms/genesis/` | .md, .gen, .bin |
| Nintendo 64 | `roms/n64/` | .n64, .z64, .v64 |
| PlayStation | `roms/psx/` | .bin/.cue, .pbp |

## Troubleshooting

**Container won't start?**
```cmd
docker-compose logs
```

**ROM not showing?**
- Check if file is in correct folder
- Restart container with setup.bat option 2 → 1

**Game not loading?**
- Use Chrome or Firefox browser
- Make sure ROM file isn't corrupted
- Check browser console (F12) for errors

## Management Commands

```cmd
setup.bat              # Interactive menu
```

### Menu Options:
1. **Setup and start** - First time setup
2. **Stop emulator** - Stop all containers
3. **Show status** - See running containers and URLs
4. **Show logs** - Debug information
5. **Update containers** - Get latest versions
6. **Cleanup** - Remove all containers and data
7. **Open emulator** - Launch browser to emulator
8. **Open file manager** - Launch browser to file manager

## Important URLs

- 🎮 **Emulator**: http://localhost:8000
- 📁 **File Manager**: http://localhost:8080 (admin/admin)
- 📊 **Health Check**: http://localhost:8000/health
- 🎯 **Systems Info**: http://localhost:8000/api/systems
- 📂 **ROM List**: http://localhost:8000/api/roms

## Ready to Play! 🎉

1. ✅ Run `setup.bat` and choose option 1
2. ✅ Add ROMs via file manager or direct copy
3. ✅ Open http://localhost:8000
4. ✅ Select system and game
5. ✅ Start playing!

**Need help?** Check the full README.md for detailed instructions.
