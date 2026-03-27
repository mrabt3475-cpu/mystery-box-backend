import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [prizes, setPrizes] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [userRes, ordersRes, prizesRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/orders'),
        api.get('/users/prizes'),
      ])
      setUser(userRes.data)
      setOrders(ordersRes.data)
      setPrizes(prizesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="spinner-luxury"></div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: '👤' },
    { id: 'orders', label: 'الطلبات', icon: '📦' },
    { id: 'prizes', label: 'الجوائز', icon: '🏆' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ]

  return (
    <div className="premium-bg min-h-screen p-6 pt-24">
      {/* Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-4xl font-bold gold-gradient">ملفي الشخصي</h1>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Profile Header */}
      <div className="glass-card p-8 mb-8 fade-in-up glow-pulse">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-5xl font-bold text-amber-900 border-4 border-amber-400">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{user?.username}</h2>
            <p className="text-gray-400 mb-4">{user?.email}</p>
            <div className="flex gap-4">
              <div className="glass-card px-5 py-2 rounded-xl">
                <span className="gold-gradient font-bold text-xl">{user?.points || 0}</span>
                <span className="text-gray-400 mr-1">نقطة</span>
              </div>
              <div className="glass-card px-5 py-2 rounded-xl">
                <span className="text-emerald-400 font-bold text-xl">{user?.totalWins || 0}</span>
                <span className="text-gray-400 mr-1">مكسب</span>
              </div>
              <div className="glass-card px-5 py-2 rounded-xl">
                <span className="text-purple-400 font-bold text-xl">#{user?.rank || '-'}</span>
                <span className="text-gray-400 mr-1">ترتيب</span>
              </div>
            </div>
          </div>
          <button className="btn-premium">
            تعديل الملف
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6" style={{ position: 'relative' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                : 'glass-card text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6 fade-in-up">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="stat-card">
              <div className="text-gray-400 mb-2">إجمالي أنفقت</div>
              <div className="text-4xl font-bold">${user?.totalSpent || 0}</div>
            </div>
            <div className="stat-card">
              <div className="text-gray-400 mb-2">الصناديق المفتوحة</div>
              <div className="text-4xl font-bold text-purple-400">{user?.totalBoxes || 0}</div>
            </div>
            <div className="stat-card">
              <div className="text-gray-400 mb-2">قيمة الجوائز</div>
              <div className="text-4xl font-bold gold-gradient">${user?.totalWinnings || 0}</div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-12">لا توجد طلبات</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">طلب #{order.orderNumber}</div>
                    <div className="text-sm text-gray-400">{order.items?.length} منتجات</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">${order.total}</div>
                    <div className={`text-sm ${
                      order.status === 'delivered' ? 'text-emerald-400' :
                      order.status === 'shipped' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>
                      {order.status === 'delivered' ? 'تم التسليم' :
                       order.status === 'shipped' ? 'تم الشحن' : 'قيد التجهيز'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="grid grid-cols-4 gap-4">
            {prizes.length === 0 ? (
              <p className="text-gray-500 text-center py-12 col-span-4">لا توجد جوائز</p>
            ) : (
              prizes.map((prize, i) => (
                <div key={i} className="glass-card p-4 text-center hover:transform hover:scale-105 transition">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    prize.rarity === 'legendary' ? 'rarity-legendary' :
                    prize.rarity === 'epic' ? 'rarity-epic' :
                    prize.rarity === 'rare' ? 'rarity-rare' : 'rarity-common'
                  }`}>
                    {prize.rarity === 'legendary' ? '👑' : '🎁'}
                  </div>
                  <div className="font-bold mb-1">{prize.name}</div>
                  <div className="text-xs text-gray-400 capitalize mb-1">{prize.rarity}</div>
                  <div className="gold-gradient font-bold">${prize.value}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between glass-card p-4">
              <div>
                <div className="font-bold text-lg">الإشعارات</div>
                <div className="text-sm text-gray-400">استلم إشعارات بالجوائز الجديدة</div>
              </div>
              <button className="w-14 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative">
                <div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1"></div>
              </button>
            </div>
            <Link to="/wallet" className="flex items-center justify-between glass-card p-4 block hover:bg-white/5 transition">
              <div>
                <div className="font-bold text-lg">المحفظة</div>
                <div className="text-sm text-gray-400">إدارة نقاطك ومحفظة التون</div>
              </div>
              <span className="text-amber-400 text-2xl">→</span>
            </Link>
            <Link to="/referral" className="flex items-center justify-between glass-card p-4 block hover:bg-white/5 transition">
              <div>
                <div className="font-bold text-lg">الإحالة</div>
                <div className="text-sm text-gray-400">دعوة أصدقاء واكسب نقاط</div>
              </div>
              <span className="text-amber-400 text-2xl">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}