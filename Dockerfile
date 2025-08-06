# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required system packages
RUN apk update && apk add --no-cache \
    git \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package.json first for better Docker layer caching
COPY webretro/utils/package.json ./

# Install Node.js dependencies
RUN npm install

# Copy the entire webretro application
COPY webretro/ ./webretro/

# Create ROMs directory structure for different systems
RUN mkdir -p ./webretro/roms/nes \
    && mkdir -p ./webretro/roms/gba \
    && mkdir -p ./webretro/roms/snes \
    && mkdir -p ./webretro/roms/genesis \
    && mkdir -p ./webretro/roms/n64 \
    && mkdir -p ./webretro/roms/psx \
    && mkdir -p ./webretro/roms/gbc \
    && mkdir -p ./webretro/roms/nds \
    && mkdir -p ./webretro/roms/atari2600 \
    && mkdir -p ./webretro/roms/atari5200 \
    && mkdir -p ./webretro/roms/colecovision \
    && mkdir -p ./webretro/roms/intellivision \
    && mkdir -p ./webretro/roms/lynx \
    && mkdir -p ./webretro/roms/ngp \
    && mkdir -p ./webretro/roms/wonderswan \
    && mkdir -p ./webretro/roms/virtualboy \
    && mkdir -p ./webretro/roms/saturn \
    && mkdir -p ./webretro/roms/3do \
    && mkdir -p ./webretro/roms/jaguar \
    && mkdir -p ./webretro/roms/vectrex \
    && mkdir -p ./webretro/roms/odyssey2 \
    && mkdir -p ./webretro/roms/channelf \
    && mkdir -p ./webretro/roms/neocd

# Create a README file for ROM placement
RUN echo "# ROM Directory Structure\n\
\n\
Place your ROM files in the appropriate directories:\n\
\n\
- nes/        - Nintendo Entertainment System (.nes)\n\
- gba/        - Game Boy Advance (.gba)\n\
- snes/       - Super Nintendo (.sfc, .smc)\n\
- genesis/    - Sega Genesis/Mega Drive (.md, .gen, .bin)\n\
- n64/        - Nintendo 64 (.n64, .z64, .v64)\n\
- psx/        - PlayStation (.bin/.cue, .pbp)\n\
- gbc/        - Game Boy Color (.gbc, .gb)\n\
- nds/        - Nintendo DS (.nds)\n\
- atari2600/  - Atari 2600 (.a26, .bin)\n\
- atari5200/  - Atari 5200 (.a52, .bin)\n\
- colecovision/ - ColecoVision (.col)\n\
- intellivision/ - Intellivision (.int)\n\
- lynx/       - Atari Lynx (.lnx)\n\
- ngp/        - Neo Geo Pocket (.ngp, .ngc)\n\
- wonderswan/ - WonderSwan (.ws, .wsc)\n\
- virtualboy/ - Virtual Boy (.vb)\n\
- saturn/     - Sega Saturn (.bin/.cue)\n\
- 3do/        - 3DO (.iso, .bin/.cue)\n\
- jaguar/     - Atari Jaguar (.j64, .jag)\n\
- vectrex/    - Vectrex (.vec, .bin)\n\
- odyssey2/   - Odyssey 2 (.bin)\n\
- channelf/   - Channel F (.bin)\n\
- neocd/      - Neo Geo CD (.bin/.cue)\n\
\n\
Mount this directory as a volume when running the container.\n\
Example: docker run -v /host/roms:/app/webretro/roms ...\n" > ./webretro/roms/README.md

# Copy the enhanced server script
COPY server.js ./

# Set proper permissions
RUN chmod +x server.js

# Expose port 8000
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Start the application
CMD ["node", "server.js"]
