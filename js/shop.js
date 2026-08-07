// ============================================
// SHOP - Shop system with buy/sell functionality
// ============================================

// Shop inventory
const SHOP_ITEMS = [
    { id: 'potion', price: 20, stock: 99 },
    { id: 'mana_potion', price: 25, stock: 99 },
    { id: 'wooden_sword', price: 50, stock: 5 },
    { id: 'leather_armor', price: 150, stock: 3 },
    { id: 'iron_sword', price: 250, stock: 2 },
    { id: 'knight_armor', price: 350, stock: 1 }
];

function renderShop(tab = 'buy') {
    const container = document.getElementById('shopItems');
    container.innerHTML = '';
    
    if (!Game.player) return;
    
    document.getElementById('shopGold').textContent = Game.player.gold;
    
    if (tab === 'buy') {
        // Show buy items
        for (const shopItem of SHOP_ITEMS) {
            const itemData = ITEMS[shopItem.id];
            if (!itemData) continue;
            
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="shop-item-info">
                    <span class="shop-item-icon">${itemData.icon}</span>
                    <div>
                        <div class="shop-item-name">${itemData.name}</div>
                        <div style="font-size:0.4rem;color:#888;">${itemData.description}</div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="shop-item-price">🪙 ${shopItem.price}</span>
                    <button onclick="buyItem('${shopItem.id}', ${shopItem.price})" ${shopItem.stock <= 0 ? 'disabled' : ''}>
                        ${shopItem.stock > 0 ? 'Mua' : 'Hết hàng'}
                    </button>
                    <span style="font-size:0.4rem;color:#666;">x${shopItem.stock}</span>
                </div>
            `;
            container.appendChild(div);
        }
    } else {
        // Show sell items (player's inventory)
        const inventory = Game.player.inventory;
        if (inventory.length === 0) {
            container.innerHTML = '<div style="color:#666;text-align:center;padding:20px;">Túi đồ trống. Không có gì để bán.</div>';
            return;
        }
        
        for (let i = 0; i < inventory.length; i++) {
            const item = inventory[i];
            const itemData = ITEMS[item.id];
            if (!itemData) continue;
            
            // Can't sell quest items or equipped items
            const isEquipped = Object.values(Game.player.equipment).some(eq => eq && eq.id === item.id);
            if (isEquipped) continue;
            
            const sellPrice = Math.floor(itemData.value * 0.5);
            
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="shop-item-info">
                    <span class="shop-item-icon">${itemData.icon}</span>
                    <div>
                        <div class="shop-item-name">${itemData.name}</div>
                        <div style="font-size:0.4rem;color:#888;">${itemData.description}</div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="shop-item-price">🪙 ${sellPrice}</span>
                    <button onclick="sellItem(${i}, ${sellPrice})">Bán</button>
                    ${item.quantity > 1 ? `<span style="font-size:0.4rem;color:#666;">x${item.quantity}</span>` : ''}
                </div>
            `;
            container.appendChild(div);
        }
    }
}

function buyItem(itemId, price) {
    if (!Game.player) return;
    
    if (Game.player.gold < price) {
        Game.showNotification('❌ Không đủ Gold!');
        return;
    }
    
    // Check if item exists in shop
    const shopItem = SHOP_ITEMS.find(i => i.id === itemId);
    if (!shopItem || shopItem.stock <= 0) {
        Game.showNotification('❌ Mặt hàng này đã hết!');
        return;
    }
    
    // Add item to inventory
    if (addItem(itemId)) {
        Game.player.gold -= price;
        shopItem.stock--;
        document.getElementById('shopGold').textContent = Game.player.gold;
        Game.playSound('buy');
        Game.showNotification(`✅ Đã mua ${ITEMS[itemId].name}!`);
        renderShop('buy');
    }
}

function sellItem(index, price) {
    if (!Game.player) return;
    
    const item = Game.player.inventory[index];
    if (!item) return;
    
    // Check if equipped
    const isEquipped = Object.values(Game.player.equipment).some(eq => eq && eq.id === item.id);
    if (isEquipped) {
        Game.showNotification('❌ Không thể bán vật phẩm đang trang bị!');
        return;
    }
    
    // Remove item
    Game.player.inventory.splice(index, 1);
    Game.player.gold += price;
    Game.playSound('buy');
    Game.showNotification(`💰 Đã bán ${item.name} với giá ${price} Gold!`);
    renderShop('sell');
}

// Shop NPC interaction
class ShopNPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = 'Merchant';
        this.emoji = '🏪';
        this.dialogue = 'Chào mừng đến cửa hàng của tôi! Tôi có những món đồ tốt nhất trong vùng đất này.';
        this.type = 'shop';
    }
}

// Quest NPC
class QuestNPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = 'Elder';
        this.emoji = '📜';
        this.dialogue = 'Nhà thám hiểm trẻ tuổi, ta có một nhiệm vụ quan trọng cho ngươi.';
        this.type = 'quest';
    }
}

// Healer NPC
class HealerNPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = 'Healer';
        this.emoji = '💚';
        this.dialogue = 'Ta có thể hồi phục cho ngươi... với một cái giá nho nhỏ.';
        this.type = 'heal';
    }
}

// Generic NPC class
class NPC {
    constructor(type, x, y, emoji, name, dialogue) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.emoji = emoji || '🧙';
        this.name = name || 'NPC';
        this.dialogue = dialogue || 'Xin chào!';
    }
}