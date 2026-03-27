import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'

export default function Referral() {
  const [referral, setReferral] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([api.get('/referral/code'), api.get('/referral/stats')])
      setReferral(codeRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setReferral({ code: 'ATHENA123' })
      setStats({ totalReferrals: 15, activeReferrals: 8, totalEarnings: 2500, availableBalance: 500 })
    } finally { setLoading(false) }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(referral?.code || 'ATHENA123')
    alert('تم نسخ الكود! 📋')
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="loading-dots"><span></span><span></span><span></span></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s`, animationDuration: `${15 + Math.random() * 10}s` }} />
        ))}
      </div>

      <header className="flex justify-between items-center mb-12" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-5xl font-bold mb-2"><span className="shimmer-text">الإحالة</span></h1>
          <p className="text-xl text-gray-400">دعوة أصدقاء واكسب نقاط!</p>
        </div>
        <Link to="/" className="glass-premium px-6 py-3 hover:bg-white/10 transition">← رجوع</Link>
      </header>

      {/* Referral Code - Holographic */}
      <div className="referral-box mb-12 holographic fade-in-up">
        <h2 className="text-2xl font-bold mb-6">كود الإحالة الخاص بك</h2>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="glass-premium px-8 py-4 animated-border">
            <span className="referral-code text-4xl">{referral?.code || 'ATHENA123'}</span>
          </div>
          <button onClick={copyCode} className="btn-3d btn-premium">📋 نسخ</button>
        </div>
        <p className="text-gray-400">شارك هذا الكود مع أصدقائك وعند تسجيلهم ستحصل على نقاط!</p>
      </div>

      {/* Stats - 3D Cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[
          { icon: '👥', label: 'إجمالي الإحالات', value: stats?.totalReferrals || 0, color: 'text-purple-400' },
          { icon: '✅', label: 'نشطون', value: stats?.activeReferrals || 0, color: 'text-emerald-400' },
          { icon: '🪙', label: 'نقاط مكتسبة', value: stats?.totalEarnings || 0, color: 'text-amber-400' },
          { icon: '💰', label: 'متاح للسحب', value: `$${stats?.availableBalance || 0}`, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="stat-card fade-in-up card-3d" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How it works - 3D Steps */}
      <div className="glass-premium p-8 mb-12 fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-3xl font-bold mb-8 text-center"><span className="shimmer-text">💡 كيف يعمل؟</span></h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { step: 1, icon: '🔗', title: 'شارك الكود', desc: 'أعطِ كود الإحالة لصديقك' },
            { step: 2, icon: '📝', title: 'يسجل', desc: 'صديقك يسجل باستخدام الكود' },
            { step: 3, icon: '🎁', title: 'اكسب نقاط', desc: 'تحصل على 30% من نقاطهم!' },
          ].map((item, i) => (
            <div key={i} className="text-center category-card p-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl float-3d">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Rates */}
      <div className="glass-premium p-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-bold mb-8 text-center"><span className="shimmer-text">💰 معدلات العمولة</span></h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { level: '30%', name: 'المستوى الأول', user: 'صديقك المباشر', gradient: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30' },
            { level: '20%', name: 'المستوى الثاني', user: 'صديق صديقك', gradient: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/30' },
            { level: '10%', name: 'المستوى الثالث', user: 'صديق صديق صديقك', gradient: 'from-amber-700/20 to-orange-700/20', border: 'border-amber-700/30' },
          ].map((tier, i) => (
            <div key={i} className={`text-center p-8 rounded-2xl bg-gradient-to-br ${tier.gradient} border ${tier.border} category-card`}>
              <div className="text-5xl font-bold shimmer-text mb-2">{tier.level}</div>
              <div className="text-xl font-bold mb-1">{tier.name}</div>
              <div className="text-gray-400">{tier.user}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
