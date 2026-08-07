<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>G.Legendary - 2D Anime MMORPG</title>
    <style>
        /* ===== RESET ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        body {
            background: #0a0a1a;
            font-family: 'Segoe UI', Arial, sans-serif;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
        }

        /* ===== MAIN MENU ===== */
        #mainMenu {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a1a, #1a1a3e, #0a0a1a);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .menu-container {
            background: rgba(30, 30, 60, 0.95);
            padding: 40px;
            border-radius: 20px;
            border: 2px solid rgba(100, 100, 200, 0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .game-title {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, #ff6b9d, #ffd93d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 5px;
        }

        .game-subtitle {
            color: rgba(255, 255, 255, 0.3);
            font-size: 0.8rem;
            margin-bottom: 25px;
        }

        .menu-btn {
            display: block;
            width: 100%;
            padding: 12px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(100, 100, 200, 0.2);
            border-radius: 10px;
            color: #c0c0ff;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        .menu-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .menu-btn.primary {
            background: linear-gradient(135deg, #6b4c9a, #4a2d7a);
            border-color: #8a6aba;
            color: #fff;
        }

        /* ===== GAME ===== */
        #gameContainer {
            display: none;
            position: relative;
            width: 100vw;
            height: 100vh;
            background: #1a1a3e;
        }

        #gameCanvas {
            display: block;
            width: 100%;
            height: 100%;
            background: #87CEEB;
        }

        /* ===== HUD ===== */
        #hud {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            display: flex;
            justify-content: space-between;
            pointer-events: none;
            z-index: 10;
        }

        .hud-left {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 8px 12px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            pointer-events: auto;
        }

        .hud-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6b4c9a, #4a2d7a);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .hud-info {
            display: flex;
            flex-direction: column;
        }

        .hud-name {
            color: #ffd93d;
            font-size: 0.8rem;
            font-weight: 700;
        }

        .hud-level {
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.6rem;
        }

        .hud-bars {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 100px;
        }

        .hud-bar {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .hud-bar .label {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.5rem;
            min-width: 18px;
        }

        .bar-bg {
            flex: 1;
            height: 8px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s;
        }

        .hp-fill { background: linear-gradient(90deg, #ff4444, #ff6b6b); }
        .mp-fill { background: linear-gradient(90deg, #4444ff, #6b6bff); }
        .exp-fill { background: linear-gradient(90deg, #ffa06b, #ffd93d); }

        .bar-text {
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.4rem;
            min-width: 30px;
            text-align: right;
        }

        .hud-right {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 8px 12px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            pointer-events: auto;
        }

        .hud-gold {
            color: #ffd93d;
            font-size: 0.8rem;
            font-weight: 700;
        }

        .potion-btn {
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            font-size: 0.6rem;
        }

        .potion-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        /* ===== MAIN QUEST ===== */
        #mainQuest {
            position: absolute;
            top: 70px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            backdrop-filter: blur(10px);
            z-index: 10;
            max-width: 250px;
            min-width: 180px;
            padding: 10px 14px;
        }

        #mainQuest .title {
            color: #ffd93d;
            font-size: 0.65rem;
            font-weight: 700;
            margin-bottom: 4px;
        }

        #mainQuest .desc {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.6rem;
        }

        #mainQuest .progress {
            color: rgba(255, 255, 255, 0.3);
            font-size: 0.5rem;
            margin: 4px 0;
        }

        #mainQuest .nav-btn {
            padding: 4px 10px;
            background: linear-gradient(135deg, #6b4c9a, #4a2d7a);
            border: none;
            border-radius: 6px;
            color: #fff;
            cursor: pointer;
            font-size: 0.55rem;
            transition: all 0.3s;
        }

        #mainQuest .nav-btn:hover {
            transform: scale(1.05);
        }

        /* ===== SKILL BAR ===== */
        #skillBar {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 5px;
            background: rgba(0, 0, 0, 0.8);
            padding: 6px 10px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            z-index: 10;
        }

        .skill-slot {
            width: 42px;
            height: 42px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
        }

        .skill-slot:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .skill-slot .key {
            position: absolute;
            top: 2px;
            left: 4px;
            font-size: 0.3rem;
            color: rgba(255, 255, 255, 0.2);
        }

        .skill-slot .icon {
            font-size: 1.1rem;
        }

        .skill-slot .cost {
            font-size: 0.25rem;
            color: rgba(100, 100, 255, 0.4);
        }

        .skill-slot .cooldown {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff6b6b;
            font-size: 0.8rem;
            font-weight: 700;
        }

        /* ===== INTERACTION ===== */
        #interactionHint {
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #ffd93d;
            padding: 5px 12px;
            border-radius: 8px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            font-size: 0.6rem;
            z-index: 10;
            display: none;
        }

        #interactionHint kbd {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            margin: 0 4px;
        }

        /* ===== AUTO BUTTON ===== */
        #autoToggle {
            position: absolute;
            bottom: 80px;
            left: 10px;
            padding: 5px 12px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            font-size: 0.55rem;
            z-index: 10;
            transition: all 0.3s;
        }

        #autoToggle.active {
            border-color: #44ff44;
            color: #44ff44;
        }

        /* ===== NOTIFICATION ===== */
        #notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffd93d;
            padding: 15px 30px;
            border-radius: 12px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            font-size: 1rem;
            z-index: 2000;
            display: none;
            backdrop-filter: blur(10px);
            animation: notifPop 0.3s ease-out;
        }

        @keyframes notifPop {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .game-title { font-size: 1.8rem; }
            .menu-container { padding: 25px; }
            .hud-left { flex-wrap: wrap; padding: 5px 8px; }
            .hud-bars { min-width: 70px; }
            .hud-avatar { width: 30px; height: 30px; font-size: 1rem; }
            .hud-name { font-size: 0.6rem; }
            .hud-gold { font-size: 0.6rem; }
            
            #skillBar { bottom: 10px; padding: 4px 6px; gap: 3px; flex-wrap: wrap; justify-content: center; }
            .skill-slot { width: 34px; height: 34px; }
            .skill-slot .icon { font-size: 0.8rem; }
            
            #mainQuest { max-width: 180px; min-width: 140px; top: 60px; left: 5px; padding: 6px 10px; }
            #mainQuest .title { font-size: 0.55rem; }
            #mainQuest .desc { font-size: 0.5rem; }
            
            .potion-btn { font-size: 0.5rem; padding: 2px 5px; }
            #autoToggle { font-size: 0.45rem; padding: 3px 8px; bottom: 70px; }
        }

        @media (max-width: 480px) {
            .game-title { font-size: 1.4rem; }
            .menu-container { padding: 20px; }
            .menu-btn { font-size: 0.8rem; padding: 10px; }
            
            .hud-left { gap: 5px; padding: 4px 6px; }
            .hud-avatar { width: 25px; height: 25px; font-size: 0.8rem; }
            .hud-bars { min-width: 55px; }
            .hud-bar .label { font-size: 0.4rem; min-width: 14px; }
            .bar-text { font-size: 0.35rem; min-width: 25px; }
            
            .skill-slot { width: 30px; height: 30px; }
            .skill-slot .icon { font-size: 0.7rem; }
            
            #mainQuest { max-width: 150px; min-width: 120px; }
            #mainQuest .title { font-size: 0.5rem; }
            #mainQuest .desc { font-size: 0.45rem; }
            #mainQuest .progress { font-size: 0.4rem; }
            #mainQuest .nav-btn { font-size: 0.45rem; padding: 3px 6px; }
        }
    </style>
</head>
<body>

    <!-- ===== MAIN MENU ===== -->
    <div id="mainMenu">
        <div class="menu-container">
            <div class="game-title">✦ G.LEGENDARY ✦</div>
            <div class="game-subtitle">⚔️ 2D Anime MMORPG ⚔️</div>
            <button class="menu-btn primary" onclick="startGame()">🎮 BẮT ĐẦU</button>
            <button class="menu-btn" onclick="loadGame()">📂 TIẾP TỤC</button>
            <button class="menu-btn" onclick="resetGame()">🗑️ RESET</button>
        </div>
    </div>

    <!-- ===== GAME ===== -->
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>

        <!-- HUD -->
        <div id="hud">
            <div class="hud-left">
                <div class="hud-avatar" id="hudAvatar">⚔️</div>
                <div class="hud-info">
                    <div class="hud-name" id="hudName">Hero</div>
                    <div class="hud-level" id="hudLevel">LV 1</div>
                </div>
                <div class="hud-bars">
                    <div class="hud-bar">
                        <span class="label">HP</span>
                        <div class="bar-bg"><div class="bar-fill hp-fill" id="hpBar" style="width:100%"></div></div>
                        <span class="bar-text" id="hpText">100/100</span>
                    </div>
                    <div class="hud-bar">
                        <span class="label">MP</span>
                        <div class="bar-bg"><div class="bar-fill mp-fill" id="mpBar" style="width:100%"></div></div>
                        <span class="bar-text" id="mpText">50/50</span>
                    </div>
                    <div class="hud-bar">
                        <span class="label">EXP</span>
                        <div class="bar-bg"><div class="bar-fill exp-fill" id="expBar" style="width:0%"></div></div>
                        <span class="bar-text" id="expText">0/100</span>
                    </div>
                </div>
            </div>
            <div class="hud-right">
                <span class="hud-gold" id="hudGold">🪙 0</span>
                <button class="potion-btn" onclick="useHealthPotion()">❤️ <span id="hpCount">0</span></button>
                <button class="potion-btn" onclick="useManaPotion()">💧 <span id="mpCount">0</span></button>
            </div>
        </div>

        <!-- Main Quest -->
        <div id="mainQuest">
            <div class="title" id="questTitle">📜 NHIỆM VỤ CHÍNH</div>
            <div class="desc" id="questDesc">Tìm NPC Master để bắt đầu</div>
            <div class="progress" id="questProgress">0 / 1</div>
            <button class="nav-btn" onclick="navigateToQuest()">🎯 Đến mục tiêu</button>
        </div>

        <!-- Skill Bar -->
        <div id="skillBar">
            <div class="skill-slot" onclick="useSkill(0)">
                <span class="key">1</span>
                <span class="icon">⚔️</span>
                <span class="cost">0</span>
            </div>
            <div class="skill-slot" onclick="useSkill(1)">
                <span class="key">2</span>
                <span class="icon">🔥</span>
                <span class="cost">10</span>
            </div>
            <div class="skill-slot" onclick="useSkill(2)">
                <span class="key">3</span>
                <span class="icon">⚡</span>
                <span class="cost">20</span>
            </div>
            <div class="skill-slot" onclick="useSkill(3)">
                <span class="key">4</span>
                <span class="icon">🛡️</span>
                <span class="cost">15</span>
            </div>
            <div class="skill-slot" onclick="useSkill(4)">
                <span class="key">5</span>
                <span class="icon">💚</span>
                <span class="cost">15</span>
            </div>
            <div class="skill-slot" onclick="useSkill(5)">
                <span class="key">6</span>
                <span class="icon">💥</span>
                <span class="cost">25</span>
            </div>
        </div>

        <!-- Interaction -->
        <div id="interactionHint">Nhấn <kbd>E</kbd> để tương tác</div>

        <!-- Auto -->
        <button id="autoToggle" onclick="toggleAuto()">🤖 AUTO</button>
    </div>

    <!-- ===== NOTIFICATION ===== -->
    <div id="notification"></div>

    <!-- ===== GAME SCRIPT ===== -->
    <script>
        // =====================================================
        // G.LEGENDARY - Game Script (ĐƠN GIẢN - CÓ NHÂN VẬT)
        // =====================================================

        // ===== GAME STATE =====
        const Game = {
            canvas: null,
            ctx: null,
            player: null,
            enemies: [],
            npcs: [],
            particles: [],
            damageTexts: [],
            keys: {},
            camera: { x: 0, y: 0 },
            gameTime: 0,
            deltaTime: 0,
            lastTime: 0,
            gold: 0,
            inventory: [],
            isAuto: false,
            isRunning: true
        };

        // ===== PLAYER =====
        const player = {
            name: 'Hero',
            level: 1,
            exp: 0,
            expToNext: 100,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 10,
            defense: 5,
            x: 400,
            y: 300,
            width: 32,
            height: 44,
            speed: 150,
            facing: 1,
            isMoving: false,
            isAttacking: false,
            attackCooldown: 0,
            animFrame: 0,
            animTimer: 0,

            // Skills
            skills: [
                { name: 'Tấn công', icon: '⚔️', type: 'damage', damage: 20, mpCost: 0, cooldown: 0.3 },
                { name: 'Fireball', icon: '🔥', type: 'projectile', damage: 40, mpCost: 10, cooldown: 3 },
                { name: 'Lightning', icon: '⚡', type: 'damage', damage: 60, mpCost: 20, cooldown: 5 },
                { name: 'Shield', icon: '🛡️', type: 'shield', duration: 5, mpCost: 15, cooldown: 10 },
                { name: 'Heal', icon: '💚', type: 'heal', healAmount: 50, mpCost: 15, cooldown: 8 },
                { name: 'Berserk', icon: '💥', type: 'buff', attackBonus: 20, mpCost: 25, cooldown: 15 }
            ],
            skillCooldowns: [0, 0, 0, 0, 0, 0],
            shieldActive: false,
            shieldTimer: 0,
            buffAttack: 0,

            calculateDamage() {
                const base = this.attack + this.buffAttack;
                const variance = Math.floor(Math.random() * 6) - 2;
                return Math.max(1, base + variance);
            },

            gainExp(amount) {
                this.exp += amount;
                while (this.exp >= this.expToNext) {
                    this.exp -= this.expToNext;
                    this.levelUp();
                }
            },

            levelUp() {
                this.level++;
                this.expToNext = Math.floor(100 * Math.pow(1.2, this.level - 1));
                this.maxHp += 20 + Math.floor(this.level * 2);
                this.maxMp += 10 + Math.floor(this.level * 1.5);
                this.attack += 3 + Math.floor(this.level / 2);
                this.defense += 2 + Math.floor(this.level / 3);
                this.hp = this.maxHp;
                this.mp = this.maxMp;
                showNotification('🎉 LEVEL UP! Level ' + this.level + '!');
            },

            takeDamage(damage) {
                if (this.shieldActive) damage = Math.floor(damage * 0.5);
                const reduced = Math.max(1, damage - Math.floor(this.defense / 2));
                this.hp -= reduced;
                if (this.hp < 0) this.hp = 0;
                return reduced;
            }
        };

        Game.player = player;

        // ===== INIT =====
        function init() {
            Game.canvas = document.getElementById('gameCanvas');
            Game.ctx = Game.canvas.getContext('2d');
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            setupControls();
            setupNPCs();
            
            // Start game loop
            requestAnimationFrame(gameLoop);
        }

        function resizeCanvas() {
            const canvas = Game.canvas;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // ===== CONTROLS =====
        function setupControls() {
            document.addEventListener('keydown', (e) => {
                Game.keys[e.key.toLowerCase()] = true;
                
                if (e.key === ' ' || e.key === 'Space') {
                    e.preventDefault();
                    playerAttack();
                }
                
                if (e.key === 'e' || e.key === 'E') {
                    interact();
                }
                
                if (e.key >= '1' && e.key <= '6') {
                    const idx = parseInt(e.key) - 1;
                    useSkill(idx);
                }
            });

            document.addEventListener('keyup', (e) => {
                Game.keys[e.key.toLowerCase()] = false;
            });

            Game.canvas.addEventListener('click', (e) => {
                const rect = Game.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                handleClick(x, y);
            });
        }

        function handleClick(x, y) {
            // Check click on enemies
            const worldX = x + Game.camera.x;
            const worldY = y + Game.camera.y;
            
            for (const enemy of Game.enemies) {
                const dx = enemy.x - worldX;
                const dy = enemy.y - worldY;
                if (Math.sqrt(dx*dx + dy*dy) < 40) {
                    // Attack enemy
                    playerAttack();
                    return;
                }
            }
            
            // Check click on NPCs
            for (const npc of Game.npcs) {
                const dx = npc.x - worldX;
                const dy = npc.y - worldY;
                if (Math.sqrt(dx*dx + dy*dy) < 40) {
                    interact();
                    return;
                }
            }
        }

        // ===== NPC SETUP =====
        function setupNPCs() {
            Game.npcs = [
                { id: 'merchant', name: 'Merchant', emoji: '🏪', x: 340, y: 220, dialogues: ['Chào mừng!', 'Mua gì không?'] },
                { id: 'elder', name: 'Elder', emoji: '🧙', x: 535, y: 260, dialogues: ['Chào nhà thám hiểm!', 'Có nhiệm vụ cho bạn!'] },
                { id: 'healer', name: 'Healer', emoji: '💚', x: 200, y: 350, dialogues: ['Cần hồi phục không?'] }
            ];
        }

        // ===== GAME LOOP =====
        function gameLoop(timestamp) {
            if (Game.lastTime === 0) Game.lastTime = timestamp;
            Game.deltaTime = Math.min((timestamp - Game.lastTime) / 1000, 0.05);
            Game.lastTime = timestamp;
            Game.gameTime += Game.deltaTime;

            update();
            render();

            requestAnimationFrame(gameLoop);
        }

        // ===== UPDATE =====
        function update() {
            // === Update Player ===
            let dx = 0, dy = 0;
            
            if (Game.keys['a'] || Game.keys['arrowleft']) dx = -player.speed;
            if (Game.keys['d'] || Game.keys['arrowright']) dx = player.speed;
            if (Game.keys['w'] || Game.keys['arrowup']) dy = -player.speed * 0.6;
            if (Game.keys['s'] || Game.keys['arrowdown']) dy = player.speed * 0.6;

            if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

            player.x += dx * Game.deltaTime;
            player.y += dy * Game.deltaTime;
            player.isMoving = (dx !== 0 || dy !== 0);
            if (dx > 0) player.facing = 1;
            else if (dx < 0) player.facing = -1;

            // Bounds
            player.x = Math.max(20, Math.min(1180, player.x));
            player.y = Math.max(20, Math.min(780, player.y));

            // Animation
            if (player.isMoving) {
                player.animTimer += Game.deltaTime;
                if (player.animTimer > 0.15) {
                    player.animTimer = 0;
                    player.animFrame = (player.animFrame + 1) % 4;
                }
            } else {
                player.animFrame = 0;
                player.animTimer = 0;
            }

            // Attack cooldown
            if (player.attackCooldown > 0) {
                player.attackCooldown -= Game.deltaTime;
            }

            // Skill cooldowns
            for (let i = 0; i < player.skillCooldowns.length; i++) {
                if (player.skillCooldowns[i] > 0) {
                    player.skillCooldowns[i] -= Game.deltaTime;
                    if (player.skillCooldowns[i] < 0) player.skillCooldowns[i] = 0;
                }
            }

            // Shield timer
            if (player.shieldActive) {
                player.shieldTimer -= Game.deltaTime;
                if (player.shieldTimer <= 0) {
                    player.shieldActive = false;
                    showNotification('🛡️ Khiên đã hết hiệu lực');
                }
            }

            // Buff timer
            if (player.buffAttack > 0 && player.buffTimer !== undefined) {
                player.buffTimer -= Game.deltaTime;
                if (player.buffTimer <= 0) {
                    player.buffAttack = 0;
                    showNotification('⚔️ Berserk đã hết hiệu lực');
                }
            }

            // === Update Enemies ===
            for (let i = Game.enemies.length - 1; i >= 0; i--) {
                const enemy = Game.enemies[i];
                updateEnemy(enemy);
                
                if (enemy.hp <= 0) {
                    enemyDefeated(enemy);
                    Game.enemies.splice(i, 1);
                }
            }

            // === Update Particles ===
            for (let i = Game.particles.length - 1; i >= 0; i--) {
                const p = Game.particles[i];
                p.x += p.vx * Game.deltaTime;
                p.y += p.vy * Game.deltaTime;
                if (p.vy !== undefined) p.vy += 100 * Game.deltaTime;
                p.life -= Game.deltaTime;
                if (p.life <= 0) Game.particles.splice(i, 1);
            }

            // === Update Damage Texts ===
            for (let i = Game.damageTexts.length - 1; i >= 0; i--) {
                const dt = Game.damageTexts[i];
                dt.y += dt.vy * Game.deltaTime;
                dt.vy += 30 * Game.deltaTime;
                dt.life -= Game.deltaTime;
                if (dt.life <= 0) Game.damageTexts.splice(i, 1);
            }

            // === Camera ===
            Game.camera.x += (player.x - window.innerWidth/2 - Game.camera.x) * 0.08;
            Game.camera.y += (player.y - window.innerHeight/2 - Game.camera.y) * 0.08;

            // === Spawn Enemies ===
            spawnEnemies();

            // === Check Interactions ===
            checkInteractions();

            // === Auto ===
            if (Game.isAuto) updateAuto();

            // === Update HUD ===
            updateHUD();

            // === Regen MP ===
            if (player.mp < player.maxMp) {
                player.mp += 0.5 * Game.deltaTime;
                if (player.mp > player.maxMp) player.mp = player.maxMp;
            }
        }

        // ===== UPDATE ENEMY =====
        function updateEnemy(enemy) {
            if (enemy.hitFlash > 0) enemy.hitFlash -= Game.deltaTime;
            if (enemy.attackCooldown > 0) enemy.attackCooldown -= Game.deltaTime;

            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < enemy.detectionRange && enemy.hp > 0) {
                if (dist < enemy.attackRange) {
                    if (enemy.attackCooldown <= 0) {
                        const damage = Math.max(1, enemy.attack - Math.floor(player.defense / 2));
                        const actual = player.takeDamage(damage);
                        showDamageText(player.x, player.y - 20, actual);
                        spawnHitParticles(player.x, player.y, '#ff4444');
                        enemy.attackCooldown = 1.5;
                        
                        if (player.hp <= 0) {
                            showNotification('💀 Bạn đã chết!');
                            setTimeout(() => {
                                player.hp = player.maxHp;
                                player.mp = player.maxMp;
                                player.x = 400;
                                player.y = 300;
                                showNotification('🔄 Đã hồi sinh!');
                            }, 2000);
                        }
                    }
                } else {
                    const speed = enemy.speed * Game.deltaTime;
                    enemy.x += (dx / dist) * speed;
                    enemy.y += (dy / dist) * speed;
                    enemy.isMoving = true;
                }
            } else {
                enemy.isMoving = false;
            }

            enemy.facing = dx > 0 ? 1 : -1;
            
            if (enemy.isMoving) {
                enemy.animTimer += Game.deltaTime;
                if (enemy.animTimer > 0.15) {
                    enemy.animTimer = 0;
                    enemy.animFrame = (enemy.animFrame + 1) % 4;
                }
            }
        }

        // ===== PLAYER ATTACK =====
        function playerAttack() {
            if (player.attackCooldown > 0 || player.isAttacking) return;
            
            player.isAttacking = true;
            player.attackCooldown = 0.3;

            let hitCount = 0;
            for (const enemy of Game.enemies) {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 60) {
                    const damage = player.calculateDamage();
                    const isCritical = Math.random() < 0.15;
                    const finalDamage = isCritical ? damage * 2 : damage;
                    
                    enemy.hp -= Math.max(1, finalDamage - enemy.defense);
                    enemy.hitFlash = 0.2;
                    
                    showDamageText(enemy.x, enemy.y - 20, finalDamage, isCritical);
                    spawnHitParticles(enemy.x, enemy.y, '#ff6b6b');
                    hitCount++;
                    
                    if (enemy.hp <= 0) {
                        enemyDefeated(enemy);
                    }
                }
            }

            setTimeout(() => {
                player.isAttacking = false;
            }, 200);
        }

        // ===== ENEMY DEFEATED =====
        function enemyDefeated(enemy) {
            player.gainExp(enemy.exp);
            Game.gold += enemy.gold;
            showNotification(`+${enemy.exp} EXP, +${enemy.gold} Gold`);
            
            spawnDeathParticles(enemy.x, enemy.y, enemy.color);
        }

        // ===== SPAWN ENEMIES =====
        function spawnEnemies() {
            if (Game.enemies.length >= 6) return;
            
            const spawnRate = 0.015;
            if (Math.random() > spawnRate) return;

            const types = [
                { name: 'Slime', hp: 30, attack: 5, defense: 2, exp: 15, gold: 5, color: '#44dd44', speed: 30, dropRate: 0.2, detectionRange: 150, attackRange: 35 },
                { name: 'Goblin', hp: 45, attack: 8, defense: 3, exp: 25, gold: 10, color: '#44aa44', speed: 50, dropRate: 0.25, detectionRange: 180, attackRange: 40 },
                { name: 'Wolf', hp: 40, attack: 10, defense: 1, exp: 30, gold: 8, color: '#888899', speed: 70, dropRate: 0.2, detectionRange: 200, attackRange: 35 }
            ];

            const type = types[Math.floor(Math.random() * types.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const dist = 200 + Math.random() * 150;
            const x = player.x + Math.cos(angle) * dist;
            const y = player.y + Math.sin(angle) * dist;

            if (x < 20 || x > 1180 || y < 20 || y > 780) return;

            Game.enemies.push({
                ...type,
                x, y,
                maxHp: type.hp,
                facing: 1,
                isMoving: false,
                hitFlash: 0,
                animFrame: 0,
                animTimer: 0,
                attackCooldown: 0
            });
        }

        // ===== SKILLS =====
        function useSkill(index) {
            const skill = player.skills[index];
            if (!skill) return;
            
            if (player.skillCooldowns[index] > 0) {
                showNotification('⏳ Skill đang hồi chiêu!');
                return;
            }
            
            if (player.mp < skill.mpCost) {
                showNotification('❌ Không đủ MP!');
                return;
            }

            player.mp -= skill.mpCost;
            player.skillCooldowns[index] = skill.cooldown;

            // Skill effects
            switch(skill.type) {
                case 'damage':
                    let hitCount = 0;
                    for (const enemy of Game.enemies) {
                        const dx = enemy.x - player.x;
                        const dy = enemy.y - player.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 200) {
                            const damage = skill.damage + Math.floor(player.attack * 0.3);
                            enemy.hp -= Math.max(1, damage - enemy.defense);
                            enemy.hitFlash = 0.2;
                            showDamageText(enemy.x, enemy.y - 20, damage);
                            spawnHitParticles(enemy.x, enemy.y, skill.color || '#ff6b6b');
                            hitCount++;
                            if (enemy.hp <= 0) enemyDefeated(enemy);
                        }
                    }
                    if (hitCount > 0) showNotification(`✨ ${skill.name} gây sát thương!`);
                    break;
                    
                case 'projectile':
                    // Find nearest enemy
                    let nearest = null;
                    let nearDist = Infinity;
                    for (const enemy of Game.enemies) {
                        const dx = enemy.x - player.x;
                        const dy = enemy.y - player.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < nearDist) {
                            nearDist = dist;
                            nearest = enemy;
                        }
                    }
                    if (nearest) {
                        const dx = nearest.x - player.x;
                        const dy = nearest.y - player.y;
                        const angle = Math.atan2(dy, dx);
                        // Simple projectile effect
                        const damage = skill.damage + Math.floor(player.attack * 0.2);
                        nearest.hp -= Math.max(1, damage - nearest.defense);
                        nearest.hitFlash = 0.2;
                        showDamageText(nearest.x, nearest.y - 20, damage);
                        spawnHitParticles(nearest.x, nearest.y, '#ff4400');
                        if (nearest.hp <= 0) enemyDefeated(nearest);
                        showNotification(`🔥 ${skill.name}!`);
                    }
                    break;
                    
                case 'shield':
                    player.shieldActive = true;
                    player.shieldTimer = skill.duration || 5;
                    showNotification('🛡️ ' + skill.name + ' kích hoạt!');
                    break;
                    
                case 'heal':
                    const healAmount = skill.healAmount + Math.floor(player.level * 2);
                    player.hp = Math.min(player.maxHp, player.hp + healAmount);
                    showNotification(`💚 Hồi phục ${healAmount} HP!`);
                    break;
                    
                case 'buff':
                    player.buffAttack = skill.attackBonus || 20;
                    player.buffTimer = skill.duration || 8;
                    showNotification(`⚔️ ${skill.name} kích hoạt! +${skill.attackBonus} sát thương!`);
                    break;
            }

            updateSkillUI();
        }

        // ===== AUTO =====
        function toggleAuto() {
            Game.isAuto = !Game.isAuto;
            const btn = document.getElementById('autoToggle');
            btn.classList.toggle('active', Game.isAuto);
            btn.textContent = Game.isAuto ? '🤖 ON' : '🤖 AUTO';
            showNotification(Game.isAuto ? '🤖 Auto bật' : '🤖 Auto tắt');
        }

        function updateAuto() {
            if (Game.enemies.length === 0) return;
            
            // Auto attack nearest enemy
            let nearest = null;
            let nearDist = Infinity;
            for (const enemy of Game.enemies) {
                if (enemy.hp <= 0) continue;
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < nearDist) {
                    nearDist = dist;
                    nearest = enemy;
                }
            }
            
            if (nearest) {
                if (nearDist < 60) {
                    playerAttack();
                } else if (nearDist < 300) {
                    // Move towards enemy
                    const dx = nearest.x - player.x;
                    const dy = nearest.y - player.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const speed = player.speed * Game.deltaTime;
                    player.x += (dx / dist) * speed;
                    player.y += (dy / dist) * speed;
                }
            }
            
            // Auto health potion
            if (player.hp < player.maxHp * 0.3) {
                useHealthPotion();
            }
        }

        // ===== INTERACTION =====
        function checkInteractions() {
            let nearNPC = null;
            for (const npc of Game.npcs) {
                const dx = npc.x - player.x;
                const dy = npc.y - player.y;
                if (Math.sqrt(dx*dx + dy*dy) < 50) {
                    nearNPC = npc;
                    break;
                }
            }
            
            const hint = document.getElementById('interactionHint');
            hint.style.display = nearNPC ? 'block' : 'none';
        }

        function interact() {
            for (const npc of Game.npcs) {
                const dx = npc.x - player.x;
                const dy = npc.y - player.y;
                if (Math.sqrt(dx*dx + dy*dy) < 50) {
                    const dialogue = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
                    showNotification('💬 ' + npc.emoji + ' ' + npc.name + ': ' + dialogue);
                    return;
                }
            }
        }

        function navigateToQuest() {
            // Find elder NPC
            for (const npc of Game.npcs) {
                if (npc.id === 'elder') {
                    showNotification('🎯 Đang tìm đường đến Elder...');
                    // Simple navigation - move towards NPC
                    const dx = npc.x - player.x;
                    const dy = npc.y - player.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist > 50) {
                        const speed = player.speed * 0.5;
                        player.x += (dx / dist) * speed;
                        player.y += (dy / dist) * speed;
                    } else {
                        showNotification('✅ Đã đến gần Elder! Nhấn E để nói chuyện.');
                    }
                    return;
                }
            }
        }

        // ===== POTIONS =====
        function useHealthPotion() {
            const idx = Game.inventory.findIndex(i => i.id === 'health_potion');
            if (idx === -1) {
                showNotification('❌ Không có Health Potion!');
                return;
            }
            player.hp = Math.min(player.maxHp, player.hp + 50);
            Game.inventory.splice(idx, 1);
            showNotification('🧪 Hồi phục 50 HP!');
            updateHUD();
        }

        function useManaPotion() {
            const idx = Game.inventory.findIndex(i => i.id === 'mana_potion');
            if (idx === -1) {
                showNotification('❌ Không có Mana Potion!');
                return;
            }
            player.mp = Math.min(player.maxMp, player.mp + 30);
            Game.inventory.splice(idx, 1);
            showNotification('💧 Hồi phục 30 MP!');
            updateHUD();
        }

        // ===== RENDER =====
        function render() {
            const ctx = Game.ctx;
            const canvas = Game.canvas;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.save();
            ctx.translate(-Game.camera.x, -Game.camera.y);
            
            // === Draw Map ===
            drawMap(ctx);
            
            // === Draw NPCs ===
            for (const npc of Game.npcs) {
                drawNPC(ctx, npc);
            }
            
            // === Draw Enemies ===
            for (const enemy of Game.enemies) {
                drawEnemy(ctx, enemy);
            }
            
            // === Draw Particles ===
            for (const p of Game.particles) {
                p.draw(ctx);
            }
            
            // === Draw Damage Texts ===
            for (const dt of Game.damageTexts) {
                dt.draw(ctx);
            }
            
            // === Draw Player ===
            drawPlayer(ctx);
            
            ctx.restore();
        }

        // ===== DRAW MAP =====
        function drawMap(ctx) {
            // Sky
            const gradient = ctx.createLinearGradient(0, 0, 0, 800);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#6bb3d9');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1200, 800);
            
            // Ground
            ctx.fillStyle = '#4a9a4a';
            ctx.fillRect(0, 0, 1200, 800);
            
            // Grass texture
            for (let i = 0; i < 80; i++) {
                const x = Math.random() * 1200;
                const y = Math.random() * 800;
                ctx.fillStyle = `rgba(60, 140, 60, ${0.1 + Math.random() * 0.2})`;
                ctx.fillRect(x, y, 2, 5);
            }
            
            // Path
            ctx.strokeStyle = 'rgba(180, 160, 120, 0.3)';
            ctx.lineWidth = 60;
            ctx.beginPath();
            ctx.moveTo(200, 400);
            ctx.quadraticCurveTo(400, 350, 600, 400);
            ctx.quadraticCurveTo(800, 450, 1000, 400);
            ctx.stroke();
            
            // Buildings
            // House 1
            ctx.fillStyle = '#8B7D6B';
            ctx.fillRect(300, 200, 80, 60);
            ctx.fillStyle = '#6B3A2A';
            ctx.beginPath();
            ctx.moveTo(290, 200);
            ctx.lineTo(340, 170);
            ctx.lineTo(390, 200);
            ctx.fill();
            ctx.fillStyle = '#4A2A1A';
            ctx.fillRect(330, 230, 16, 30);
            ctx.fillStyle = '#6AB0D0';
            ctx.fillRect(310, 210, 14, 14);
            ctx.fillRect(356, 210, 14, 14);
            
            // House 2
            ctx.fillStyle = '#8B7D6B';
            ctx.fillRect(500, 250, 70, 50);
            ctx.fillStyle = '#6B3A2A';
            ctx.beginPath();
            ctx.moveTo(490, 250);
            ctx.lineTo(535, 225);
            ctx.lineTo(580, 250);
            ctx.fill();
            ctx.fillStyle = '#4A2A1A';
            ctx.fillRect(525, 270, 14, 30);
            
            // House 3
            ctx.fillStyle = '#8B7D6B';
            ctx.fillRect(150, 350, 60, 45);
            ctx.fillStyle = '#6B3A2A';
            ctx.beginPath();
            ctx.moveTo(140, 350);
            ctx.lineTo(180, 325);
            ctx.lineTo(220, 350);
            ctx.fill();
            
            // Trees
            const trees = [
                [150, 150], [200, 200], [700, 150], [800, 200],
                [100, 450], [1050, 400], [700, 600], [300, 600],
                [850, 550], [950, 500], [150, 600], [250, 500]
            ];
            for (const pos of trees) {
                ctx.fillStyle = '#6B4226';
                ctx.fillRect(pos[0] - 4, pos[1] + 4, 8, 18);
                ctx.fillStyle = '#3a8a3a';
                ctx.beginPath();
                ctx.arc(pos[0], pos[1], 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#4a9a4a';
                ctx.beginPath();
                ctx.arc(pos[0] - 5, pos[1] - 4, 13, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(pos[0] + 7, pos[1] - 2, 14, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Rocks
            const rocks = [
                [250, 350], [750, 450], [200, 650], [850, 600], [400, 650]
            ];
            for (const pos of rocks) {
                ctx.fillStyle = '#888888';
                ctx.beginPath();
                ctx.ellipse(pos[0], pos[1], 14, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#999999';
                ctx.beginPath();
                ctx.ellipse(pos[0] - 3, pos[1] - 3, 9, 5, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ===== DRAW PLAYER =====
        function drawPlayer(ctx) {
            const x = player.x - 16;
            const y = player.y - 22;
            
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(player.x, player.y + 20, 16, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.save();
            ctx.translate(player.x, player.y);
            if (player.facing === -1) ctx.scale(-1, 1);
            
            // Body
            ctx.fillStyle = '#4488cc';
            ctx.beginPath();
            ctx.roundRect(-14, -8, 28, 22, 4);
            ctx.fill();
            
            // Belt
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(-12, 4, 24, 3);
            
            // Arms
            ctx.fillStyle = '#4488cc';
            ctx.fillRect(-20, -4, 6, 16);
            ctx.fillRect(14, -4, 6, 16);
            ctx.fillStyle = '#f5d0b8';
            ctx.fillRect(-20, 10, 6, 5);
            ctx.fillRect(14, 10, 6, 5);
            
            // Legs
            ctx.fillStyle = '#4466aa';
            ctx.fillRect(-12, 12, 7, 12);
            ctx.fillRect(5, 12, 7, 12);
            ctx.fillStyle = '#664422';
            ctx.fillRect(-14, 22, 9, 4);
            ctx.fillRect(5, 22, 9, 4);
            
            // Head
            ctx.fillStyle = '#f5d0b8';
            ctx.beginPath();
            ctx.arc(0, -16, 14, 0, Math.PI * 2);
            ctx.fill();
            
            // Hair
            ctx.fillStyle = '#8B6914';
            ctx.beginPath();
            ctx.ellipse(0, -22, 16, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-12, -26, 4, 6);
            ctx.fillRect(-4, -28, 4, 8);
            ctx.fillRect(4, -26, 4, 6);
            
            // Eyes
            ctx.fillStyle = '#333';
            ctx.fillRect(-7, -18, 3, 3);
            ctx.fillRect(4, -18, 3, 3);
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(-6, -19, 2, 2);
            ctx.fillRect(5, -19, 2, 2);
            
            // Mouth
            ctx.fillStyle = '#cc8866';
            ctx.fillRect(-3, -12, 6, 2);
            
            // Weapon if attacking
            if (player.isAttacking) {
                ctx.fillStyle = '#cccc88';
                ctx.fillRect(20, -20, 4, 20);
                ctx.fillRect(18, -22, 8, 4);
            }
            
            // Shield effect
            if (player.shieldActive) {
                ctx.strokeStyle = 'rgba(68, 221, 255, 0.5)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 26, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = 'rgba(68, 221, 255, 0.2)';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(0, 0, 32, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            ctx.restore();
            
            // Name
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.font = '9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.name, player.x, player.y - 34);
            
            // HP bar above player
            const hpW = 36;
            const hpX = player.x - hpW/2;
            const hpY = player.y - 30;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(hpX, hpY, hpW, 3);
            ctx.fillStyle = player.hp/player.maxHp > 0.5 ? '#44ff44' : '#ff4444';
            ctx.fillRect(hpX, hpY, hpW * (player.hp/player.maxHp), 3);
        }

        // ===== DRAW ENEMY =====
        function drawEnemy(ctx, enemy) {
            const x = enemy.x - 16;
            const y = enemy.y - 16;
            
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(enemy.x, enemy.y + 16, 14, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.save();
            ctx.translate(enemy.x, enemy.y);
            if (enemy.facing === -1) ctx.scale(-1, 1);
            
            const color = enemy.hitFlash > 0 ? '#ffffff' : enemy.color;
            ctx.fillStyle = color;
            
            // Body
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(-5, -3, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(5, -3, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(-5, -2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(5, -2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Mouth
            ctx.fillStyle = '#cc4444';
            ctx.fillRect(-4, 4, 8, 2);
            
            ctx.restore();
            
            // HP Bar
            const hpW = 30;
            const hpX = enemy.x - hpW/2;
            const hpY = enemy.y - 26;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(hpX, hpY, hpW, 3);
            ctx.fillStyle = enemy.hp/enemy.maxHp > 0.5 ? '#44ff44' : '#ff4444';
            ctx.fillRect(hpX, hpY, hpW * (enemy.hp/enemy.maxHp), 3);
            
            // Name
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '7px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.name, enemy.x, hpY - 4);
        }

        // ===== DRAW NPC =====
        function drawNPC(ctx, npc) {
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(npc.x, npc.y + 18, 14, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.save();
            ctx.translate(npc.x, npc.y);
            
            // Body
            ctx.fillStyle = '#6688aa';
            ctx.fillRect(-12, -4, 24, 18);
            
            // Head
            ctx.fillStyle = '#f5d0b8';
            ctx.beginPath();
            ctx.arc(0, -10, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Emoji
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(npc.emoji, 0, -8);
            
            ctx.restore();
            
            // Name
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '7px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, npc.x, npc.y - 30);
        }

        // ===== PARTICLES =====
        function spawnHitParticles(x, y, color) {
            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 50 + Math.random() * 100;
                Game.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 30,
                    life: 0.3 + Math.random() * 0.3,
                    maxLife: 0.3 + Math.random() * 0.3,
                    size: 3 + Math.random() * 3,
                    color: color,
                    draw(ctx) {
                        const alpha = this.life / this.maxLife;
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = this.color;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }
                });
            }
        }

        function spawnDeathParticles(x, y, color) {
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 60 + Math.random() * 120;
                Game.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 50,
                    life: 0.4 + Math.random() * 0.4,
                    maxLife: 0.4 + Math.random() * 0.4,
                    size: 4 + Math.random() * 4,
                    color: color,
                    draw(ctx) {
                        const alpha = this.life / this.maxLife;
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = this.color;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }
                });
            }
        }

        // ===== DAMAGE TEXTS =====
        function showDamageText(x, y, damage, isCritical) {
            Game.damageTexts.push({
                x, y,
                text: isCritical ? `⚡ ${damage}` : `-${damage}`,
                color: isCritical ? '#ff6b35' : '#ff4444',
                life: 1.0,
                maxLife: 1.0,
                vy: -50,
                size: isCritical ? 18 : 14,
                draw(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.font = `bold ${this.size}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 6;
                    ctx.fillStyle = this.color;
                    ctx.fillText(this.text, this.x, this.y);
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1;
                }
            });
        }

        // ===== HUD =====
        function updateHUD() {
            document.getElementById('hudName').textContent = player.name;
            document.getElementById('hudLevel').textContent = 'LV ' + player.level;
            
            document.getElementById('hpBar').style.width = (player.hp/player.maxHp * 100) + '%';
            document.getElementById('mpBar').style.width = (player.mp/player.maxMp * 100) + '%';
            document.getElementById('expBar').style.width = (player.exp/player.expToNext * 100) + '%';
            
            document.getElementById('hpText').textContent = Math.floor(player.hp) + '/' + player.maxHp;
            document.getElementById('mpText').textContent = Math.floor(player.mp) + '/' + player.maxMp;
            document.getElementById('expText').textContent = Math.floor(player.exp) + '/' + player.expToNext;
            
            document.getElementById('hudGold').textContent = '🪙 ' + Game.gold;
            
            const hpCount = Game.inventory.filter(i => i.id === 'health_potion').length;
            const mpCount = Game.inventory.filter(i => i.id === 'mana_potion').length;
            document.getElementById('hpCount').textContent = hpCount;
            document.getElementById('mpCount').textContent = mpCount;
            
            // Quest
            document.getElementById('questTitle').textContent = '📜 NHIỆM VỤ CHÍNH';
            document.getElementById('questDesc').textContent = 'Tiêu diệt Slime để luyện tập';
            document.getElementById('questProgress').textContent = Game.enemies.filter(e => e.name === 'Slime' && e.hp <= 0).length + ' / 3';
            
            updateSkillUI();
        }

        function updateSkillUI() {
            const slots = document.querySelectorAll('.skill-slot');
            slots.forEach((slot, index) => {
                if (index < player.skills.length) {
                    const skill = player.skills[index];
                    slot.querySelector('.icon').textContent = skill.icon;
                    slot.querySelector('.cost').textContent = skill.mpCost;
                    
                    // Remove old cooldown
                    const old = slot.querySelector('.cooldown');
                    if (old) old.remove();
                    
                    if (player.skillCooldowns[index] > 0) {
                        const cd = document.createElement('div');
                        cd.className = 'cooldown';
                        cd.textContent = Math.ceil(player.skillCooldowns[index]);
                        slot.appendChild(cd);
                    }
                }
            });
        }

        // ===== NOTIFICATION =====
        function showNotification(text) {
            const notif = document.getElementById('notification');
            notif.textContent = text;
            notif.style.display = 'block';
            clearTimeout(notif._timeout);
            notif._timeout = setTimeout(() => {
                notif.style.display = 'none';
            }, 2000);
        }

        // ===== SAVE / LOAD =====
        function saveGame() {
            const data = {
                player: {
                    name: player.name,
                    level: player.level,
                    exp: player.exp,
                    hp: player.hp,
                    maxHp: player.maxHp,
                    mp: player.mp,
                    maxMp: player.maxMp,
                    attack: player.attack,
                    defense: player.defense,
                    x: player.x,
                    y: player.y
                },
                gold: Game.gold,
                inventory: Game.inventory,
                gameTime: Game.gameTime
            };
            localStorage.setItem('glegendary_save', JSON.stringify(data));
            showNotification('💾 Đã lưu game!');
        }

        function loadGame() {
            const data = localStorage.getItem('glegendary_save');
            if (!data) {
                showNotification('❌ Không tìm thấy dữ liệu!');
                return;
            }
            try {
                const save = JSON.parse(data);
                Object.assign(player, save.player);
                Game.gold = save.gold || 0;
                Game.inventory = save.inventory || [];
                Game.gameTime = save.gameTime || 0;
                showNotification('📂 Đã tải game!');
                startGame();
            } catch(e) {
                showNotification('❌ Lỗi tải game!');
            }
        }

        function resetGame() {
            if (confirm('Xóa tất cả dữ liệu game?')) {
                localStorage.removeItem('glegendary_save');
                showNotification('🗑️ Đã xóa dữ liệu!');
                location.reload();
            }
        }

        // ===== START GAME =====
        function startGame() {
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            
            // Add some starter items
            if (Game.inventory.length === 0) {
                Game.inventory.push({ id: 'health_potion', name: 'Health Potion', icon: '🧪' });
                Game.inventory.push({ id: 'health_potion', name: 'Health Potion', icon: '🧪' });
                Game.inventory.push({ id: 'mana_potion', name: 'Mana Potion', icon: '💧' });
            }
            
            showNotification('🌟 Chào mừng đến G.Legendary!');
            updateHUD();
        }

        // ===== POLYFILL roundRect =====
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (r > w/2) r = w/2;
                if (r > h/2) r = h/2;
                this.moveTo(x + r, y);
                this.lineTo(x + w - r, y);
                this.quadraticCurveTo(x + w, y, x + w, y + r);
                this.lineTo(x + w, y + h - r);
                this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                this.lineTo(x + r, y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r);
                this.lineTo(x, y + r);
                this.quadraticCurveTo(x, y, x + r, y);
                return this;
            };
        }

        // ===== GLOBAL =====
        window.startGame = startGame;
        window.loadGame = loadGame;
        window.resetGame = resetGame;
        window.useSkill = useSkill;
        window.useHealthPotion = useHealthPotion;
        window.useManaPotion = useManaPotion;
        window.toggleAuto = toggleAuto;
        window.interact = interact;
        window.navigateToQuest = navigateToQuest;
        window.playerAttack = playerAttack;

        // ===== INIT =====
        document.addEventListener('DOMContentLoaded', () => {
            init();
            // Add auto-save
            setInterval(() => {
                if (document.getElementById('gameContainer').style.display !== 'none') {
                    saveGame();
                }
            }, 30000);
        });

        console.log('✦ G.LEGENDARY v2.0 ✦');
        console.log('Hướng dẫn:');
        console.log('  WASD - Di chuyển');
        console.log('  Space - Tấn công');
        console.log('  1-6 - Kỹ năng');
        console.log('  E - Tương tác');
    </script>
</body>
</html>