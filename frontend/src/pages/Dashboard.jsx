import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentWinners, setRecentWinners] = useState([])
  const [featuredBoxes, setFeaturedBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [animatedPoints, setAnimatedPoints] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  // Animate points counter
  useEffect(() => {
    if (user?.points) {
      const target = user.points
      const duration = 1500
      const step = target / (duration / 16)
      let current = 0
      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          setAnimatedPoints(target)
          clearInterval(timer)
        } else {
          setAnimatedPoints(Math.floor(current))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [user?.points])

  const fetchData = async () => {
    try {
      const [userRes, statsRes, winnersRes, boxesRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/stats'),
        api.get('/winners/recent'),
        api.get('/boxes/featured'),
      ])
      setUser(userRes.data)
      setStats(statsRes.data)
      setRecentWinners(winnersRes.data || [
        { username: 'أحمد***', prize: 'آيفون 15 برو', rarity: 'legendary', avatar: '👨' },
        { username: 'سارة***', prize: '1000 USDT', rarity: 'epic', avatar: '👩' },
        { username: 'خالد***', prize: 'سماعات AirPods', rarity: 'rare', avatar: '👨‍💼' },
        { username: 'محمد***', prize: '50 نقطة', rarity: 'common', avatar: '🧑' },
        { username: 'علي***', prize: '500 نقطة', rarity: 'uncommon', avatar: '👱' },
      ])
      setFeaturedBoxes(boxesRes.data || [
        { _id: '1', name: 'صندوق الأساطير', icon: '👑', cost: 500, rarity: 'legendary' },
        { _id: '2', name: 'صندوق الألماس', icon: '💎', cost: 300, rarity: 'epic' },
        { _id: '3', name: 'صندوق الذهب', icon: '🥇', cost: 150, rarity: 'rare' },
      ])
    } catch (err) {
      console.error(err)
      // Mock data for demo
      setUser({ username: 'مستخدم', points: 1250 })
      setStats({ totalBoxes: 45, totalWins: 23, totalValue: 2500, rank: 15 })
      setRecentWinners([
        { username: 'أحمد***', prize: 'آيفون 15 برو', rarity: 'legendary', avatar: '👨' },
        { username: 'سارة***', prize: '1000 USDT', rarity: 'epic', avatar: '👩' },
        { username: 'خالد***', prize: 'سماعات', rarity: 'rare', avatar: '👨‍💼' },
      ])
      setFeaturedBoxes([
        { _id: '1', name: 'صندوق الأساطير', icon: '👑', cost: 500, rarity: 'legendary' },
        { _id: '2', name: 'صندوق الألماس', icon: '💎', cost: 300, rarity: 'epic' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRarityClass = (rarity) => {
    switch(rarity) {
      case 'legendary': return 'rarity-legendary'
      case 'epic': return 'rarity-epic'
      case 'rare': return 'rarity-rare'
      case 'uncommon': return 'rarity-uncommon'
      default: return 'rarity-common'
    }
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="spinner-luxury"></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
      {/* Particles Background */}
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Welcome Section */}
      <div className="fade-in-up mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              مرحباً، <span className="gold-gradient">{user?.username}</span>
            </h1>
            <p className="text-xl text-gray-400">هل أنت مستعد للفوز اليوم؟ 🎯</p>
          </div>
          
          {/* Animated Points Display */}
          <div className="points-display glow-pulse">
            <span className="points-icon text-3xl">🪙</span>
            <div className="text-left">
              <div className="text-xs text-gray-400">رصيدك</div>
              <div className="points-value text-2xl">{animatedPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="stat-card fade-in-up stagger-1 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🎁
            </div>
            <span className="text-purple-400 text-sm">+5</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stats?.totalBoxes || 0}</div>
          <div className="text-gray-400 text-sm">صندوق فتحت</div>
        </div>

        <div className="stat-card fade-in-up stagger-2 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🏆
            </div>
            <span className="text-emerald-400 text-sm">+2</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stats?.totalWins || 0}</div>
          <div className="text-gray-400 text-sm">مكسب</div>
        </div>

        <div className="stat-card fade-in-up stagger-3 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              💎
            </div>
            <span className="text-amber-400 text-sm">+150</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold gold-gradient mb-1">${stats?.totalValue || 0}</div>
          <div className="text-gray-400 text-sm">قيمة الجوائز</div>
        </div>

        <div className="stat-card fade-in-up stagger-4 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              👑
            </div>
            <span className="text-blue-400 text-sm">TOP 20%</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-1">#{stats?.rank || '-'}</div>
          <div className="text-gray-400 text-sm">ترتيبك</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link to="/boxes" className="card-luxury group p-6 md:p-8 cursor-pointer relative overflow-hidden" style={{ textDecoration: 'none' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>
          <div className="text-4xl md:text-6xl mb-4 float" style={{ animationDelay: '0s' }}>🎁</div>
          <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-amber-400 transition">افتح صندوق</h3>
          <p className="text-gray-400 text-sm">جرب حظك الآن!</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500 w-12"></div>
        </Link>

        <Link to="/shop" className="card-luxury group p-6 md:p-8 cursor-pointer relative overflow-hidden" style={{ textDecoration: 'none' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full"></div>
          <div className="text-4xl md:text-6xl mb-4 float" style={{ animationDelay: '1s' }}>🛍️</div>
          <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-emerald-400 transition">تسوق</h3>
          <p className="text-gray-400 text-sm">واكسب نقاط!</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-full transition-all duration-500 w-12"></div>
        </Link>

        <Link to="/leaderboard" className="card-luxury group p-6 md:p-8 cursor-pointer relative overflow-hidden" style={{ textDecoration: 'none' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full"></div>
          <div className="text-4xl md:text-6xl mb-4 float" style={{ animationDelay: '2s' }}>🏅</div>
          <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-purple-400 transition">الترتيب</h3>
          <p className="text-gray-400 text-sm">شاهد الأفضل!</p>
          <div className="mt-3 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full group-hover:w-full transition-all duration-500 w-12"></div>
        </Link>
      </div>

      {/* Featured Boxes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            <span className="gold-gradient">الصناديق المميزة</span>
          </h2>
          <Link to="/boxes" className="text-amber-400 hover:text-amber-300 transition text-sm">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredBoxes.map((box, i) => (
            <div key={box._id} className={`box-card fade-in-up ${getRarityClass(box.rarity)}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="box-image" style={{ height: '140px' }}>
                <span className="text-6xl spin">{box.icon}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{box.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold gold-gradient">{box.cost} 🪙</span>
                  <Link to={`/boxes/${box._id}`} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm">
                    فتح
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Winners */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            <span className="gold-gradient">🏆 أحدث الفائزين</span>
          </h2>
          <Link to="/leaderboard" className="text-amber-400 hover:text-amber-300 transition text-sm">
            عرض الكل ←
          </Link>
        </div>
        <div className="glass-card p-4">
          <div className="space-y-3">
            {recentWinners.map((winner, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${getRarityClass(winner.rarity)}`}>
                  {winner.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{winner.username}</div>
                  <div className="text-sm text-gray-400">فاز بـ: {winner.prize}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityClass(winner.rarity)}`}>
                  {winner.rarity === 'legendary' ? 'أسطوري' :
                   winner.rarity === 'epic' ? 'ملحمي' :
                   winner.rarity === 'rare' ? 'نادر' :
                   winner.rarity === 'uncommon' ? 'غير شائع' : 'شائع'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass-card p-6 md:p-8 fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="gold-gradient">💡 كيف تعمل المنصة؟</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center relative">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl glow-pulse">
              🛒
            </div>
            <h3 className="text-xl font-bold mb-2">1. تسوق</h3>
            <p className="text-gray-400">اشترِ منتجات من المتجر واحصل على نقاط</p>
            <div className="hidden md:block absolute top-10 -right-8 text-2xl text-gray-600">➜</div>
          </div>
          <div className="text-center relative">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl glow-pulse" style={{ animationDelay: '0.5s' }}>
              🪙
            </div>
            <h3 className="text-xl font-bold mb-2">2. اكسب نقاط</h3>
            <p className="text-gray-400">5% من كل عملية شراء تصبح نقاط</p>
            <div className="hidden md:block absolute top-10 -right-8 text-2xl text-gray-600">➜</div>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl glow-pulse" style={{ animationDelay: '1s' }}>
              🎁
            </div>
            <h3 className="text-xl font-bold mb-2">3. افتح صناديق</h3>
            <p className="text-gray-400">استخدم نقاطك لفتح صناديق مجانية</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 glass-card p-6 md:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            🎰 هل حظك جيد اليوم؟
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            كل صندوق تفتحه فرصة للفوز بجوائز قيمة! ابدأ الآن وحصل على نقاط إضافية عند أول عملية شراء
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-premium">
              تسوق واكسب
            </Link>
            <Link to="/boxes" className="glass-card px-6 py-3 hover:bg-white/10 transition font-bold">
              افتح صندوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
