// ============================================
// LEADERBOARD - Simple leaderboard using localStorage
// ============================================

class Leaderboard {
    constructor() {
        this.storageKey = 'miniRpgLeaderboard';
        this.maxEntries = 20;
        this.entries = [];
        this.load();
    }
    
    // Load leaderboard data
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                this.entries = JSON.parse(data);
            } else {
                // Seed with some dummy data
                this.seedDummyData();
            }
        } catch (error) {
            console.error('Leaderboard load error:', error);
            this.entries = [];
        }
    }
    
    // Save leaderboard data
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
        } catch (error) {
            console.error('Leaderboard save error:', error);
        }
    }
    
    // Add entry to leaderboard
    addEntry(name, level, gold, time = 0) {
        const entry = {
            name: name || 'Player',
            level: level || 1,
            gold: gold || 0,
            time: time || Date.now(),
            timestamp: Date.now()
        };
        
        this.entries.push(entry);
        
        // Sort by level (descending), then by gold (descending)
        this.entries.sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            return b.gold - a.gold;
        });
        
        // Keep only top entries
        if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(0, this.maxEntries);
        }
        
        this.save();
        return this.getRank(entry);
    }
    
    // Get rank of an entry
    getRank(entry) {
        const index = this.entries.findIndex(e => 
            e.name === entry.name && 
            e.level === entry.level && 
            e.gold === entry.gold &&
            e.timestamp === entry.timestamp
        );
        return index >= 0 ? index + 1 : null;
    }
    
    // Get top entries
    getTopEntries(limit = 10) {
        return this.entries.slice(0, limit);
    }
    
    // Search for player
    findPlayer(name) {
        return this.entries.filter(entry => 
            entry.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    
    // Clear leaderboard
    clear() {
        this.entries = [];
        this.save();
    }
    
    // Seed dummy data
    seedDummyData() {
        const names = ['Hero', 'Warrior', 'Mage', 'Archer', 'Knight', 'Assassin', 'Paladin', 'Druid', 'Berserker', 'Ranger'];
        const dummyEntries = [];
        
        for (let i = 0; i < 10; i++) {
            dummyEntries.push({
                name: names[i] + (Math.floor(Math.random() * 100) + 1),
                level: Math.floor(Math.random() * 20) + 1,
                gold: Math.floor(Math.random() * 1000) + 100,
                time: Date.now() - Math.floor(Math.random() * 86400000),
                timestamp: Date.now() - Math.floor(Math.random() * 86400000)
            });
        }
        
        // Sort and save
        dummyEntries.sort((a, b) => b.level - a.level);
        this.entries = dummyEntries;
        this.save();
    }
    
    // Get statistics
    getStats() {
        if (this.entries.length === 0) return null;
        
        const avgLevel = this.entries.reduce((sum, e) => sum + e.level, 0) / this.entries.length;
        const avgGold = this.entries.reduce((sum, e) => sum + e.gold, 0) / this.entries.length;
        const highestLevel = Math.max(...this.entries.map(e => e.level));
        
        return {
            totalPlayers: this.entries.length,
            avgLevel: Math.round(avgLevel * 10) / 10,
            avgGold: Math.round(avgGold),
            highestLevel: highestLevel,
            topPlayer: this.entries[0]
        };
    }
}

// Leaderboard UI
function showLeaderboard() {
    const leaderboard = new Leaderboard();
    const entries = leaderboard.getTopEntries(10);
    const stats = leaderboard.getStats();
    
    let html = `
        <div style="margin-bottom:20px;text-align:center;">
            <h2 style="color:#ffd700;">🏆 BẢNG XẾP HẠNG</h2>
            ${stats ? `
                <div style="font-size:0.5rem;color:#888;margin-top:5px;">
                    ${stats.totalPlayers} người chơi | Cao nhất LV${stats.highestLevel}
                </div>
            ` : ''}
        </div>
        <div style="margin-bottom:15px;">
    `;
    
    if (entries.length === 0) {
        html += '<div style="text-align:center;color:#666;padding:20px;">Chưa có dữ liệu xếp hạng</div>';
    } else {
        html += `
            <table style="width:100%;border-collapse:collapse;font-size:0.6rem;">
                <thead>
                    <tr style="border-bottom:2px solid #4a4a6a;">
                        <th style="padding:8px;text-align:left;color:#888;">#</th>
                        <th style="padding:8px;text-align:left;color:#888;">Tên</th>
                        <th style="padding:8px;text-align:center;color:#888;">LV</th>
                        <th style="padding:8px;text-align:right;color:#888;">🪙</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        entries.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            const color = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#888';
            
            html += `
                <tr style="border-bottom:1px solid #3a3a5a;">
                    <td style="padding:8px;color:${color};">${medal}</td>
                    <td style="padding:8px;color:#e0e0ff;">${entry.name}</td>
                    <td style="padding:8px;text-align:center;color:#8ab0d0;">${entry.level}</td>
                    <td style="padding:8px;text-align:right;color:#ffd700;">${entry.gold.toLocaleString()}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
    }
    
    html += `
        </div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <button class="menu-btn" onclick="this.closest('.ui-overlay').style.display='none'" 
                    style="padding:8px 20px;font-size:0.5rem;">
                Đóng
            </button>
            <button class="menu-btn danger" onclick="clearLeaderboard()" 
                    style="padding:8px 20px;font-size:0.5rem;">
                Xóa dữ liệu
            </button>
        </div>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'ui-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="ui-container" style="max-width:500px;">
            ${html}
        </div>
    `;
    document.body.appendChild(overlay);
}

function clearLeaderboard() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ bảng xếp hạng?')) {
        const leaderboard = new Leaderboard();
        leaderboard.clear();
        Game.showNotification('🗑️ Đã xóa bảng xếp hạng!');
        // Refresh
        const overlay = document.querySelector('.ui-overlay');
        if (overlay) overlay.remove();
        showLeaderboard();
    }
}

// Add to leaderboard when game ends or levels up
function updateLeaderboard(player) {
    const leaderboard = new Leaderboard();
    leaderboard.addEntry(player.name, player.level, player.gold);
}

// Export
window.Leaderboard = Leaderboard;
window.showLeaderboard = showLeaderboard;
window.clearLeaderboard = clearLeaderboard;
window.updateLeaderboard = updateLeaderboard;