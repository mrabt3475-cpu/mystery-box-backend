import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Store.css';

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const currentCategory = searchParams.get('category') || 'all';
  const currentType = searchParams.get('type') || 'all';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, currentType, search, sort, searchParams.get('page')]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentCategory !== 'all') params.append('category', currentCategory);
      if (currentType !== 'all') params.append('productType', currentType);
      if (search) params.append('search', search);
      params.append('sort', sort);
      params.append('page', searchParams.get('page') || 1);
      params.append('limit', 12);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const typeFilters = [
    { value: 'all', label: 'الكل', icon: '📦' },
    { value: 'bot', label: '🤖 بوتات', icon: '🤖' },
    { value: 'group', label: '👥 مجموعات', icon: '👥' },
    { value: 'channel', label: '📢 قنوات', icon: '📢' },
    { value: 'digital', label: '💾 رقمية', icon: '💾' },
    { value: 'subscription', label: '🔄 اشتراكات', icon: '🔄' }
  ];

  return (
    <div className="store-page">
      <div className="store-header">
        <div className="container">
          <h1>🛒 المتجر</h1>
          <p>تصفح منتجاتنا المميزة</p>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <button>🔍</button>
          </div>
        </div>
      </div>

      <div className="store-content">
        <div className="container">
          {/* فلاتر النوع */}
          <div className="type-filters">
            {typeFilters.map(type => (
              <button
                key={type.value}
                className={currentType === type.value ? 'active' : ''}
                onClick={() => handleFilterChange('type', type.value)}
              >
                <span className="icon">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          <div className="store-layout">
            {/* الفئات الجانبية */}
            <aside className="sidebar">
              <h3>🏷️ الفئات</h3>
              <ul className="category-list">
                <li>
                  <button
                    className={currentCategory === 'all' ? 'active' : ''}
                    onClick={() => handleFilterChange('category', 'all')}
                  >
                    📦 جميع المنتجات
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <button
                      className={currentCategory === cat._id ? 'active' : ''}
                      onClick={() => handleFilterChange('category', cat._id)}
                    >
                      {cat.icon} {cat.name}
                      <span className="count">{cat.productCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* المنتجات */}
            <main className="products-section">
              <div className="products-header">
                <span className="results-count">
                  {pagination.total} منتج
                </span>
                <select
                  value={sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="-createdAt">الأحدث</option>
                  <option value="price">السعر: من الأقل للأعلى</option>
                  <option value="-price">السعر: من الأعلى للأقل</option>
                  <option value="-rating">الأعلى تقييماً</option>
                  <option value="-stats.sales">الأكثر مبيعاً</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-grid">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="skeleton-card" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="products-grid">
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* الترقيم */}
                  {pagination.pages > 1 && (
                    <div className="pagination">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          className={pagination.page === i + 1 ? 'active' : ''}
                          onClick={() => handleFilterChange('page', i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-products">
                  <span>📦</span>
                  <p>لا توجد منتجات</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
