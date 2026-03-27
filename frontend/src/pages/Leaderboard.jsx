import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaders()
  }, [period])

  const fetchLeaders = async () => {
    try {
      const res = await api.get(`/leaderboard?period=${period}`)
      setLeaders(res.data)
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
            <span className="gold-gradient">الترتيب</span>
          </h1>
          <p className="text-xl text-gray-400">أفضل اللاعبين</p>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Period Filter */}
      <div className="flex justify-center gap-4 mb-12">
        {[
          { id: 'daily', label: 'اليوم' },
          { id: 'weekly', label: 'الأسبوع' },
          { id: 'monthly', label: 'الشهر' },
          { id: 'all', label: 'كل الوقت' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-8 py-3 rounded-full font-bold transition ${
              period === p.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                : 'glass-card text-gray-400 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-12">
        {/* 2nd Place */}
        {leaders[1] && (
          <div className="glass-card p-6 text-center transform hover:scale-105 transition" style={{ width: 200 }}>
            <div className="text-4xl mb-2">🥈</div>
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-3xl font-bold text-gray-900">
              {leaders[1].username?.charAt(0)}
            </div>
            <div className="font-bold text-lg mb-1">{leaders[1].username}</div>
            <div className="text-2xl font-bold gold-gradient">${leaders[1].totalWinnings}</div>
            <div className="mt-3 glass-card py-1 px-3 rounded-full text-sm">
              🥈 الثاني
            </div>
          </div>
        )}

        {/* 1st Place */}
        {leaders[0] && (
          <div className="glass-card p-8 text-center glow-pulse transform scale-110" style={{ width: 240 }}>
            <div className="text-5xl mb-2 float">👑</div>
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl font-bold text-amber-900 border-4 border-amber-400">
              {leaders[0].username?.charAt(0)}
            </div>
            <div className="font-bold text-xl mb-1 gold-gradient">{leaders[0].username}</div>
            <div className="text-3xl font-bold gold-gradient">${leaders[0].totalWinnings}</div>
            <div className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-500 py-1 px-4 rounded-full text-amber-900 font-bold">
              🥇 البطل
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {leaders[2] && (
          <div className="glass-card p-6 text-center transform hover:scale-105 transition" style={{ width: 200 }}>
            <div className="text-4xl mb-2">🥉</div>
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-3xl font-bold text-amber-900">
              {leaders[2].username?.charAt(0)}
            </div>
            <div className="font-bold text-lg mb-1">{leaders[2].username}</div>
            <div className="text-2xl font-bold gold-gradient">${leaders[2].totalWinnings}</div>
            <div className="mt-3 glass-card py-1 px-3 rounded-full text-sm">
              🥉 الثالث
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="glass-card p-6 max-w-3xl mx-auto">
        {leaders.slice(3).map((leader, i) => (
          <div key={leader._id} className="leader-item">
            <div className="leader-rank rank-4+ text-gray-400">
              #{i + 4}
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              {leader.username?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-bold">{leader.username}</div>
              <div className="text-sm text-gray-400">{leader.totalBoxes || 0} صندوق</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{leader.totalWins || 0} مكسب</div>
              <div className="gold-gradient font-bold">${leader.totalWinnings || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}