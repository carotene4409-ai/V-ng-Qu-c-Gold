const express = require('express');
const router = express.Router();

// Lấy thông tin user
router.get('/profile', (req, res) => {
    res.json({
        id: 1,
        name: 'Nhà Vua',
        level: 50,
        gold: 25,
        avatar: 'https://i.pravatar.cc/80?img=12'
    });
});

// Cập nhật user
router.put('/profile', (req, res) => {
    res.json({ message: 'Cập nhật thành công' });
});

module.exports = router;