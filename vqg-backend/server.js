require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (sẽ phát triển sau)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Vương Quốc Gold API đang chạy' });
});

// Routes sẽ được thêm sau
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/user', require('./routes/user'));
// app.use('/api/game', require('./routes/game'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Vương Quốc Gold Backend đang chạy tại http://localhost:${PORT}`);
});