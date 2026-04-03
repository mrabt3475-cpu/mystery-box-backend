import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast/ToastProvider';
import Modal from '../../components/ui/Modal/Modal';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

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
        setPosts(data.data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('فشل تحميل الخدمة');
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
        toast.success('تم الانضمام بنجاح!');
        fetchService();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('حدث خطأ');
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
        toast.success('تم المغادرة بنجاح');
        fetchService();
      }
    } catch (error) {
      toast.error('حدث خطأ');
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
        await refreshUser();
        toast.success('تم تمديد الخدمة بنجاح');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost })
      });
      const data = await response.json();
      
      if (data.success) {
        setNewPost('');
        fetchService();
        toast.success('تم نشر المنشور');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setPosting(false);
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

  const getExtendCost = () => {
    const costPerDay = {
      group: 3,
      channel: 5,
      bot: 7
    };
    return extendDays * (costPerDay[service?.serviceType] || 5);
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
          <span className="stat-value">{posts.length}</span>
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
                <form className="create-post-box" onSubmit={handleCreatePost}>
                  <textarea 
                    placeholder="اكتب منشورك..." 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  ></textarea>
                  <div className="post-actions">
                    <button type="button" className="btn-emoji">😊</button>
                    <button type="button" className="btn-image">🖼️</button>
                    <button type="submit" className="btn-send" disabled={posting || !newPost.trim()}>
                      {posting ? 'جاري...' : 'إرسال'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="join-to-post">
                  <span>🔒</span>
                  <p>انضم للمشاركة في المنشورات</p>
                </div>
              )}

              <div className="posts-list">
                {posts.length === 0 ? (
                  <div className="empty-posts">
                    <span>📭</span>
                    <p>لا توجد منشورات بعد</p>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div key={index} className="post-card">
                      <div className="post-header">
                        <div className="post-avatar">
                          {post.author?.avatar ? (
                            <img src={post.author.avatar} alt="" />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <div className="post-author">
                          <span className="author-name">{post.author?.name || 'مستخدم'}</span>
                          <span className="post-time">
                            {new Date(post.createdAt).toLocaleDateString('ar')}
                          </span>
                        </div>
                      </div>
                      <div className="post-content">
                        {post.content}
                      </div>
                    </div>
                  ))
                )}
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
      <Modal
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        title="تمديد الخدمة"
        size="small"
      >
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
          <span className="cost">{getExtendCost()} نقطة</span>
        </div>
        
        <div className="modal-actions">
          <button onClick={() => setShowExtendModal(false)}>إلغاء</button>
          <button className="confirm" onClick={handleExtend}>تمديد</button>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceDetail;
