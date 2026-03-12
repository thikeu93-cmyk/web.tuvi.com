// auth.js - Quản lý đăng nhập Google + JWT

const auth = {
  user: null,
  token: null,

  init() {
    // Khôi phục session từ localStorage
    const saved = localStorage.getItem('tuvi_auth');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.user = data.user;
        this.token = data.token;
        this.updateUI(true);
      } catch { localStorage.removeItem('tuvi_auth'); }
    }

    // Render Google Sign-In button
    this.renderGoogleButton();
  },

  renderGoogleButton() {
    const clientId = document.querySelector('meta[name="google-client-id"]')?.content;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      // DEV MODE: Hiện nút đăng nhập giả
      const devBtn = document.getElementById('devLoginBtn');
      if (devBtn) {
        devBtn.style.display = 'block';
        devBtn.addEventListener('click', () => this.devLogin());
      }
      return;
    }

    // Real Google Sign-In
    if (window.google?.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => this.handleGoogleCallback(response),
      });
      const btnContainer = document.getElementById('googleSignInBtn');
      if (btnContainer) {
        google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 300,
        });
      }
    }
  },

  // Callback khi Google trả credential
  async handleGoogleCallback(response) {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (data.success) {
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem('tuvi_auth', JSON.stringify({ user: data.user, token: data.token }));
        this.updateUI(true);
      } else {
        alert('Đăng nhập thất bại: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi kết nối server. Đảm bảo đã chạy node server.js');
    }
  },

  // DEV MODE: Đăng nhập không cần Google
  async devLogin() {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: 'dev-mode' }),
      });
      const data = await res.json();
      if (data.success) {
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem('tuvi_auth', JSON.stringify({ user: data.user, token: data.token }));
        this.updateUI(true);
      }
    } catch (err) {
      alert('Lỗi kết nối server.');
    }
  },

  // Đăng xuất
  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('tuvi_auth');
    this.updateUI(false);
  },

  // Cập nhật UI theo trạng thái đăng nhập
  updateUI(loggedIn) {
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const mainForm = document.getElementById('mainFormArea');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (loggedIn && this.user) {
      if (loginSection) loginSection.style.display = 'none';
      if (userSection) userSection.style.display = 'flex';
      if (mainForm) mainForm.style.display = 'block';
      if (userName) userName.textContent = this.user.name || this.user.email;
      if (userAvatar && this.user.picture) {
        userAvatar.src = this.user.picture;
        userAvatar.style.display = 'block';
      }
    } else {
      if (loginSection) loginSection.style.display = 'block';
      if (userSection) userSection.style.display = 'none';
      if (mainForm) mainForm.style.display = 'none';
    }
  },

  // Lấy headers có JWT
  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  },

  // Hiện modal giới hạn
  showLimitModal(contacts) {
    const modal = document.getElementById('limitModal');
    if (modal) {
      const zalo = modal.querySelector('.contact-zalo');
      const tiktok = modal.querySelector('.contact-tiktok');
      if (zalo && contacts.zalo) zalo.textContent = contacts.zalo;
      if (tiktok && contacts.tiktok) tiktok.textContent = contacts.tiktok;
      modal.classList.add('active');
    }
  },

  closeLimitModal() {
    const modal = document.getElementById('limitModal');
    if (modal) modal.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  auth.init();
});
