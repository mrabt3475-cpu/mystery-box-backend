import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'
import { useSoundEffects } from '../context/SoundContext'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [boxes, setBoxes] = useState([])
  const [recentWinners, setRecentWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const { onHover, onClick, onWin, onCoin, muted } = useSoundEffects()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [userRes, statsRes, boxesRes, winnersRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/stats'),
        api.get('/boxes/active?limit=3'),
        api.get('/winners/recent?limit=5'),
      ])
      setUser(userRes.data)
      setStats(statsRes.data)
      setBoxes(boxesRes.data)
      setRecentWinners(winnersRes.data || [
        { username: 'أحمد', prize: 'آيفون 15', avatar: 'أ' },
        { username: 'سارة', prize: '500 USDT', avatar: 'س' },
        { username: 'خالد', prize: 'PS5', avatar: 'خ' },
        { username: 'منى', prize: '1000 نقطة', avatar: 'م' },
        { username: 'علي', prize: 'سماعات', avatar: 'ع' },
      ])
    } catch (err) {
      setUser({ username: 'مستخدم', points: 1250, totalBoxes: 15, totalWins: 8 })
      setStats({ totalBoxes: 150, totalWins: 89, totalValue: 5000, rank: 42 })
      setBoxes([
        { _id: '1', name: 'صندوق الذهبي', icon: '👑', cost: 500, rarity: 'legendary' },
        { _id: '2', name: 'صندوق الفضي', icon: '💎', cost: 300, rarity: 'epic' },
        { _id: '3', name: 'صندوق البرونزي', icon: '🥉', cost: 150, rarity: 'rare' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 via-amber-500 to-orange-600'
      case 'epic': return 'from-purple-500 via-violet-500 to-fuchsia-600'
      case 'rare': return 'from-blue-500 via-cyan-500 to-sky-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const handleBoxClick = () => {
    if (!muted) {
      const { playSound } = useSoundEffects()
      playSound('click')
    }
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="loading-dots"><span></span><span></span><span></span></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s`, animationDuration: `${15 + Math.random() * 10}s` }} />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative mb-12 fade-in-up">
        <div className="glass-card p-8 relative overflow-hidden" onMouseEnter={onHover}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                مرحباً، <span className="gold-gradient">{user?.username || 'مستخدم'}</span>
              </h1>
              <p className="text-xl text-gray-400 mb-6">هل أنت مستعد للفوز بجوائز قيمة؟</p>
              <div className="flex gap-4">
                <Link to="/boxes" onClick={onClick} className="btn-premium">🎁 افتح صندوق الآن</Link>
                <Link to="/shop" onClick={onClick} className="glass-card px-6 py-3 hover:bg-white/10 transition">🛒 تسوق</Link>
              </div>
            </div>
            
            <div className="text-center">
              <div className="glass-card p-6 glow-pulse" onMouseEnter={onHover}>
                <div className="text-gray-400 mb-2">رصيدك</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold gold-gradient">{user?.points?.toLocaleString() || 0}</span>
                  <span className="text-3xl">🪙</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '🎁', value: stats?.totalBoxes || 0, label: 'الصناديق', gradient: 'from-purple-500 to-pink-500' },
          { icon: '🏆', value: stats?.totalWins || 0, label: 'المكاسب', gradient: 'from-emerald-500 to-teal-500', color: 'text-emerald-400' },
          { icon: '💎', value: `$${stats?.totalValue || 0}`, label: 'القيمة', gradient: 'from-blue-500 to-cyan-500', color: 'text-blue-400' },
          { icon: '👑', value: `#${stats?.rank || '-'}`, label: 'ترتيبك', gradient: 'from-amber-500 to-orange-500', color: 'gold-gradient' },
        ].map((stat, i) => (
          <div key={i} className="stat-card fade-in-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }} onMouseEnter={onHover}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>{stat.icon}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
            <div className={`text-3xl font-bold ${stat.color || ''}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Featured Boxes */}
      <div className="mb-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🎁 الصناديق المميزة</h2>
          <Link to="/boxes" onClick={onClick} className="text-amber-400 hover:text-amber-300 transition">عرض الكل →</Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {boxes.map((box, i) => (
            <Link key={box._id || i} to="/boxes" onClick={onClick} className="card-luxury p-5 cursor-pointer" style={{ textDecoration: 'none' }}>
              <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${getRarityColor(box.rarity)} flex items-center justify-center mb-4`}>
                <span className="text-5xl float">{box.icon || '🎁'}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{box.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold gold-gradient">{box.cost} 🪙</span>
                <span className="text-sm text-gray-400">افتح الآن</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Winners */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="animate-pulse">🏆</span> أحدث الفائزين
          </h2>
          <div className="space-y-3">
            {recentWinners.map((winner, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition" onMouseEnter={onHover}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-amber-900' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                  i === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-600 text-amber-900' :
                  'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {winner.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{winner.username}</div>
                  <div className="text-xs text-gray-400">فاز بـ {winner.prize}</div>
                </div>
                {i < 3 && <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-bold mb-4">⚡ إجراءات سريعة</h2>
          <div className="space-y-3">
            {[
              { icon: '🏅', title: 'الترتيب العالمي', desc: 'شاهد ترتيبك', link: '/leaderboard' },
              { icon: '👥', title: 'دعوة أصدقاء', desc: 'اكسب نقاط مجانية', link: '/referral' },
              { icon: '📦', title: 'طلباتي', desc: 'تتبع طلباتك', link: '/orders' },
            ].map((action, i) => (
              <Link key={i} to={action.link} onClick={onClick} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition" onMouseEnter={onHover}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${['from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600', 'from-blue-500 to-cyan-600'][i]} flex items-center justify-center text-2xl`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{action.title}</div>
                  <div className="text-sm text-gray-400">{action.desc}</div>
                </div>
                <span className="text-amber-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="gold-gradient">كيف تعمل منصة Athena؟</span>
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { icon: '🛒', title: 'تسوق', desc: 'اشترِ منتجات من المتجر', reward: '+5% نقاط', color: 'from-emerald-500 to-teal-600' },
            { icon: '🪙', title: 'اكسب نقاط', desc: 'احصل على نقاط مع كل شراء', reward: 'نقاط مجانية', color: 'from-amber-500 to-orange-600' },
            { icon: '🎁', title: 'افتح صناديق', desc: 'استخدم نقاطك لفتح صناديق', reward: 'فوز مؤكد', color: 'from-purple-500 to-pink-600' },
          ].map((step, i) => (
            <div key={i} className="text-center" onMouseEnter={onHover}>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl glow-pulse`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
              <div className={`mt-4 font-bold ${i === 0 ? 'text-emerald-400' : i === 1 ? 'text-amber-400' : 'text-purple-400'}`}>{step.reward}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2026 Athena. جميع الحقوق محفوظة</p>
      </div>
    </div>
  )
}
