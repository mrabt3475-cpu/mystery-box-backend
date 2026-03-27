import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'

export default function Boxes() {
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState(false)
  const [result, setResult] = useState(null)
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    fetchBoxes()
  }, [])

  const fetchBoxes = async () => {
    try {
      const res = await api.get('/boxes/active')
      setBoxes(res.data)
    } catch (err) {
      // Mock data
      setBoxes([
        { _id: '1', name: 'صندوق الذهبي الملكي', description: 'أفضل الجوائز!, rarity: 'legendary', icon: '👑', cost: 1000, prizes: [{},{},{}] },
        { _id: '2', name: 'صندوق الفضي الماسي', description: 'جوائز قيمة await', rarity: 'epic', icon: '💎', cost: 500, prizes: [{},{},{}] },
        { _id: '3', name: 'صندوق البرونزي', description: 'جرب حظك', rarity: 'rare', icon: '🥉', cost: 200, prizes: [{},{},{}] },
        { _id: '4', name: 'صندوق الياقوت', description: 'جوائز نادرة', rarity: 'epic', icon: '💍', cost: 750, prizes: [{},{},{}] },
        { _id: '5',صندوق الزمرد', description: 'مكاسب مضمونة', rarity: 'rare', icon: '💚', cost: 300, prizes: [{},{},{}] },
        { _id: '6', name: 'صندوق الفيروز', description: 'افتح وحالفك الحظ', rarity: 'uncommon', icon: '🩵', cost: 150, prizes: [{},{},{}] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const openBox = async (boxId) => {
    setOpening(true)
    setResult(null)

    // Simulate opening animation
    await new Promise(resolve => setTimeout(resolve, 2000))

    setResult({
      prize: {
        name: 'آيفون 15 برو',
        rarity: 'legendary',
        value: 999,
      },
      remainingPoints: userPoints - 500,
    })
    setOpening(false)
  }

  const getRarityGradient = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 via-amber-500 to-orange-600'
      case 'epic': return 'from-purple-500 via-violet-500 to-fuchsia-600'
      case 'rare': return 'from-blue-500 via-cyan-500 to-sky-600'
      case 'uncommon': return 'from-green-500 via-emerald-500 to-teal-600'
      default: return 'from-gray-500 via-slate-500 to-zinc-600'
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400'
      case 'epic': return 'text-purple-400'
      case 'rare': return 'text-blue-400'
      case 'uncommon': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="loading-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
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
            <span className="shimmer-text">الصناديق</span>
          </h1>
          <p className="text-xl text-gray-400">افتح صناديق واستلم جوائز مجانية!</p>
        </div>
        <Link to="/" className="glass-premium px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Points Banner */}
      <div className="glass-premium p-6 mb-12 glow-pulse" style={{ position: 'relative' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">رصيدك من النقاط</p>
            <div className="flex items-center gap-3">
              <span className="text-6xl font-bold shimmer-text">{userPoints || 1250}</span>
              <span className="text-3xl">🪙</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400">نقاط من المشتريات</p>
            <p className="text-2xl font-bold text-emerald-400">+5% من كل شراء</p>
          </div>
          <Link to="/shop" className="btn-3d btn-premium">
            تسوق واكسب نقاط
          </Link>
        </div>
      </div>

      {/* Rarity Legend */}
      <div className="flex justify-center gap-6 mb-8" style={{ position: 'relative' }}>
        {['legendary', 'epic', 'rare', 'uncommon'].map(rarity => (
          <div key={rarity} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getRarityGradient(rarity)}`}></div>
            <span className={getRarityColor(rarity)}>
              {rarity === 'legendary' ? '👑 أسطوري' :
               rarity === 'epic' ? '💜 ملحمي' :
               rarity === 'rare' ? '💎 نادر' : '🟢 شائع'}
            </span>
          </div>
        ))}
      </div>

      {/* Boxes Grid - 3D */}
      <div className="grid grid-cols-3 gap-8">
        {boxes.map((box, index) => (
          <div
            key={box._id || index}
            className="card-3d category-card fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="glass-premium rounded-2xl overflow-hidden">
              {/* Box Image with 3D Effect */}
              <div className="relative h-64 flex items-center justify-center holographic">
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(box.rarity)} opacity-20`}></div>
                <div className="relative z-10">
                  <span className="text-9xl float-3d">{box.icon || '🎁'}</span>
                </div>
                {/* Glow rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-40 h-40 rounded-full border-2 ${getRarityColor(box.rarity)} opacity-30 animate-ping`}></div>
                  <div className={`absolute w-56 h-56 rounded-full border ${getRarityColor(box.rarity)} opacity-20`} style={{ animation: 'pulse-ring 2s infinite' }}></div>
                </div>
                {box.discount > 0 && (
                  <div className="absolute top-4 right-4 animated-border">
                    <div className="px-4 py-2 rounded-full bg-red-500 text-white font-bold animate-pulse">
                      -{box.discount}%
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className={`text-sm font-bold mb-2 ${getRarityColor(box.rarity)}`}>
                  {box.rarity === 'legendary' ? '👑 أسطوري' :
                   box.rarity === 'epic' ? '💜 ملحمي' :
                   box.rarity === 'rare' ? '💎 نادر' : '🟢 شائع'}
                </div>
                <h3 className="text-2xl font-bold mb-2">{box.name}</h3>
                <p className="text-gray-400 mb-4">{box.description}</p>

                {/* Prize Preview - 3D Cards */}
                <div className="flex gap-2 mb-6 justify-center">
                  {[1,2,3,4].map((_, i) => (
                    <div
                      key={i}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${getRarityGradient(box.rarity)} float-3d`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <span className="text-2xl">{
                        box.rarity === 'legendary' ? '👑' :
                        box.rarity === 'epic' ? '💜' :
                        box.rarity === 'rare' ? '💎' : '🎁'
                      }</span>
                    </div>
                  ))}
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold shimmer-text">{box.cost}</span>
                    <span className="text-2xl">🪙</span>
                  </div>
                  <button
                    onClick={() => openBox(box._id)}
                    disabled={opening}
                    className={`btn-3d px-8 py-4 rounded-xl font-bold text-lg ${
                      opening
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400'
                    }`}
                  >
                    {opening ? 'جاري الفتح...' : '🎁 فتح'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Opening Animation Modal */}
      {opening && (
        <div className="modal-premium">
          <div className="text-center">
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Animated rings */}
              <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-4 border-4 border-amber-500/50 rounded-full animate-pulse"></div>
              <div className="absolute inset-8 border-4 border-amber-500/70 rounded-full"></div>
              
              {/* Spinning box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl animate-spin">🎁</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold shimmer-text mb-4">جاري فتح الصندوق...</h2>
            <p className="text-gray-400">تمنى لك حظاً موفقاً!</p>
            <div className="loading-dots mt-4">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div className="modal-premium">
          <div className="modal-content holographic">
            <div className="text-8xl mb-6 prize-reveal">🎉</div>
            <h2 className="text-4xl font-bold mb-4 shimmer-text">تهانينا!</h2>
            <p className="text-gray-400 mb-6">لقد فزت بـ:</p>
            
            <div className={`bg-gradient-to-br ${getRarityGradient(result.prize?.rarity)} rounded-2xl p-8 mb-6`}>
              <div className="text-7xl mb-4 float-3d">
                {result.prize?.rarity === 'legendary' ? '👑' : '🎁'}
              </div>
              <div className="text-3xl font-bold mb-2">{result.prize?.name}</div>
              <div className="text-2xl text-white/80">قيمة: ${result.prize?.value}</div>
            </div>

            <div className="glass-premium p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">الرصيد المتبقي:</span>
                <span className="text-3xl font-bold shimmer-text">{result.remainingPoints} 🪙</span>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="btn-3d btn-premium w-full text-xl"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  )
}