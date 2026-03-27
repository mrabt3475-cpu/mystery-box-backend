import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function Profile() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [rewards, setRewards] = useState([])

  useEffect(() => {
    api.get('/users/stats').then((res) => setStats(res.data))
    api.get('/rewards').then((res) => setRewards(res.data))
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">الملف الشخصي</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-2xl font-bold">{user?.username}</div>
            <div className="text-gray-400">{user?.email}</div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.totalBoxesOpened}</div>
            <div className="text-gray-400">صناديق مفتوحة</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-500">{stats.totalWins}</div>
            <div className="text-gray-400">مكاسب</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.currentStreak}</div>
            <div className="text-gray-400">السلسلة</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.winRate}%</div>
            <div className="text-gray-400">نسبة الفوز</div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">مكاسبك</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div key={reward._id} className="bg-gray-800 p-4 rounded-lg">
            <div className="font-bold">{reward.name}</div>
            <div className="text-gray-400 text-sm">{reward.description}</div>
            <div className="text-purple-500 mt-2">{reward.value} نقطة</div>
          </div>
        ))}
      </div>
    </div>
  )
}
