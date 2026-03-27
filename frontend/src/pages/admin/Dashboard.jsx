import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders?limit=5'),
        api.get('/admin/users?limit=5'),
      ])
      setStats(statsRes.data)
      setRecentOrders(ordersRes.data)
      setRecentUsers(usersRes.data)
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

  return (
    <div className="premium-bg min-h-screen p-6 pt-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-8" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-4xl font-bold gold-gradient">⚙️ لوحة الإدارة</h1>
          <p className="text-xl text-gray-400">إدارة المنصة</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/users" className="glass-card px-4 py-2 hover:bg-white/10 transition">👥 المستخدمين</Link>
          <Link to="/admin/boxes" className="glass-card px-4 py-2 hover:bg-white/10 transition">🎁 الصناديق</Link>
          <Link to="/admin/products" className="glass-card px-4 py-2 hover:bg-white/10 transition">📦 المنتجات</Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card fade-in-up stagger-1">
          <div className="text-blue-200 mb-2">👥 المستخدمين</div>
          <div className="text-4xl font-bold text-blue-400">{stats?.totalUsers?.toLocaleString() || 0}</div>
          <div className="text-blue-200/60 text-sm mt-2">+{stats?.newUsersToday || 0} اليوم</div>
        </div>
        <div className="stat-card fade-in-up stagger-2">
          <div className="text-emerald-200 mb-2">📦 الطلبات</div>
          <div className="text-4xl font-bold text-emerald-400">{stats?.totalOrders?.toLocaleString() || 0}</div>
          <div className="text-emerald-200/60 text-sm mt-2">+{stats?.ordersToday || 0} اليوم</div>
        </div>
        <div className="stat-card fade-in-up stagger-3">
          <div className="text-purple-200 mb-2">🎁 الصناديق</div>
          <div className="text-4xl font-bold text-purple-400">{stats?.totalBoxesOpened?.toLocaleString() || 0}</div>
          <div className="text-purple-200/60 text-sm mt-2">+{stats?.boxesToday || 0} اليوم</div>
        </div>
        <div className="stat-card fade-in-up stagger-4 glow-pulse">
          <div className="text-amber-200 mb-2">💰 الإيرادات</div>
          <div className="text-4xl font-bold gold-gradient">${stats?.totalRevenue?.toFixed(2) || 0}</div>
          <div className="text-amber-200/60 text-sm mt-2">+${stats?.revenueToday?.toFixed(2) || 0} اليوم</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📦 أحدث الطلبات</h2>
            <Link to="/admin/orders" className="text-amber-400 hover:text-amber-300 transition">→ عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <div key={i} className="glass-card p-3 flex items-center gap-4 hover:bg-white/5 transition">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  👤
                </div>
                <div className="flex-1">
                  <div className="font-bold">{order.user?.username || 'مستخدم'}</div>
                  <div className="text-xs text-gray-400">#{order.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${order.total}</div>
                  <div className={`text-xs ${
                    order.status === 'delivered' ? 'text-emerald-400' :
                    order.status === 'shipped' ? 'text-blue-400' : 'text-yellow-400'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">👥 أحدث المستخدمين</h2>
            <Link to="/admin/users" className="text-amber-400 hover:text-amber-300 transition">→ عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="glass-card p-3 flex items-center gap-4 hover:bg-white/5 transition">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-bold text-amber-900">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{user.username}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{user.points} 🪙</div>
                  <div className={`text-xs ${user.isVerified ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {user.isVerified ? 'موثق' : 'غير موثق'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Link to="/admin/boxes/new" className="glass-card p-6 text-center hover:bg-purple-500/20 transition group fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">➕</div>
          <div className="font-bold">إضافة صندوق</div>
        </Link>
        <Link to="/admin/products/new" className="glass-card p-6 text-center hover:bg-emerald-500/20 transition group fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">📦</div>
          <div className="font-bold">إضافة منتج</div>
        </Link>
        <Link to="/admin/prizes/new" className="glass-card p-6 text-center hover:bg-amber-500/20 transition group fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">🎁</div>
          <div className="font-bold">إضافة جائزة</div>
        </Link>
        <Link to="/admin/settings" className="glass-card p-6 text-center hover:bg-blue-500/20 transition group fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">⚙️</div>
          <div className="font-bold">الإعدادات</div>
        </Link>
      </div>
    </div>
  )
}