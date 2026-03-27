import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentBoxes, setRecentBoxes] = useState([])
  const [recentPrizes, setRecentPrizes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/stats'),
      ])
      setUser(userRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            مرحباً، {user.username} 👋
          </h1>
          <p className="text-gray-400 mt-1">هل أنت مستعد للفوز اليوم؟</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-800 rounded-full px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-bold text-yellow-400">{user.points?.toLocaleString() || 0}</span>
            <span className="text-gray-400">نقطة</span>
          </div>
          <Link to="/wallet" className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition">
            💰
          </Link>
          <Link to="/notifications" className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition">
            🔔
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-lg">
          <div className="text-4xl font-bold">{stats?.totalBoxes || 0}</div>
          <div className="text-purple-200 mt-2">صندوق تم فتحه</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-lg">
          <div className="text-4xl font-bold">{stats?.totalWins || 0}</div>
          <div className="text-green-200 mt-2">مكسب</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-lg">
          <div className="text-4xl font-bold">{stats?.totalValue || 0}</div>
          <div className="text-yellow-200 mt-2">قيمة الجوائز</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg">
          <div className="text-4xl font-bold">#{stats?.rank || '-'}</div>
          <div className="text-blue-200 mt-2">ترتيبك</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Link to="/boxes" className="group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold mb-2">افتح صندوق</h3>
          <p className="text-indigo-200">جرب حظك الآن</p>
        </Link>
        <Link to="/shop" className="group bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold mb-2">تسوق</h3>
          <p className="text-emerald-200">اشترِ منتجات واكسب نقاط</p>
        </Link>
        <Link to="/leaderboard" className="group bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">الترتيب</h3>
          <p className="text-amber-200">شاهد أفضل اللاعبين</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📦</span> آخر الصناديق
          </h3>
          <div className="space-y-3">
            {recentBoxes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد صناديق بعد</p>
            ) : (
              recentBoxes.map((box, i) => (
                <div key={i} className="bg-gray-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="text-3xl">{box.prize?.rarity === 'legendary' ? '👑' : '🎁'}</div>
                  <div className="flex-1">
                    <div className="font-bold">{box.prize?.name}</div>
                    <div className="text-sm text-gray-400">{box.boxName}</div>
                  </div>
                  <div className="text-green-400 font-bold">+{box.prize?.value} قيمة</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🎉</span> آخر الجوائز
          </h3>
          <div className="space-y-3">
            {recentPrizes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد جوائز بعد</p>
            ) : (
              recentPrizes.map((prize, i) => (
                <div key={i} className="bg-gray-700 rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    prize.rarity === 'legendary' ? 'bg-yellow-600' :
                    prize.rarity === 'epic' ? 'bg-purple-600' :
                    prize.rarity === 'rare' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {prize.rarity === 'legendary' ? '👑' : prize.rarity === 'epic' ? '💜' : prize.rarity === 'rare' ? '💎' : '🎁'}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{prize.name}</div>
                    <div className="text-sm text-gray-400 capitalize">{prize.rarity}</div>
                  </div>
                  <div className="text-yellow-400 font-bold">{prize.value}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}