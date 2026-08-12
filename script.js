// ============================================
// VƯƠNG QUỐC GOLD - Main JavaScript
// ============================================

// ============ AUTH SYSTEM (LocalStorage Demo) ============

const USERS_KEY = 'vqg_users';
const CURRENT_USER_KEY = 'vqg_current_user';

/** Lấy danh sách users từ localStorage */
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
        return {};
    }
}

/** Lưu danh sách users */
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Lấy user hiện tại */
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch {
        return null;
    }
}

/** Lưu user hiện tại */
function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/** Xóa user hiện tại (đăng xuất) */
function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

/** Đăng ký tài khoản mới - Gold mặc định = 0 */
function registerUser(username, password) {
    const users = getUsers();
    
    if (users[username]) {
        throw new Error('Tài khoản đã tồn tại!');
    }
    if (username.length < 3) {
        throw new Error('Tài khoản phải có ít nhất 3 ký tự!');
    }
    if (password.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    }
    
    users[username] = {
        username: username,
        password: password,
        gold: 0,
        score: 0,
        totalRecharge: 0,
        createdAt: new Date().toISOString()
    };
    
    saveUsers(users);
    return users[username];
}

/** Đăng nhập */
function loginUser(username, password) {
    const users = getUsers();
    const user = users[username];
    
    if (!user) {
        throw new Error('Tài khoản không tồn tại!');
    }
    if (user.password !== password) {
        throw new Error('Mật khẩu không đúng!');
    }
    
    const sessionUser = {
        username: user.username,
        gold: user.gold,
        score: user.score,
        totalRecharge: user.totalRecharge || 0
    };
    setCurrentUser(sessionUser);
    return sessionUser;
}

/** Đăng xuất */
function logoutUser() {
    clearCurrentUser();
}

/** Cập nhật Gold */
function updateGold(amount) {
    const current = getCurrentUser();
    if (!current) return null;
    
    const users = getUsers();
    const user = users[current.username];
    if (!user) return null;
    
    user.gold = Math.max(0, user.gold + amount);
    saveUsers(users);
    
    current.gold = user.gold;
    setCurrentUser(current);
    return current;
}

// ============ DATA ============

/** Danh sách server game */
const serversData = [
    {
        id: 1,
        name: 'Vương Quốc Gold - Server 1',
        slug: 'server-1',
        category: 'QUIZZ',
        status: 'online',
        rating: 0,
        players: 2500,
        thumbnail: 'assets/images/logo.png',
        isNew: false,
        isFeatured: true,
        link: 'game1.html'
    },
    {
        id: 2,
        name: 'Vương Quốc Gold - Server 2',
        slug: 'server-2',
        category: 'MMORPG',
        status: 'new',
        rating: 4.8,
        players: 1800,
        thumbnail: 'https://picsum.photos/seed/server2/400/225',
        isNew: true,
        isFeatured: true,
        link: '#'
    },
    {
        id: 3,
        name: 'Vương Quốc Gold - Server 3',
        slug: 'server-3',
        category: 'MMORPG',
        status: 'online',
        rating: 4.7,
        players: 1200,
        thumbnail: 'https://picsum.photos/seed/server3/400/225',
        isNew: false,
        isFeatured: true,
        link: '#'
    },
    {
        id: 4,
        name: 'Vương Quốc Gold - Server 4',
        slug: 'server-4',
        category: 'MMORPG',
        status: 'beta',
        rating: 4.5,
        players: 600,
        thumbnail: 'https://picsum.photos/seed/server4/400/225',
        isNew: true,
        isFeatured: true,
        link: '#'
    }
];

/** Top Nạp Tiền (Xếp hạng theo tổng nạp) */
function getTopRecharge() {
    const users = getUsers();
    const list = Object.values(users).map(u => ({
        name: u.username,
        totalRecharge: u.totalRecharge || 0,
        gold: u.gold || 0,
        avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70) + 1}`
    }));
    
    list.sort((a, b) => b.totalRecharge - a.totalRecharge);
    return list.slice(0, 10);
}

/** CTV Data (Cộng tác viên) */
const ctvData = [
    { 
        rank: 1, 
        name: 'Khánh Duy', 
        role: 'CTV Tân Binh', 
        platform: 'Facebook, Zalo, TikTok',
        desc: 'Hỗ trợ 100+ người chơi',
        avatar: 'https://s160-26-ava-talk.zadn.vn/76/6fa2847190678a06aab51a65a31947a2.jpg?key=GUuzFpU16t3aRQhcpL0crg&time=1791564145',
        badge: '⭐ NEW',
        contact: 'https://www.facebook.com/nguyen.le.khanh.duy.648439'
    },
    { 
        rank: 2, 
        name: 'Nam Nguyen', 
        role: 'CTV Tân Binh', 
        platform: 'Facebook, Zalo, Tiktok',
        desc: 'Hỗ trợ 200+ người chơi',
        avatar: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png&cstp=mx2048x2048&ctp=s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=UaMVcfPO_6wQ7kNvwGe8boM&_nc_oc=AdpkybiB9hoVFPkmo119bPcYss0vHNG8WIUufT5jsDZS536WkogRDT8AjoeqkcEbyg5eaX2ZZi_AHnuxtDo0w5OY&_nc_zt=24&_nc_ht=scontent.fdad3-1.fna&_nc_ss=782a8&oh=00_AQGkoh86qY-F-911Cp_cJEc9PexVMwPc9lb_GG6aUKHzNg&oe=6AA3513A',
        badge: '🔥 NEW',
        contact: 'https://www.facebook.com/nam.nguyen.957676'
    },
    { 
        rank: 3, 
        name: 'Văn Trọng', 
        role: 'CTV Tân Binh', 
        platform: 'Zalo, Facebook',
        desc: 'Hỗ trợ 100+ người chơi',
        avatar: 'https://s160-26-ava-talk.zadn.vn/23/3ce62fbb4d5f83919454a3a265aec1d3.jpg?key=_CbP5clku62-dSe3Zovdcw&time=1788250290',
        badge: 'NEW 💪 ',
        contact: 'https://www.facebook.com/win.lvt.09'
    },
    { 
        rank: 4, 
        name: 'Quốc Bảo', 
        role: 'CTV Mới', 
        platform: 'Facebook',
        desc: 'Hỗ trợ 100+ người chơi',
        avatar: 'https://s160-26-ava-talk.zadn.vn/21/45c73063d94ef86c57583323755662c7.jpg?key=1fVeg3QpgA314Is0-tQLtw&time=1791682099',
        badge: '🌟 NEW',
        contact: ''
    },
    
];

/** Sự kiện */
const eventsData = [
    { title: 'ĐẠI CHIẾN VƯƠNG QUỐC', game: 'Vương Quốc Gold', time: '01/08/2026 - 31/08/2026', reward: '500 Gold + Trang bị huyền thoại' },
    { title: 'SĂN BOSS THẾ GIỚI', game: 'Vương Quốc Gold', time: '15/08/2026 - 20/08/2026', reward: '300 Gold + Vật phẩm giới hạn' },
    { title: 'SỰ KIỆN SIÊU SALE', game: 'Vương Quốc Gold', time: '22/08/2026 - 23/08/2026', reward: 'Voucher 50%' }
];

/** Tin tức */
const newsData = [
    { title: 'Vương Quốc Gold cập nhật bản đồ mới', date: '20/08/2026', desc: 'Khám phá vùng đất bí ẩn với hàng loạt thử thách mới.' },
    { title: 'Hệ thống chiến đấu nâng cấp', date: '18/08/2026', desc: 'Trải nghiệm combat mượt mà và cân bằng hơn.' },
    { title: 'Sự kiện tri ân người chơi', date: '15/08/2026', desc: 'Nhận quà khủng khi đạt mốc 10.000 người chơi.' },
    { title: 'Ra mắt tính năng guild', date: '12/08/2026', desc: 'Cùng bạn bè xây dựng guild hùng mạnh nhất.' }
];

// ============ HELPER FUNCTIONS ============

/** Lấy class status cho server */
function getStatusClass(status) {
    const map = {
        online: 'status-online',
        beta: 'status-beta',
        new: 'status-new',
        offline: 'status-offline',
    };
    return map[status] || 'status-online';
}

/** Render server card HTML */
function renderServerCard(server) {
    const statusLabel = server.status.toUpperCase();
    const link = server.link || '#';
    return `
        <div class="game-card" data-id="${server.id}" data-name="${server.name.toLowerCase()}" data-category="${server.category.toLowerCase()}">
            <div class="thumbnail">
                <img src="${server.thumbnail}" alt="${server.name}" loading="lazy" />
                <span class="game-status ${getStatusClass(server.status)}">${statusLabel}</span>
            </div>
            <div class="game-info">
                <h4>${server.name}</h4>
                <div class="game-category">${server.category}</div>
                <div class="game-meta">
                    <span class="rating"><i class="fas fa-star" style="color:var(--accent-gold);"></i> ${server.rating}</span>
                    <span class="players"><i class="fas fa-users"></i> ${server.players >= 1000 ? (server.players/1000).toFixed(1)+'K' : server.players}</span>
                </div>
                <a href="${link}" class="play-btn" data-slug="${server.slug}"><i class="fas fa-play"></i> VÀO GAME</a>
            </div>
        </div>
    `;
}

// ============ RENDER FUNCTIONS ============

/** Render danh sách server */
function renderServers() {
    const container = document.getElementById('servers-grid');
    if (!container) return;
    container.innerHTML = serversData.map(renderServerCard).join('');
}

/** Render Top Nạp Tiền */
function renderTopRecharge() {
    const container = document.getElementById('top-recharge-grid');
    if (!container) return;
    
    const topList = getTopRecharge();
    
    if (topList.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">
                <i class="fas fa-coins" style="font-size:40px;display:block;margin-bottom:12px;"></i>
                Chưa có dữ liệu nạp tiền!
            </div>
        `;
        return;
    }
    
    container.innerHTML = topList.map((item, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze';
        const goldFormatted = (item.totalRecharge || 0).toLocaleString('vi-VN');
        
        return `
            <div class="top-recharge-card">
                <span class="rank ${rankClass}">#${index + 1}</span>
                <img src="${item.avatar}" alt="${item.name}" class="tr-avatar" />
                <div class="tr-info">
                    <h4>${item.name}</h4>
                    <div class="tr-amount">💰 ${goldFormatted} GOLD</div>
                </div>
                <span class="tr-badge">👑 Đã nạp</span>
            </div>
        `;
    }).join('');
}

/** Render CTV */
function renderCTV() {
    const container = document.getElementById('ctv-grid');
    if (!container) return;
    
    container.innerHTML = ctvData.map(item => {
        const rankClass = item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : 'bronze';
        return `
            <div class="ctv-card">
                <span class="rank ${rankClass}">#${item.rank}</span>
                <img src="${item.avatar}" alt="${item.name}" class="ctv-avatar" />
                <div class="ctv-info">
                    <h4>${item.name}</h4>
                    <div class="ctv-role">${item.role}</div>
                    <div class="ctv-platform"><i class="fas fa-globe"></i> ${item.platform}</div>
                    <div class="ctv-desc">${item.desc}</div>
                </div>
                <div class="ctv-actions">
                    <span class="ctv-badge">${item.badge}</span>
                    <a href="${item.contact}" target="_blank" class="btn-ctv-contact">
                        <i class="fas fa-phone"></i> Liên hệ
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

/** Render sự kiện */
function renderEvents() {
    const container = document.getElementById('events-grid');
    if (!container) return;
    
    container.innerHTML = eventsData.map(ev => `
        <div class="event-card">
            <div class="event-title">${ev.title}</div>
            <div class="event-game"><i class="fas fa-gamepad" style="color:var(--text-muted);"></i> ${ev.game}</div>
            <div class="event-time"><i class="far fa-calendar-alt"></i> ${ev.time}</div>
            <div class="event-reward"><i class="fas fa-gift"></i> ${ev.reward}</div>
            <button class="event-btn">Xem chi tiết</button>
        </div>
    `).join('');
}

/** Render tin tức */
function renderNews() {
    const container = document.getElementById('news-grid');
    if (!container) return;
    
    container.innerHTML = newsData.map(item => `
        <div class="news-card">
            <div class="news-thumb"><i class="fas fa-newspaper"></i></div>
            <div class="news-body">
                <h4>${item.title}</h4>
                <div class="news-date"><i class="far fa-clock"></i> ${item.date}</div>
                <p>${item.desc}</p>
            </div>
        </div>
    `).join('');
}

// ============ AUTH UI FUNCTIONS ============

/** Mở modal đăng nhập/đăng ký */
function openAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-modal-title');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchLink = document.getElementById('switch-auth-link');
    
    if (type === 'login') {
        title.innerHTML = '<i class="fas fa-sign-in-alt"></i> ĐĂNG NHẬP';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        switchLink.textContent = 'Chưa có tài khoản? Đăng ký ngay';
    } else {
        title.innerHTML = '<i class="fas fa-user-plus"></i> ĐĂNG KÝ';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchLink.textContent = 'Đã có tài khoản? Đăng nhập';
    }
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

/** Đóng modal auth */
function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('open');
    document.body.style.overflow = '';
}

/** Chuyển đổi giữa login và register */
function switchAuthForm(e) {
    e.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const title = document.getElementById('auth-modal-title');
    const switchLink = document.getElementById('switch-auth-link');
    
    if (loginForm.style.display !== 'none') {
        title.innerHTML = '<i class="fas fa-user-plus"></i> ĐĂNG KÝ';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchLink.textContent = 'Đã có tài khoản? Đăng nhập';
    } else {
        title.innerHTML = '<i class="fas fa-sign-in-alt"></i> ĐĂNG NHẬP';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        switchLink.textContent = 'Chưa có tài khoản? Đăng ký ngay';
    }
}

/** Xử lý đăng ký */
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUser').value.trim();
    const password = document.getElementById('regPass').value.trim();
    
    try {
        const user = registerUser(username, password);
        alert('✅ Đăng ký thành công! Bạn có 0 GOLD.');
        closeAuthModal();
        updateUI();
    } catch (err) {
        alert('❌ ' + err.message);
    }
}

/** Xử lý đăng nhập */
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    
    try {
        const user = loginUser(username, password);
        alert('✅ Đăng nhập thành công!');
        closeAuthModal();
        updateUI();
    } catch (err) {
        alert('❌ ' + err.message);
    }
}

/** Xử lý đăng xuất */
function handleLogout(e) {
    e.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        logoutUser();
        updateUI();
        alert('🚪 Đã đăng xuất!');
    }
}

/** Cập nhật UI sau khi đăng nhập/đăng xuất */
function updateUI() {
    const user = getCurrentUser();
    const loggedIn = document.getElementById('user-loggedin');
    const loginArea = document.getElementById('user-login');
    const usernameEl = document.getElementById('header-username');
    const goldEls = document.querySelectorAll('.gold-amount');
    const modalGold = document.getElementById('modal-gold');
    
    if (user) {
        loggedIn.style.display = 'flex';
        loginArea.style.display = 'none';
        usernameEl.textContent = user.username;
        const goldText = (user.gold || 0).toLocaleString('vi-VN');
        goldEls.forEach(el => el.textContent = goldText);
        if (modalGold) modalGold.textContent = goldText;
    } else {
        loggedIn.style.display = 'none';
        loginArea.style.display = 'flex';
        goldEls.forEach(el => el.textContent = '0');
        if (modalGold) modalGold.textContent = '0';
    }
}

// ============ SEARCH ============

function setupSearch() {
    const input = document.getElementById('search-input');
    const container = document.getElementById('servers-grid');
    if (!input || !container) return;

    input.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();
        const filtered = serversData.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query)
        );

        if (query === '') {
            renderServers();
            return;
        }

        container.innerHTML = filtered.length === 0
            ? `<div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-secondary);">
                 <i class="fas fa-search" style="font-size:32px;display:block;margin-bottom:10px;"></i>
                 Không tìm thấy server "<strong>${query}</strong>"
               </div>`
            : filtered.map(renderServerCard).join('');
    });
}

// ============ GOLD MODAL ============

function setupGoldModal() {
    const display = document.getElementById('gold-display');
    const modal = document.getElementById('gold-modal');
    const closeBtn = document.getElementById('gold-modal-close');

    if (!display || !modal || !closeBtn) return;

    display.addEventListener('click', function () {
        const user = getCurrentUser();
        const modalGold = document.getElementById('modal-gold');
        if (modalGold) {
            modalGold.textContent = (user?.gold || 0).toLocaleString('vi-VN');
        }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function () {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ============ USER DROPDOWN ============

function setupUserDropdown() {
    const loggedIn = document.getElementById('user-loggedin');
    const dropdown = document.getElementById('user-dropdown');

    if (!loggedIn || !dropdown) return;

    loggedIn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function () {
        dropdown.classList.remove('open');
    });
}

// ============ MOBILE MENU ============

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    const body = document.body;

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
        body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            menu.classList.remove('open');
            toggle.querySelector('i').classList.add('fa-bars');
            toggle.querySelector('i').classList.remove('fa-times');
            body.style.overflow = '';
        });
    });
}

// ============ HEADER SCROLL ============

function setupHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============ PARTICLES ============

function setupParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        const colors = ['#FFD700', '#FFA500', '#FF6B35', '#FFD700', '#FFF'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

// ============ LOADING SCREEN ============

function hideLoading() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    
    setTimeout(() => {
        screen.classList.add('hide');
        document.body.style.overflow = 'auto';
    }, 1800);
}

// ============ CSS THÊM CHO TOP NẠP VÀ CTV ============

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* ===== TOP NẠP ===== */
        .top-recharge-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
        }
        .top-recharge-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 18px 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: var(--transition);
        }
        .top-recharge-card:hover {
            border-color: var(--accent-gold);
            transform: translateY(-4px);
            box-shadow: var(--shadow-gold);
        }
        .top-recharge-card .rank {
            font-family: 'Orbitron', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--text-muted);
            min-width: 36px;
        }
        .top-recharge-card .rank.gold { color: var(--accent-gold); }
        .top-recharge-card .rank.silver { color: #c0c0c0; }
        .top-recharge-card .rank.bronze { color: #cd7f32; }
        .top-recharge-card .tr-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--accent-gold);
        }
        .top-recharge-card .tr-info { flex: 1; }
        .top-recharge-card .tr-info h4 { font-size: 15px; font-weight: 600; }
        .top-recharge-card .tr-info .tr-amount {
            font-size: 13px;
            color: var(--text-gold);
            font-weight: 600;
        }
        .top-recharge-card .tr-badge {
            font-size: 11px;
            padding: 4px 12px;
            border-radius: 50px;
            background: rgba(255, 215, 0, 0.1);
            color: var(--text-gold);
            border: 1px solid rgba(255, 215, 0, 0.2);
        }

        /* ===== CTV ===== */
        .ctv-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
        }
        .ctv-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: var(--transition);
            flex-wrap: wrap;
        }
        .ctv-card:hover {
            border-color: var(--accent-gold);
            transform: translateY(-4px);
            box-shadow: var(--shadow-gold);
        }
        .ctv-card .rank {
            font-family: 'Orbitron', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--text-muted);
            min-width: 36px;
        }
        .ctv-card .rank.gold { color: var(--accent-gold); }
        .ctv-card .rank.silver { color: #c0c0c0; }
        .ctv-card .rank.bronze { color: #cd7f32; }
        .ctv-card .ctv-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--accent-gold);
        }
        .ctv-card .ctv-info { flex: 1; min-width: 120px; }
        .ctv-card .ctv-info h4 { font-size: 16px; font-weight: 600; }
        .ctv-card .ctv-info .ctv-role {
            font-size: 13px;
            color: var(--text-gold);
            font-weight: 500;
        }
        .ctv-card .ctv-info .ctv-platform {
            font-size: 12px;
            color: var(--text-secondary);
        }
        .ctv-card .ctv-info .ctv-desc {
            font-size: 12px;
            color: var(--text-secondary);
        }
        .ctv-card .ctv-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;
        }
        .ctv-card .ctv-badge {
            font-size: 11px;
            padding: 4px 12px;
            border-radius: 50px;
            background: rgba(255, 215, 0, 0.1);
            color: var(--text-gold);
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        .btn-ctv-contact {
            padding: 6px 16px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .btn-ctv-contact:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        @media (max-width: 600px) {
            .top-recharge-grid {
                grid-template-columns: 1fr;
            }
            .ctv-grid {
                grid-template-columns: 1fr;
            }
            .ctv-card {
                flex-direction: column;
                text-align: center;
            }
            .ctv-card .ctv-actions {
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ INIT ============

document.addEventListener('DOMContentLoaded', function () {
    document.body.style.overflow = 'hidden';

    // Inject thêm CSS
    injectStyles();

    // Render dữ liệu
    renderServers();
    renderTopRecharge();
    renderCTV();
    renderEvents();
    renderNews();

    // Setup các tính năng
    setupSearch();
    setupGoldModal();
    setupUserDropdown();
    setupMobileMenu();
    setupHeaderScroll();
    setupParticles();

    // Auth
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Đóng modal auth khi click outside
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });
    }

    // Nút close modal auth
    const authClose = document.getElementById('auth-modal-close');
    if (authClose) {
        authClose.addEventListener('click', closeAuthModal);
    }

    // Cập nhật UI
    updateUI();

    hideLoading();
});

// ============ EXPOSE GLOBAL FUNCTIONS ============
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthForm = switchAuthForm;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.updateUI = updateUI;
window.getCurrentUser = getCurrentUser;
window.updateGold = updateGold;
window.renderTopRecharge = renderTopRecharge;
window.renderCTV = renderCTV;