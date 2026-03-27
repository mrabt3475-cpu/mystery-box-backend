import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import '../styles/channelDetail.css'

export default function ChannelDetail() {
  const { id } = useParams()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [donateAmount, setDonateAmount] = useState('')

  useEffect(() => {
    fetchChannel()
  }, [id])

  const fetchChannel = async () => {
    try {
      const res = await api.get(`/channels/${id}`)
      setChannel(res.data.data)
    } catch (err) {
      setChannel({
        _id: id,
        name: 'عالم电子产品',
        description: 'أحدث المنتجات التقنية بأسعار مخفضة',
        owner: { username: 'tech_store', avatar: 'ت' },
        stats: { totalMembers: 1500, totalSales: 250, totalCommission: 5000, totalDonations: 1200 },
        bot: { enabled: true, username: 'tech_store_bot' },
        products: []
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    try {
      await api.post(`/channels/${id}/join`)
      alert('انضممت للقناة!')
    } catch (err) {
      alert(err.response?.data?.error || 'فشل الانضمام')
    }
  }

  const handleDonate = async () => {
    if (!donateAmount) return
    setDonating(true)
    try {
      await api.post(`/channels/${id}/donate`, { amount: parseInt(donateAmount) })
      alert('شكراً لتبرعك!')
      setDonateAmount('')
      fetchChannel()
    } catch (err) {
      alert(err.response?.data?.error || 'فشل التبرع')
    } finally {
      setDonating(false)
    }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div className="channel-detail">
      <div className="channel-hero" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
        <div className="hero-content">
          <div className="channel-avatar">
            {channel.name?.charAt(0)}
          </div>
          <h1>{channel.name}</h1>
          <p>{channel.description}</p>
          <div className="owner-info">
            <span>👤 المالك: @{channel.owner?.username}</span>
            {channel.bot?.enabled && <span>🤖 البوت: @{channel.bot.username}</span>}
          </div>
        </div>
      </div>

      <div className="channel-stats-grid">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{channel.stats?.totalMembers}</span>
          <span className="stat-label">الأعضاء</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{channel.stats?.totalSales}</span>
          <span className="stat-label">المبيعات</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💎</span>
          <span className="stat-value">{channel.stats?.totalCommission}</span>
          <span className="stat-label">العمولات</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❤️</span>
          <span className="stat-value">{channel.stats?.totalDonations}</span>
          <span className="stat-label">التبرعات</span>
        </div>
      </div>

      <div className="channel-actions">
        <button onClick={handleJoin} className="btn-join">
          انضم للقناة
        </button>
        
        <div className="donate-section">
          <input
            type="number"
            placeholder="نقاط للتبرع"
            value={donateAmount}
            onChange={(e) => setDonateAmount(e.target.value)}
          />
          <button onClick={handleDonate} disabled={donating} className="btn-donate">
            {donating ? '...' : '❤️ تبرع'}
          </button>
        </div>
      </div>

      {channel.products?.length > 0 && (
        <div className="channel-products">
          <h2>🛍️ منتجات القناة</h2>
          <div className="products-grid">
            {channel.products.map(product => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">{product.price} نقطة</p>
                <button>شراء</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
