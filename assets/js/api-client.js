// ============================================
// VƯƠNG QUỐC GOLD - API Client
// Dùng chung cho tất cả các trang
// ============================================

// ===== CẤU HÌNH =====
// ⭐ QUAN TRỌNG: Sửa URL này khi deploy
// - Local (chạy trên PC): http://localhost:5000/api
// - Render (đã deploy): https://vqg-backend.onrender.com/api
const API_BASE = 'http://localhost:5000/api';

// ============================================
// AUTH - Xử lý đăng nhập/đăng ký
// ============================================
const Auth = {
    // === Lấy user từ localStorage ===
    getCachedUser() {
        try {
            const data = localStorage.getItem('vqg_user');
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    // === Lưu user vào localStorage ===
    setCachedUser(user) {
        localStorage.setItem('vqg_user', JSON.stringify(user));
    },

    // === Kiểm tra đã đăng nhập chưa ===
    isLoggedIn() {
        return !!this.getCachedUser();
    },

    // === ĐĂNG KÝ ===
    async register(username, password) {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || '❌ Đăng ký thất bại!');
        }
        return data;
    },

    // === ĐĂNG NHẬP ===
    async login(username, password) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || '❌ Đăng nhập thất bại!');
        }
        // Lưu user vào localStorage
        this.setCachedUser(data.user);
        return data;
    },

    // === LẤY THÔNG TIN USER ===
    async refreshProfile() {
        const user = this.getCachedUser();
        if (!user) {
            throw new Error('⚠️ Chưa đăng nhập!');
        }

        const res = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const data = await res.json();
        if (!res.ok) {
            if (res.status === 401) {
                this.logout();
                throw new Error('⏰ Phiên đăng nhập đã hết hạn!');
            }
            throw new Error(data.message || '❌ Lỗi lấy thông tin!');
        }
        // Cập nhật user
        this.setCachedUser({ ...user, ...data });
        return data;
    },

    // === ĐĂNG XUẤT ===
    logout(redirect) {
        localStorage.removeItem('vqg_user');
        if (redirect) {
            window.location.href = redirect;
        }
    }
};

// ============================================
// API FETCH - Gọi API có xác thực
// ============================================
async function apiFetch(method, url, body, options = {}) {
    const user = Auth.getCachedUser();
    
    // Tạo header
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    // Thêm token nếu đã đăng nhập
    if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }

    const res = await fetch(`${API_BASE}${url}`, {
        method: method || 'GET',
        headers: headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || '❌ Lỗi API!');
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

// ============================================
// GAME API - Các hàm liên quan đến game
// ============================================
const GameAPI = {
    // === Lấy câu hỏi ngẫu nhiên ===
    async getRandomQuestion() {
        return apiFetch('GET', '/questions/random');
    },

    // === Gửi đáp án ===
    async submitAnswer(questionId, answer) {
        return apiFetch('POST', '/games/king/answer', {
            questionId: questionId,
            answer: answer
        });
    },

    // === Lấy CTV ===
    async getLeaderboard(limit = 20) {
        return apiFetch('GET', `/leaderboard/top?limit=${limit}`, null, { auth: false });
    },

    // === Tham gia đấu trường ===
    async joinArena() {
        return apiFetch('POST', '/games/king/join');
    }
};

// ============================================
// ADMIN API - Chỉ dùng cho admin.html
// ============================================
const AdminAPI = {
    _token: null,

    // === Lấy token từ localStorage ===
    getToken() {
        if (this._token) return this._token;
        try {
            const token = localStorage.getItem('admin_token');
            if (token) this._token = token;
            return token;
        } catch {
            return null;
        }
    },

    // === Lưu token ===
    setToken(token) {
        this._token = token;
        localStorage.setItem('admin_token', token);
    },

    // === Xóa token ===
    clearToken() {
        this._token = null;
        localStorage.removeItem('admin_token');
    },

    // === Đăng nhập admin ===
    async login(username, password) {
        const res = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || '❌ Đăng nhập admin thất bại!');
        }
        this.setToken(data.token);
        return data;
    },

    // === Gọi API admin (có token) ===
    async fetch(method, url, body) {
        const token = this.getToken();
        if (!token) {
            throw new Error('⚠️ Chưa đăng nhập admin!');
        }

        const res = await fetch(`${API_BASE}${url}`, {
            method: method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': token
            },
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
            this.clearToken();
            throw new Error('⏰ Phiên đăng nhập admin đã hết hạn!');
        }

        if (!res.ok) {
            throw new Error(data.message || '❌ Lỗi API admin!');
        }

        return data;
    },

    // === Lấy danh sách câu hỏi ===
    async getQuestions() {
        return this.fetch('GET', '/admin/questions');
    },

    // === Thêm câu hỏi ===
    async addQuestion(data) {
        return this.fetch('POST', '/admin/questions', data);
    },

    // === Xóa câu hỏi ===
    async deleteQuestion(id) {
        return this.fetch('DELETE', `/admin/questions/${id}`);
    },

    // === Bật/tắt câu hỏi ===
    async toggleQuestion(id) {
        return this.fetch('PATCH', `/admin/questions/${id}/toggle`);
    },

    // === Lấy thống kê ===
    async getStats() {
        return this.fetch('GET', '/admin/stats');
    },

    // === Cập nhật câu hỏi ===
    async updateQuestion(id, data) {
        return this.fetch('PUT', `/admin/questions/${id}`, data);
    }
};

// ============================================
// EXPORT - Cho các file HTML dùng
// ============================================
window.API_BASE = API_BASE;
window.Auth = Auth;
window.apiFetch = apiFetch;
window.GameAPI = GameAPI;
window.AdminAPI = AdminAPI;

console.log('✅ API Client đã sẵn sàng!');
console.log(`📍 API_BASE: ${API_BASE}`);