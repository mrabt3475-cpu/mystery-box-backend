import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'
import { useSoundEffects } from '../context/SoundContext'
import { useVFX } from '../context/VFXContext'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [prizes, setPrizes] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const { onHover, onClick } = useSoundEffects()
  const { celebrate, winPrize, addEffect } = useVFX()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [userRes, ordersRes, prizesRes] = await Promise.all([api.get('/users/me'), api.get('/orders'), api.get('/users/prizes')])
      setUser(userRes.data)
      setOrders(ordersRes.data)
      setPrizes(prizesRes.data)
    } catch (err) {
      setUser({ username: 'مستخدم', email: 'user@athena.com', points: 1250, totalWins: 8, totalBoxes: 15, totalSpent: 500, totalWinnings: 2500, rank: 42 })
      setOrders([{ _id: '1', orderNumber: '1001', total: 99, status: 'delivered', items: [{ name: 'آيفون', quantity: 1 }] }])
      setPrizes([{ _id: '1', name: 'آيفون 15', rarity: 'legendary', value: 999 }])
    } finally { setLoading(false) }
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    onClick()
    addEffect('sparkle', { count: 8, duration: 800 })
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="loading-dots"><span></span><span></span><span></span></div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: '👤' },
    { id: 'orders', label: 'الطلبات', icon: '📦' },
    { id: 'prizes', label: 'الجوائز', icon: '🏆' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ]

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s`, animationDuration: `${15 + Math.random() * 10}s` }} />
        ))}
      </div>

      <header className="flex justify-between items-center mb-8" style={{ position: 'relative' }}>
        <h1 className="text-4xl font-bold shimmer-text">ملفي الشخصي</h1>
        <Link to="/" onClick={onClick} className="glass-premium px-6 py-3 hover:bg-white/10 transition">← رجوع</Link>
      </header>

      <div className="glass-premium p-8 mb-8 glow-pulse fade-in-up cursor-pointer" onClick={() => { onClick(); celebrate() }} onMouseEnter={() => { onHover(); addEffect('particles', { count: 20, colors: ['#d4af37', '#8b5cf6'] }) }}>
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-5xl font-bold text-amber-900 border-4 border-amber-400 float-3d">
            {user?.username?.charAt(0).toUpperCase() || 'م'}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{user?.username}</h2>
            <p className="text-gray-400 mb-4">{user?.email}</p>
            <div className="flex gap-4">
              {[{ icon: '🪙', value: user?.points, label: 'نقطة' }, { icon: '🏆', value: user?.totalWins, label: 'مكسب' }, { icon: '👑', value: `#${user?.rank}`, label: 'ترتيب' }].map((item, i) => (
                <div key={i} className="glass-premium px-5 py-2 rounded-xl cursor-pointer" onClick={(e) => { e.stopPropagation(); onClick(); winPrize('legendary') }}>
                  <span className="font-bold text-xl">{item.icon} {item.value}</span>
                  <span className="text-gray-400 mr-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-3d btn-premium">تعديل الملف</button>
        </div>
      </div>

      <div className="flex gap-3 mb-6" style={{ position: 'relative' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => handleTabChange(tab.id)} onMouseEnter={onHover}
            className={`category-card px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black' : 'glass-premium text-gray-400 hover:text-white'`}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div className="glass-premium p-6 fade-in-up">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'إجمالي أنفقت', value: `$${user?.totalSpent || 0}`, icon: '💳' },
              { label: 'الصناديق المفتوحة', value: user?.totalBoxes || 0, icon: '🎁', color: 'text-purple-400' },
              { label: 'قيمة الجوائز', value: `$${user?.totalWinnings || 0}`, icon: '💎', color: 'shimmer-text' },
            ].map((item, i) => (
              <div key={i} className="stat-card card-3d cursor-pointer" onClick={() => { onClick(); addEffect('glow', { color: '#d4af37', duration: 500 }) }} onMouseEnter={onHover}>
                <div className="text-gray-400 mb-2">{item.label}</div>
                <div className={`text-4xl font-bold ${item.color || ''}`}>{item.icon} {item.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? <p className="text-gray-500 text-center py-12">لا توجد طلبات</p> :
              orders.map(order => (
                <div key={order._id} className="category-card flex items-center gap-4 p-4 hover:bg-white/5 transition cursor-pointer" onClick={() => { onClick(); addEffect('sparkle', { count: 10, duration: 800 }) }} onMouseEnter={onHover}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">📦</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">طلب #{order.orderNumber}</div>
                    <div className="text-sm text-gray-400">{order.items?.length} منتجات</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">${order.total}</div>
                    <div className="text-sm text-emerald-400">{order.status === 'delivered' ? 'تم التسليم' : 'قيد التجهيز'}</div>
                  </div>
                </div>
              ))}
            }
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="grid grid-cols-4 gap-4">
            {prizes.length === 0 ? <p className="text-gray-500 text-center py-12 col-span-4">لا توجد جوائز</p> :
              prizes.map((prize, i) => (
                <div key={i} className="category-card glass-premium p-4 text-center hover:transform hover:scale-105 transition cursor-pointer" onClick={() => { onClick(); winPrize(prize.rarity) }} onMouseEnter={onHover}>
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    prize.rarity === 'legendary' ? 'rarity-legendary' : prize.rarity === 'epic' ? 'rarity-epic' : 'rarity-common'
                  }`}>
                    {prize.rarity === 'legendary' ? '👑' : '🎁'}
                  </div>
                  <div className="font-bold mb-1">{prize.name}</div>
                  <div className="text-xs text-gray-400 capitalize mb-1">{prize.rarity}</div>
                  <div className="shimmer-text font-bold">${prize.value}</div>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {[
              { icon: '🔔', title: 'الإشعارات', desc: 'استلم إشعارات بالجوائز الجديدة' },
              { icon: '💰', title: 'المحفظة', desc: 'إدارة نقاطك ومحفظة التون', link: '/wallet' },
              { icon: '👥', title: 'الإحالة', desc: 'دعوة أصدقاء واكسب نقاط', link: '/referral' },
            ].map((item, i) => (
              <Link key={i} to={item.link || '#'} onClick={onClick} className="category-card flex items-center justify-between p-4 hover:bg-white/5 transition cursor-pointer" onMouseEnter={() => { onHover(); addEffect('glow', { color: '#8b5cf6', duration: 500 }) }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">{item.icon}</div>
                  <div>
                    <div className="font-bold text-lg">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                </div>
                <span className="text-amber-400 text-2xl">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
