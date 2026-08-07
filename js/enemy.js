// ============================================
// ENEMY - Enemy AI and behavior
// ============================================

const ENEMY_TYPES = {
    slime: {
        name: 'Slime',
        hp: 30,
        attack: 5,
        defense: 2,
        exp: 15,
        gold: { min: 5, max: 10 },
        speed: 30,
        color: '#44dd44',
        size: 24,
        dropRate: 0.2,
        drops: [
            { id: 'potion', name: 'Health Potion', icon: '🧪', chance: 0.5 }
        ]
    },
    goblin: {
        name: 'Goblin',
        hp: 45,
        attack: 8,
        defense: 3,
        exp: 25,
        gold: { min: 10, max: 20 },
        speed: 50,
        color: '#44aa44',
        size: 28,
        dropRate: 0.3,
        drops: [
            { id: 'potion', name: 'Health Potion', icon: '🧪', chance: 0.4 },
            { id: 'wooden_sword', name: 'Wooden Sword', icon: '🗡️', chance: 0.1 }
        ]
    },
    wolf: {
        name: 'Wolf',
        hp: 35,
        attack: 12,
        defense: 1,
        exp: 30,
        gold: { min: 5, max: 15 },
        speed: 80,
        color: '#888888',
        size: 26,
        dropRate: 0.25,
        drops: [
            { id: 'potion', name: 'Health Potion', icon: '🧪', chance: 0.3 }
        ]
    },
    skeleton: {
        name: 'Skeleton',
        hp: 55,
        attack: 15,
        defense: 5,
        exp: 40,
        gold: { min: 15, max: 25 },
        speed: 40,
        color: '#dddddd',
        size: 30,
        dropRate: 0.35,
        drops: [
            { id: 'potion', name: 'Health Potion', icon: '🧪', chance: 0.3 },
            { id: 'iron_sword', name: 'Iron Sword', icon: '⚔️', chance: 0.08 }
        ]
    },
    orc: {
        name: 'Orc',
        hp: 80,
        attack: 20,
        defense: 8,
        exp: 60,
        gold: { min: 20, max: 40 },
        speed: 35,
        color: '#44aa44',
        size: 34,
        dropRate: 0.4,
        drops: [
            { id: 'potion', name: 'Health Potion', icon: '🧪', chance: 0.3 },
            { id: 'mana_potion', name: 'Mana Potion', icon: '💧', chance: 0.2 },
            { id: 'knight_armor', name: 'Knight Armor', icon: '🛡️', chance: 0.05 }
        ]
    },
    boss: {
        name: 'Boss',
        hp: 200,
        attack: 30,
        defense: 15,
        exp: 200,
        gold: { min: 100, max: 200 },
        speed: 25,
        color: '#ff4444',
        size: 48,
        dropRate: 0.8,
        drops: [
            { id: 'potion', name: 'Health Potion', icon: '🧪', chance: 0.5 },
            { id: 'mana_potion', name: 'Mana Potion', icon: '💧', chance: 0.4 },
            { id: 'dragon_sword', name: 'Dragon Sword', icon: '⚔️', chance: 0.15 }
        ]
    }
};

class Enemy {
    constructor(type, x, y) {
        const data = ENEMY_TYPES[type];
        if (!data) throw new Error(`Unknown enemy type: ${type}`);
        
        this.type = type;
        this.name = data.name;
        this.x = x;
        this.y = y;
        this.size = data.size;
        this.color = data.color;
        
        // Stats
        this.maxHp = data.hp;
        this.hp = data.hp;
        this.attack = data.attack;
        this.defense = data.defense;
        this.exp = data.exp;
        this.gold = Math.floor(Math.random() * (data.gold.max - data.gold.min + 1)) + data.gold.min;
        this.speed = data.speed;
        this.dropRate = data.dropRate;
        this.drops = data.drops;
        
        // AI
        this.state = 'idle'; // idle, chasing, attacking
        this.attackCooldown = 0;
        this.attackRange = 40;
        this.detectionRange = 200;
        this.moveTimer = 0;
        this.moveDirection = { x: 0, y: 0 };
        this.idleTime = 0;
        this.facing = 'down';
        
        // Animation
        this.frame = 0;
        this.frameTimer = 0;
        this.isMoving = false;
        
        // Hit flash
        this.hitFlash = 0;
    }
    
    update(dt, player) {
        // Update hit flash
        if (this.hitFlash > 0) {
            this.hitFlash -= dt;
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }
        
        // Calculate distance to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // AI States
        if (distance < this.detectionRange && this.hp > 0) {
            if (distance < this.attackRange) {
                // Attack state
                this.state = 'attacking';
                this.attackPlayer(player);
            } else {
                // Chase state
                this.state = 'chasing';
                this.chasePlayer(dx, dy, dt);
            }
        } else {
            // Idle state
            this.state = 'idle';
            this.idleMovement(dt);
        }
        
        // Update animation
        this.frameTimer += dt;
        if (this.frameTimer > 0.2) {
            this.frameTimer = 0;
            this.frame = (this.frame + 1) % 4;
        }
        
        // Keep in bounds
        if (Game.map) {
            this.x = Math.max(0, Math.min(Game.map.width - 1, this.x));
            this.y = Math.max(0, Math.min(Game.map.height - 1, this.y));
        }
    }
    
    chasePlayer(dx, dy, dt) {
        const distance = Math.sqrt(dx*dx + dy*dy);
        const moveX = (dx / distance) * this.speed * dt;
        const moveY = (dy / distance) * this.speed * dt;
        
        // Move towards player with collision
        const newX = this.x + moveX;
        const newY = this.y + moveY;
        
        if (Game.map && Game.map.isWalkable(newX, this.y)) {
            this.x = newX;
        }
        if (Game.map && Game.map.isWalkable(this.x, newY)) {
            this.y = newY;
        }
        
        // Set facing
        if (Math.abs(dx) > Math.abs(dy)) {
            this.facing = dx > 0 ? 'right' : 'left';
        } else {
            this.facing = dy > 0 ? 'down' : 'up';
        }
        
        this.isMoving = true;
    }
    
    idleMovement(dt) {
        this.idleTime -= dt;
        this.isMoving = false;
        
        if (this.idleTime <= 0) {
            // Change direction
            const angle = Math.random() * Math.PI * 2;
            this.moveDirection.x = Math.cos(angle);
            this.moveDirection.y = Math.sin(angle);
            this.idleTime = 1 + Math.random() * 3;
            
            // Check if direction is walkable
            const testX = this.x + this.moveDirection.x * 20;
            const testY = this.y + this.moveDirection.y * 20;
            if (!Game.map || !Game.map.isWalkable(testX, testY)) {
                this.moveDirection.x = 0;
                this.moveDirection.y = 0;
            }
        }
        
        // Move in direction
        if (this.moveDirection.x !== 0 || this.moveDirection.y !== 0) {
            const newX = this.x + this.moveDirection.x * this.speed * 0.3 * dt;
            const newY = this.y + this.moveDirection.y * this.speed * 0.3 * dt;
            
            if (Game.map && Game.map.isWalkable(newX, this.y)) {
                this.x = newX;
                this.isMoving = true;
            }
            if (Game.map && Game.map.isWalkable(this.x, newY)) {
                this.y = newY;
                this.isMoving = true;
            }
        }
    }
    
    attackPlayer(player) {
        if (this.attackCooldown <= 0) {
            // Deal damage to player
            const damage = Math.max(1, this.attack - Math.floor(player.defense / 2));
            const actualDamage = player.takeDamage(damage);
            
            // Show damage
            Game.showDamageText(player.x, player.y - 20, actualDamage, false);
            Game.spawnHitParticles(player.x, player.y);
            Game.playSound('hit');
            
            this.attackCooldown = 1.5; // 1.5 second cooldown
            
            // Check if player died
            if (player.hp <= 0) {
                Game.showNotification('💀 Bạn đã chết!');
                // Respawn
                setTimeout(() => {
                    player.hp = player.maxHp;
                    player.mp = player.maxMp;
                    player.x = Game.map.width / 2;
                    player.y = Game.map.height / 2;
                    Game.showNotification('🔄 Đã hồi sinh!');
                }, 2000);
            }
        }
    }
    
    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.defense);
        this.hp -= actualDamage;
        this.hitFlash = 0.2;
        return actualDamage;
    }
    
    getDrop() {
        // Check drops
        for (const drop of this.drops) {
            if (Math.random() < drop.chance) {
                return {
                    id: drop.id,
                    name: drop.name,
                    icon: drop.icon,
                    type: 'item'
                };
            }
        }
        return null;
    }
    
    render(ctx) {
        const size = this.size;
        const x = this.x - size/2;
        const y = this.y - size/2;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + size/2, size/2, size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Flash when hit
        if (this.hitFlash > 0) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = this.color;
        }
        
        // Draw enemy based on type
        if (this.type === 'slime') {
            // Slime body
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + 4, size/2, size/2 - 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x - 6, this.y - 2, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 6, this.y - 2, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(this.x - 6 + (this.facing === 'left' ? -2 : 2), this.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 6 + (this.facing === 'left' ? -2 : 2), this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'goblin' || this.type === 'orc') {
            // Body
            ctx.fillRect(x + 4, y + 8, size - 8, size - 12);
            // Head
            ctx.fillRect(x + 2, y, size - 4, size - 8);
            // Ears
            ctx.fillRect(x - 2, y + 2, 4, 6);
            ctx.fillRect(x + size - 2, y + 2, 4, 6);
            // Eyes
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + 6, y + 4, 4, 4);
            ctx.fillRect(x + size - 10, y + 4, 4, 4);
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 7, y + 5, 2, 2);
            ctx.fillRect(x + size - 9, y + 5, 2, 2);
        } else if (this.type === 'wolf') {
            // Body
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + 4, size/2, size/2 - 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // Head
            ctx.beginPath();
            ctx.ellipse(this.x + (this.facing === 'right' ? 8 : -8), this.y - 4, 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            // Ears
            ctx.fillRect(x + (this.facing === 'right' ? 8 : -4), y - 6, 4, 6);
            ctx.fillRect(x + (this.facing === 'right' ? 16 : 8), y - 6, 4, 6);
            // Eyes
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + (this.facing === 'right' ? 10 : 2), y - 2, 3, 3);
            ctx.fillRect(x + (this.facing === 'right' ? 18 : 10), y - 2, 3, 3);
        } else if (this.type === 'skeleton') {
            // Body
            ctx.fillRect(x + 6, y + 12, size - 12, size - 16);
            // Ribs
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(x + 4, y + 16 + i * 4, size - 8, 2);
            }
            // Head
            ctx.fillRect(x + 2, y, size - 4, size - 8);
            // Eyes
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(x + 6, y + 4, 4, 6);
            ctx.fillRect(x + size - 10, y + 4, 4, 6);
        } else if (this.type === 'boss') {
            // Big boss body
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size/2);
            gradient.addColorStop(0, '#ff6666');
            gradient.addColorStop(1, '#cc0000');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y + 4, size/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Crown
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(x + 4, y - 8, size - 8, 8);
            for (let i = 0; i < 5; i++) {
                const cx = x + 4 + i * ((size - 8) / 4);
                ctx.fillRect(cx, y - 12, 4, 6);
            }
            
            // Eyes
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + 6, y + 2, 6, 8);
            ctx.fillRect(x + size - 12, y + 2, 6, 8);
            ctx.fillStyle = '#f00';
            ctx.fillRect(x + 8, y + 4, 2, 4);
            ctx.fillRect(x + size - 10, y + 4, 2, 4);
        }
        
        // HP Bar
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(x, y - 12, size, 4);
        ctx.fillStyle = this.hp / this.maxHp > 0.5 ? '#44ff44' : '#ff4444';
        ctx.fillRect(x, y - 12, size * (this.hp / this.maxHp), 4);
        
        // Name
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, y - 16);
    }
}