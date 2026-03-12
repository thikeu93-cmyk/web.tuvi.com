const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const horoscopeController = require('./server/controllers/horoscopeController');
const { checkCookieLimit, recordUsageCookie } = require('./server/middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes (Cookie-based limit: 1 free/day) ---
app.post('/api/horoscope', 
  checkCookieLimit('horoscope'), 
  async (req, res, next) => {
    await horoscopeController.getHoroscope(req, res);
    if (res.statusCode === 200) next(); // ghi cookie nếu thành công
  },
  recordUsageCookie('horoscope')
);

app.post('/api/predict-child', 
  checkCookieLimit('predict-child'), 
  async (req, res, next) => {
    await horoscopeController.predictChild(req, res);
    if (res.statusCode === 200) next();
  },
  recordUsageCookie('predict-child')
);

// Fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌟 XemTuViCoHoc đang chạy tại: http://localhost:${PORT}`);
  console.log(`   Trang chủ: http://localhost:${PORT}/`);
  console.log(`   Lá số:     http://localhost:${PORT}/laso.html`);
  console.log(`   Lịch âm:   http://localhost:${PORT}/lich-am.html`);
  console.log(`   Nhấn CTRL+C để dừng server.\n`);
});

module.exports = app;
