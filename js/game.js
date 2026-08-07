// ============================================
// GAME ENGINE - Main game loop and management
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const Game = {
    state: 'menu', // menu, creation, playing, paused
    player: null,
    enemies: [],
    npcs: [],
    items: [],
    particles: [],
    damageTexts: [],
    map: null,
    camera: { x: 0, y: 0 },
    keys: {},
    mouse: { x: 0, y: 0, clicked: false },
    lastTime: 0,
    deltaTime: 0,
    gameTime: 0,
    fps: 0,
    frameCount: 0,
    fpsTimer: 0,
    
    // Combat
    attackCooldown: 0,
    attackTimer: 0,
    isAttacking: false,
    attackAngle: 0,
    
    // UI
    showInventory: false,
    showShop: false,
    showQuest: false,
    showDialogue: false,
    showPause: false,
    activeNPC: null,
    
    // Sound
    soundEnabled: true,
    audioContext: null,
    
    // Save
    saveData: null,
    autoSaveInterval: null,
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupControls();
        this.loadSave();
        this.showMainMenu();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gameLoop();
    },
    
    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    
    setupControls() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key === ' ' || e.key === 'Space') {
                e.preventDefault();
                if (this.state === 'playing') {
                    this.playerAttack();
                }
            }
            
            if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                this.toggleInventory();
            }
            
            if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                this.interact();
            }
            
            if (e.key === 'Escape') {
                e.preventDefault();
                this.togglePause();
            }
            
            if (e.key >= '1' && e.key <= '4') {
                const index = parseInt(e.key) - 1;
                this.useSkill(index);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse
        canvas.addEventListener('click', (e) => {
            if (this.state === 'playing') {
                const rect = canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                this.mouse.clicked = true;
                this.playerAttack();
            }
        });
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.state === 'playing') {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                this.mouse.x = touch.clientX - rect.left;
                this.mouse.y = touch.clientY - rect.top;
                this.mouse.clicked = true;
                this.playerAttack();
            }
        });
    },
    
    // ============ GAME LOOP ============
    gameLoop(timestamp) {
        if (this.lastTime === 0) this.lastTime = timestamp;
        this.deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;
        this.gameTime += this.deltaTime;
        
        // FPS counter
        this.frameCount++;
        this.fpsTimer += this.deltaTime;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
        
        if (this.state === 'playing') {
            this.update();
            this.render();
        }
        
        requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    // ============ UPDATE ============
    update() {
        // Update player
        if (this.player) {
            this.player.update(this.deltaTime, this.keys);
            this.camera.x = this.player.x - canvas.width / 2;
            this.camera.y = this.player.y - canvas.height / 2;
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.deltaTime, this.player);
            
            if (enemy.hp <= 0) {
                this.enemyDefeated(enemy);
                this.enemies.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(this.deltaTime);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update damage texts
        for (let i = this.damageTexts.length - 1; i >= 0; i--) {
            this.damageTexts[i].update(this.deltaTime);
            if (this.damageTexts[i].life <= 0) {
                this.damageTexts.splice(i, 1);
            }
        }
        
        // Attack cooldown
        if (this.attackTimer > 0) {
            this.attackTimer -= this.deltaTime;
        }
        
        // Spawn enemies if needed
        this.spawnEnemies();
        
        // Check interactions
        this.checkInteractions();
    },
    
    // ============ RENDER ============
    render() {
        ctx.save();
        
        // Clear canvas
        ctx.fillStyle = '#2d5a3d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply camera
        ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw map
        if (this.map) {
            this.map.render(ctx);
        }
        
        // Draw items on ground
        for (const item of this.items) {
            this.drawItem(item);
        }
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }
        
        // Draw player
        if (this.player) {
            this.player.render(ctx);
        }
        
        // Draw particles
        for (const particle of this.particles) {
            particle.render(ctx);
        }
        
        // Draw damage texts
        for (const text of this.damageTexts) {
            text.render(ctx);
        }
        
        ctx.restore();
        
        // Draw UI elements (not affected by camera)
        this.drawUI();
    },
    
    // ============ PLAYER ============
    playerAttack() {
        if (!this.player || this.isAttacking || this.attackTimer > 0) return;
        
        this.isAttacking = true;
        this.attackTimer = 0.3; // Cooldown
        
        // Get mouse position in world space
        const rect = canvas.getBoundingClientRect();
        const worldX = this.mouse.x + this.camera.x;
        const worldY = this.mouse.y + this.camera.y;
        
        const angle = Math.atan2(worldY - this.player.y, worldX - this.player.x);
        this.attackAngle = angle;
        
        // Check hit on enemies
        const attackRange = 50;
        const attackRadius = 30;
        
        for (const enemy of this.enemies) {
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < attackRange + attackRadius) {
                const enemyAngle = Math.atan2(dy, dx);
                const angleDiff = Math.abs(this.normalizeAngle(angle - enemyAngle));
                
                if (angleDiff < 1.0) { // 60 degree cone
                    const damage = this.player.calculateDamage();
                    const isCritical = Math.random() < 0.15;
                    const finalDamage = isCritical ? damage * 2 : damage;
                    
                    enemy.takeDamage(finalDamage);
                    
                    // Show damage
                    this.showDamageText(enemy.x, enemy.y - 20, finalDamage, isCritical);
                    
                    // Hit particles
                    this.spawnHitParticles(enemy.x, enemy.y);
                    
                    // Play sound
                    this.playSound('hit');
                    
                    if (enemy.hp <= 0) {
                        this.enemyDefeated(enemy);
                    }
                }
            }
        }
        
        // Attack animation
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
    },
    
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    },
    
    // ============ ENEMIES ============
    spawnEnemies() {
        if (this.enemies.length < 10) {
            const spawnChance = 0.02;
            if (Math.random() < spawnChance) {
                const enemyTypes = ['slime', 'goblin', 'wolf'];
                const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                
                // Spawn near edges of screen
                const angle = Math.random() * Math.PI * 2;
                const distance = 300 + Math.random() * 200;
                const x = this.player.x + Math.cos(angle) * distance;
                const y = this.player.y + Math.sin(angle) * distance;
                
                // Check if on valid terrain
                if (this.map && !this.map.isWalkable(x, y)) return;
                
                const enemy = new Enemy(type, x, y);
                this.enemies.push(enemy);
            }
        }
    },
    
    enemyDefeated(enemy) {
        // Give EXP and Gold
        this.player.gainExp(enemy.exp);
        this.player.gold += enemy.gold;
        
        // Drop items
        if (Math.random() < enemy.dropRate) {
            const item = enemy.getDrop();
            if (item) {
                this.items.push({
                    x: enemy.x,
                    y: enemy.y,
                    ...item,
                    life: 30 // seconds before disappearing
                });
            }
        }
        
        // Show notification
        this.showNotification(`+${enemy.exp} EXP, +${enemy.gold} Gold`);
        
        // Death particles
        this.spawnDeathParticles(enemy.x, enemy.y, enemy.color);
        
        // Play sound
        this.playSound('enemyDie');
    },
    
    // ============ PARTICLES ============
    spawnHitParticles(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                size: 2 + Math.random() * 4,
                color: `hsl(0, 80%, ${50 + Math.random() * 30}%)`,
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.vy += 200 * dt;
                    this.life -= dt;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                    ctx.globalAlpha = 1;
                }
            });
        }
    },
    
    spawnDeathParticles(x, y, color) {
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 150;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 100,
                life: 1 + Math.random(),
                maxLife: 1 + Math.random(),
                size: 3 + Math.random() * 5,
                color: color,
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.vy += 200 * dt;
                    this.life -= dt;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                    ctx.globalAlpha = 1;
                }
            });
        }
    },
    
    // ============ DAMAGE TEXT ============
    showDamageText(x, y, damage, isCritical) {
        this.damageTexts.push({
            x: x,
            y: y,
            text: isCritical ? `⚡ ${damage}` : `-${damage}`,
            color: isCritical ? '#ff6b35' : '#ff4444',
            life: 1.0,
            maxLife: 1.0,
            vy: -60,
            size: isCritical ? 24 : 18,
            update(dt) {
                this.y += this.vy * dt;
                this.vy += 20 * dt;
                this.life -= dt;
            },
            render(ctx) {
                const alpha = this.life / this.maxLife;
                ctx.globalAlpha = alpha;
                ctx.font = `bold ${this.size}px 'Press Start 2P', monospace`;
                ctx.textAlign = 'center';
                ctx.fillStyle = this.color;
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 10;
                ctx.fillText(this.text, this.x, this.y);
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        });
    },
    
    // ============ INTERACTIONS ============
    checkInteractions() {
        if (!this.player || !this.npcs) return;
        
        let nearNPC = null;
        for (const npc of this.npcs) {
            const dx = npc.x - this.player.x;
            const dy = npc.y - this.player.y;
            if (Math.sqrt(dx*dx + dy*dy) < 60) {
                nearNPC = npc;
                break;
            }
        }
        
        const hint = document.getElementById('interactionHint');
        if (nearNPC) {
            hint.style.display = 'block';
            this.activeNPC = nearNPC;
        } else {
            hint.style.display = 'none';
            this.activeNPC = null;
        }
    },
    
    interact() {
        if (this.activeNPC) {
            this.showDialogue(this.activeNPC);
        }
    },
    
    // ============ UI ============
    drawUI() {
        // Update HUD
        if (this.player) {
            document.getElementById('hudName').textContent = this.player.name;
            document.getElementById('hudLevel').textContent = this.player.level;
            document.getElementById('hudGold').textContent = this.player.gold;
            
            const hpPercent = (this.player.hp / this.player.maxHp) * 100;
            const mpPercent = (this.player.mp / this.player.maxMp) * 100;
            const expPercent = (this.player.exp / this.player.expToNext) * 100;
            
            document.getElementById('hpBar').style.width = hpPercent + '%';
            document.getElementById('mpBar').style.width = mpPercent + '%';
            document.getElementById('expBar').style.width = expPercent + '%';
            
            document.getElementById('hpText').textContent = `${Math.floor(this.player.hp)}/${this.player.maxHp}`;
            document.getElementById('mpText').textContent = `${Math.floor(this.player.mp)}/${this.player.maxMp}`;
            document.getElementById('expText').textContent = `${Math.floor(this.player.exp)}/${this.player.expToNext}`;
        }
    },
    
    // ============ NOTIFICATIONS ============
    showNotification(text, duration = 2000) {
        const notification = document.getElementById('notification');
        notification.textContent = text;
        notification.style.display = 'block';
        
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    },
    
    // ============ SOUND ============
    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            switch(type) {
                case 'hit':
                    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    break;
                case 'enemyDie':
                    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                    break;
                case 'levelUp':
                    oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                    break;
                case 'pickup':
                    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    break;
                case 'buy':
                    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.2);
                    break;
            }
        } catch(e) {
            // Silent fail if audio not supported
        }
    },
    
    // ============ MENU ============
    showMainMenu() {
        document.getElementById('mainMenu').style.display = 'flex';
        document.getElementById('characterCreation').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'none';
        this.state = 'menu';
        
        // Check for save
        const hasSave = localStorage.getItem('miniRpgSave') !== null;
        document.getElementById('continueBtn').disabled = !hasSave;
    },
    
    showCharacterCreation() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('characterCreation').style.display = 'flex';
    },
    
    startGame(playerData) {
        document.getElementById('characterCreation').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Initialize player
        this.player = new Player(playerData);
        this.map = new Map();
        
        // Position player in center of map
        this.player.x = this.map.width / 2;
        this.player.y = this.map.height / 2;
        
        // Initialize NPCs
        this.npcs = [
            new NPC('shop', 200, 200, '🏪', 'Merchant', 'Chào mừng đến cửa hàng của tôi!'),
            new NPC('quest', 400, 300, '📜', 'Elder', 'Ta có nhiệm vụ cho ngươi...'),
            new NPC('heal', 600, 250, '💚', 'Healer', 'Ta có thể hồi phục cho ngươi.'),
        ];
        
        this.state = 'playing';
        this.showNotification('⚔️ Chào mừng đến thế giới RPG!');
        
        // Auto-save
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        this.autoSaveInterval = setInterval(() => this.saveGame(), 30000);
    },
    
    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseMenu').style.display = 'flex';
        } else if (this.state === 'paused') {
            this.resumeGame();
        }
    },
    
    resumeGame() {
        this.state = 'playing';
        document.getElementById('pauseMenu').style.display = 'none';
    },
    
    toggleInventory() {
        if (this.state !== 'playing') return;
        this.showInventory = !this.showInventory;
        document.getElementById('inventoryUI').style.display = this.showInventory ? 'flex' : 'none';
        if (this.showInventory) {
            this.renderInventory();
        }
    },
    
    // ============ SAVE / LOAD ============
    saveGame() {
        if (!this.player) return;
        
        const saveData = {
            player: this.player.toJSON(),
            gameTime: this.gameTime,
            timestamp: Date.now()
        };
        
        localStorage.setItem('miniRpgSave', JSON.stringify(saveData));
        this.showNotification('💾 Game đã được lưu!');
    },
    
    loadSave() {
        const saveString = localStorage.getItem('miniRpgSave');
        if (!saveString) return null;
        
        try {
            const saveData = JSON.parse(saveString);
            this.saveData = saveData;
            return saveData;
        } catch(e) {
            return null;
        }
    },
    
    loadGame() {
        const saveData = this.loadSave();
        if (!saveData) {
            this.showNotification('❌ Không tìm thấy dữ liệu lưu!');
            return;
        }
        
        // Restore player
        this.player = Player.fromJSON(saveData.player);
        this.map = new Map();
        this.state = 'playing';
        
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('pauseMenu').style.display = 'none';
        
        this.showNotification('📂 Đã tải game thành công!');
    },
    
    resetData() {
        if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu game?')) {
            localStorage.removeItem('miniRpgSave');
            this.showNotification('🗑️ Đã xóa dữ liệu!');
            this.showMainMenu();
        }
    },
    
    quitToMenu() {
        this.saveGame();
        this.state = 'menu';
        document.getElementById('pauseMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'flex';
        this.showNotification('🚪 Đã thoát game!');
    },
    
    // ============ DIALOGUE ============
    showDialogue(npc) {
        this.showDialogue = true;
        const dialogueUI = document.getElementById('dialogueUI');
        dialogueUI.style.display = 'flex';
        
        document.getElementById('dialoguePortrait').textContent = npc.emoji;
        document.getElementById('dialogueText').textContent = npc.dialogue;
        
        const options = document.getElementById('dialogueOptions');
        options.innerHTML = '';
        
        if (npc.type === 'shop') {
            const btn = document.createElement('button');
            btn.textContent = '🏪 Mở cửa hàng';
            btn.onclick = () => {
                this.closeDialogue();
                this.openShop();
            };
            options.appendChild(btn);
        } else if (npc.type === 'quest') {
            const btn = document.createElement('button');
            btn.textContent = '📜 Xem nhiệm vụ';
            btn.onclick = () => {
                this.closeDialogue();
                this.openQuest();
            };
            options.appendChild(btn);
        } else if (npc.type === 'heal') {
            const btn = document.createElement('button');
            const cost = 10 + this.player.level * 5;
            btn.textContent = `💚 Hồi phục (${cost} Gold)`;
            btn.onclick = () => {
                if (this.player.gold >= cost) {
                    this.player.gold -= cost;
                    this.player.hp = this.player.maxHp;
                    this.player.mp = this.player.maxMp;
                    this.showNotification('💚 Đã hồi phục đầy đủ!');
                    this.closeDialogue();
                } else {
                    this.showNotification('❌ Không đủ Gold!');
                }
            };
            options.appendChild(btn);
        }
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '👋 Tạm biệt';
        closeBtn.onclick = () => this.closeDialogue();
        options.appendChild(closeBtn);
    },
    
    closeDialogue() {
        this.showDialogue = false;
        document.getElementById('dialogueUI').style.display = 'none';
    },
    
    // ============ SHOP ============
    openShop() {
        this.showShop = true;
        document.getElementById('shopUI').style.display = 'flex';
        document.getElementById('shopGold').textContent = this.player.gold;
        this.renderShop();
    },
    
    closeShop() {
        this.showShop = false;
        document.getElementById('shopUI').style.display = 'none';
    },
    
    // ============ QUEST ============
    openQuest() {
        this.showQuest = true;
        document.getElementById('questUI').style.display = 'flex';
        this.renderQuest();
    },
    
    closeQuest() {
        this.showQuest = false;
        document.getElementById('questUI').style.display = 'none';
    },
    
    // ============ SKILLS ============
    useSkill(index) {
        if (this.state !== 'playing' || !this.player) return;
        
        const skill = this.player.skills[index];
        if (!skill) return;
        
        if (this.player.useSkill(index)) {
            // Skill effect
            if (skill.type === 'damage') {
                // Damage all enemies in range
                for (const enemy of this.enemies) {
                    const dx = enemy.x - this.player.x;
                    const dy = enemy.y - this.player.y;
                    if (Math.sqrt(dx*dx + dy*dy) < 200) {
                        enemy.takeDamage(skill.damage);
                        this.showDamageText(enemy.x, enemy.y - 20, skill.damage, false);
                        this.spawnHitParticles(enemy.x, enemy.y);
                        
                        if (enemy.hp <= 0) {
                            this.enemyDefeated(enemy);
                        }
                    }
                }
                this.showNotification(`🔥 ${skill.name} gây ${skill.damage} sát thương!`);
                this.playSound('hit');
            } else if (skill.type === 'shield') {
                this.player.shieldActive = true;
                this.player.shieldTimer = skill.duration;
                this.showNotification(`🛡️ ${skill.name} kích hoạt!`);
            }
            
            // Cooldown UI
            const btn = document.querySelectorAll('.skill-btn')[index];
            if (btn) {
                btn.classList.add('cooldown');
                setTimeout(() => {
                    btn.classList.remove('cooldown');
                }, skill.cooldown * 1000);
            }
        }
    }
};

// ============ UI EVENT HANDLERS ============
// Menu buttons
document.getElementById('newGameBtn').addEventListener('click', () => {
    Game.showCharacterCreation();
});

document.getElementById('continueBtn').addEventListener('click', () => {
    Game.loadGame();
});

document.getElementById('resetDataBtn').addEventListener('click', () => {
    Game.resetData();
});

// Character creation
document.getElementById('startGameBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value || 'Hero';
    const gender = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
    const hair = document.querySelector('.color-btn.active')?.dataset.hair || 'brown';
    const outfit = document.querySelector('.outfit-btn.active')?.dataset.outfit || 'adventurer';
    
    const playerData = {
        name: name,
        gender: gender,
        hair: hair,
        outfit: outfit,
        level: 1,
        exp: 0,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        attack: 10,
        defense: 5,
        speed: 5,
        gold: 0,
        inventory: [],
        equipment: {
            weapon: null,
            helmet: null,
            armor: null,
            accessory: null
        }
    };
    
    Game.startGame(playerData);
});

// Gender selection
document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Hair color selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Outfit selection
document.querySelectorAll('.outfit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.outfit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Shop tabs
document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        Game.renderShop(tab.dataset.tab);
    });
});

// Skill buttons
document.querySelectorAll('.skill-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        Game.useSkill(index);
    });
});

// Close UI functions
function closeInventory() {
    Game.showInventory = false;
    document.getElementById('inventoryUI').style.display = 'none';
}

function closeShop() {
    Game.closeShop();
}

function closeQuest() {
    Game.closeQuest();
}

function closeDialogue() {
    Game.closeDialogue();
}

function resumeGame() {
    Game.resumeGame();
}

function saveGame() {
    Game.saveGame();
}

function showSettings() {
    Game.showNotification('⚙️ Cài đặt đang được phát triển...');
}

function quitToMenu() {
    Game.quitToMenu();
}

// Initialize game when page loads
window.onload = () => {
    Game.init();
};
// ============================================
// GAME - Additional functions and initialization
// ============================================

// Add to Game object
Game.saveSystem = new SaveSystem();
Game.leaderboard = new Leaderboard();

// Override loadSave to use SaveSystem
Game.loadSave = function() {
    return this.saveSystem.load();
};

// Override saveGame to use SaveSystem
Game.saveGame = function() {
    if (this.saveSystem.save(this)) {
        this.showNotification('💾 Game đã được lưu!');
        return true;
    }
    return false;
};

// Load save data
Game.loadSaveData = function(data) {
    if (!data || !data.player) return false;
    
    this.player = Player.fromJSON(data.player);
    this.map = new Map();
    this.gameTime = data.gameTime || 0;
    
    this.state = 'playing';
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('pauseMenu').style.display = 'none';
    
    // Restore enemies (simplified)
    this.enemies = [];
    
    return true;
};

// Add leaderboard update on level up
const originalLevelUp = Player.prototype.levelUp;
Player.prototype.levelUp = function() {
    originalLevelUp.call(this);
    // Update leaderboard
    if (Game.leaderboard) {
        Game.leaderboard.addEntry(this.name, this.level, this.gold);
    }
};

// Add leaderboard button to menu
document.addEventListener('DOMContentLoaded', () => {
    // Add leaderboard button to main menu
    const menuButtons = document.querySelector('.menu-buttons');
    const leaderboardBtn = document.createElement('button');
    leaderboardBtn.className = 'menu-btn';
    leaderboardBtn.textContent = '🏆 BẢNG XẾP HẠNG';
    leaderboardBtn.onclick = () => showLeaderboard();
    menuButtons.appendChild(leaderboardBtn);
    
    // Add to pause menu
    const pauseButtons = document.querySelector('#pauseMenu .menu-buttons');
    const pauseLeaderboardBtn = document.createElement('button');
    pauseLeaderboardBtn.className = 'menu-btn';
    pauseLeaderboardBtn.textContent = '🏆 Bảng xếp hạng';
    pauseLeaderboardBtn.onclick = () => {
        Game.resumeGame();
        showLeaderboard();
    };
    pauseButtons.appendChild(pauseLeaderboardBtn);
});

// Auto-save on window close
window.addEventListener('beforeunload', () => {
    if (Game.state === 'playing') {
        Game.saveGame();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
        if (Game.state === 'playing') {
            Game.saveGame();
        }
    }
    
    if (e.key === 'q' || e.key === 'Q') {
        if (Game.state === 'playing') {
            Game.openQuest();
        }
    }
});

// Initialize game
console.log('🎮 Mini RPG đang khởi động...');
console.log('📖 Hướng dẫn:');
console.log('  W/A/S/D - Di chuyển');
console.log('  Space/Click - Tấn công');
console.log('  1-4 - Sử dụng kỹ năng');
console.log('  I - Mở túi đồ');
console.log('  E - Tương tác với NPC');
console.log('  Esc - Tạm dừng');
console.log('  L - Lưu game');
console.log('  Q - Mở nhiệm vụ');

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Game.init());
} else {
    Game.init();
}