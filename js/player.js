// ============================================
// PLAYER - Player character logic
// ============================================

class Player {
    constructor(data) {
        // Basic info
        this.name = data.name || 'Hero';
        this.gender = data.gender || 'male';
        this.hair = data.hair || 'brown';
        this.outfit = data.outfit || 'adventurer';
        
        // Stats
        this.level = data.level || 1;
        this.exp = data.exp || 0;
        this.expToNext = this.calculateExpToNext();
        
        this.hp = data.hp || 100;
        this.maxHp = data.maxHp || 100;
        this.mp = data.mp || 50;
        this.maxMp = data.maxMp || 50;
        
        this.baseAttack = data.attack || 10;
        this.baseDefense = data.defense || 5;
        this.speed = data.speed || 5;
        
        this.gold = data.gold || 0;
        
        // Position
        this.x = 0;
        this.y = 0;
        this.direction = 0; // 0=down, 1=left, 2=right, 3=up
        this.facing = 'down';
        
        // Animation
        this.frame = 0;
        this.frameTimer = 0;
        this.isMoving = false;
        this.moveTimer = 0;
        
        // Inventory
        this.inventory = data.inventory || [];
        this.maxInventory = 20;
        
        // Equipment
        this.equipment = data.equipment || {
            weapon: null,
            helmet: null,
            armor: null,
            accessory: null
        };
        
        // Skills
        this.skills = [
            {
                name: 'Tấn công',
                type: 'damage',
                damage: 0,
                manaCost: 0,
                cooldown: 0.3,
                icon: '⚔️'
            },
            {
                name: 'Fireball',
                type: 'damage',
                damage: 40,
                manaCost: 10,
                cooldown: 3,
                icon: '🔥'
            },
            {
                name: 'Lightning',
                type: 'damage',
                damage: 70,
                manaCost: 20,
                cooldown: 7,
                icon: '⚡'
            },
            {
                name: 'Shield',
                type: 'shield',
                duration: 5,
                manaCost: 15,
                cooldown: 10,
                icon: '🛡️'
            }
        ];
        
        this.skillCooldowns = [0, 0, 0, 0];
        
        // Status effects
        this.shieldActive = false;
        this.shieldTimer = 0;
        
        // Update stats from equipment
        this.updateStats();
    }
    
    calculateExpToNext() {
        return Math.floor(100 * Math.pow(1.2, this.level - 1));
    }
    
    updateStats() {
        // Start with base stats        this.attack = this.baseAttack;
        this.defense = this.baseDefense;
        
        // Add equipment bonuses
        for (const slot in this.equipment) {
            const item = this.equipment[slot];
            if (item) {
                this.attack += item.attackBonus || 0;
                this.defense += item.defenseBonus || 0;
                if (item.hpBonus) this.maxHp += item.hpBonus;
                if (item.mpBonus) this.maxMp += item.mpBonus;
            }
        }
    }
    
    gainExp(amount) {
        this.exp += amount;
        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.expToNext = this.calculateExpToNext();
        
        // Increase stats
        this.maxHp += 20 + Math.floor(this.level * 2);
        this.maxMp += 10 + Math.floor(this.level * 1.5);
        this.baseAttack += 3 + Math.floor(this.level / 2);
        this.baseDefense += 2 + Math.floor(this.level / 3);
        this.speed += 0.5;
        
        // Full heal
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        
        // Update stats
        this.updateStats();
        
        // Show level up notification
        Game.showNotification(`🎉 LEVEL UP! Bạn đã đạt level ${this.level}!`);
        Game.playSound('levelUp');
    }
    
    calculateDamage() {
        const base = this.attack;
        const variance = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, base + variance);
    }
    
    takeDamage(damage) {
        // Shield reduces damage
        if (this.shieldActive) {
            damage = Math.floor(damage * 0.5);
        }
        
        // Defense reduces damage
        const reducedDamage = Math.max(1, damage - Math.floor(this.defense / 2));
        this.hp -= reducedDamage;
        
        if (this.hp < 0) this.hp = 0;
        return reducedDamage;
    }
    
    useSkill(index) {
        const skill = this.skills[index];
        if (!skill) return false;
        
        // Check cooldown
        if (this.skillCooldowns[index] > 0) {
            Game.showNotification(`⏳ ${skill.name} đang hồi chiêu!`);
            return false;
        }
        
        // Check mana
        if (this.mp < skill.manaCost) {
            Game.showNotification('❌ Không đủ MP!');
            return false;
        }
        
        // Use skill
        this.mp -= skill.manaCost;
        this.skillCooldowns[index] = skill.cooldown;
        
        // Update cooldowns
        setTimeout(() => {
            this.skillCooldowns[index] = 0;
        }, skill.cooldown * 1000);
        
        return true;
    }
    
    update(dt, keys) {
        // Update cooldowns
        for (let i = 0; i < this.skillCooldowns.length; i++) {
            if (this.skillCooldowns[i] > 0) {
                this.skillCooldowns[i] -= dt;
                if (this.skillCooldowns[i] < 0) this.skillCooldowns[i] = 0;
            }
        }
        
        // Update shield
        if (this.shieldActive) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) {
                this.shieldActive = false;
                Game.showNotification('🛡️ Khiên đã hết hiệu lực');
            }
        }
        
        // Movement
        let dx = 0, dy = 0;
        this.isMoving = false;
        
        if (keys['w'] || keys['arrowup']) {
            dy = -this.speed;
            this.facing = 'up';
            this.isMoving = true;
        }
        if (keys['s'] || keys['arrowdown']) {
            dy = this.speed;
            this.facing = 'down';
            this.isMoving = true;
        }
        if (keys['a'] || keys['arrowleft']) {
            dx = -this.speed;
            this.facing = 'left';
            this.isMoving = true;
        }
        if (keys['d'] || keys['arrowright']) {
            dx = this.speed;
            this.facing = 'right';
            this.isMoving = true;
        }
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }
        
        // Move
        if (dx !== 0 || dy !== 0) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            
            // Check collision with map
            if (Game.map && Game.map.isWalkable(newX, this.y)) {
                this.x = newX;
            }
            if (Game.map && Game.map.isWalkable(this.x, newY)) {
                this.y = newY;
            }
            
            // Animation
            this.moveTimer += dt;
            if (this.moveTimer > 0.15) {
                this.moveTimer = 0;
                this.frame = (this.frame + 1) % 4;
            }
        } else {
            this.frame = 0;
            this.moveTimer = 0;
        }
        
        // Keep player in bounds
        if (Game.map) {
            this.x = Math.max(0, Math.min(Game.map.width - 1, this.x));
            this.y = Math.max(0, Math.min(Game.map.height - 1, this.y));
        }
        
        // Regenerate MP slowly
        if (this.mp < this.maxMp) {
            this.mp += 0.5 * dt;
            if (this.mp > this.maxMp) this.mp = this.maxMp;
        }
    }
    
    render(ctx) {
        const size = 32;
        const x = this.x - size/2;
        const y = this.y - size/2;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + size/2, size/2, size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        const colors = this.getColors();
        
        // Draw body based on outfit
        ctx.fillStyle = colors.body;
        ctx.fillRect(x + 8, y + 12, 16, 14);
        
        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(x + 10, y + 4, 12, 10);
        
        // Hair
        ctx.fillStyle = colors.hair;
        if (this.hair === 'brown') ctx.fillStyle = '#8B6914';
        else if (this.hair === 'black') ctx.fillStyle = '#1a1a1a';
        else if (this.hair === 'blonde') ctx.fillStyle = '#FFD700';
        else if (this.hair === 'red') ctx.fillStyle = '#FF4500';
        else if (this.hair === 'white') ctx.fillStyle = '#C0C0C0';
        
        ctx.fillRect(x + 8, y + 2, 16, 4);
        ctx.fillRect(x + 6, y + 4, 4, 2);
        ctx.fillRect(x + 22, y + 4, 4, 2);
        
        // Eyes
        ctx.fillStyle = '#333';
        if (this.facing === 'right' || this.facing === 'down') {
            ctx.fillRect(x + 13, y + 7, 2, 2);
            ctx.fillRect(x + 17, y + 7, 2, 2);
        } else if (this.facing === 'left') {
            ctx.fillRect(x + 11, y + 7, 2, 2);
            ctx.fillRect(x + 15, y + 7, 2, 2);
        } else {
            ctx.fillRect(x + 11, y + 7, 2, 2);
            ctx.fillRect(x + 17, y + 7, 2, 2);
        }
        
        // Outfit details
        if (this.outfit === 'knight') {
            ctx.fillStyle = '#8888aa';
            ctx.fillRect(x + 6, y + 14, 4, 10);
            ctx.fillRect(x + 22, y + 14, 4, 10);
            // Helmet
            ctx.fillStyle = '#aaaacc';
            ctx.fillRect(x + 9, y + 2, 14, 6);
        } else if (this.outfit === 'mage') {
            ctx.fillStyle = '#6666aa';
            ctx.fillRect(x + 6, y + 14, 20, 12);
            // Hat
            ctx.fillStyle = '#4444aa';
            ctx.fillRect(x + 10, y, 12, 6);
            ctx.fillRect(x + 12, y - 2, 8, 4);
        } else if (this.outfit === 'rogue') {
            ctx.fillStyle = '#666666';
            ctx.fillRect(x + 6, y + 14, 20, 12);
            // Mask
            ctx.fillStyle = '#444444';
            ctx.fillRect(x + 10, y + 4, 12, 4);
        }
        
        // Weapon
        if (this.equipment.weapon) {
            ctx.fillStyle = '#cccc88';
            ctx.fillRect(x + 24, y + 6, 4, 16);
            ctx.fillRect(x + 22, y + 4, 8, 4);
        }
        
        // Shield effect
        if (this.shieldActive) {
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 28, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    getColors() {
        return {
            skin: '#f5d0b8',
            body: this.outfit === 'adventurer' ? '#448844' :
                   this.outfit === 'knight' ? '#8888aa' :
                   this.outfit === 'mage' ? '#6666aa' : '#666666'
        };
    }
    
    toJSON() {
        return {
            name: this.name,
            gender: this.gender,
            hair: this.hair,
            outfit: this.outfit,
            level: this.level,
            exp: this.exp,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            baseAttack: this.baseAttack,
            baseDefense: this.baseDefense,
            speed: this.speed,
            gold: this.gold,
            inventory: this.inventory,
            equipment: this.equipment,
            x: this.x,
            y: this.y
        };
    }
    
    static fromJSON(data) {
        return new Player(data);
    }
}