// ============================================
// SAVE SYSTEM - Save/Load game data with localStorage
// ============================================

class SaveSystem {
    constructor() {
        this.saveKey = 'miniRpgSave';
        this.autoSaveInterval = 30000; // 30 seconds
        this.lastSave = 0;
    }
    
    // Save game data
    save(game) {
        if (!game.player) return false;
        
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                player: {
                    name: game.player.name,
                    gender: game.player.gender,
                    hair: game.player.hair,
                    outfit: game.player.outfit,
                    level: game.player.level,
                    exp: game.player.exp,
                    hp: game.player.hp,
                    maxHp: game.player.maxHp,
                    mp: game.player.mp,
                    maxMp: game.player.maxMp,
                    attack: game.player.baseAttack,
                    defense: game.player.baseDefense,
                    speed: game.player.speed,
                    gold: game.player.gold,
                    x: game.player.x,
                    y: game.player.y,
                    inventory: game.player.inventory,
                    equipment: game.player.equipment
                },
                gameTime: game.gameTime,
                enemyCount: game.enemies ? game.enemies.length : 0,
                quests: this.getQuestProgress(game)
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.lastSave = Date.now();
            return true;
        } catch (error) {
            console.error('Save error:', error);
            return false;
        }
    }
    
    // Load game data
    load() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (!data) return null;
            
            const saveData = JSON.parse(data);
            
            // Validate save data
            if (!saveData.player) return null;
            
            return saveData;
        } catch (error) {
            console.error('Load error:', error);
            return null;
        }
    }
    
    // Check if save exists
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }
    
    // Delete save
    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }
    
    // Get save info
    getSaveInfo() {
        const data = this.load();
        if (!data) return null;
        
        return {
            playerName: data.player.name,
            level: data.player.level,
            gold: data.player.gold,
            gameTime: data.gameTime || 0,
            timestamp: data.timestamp || Date.now(),
            enemiesDefeated: data.enemyCount || 0
        };
    }
    
    // Auto-save
    autoSave(game) {
        const now = Date.now();
        if (now - this.lastSave >= this.autoSaveInterval) {
            this.save(game);
            // Show subtle notification
            if (game.state === 'playing') {
                game.showNotification('💾 Auto-save...', 1000);
            }
        }
    }
    
    // Get quest progress
    getQuestProgress(game) {
        const quests = [];
        // This would track quest progress in a full implementation
        return quests;
    }
    
    // Export save data (for backup)
    exportSave() {
        const data = localStorage.getItem(this.saveKey);
        if (!data) return null;
        
        return {
            data: data,
            key: this.saveKey
        };
    }
    
    // Import save data (from backup)
    importSave(data) {
        try {
            // Validate data
            JSON.parse(data.data);
            localStorage.setItem(data.key || this.saveKey, data.data);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}

// Save/Load UI functions
function saveGame() {
    if (Game.saveSystem) {
        if (Game.saveSystem.save(Game)) {
            Game.showNotification('💾 Game đã được lưu!');
        } else {
            Game.showNotification('❌ Lưu game thất bại!');
        }
    }
}

function loadGame() {
    if (Game.saveSystem) {
        const data = Game.saveSystem.load();
        if (data) {
            // Restore game state
            Game.loadSaveData(data);
            Game.showNotification('📂 Đã tải game thành công!');
        } else {
            Game.showNotification('❌ Không tìm thấy dữ liệu lưu!');
        }
    }
}

function deleteSave() {
    if (Game.saveSystem) {
        if (confirm('Bạn có chắc muốn xóa dữ liệu lưu?')) {
            Game.saveSystem.deleteSave();
            Game.showNotification('🗑️ Đã xóa dữ liệu lưu!');
            // Update menu
            document.getElementById('continueBtn').disabled = true;
        }
    }
}

// Export SaveSystem
window.SaveSystem = SaveSystem;