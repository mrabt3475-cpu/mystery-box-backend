import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Boxes() {
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchBoxes()
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

  const openBox = async (boxId) => {
    if (opening) return
    setOpening(true)
    setResult(null)

    try {
      const res = await api.post(`/boxes/${boxId}/open`)
      setResult(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ')
    } finally {
      setOpening(false)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-600 to-orange-500 border-yellow-400'
      case 'epic': return 'from-purple-600 to-pink-500 border-purple-400'
      case 'rare': return 'from-blue-600 to-cyan-500 border-blue-400'
      case 'uncommon': return 'from-green-600 to-emerald-500 border-green-400'
      default: return 'from-gray-600 to-gray-500 border-gray-400'
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🎁 الصناديق</h1>
          <p className="text-gray-400">افتح صناديق واستلم جوائز مجانية!</p>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Points Info */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200">رصيدك من النقاط</p>
            <p className="text-4xl font-bold text-yellow-400">🪙 1,250</p>
          </div>
          <div className="text-right">
            <p className="text-purple-200">نقاط من المشتريات</p>
            <p className="text-2xl font-bold">+50 لكل $10</p>
          </div>
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-3 gap-6">
        {boxes.map((box) => (
          <div key={box._id} className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            {/* Box Image */}
            <div className={`h-48 bg-gradient-to-br ${getRarityColor(box.rarity)} flex items-center justify-center relative`}>
              <div className="text-8xl animate-pulse">{box.icon || '🎁'}</div>
              {box.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  -{box.discount}%
                </div>
              )}
            </div>

            {/* Box Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{box.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{box.description}</p>

              {/* Prize Preview */}
              <div className="flex gap-2 mb-4">
                {box.prizes?.slice(0, 3).map((prize, i) => (
                  <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    prize.rarity === 'legendary' ? 'bg-yellow-600' :
                    prize.rarity === 'epic' ? 'bg-purple-600' : 'bg-gray-600'
                  }`}>
                    {prize.rarity === 'legendary' ? '👑' : '🎁'}
                  </div>
                ))}
                {box.prizes?.length > 3 && (
                  <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-sm">
                    +{box.prizes.length - 3}
                  </div>
                )}
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-yellow-400">{box.cost}</span>
                  <span className="text-gray-400 mr-1">نقطة</span>
                </div>
                <button
                  onClick={() => openBox(box._id)}
                  disabled={opening}
                  className={`px-6 py-3 rounded-xl font-bold transition ${
                    opening
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
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
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">لا توجد صناديق متاحة</h2>
          <p className="text-gray-400">تحقق لاحقاً!</p>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">تهانينا!</h2>
            <p className="text-gray-400 mb-6">لقد فزت بـ:</p>
            
            <div className={`bg-gradient-to-br ${getRarityColor(result.prize?.rarity)} rounded-2xl p-6 mb-6`}>
              <div className="text-5xl mb-2">{result.prize?.rarity === 'legendary' ? '👑' : '🎁'}</div>
              <div className="text-2xl font-bold">{result.prize?.name}</div>
              <div className="text-yellow-300">قيمة: ${result.prize?.value}</div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  )
}