// ========================================
// Theme API Integration - PuzzleChain
// Admin-controlled theme system
// ========================================

const ThemeAPI = {
  // Get current global theme (anyone can access)
  async getGlobalTheme() {
    const response = await fetch('/api/theme', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Get full config (themes + animations)
  async getConfig() {
    const response = await fetch('/api/theme/config', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Get available themes/animations
  async getAvailable() {
    const response = await fetch('/api/theme/available', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // ADMIN: Set global theme
  async setGlobalTheme(themeData) {
    const response = await fetch('/api/theme/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(themeData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update theme');
    }
    return response.json();
  }
};

// Theme Manager Class
class ThemeManager {
  constructor() {
    this.globalTheme = null;
    this.availableThemes = [];
    this.availableAnimations = [];
    this.isAdmin = false;
  }

  async init() {
    try {
      // Load theme configuration
      const config = await ThemeAPI.getConfig();
      
      this.globalTheme = config.global;
      this.availableThemes = config.available.themes;
      this.availableAnimations = config.available.animations;
      
      // Check if user is admin (you need to implement this check)
      this.isAdmin = await this.checkAdminStatus();
      
      // Apply theme to UI
      this.applyThemeToUI();
      
      console.log('Theme loaded:', this.globalTheme.theme.name);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }

  async checkAdminStatus() {
    // Implement your admin check logic here
    // For example, check user role from token or API
    const token = getToken();
    if (!token) return false;
    
    try {
      // Decode JWT or call user info API
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin' || payload.role === 'superadmin';
    } catch {
      return false;
    }
  }

  applyThemeToUI() {
    if (!this.globalTheme) return;

    const theme = this.globalTheme.theme;
    const anim = this.globalTheme.animation;

    // Update CSS variables
    document.documentElement.style.setProperty('--theme-bg', theme.bg);
    document.documentElement.style.setProperty('--theme-color', theme.color);
    document.documentElement.style.setProperty('--theme-font', theme.font);

    // Update live preview
    const preview = document.getElementById('live-preview');
    if (preview) {
      preview.style.background = theme.bg;
      preview.innerHTML = `
        <span style="font-size:40px;animation:${anim.id} 3s ease-in-out infinite">${theme.char}</span>
        <span style="font-size:14px;font-weight:700;color:${theme.color};font-family:${theme.font},Cairo,sans-serif">PuzzleChain</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.5)">افتح صندوقك الآن</span>
      `;
    }

    // Update active theme card
    document.querySelectorAll('.theme-card').forEach(card => {
      const cardThemeId = card.dataset.themeId;
      card.classList.toggle('active', cardThemeId === theme.id);
    });

    // Update active animation card
    document.querySelectorAll('.anim-card').forEach(card => {
      const cardAnimId = card.dataset.animId;
      card.classList.toggle('selected', cardAnimId === anim.id);
    });

    // Update toggle states
    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
      soundToggle.classList.toggle('on', this.globalTheme.soundEnabled);
    }
    const hapticsToggle = document.getElementById('toggle-haptics');
    if (hapticsToggle) {
      hapticsToggle.classList.toggle('on', this.globalTheme.hapticsEnabled);
    }
    const particlesToggle = document.getElementById('toggle-particles');
    if (particlesToggle) {
      particlesToggle.classList.toggle('on', this.globalTheme.particlesEnabled);
    }

    // Show/hide admin controls
    this.updateAdminUI();
  }

  updateAdminUI() {
    const adminControls = document.querySelectorAll('.admin-only');
    const userNotice = document.getElementById('user-notice');

    if (this.isAdmin) {
      // Show admin controls
      adminControls.forEach(el => el.style.display = '');
      // Hide user notice
      if (userNotice) userNotice.style.display = 'none';
    } else {
      // Hide admin controls
      adminControls.forEach(el => el.style.display = 'none');
      // Show user notice
      if (userNotice) userNotice.style.display = 'block';
    }
  }

  // ADMIN: Select theme for preview
  selectTheme(themeId) {
    if (!this.isAdmin) return;

    const theme = this.availableThemes.find(t => t.id === themeId);
    if (!theme) return;

    // Update preview
    const preview = document.getElementById('live-preview');
    if (preview) {
      preview.style.background = theme.bg;
      preview.innerHTML = `
        <span style="font-size:40px;animation:float 3s ease-in-out infinite">${theme.char}</span>
        <span style="font-size:14px;font-weight:700;color:${theme.color};font-family:${theme.font},Cairo,sans-serif">PuzzleChain</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.5)">افتح صندوقك الآن</span>
      `;
    }

    // Update card selection
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.themeId === themeId);
    });

    // Show apply bar
    const bar = document.getElementById('apply-bar');
    if (bar) {
      bar.style.display = 'flex';
      const selectedName = document.getElementById('selected-theme-name');
      if (selectedName) {
        selectedName.textContent = theme.name;
        selectedName.style.color = theme.color;
      }
    }
  }

  // ADMIN: Select animation
  selectAnimation(animId) {
    if (!this.isAdmin) return;

    document.querySelectorAll('.anim-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.animId === animId);
    });
  }

  // ADMIN: Apply theme globally
  async applyTheme() {
    if (!this.isAdmin) return;

    // Get selected theme
    const selectedThemeCard = document.querySelector('.theme-card.active');
    const selectedAnimCard = document.querySelector('.anim-card.selected');

    const themeId = selectedThemeCard?.dataset.themeId;
    const animId = selectedAnimCard?.dataset.animId;

    try {
      // Save to API
      const result = await ThemeAPI.setGlobalTheme({
        themeId,
        animationId: animId,
        soundEnabled: document.getElementById('toggle-sound')?.classList.contains('on'),
        hapticsEnabled: document.getElementById('toggle-haptics')?.classList.contains('on'),
        particlesEnabled: document.getElementById('toggle-particles')?.classList.contains('on'),
      });

      this.globalTheme = result;

      // Hide apply bar
      document.getElementById('apply-bar').style.display = 'none';

      // Show success toast
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = `✅ تم تطبيق الثيم "${result.theme.name}" على جميع المستخدمين!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }

      console.log('Global theme applied:', result.theme.name);
    } catch (error) {
      console.error('Failed to apply theme:', error);
      alert('فشل في تطبيق الثيم: ' + error.message);
    }
  }

  // ADMIN: Cancel selection
  cancelSelection() {
    if (!this.isAdmin) return;
    
    document.getElementById('apply-bar').style.display = 'none';
    this.applyThemeToUI(); // Reset to current global theme
  }
}

// Global theme manager instance
const themeManager = new ThemeManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await themeManager.init();
});

// Wrapper functions for HTML onclick handlers
function selectTheme(card, themeId) {
  themeManager.selectTheme(themeId);
}

function applyTheme() {
  themeManager.applyTheme();
}

function cancelTheme() {
  themeManager.cancelSelection();
}

function selectAnimation(animId) {
  themeManager.selectAnimation(animId);
}

// Helper to get token
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}
