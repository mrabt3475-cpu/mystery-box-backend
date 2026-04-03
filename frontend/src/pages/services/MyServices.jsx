import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MyServices.css';

const MyServices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setServices(services.filter(s => s._id !== id));
        setShowDeleteModal(null);
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

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

  const filteredServices = services.filter(service => {
    if (filter === 'all') return true;
    if (filter === 'owned') return service.owner._id === user._id;
    if (filter === 'member') return service.owner._id !== user._id;
    return service.serviceType === filter;
  });

  const ownedCount = services.filter(s => s.owner._id === user?._id).length;
  const memberCount = services.filter(s => s.owner._id !== user?._id).length;

  return (
    <div className="my-services-page">
      <div className="my-services-header">
        <h1>🏠 خدماتي</h1>
        <button 
          className="create-new-btn"
          onClick={() => navigate('/services/create')}
        >
          + خدمة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="my-services-stats">
        <div className="stat-card">
          <span className="stat-number">{ownedCount}</span>
          <span className="stat-label">خدماتك</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{memberCount}</span>
          <span className="stat-label">عضو فيها</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{services.length}</span>
          <span className="stat-label">الإجمالي</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          الكل ({services.length})
        </button>
        <button
          className={`filter-tab ${filter === 'owned' ? 'active' : ''}`}
          onClick={() => setFilter('owned')}
        >
          👑 خدماتك ({ownedCount})
        </button>
        <button
          className={`filter-tab ${filter === 'member' ? 'active' : ''}`}
          onClick={() => setFilter('member')}
        >
          👤 عضو ({memberCount})
        </button>
        <button
          className={`filter-tab ${filter === 'group' ? 'active' : ''}`}
          onClick={() => setFilter('group')}
        >
          👥 مجموعات
        </button>
        <button
          className={`filter-tab ${filter === 'channel' ? 'active' : ''}`}
          onClick={() => setFilter('channel')}
        >
          📢 قنوات
        </button>
        <button
          className={`filter-tab ${filter === 'bot' ? 'active' : ''}`}
          onClick={() => setFilter('bot')}
        >
          🤖 بوتات
        </button>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>لا توجد خدمات</h3>
          <p>لم تقم بإنشاء أو الانضمام لأي خدمة بعد</p>
          <button onClick={() => navigate('/services/create')}>
            إنشاء خدمة جديدة
          </button>
        </div>
      ) : (
        <div className="services-list">
          {filteredServices.map((service) => {
            const isOwner = service.owner._id === user._id;
            
            return (
              <div 
                key={service._id} 
                className="my-service-card"
              >
                <div 
                  className="service-type-indicator"
                  style={{ background: getServiceColor(service.serviceType) }}
                >
                  {getServiceIcon(service.serviceType)}
                </div>
                
                <div className="service-info">
                  <div className="service-header">
                    <h3>{service.name}</h3>
                    {isOwner && (
                      <span className="owner-badge">👑 مالك</span>
                    )}
                  </div>
                  
                  <p className="service-description">
                    {service.description || 'لا يوجد وصف'}
                  </p>
                  
                  <div className="service-meta">
                    <span className="meta-item">
                      👥 {service.members?.length || 0} أعضاء
                    </span>
                    <span className="meta-item">
                      👁️ {service.stats?.views || 0} مشاهدات
                    </span>
                    <span className="meta-item">
                      {service.status === 'active' ? '✅ نشط' : '❌ غير نشط'}
                    </span>
                  </div>
                  
                  <div className="service-expiry">
                    <span>ينتهي في:</span>
                    <span className="expiry-date">
                      {service.expiresAt 
                        ? new Date(service.expiresAt).toLocaleDateString('ar') 
                        : 'دائم'}
                    </span>
                  </div>
                </div>
                
                <div className="service-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => navigate(`/services/${service._id}`)}
                  >
                    عرض
                  </button>
                  
                  {isOwner && (
                    <>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/services/${service._id}/edit`)}
                      >
                        تعديل
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => setShowDeleteModal(service._id)}
                      >
                        حذف
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>⚠️ حذف الخدمة</h3>
            <p>هل أنت متأكد من حذف هذه الخدمة؟</p>
            <p className="warning-text">لا يمكن التراجع عن هذا الإجراء</p>
            
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(null)}>إلغاء</button>
              <button 
                className="confirm-delete"
                onClick={() => handleDelete(showDeleteModal)}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyServices;
