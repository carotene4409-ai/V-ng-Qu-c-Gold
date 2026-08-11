const express = require('express');
const router = express.Router();

// Đăng ký
router.post('/register', (req, res) => {
    res.json({ message: 'Đăng ký thành công (demo)' });
});

// Đăng nhập
router.post('/login', (req, res) => {
    res.json({ 
        message: 'Đăng nhập thành công (demo)',
        token: 'demo_jwt_token',
        user: { id: 1, name: 'Nhà Vua', gold: 25 }
    });
});

// Refresh token
router.post('/refresh', (req, res) => {
    res.json({ token: 'new_demo_token' });
});

module.exports = router;