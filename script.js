// ============================================
// VƯƠNG QUỐC GOLD - Main JavaScript
// ============================================

// ============ DATA ============

/** Danh sách server game */
const serversData = [
    {
        id: 1,
        name: 'Vương Quốc Gold - Server 1',
        slug: 'server-1',
        category: 'MMORPG',
        status: 'online',
        rating: 4.9,
        players: 2500,
        thumbnail: 'https://picsum.photos/seed/server1/400/225',
        isNew: false,
        isFeatured: true,
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
    },
];

/** Bảng xếp hạng (top 3) */
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
                <button class="play-btn" data-slug="${server.slug}"><i class="fas fa-play"></i> VÀO GAME</button>
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

// ============ PLAY BUTTON ============

function setupPlayButtons() {
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.play-btn');
        if (btn) {
            const slug = btn.dataset.slug;
            alert(`🚀 Đang kết nối đến ${slug}...\n(Chức năng này sẽ sớm có)`);
        }
    });
}

// ============ GOLD MODAL ============

function setupGoldModal() {
    const display = document.getElementById('gold-display');
    const modal = document.getElementById('gold-modal');
    const closeBtn = document.getElementById('gold-modal-close');

    display.addEventListener('click', function () {
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

// ============ LOGOUT ============

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            alert('🚪 Đã đăng xuất!');
        }
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
    setupPlayButtons();
    setupGoldModal();
    setupUserDropdown();
    setupMobileMenu();
    setupLogout();
    setupHeaderScroll();
    setupParticles();

    hideLoading();
});