import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Boxes() {
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/boxes')
      .then((res) => setBoxes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">الصناديق</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <div key={box._id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-6xl">
              🎁
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{box.name}</h3>
              <p className="text-gray-400 mb-4">{box.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-purple-500">{box.price}</span>
                <span className="text-green-500">{box.winChance}% فرصة</span>
              </div>
              <Link
                to={`/open-box/${box._id}`}
                className="block w-full bg-purple-600 text-center py-3 rounded hover:bg-purple-700"
              >
                فتح الصندوق
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
