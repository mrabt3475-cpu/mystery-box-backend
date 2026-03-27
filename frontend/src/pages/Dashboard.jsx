import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('/users/me/dashboard')
      setStats(res.data.stats)
      setRecentActivity(res.data.recentActivity)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">مرحباً بك! 👋</h1>
        <p className="text-purple-200">هل أنت مستعد لفتح بعض الصناديق؟</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Link to="/wallet" className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
          <div className="text-3xl mb-2">🪙</div>
          <div className="text-2xl font-bold">{stats?.points || 0}</div>
          <div className="text-gray-400">نقاطي</div>
        </Link>
        <Link to="/orders" className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
          <div className="text-gray-400">طلباتي</div>
        </Link>
        <Link to="/rewards" className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
          <div className="text-3xl mb-2">🎁</div>
          <div className="text-2xl font-bold">{stats?.totalRewards || 0}</div>
          <div className="text-gray-400">مكافآتي</div>
        </Link>
        <Link to="/leaderboard" className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold">#{stats?.rank || '-'}</div>
          <div className="text-gray-400">ترتيبي</div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">⚡ إجراءات سريعة</h2>
          <div className="space-y-3">
            <Link to="/boxes" className="flex items-center gap-4 p-4 bg-purple-600/20 rounded-lg hover:bg-purple-600/30">
              <span className="text-2xl">🎁</span>
              <span className="font-bold">فتح صندوق</span>
            </Link>
            <Link to="/wallet" className="flex items-center gap-4 p-4 bg-green-600/20 rounded-lg hover:bg-green-600/30">
              <span className="text-2xl">💰</span>
              <span className="font-bold">شحن الرصيد</span>
            </Link>
            <Link to="/referral" className="flex items-center gap-4 p-4 bg-blue-600/20 rounded-lg hover:bg-blue-600/30">
              <span className="text-2xl">👥</span>
              <span className="font-bold">دعوة صديق</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-4 p-4 bg-yellow-600/20 rounded-lg hover:bg-yellow-600/30">
              <span className="text-2xl">⚙️</span>
              <span className="font-bold">الإعدادات</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📜 النشاط الأخير</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <div className="font-bold">{activity.title}</div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-gray-500 text-center py-8">لا يوجد نشاط حديث</p>
            )}
          </div>
        </div>
      </div>

      {/* Featured Boxes */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🎁 صناديق مميزة</h2>
          <Link to="/boxes" className="text-purple-400 hover:text-purple-300">عرض الكل →</Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {stats?.featuredBoxes?.map((box, i) => (
            <Link key={i} to={`/boxes/${box._id}`} className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition">
              <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-3 flex items-center justify-center text-4xl">
                🎁
              </div>
              <div className="font-bold">{box.name}</div>
              <div className="text-green-400 font-bold">{box.cost} نقطة</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}