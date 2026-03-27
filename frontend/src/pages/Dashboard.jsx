import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
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
      {/* Particles Background */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
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
      <header className="navbar-premium mb-8" style={{ position: 'relative', marginBottom: 32 }}>
        <div className="logo-premium">
          <span className="shimmer">ATHENA</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="points-display">
            <span className="points-icon">🪙</span>
            <span className="points-value">{user?.points?.toLocaleString() || 0}</span>
          </div>
          <Link to="/profile" className="glass-card p-2 rounded-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-amber-900">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="fade-in-up mb-12">
        <h1 className="text-5xl font-bold mb-4">
          مرحباً، <span className="gold-gradient">{user?.username}</span>
        </h1>
        <p className="text-xl text-gray-400">
          هل أنت مستعد للفوز بجوائز قيمة؟
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="stat-card fade-in-up stagger-1">
          <div className="text-4xl mb-2">🎁</div>
          <div className="text-4xl font-bold gold-gradient">{stats?.totalBoxes || 0}</div>
          <div className="text-gray-400 mt-2">صندوق تم فتحه</div>
        </div>
        <div className="stat-card fade-in-up stagger-2">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-4xl font-bold text-emerald-400">{stats?.totalWins || 0}</div>
          <div className="text-gray-400 mt-2">مكسب</div>
        </div>
        <div className="stat-card fade-in-up stagger-3">
          <div className="text-4xl mb-2">💎</div>
          <div className="text-4xl font-bold text-purple-400">{stats?.totalValue || 0}</div>
          <div className="text-gray-400 mt-2">قيمة الجوائز</div>
        </div>
        <div className="stat-card fade-in-up stagger-4">
          <div className="text-4xl mb-2">👑</div>
          <div className="text-4xl font-bold text-blue-400">#{stats?.rank || '-'}</div>
          <div className="text-gray-400 mt-2">ترتيبك</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <Link to="/boxes" className="card-luxury group p-8 cursor-pointer" style={{ textDecoration: 'none' }}>
          <div className="text-6xl mb-4 float">🎁</div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition">افتح صندوق</h3>
          <p className="text-gray-400">جرب حظك الآن!</p>
          <div className="mt-4 w-12 h-1 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </Link>

        <Link to="/shop" className="card-luxury group p-8 cursor-pointer" style={{ textDecoration: 'none' }}>
          <div className="text-6xl mb-4 float" style={{ animationDelay: '1s' }}>🛍️</div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition">تسوق</h3>
          <p className="text-gray-400">اشترِ منتجات واكسب نقاط</p>
          <div className="mt-4 w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </Link>

        <Link to="/leaderboard" className="card-luxury group p-8 cursor-pointer" style={{ textDecoration: 'none' }}>
          <div className="text-6xl mb-4 float" style={{ animationDelay: '2s' }}>🏅</div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition">الترتيب</h3>
          <p className="text-gray-400">شاهد أفضل اللاعبين</p>
          <div className="mt-4 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </Link>
      </div>

      {/* How It Works */}
      <div className="glass-card p-8 fade-in-up stagger-5">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="gold-gradient">كيف تعمل المنصة؟</span>
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl glow-pulse">
              🛒
            </div>
            <h3 className="text-xl font-bold mb-2">تسوق</h3>
            <p className="text-gray-400">اشترِ منتجات من المتجر</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl glow-pulse" style={{ animationDelay: '0.5s' }}>
              🪙
            </div>
            <h3 className="text-xl font-bold mb-2">اكسب نقاط</h3>
            <p className="text-gray-400">احصل على 5% من كل عملية شراء</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl glow-pulse" style={{ animationDelay: '1s' }}>
              🎁
            </div>
            <h3 className="text-xl font-bold mb-2">افتح صناديق</h3>
            <p className="text-gray-400">استخدم نقاطك لفتح صناديق مجانية</p>
          </div>
        </div>
      </div>
    </div>
  )
}