import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">⚙️ لوحة الإدارة</h1>
          <p className="text-gray-400">إدارة المنصة</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/users" className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">
            👥 المستخدمين
          </Link>
          <Link to="/admin/boxes" className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">
            🎁 الصناديق
          </Link>
          <Link to="/admin/products" className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">
            📦 المنتجات
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
          <div className="text-blue-200">المستخدمين</div>
          <div className="text-4xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</div>
          <div className="text-blue-200 text-sm">+{stats?.newUsersToday || 0} اليوم</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6">
          <div className="text-green-200">الطلبات</div>
          <div className="text-4xl font-bold">{stats?.totalOrders?.toLocaleString() || 0}</div>
          <div className="text-green-200 text-sm">+{stats?.ordersToday || 0} اليوم</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6">
          <div className="text-purple-200">الصناديق المفتوحة</div>
          <div className="text-4xl font-bold">{stats?.totalBoxesOpened?.toLocaleString() || 0}</div>
          <div className="text-purple-200 text-sm">+{stats?.boxesToday || 0} اليوم</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6">
          <div className="text-yellow-200">الإيرادات</div>
          <div className="text-4xl font-bold">${stats?.totalRevenue?.toFixed(2) || 0}</div>
          <div className="text-yellow-200 text-sm">+${stats?.revenueToday?.toFixed(2) || 0} اليوم</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📦 أحدث الطلبات</h2>
            <Link to="/admin/orders" className="text-purple-400 hover:text-purple-300">→ عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-700 p-3 rounded-xl">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  👤
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{order.user?.username || 'مستخدم'}</div>
                  <div className="text-xs text-gray-400">#{order.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${order.total}</div>
                  <div className={`text-xs ${
                    order.status === 'delivered' ? 'text-green-400' :
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
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">👥 أحدث المستخدمين</h2>
            <Link to="/admin/users" className="text-purple-400 hover:text-purple-300">→ عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-700 p-3 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{user.username}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{user.points} نقطة</div>
                  <div className={`text-xs ${user.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
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
        <Link to="/admin/boxes/new" className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl text-center hover:scale-105 transition">
          <div className="text-2xl mb-2">➕</div>
          <div className="font-bold">إضافة صندوق</div>
        </Link>
        <Link to="/admin/products/new" className="bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-xl text-center hover:scale-105 transition">
          <div className="text-2xl mb-2">📦</div>
          <div className="font-bold">إضافة منتج</div>
        </Link>
        <Link to="/admin/prizes/new" className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-xl text-center hover:scale-105 transition">
          <div className="text-2xl mb-2">🎁</div>
          <div className="font-bold">إضافة جائزة</div>
        </Link>
        <Link to="/admin/settings" className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-xl text-center hover:scale-105 transition">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-bold">الإعدادات</div>
        </Link>
      </div>
    </div>
  )
}