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
    
    // Kiểm tra tài khoản đã tồn tại
    if (users[username]) {
        throw new Error('Tài khoản đã tồn tại!');
    }
    
    // Kiểm tra độ dài
    if (username.length < 3) {
        throw new Error('Tài khoản phải có ít nhất 3 ký tự!');
    }
    if (password.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    }
    
    // Tạo user mới - GOLD MẶC ĐỊNH = 0
    users[username] = {
        username: username,
        password: password, // Trong thực tế phải hash, demo thì để plain
        gold: 0,            // ✅ Mặc định 0 GOLD
        score: 0,
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
    
    // Lưu user hiện tại (không lưu password)
    const sessionUser = {
        username: user.username,
        gold: user.gold,
        score: user.score
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

/** Cập nhật điểm số */
function updateScore(points) {
    const current = getCurrentUser();
    if (!current) return null;
    
    const users = getUsers();
    const user = users[current.username];
    if (!user) return null;
    
    user.score = (user.score || 0) + points;
    saveUsers(users);
    
    current.score = user.score;
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
        players: 0,
        thumbnail: 'vuongquocgold/assets/imageslogosv1.png',
        isNew: false,
        isFeatured: true,
        link: 'game1.html'  // ✅ Link đến game1.html
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
    },
];

/** Bảng xếp hạng (top 5) */
const leaderboardData = [
    { rank: 1, name: 'Đại Đế Long', level: 99, game: 'Vương Quốc Gold', avatar: 'https://i.pravatar.cc/80?img=1' },
    { rank: 2, name: 'Thánh Vương', level: 87, game: 'Vương Quốc Gold', avatar: 'https://i.pravatar.cc/80?img=2' },
    { rank: 3, name: 'Hiệp Sĩ Vàng', level: 82, game: 'Vương Quốc Gold', avatar: 'https://i.pravatar.cc/80?img=3' },
    { rank: 4, name: 'Pháp Sư Huyền Thoại', level: 78, game: 'Vương Quốc Gold', avatar: 'https://i.pravatar.cc/80?img=4' },
    { rank: 5, name: 'Chiến Binh Bóng Đêm', level: 75, game: 'Vương Quốc Gold', avatar: 'https://i.pravatar.cc/80?img=5' },
];

/** Sự kiện */
const eventsData = [
    { title: 'ĐẠI CHIẾN VƯƠNG QUỐC', game: 'Vương Quốc Gold', time: '01/08/2026 - 31/08/2026', reward: '500 Gold + Trang bị huyền thoại' },
    { title: 'SĂN BOSS THẾ GIỚI', game: 'Vương Quốc Gold', time: '15/08/2026 - 20/08/2026', reward: '300 Gold + Vật phẩm giới hạn' },
    { title: 'SỰ KIỆN SIÊU SALE', game: 'Vương Quốc Gold', time: '22/08/2026 - 23/08/2026', reward: 'Voucher 50%' },
];

/** Tin tức */
const newsData = [
    { title: 'Vương Quốc Gold cập nhật bản đồ mới', date: '20/08/2026', desc: 'Khám phá vùng đất bí ẩn với hàng loạt thử thách mới.' },
    { title: 'Hệ thống chiến đấu nâng cấp', date: '18/08/2026', desc: 'Trải nghiệm combat mượt mà và cân bằng hơn.' },
    { title: 'Sự kiện tri ân người chơi', date: '15/08/2026', desc: 'Nhận quà khủng khi đạt mốc 10.000 người chơi.' },
    { title: 'Ra mắt tính năng guild', date: '12/08/2026', desc: 'Cùng bạn bè xây dựng guild hùng mạnh nhất.' },
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
    container.innerHTML = serversData.map(renderServerCard).join('');
}

/** Render BXH */
function renderLeaderboard() {
    const container = document.getElementById('leaderboard-grid');
    container.innerHTML = leaderboardData.map(item => {
        const rankClass = item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : 'bronze';
        return `
            <div class="leaderboard-card">
                <span class="rank ${rankClass}">#${item.rank}</span>
                <img src="${item.avatar}" alt="${item.name}" class="lb-avatar" />
                <div class="lb-info">
                    <h4>${item.name}</h4>
                    <p>Level ${item.level}</p>
                </div>
                <span class="lb-game">${item.game}</span>
            </div>
        `;
    }).join('');
}

/** Render sự kiện */
function renderEvents() {
    const container = document.getElementById('events-grid');
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
        // Chuyển sang register
        title.innerHTML = '<i class="fas fa-user-plus"></i> ĐĂNG KÝ';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchLink.textContent = 'Đã có tài khoản? Đăng nhập';
    } else {
        // Chuyển sang login
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
    setTimeout(() => {
        screen.classList.add('hide');
        document.body.style.overflow = 'auto';
    }, 1800);
}

// ============ INIT ============

document.addEventListener('DOMContentLoaded', function () {
    document.body.style.overflow = 'hidden';

    renderServers();
    renderLeaderboard();
    renderEvents();
    renderNews();

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
    authModal.addEventListener('click', function (e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });

    // Nút close modal auth
    document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);

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
window.updateScore = updateScore;