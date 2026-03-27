import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Referral() {
  const [referral, setReferral] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        api.get('/referral/code'),
        api.get('/referral/stats'),
      ])
      setReferral(codeRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(referral.code)
    alert('تم نسخ الكود! 📋')
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="spinner-luxury"></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24">
      {/* Particles */}
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
      <header className="flex justify-between items-center mb-12" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-5xl font-bold mb-2">
            <span className="gold-gradient">الإحالة</span>
          </h1>
          <p className="text-xl text-gray-400">دعوة أصدقاء واكسب نقاط!</p>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Referral Code */}
      <div className="referral-box mb-12 fade-in-up">
        <h2 className="text-2xl font-bold mb-6">كود الإحالة الخاص بك</h2>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="glass-card px-8 py-4">
            <span className="referral-code">{referral?.code}</span>
          </div>
          <button
            onClick={copyCode}
            className="btn-premium"
          >
            📋 نسخ
          </button>
        </div>
        <p className="text-gray-400">
          شارك هذا الكود مع أصدقائك وعند تسجيلهم ستحصل على نقاط!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="stat-card fade-in-up stagger-1">
          <div className="text-4xl mb-3">👥</div>
          <div className="text-4xl font-bold gold-gradient">{stats?.totalReferrals || 0}</div>
          <div className="text-gray-400 mt-2">إجمالي الإحالات</div>
        </div>
        <div className="stat-card fade-in-up stagger-2">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-4xl font-bold text-emerald-400">{stats?.activeReferrals || 0}</div>
          <div className="text-gray-400 mt-2">نشطون</div>
        </div>
        <div className="stat-card fade-in-up stagger-3">
          <div className="text-4xl mb-3">🪙</div>
          <div className="text-4xl font-bold text-purple-400">{stats?.totalEarnings || 0}</div>
          <div className="text-gray-400 mt-2">نقاط مكتسبة</div>
        </div>
        <div className="stat-card fade-in-up stagger-4">
          <div className="text-4xl mb-3">💰</div>
          <div className="text-4xl font-bold text-blue-400">${stats?.availableBalance || 0}</div>
          <div className="text-gray-400 mt-2">متاح للسحب</div>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-8 mb-12 fade-in-up stagger-5">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="gold-gradient">💡 كيف يعمل؟</span>
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl glow-pulse">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">شارك الكود</h3>
            <p className="text-gray-400">أعطِ كود الإحالة لصديقك</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl glow-pulse" style={{ animationDelay: '0.5s' }}>
              2
            </div>
            <h3 className="text-xl font-bold mb-2">يسجل</h3>
            <p className="text-gray-400">صديقك يسجل باستخدام الكود</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-4xl glow-pulse" style={{ animationDelay: '1s' }}>
              3
            </div>
            <h3 className="text-xl font-bold mb-2">اكسب نقاط</h3>
            <p className="text-gray-400">تحصل على 30% من نقاطهم!</p>
          </div>
        </div>
      </div>

      {/* Commission Rates */}
      <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="gold-gradient">💰 معدلات العمولة</span>
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <div className="text-5xl font-bold gold-gradient mb-2">30%</div>
            <div className="text-xl font-bold mb-1">المستوى الأول</div>
            <div className="text-gray-400">صديقك المباشر</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/30">
            <div className="text-5xl font-bold text-gray-300 mb-2">20%</div>
            <div className="text-xl font-bold mb-1">المستوى الثاني</div>
            <div className="text-gray-400">صديق صديقك</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-700/20 to-orange-700/20 border border-amber-700/30">
            <div className="text-5xl font-bold text-amber-400 mb-2">10%</div>
            <div className="text-xl font-bold mb-1">المستوى الثالث</div>
            <div className="text-gray-400">صديق صديق صديقك</div>
          </div>
        </div>
      </div>
    </div>
  )
}