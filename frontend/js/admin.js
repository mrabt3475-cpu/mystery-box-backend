// ========================================
// Admin Dashboard - PuzzleChain
// JavaScript functionality for admin controls
// ========================================

// ========================================
// API Functions
// ========================================

const AdminAPI = {
  // Get admin stats
  async getStats() {
    const response = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Get all users
  async getUsers(page = 1, limit = 20, search = '') {
    const params = new URLSearchParams({ page, limit, search });
    const response = await fetch(`/api/admin/users?${params}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Update user
  async updateUser(userId, data) {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Get all boxes
  async getBoxes() {
    const response = await fetch('/api/admin/boxes', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Create box
  async createBox(boxData) {
    const response = await fetch('/api/admin/boxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(boxData)
    });
    return response.json();
  },

  // Update box
  async updateBox(boxId, boxData) {
    const response = await fetch(`/api/admin/boxes/${boxId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(boxData)
    });
    return response.json();
  },

  // Delete box
  async deleteBox(boxId) {
    const response = await fetch(`/api/admin/boxes/${boxId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Get global theme
  async getGlobalTheme() {
    const response = await fetch('/api/theme', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Set global theme (admin only)
  async setGlobalTheme(themeData) {
    const response = await fetch('/api/theme/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(themeData)
    });
    return response.json();
  },

  // Get available themes
  async getAvailableThemes() {
    const response = await fetch('/api/theme/available', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  // Broadcast notification
  async broadcastNotification(message) {
    const response = await fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ message })
    });
    return response.json();
  }
};

// ========================================
// Theme Management
// ========================================

class AdminThemeManager {
  constructor() {
    this.currentTheme = null;
    this.currentAnimation = null;
    this.availableThemes = [];
    this.availableAnimations = [];
    this.selectedThemeId = null;
    this.selectedAnimId = null;
  }

  async init() {
    try {
      // Load global theme
      const globalTheme = await AdminAPI.getGlobalTheme();
      this.currentTheme = globalTheme.theme;
      this.currentAnimation = globalTheme.animation;

      // Load available themes
      const available = await AdminAPI.getAvailableThemes();
      this.availableThemes = available.themes;
      this.availableAnimations = available.animations;

      // Apply to UI
      this.applyThemeToUI();

      console.log('Admin theme loaded:', this.currentTheme.name);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }

  applyThemeToUI() {
    if (!this.currentTheme) return;

    // Update preview
    const previewChar = document.getElementById('preview-char');
    const previewName = document.getElementById('preview-name');
    const livePreview = document.querySelector('.live-preview');

    if (previewChar) previewChar.textContent = this.currentTheme.char;
    if (previewName) {
      previewName.textContent = this.currentTheme.name;
      previewName.style.color = this.currentTheme.color;
    }
    if (livePreview) {
      livePreview.style.background = this.currentTheme.bg;
    }

    // Update theme card selection
    document.querySelectorAll('.theme-card').forEach(card => {
      const cardThemeId = card.dataset.themeId;
      card.classList.toggle('active', cardThemeId === this.currentTheme.id);
    });

    // Update animation selection
    document.querySelectorAll('.anim-card').forEach(card => {
      const cardAnimId = card.dataset.animId;
      card.classList.toggle('selected', cardAnimId === this.currentAnimation.id);
    });

    // Update toggle states
    const soundToggle = document.getElementById('admin-toggle-sound');
    if (soundToggle) {
      soundToggle.classList.toggle('on', globalTheme?.soundEnabled ?? true);
    }
    const hapticsToggle = document.getElementById('admin-toggle-haptics');
    if (hapticsToggle) {
      hapticsToggle.classList.toggle('on', globalTheme?.hapticsEnabled ?? true);
    }
    const particlesToggle = document.getElementById('admin-toggle-particles');
    if (particlesToggle) {
      particlesToggle.classList.toggle('on', globalTheme?.particlesEnabled ?? true);
    }
  }

  selectTheme(themeId) {
    this.selectedThemeId = themeId;

    const theme = this.availableThemes.find(t => t.id === themeId);
    if (!theme) return;

    // Update preview
    const previewChar = document.getElementById('preview-char');
    const previewName = document.getElementById('preview-name');
    const livePreview = document.querySelector('.live-preview');

    if (previewChar) previewChar.textContent = theme.char;
    if (previewName) {
      previewName.textContent = theme.name;
      previewName.style.color = theme.color;
    }
    if (livePreview) {
      livePreview.style.background = theme.bg;
    }

    // Update card selection
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.themeId === themeId);
    });
  }

  selectAnimation(animId) {
    this.selectedAnimId = animId;

    document.querySelectorAll('.anim-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.animId === animId);
    });
  }

  async applyGlobalTheme() {
    try {
      const result = await AdminAPI.setGlobalTheme({
        themeId: this.selectedThemeId || this.currentTheme?.id,
        animationId: this.selectedAnimId || this.currentAnimation?.id,
        soundEnabled: document.getElementById('admin-toggle-sound')?.classList.contains('on'),
        hapticsEnabled: document.getElementById('admin-toggle-haptics')?.classList.contains('on'),
        particlesEnabled: document.getElementById('admin-toggle-particles')?.classList.contains('on'),
      });

      this.currentTheme = result.theme;
      this.currentAnimation = result.animation;

      // Show success toast
      showAdminToast(`✅ تم تطبيق الثيم "${result.theme.name}" على جميع المستخدمين!`);

      console.log('Global theme applied:', result.theme.name);
    } catch (error) {
      console.error('Failed to apply theme:', error);
      showAdminToast('❌ فشل في تطبيق الثيم: ' + error.message, true);
    }
  }
}

// Global theme manager
const adminThemeManager = new AdminThemeManager();

// ========================================
// Navigation
// ========================================

function adminNavigate(section) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(el => {
    el.style.display = 'none';
  });

  // Show selected section
  const sectionEl = document.getElementById(`admin-${section}`);
  if (sectionEl) {
    sectionEl.style.display = 'block';
  }

  // Load section data
  switch (section) {
    case 'stats':
      loadAdminStats();
      break;
    case 'users':
      loadUsers();
      break;
    case 'boxes':
      loadBoxes();
      break;
    case 'theme':
      adminThemeManager.init();
      break;
  }
}

// ========================================
// Stats
// ========================================

async function loadAdminStats() {
  try {
    const stats = await AdminAPI.getStats();

    document.getElementById('stat-total-users').textContent = formatNumber(stats.totalUsers);
    document.getElementById('stat-users-change').textContent = `+${stats.newUsersToday} اليوم`;

    document.getElementById('stat-total-boxes').textContent = formatNumber(stats.totalBoxesOpened);
    document.getElementById('stat-boxes-change').textContent = `+${stats.boxesOpenedToday} اليوم`;

    document.getElementById('stat-revenue').textContent = `$${formatNumber(stats.totalRevenue)}`;
    document.getElementById('stat-revenue-change').textContent = `+$${formatNumber(stats.revenueToday)} اليوم`;

    document.getElementById('stat-prizes').textContent = `$${formatNumber(stats.totalPrizes)}`;
    document.getElementById('stat-prizes-change').textContent = `+$${formatNumber(stats.prizesToday)} اليوم`;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// ========================================
// Users Management
// ========================================

let currentPage = 1;
let currentSearch = '';

async function loadUsers(page = 1) {
  try {
    currentPage = page;
    const result = await AdminAPI.getUsers(page, 20, currentSearch);

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    result.users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 14px;">
              ${user.firstName?.charAt(0) || '?'}
            </div>
            <div>
              <div style="font-weight: 600;">${user.username || user.firstName || 'غير معروف'}</div>
              <div style="font-size: 11px; color: var(--text2);">${user.telegramId}</div>
            </div>
          </div>
        </td>
        <td style="font-family: monospace;">${user.telegramId}</td>
        <td>$${user.balance.toFixed(2)}</td>
        <td>${user.points}</td>
        <td><span class="badge">${user.level}</span></td>
        <td>${user.isActive ? '<span class="badge" style="background: #34d399;">نشط</span>' : '<span class="badge" style="background: #ef4444;">محظور</span>'}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn" onclick="editUser('${user._id}')" style="padding: 6px 10px; font-size: 11px;">✏️ تعديل</button>
            <button class="btn" onclick="toggleUserStatus('${user._id}', ${!user.isActive})" style="padding: 6px 10px; font-size: 11px;">${user.isActive ? '🚫 حظر' : '✅ تفعيل'}</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

async function searchUsers() {
  currentSearch = document.getElementById('user-search').value;
  await loadUsers(1);
}

async function editUser(userId) {
  // Show edit modal (implement based on your needs)
  const newBalance = prompt('أدخل الرصيد الجديد:');
  if (newBalance !== null) {
    try {
      await AdminAPI.updateUser(userId, { balance: parseFloat(newBalance) });
      showAdminToast('✅ تم تحديث الرصيد');
      loadUsers(currentPage);
    } catch (error) {
      showAdminToast('❌ فشل في التحديث', true);
    }
  }
}

async function toggleUserStatus(userId, isActive) {
  try {
    await AdminAPI.updateUser(userId, { isActive });
    showAdminToast(isActive ? '✅ تم تفعيل المستخدم' : '🚫 تم حظر المستخدم');
    loadUsers(currentPage);
  } catch (error) {
    showAdminToast('❌ فشل في العملية', true);
  }
}

// ========================================
// Boxes Management
// ========================================

async function loadBoxes() {
  try {
    const boxes = await AdminAPI.getBoxes();

    const grid = document.getElementById('admin-boxes-grid');
    grid.innerHTML = '';

    boxes.forEach(box => {
      const item = document.createElement('div');
      item.className = 'box-item';
      item.innerHTML = `
        <div class="box-name">${box.name}</div>
        <div class="box-price">$${box.price}</div>
        <div style="font-size: 11px; color: var(--text2); margin-top: 4px;">
          ${box.totalOpened || 0} مفتوح
        </div>
        <div class="box-actions">
          <button class="btn" onclick="editBox('${box._id}')" style="background: var(--accent);">✏️</button>
          <button class="btn" onclick="deleteBox('${box._id}')" style="background: #ef4444;">🗑️</button>
        </div>
      `;
      grid.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load boxes:', error);
  }
}

function showAddBoxModal() {
  const name = prompt('اسم الصندوق:');
  const price = prompt('السعر:');
  const description = prompt('الوصف:');

  if (name && price) {
    AdminAPI.createBox({
      name,
      price: parseFloat(price),
      description,
      image: '/images/boxes/default.png'
    }).then(() => {
      showAdminToast('✅ تم إضافة الصندوق');
      loadBoxes();
    }).catch(err => {
      showAdminToast('❌ فشل في الإضافة', true);
    });
  }
}

async function editBox(boxId) {
  const newPrice = prompt('السعر الجديد:');
  if (newPrice !== null) {
    try {
      await AdminAPI.updateBox(boxId, { price: parseFloat(newPrice) });
      showAdminToast('✅ تم التحديث');
      loadBoxes();
    } catch (error) {
      showAdminToast('❌ فشل في التحديث', true);
    }
  }
}

async function deleteBox(boxId) {
  if (confirm('هل أنت متأكد من حذف هذا الصندوق؟')) {
    try {
      await AdminAPI.deleteBox(boxId);
      showAdminToast('✅ تم الحذف');
      loadBoxes();
    } catch (error) {
      showAdminToast('❌ فشل في الحذف', true);
    }
  }
}

function refreshBoxes() {
  loadBoxes();
}

// ========================================
// Helper Functions
// ========================================

function showAdminToast(message, isError = false) {
  const toast = document.getElementById('admin-toast');
  if (toast) {
    toast.textContent = message;
    toast.style.background = isError ? '#ef4444' : 'var(--accent)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is admin
  const token = getToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      window.location.href = '/';
      return;
    }

    // Load initial data
    await adminThemeManager.init();
    loadAdminStats();
  } catch (error) {
    console.error('Admin init error:', error);
    window.location.href = '/login';
  }
});

// Wrapper functions for onclick
function selectTheme(card, themeId) {
  adminThemeManager.selectTheme(themeId);
}

function selectAnimation(animId) {
  adminThemeManager.selectAnimation(animId);
}

function applyGlobalTheme() {
  adminThemeManager.applyGlobalTheme();
}
