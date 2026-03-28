import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { AnimatedCounter, RippleButton } from '../components/InteractiveComponents'
import '../styles/animeStore.css'

export default function AnimeStore() {
  const [campaign, setCampaign] = useState(null)
  const [products, setProducts] = useState([])
  const [animeList, setAnimeList] = useState([])
  const [selectedAnime, setSelectedAnime] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [campaignRes, productsRes, animeRes] = await Promise.all([
        api.get('/anime/campaign/active'),
        api.get('/anime/products'),
        api.get('/anime/anime-list')
      ])
      
      setCampaign(campaignRes.data.data)
      setProducts(productsRes.data.products || [])
      setAnimeList(animeRes.data.data || [])
    } catch (err) {
      // Mock data
      setCampaign({
        _id: '1',
        name: '🎌 Anime Festival Sale',
        description: 'خصم 60% على جميع منتجات الأنمي!',
        discount: { percentage: 60 },
        points: { percentage: 10 },
        referral: { bonusPoints: 50, bonusPercentage: 5 },
        theme: {
          primaryColor: '#ff6b9d',
          secondaryColor: '#4ecdc4',
          videoBackground: 'AzfFl5KRwiMX'
        },
        characters: [
          { name: 'Naruto', anime: 'Naruto', position: 'left' },
          { name: 'Luffy', anime: 'One Piece', position: 'center' },
          { name: 'Goku', anime: 'Dragon Ball', position: 'right' }
        ]
      })
      
      setProducts([
        { _id: '1', name: 'قبعة القش Luffy', anime: 'One Piece', category: 'accessories', price: 15, originalPrice: 40, images: ['🎩'], stock: 50 },
        { _id: '2', name: 'زي ناروتو', anime: 'Naruto', category: 'clothing', price: 25, originalPrice: 65, images: ['👘'], stock: 30 },
        { _id: '3', name: 'دمية غوكو', anime: 'Dragon Ball', category: 'figures', price: 35, originalPrice: 90, images: ['🧸'], stock: 15 },
        { _id: '4', name: 'سوار الشاكرين', anime: 'Naruto', category: 'accessories', price: 12, originalPrice: 30, images: ['💫'], stock: 100 },
      ])
      
      setAnimeList([
        { name: 'One Piece', productCount: 15 },
        { name: 'Naruto', productCount: 12 },
        { name: 'Dragon Ball', productCount: 8 },
        { name: 'Attack on Titan', productCount: 5 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = selectedAnime === 'all' 
    ? products 
    : products.filter(p => p.anime === selectedAnime)

  if (loading) {
    return <div className="loading">جاري التحميل...</div>
  }

  return (
    <div className="anime-store-page">
      {/* Video Background */}
      <div className="anime-video-bg">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="bg-video"
        >
          <source src={campaign?.theme?.videoBackground} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Hero Section */}
      <div className="anime-hero">
        <div className="hero-content">
          <h1 className="anime-title">
            <span className="title-text">{campaign?.name || '🎌 متجر الأنمي'}</span>
          </h1>
          <p className="anime-subtitle">{campaign?.description}</p>
          
          {/* Discount Badge */}
          <div className="discount-badge-large">
            <span className="discount-number">{campaign?.discount?.percentage || 60}%</span>
            <span className="discount-text">تخفيض</span>
          </div>

          {/* Countdown */}
          <CountdownTimer endDate={campaign?.endDate} />

          {/* Points Info */}
          <div className="points-info">
            <span>🎁 احصل على {campaign?.points?.percentage || 10}% من قيمة مشترياتك كنقاط</span>
          </div>
        </div>

        {/* Characters */}
        <div className="hero-characters">
          {campaign?.characters?.map((char, idx) => (
            <div key={idx} className={`character character-${char.position}`}>
              <div className="character-image">{getCharacterEmoji(char.name)}</div>
              <span className="character-name">{char.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anime Filter */}
      <div className="anime-filter-section">
        <button 
          className={`filter-chip ${selectedAnime === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedAnime('all')}
        >
          🎌 الكل
        </button>
        {animeList.map((anime) => (
          <button
            key={anime.name}
            className={`filter-chip ${selectedAnime === anime.name ? 'active' : ''}`}
            onClick={() => setSelectedAnime(anime.name)}
          >
            {getAnimeEmoji(anime.name)} {anime.name}
            <span className="chip-count">{anime.productCount}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="anime-products-grid">
        {filteredProducts.map((product, index) => (
          <AnimeProductCard 
            key={product._id} 
            product={product} 
            discount={campaign?.discount?.percentage || 60}
            index={index}
          />
        ))}
      </div>

      {/* Referral Banner */}
      <div className="referral-banner">
        <div className="referral-content">
          <h3>🎯 ربح نقاط إضافية!</h3>
          <p>شارك رابطك الخاص واحصل على {campaign?.referral?.bonusPoints || 50} نقطة لكل إحالة</p>
          <RippleButton variant="primary">
            نسخ رابط الإحالة
          </RippleButton>
        </div>
      </div>
    </div>
  )
}

// Countdown Timer Component
function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const diff = end - now
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="countdown-timer">
      <div className="time-block">
        <span className="time-value">{timeLeft.days}</span>
        <span className="time-label">أيام</span>
      </div>
      <span className="time-separator">:</span>
      <div className="time-block">
        <span className="time-value">{timeLeft.hours}</span>
        <span className="time-label">ساعات</span>
      </div>
      <span className="time-separator">:</span>
      <div className="time-block">
        <span className="time-value">{timeLeft.minutes}</span>
        <span className="time-label">دقائق</span>
      </div>
      <span className="time-separator">:</span>
      <div className="time-block">
        <span className="time-value">{timeLeft.seconds}</span>
        <span className="time-label">ثواني</span>
      </div>
    </div>
  )
}

// Anime Product Card
function AnimeProductCard({ product, discount, index }) {
  const discountedPrice = Math.round(product.price * (1 - discount / 100))
  const savings = product.originalPrice - discountedPrice

  return (
    <div className="anime-product-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="product-badge-3d">
        <span>-{discount}%</span>
      </div>
      
      <div className="product-3d-image">
        <span className="product-emoji">{product.images?.[0] || '🎁'}</span>
        <div className="product-glow"></div>
      </div>
      
      <div className="product-info">
        <span className="product-anime">{product.anime}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-pricing">
          <span className="original-price">{product.originalPrice}$</span>
          <span className="discounted-price">{discountedPrice}$</span>
        </div>
        
        <div className="product-savings">
          توفر {savings}$
        </div>
        
        <RippleButton variant="primary" className="buy-btn-3d">
          🛒 شراء الآن
        </RippleButton>
      </div>
    </div>
  )
}

// Helper functions
function getCharacterEmoji(name) {
  const emojis = {
    'Naruto': '🧧',
    'Luffy': '🎩',
    'Goku': '💪',
    'Ichigo': '🗡️',
    'Saitama': '👊'
  }
  return emojis[name] || '🎌'
}

function getAnimeEmoji(name) {
  const emojis = {
    'One Piece': '🏴‍☠️',
    'Naruto': '🧧',
    'Dragon Ball': '🐉',
    'Attack on Titan': '🛡️',
    'My Hero Academia': '🦸'
  }
  return emojis[name] || '🎌'
}
