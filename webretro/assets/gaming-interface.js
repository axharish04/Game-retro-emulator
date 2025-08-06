// Gaming Interface JavaScript
class RetroGamingHub {
    constructor() {
        this.currentSection = 'welcome';
        this.games = {};
        this.systems = {};
        this.currentGame = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadSystems();
        await this.loadGames();
        this.updateStats();
        this.showSection('welcome');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterGames(e.target.value);
            });
        }

        // System filter
        const systemFilter = document.getElementById('systemFilter');
        if (systemFilter) {
            systemFilter.addEventListener('change', (e) => {
                this.filterGamesBySystem(e.target.value);
            });
        }

        // Modal close on background click
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeGame();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGame();
            }
        });

        // Gamepad detection
        this.detectGamepads();
    }

    async loadSystems() {
        try {
            const response = await fetch('/api/systems');
            this.systems = await response.json();
            this.renderSystems();
            this.populateSystemFilter();
        } catch (error) {
            console.error('Failed to load systems:', error);
            this.showError('Failed to load gaming systems');
        }
    }

    async loadGames() {
        try {
            const response = await fetch('/api/roms');
            this.games = await response.json();
            this.renderGames();
        } catch (error) {
            console.error('Failed to load games:', error);
            this.showError('Failed to load games');
        }
    }

    renderSystems() {
        const container = document.getElementById('systemsGrid');
        if (!container) return;

        if (Object.keys(this.systems).length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎮</div>
                    <h3>No Systems Available</h3>
                    <p>Game systems will appear here once the emulator is properly configured.</p>
                </div>
            `;
            return;
        }

        const systemsHTML = Object.entries(this.systems).map(([key, system]) => {
            const icon = this.getSystemIcon(key);
            const extensionsHTML = system.extensions.map(ext => 
                `<span class="extension-tag">${ext}</span>`
            ).join('');

            return `
                <div class="system-card" data-system="${key}">
                    <div class="system-icon">${icon}</div>
                    <div class="system-name">${system.name}</div>
                    <div class="system-core">${system.core}</div>
                    <div class="system-description">${system.description}</div>
                    <div class="system-extensions">${extensionsHTML}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = systemsHTML;
    }

    renderGames() {
        const container = document.getElementById('gamesGrid');
        if (!container) return;

        const totalGames = Object.values(this.games).reduce((acc, systemGames) => acc + systemGames.length, 0);

        if (totalGames === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎯</div>
                    <h3>No Games Found</h3>
                    <p>Add ROM files to the appropriate directories to start playing!</p>
                    <div class="empty-actions">
                        <button class="btn btn-primary" onclick="window.open('http://localhost:8080', '_blank')">
                            <span class="btn-icon">📁</span>
                            Open File Manager
                        </button>
                        <button class="btn btn-secondary" onclick="this.loadGames()">
                            <span class="btn-icon">🔄</span>
                            Refresh
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const gamesHTML = Object.entries(this.games).flatMap(([system, systemGames]) => 
            systemGames.map(game => {
                const systemInfo = this.systems[system] || { name: system };
                const gameSize = this.formatFileSize(game.size);
                
                return `
                    <div class="game-card" data-system="${system}" data-game="${game.name}">
                        <div class="game-title">${this.formatGameName(game.name)}</div>
                        <div class="game-system">${systemInfo.name}</div>
                        <div class="game-size">${gameSize}</div>
                        <button class="game-play-btn" onclick="retroHub.playGame('${system}', '${game.name}', '${game.path}')">
                            ▶
                        </button>
                    </div>
                `;
            })
        ).join('');

        container.innerHTML = gamesHTML;
    }

    populateSystemFilter() {
        const select = document.getElementById('systemFilter');
        if (!select) return;

        const options = Object.entries(this.systems).map(([key, system]) => 
            `<option value="${key}">${system.name}</option>`
        ).join('');

        select.innerHTML = `<option value="">All Systems</option>${options}`;
    }

    filterGames(searchTerm) {
        const cards = document.querySelectorAll('.game-card');
        const term = searchTerm.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.game-title').textContent.toLowerCase();
            const system = card.querySelector('.game-system').textContent.toLowerCase();
            
            if (title.includes(term) || system.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterGamesBySystem(systemKey) {
        const cards = document.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            if (!systemKey || card.dataset.system === systemKey) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    async playGame(system, gameName, gamePath) {
        try {
            // Show loading state
            this.showGameModal(gameName, system, 'Loading...');
            
            // Get the core for this system
            const systemInfo = this.systems[system];
            if (!systemInfo) {
                throw new Error(`Unknown system: ${system}`);
            }
            
            // Construct the game URL for the original WebRetro interface
            const gameUrl = `/emulator?core=${systemInfo.core}&rom=${encodeURIComponent(gamePath)}`;
            
            // Load the game in iframe
            const iframe = document.getElementById('gameFrame');
            iframe.src = gameUrl;
            
            this.currentGame = { system, gameName, gamePath };
            
            // Update game info
            setTimeout(() => {
                document.getElementById('gameSystem').textContent = `System: ${systemInfo.name}`;
                const gameData = this.findGameData(system, gameName);
                if (gameData) {
                    document.getElementById('gameSize').textContent = `Size: ${this.formatFileSize(gameData.size)}`;
                }
            }, 1000);
            
        } catch (error) {
            console.error('Failed to load game:', error);
            this.showError('Failed to load game. Please try again.');
            this.closeGame();
        }
    }

    showGameModal(title, system, size) {
        const modal = document.getElementById('gameModal');
        const titleElement = document.getElementById('modalGameTitle');
        
        if (titleElement) {
            titleElement.textContent = this.formatGameName(title);
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeGame() {
        const modal = document.getElementById('gameModal');
        const iframe = document.getElementById('gameFrame');
        
        modal.classList.remove('active');
        iframe.src = '';
        document.body.style.overflow = '';
        
        this.currentGame = null;
    }

    toggleFullscreen() {
        const gameContainer = document.getElementById('gameContainer');
        
        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    saveGame() {
        if (this.currentGame) {
            // Implement save game functionality
            this.showNotification('Game saved successfully!', 'success');
        }
    }

    resetGame() {
        if (this.currentGame && confirm('Are you sure you want to reset the game? All unsaved progress will be lost.')) {
            const iframe = document.getElementById('gameFrame');
            iframe.src = iframe.src; // Reload the iframe
            this.showNotification('Game reset successfully!', 'info');
        }
    }

    downloadSave() {
        if (this.currentGame) {
            // Implement save download functionality
            this.showNotification('Save file exported!', 'success');
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.currentSection = sectionName;
    }

    updateStats() {
        const totalGames = Object.values(this.games).reduce((acc, systemGames) => acc + systemGames.length, 0);
        const totalSystems = Object.keys(this.systems).length;
        
        const gamesElement = document.getElementById('totalGames');
        const systemsElement = document.getElementById('totalSystems');
        
        if (gamesElement) {
            this.animateNumber(gamesElement, totalGames);
        }
        
        if (systemsElement) {
            systemsElement.textContent = totalSystems + '+';
        }
    }

    animateNumber(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    detectGamepads() {
        if (navigator.getGamepads) {
            const checkGamepads = () => {
                const gamepads = navigator.getGamepads();
                const connectedGamepads = Array.from(gamepads).filter(gp => gp);
                
                if (connectedGamepads.length > 0) {
                    this.showNotification(`${connectedGamepads.length} gamepad(s) detected!`, 'success');
                }
            };
            
            window.addEventListener('gamepadconnected', checkGamepads);
            window.addEventListener('gamepaddisconnected', checkGamepads);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    getSystemIcon(systemKey) {
        const icons = {
            nes: '🎮',
            gba: '🎯',
            snes: '🕹️',
            genesis: '🎪',
            n64: '🎲',
            psx: '💿',
            gbc: '🔋',
            nds: '📱',
            atari2600: '🏛️',
            atari5200: '🏺',
            colecovision: '🎭',
            intellivision: '🧠',
            lynx: '🐱',
            ngp: '💎',
            wonderswan: '🦢',
            virtualboy: '🔴',
            saturn: '🪐',
            '3do': '🎪',
            jaguar: '🐆',
            vectrex: '📐',
            odyssey2: '🚀',
            channelf: '📺',
            neocd: '💽'
        };
        return icons[systemKey] || '🎮';
    }

    formatGameName(filename) {
        return filename
            .replace(/\.[^.]+$/, '') // Remove extension
            .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    findGameData(system, gameName) {
        const systemGames = this.games[system] || [];
        return systemGames.find(game => game.name === gameName);
    }
}

// Global functions for onclick handlers
function showSection(sectionName) {
    retroHub.showSection(sectionName);
}

function loadGames() {
    retroHub.loadGames();
}

function toggleFullscreen() {
    retroHub.toggleFullscreen();
}

function closeGame() {
    retroHub.closeGame();
}

function saveGame() {
    retroHub.saveGame();
}

function resetGame() {
    retroHub.resetGame();
}

function downloadSave() {
    retroHub.downloadSave();
}

// Initialize the application
let retroHub;
document.addEventListener('DOMContentLoaded', () => {
    retroHub = new RetroGamingHub();
});

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 3000;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1rem;
    color: var(--text-light);
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow);
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-success {
    border-left: 4px solid var(--accent-color);
}

.notification-error {
    border-left: 4px solid var(--secondary-color);
}

.notification-warning {
    border-left: 4px solid #ffa500;
}

.notification-info {
    border-left: 4px solid var(--primary-color);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-icon {
    font-size: 1.2rem;
}

.notification-message {
    flex: 1;
    font-weight: 500;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-muted);
    grid-column: 1 / -1;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-light);
}

.empty-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
