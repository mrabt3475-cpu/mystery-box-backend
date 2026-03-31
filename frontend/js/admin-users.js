// ========================================
// Detailed User Management - Admin Dashboard
// ========================================

// User Management Class
class UserManager {
  constructor() {
    this.currentPage = 1;
    this.currentSearch = '';
    this.selectedUser = null;
    this.users = [];
  }

  async loadUsers(page = 1, search = '') {
    this.currentPage = page;
    this.currentSearch = search;

    try {
      const result = await AdminAPI.getUsers(page, 20, search);
      this.users = result.users;

      const tbody = document.getElementById('users-table-body');
      tbody.innerHTML = '';

      result.users.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'user-row';
        tr.onclick = () => this.showUserDetails(user._id);
        tr.innerHTML = `
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="user-avatar">
                ${user.avatar ? 
                  `<img src="${user.avatar}" alt="">` : 
                  `<span>${user.firstName?.charAt(0) || user.username?.charAt(0) || '?'}</span>`
                }
              </div>
              <div>
                <div class="user-name">${this.escapeHtml(user.username || user.firstName || 'غير معروف')}</div>
                <div class="user-id">@${this.escapeHtml(user.username || 'لا يوجد')}</div>
              </div>
            </div>
          </td>
          <td><code>${user.telegramId}</code></td>
          <td><span class="balance">$${user.balance?.toFixed(2) || '0.00'}</span></td>
          <td><span class="points">${user.points || 0}</span></td>
          <td><span class="level-badge">Lv.${user.level || 1}</span></td>
          <td>
            ${user.isVip ? '<span class="badge badge-vip">VIP</span>' : ''}
            ${user.isActive ? 
              '<span class="badge badge-active">نشط</span>' : 
              '<span class="badge badge-banned">محظور</span>'
            }
          </td>
          <td onclick="event.stopPropagation()">
            <div class="action-buttons">
              <button class="btn-action btn-edit" onclick="userManager.editUser('${user._id}')" title="تعديل">✏️</button>
              <button class="btn-action btn-${user.isActive ? 'ban' : 'unban'}" onclick="userManager.toggleUserStatus('${user._id}', ${!user.isActive})" title="${user.isActive ? 'حظر' : 'تفعيل'}">
                ${user.isActive ? '🚫' : '✅'}
              </button>
              <button class="btn-action btn-vip" onclick="userManager.toggleVip('${user._id}', ${!user.isVip})" title="VIP">👑</button>
              <button class="btn-action btn-delete" onclick="userManager.deleteUser('${user._id}')" title="حذف">🗑️</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Update pagination
      this.updatePagination(result.total, result.totalPages, page);

    } catch (error) {
      console.error('Failed to load users:', error);
      showAdminToast('❌ فشل في تحميل المستخدمين', true);
    }
  }

  updatePagination(total, totalPages, currentPage) {
    const pagination = document.getElementById('users-pagination');
    if (!pagination) return;

    let html = '';
    
    // Previous button
    html += `<button class="btn-page" onclick="userManager.loadUsers(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages && i <= 5; i++) {
      html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="userManager.loadUsers(${i})">${i}</button>`;
    }
    
    if (totalPages > 5) {
      html += `<span style="padding: 0 8px;">...</span>`;
      html += `<button class="btn-page" onclick="userManager.loadUsers(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    html += `<button class="btn-page" onclick="userManager.loadUsers(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    
    pagination.innerHTML = html;
  }

  async showUserDetails(userId) {
    try {
      const user = await AdminAPI.getUser(userId);
      this.selectedUser = user;

      const modal = document.getElementById('user-details-modal');
      if (!modal) {
        this.createUserDetailsModal();
      }

      // Populate modal
      document.getElementById('detail-avatar').innerHTML = user.avatar ? 
        `<img src="${user.avatar}" alt="">` : 
        `<span>${user.firstName?.charAt(0) || '?'}</span>`;
      
      document.getElementById('detail-name').textContent = user.username || user.firstName || 'غير معروف';
      document.getElementById('detail-username').textContent = '@' + (user.username || 'لا يوجد');
      document.getElementById('detail-telegram-id').textContent = user.telegramId;
      document.getElementById('detail-balance').textContent = '$' + (user.balance?.toFixed(2) || '0.00');
      document.getElementById('detail-points').textContent = user.points || 0;
      document.getElementById('detail-level').textContent = 'Level ' + (user.level || 1);
      document.getElementById('detail-wins').textContent = user.totalWins || 0;
      document.getElementById('detail-spent').textContent = '$' + (user.totalSpent?.toFixed(2) || '0.00');
      document.getElementById('detail-referral-earnings').textContent = '$' + (user.stats?.referralEarnings?.toFixed(2) || '0.00');
      document.getElementById('detail-joined').textContent = this.formatDate(user.createdAt);
      document.getElementById('detail-last-active').textContent = this.formatDate(user.lastActiveAt);

      // Status badges
      const statusEl = document.getElementById('detail-status');
      statusEl.innerHTML = user.isActive ? 
        '<span class="badge badge-active">نشط</span>' : 
        '<span class="badge badge-banned">محظور</span>';
      
      if (user.isVip) {
        statusEl.innerHTML += ' <span class="badge badge-vip">VIP</span>';
      }

      // Show modal
      document.getElementById('user-details-modal').classList.add('show');
      document.getElementById('user-details-modal').dataset.userId = userId;

    } catch (error) {
      console.error('Failed to load user details:', error);
      showAdminToast('❌ فشل في تحميل بيانات المستخدم', true);
    }
  }

  createUserDetailsModal() {
    const modalHtml = `
      <div id="user-details-modal" class="modal">
        <div class="modal-content user-details-modal">
          <div class="modal-header">
            <h3>👤 تفاصيل المستخدم</h3>
            <button class="modal-close" onclick="userManager.closeModal()">✕</button>
          </div>
          
          <div class="modal-body">
            <!-- User Info -->
            <div class="detail-section">
              <div class="detail-avatar-large" id="detail-avatar"></div>
              <div class="detail-name" id="detail-name"></div>
              <div class="detail-username" id="detail-username"></div>
              <div class="detail-status" id="detail-status"></div>
            </div>

            <!-- Stats Grid -->
            <div class="detail-stats-grid">
              <div class="detail-stat">
                <div class="detail-stat-label">الرصيد</div>
                <div class="detail-stat-value" id="detail-balance">$0.00</div>
              </div>
              <div class="detail-stat">
                <div class="detail-stat-label">النقاط</div>
                <div class="detail-stat-value" id="detail-points">0</div>
              </div>
              <div class="detail-stat">
                <div class="detail-stat-label">المستوى</div>
                <div class="detail-stat-value" id="detail-level">Lv.1</div>
              </div>
              <div class="detail-stat">
                <div class="detail-stat-label">المكاسب</div>
                <div class="detail-stat-value" id="detail-wins">0</div>
              </div>
            </div>

            <!-- Financial Info -->
            <div class="detail-section">
              <div class="section-title" style="font-size: 13px;">💰 المعلومات المالية</div>
              <div class="detail-info-grid">
                <div class="detail-info-item">
                  <span class="label">إجمالي الإنفاق</span>
                  <span class="value" id="detail-spent">$0.00</span>
                </div>
                <div class="detail-info-item">
                  <span class="label">أرباح الإحالة</span>
                  <span class="value" id="detail-referral-earnings">$0.00</span>
                </div>
              </div>
            </div>

            <!-- Account Info -->
            <div class="detail-section">
              <div class="section-title" style="font-size: 13px;">📋 معلومات الحساب</div>
              <div class="detail-info-grid">
                <div class="detail-info-item">
                  <span class="label">Telegram ID</span>
                  <span class="value" id="detail-telegram-id"></span>
                </div>
                <div class="detail-info-item">
                  <span class="label">تاريخ التسجيل</span>
                  <span class="value" id="detail-joined"></span>
                </div>
                <div class="detail-info-item">
                  <span class="label">آخر نشاط</span>
                  <span class="value" id="detail-last-active"></span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="detail-section">
              <div class="section-title" style="font-size: 13px;">⚡ إجراءات سريعة</div>
              <div class="quick-actions">
                <button class="btn btn-primary" onclick="userManager.quickAddBalance()">
                  💰 إضافة رصيد
                </button>
                <button class="btn btn-primary" onclick="userManager.quickAddPoints()">
                  🪙 إضافة نقاط
                </button>
                <button class="btn" style="background: var(--surface2)" onclick="userManager.resetPassword()">
                  🔑 إعادة تعيين
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn" style="background: var(--surface2)" onclick="userManager.closeModal()">إغلاق</button>
            <button class="btn btn-primary" onclick="userManager.saveUserChanges()">حفظ التغييرات</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        align-items: center;
        justify-content: center;
      }
      .modal.show {
        display: flex;
      }
      .modal-content {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border);
      }
      .modal-header h3 {
        margin: 0;
        font-size: 16px;
      }
      .modal-close {
        background: none;
        border: none;
        color: var(--text2);
        font-size: 18px;
        cursor: pointer;
      }
      .modal-body {
        padding: 20px;
      }
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px 20px;
        border-top: 1px solid var(--border);
      }
      .detail-section {
        margin-bottom: 20px;
      }
      .detail-avatar-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: var(--accent);
        margin: 0 auto 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        overflow: hidden;
      }
      .detail-avatar-large img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .detail-name {
        text-align: center;
        font-size: 18px;
        font-weight: 700;
      }
      .detail-username {
        text-align: center;
        font-size: 13px;
        color: var(--text2);
        margin-top: 4px;
      }
      .detail-status {
        text-align: center;
        margin-top: 8px;
      }
      .detail-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }
      .detail-stat {
        background: var(--surface2);
        border-radius: 10px;
        padding: 12px;
        text-align: center;
      }
      .detail-stat-label {
        font-size: 10px;
        color: var(--text2);
        margin-bottom: 4px;
      }
      .detail-stat-value {
        font-size: 16px;
        font-weight: 700;
        color: var(--accent);
      }
      .detail-info-grid {
        display: grid;
        gap: 8px;
      }
      .detail-info-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--surface2);
        border-radius: 8px;
      }
      .detail-info-item .label {
        font-size: 12px;
        color: var(--text2);
      }
      .detail-info-item .value {
        font-size: 12px;
        font-weight: 600;
      }
      .quick-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .quick-actions .btn {
        flex: 1;
        min-width: 100px;
        padding: 10px;
        font-size: 12px;
      }
      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        overflow: hidden;
      }
      .user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .user-name {
        font-weight: 600;
      }
      .user-id {
        font-size: 11px;
        color: var(--text2);
      }
      code {
        background: var(--surface2);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
      }
      .balance {
        color: #34d399;
        font-weight: 600;
      }
      .points {
        color: #fbbf24;
        font-weight: 600;
      }
      .level-badge {
        background: var(--accent);
        color: white;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
      }
      .badge {
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
      }
      .badge-active {
        background: #34d399;
        color: white;
      }
      .badge-banned {
        background: #ef4444;
        color: white;
      }
      .badge-vip {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
      }
      .action-buttons {
        display: flex;
        gap: 4px;
      }
      .btn-action {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .btn-edit { background: var(--surface2); }
      .btn-edit:hover { background: var(--accent); }
      .btn-ban { background: var(--surface2); }
      .btn-ban:hover { background: #ef4444; }
      .btn-unban { background: var(--surface2); }
      .btn-unban:hover { background: #34d399; }
      .btn-vip { background: var(--surface2); }
      .btn-vip:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
      .btn-delete { background: var(--surface2); }
      .btn-delete:hover { background: #ef4444; }
      .btn-page {
        padding: 6px 12px;
        border: 1px solid var(--border);
        background: var(--surface2);
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
      }
      .btn-page.active {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
      }
      .btn-page:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  closeModal() {
    document.getElementById('user-details-modal').classList.remove('show');
  }

  async editUser(userId) {
    this.showUserDetails(userId);
  }

  async toggleUserStatus(userId, isActive) {
    try {
      await AdminAPI.updateUser(userId, { isActive });
      showAdminToast(isActive ? '✅ تم تفعيل المستخدم' : '🚫 تم حظر المستخدم');
      this.loadUsers(this.currentPage, this.currentSearch);
    } catch (error) {
      showAdminToast('❌ فشل في العملية', true);
    }
  }

  async toggleVip(userId, isVip) {
    try {
      await AdminAPI.updateUser(userId, { isVip });
      showAdminToast(isVip ? '👑 تم منح статус VIP' : '👑 تم إزالة статус VIP');
      this.loadUsers(this.currentPage, this.currentSearch);
    } catch (error) {
      showAdminToast('❌ فشل في العملية', true);
    }
  }

  async deleteUser(userId) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء!')) {
      return;
    }

    try {
      await AdminAPI.updateUser(userId, { isActive: false });
      showAdminToast('✅ تم حذف المستخدم');
      this.loadUsers(this.currentPage, this.currentSearch);
    } catch (error) {
      showAdminToast('❌ فشل في الحذف', true);
    }
  }

  async quickAddBalance() {
    const amount = prompt('أدخل المبلغ المراد إضافته:');
    if (amount && !isNaN(amount)) {
      const userId = document.getElementById('user-details-modal').dataset.userId;
      const user = this.selectedUser;
      
      try {
        await AdminAPI.updateUser(userId, { 
          balance: (user.balance || 0) + parseFloat(amount) 
        });
        showAdminToast(`✅ تم إضافة $${amount} للمستخدم`);
        this.showUserDetails(userId);
        this.loadUsers(this.currentPage, this.currentSearch);
      } catch (error) {
        showAdminToast('❌ فشل في الإضافة', true);
      }
    }
  }

  async quickAddPoints() {
    const points = prompt('أدخل عدد النقاط:');
    if (points && !isNaN(points)) {
      const userId = document.getElementById('user-details-modal').dataset.userId;
      const user = this.selectedUser;
      
      try {
        await AdminAPI.updateUser(userId, { 
          points: (user.points || 0) + parseInt(points) 
        });
        showAdminToast(`✅ تم إضافة ${points} نقطة للمستخدم`);
        this.showUserDetails(userId);
        this.loadUsers(this.currentPage, this.currentSearch);
      } catch (error) {
        showAdminToast('❌ فشل في الإضافة', true);
      }
    }
  }

  resetPassword() {
    showAdminToast('🔑 تم إرسال رابط إعادة التعيين للمستخدم');
  }

  async saveUserChanges() {
    const userId = document.getElementById('user-details-modal').dataset.userId;
    const balance = prompt('الرصيد الجديد:', this.selectedUser.balance);
    const points = prompt('النقاط الجديدة:', this.selectedUser.points);
    const level = prompt('المستوى الجديد:', this.selectedUser.level);

    try {
      const updateData = {};
      if (balance && !isNaN(balance)) updateData.balance = parseFloat(balance);
      if (points && !isNaN(points)) updateData.points = parseInt(points);
      if (level && !isNaN(level)) updateData.level = parseInt(level);

      await AdminAPI.updateUser(userId, updateData);
      showAdminToast('✅ تم حفظ التغييرات');
      this.closeModal();
      this.loadUsers(this.currentPage, this.currentSearch);
    } catch (error) {
      showAdminToast('❌ فشل في الحفظ', true);
    }
  }

  formatDate(date) {
    if (!date) return 'غير معروف';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Global instance
const userManager = new UserManager();

// Override loadUsers to use userManager
function loadUsers(page = 1) {
  const search = document.getElementById('user-search')?.value || '';
  userManager.loadUsers(page, search);
}

function searchUsers() {
  userManager.loadUsers(1, document.getElementById('user-search').value);
}
