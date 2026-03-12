// rateLimit.js - Cookie-based 1 free view/day per feature
const fs = require('fs');
const path = require('path');

function checkCookieLimit(feature) {
  return (req, res, next) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const cookieName = `tuvi_used_${feature}`;
    
    // Parse cookies
    const cookies = {};
    (req.headers.cookie || '').split(';').forEach(c => {
      const [key, val] = c.trim().split('=');
      if (key) cookies[key] = val;
    });
    
    const lastUsed = cookies[cookieName];
    
    if (lastUsed === today) {
      // Đã dùng hôm nay → chặn
      return res.status(429).json({
        success: false,
        limitReached: true,
        message: 'Bạn đã sử dụng lượt miễn phí hôm nay. Liên hệ để mua thêm lượt.',
        contacts: {
          zalo: '0812.79.9999',
          tiktok: '@tuvi.vn'
        }
      });
    }
    
    // Chưa dùng → cho phép, set cookie sẽ set sau khi thành công
    req.featureName = feature;
    next();
  };
}

function recordUsageCookie(feature) {
  return (req, res, next) => {
    const today = new Date().toISOString().split('T')[0];
    const cookieName = `tuvi_used_${feature}`;
    
    // Set cookie hết hạn lúc 00:00 ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    res.cookie(cookieName, today, {
      expires: tomorrow,
      httpOnly: false, // để JS có thể đọc check trước
      sameSite: 'Lax',
      path: '/'
    });
    
    next();
  };
}

module.exports = { checkCookieLimit, recordUsageCookie };
