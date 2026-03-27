import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getCardStyle = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-600 to-yellow-800 border-2 border-yellow-400'
    if (index === 1) return 'bg-gradient-to-r from-gray-500 to-gray-700 border-2 border-gray-400'
    if (index === 2) return 'bg-gradient-to-r from-amber-700 to-amber-900 border-2 border-amber-600'
    return 'bg-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🏆 الترتيب</h1>
          <p className="text-gray-400">أفضل اللاعبين</p>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'daily', label: 'اليوم' },
          { id: 'weekly', label: 'الأسبوع' },
          { id: 'monthly', label: 'الشهر' },
          { id: 'all', label: 'كل الوقت' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-6 py-2 rounded-xl font-bold transition ${
              period === p.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <div className="flex justify-center gap-4 mb-8">
        {/* 2nd Place */}
        {leaders[1] && (
          <div className={`w-48 rounded-2xl p-6 text-center ${getCardStyle(1)}`}>
            <div className="text-4xl mb-2">🥈</div>
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
              {leaders[1].username?.charAt(0)}
            </div>
            <div className="font-bold">{leaders[1].username}</div>
            <div className="text-yellow-300 font-bold">{leaders[1].totalWinnings}</div>
          </div>
        )}

        {/* 1st Place */}
        {leaders[0] && (
          <div className={`w-56 rounded-2xl p-6 text-center ${getCardStyle(0)} transform scale-110`}>
            <div className="text-5xl mb-2">👑</div>
            <div className="w-20 h-20 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-3xl font-bold mb-2">
              {leaders[0].username?.charAt(0)}
            </div>
            <div className="font-bold text-xl">{leaders[0].username}</div>
            <div className="text-yellow-300 font-bold text-lg">{leaders[0].totalWinnings}</div>
          </div>
        )}

        {/* 3rd Place */}
        {leaders[2] && (
          <div className={`w-48 rounded-2xl p-6 text-center ${getCardStyle(2)}`}>
            <div className="text-4xl mb-2">🥉</div>
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
              {leaders[2].username?.charAt(0)}
            </div>
            <div className="font-bold">{leaders[2].username}</div>
            <div className="text-yellow-300 font-bold">{leaders[2].totalWinnings}</div>
          </div>
        )}
      </div>

      {/* Rest of Leaderboard */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-right">#</th>
              <th className="p-4 text-right">اللاعب</th>
              <th className="p-4 text-right">الصناديق</th>
              <th className="p-4 text-right">المكاسب</th>
              <th className="p-4 text-right">القيمة</th>
            </tr>
          </thead>
          <tbody>
            {leaders.slice(3).map((leader, i) => (
              <tr key={leader._id} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-4 font-bold text-gray-400">{getMedal(i + 3)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                      {leader.username?.charAt(0)}
                    </div>
                    <span className="font-bold">{leader.username}</span>
                  </div>
                </td>
                <td className="p-4">{leader.totalBoxes || 0}</td>
                <td className="p-4">{leader.totalWins || 0}</td>
                <td className="p-4 text-yellow-400 font-bold">${leader.totalWinnings || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}