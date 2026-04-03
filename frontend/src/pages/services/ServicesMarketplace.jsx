import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Services.css';

const ServicesMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServices();
  }, [filter, search]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/services?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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

  return (
    <div className="services-marketplace">
      {/* Header */}
      <div className="services-header">
        <div className="header-content">
          <h1>🛒 marketplace الخدمات</h1>
          <p>استكشف وشارك في المجموعات والقنوات والبوتات</p>
        </div>
        
        <div className="user-points">
          <span className="points-label">💰 رصيدك:</span>
          <span className="points-value">{user?.pointsBalance || 0} نقطة</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="services-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="ابحث عن خدمة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            الكل
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
      </div>

      {/* Create Button */}
      <div className="create-service-section">
        <button 
          className="create-service-btn"
          onClick={() => navigate('/services/create')}
        >
          <span className="plus-icon">+</span>
          إنشاء خدمة جديدة
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>لا توجد خدمات</h3>
          <p>كن أول من يُنشئ خدمة!</p>
          <button onClick={() => navigate('/services/create')}>
            إنشاء خدمة
          </button>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service._id} 
              className="service-card"
              onClick={() => navigate(`/services/${service._id}`)}
            >
              <div 
                className="service-icon"
                style={{ background: getServiceColor(service.serviceType) }}
              >
                {getServiceIcon(service.serviceType)}
              </div>
              
              <div className="service-info">
                <h3>{service.name}</h3>
                <p className="service-description">
                  {service.description || 'لا يوجد وصف'}
                </p>
                
                <div className="service-meta">
                  <span className="service-type">
                    {service.serviceType === 'group' && 'مجموعة'}
                    {service.serviceType === 'channel' && 'قناة'}
                    {service.serviceType === 'bot' && 'بوت'}
                  </span>
                  <span className="service-members">
                    👥 {service.members?.length || 0}
                  </span>
                  <span className="service-views">
                    👁️ {service.stats?.views || 0}
                  </span>
                </div>
              </div>
              
              <div className="service-actions">
                <button className="join-btn">
                  {service.members?.some(m => m.user === user?._id) 
                    ? 'دخلت' 
                    : 'انضم'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Services Sidebar */}
      <div className="my-services-sidebar">
        <h3>🏠 خدماتي</h3>
        <Link to="/services/my" className="my-services-link">
          عرض جميع خدماتي
        </Link>
      </div>
    </div>
  );
};

export default ServicesMarketplace;
