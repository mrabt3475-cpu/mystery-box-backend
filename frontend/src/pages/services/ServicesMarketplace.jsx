import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast/ToastProvider';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import Pagination from '../../components/ui/Pagination/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton/Skeleton';
import './Services.css';

const ServicesMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const fetchServices = useCallback(async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', pagination.limit);
      if (filter !== 'all') params.append('type', filter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/services?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data.services);
        setPagination(prev => ({
          ...prev,
          page: data.data.page,
          total: data.data.total,
          totalPages: data.data.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('فشل تحميل الخدمات');
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.limit, toast]);

  useEffect(() => {
    fetchServices(1, search);
  }, [filter]);

  const handleSearch = useCallback((searchTerm) => {
    setSearch(searchTerm);
    fetchServices(1, searchTerm);
  }, [fetchServices]);

  const handlePageChange = useCallback((page) => {
    fetchServices(page, search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchServices, search]);

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
        <div className="search-wrapper">
          <SearchInput
            onSearch={handleSearch}
            placeholder="ابحث عن خدمة..."
            debounce={600}
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
        <div className="services-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
        <>
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

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            infoText="صفحة"
          />
        </>
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
