import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Boxes() {
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState(false)
  const [result, setResult] = useState(null)
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    fetchBoxes()
    fetchPoints()
  }, [])

  const fetchBoxes = async () => {
    try {
      const res = await api.get('/boxes/active')
      setBoxes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPoints = async () => {
    try {
      const res = await api.get('/users/me')
      setUserPoints(res.data.points || 0)
    } catch (err) {
      console.error(err)
    }
  }

  const openBox = async (boxId) => {
    if (opening) return
    if (userPoints < boxes.find(b => b._id === boxId)?.cost) {
      alert('نقاط غير كافية! تسوق لتحصل على نقاط أكثر')
      return
    }
    
    setOpening(true)
    setResult(null)

    try {
      const res = await api.post(`/boxes/${boxId}/open`)
      setResult(res.data)
      setUserPoints(res.data.remainingPoints)
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ')
    } finally {
      setOpening(false)
    }
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

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="spinner-luxury"></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24">
      {/* Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
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
            <span className="gold-gradient">الصناديق</span>
          </h1>
          <p className="text-xl text-gray-400">افتح صناديق واستلم جوائز مجانية!</p>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Points Banner */}
      <div className="glass-card p-6 mb-12 glow-pulse">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">رصيدك من النقاط</p>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold gold-gradient">{userPoints.toLocaleString()}</span>
              <span className="text-2xl">🪙</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400">نقاط من المشتريات</p>
            <p className="text-2xl font-bold text-emerald-400">+5% من كل شراء</p>
          </div>
          <Link to="/shop" className="btn-premium">
            تسوق واكسب نقاط
          </Link>
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-3 gap-8">
        {boxes.map((box, index) => (
          <div
            key={box._id}
            className="box-card fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`box-image bg-gradient-to-br ${getRarityGradient(box.rarity)}`}>
              <div className="text-8xl spin">{box.icon || '🎁'}</div>
              {box.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                  -{box.discount}%
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{box.name}</h3>
              <p className="text-gray-400 mb-4">{box.description}</p>

              {/* Prize Preview */}
              <div className="flex gap-2 mb-6">
                {box.prizes?.slice(0, 4).map((prize, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      prize.rarity === 'legendary' ? 'rarity-legendary' :
                      prize.rarity === 'epic' ? 'rarity-epic' :
                      prize.rarity === 'rare' ? 'rarity-rare' :
                      prize.rarity === 'uncommon' ? 'rarity-uncommon' : 'rarity-common'
                    }`}
                  >
                    {prize.rarity === 'legendary' ? '👑' : prize.rarity === 'epic' ? '💜' : '🎁'}
                  </div>
                ))}
                {box.prizes?.length > 4 && (
                  <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-sm">
                    +{box.prizes.length - 4}
                  </div>
                )}
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold gold-gradient">{box.cost}</span>
                  <span className="text-xl">🪙</span>
                </div>
                <button
                  onClick={() => openBox(box._id)}
                  disabled={opening || userPoints < box.cost}
                  className={`btn-premium ${
                    userPoints < box.cost ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {opening ? 'جاري الفتح...' : 'فتح الصندوق'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {boxes.length === 0 && (
        <div className="text-center py-20">
          <div className="text-8xl mb-6 float">📦</div>
          <h2 className="text-3xl font-bold mb-4">لا توجد صناديق متاحة</h2>
          <p className="text-gray-400 mb-8">تحقق لاحقاً!</p>
          <Link to="/shop" className="btn-premium">
            تسوق لتحصل على نقاط
          </Link>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div className="modal-premium">
          <div className="modal-content">
            <div className="text-8xl mb-6 prize-reveal">🎉</div>
            <h2 className="text-3xl font-bold mb-4 gold-gradient">تهانينا!</h2>
            <p className="text-gray-400 mb-6">لقد فزت بـ:</p>
            
            <div className={`bg-gradient-to-br ${getRarityGradient(result.prize?.rarity)} rounded-2xl p-8 mb-6`}>
              <div className="text-6xl mb-4 prize-reveal">
                {result.prize?.rarity === 'legendary' ? '👑' :
                 result.prize?.rarity === 'epic' ? '💜' : '🎁'}
              </div>
              <div className="text-3xl font-bold mb-2">{result.prize?.name}</div>
              <div className="text-2xl text-white/80">قيمة: ${result.prize?.value || 0}</div>
            </div>

            <div className="glass-card p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">الرصيد المتبقي:</span>
                <span className="text-2xl font-bold gold-gradient">{result.remainingPoints} 🪙</span>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="btn-premium w-full"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  )
}