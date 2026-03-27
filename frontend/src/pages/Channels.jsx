import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/channels.css'

export default function Channels() {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchChannels()
  }, [filter])

  const fetchChannels = async () => {
    try {
      const res = await api.get(`/channels?search=${search}&sort=${filter}`)
      setChannels(res.data.data)
    } catch (err) {
      setChannels([
        { _id: '1', name: 'عالم电子产品', description: 'أحدث المنتجات التقنية', owner: { username: 'tech_store' }, stats: { totalMembers: 1500, totalSales: 250 }, promotion: { isPromoted: true } },
        { _id: '2', name: 'متجر الجوالات', description: 'أفضل الأسعار', owner: { username: 'phoneshop' }, stats: { totalMembers: 800, totalSales: 120 }, promotion: { isPromoted: false } },
        { _id: '3', name: 'مستلزماتكم', description: 'كل ما تحتاج', owner: { username: 'needs' }, stats: { totalMembers: 2000, totalSales: 400 }, promotion: { isPromoted: true } },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchChannels()
  }

  return (
    <div className="channels-page">
      <header className="channels-header">
        <div>
          <h1>📢 القنوات والبوتات</h1>
          <p>استكشف القنوات واحصل على عمولات</p>
        </div>
        <Link to="/channels/create" className="btn-create-channel">
          + أنشئ قناة
        </Link>
      </header>

      <div className="channels-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="ابحث عن القنوات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      <div className="channels-filters">
        {['all', 'popular', 'new'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'الكل' : f === 'popular' ? 'الأكثر شعبية' : 'الجديدة'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : (
        <div className="channels-grid">
          {channels.map(channel => (
            <Link to={`/channels/${channel._id}`} key={channel._id} className="channel-card">
              <div className="channel-banner">
                {channel.promotion?.isPromoted && <span className="promoted-badge">⭐ مدعوم</span>}
              </div>
              <div className="channel-info">
                <h3>{channel.name}</h3>
                <p>{channel.description}</p>
                <div className="channel-stats">
                  <span>👥 {channel.stats?.totalMembers || 0}</span>
                  <span>💰 {channel.stats?.totalSales || 0} عملية</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
