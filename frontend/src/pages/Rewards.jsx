import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Rewards() {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRewards()
  }, [filter])

  const fetchRewards = async () => {
    try {
      const params = filter !== 'all' ? `?type=${filter}` : ''
      const res = await api.get(`/rewards${params}`)
      setRewards(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const claimReward = async (rewardId) => {
    try {
      await api.post(`/rewards/${rewardId}/claim`)
      fetchRewards()
      alert('تم استلام المكافأة!')
    } catch (err) {
      alert(err.response?.data?.message || 'خطأ في الاستلام')
    }
  }

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-500 bg-gray-900',
      uncommon: 'border-green-500 bg-green-900',
      rare: 'border-blue-500 bg-blue-900',
      epic: 'border-purple-500 bg-purple-900',
      legendary: 'border-yellow-500 bg-yellow-900',
    }
    return colors[rarity] || colors.common
  }

  const getRarityText = (rarity) => {
    const texts = {
      common: 'شائع',
      uncommon: 'غير شائع',
      rare: 'نادر',
      epic: 'ملحمي',
      legendary: 'أسطوري',
    }
    return texts[rarity] || rarity
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎁 مكافآتي</h1>
        <div className="flex gap-2">
          {['all', 'available', 'claimed', 'expired'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${filter === f ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              {f === 'all' ? 'الكل' : f === 'available' ? 'متاحة' : f === 'claimed' ? 'مستلمة' : 'منتهية'}
            </button>
          ))}
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-xl font-bold mb-2">لا توجد مكافآت</h2>
          <p className="text-gray-400">افتح صناديق للحصول على مكافآت!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {rewards.map(reward => (
            <div 
              key={reward._id} 
              className={`rounded-xl p-6 border-2 ${getRarityColor(reward.rarity)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{reward.icon || '🎁'}</div>
                <span className={`px-3 py-1 rounded-full text-xs ${reward.status === 'available' ? 'bg-green-600' : 'bg-gray-600'}`}>
                  {reward.status === 'available' ? 'متاح' : reward.status === 'claimed' ? 'مستلم' : 'منتهي'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{reward.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
              
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-gray-400">النوع:</span>
                <span>{reward.type}</span>
              </div>
              
              {reward.value && (
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-400">القيمة:</span>
                  <span className="text-green-400 font-bold">{reward.value}</span>
                </div>
              )}

              {reward.expiresAt && (
                <div className="text-sm text-gray-500 mb-4">
                  ينتهي: {new Date(reward.expiresAt).toLocaleDateString('ar')}
                </div>
              )}

              {reward.status === 'available' && (
                <button
                  onClick={() => claimReward(reward._id)}
                  className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 font-bold"
                >
                  استلام
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}