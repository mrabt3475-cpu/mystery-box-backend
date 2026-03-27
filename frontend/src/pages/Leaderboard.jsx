import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('weekly')

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get(`/leaderboard?period=${period}`)
      setLeaders(res.data.leaders)
      setMyRank(res.data.myRank)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🏆排行榜 Leaderboard</h1>
        <div className="flex gap-2">
          {[
            { value: 'daily', label: 'اليوم' },
            { value: 'weekly', label: 'الأسبوع' },
            { value: 'monthly', label: 'الشهر' },
            { value: 'all', label: 'كل الوقت' },
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg ${period === p.value ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* My Rank */}
      {myRank && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-200">ترتيبك</div>
              <div className="text-4xl font-bold">#{myRank.rank}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">{myRank.username}</div>
              <div className="text-purple-200">{myRank.score} نقطة</div>
            </div>
            <div className="text-right">
              <div className="text-purple-200">فوز</div>
              <div className="text-4xl font-bold text-green-300">{myRank.wins}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {leaders.slice(0, 3).map((leader, i) => (
          <div 
            key={i} 
            className={`rounded-xl p-6 text-center ${
              i === 0 ? 'bg-yellow-900/50 border-2 border-yellow-500' :
              i === 1 ? 'bg-gray-600/50 border-2 border-gray-400' :
              'bg-orange-900/50 border-2 border-orange-500'
            }`}
          >
            <div className="text-4xl mb-2">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
            </div>
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold mb-2">
              {leader.username?.charAt(0).toUpperCase()}
            </div>
            <div className="font-bold">{leader.username}</div>
            <div className="text-2xl font-bold text-green-400">{leader.score}</div>
            <div className="text-gray-400 text-sm">{leader.wins} فوز</div>
          </div>
        ))}
      </div>

      {/* Rest of Leaderboard */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right">#</th>
              <th className="px-6 py-3 text-right">المستخدم</th>
              <th className="px-6 py-3 text-right">النقاط</th>
              <th className="px-6 py-3 text-right">الفوز</th>
            </tr>
          </thead>
          <tbody>
            {leaders.slice(3).map((leader, i) => (
              <tr key={i} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4 font-bold text-gray-400">{i + 4}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                      {leader.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold">{leader.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-green-400 font-bold">{leader.score}</td>
                <td className="px-6 py-4 text-gray-400">{leader.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}