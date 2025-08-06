


const fs = require("fs");
const http = require("http");
const express = require("express");
const path = require("path");

const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Serve the gaming interface as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'webretro', 'gaming-interface.html'));
});

// Serve the original emulator interface
app.get('/emulator', (req, res) => {
    res.sendFile(path.join(__dirname, 'webretro', 'index.html'));
});

// Serve static files from webretro directory
app.use(express.static("webretro", {
    setHeaders: (res, path) => {
        // Set proper MIME types for WebAssembly files
        if (path.endsWith('.wasm')) {
            res.set('Content-Type', 'application/wasm');
        }
        // Set proper MIME types for JavaScript modules
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// API endpoint to list available ROMs
app.get('/api/roms', (req, res) => {
    const romsDir = path.join(__dirname, 'webretro', 'roms');
    //const romsDir = path.join(__dirname, 'roms');

    const systems = {};
    
    try {
        const systemDirs = fs.readdirSync(romsDir,{ withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        systemDirs.forEach(system => {
            const systemPath = path.join(romsDir, system);
            try {
                const roms = fs.readdirSync(systemPath)
                    .filter(file => !file.startsWith('.') && file !== 'README.md')
                    .map(file => ({
                        name: file,
                        path: `${system}/${file}`,
                        system: system,
                        size: fs.statSync(path.join(systemPath, file)).size
                    }));
                
                if (roms.length > 0) {
                    systems[system] = roms;
                }
            } catch (err) {
                console.warn(`Could not read ${system} directory:`, err.message);
            }
        });
        
        res.json(systems);
    } catch (err) {
        console.error('Error reading ROMs directory:', err);
        res.status(500).json({ error: 'Could not read ROMs directory' });
    }
});

// API endpoint to get system information
app.get('/api/systems', (req, res) => {
    const systemInfo = {
        nes: { 
            name: "Nintendo Entertainment System", 
            core: "nestopia",
            extensions: [".nes"],
            description: "8-bit home video game console by Nintendo"
        },
        gba: { 
            name: "Game Boy Advance", 
            core: "mgba",
            extensions: [".gba"],
            description: "32-bit handheld game console by Nintendo"
        },
        snes: { 
            name: "Super Nintendo Entertainment System", 
            core: "snes9x",
            extensions: [".sfc", ".smc"],
            description: "16-bit home video game console by Nintendo"
        },
        genesis: { 
            name: "Sega Genesis/Mega Drive", 
            core: "genesis_plus_gx",
            extensions: [".md", ".gen", ".bin"],
            description: "16-bit home video game console by Sega"
        },
        n64: { 
            name: "Nintendo 64", 
            core: "mupen64plus_next",
            extensions: [".n64", ".z64", ".v64"],
            description: "64-bit home video game console by Nintendo"
        },
        psx: { 
            name: "Sony PlayStation", 
            core: "mednafen_psx_hw",
            extensions: [".bin", ".cue", ".pbp"],
            description: "32-bit home video game console by Sony"
        },
        gbc: { 
            name: "Game Boy Color", 
            core: "mgba",
            extensions: [".gbc", ".gb"],
            description: "8-bit handheld game console by Nintendo"
        },
        nds: { 
            name: "Nintendo DS", 
            core: "melonds",
            extensions: [".nds"],
            description: "Dual-screen handheld game console by Nintendo"
        },
        atari2600: { 
            name: "Atari 2600", 
            core: "stella2014",
            extensions: [".a26", ".bin"],
            description: "Home video game console by Atari"
        },
        atari5200: { 
            name: "Atari 5200", 
            core: "a5200",
            extensions: [".a52", ".bin"],
            description: "Home video game console by Atari"
        },
        colecovision: { 
            name: "ColecoVision", 
            core: "gearcoleco",
            extensions: [".col"],
            description: "Second-generation home video game console"
        },
        intellivision: { 
            name: "Intellivision", 
            core: "freeintv",
            extensions: [".int"],
            description: "Home video game console by Mattel Electronics"
        },
        lynx: { 
            name: "Atari Lynx", 
            core: "handy",
            extensions: [".lnx"],
            description: "16-bit handheld game console by Atari"
        },
        ngp: { 
            name: "Neo Geo Pocket", 
            core: "mednafen_ngp",
            extensions: [".ngp", ".ngc"],
            description: "Handheld game console by SNK"
        },
        wonderswan: { 
            name: "WonderSwan", 
            core: "mednafen_wswan",
            extensions: [".ws", ".wsc"],
            description: "Handheld game console by Bandai"
        },
        virtualboy: { 
            name: "Virtual Boy", 
            core: "mednafen_vb",
            extensions: [".vb"],
            description: "32-bit tabletop portable console by Nintendo"
        },
        saturn: { 
            name: "Sega Saturn", 
            core: "yabause",
            extensions: [".bin", ".cue"],
            description: "32-bit fifth-generation home video game console by Sega"
        },
        "3do": { 
            name: "3DO Interactive Multiplayer", 
            core: "opera",
            extensions: [".iso", ".bin", ".cue"],
            description: "Home video game console developed by The 3DO Company"
        },
        jaguar: { 
            name: "Atari Jaguar", 
            core: "virtualjaguar",
            extensions: [".j64", ".jag"],
            description: "Home video game console by Atari Corporation"
        },
        vectrex: { 
            name: "Vectrex", 
            core: "vecx",
            extensions: [".vec", ".bin"],
            description: "Vector display-based home video game console"
        },
        odyssey2: { 
            name: "Magnavox Odyssey²", 
            core: "o2em",
            extensions: [".bin"],
            description: "Home video game console by Magnavox"
        },
        channelf: { 
            name: "Fairchild Channel F", 
            core: "freechaf",
            extensions: [".bin"],
            description: "Home video game console by Fairchild Semiconductor"
        },
        neocd: { 
            name: "Neo Geo CD", 
            core: "neocd",
            extensions: [".bin", ".cue"],
            description: "Home video game console by SNK"
        }
    };
    
    res.json(systemInfo);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: port
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <html>
            <head>
                <title>WebRetro - Page Not Found</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; text-align: center; padding: 50px; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .logo { font-size: 48px; color: #ff6b6b; margin-bottom: 20px; }
                    .error-code { font-size: 72px; color: #4ecdc4; margin: 20px 0; }
                    .message { font-size: 18px; margin: 20px 0; }
                    .link { color: #4ecdc4; text-decoration: none; font-weight: bold; }
                    .link:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">🎮 WebRetro</div>
                    <div class="error-code">404</div>
                    <div class="message">Oops! This page doesn't exist.</div>
                    <div class="message">
                        <a href="/" class="link">🏠 Go back to the emulator</a>
                    </div>
                    <div class="message">
                        <a href="/api/roms" class="link">📁 View available ROMs</a> | 
                        <a href="/api/systems" class="link">🎯 View supported systems</a>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`🎮 WebRetro Docker Server started!`);
    console.log(`📡 Server running on: http://0.0.0.0:${port}`);
    console.log(`🌐 Access from host: http://localhost:${port}`);
    console.log(`📁 ROMs directory: /app/webretro/roms`);
    console.log(`🔧 API endpoints:`);
    console.log(`   - GET /api/roms - List available ROMs`);
    console.log(`   - GET /api/systems - List supported systems`);
    console.log(`   - GET /health - Health check`);
    console.log(`\n🚀 Ready to play retro games!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
