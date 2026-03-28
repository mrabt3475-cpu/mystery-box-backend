import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  TiltCard, 
  RippleButton, 
  AnimatedCounter,
  LoadingSpinner 
} from '../components/InteractiveComponents'
import { BoxOpeningAnimation, OddsDisplay } from '../components/BoxAnimations'
import '../styles/productDesign.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data
  useEffect(() => {
    setProducts([
      { _id: '1', name: 'آيفون 15 برو ماكس', description: 'أحدث إصدار من آبل', price: 5000, originalPrice: 6000, category: 'phones', rating: 4.8, reviews: 120, stock: 5, images: ['📱'], badge: 'hot', rarity: 'legendary' },
      { _id: '2', name: 'سامسونج Galaxy S24', description: ' flagship من سامسونج', price: 3500, originalPrice: 4200, category: 'phones', rating: 4.6, reviews: 85, stock: 12, images: ['📱'], badge: 'sale', rarity: 'epic' },
      { _id: '3', name: 'ماك بوك برو M3', description: 'لابتوب محترف', price: 8000, originalPrice: 9000, category: 'laptops', rating: 4.9, reviews: 200, images: ['💻'], badge: 'new', rarity: 'legendary' },
      { _id: '4', name: 'آيباد برو 12.9', description: 'أجهزة لوحية', price: 4500, originalPrice: 5000, category: 'tablets', rating: 4.7, reviews: 90, stock: 8, images: ['📱'], rarity: 'epic' },
      { _id: '5', name: 'ساعة أبل واتش', description: 'أحدث إصدار', price: 2500, originalPrice: 2800, category: 'watches', rating: 4.5, reviews: 150, stock: 20, images: ['⌚'], rarity: 'rare' },
      { _id: '6', name: 'airedbuds برو', description: 'سماعات عالية الجودة', price: 800, originalPrice: 1000, category: 'audio', rating: 4.4, reviews: 300, stock: 50, images: ['🎧'], badge: 'sale', rarity: 'uncommon' },
      { _id: '7', name: 'كاميرا سوني A7IV', description: 'كاميرا احترافية', price: 12000, originalPrice: 14000, category: 'cameras', rating: 5.0, reviews: 45, stock: 3, images: ['📷'], badge: 'limited', rarity: 'legendary' },
      { _id: '8', name: 'بلايستيشن 5', description: 'جهاز ألعاب', price: 3000, originalPrice: 3500, category: 'gaming', rating: 4.8, reviews: 500, stock: 2, images: ['🎮'], badge: 'hot', rarity: 'epic' },
    ])
    setLoading(false)
  }, [])

  const categories = [
    { id: 'all', label: 'الكل', icon: '🏷️' },
    { id: 'phones', label: 'هواتف', icon: '📱' },
    { id: 'laptops', label: 'لابتوبات', icon: '💻' },
    { id: 'tablets', label: 'أجهزة لوحية', icon: '📲' },
    { id: 'watches', label: 'ساعات', icon: '⌚' },
    { id: 'audio', label: 'صوتيات', icon: '🎧' },
    { id: 'cameras', label: 'كاميرات', icon: '📷' },
    { id: 'gaming', label: 'ألعاب', icon: '🎮' },
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Sort
    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        // Keep original order
        break
    }

    return result
  }, [products, search, selectedCategory, sort])

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#9ca3af',
      uncommon: '#22c55e',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    }
    return colors[rarity] || colors.common
  }

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size={60} />
        <p>جاري تحميل المنتجات...</p>
      </div>
    )
  }

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-gradient">🛍️ المتجر</span>
          </h1>
          <p className="hero-subtitle">
            اكتشف أحدث المنتجات بأسعار مميزة
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button 
                className="clear-search"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <div className="categories-scroll">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="filters-bar">
        <div className="results-count">
          <AnimatedCounter value={filteredProducts.length} /> 
          <span>منتج</span>
        </div>
        
        <div className="filter-actions">
          {/* Sort */}
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="newest">الأحدث</option>
            <option value="price-low">السعر: من الأقل</option>
            <option value="price-high">السعر: من الأعلى</option>
            <option value="rating">التقييم</option>
          </select>

          {/* View Mode */}
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>لا توجد منتجات</h3>
          <p>جرب البحث بكلمات أخرى</p>
        </div>
      ) : (
        <div className={`products-grid ${viewMode}`}>
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              index={index}
              getRarityColor={getRarityColor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Product Card Component
function ProductCard({ product, index, getRarityColor }) {
  const [isHovered, setIsHovered] = useState(false)
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <TiltCard>
      <div 
        className="product-card-v2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {/* Image Section */}
        <div className="product-image-v2">
          <div 
            className="product-emoji"
            style={{ 
              textShadow: `0 0 30px ${getRarityColor(product.rarity)}`,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {product.images?.[0] || '📦'}
          </div>
          
          {/* Badges */}
          <div className="product-badges">
            {product.badge === 'hot' && (
              <span className="badge-v2 hot">🔥热销</span>
            )}
            {product.badge === 'new' && (
              <span className="badge-v2 new">✨ جديد</span>
            )}
            {product.badge === 'sale' && (
              <span className="badge-v2 sale">-{discount}%</span>
            )}
            {product.badge === 'limited' && (
              <span className="badge-v2 limited">⭐ محدود</span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className={`stock-indicator ${product.stock <= 5 ? 'low' : ''}`}>
            {product.stock <= 5 ? `只剩 ${product.stock} 件` : 'متوفر'}
          </div>

          {/* Quick Actions */}
          <div className={`quick-actions-v2 ${isHovered ? 'visible' : ''}`}>
            <button className="quick-action" title="إضافة للسلة">
              🛒
            </button>
            <button className="quick-action" title="مفضلة">
              ❤️
            </button>
            <button className="quick-action" title="مشاركة">
              📤
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="product-info-v2">
          <div className="product-category">
            {product.category}
          </div>
          
          <h3 className="product-name-v2">{product.name}</h3>
          
          <p className="product-desc">{product.description}</p>

          {/* Rating */}
          <div className="product-rating">
            <div className="stars">
              {[1,2,3,4,5].map(star => (
                <span key={star} className={star <= product.rating ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviews} تقييم)</span>
          </div>

          {/* Price */}
          <div className="product-price-v2">
            <span className="current-price">
              <AnimatedCounter value={product.price} />
              <span className="currency">🪙</span>
            </span>
            {product.originalPrice && (
              <span className="original-price">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rarity */}
          <div className="product-rarity">
            <span 
              className="rarity-badge"
              style={{ 
                borderColor: getRarityColor(product.rarity),
                color: getRarityColor(product.rarity)
              }}
            >
              {product.rarity === 'legendary' ? '👑 أسطوري' :
               product.rarity === 'epic' ? '💎 إيبك' :
               product.rarity === 'rare' ? '⭐ رير' :
               product.rarity === 'uncommon' ? '🟢 غير عادي' : '⚪ عادي'}
            </span>
          </div>

          {/* Actions */}
          <div className="product-actions-v2">
            <RippleButton variant="primary" className="buy-btn">
              🛒 شراء الآن
            </RippleButton>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
