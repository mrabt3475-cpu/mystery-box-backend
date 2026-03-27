import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function OpenBox() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [box, setBox] = useState(null)
  const [opening, setOpening] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    api.get(`/boxes/${id}`).then((res) => setBox(res.data))
  }, [id])

  const handleOpen = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setOpening(true)
    try {
      const { data } = await api.post('/boxes/open', { boxId: id })
      setResult(data)
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ')
    }
    setOpening(false)
  }

  if (!box) return <div className="text-center py-20">جاري التحميل...</div>

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8">{box.name}</h1>
      
      <div className={`bg-gray-800 rounded-full w-64 h-64 mx-auto mb-8 flex items-center justify-center text-8xl ${opening ? 'box-shake' : ''}`}>
        🎁
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <p className="text-gray-400 mb-4">{box.description}</p>
        <div className="flex justify-center gap-8">
          <div>
            <div className="text-2xl font-bold text-purple-500">{box.price}</div>
            <div className="text-gray-400">نقطة</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{box.winChance}%</div>
            <div className="text-gray-400">فرصة الفوز</div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8 animate-fadeIn">
          {result.isWin ? (
            <>
              <div className="text-4xl mb-4">🎉 تهانينا!</div>
              <div className="text-2xl font-bold">{result.prize?.name}</div>
              <div className="text-purple-500">قيمة: {result.prizeValue} نقطة</div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">😢 لم يحالفك الحظ</div>
              <p className="text-gray-400">حاول مرة أخرى!</p>
            </>
          )}
          <div className="mt-4 text-gray-500">
            رصيدك المتبقي: {result.remainingPoints} نقطة
          </div>
        </div>
      )}

      <button
        onClick={handleOpen}
        disabled={opening}
        className="bg-purple-600 px-12 py-4 rounded-lg text-xl hover:bg-purple-700 disabled:opacity-50"
      >
        {opening ? 'جاري الفتح...' : 'فتح الصندوق'}
      </button>
    </div>
  )
}
