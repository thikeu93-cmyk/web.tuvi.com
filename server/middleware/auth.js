const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tuvi_secret_key_2026';

// Xác thực Google ID Token và trả JWT
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Thiếu credential' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      // DEV MODE: Cho phép đăng nhập không cần Google nếu chưa có Client ID
      console.log('[Auth] ⚠️ DEV MODE: Chưa có GOOGLE_CLIENT_ID, dùng mock auth');
      const mockUser = { email: 'dev@tuvi.vn', name: 'Dev User', picture: '' };
      const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ success: true, token, user: mockUser });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();

    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    console.log(`[Auth] ✅ Đăng nhập: ${user.email}`);
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('[Auth] ❌ Lỗi:', error.message);
    res.status(401).json({ success: false, message: 'Token Google không hợp lệ' });
  }
};

// Middleware xác thực JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Vui lòng đăng nhập để sử dụng tính năng này.',
      requireLogin: true
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
      requireLogin: true
    });
  }
};
