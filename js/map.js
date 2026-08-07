// ============================================
// MAP - Tile-based map with collision
// ============================================

class Map {
    constructor() {
        this.tileSize = 32;
        this.width = 40; // tiles
        this.height = 30; // tiles
        
        // Tile types
        this.TILES = {
            GRASS: 0,
            PATH: 1,
            TREE: 2,
            ROCK: 3,
            WATER: 4,
            HOUSE: 5,
            WALL: 6,
            SAND: 7,
            BRIDGE: 8
        };
        
        // Generate map
        this.grid = this.generateMap();
        this.collisionMap = this.buildCollisionMap();
    }
    
    generateMap() {
        const grid = [];
        
        for (let y = 0; y < this.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Default grass
                let tile = this.TILES.GRASS;
                
                // Create paths
                if (x === 20 || y === 15 || (x % 10 === 0 && y % 10 === 0)) {
                    tile = this.TILES.PATH;
                }
                
                // Water areas
                if ((x > 30 && x < 38 && y > 5 && y < 12) ||
                    (x > 2 && x < 8 && y > 20 && y < 27)) {
                    tile = this.TILES.WATER;
                }
                
                // Trees (forest areas)
                if ((x > 25 && x < 30 && y > 18 && y < 25) ||
                    (x > 5 && x < 10 && y > 5 && y < 10) ||
                    (x > 15 && x < 18 && y > 25 && y < 28)) {
                    tile = this.TILES.TREE;
                }
                
                // Rocks
                if ((x === 5 && y === 12) || (x === 35 && y === 20) ||
                    (x === 15 && y === 5) || (x === 28 && y === 28)) {
                    tile = this.TILES.ROCK;
                }
                
                // House
                if (x >= 12 && x <= 16 && y >= 12 && y <= 15) {
                    tile = this.TILES.HOUSE;
                }
                
                // Walls (fences)
                if ((x === 12 && y >= 12 && y <= 16) ||
                    (x === 16 && y >= 12 && y <= 16) ||
                    (y === 12 && x >= 12 && x <= 16) ||
                    (y === 16 && x >= 12 && x <= 16)) {
                    tile = this.TILES.WALL;
                }
                
                // Sand (beach area)
                if (x > 28 && x < 32 && y > 8 && y < 12) {
                    tile = this.TILES.SAND;
                }
                
                // Bridge over water
                if ((x === 4 && y >= 22 && y <= 25) ||
                    (x === 34 && y >= 6 && y <= 10)) {
                    tile = this.TILES.BRIDGE;
                }
                
                grid[y][x] = tile;
            }
        }
        
        return grid;
    }
    
    buildCollisionMap() {
        const collision = [];
        
        for (let y = 0; y < this.height; y++) {
            collision[y] = [];
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[y][x];
                // Non-walkable tiles
                collision[y][x] = (tile === this.TILES.TREE ||
                                   tile === this.TILES.ROCK ||
                                   tile === this.TILES.WATER ||
                                   tile === this.TILES.HOUSE ||
                                   tile === this.TILES.WALL);
            }
        }
        
        return collision;
    }
    
    isWalkable(x, y) {
        const tx = Math.floor(x / this.tileSize);
        const ty = Math.floor(y / this.tileSize);
        
        if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
            return false;
        }
        
        return !this.collisionMap[ty][tx];
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return this.TILES.GRASS;
        }
        return this.grid[y][x];
    }
    
    render(ctx) {
        const startX = Math.floor(Game.camera.x / this.tileSize);
        const startY = Math.floor(Game.camera.y / this.tileSize);
        const endX = Math.ceil((Game.camera.x + canvas.width) / this.tileSize) + 1;
        const endY = Math.ceil((Game.camera.y + canvas.height) / this.tileSize) + 1;
        
        for (let y = startY; y < endY && y < this.height; y++) {
            for (let x = startX; x < endX && x < this.width; x++) {
                if (y < 0 || x < 0) continue;
                
                const tile = this.grid[y][x];
                const px = x * this.tileSize;
                const py = y * this.tileSize;
                
                // Draw tile based on type
                switch(tile) {
                    case this.TILES.GRASS:
                        ctx.fillStyle = this.getGrassColor(x, y);
                        break;
                    case this.TILES.PATH:
                        ctx.fillStyle = '#c8b078';
                        break;
                    case this.TILES.TREE:
                        // Draw grass first
                        ctx.fillStyle = this.getGrassColor(x, y);
                        ctx.fillRect(px, py, this.tileSize, this.tileSize);
                        // Then tree
                        ctx.fillStyle = '#4a7a3a';
                        ctx.fillRect(px + 8, py + 4, 16, 20);
                        ctx.fillStyle = '#3a6a2a';
                        ctx.fillRect(px + 4, py, 24, 8);
                        ctx.fillRect(px + 8, py - 4, 16, 8);
                        continue;
                    case this.TILES.ROCK:
                        ctx.fillStyle = '#888888';
                        ctx.beginPath();
                        ctx.ellipse(px + 16, py + 16, 12, 8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#999999';
                        ctx.beginPath();
                        ctx.ellipse(px + 14, py + 14, 8, 6, 0, 0, Math.PI * 2);
                        ctx.fill();
                        continue;
                    case this.TILES.WATER:
                        ctx.fillStyle = '#4488cc';
                        ctx.fillRect(px, py, this.tileSize, this.tileSize);
                        // Water animation
                        const wave = Math.sin(Game.gameTime * 2 + x + y) * 2;
                        ctx.fillStyle = 'rgba(100, 180, 255, 0.3)';
                        ctx.fillRect(px + 8 + wave, py + 8, 16, 2);
                        ctx.fillRect(px + 4 - wave, py + 20, 20, 2);
                        continue;
                    case this.TILES.HOUSE:
                        ctx.fillStyle = '#8B7D6B';
                        ctx.fillRect(px, py + 8, this.tileSize, this.tileSize - 8);
                        // Roof
                        ctx.fillStyle = '#6B3A2A';
                        ctx.beginPath();
                        ctx.moveTo(px, py + 8);
                        ctx.lineTo(px + 16, py - 4);
                        ctx.lineTo(px + this.tileSize, py + 8);
                        ctx.fill();
                        // Door
                        ctx.fillStyle = '#4A2A1A';
                        ctx.fillRect(px + 12, py + 20, 8, 12);
                        // Window
                        ctx.fillStyle = '#6AB0D0';
                        ctx.fillRect(px + 4, py + 12, 6, 6);
                        ctx.fillRect(px + 22, py + 12, 6, 6);
                        continue;
                    case this.TILES.WALL:
                        ctx.fillStyle = '#8B7D6B';
                        ctx.fillRect(px, py, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#7B6D5B';
                        ctx.fillRect(px + 4, py + 4, 4, this.tileSize - 8);
                        ctx.fillRect(px + this.tileSize - 8, py + 4, 4, this.tileSize - 8);
                        continue;
                    case this.TILES.SAND:
                        ctx.fillStyle = '#e8d8a8';
                        break;
                    case this.TILES.BRIDGE:
                        ctx.fillStyle = '#8B7D6B';
                        ctx.fillRect(px, py + 8, this.tileSize, 16);
                        // Wood planks
                        ctx.fillStyle = '#7B6D5B';
                        for (let i = 0; i < 4; i++) {
                            ctx.fillRect(px + i * 8 + 2, py + 10, 4, 12);
                        }
                        continue;
                    default:
                        ctx.fillStyle = '#4a8a4a';
                }
                
                ctx.fillRect(px, py, this.tileSize, this.tileSize);
            }
        }
    }
    
    getGrassColor(x, y) {
        const shade = (Math.sin(x * 1.7 + y * 2.3) * 0.1 + 0.9);
        const base = [74, 138, 74];
        return `rgb(${Math.floor(base[0] * shade)}, ${Math.floor(base[1] * shade)}, ${Math.floor(base[2] * shade)})`;
    }
}