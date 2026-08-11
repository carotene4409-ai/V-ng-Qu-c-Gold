const express = require('express');
const router = express.Router();

// Lấy danh sách server
router.get('/servers', (req, res) => {
    res.json([
        { id: 1, name: 'Server 1', status: 'online', players: 2500 },
        { id: 2, name: 'Server 2', status: 'new', players: 1800 },
        { id: 3, name: 'Server 3', status: 'online', players: 1200 },
    ]);
});

// Lấy BXH
router.get('/leaderboard', (req, res) => {
    res.json([
        { rank: 1, name: 'Đại Đế Long', level: 99 },
        { rank: 2, name: 'Thánh Vương', level: 87 },
        { rank: 3, name: 'Hiệp Sĩ Vàng', level: 82 },
    ]);
});

module.exports = router;