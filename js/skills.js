// ============================================
// SKILLS - Skill system with effects
// ============================================

// Skill definitions
const SKILL_DEFINITIONS = {
    fireball: {
        id: 'fireball',
        name: 'Fireball',
        icon: '🔥',
        type: 'damage',
        damage: 40,
        manaCost: 10,
        cooldown: 3,
        description: 'Gây 40 sát thương cho kẻ địch',
        range: 200,
        color: '#ff4400'
    },
    lightning: {
        id: 'lightning',
        name: 'Lightning',
        icon: '⚡',
        type: 'damage',
        damage: 70,
        manaCost: 20,
        cooldown: 7,
        description: 'Gây 70 sát thương cho kẻ địch',
        range: 250,
        color: '#ffdd00'
    },
    shield: {
        id: 'shield',
        name: 'Shield',
        icon: '🛡️',
        type: 'shield',
        duration: 5,
        manaCost: 15,
        cooldown: 10,
        description: 'Giảm 50% sát thương trong 5 giây',
        color: '#44ddff'
    },
    heal: {
        id: 'heal',
        name: 'Heal',
        icon: '💚',
        type: 'heal',
        healAmount: 50,
        manaCost: 15,
        cooldown: 8,
        description: 'Hồi phục 50 HP',
        color: '#44ff44'
    },
    berserk: {
        id: 'berserk',
        name: 'Berserk',
        icon: '⚔️',
        type: 'buff',
        duration: 10,
        attackBonus: 20,
        manaCost: 25,
        cooldown: 15,
        description: 'Tăng 20 sát thương trong 10 giây',
        color: '#ff4444'
    }
};

class SkillManager {
    constructor(player) {
        this.player = player;
        this.skills = [];
        this.cooldowns = {};
        this.activeBuffs = {};
        
        // Initialize skills
        this.initializeSkills();
    }
    
    initializeSkills() {
        // Add default skills
        this.addSkill('fireball');
        this.addSkill('lightning');
        this.addSkill('shield');
        this.addSkill('heal');
        
        // Unlock berserk at level 5
        if (this.player.level >= 5) {
            this.addSkill('berserk');
        }
    }
    
    addSkill(skillId) {
        const skillDef = SKILL_DEFINITIONS[skillId];
        if (!skillDef) return false;
        
        // Check if skill already exists
        if (this.skills.find(s => s.id === skillId)) {
            return false;
        }
        
        this.skills.push({
            ...skillDef,
            unlocked: true,
            level: 1
        });
        
        this.cooldowns[skillId] = 0;
        return true;
    }
    
    useSkill(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill || !skill.unlocked) {
            Game.showNotification('❌ Kỹ năng chưa được mở khóa!');
            return false;
        }
        
        // Check cooldown
        if (this.cooldowns[skillId] > 0) {
            Game.showNotification(`⏳ ${skill.name} đang hồi chiêu!`);
            return false;
        }
        
        // Check mana
        if (this.player.mp < skill.manaCost) {
            Game.showNotification('❌ Không đủ MP!');
            return false;
        }
        
        // Use skill
        this.player.mp -= skill.manaCost;
        this.cooldowns[skillId] = skill.cooldown;
        
        // Apply skill effect
        this.applySkillEffect(skill);
        
        // Start cooldown
        setTimeout(() => {
            this.cooldowns[skillId] = 0;
        }, skill.cooldown * 1000);
        
        return true;
    }
    
    applySkillEffect(skill) {
        switch(skill.type) {
            case 'damage':
                this.applyDamageSkill(skill);
                break;
            case 'shield':
                this.applyShieldSkill(skill);
                break;
            case 'heal':
                this.applyHealSkill(skill);
                break;
            case 'buff':
                this.applyBuffSkill(skill);
                break;
        }
    }
    
    applyDamageSkill(skill) {
        const damage = skill.damage * (1 + this.player.level * 0.1);
        let hitCount = 0;
        
        // Find enemies in range
        for (const enemy of Game.enemies) {
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < skill.range) {
                const actualDamage = enemy.takeDamage(damage);
                Game.showDamageText(enemy.x, enemy.y - 20, actualDamage, false);
                Game.spawnHitParticles(enemy.x, enemy.y);
                hitCount++;
                
                // Skill particles
                this.spawnSkillParticles(enemy.x, enemy.y, skill.color);
                
                if (enemy.hp <= 0) {
                    Game.enemyDefeated(enemy);
                }
            }
        }
        
        if (hitCount > 0) {
            Game.playSound('hit');
            Game.showNotification(`✨ ${skill.name} gây ${damage} sát thương lên ${hitCount} kẻ địch!`);
        } else {
            Game.showNotification('❌ Không có kẻ địch nào trong tầm!');
        }
    }
    
    applyShieldSkill(skill) {
        this.player.shieldActive = true;
        this.player.shieldTimer = skill.duration;
        Game.showNotification(`🛡️ Khiên bảo vệ kích hoạt trong ${skill.duration} giây!`);
        Game.playSound('levelUp');
        
        // Shield particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 25 + Math.random() * 15;
            Game.particles.push({
                x: this.player.x + Math.cos(angle) * radius,
                y: this.player.y + Math.sin(angle) * radius,
                vx: 0,
                vy: 0,
                life: skill.duration,
                maxLife: skill.duration,
                size: 4,
                color: '#44ddff',
                update(dt) {
                    this.life -= dt;
                    this.size *= 0.99;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha * 0.5;
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
        }
    }
    
    applyHealSkill(skill) {
        const healAmount = skill.healAmount * (1 + this.player.level * 0.05);
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        Game.showNotification(`💚 Đã hồi phục ${Math.floor(healAmount)} HP!`);
        Game.playSound('pickup');
        
        // Heal particles
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 30;
            Game.particles.push({
                x: this.player.x + Math.cos(angle) * dist,
                y: this.player.y + Math.sin(angle) * dist - 20,
                vx: (Math.random() - 0.5) * 30,
                vy: -20 - Math.random() * 40,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                size: 2 + Math.random() * 4,
                color: `hsl(120, 80%, ${50 + Math.random() * 30}%)`,
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.vy += 30 * dt;
                    this.life -= dt;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            });
        }
    }
    
    applyBuffSkill(skill) {
        this.activeBuffs[skill.id] = {
            ...skill,
            remaining: skill.duration,
            originalAttack: this.player.attack
        };
        
        // Apply buff
        this.player.attack += skill.attackBonus;
        
        Game.showNotification(`⚔️ ${skill.name} kích hoạt! +${skill.attackBonus} sát thương!`);
        Game.playSound('levelUp');
        
        // Buff particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 40;
            Game.particles.push({
                x: this.player.x + Math.cos(angle) * dist,
                y: this.player.y + Math.sin(angle) * dist - 20,
                vx: (Math.random() - 0.5) * 50,
                vy: -30 - Math.random() * 50,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                size: 3 + Math.random() * 4,
                color: `hsl(0, 80%, ${50 + Math.random() * 30}%)`,
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.vy += 20 * dt;
                    this.life -= dt;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            });
        }
        
        // Remove buff after duration
        setTimeout(() => {
            this.removeBuff(skill.id);
        }, skill.duration * 1000);
    }
    
    removeBuff(skillId) {
        const buff = this.activeBuffs[skillId];
        if (!buff) return;
        
        // Restore original attack
        this.player.attack = buff.originalAttack;
        delete this.activeBuffs[skillId];
        
        Game.showNotification(`⏳ ${buff.name} đã hết hiệu lực`);
    }
    
    spawnSkillParticles(x, y, color) {
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 150;
            const size = 3 + Math.random() * 6;
            
            Game.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50,
                life: 0.5 + Math.random() * 0.8,
                maxLife: 0.5 + Math.random() * 0.8,
                size: size,
                color: color,
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.vy += 100 * dt;
                    this.life -= dt;
                    this.size *= 0.98;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.shadowColor = this.color;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1;
                }
            });
        }
    }
    
    update(dt) {
        // Update cooldowns
        for (const skillId in this.cooldowns) {
            if (this.cooldowns[skillId] > 0) {
                this.cooldowns[skillId] -= dt;
                if (this.cooldowns[skillId] < 0) {
                    this.cooldowns[skillId] = 0;
                }
            }
        }
        
        // Update buffs
        for (const skillId in this.activeBuffs) {
            this.activeBuffs[skillId].remaining -= dt;
            if (this.activeBuffs[skillId].remaining <= 0) {
                this.removeBuff(skillId);
            }
        }
    }
    
    getCooldown(skillId) {
        return this.cooldowns[skillId] || 0;
    }
    
    getSkillStatus(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) return null;
        
        return {
            skill: skill,
            cooldown: this.getCooldown(skillId),
            isReady: this.getCooldown(skillId) <= 0 && this.player.mp >= skill.manaCost
        };
    }
}