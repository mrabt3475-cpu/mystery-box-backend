import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      
      if (data.success) {
        setService(data.data);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setJoining(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        fetchService();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('هل أنت متأكد من المغادرة؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        fetchService();
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const handleExtend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ days: extendDays })
      });
      const data = await response.json();
      
      if (data.success) {
        setShowExtendModal(false);
        fetchService();
        alert('تم تمديد الخدمة بنجاح');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const isMember = service?.members?.some(m => m.user === user?._id);
  const isOwner = service?.owner?._id === user?._id;

  const getServiceIcon = (type) => {
    switch (type) {
      case 'group': return '👥';
      case 'channel': return '📢';
      case 'bot': return '🤖';
      default: return '📦';
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case 'group': return '#8b5cf6';
      case 'channel': return '#06b6d4';
      case 'bot': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-not-found">
        <span>❌</span>
        <h2>الخدمة غير موجودة</h2>
        <button onClick={() => navigate('/services')}>العودة للسوق</button>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      {/* Header Banner */}
      <div 
        className="service-banner"
        style={{ background: `linear-gradient(135deg, ${getServiceColor(service.serviceType)}dd, ${getServiceColor(service.serviceType)}88)` }}
      >
        <div className="banner-content">
          <div className="service-icon-large">
            {getServiceIcon(service.serviceType)}
          </div>
          
          <div className="service-title-section">
            <h1>{service.name}</h1>
            <p className="service-description">{service.description}</p>
            
            <div className="service-badges">
              <span className="badge type-badge">
                {service.serviceType === 'group' && '👥 مجموعة'}
                {service.serviceType === 'channel' && '📢 قناة'}
                {service.serviceType === 'bot' && '🤖 بوت'}
              </span>
              <span className="badge status-badge">
                {service.status === 'active' ? '✅ نشط' : '❌ غير نشط'}
              </span>
            </div>
          </div>

          <div className="service-actions-header">
            {!isMember ? (
              <button 
                className="join-btn-large"
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? 'جاري...' : 'انضم الآن'}
              </button>
            ) : (
              <button 
                className="leave-btn"
                onClick={handleLeave}
              >
                مغادرة
              </button>
            )}
            
            {isOwner && (
              <button 
                className="extend-btn"
                onClick={() => setShowExtendModal(true)}
              >
                تمديد
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="service-stats-bar">
        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{service.members?.length || 0}</span>
          <span className="stat-label">أعضاء</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👁️</span>
          <span className="stat-value">{service.stats?.views || 0}</span>
          <span className="stat-label">مشاهدات</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <span className="stat-value">{service.stats?.posts || 0}</span>
          <span className="stat-label">منشورات</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏰</span>
          <span className="stat-value">
            {service.expiresAt ? new Date(service.expiresAt).toLocaleDateString('ar') : 'دائم'}
          </span>
          <span className="stat-label">ينتهي</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="service-main-content">
        {/* Tabs */}
        <div className="service-tabs">
          <button 
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📝 المنشورات
          </button>
          <button 
            className={`tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 الأعضاء
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ الإعدادات
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'posts' && (
            <div className="posts-section">
              {isMember ? (
                <div className="create-post-box">
                  <textarea placeholder="اكتب منشورك..."></textarea>
                  <div className="post-actions">
                    <button className="btn-emoji">😊</button>
                    <button className="btn-image">🖼️</button>
                    <button className="btn-send">إرسال</button>
                  </div>
                </div>
              ) : (
                <div className="join-to-post">
                  <span>🔒</span>
                  <p>انضم للمشاركة في المنشورات</p>
                </div>
              )}

              <div className="posts-list">
                <div className="empty-posts">
                  <span>📭</span>
                  <p>لا توجد منشورات بعد</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-section">
              <h3>الأعضاء ({service.members?.length || 0})</h3>
              <div className="members-list">
                {service.members?.map((member, index) => (
                  <div key={index} className="member-card">
                    <div className="member-avatar">
                      {member.user?.avatar ? (
                        <img src={member.user.avatar} alt="" />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="member-info">
                      <span className="member-name">
                        {member.user?.name || 'مستخدم'}
                      </span>
                      <span className="member-role">
                        {member.role === 'owner' && '👑 المالك'}
                        {member.role === 'admin' && '⚡ مدير'}
                        {member.role === 'moderator' && '🛡️ مشرف'}
                        {member.role === 'member' && '👤 عضو'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              {isOwner ? (
                <div className="owner-settings">
                  <h3>إعدادات الخدمة</h3>
                  
                  <div className="setting-item">
                    <label>الاسم</label>
                    <input type="text" defaultValue={service.name} />
                  </div>
                  
                  <div className="setting-item">
                    <label>الوصف</label>
                    <textarea defaultValue={service.description}></textarea>
                  </div>
                  
                  <div className="setting-item">
                    <label>لون التمييز</label>
                    <input 
                      type="color" 
                      defaultValue={service.settings?.color || '#6366f1'} 
                    />
                  </div>
                  
                  <button className="save-settings-btn">
                    حفظ التغييرات
                  </button>
                </div>
              ) : (
                <div className="member-settings">
                  <h3>إعداداتك</h3>
                  <div className="setting-item">
                    <label>الإشعارات</label>
                    <select defaultValue="all">
                      <option value="all">كل الإشعارات</option>
                      <option value="mentions">عند الإشارة</option>
                      <option value="none">لا شيء</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Owner Card */}
      <div className="service-owner-card">
        <h4>المالك</h4>
        <div className="owner-info">
          <div className="owner-avatar">
            {service.owner?.avatar ? (
              <img src={service.owner.avatar} alt="" />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div className="owner-details">
            <span className="owner-name">{service.owner?.name}</span>
            <span className="owner-username">@{service.owner?.username}</span>
          </div>
        </div>
      </div>

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="modal-overlay" onClick={() => setShowExtendModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>تمديد الخدمة</h3>
            <p>اختر مدة التمديد:</p>
            
            <div className="extend-options">
              {[7, 15, 30, 60, 90].map(days => (
                <button
                  key={days}
                  className={`extend-option ${extendDays === days ? 'selected' : ''}`}
                  onClick={() => setExtendDays(days)}
                >
                  {days} يوم
                </button>
              ))}
            </div>
            
            <div className="extend-cost">
              <span>التكلفة:</span>
              <span className="cost">
                {days => days * (service.serviceType === 'group' ? 3 : service.serviceType === 'channel' ? 5 : 7)} {extendDays} نقطة
              </span>
            </div>
            
            <div className="modal-actions">
              <button onClick={() => setShowExtendModal(false)}>إلغاء</button>
              <button className="confirm" onClick={handleExtend}>تمديد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
