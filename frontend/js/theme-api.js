// ========================================
// Theme API Integration - PuzzleChain
// ========================================

const ThemeAPI = {
  // Get user's current theme settings
  async getTheme() {
    const response = await fetch('/api/theme', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Get full config (current + available)
  async getConfig() {
    const response = await fetch('/api/theme/config', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Get available themes and animations
  async getAvailable() {
    const response = await fetch('/api/theme/available', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Update theme settings
  async updateTheme(themeData) {
    const response = await fetch('/api/theme', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(themeData)
    });
    return response.json();
  }
};

// Theme Manager Class
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.pendingTheme = null;
    this.themes = [];
    this.animations = [];
    this.userSettings = null;
  }

  async init() {
    try {
      // Load theme configuration from API
      const config = await ThemeAPI.getConfig();
      
      this.themes = config.available.themes;
      this.animations = config.available.animations;
      this.userSettings = config.current;
      
      // Set current theme
      this.currentTheme = config.current.name;
      
      // Apply theme to UI
      this.applyThemeToUI(this.currentTheme);
      
      console.log('Theme loaded:', this.currentTheme);
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Fallback to default
      this.themes = this.getDefaultThemes();
      this.animations = this.getDefaultAnimations();
    }
  }

  getDefaultThemes() {
    return [
      { id: 'anime-neon', name: 'أنمي نيون', bg: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', char: '🌸', color: '#ff6eb4', font: 'Cairo' },
      { id: 'classic-royal', name: 'كلاسيك رويال', bg: 'linear-gradient(135deg,#1a0a00,#3d1f00,#1a0a00)', char: '👑', color: '#c8963c', font: 'Cinzel' },
      { id: 'cyber-2077', name: 'سايبر 2077', bg: 'linear-gradient(135deg,#001010,#002020,#001010)', char: '🤖', color: '#00ffc8', font: 'Orbitron' },
      { id: 'dark-fantasy', name: 'داك فانتازيا', bg: 'linear-gradient(135deg,#0d0010,#1a0030,#0d0010)', char: '🔮', color: '#c084fc', font: 'Cairo' }
    ];
  }

  getDefaultAnimations() {
    return [
      { id: 'float', name: 'Float', icon: '🪶' },
      { id: 'pulse', name: 'نبض', icon: '💗' },
      { id: 'shake', name: 'هز', icon: '📳' },
      { id: 'sparkle', name: 'لمعان', icon: '✨' },
      { id: 'rotate', name: 'دوران', icon: '🔄' }
    ];
  }

  applyThemeToUI(themeName) {
    const theme = this.themes.find(t => t.name === themeName);
    if (!theme) return;

    // Update CSS variables
    document.documentElement.style.setProperty('--theme-bg', theme.bg);
    document.documentElement.style.setProperty('--theme-color', theme.color);
    document.documentElement.style.setProperty('--theme-font', theme.font);

    // Update active state in theme cards
    document.querySelectorAll('.theme-card').forEach(card => {
      const cardName = card.dataset.themeName;
      card.classList.toggle('active', cardName === themeName);
    });

    // Update live preview
    const preview = document.getElementById('live-preview');
    if (preview) {
      preview.style.background = theme.bg;
      preview.innerHTML = `
        <span style="font-size:40px;animation:float 3s ease-in-out infinite">${theme.char}</span>
        <span style="font-size:14px;font-weight:700;color:${theme.color};font-family:${theme.font},Cairo,sans-serif">PuzzleChain</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.5)">افتح صندوقك الآن</span>
      `;
    }
  }

  selectTheme(themeName) {
    this.pendingTheme = themeName;
    this.applyThemeToUI(themeName);

    // Show apply bar
    const bar = document.getElementById('apply-bar');
    if (bar) {
      bar.style.display = 'flex';
      document.getElementById('selected-theme-name').textContent = themeName;
      document.getElementById('selected-theme-name').style.color = 
        this.themes.find(t => t.name === themeName)?.color || '#ff6eb4';
    }
  }

  async applyTheme() {
    if (!this.pendingTheme && !this.currentTheme) return;

    const themeName = this.pendingTheme || this.currentTheme;

    try {
      // Save to API
      const result = await ThemeAPI.updateTheme({ name: themeName });
      
      this.currentTheme = themeName;
      this.pendingTheme = null;
      this.userSettings = result;

      // Hide apply bar
      document.getElementById('apply-bar').style.display = 'none';

      // Show success toast
      const toast = document.getElementById('toast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

      console.log('Theme applied:', themeName);
    } catch (error) {
      console.error('Failed to apply theme:', error);
      alert('فشل في حفظ الثيم. يرجى المحاولة مرة أخرى.');
    }
  }

  cancelSelection() {
    document.getElementById('apply-bar').style.display = 'none';
    this.pendingTheme = null;
    this.applyThemeToUI(this.currentTheme);
  }

  async selectAnimation(animId) {
    try {
      const result = await ThemeAPI.updateTheme({ animation: animId });
      this.userSettings = result;
      
      // Update UI
      document.querySelectorAll('.anim-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.animId === animId);
      });

      console.log('Animation changed:', animId);
    } catch (error) {
      console.error('Failed to change animation:', error);
    }
  }

  async toggleSetting(setting, value) {
    try {
      const updateData = {};
      updateData[setting] = value;
      
      const result = await ThemeAPI.updateTheme(updateData);
      this.userSettings = result;
      
      console.log('Setting updated:', setting, value);
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  }
}

// Global theme manager instance
const themeManager = new ThemeManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await themeManager.init();
});

// Wrapper functions for HTML onclick handlers
function selectTheme(card, name) {
  themeManager.selectTheme(name);
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

// Toggle settings
function toggleSound(enabled) {
  themeManager.toggleSetting('soundEnabled', enabled);
}

function toggleHaptics(enabled) {
  themeManager.toggleSetting('hapticsEnabled', enabled);
}

function toggleParticles(enabled) {
  themeManager.toggleSetting('particlesEnabled', enabled);
}

// Helper to get token (implement based on your auth)
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}
