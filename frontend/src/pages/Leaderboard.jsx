import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'
import { useSoundEffects } from '../context/SoundContext'
import { useVFX } from '../context/VFXContext'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)
  const { onHover, onClick } = useSoundEffects()
  const { celebrate, winPrize, addEffect } = useVFX()

  useEffect(() => {
    fetchLeaders()
  }, [period])

  const fetchLeaders = async () => {
    try {
      const res = await api.get(`/leaderboard?period=${period}`)
      setLeaders(res.data)
    } catch (err) {
      setLeaders([
        { _id: '1', username: 'أحمد', totalWins: 150, totalBoxes: 200, totalWinnings: 5000 },
        { _id: '2', username: 'سارة', totalWins: 120, totalBoxes: 180, totalWinnings: 4200 },
        { _id: '3', username: 'خالد', totalWins: 100, totalBoxes: 150, totalWinnings: 3800 },
        { _id: '4', username: 'منى', totalWins: 95, totalBoxes: 140, totalWinnings: 3500 },
        { _id: '5', username: 'علي', totalWins: 88, totalBoxes: 130, totalWinnings: 3200 },
        { _id: '6', username: 'ناف', totalWins: 75, totalBoxes: 110, totalWinnings: 2800 },
        { _id: '7', username: 'لمى', totalWins: 70, totalBoxes: 100, totalWinnings: 2500 },
        { _id: '8', username: 'يزن', totalWins: 65, totalBoxes: 95, totalWinnings: 2200 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleTop3Click = (index) => {
    onClick()
    if (index === 0) {
      celebrate()
    } else {
      winPrize(index === 1 ? 'epic' : 'rare')
    }
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
          <h1 className="text-5xl font-bold mb-2"><span className="shimmer-text">الترتيب</span></h1>
          <p className="text-xl text-gray-400">أفضل اللاعبين</p>
        </div>
        <Link to="/" onClick={onClick} className="glass-premium px-6 py-3 hover:bg-white/10 transition">← رجوع</Link>
      </header>

      <div className="flex justify-center gap-4 mb-12" style={{ position: 'relative' }}>
        {[{ id: 'daily', label: 'اليوم' }, { id: 'weekly', label: 'الأسبوع' }, { id: 'monthly', label: 'الشهر' }, { id: 'all', label: 'كل الوقت' }].map(p => (
          <button key={p.id} onClick={() => { setPeriod(p.id); onClick(); addEffect('sparkle', { count: 8, duration: 800 }) }} onMouseEnter={onHover}
            className={`category-card px-8 py-3 rounded-2xl font-bold transition ${
              period === p.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black' : 'glass-premium text-gray-400 hover:text-white'`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center items-end gap-4 mb-12">
        {leaders[1] && (
          <div className="card-3d glass-premium p-6 text-center transform hover:scale-105 cursor-pointer" style={{ width: 200 }} onClick={() => handleTop3Click(1)} onMouseEnter={onHover}>
            <div className="text-5xl mb-3">🥈</div>
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-3xl font-bold text-gray-900 border-4 border-gray-400 float-3d">
              {leaders[1].username?.charAt(0)}
            </div>
            <div className="font-bold text-xl mb-1">{leaders[1].username}</div>
            <div className="text-2xl font-bold shimmer-text">${leaders[1].totalWinnings}</div>
            <div className="mt-3 glass-premium py-1 px-3 rounded-full text-sm">{leaders[1].totalWins} مكسب</div>
          </div>
        )}

        {leaders[0] && (
          <div className="card-3d glass-premium p-8 text-center glow-pulse transform scale-110 gradient-border cursor-pointer" style={{ width: 240 }} onClick={() => handleTop3Click(0)} onMouseEnter={() => { onHover(); addEffect('particles', { count: 30, colors: ['#ffd700', '#ff6b6b'] }) }}>
            <div className="text-6xl mb-3 float-3d">👑</div>
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-4xl font-bold text-amber-900 border-4 border-yellow-400 shadow-lg float-3d">
              {leaders[0].username?.charAt(0)}
            </div>
            <div className="font-bold text-2xl mb-1 shimmer-text">{leaders[0].username}</div>
            <div className="text-3xl font-bold shimmer-text">${leaders[0].totalWinnings}</div>
            <div className="mt-3 bg-gradient-to-r from-yellow-500 to-amber-500 py-2 px-4 rounded-full text-amber-900 font-bold">🏆 البطل</div>
          </div>
        )}

        {leaders[2] && (
          <div className="card-3d glass-premium p-6 text-center transform hover:scale-105 cursor-pointer" style={{ width: 200 }} onClick={() => handleTop3Click(2)} onMouseEnter={onHover}>
            <div className="text-5xl mb-3">🥉</div>
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-3xl font-bold text-amber-900 border-4 border-orange-400 float-3d">
              {leaders[2].username?.charAt(0)}
            </div>
            <div className="font-bold text-xl mb-1">{leaders[2].username}</div>
            <div className="text-2xl font-bold shimmer-text">${leaders[2].totalWinnings}</div>
            <div className="mt-3 glass-premium py-1 px-3 rounded-full text-sm">{leaders[2].totalWins} مكسب</div>
          </div>
        )}
      </div>

      <div className="glass-premium p-6 max-w-3xl mx-auto" style={{ position: 'relative' }}>
        {leaders.slice(3).map((leader, i) => (
          <div key={leader._id} className="category-card flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-3 hover:bg-white/10 transition cursor-pointer" onClick={() => { onClick(); winPrize('rare') }} onMouseEnter={onHover}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
              #{i + 4}
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              {leader.username?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{leader.username}</div>
              <div className="text-sm text-gray-400">{leader.totalBoxes || 0} صندوق</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{leader.totalWins || 0} مكسب</div>
              <div className="text-xl font-bold shimmer-text">${leader.totalWinnings || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
