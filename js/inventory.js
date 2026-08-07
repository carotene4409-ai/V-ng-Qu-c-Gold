// ============================================
// INVENTORY - Inventory management
// ============================================

// Item definitions
const ITEMS = {
    potion: {
        id: 'potion',
        name: 'Health Potion',
        icon: '🧪',
        type: 'consumable',
        description: 'Hồi phục 50 HP',
        value: 20,
        use: (player) => {
            player.hp = Math.min(player.maxHp, player.hp + 50);
            Game.showNotification('🧪 Đã hồi phục 50 HP!');
            Game.playSound('pickup');
        }
    },
    mana_potion: {
        id: 'mana_potion',
        name: 'Mana Potion',
        icon: '💧',
        type: 'consumable',
        description: 'Hồi phục 30 MP',
        value: 25,
        use: (player) => {
            player.mp = Math.min(player.maxMp, player.mp + 30);
            Game.showNotification('💧 Đã hồi phục 30 MP!');
            Game.playSound('pickup');
        }
    },
    wooden_sword: {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        icon: '🗡️',
        type: 'weapon',
        description: 'Attack +5',
        value: 50,
        attackBonus: 5,
        slot: 'weapon'
    },
    iron_sword: {
        id: 'iron_sword',
        name: 'Iron Sword',
        icon: '⚔️',
        type: 'weapon',
        description: 'Attack +15',
        value: 250,
        attackBonus: 15,
        slot: 'weapon'
    },
    dragon_sword: {
        id: 'dragon_sword',
        name: 'Dragon Sword',
        icon: '⚔️',
        type: 'weapon',
        description: 'Attack +30, HP +20',
        value: 1000,
        attackBonus: 30,
        hpBonus: 20,
        slot: 'weapon'
    },
    knight_armor: {
        id: 'knight_armor',
        name: 'Knight Armor',
        icon: '🛡️',
        type: 'armor',
        description: 'Defense +20, HP +30',
        value: 350,
        defenseBonus: 20,
        hpBonus: 30,
        slot: 'armor'
    },
    leather_armor: {
        id: 'leather_armor',
        name: 'Leather Armor',
        icon: '🛡️',
        type: 'armor',
        description: 'Defense +10',
        value: 150,
        defenseBonus: 10,
        slot: 'armor'
    }
};

// Inventory rendering
function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    const info = document.getElementById('inventoryInfo');
    grid.innerHTML = '';
    
    if (!Game.player) return;
    
    const inventory = Game.player.inventory;
    
    // Show equipped items first
    const equippedSlots = ['weapon', 'helmet', 'armor', 'accessory'];
    for (const slot of equippedSlots) {
        const item = Game.player.equipment[slot];
        if (item) {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'inventory-slot equipped';
            slotDiv.innerHTML = `
                <div>${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-count">🔒</div>
            `;
            slotDiv.title = `${item.name}\n${item.description}\n[Trang bị]`;
            grid.appendChild(slotDiv);
        }
    }
    
    // Show inventory items
    for (let i = 0; i < Math.min(inventory.length, Game.player.maxInventory); i++) {
        const item = inventory[i];
        const slotDiv = document.createElement('div');
        slotDiv.className = 'inventory-slot';
        slotDiv.innerHTML = `
            <div>${item.icon}</div>
            <div class="item-name">${item.name}</div>
            ${item.quantity > 1 ? `<div class="item-count">${item.quantity}</div>` : ''}
        `;
        slotDiv.onclick = () => {
            showItemInfo(item, i);
        };
        grid.appendChild(slotDiv);
    }
    
    // Fill empty slots
    const totalSlots = Game.player.maxInventory;
    const usedSlots = inventory.length + equippedSlots.length;
    for (let i = usedSlots; i < totalSlots; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'inventory-slot';
        slotDiv.style.opacity = '0.2';
        grid.appendChild(slotDiv);
    }
}

function showItemInfo(item, index) {
    const info = document.getElementById('inventoryInfo');
    info.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:5px;">
            <span style="font-size:2rem;">${item.icon}</span>
            <span style="font-size:1rem;color:#ffd700;">${item.name}</span>
        </div>
        <div style="margin-bottom:5px;font-size:0.6rem;color:#c0c0e0;">${item.description}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:5px;">
            <button class="menu-btn" style="padding:5px 10px;font-size:0.5rem;" onclick="useItem(${index})">
                🎯 Sử dụng
            </button>
            ${item.type === 'weapon' || item.type === 'armor' ? `
                <button class="menu-btn" style="padding:5px 10px;font-size:0.5rem;" onclick="equipItem(${index})">
                    ⚔️ Trang bị
                </button>
            ` : ''}
            <button class="menu-btn danger" style="padding:5px 10px;font-size:0.5rem;" onclick="dropItem(${index})">
                🗑️ Bỏ
            </button>
        </div>
    `;
}

function useItem(index) {
    const item = Game.player.inventory[index];
    if (!item) return;
    
    const itemData = ITEMS[item.id];
    if (!itemData) return;
    
    if (itemData.type === 'consumable') {
        itemData.use(Game.player);
        Game.player.inventory.splice(index, 1);
        renderInventory();
        Game.showNotification(`✅ Đã sử dụng ${itemData.name}`);
    }
}

function equipItem(index) {
    const item = Game.player.inventory[index];
    if (!item) return;
    
    const itemData = ITEMS[item.id];
    if (!itemData || !itemData.slot) return;
    
    const slot = itemData.slot;
    
    // Unequip current item
    if (Game.player.equipment[slot]) {
        Game.player.inventory.push(Game.player.equipment[slot]);
    }
    
    // Equip new item
    Game.player.equipment[slot] = item;
    Game.player.inventory.splice(index, 1);
    Game.player.updateStats();
    
    renderInventory();
    Game.showNotification(`✅ Đã trang bị ${itemData.name}`);
    Game.playSound('pickup');
}

function dropItem(index) {
    const item = Game.player.inventory[index];
    if (!item) return;
    
    if (confirm(`Bỏ ${item.name}?`)) {
        Game.player.inventory.splice(index, 1);
        renderInventory();
        Game.showNotification(`🗑️ Đã bỏ ${item.name}`);
    }
}

function addItem(itemId) {
    const itemData = ITEMS[itemId];
    if (!itemData) return false;
    
    if (!Game.player) return false;
    
    // Check if already have this item
    const existing = Game.player.inventory.find(i => i.id === itemId);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        if (Game.player.inventory.length >= Game.player.maxInventory) {
            Game.showNotification('❌ Túi đồ đã đầy!');
            return false;
        }
        Game.player.inventory.push({
            id: itemId,
            name: itemData.name,
            icon: itemData.icon,
            type: itemData.type,
            description: itemData.description,
            quantity: 1
        });
    }
    
    Game.playSound('pickup');
    return true;
}