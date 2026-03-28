import { useState } from 'react'
import api from '../services/api'
import { RippleButton, TiltCard } from '../components/InteractiveComponents'
import '../styles/productDetail.css'

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  // Mock data
  const productData = {
    _id: '1',
    name: 'آيفون 15 برو ماكس',
    description: 'أحدث إصدار من آبل بشاشة Super Retina XDR مقاس 6.7 بوصة، مع شريحة A17 Pro، وكاميرا رئيسية 48 ميجابيكسل.',
    price: 5000,
    originalPrice: 6000,
    category: 'phones',
    rating: 4.8,
    reviews: 120,
    stock: 5,
    images: ['📱', '📱', '📱'],
    features: [
      'شاشة Super Retina XDR 6.7 بوصة',
      'شريحة A17 Pro',
      'كاميرا 48 ميجابيكسل',
      'بطارية تدوم اليوم الكامل',
      'دعم 5G'
    ],
    specs: {
      'المعالج': 'A17 Pro',
      'التخزين': '256GB / 512GB / 1TB',
      'الرام': '8GB',
      'الكاميرا': '48MP + 12MP + 12MP',
      'البطارية': '5000mAh',
      'الشاشة': '6.7 بوصة'
    }
  }

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta
    if (newQty >= 1 && newQty <= productData.stock) {
      setQuantity(newQty)
    }
  }

  const discount = Math.round((1 - productData.price / productData.originalPrice) * 100)

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>الرئيسية</span>
          <span>/</span>
          <span>هواتف</span>
          <span>/</span>
          <span>{productData.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images Section */}
          <div className="product-images-section">
            <div className="main-image">
              <div className="image-zoom">
                <span className="main-emoji">{productData.images[selectedImage]}</span>
              </div>
              {discount > 0 && (
                <div className="discount-badge">-{discount}%</div>
              )}
            </div>
            <div className="thumbnails">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="product-info-section">
            <div className="product-header">
              <span className="product-category-badge">{productData.category}</span>
              <h1 className="product-title">{productData.name}</h1>
              
              <div className="product-rating-detail">
                <div className="stars">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={star <= Math.floor(productData.rating) ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
                <span className="rating-text">{productData.rating}</span>
                <span className="reviews-text">({productData.reviews} تقييم)</span>
              </div>
            </div>

            <div className="product-price-section">
              <div className="price-display">
                <span className="current-price">{productData.price.toLocaleString()}</span>
                <span className="currency">🪙</span>
              </div>
              <div className="price-original">
                <span>{productData.originalPrice.toLocaleString()}</span>
                <span className="save-badge">وفر {discount}%</span>
              </div>
            </div>

            <div className="stock-info">
              <span className={`stock-status ${productData.stock <= 5 ? 'low' : ''}`}>
                {productData.stock <= 5 ? `⚠️只剩下 ${productData.stock} 件` : '✅ متوفر'}
              </span>
            </div>

            {/* Quantity */}
            <div className="quantity-selector">
              <span className="quantity-label">الكمية:</span>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>−</button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= productData.stock}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions-detail">
              <RippleButton variant="primary" className="buy-now-btn">
                🛒 شراء الآن
              </RippleButton>
              <RippleButton variant="secondary" className="add-cart-btn">
                إضافة للسلة
              </RippleButton>
            </div>

            {/* Features */}
            <div className="features-list">
              {productData.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              الوصف
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              المواصفات
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              التقييمات
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-tab">
                <p>{productData.description}</p>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="specs-tab">
                <div className="specs-grid">
                  {Object.entries(productData.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <div className="reviews-summary">
                  <div className="rating-big">
                    <span className="rating-number">{productData.rating}</span>
                    <div className="stars">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className={star <= Math.floor(productData.rating) ? 'star filled' : 'star'}>★</span>
                      ))}
                    </div>
                    <span className="reviews-count">{productData.reviews} تقييم</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
