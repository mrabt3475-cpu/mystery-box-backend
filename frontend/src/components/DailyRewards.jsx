import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/dailyRewards.css'

export default function DailyRewards() {
  const [status, setStatus] = useState(null)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await api.get('/daily-rewards/status')
      setStatus(res.data)
    } catch (err) {
      setStatus({
        streak: 5,
        currentDay: 5,
        canClaim: true,
        totalClaimed: 200,
        rewards: [
          { day: 1, claimed: true },
          { day: 2, claimed: true },
          { day: 3, claimed: true },
          { day: 4, claimed: true },
          { day: 5, claimed: false },
          { day: 6, claimed: false },
          { day: 7, claimed: false },
        ]
      })
    }
  }

  const claimReward = async () => {
    if (!status?.canClaim) return
    
    setClaiming(true)
    try {
      const res = await api.post('/daily-rewards/claim')
      setStatus(res.data)
    } catch (err) {
      alert('حدث خطأ')
    } finally {
      setClaiming(false)
    }
  }

  const getRewardForDay = (day) => {
    const rewards = {
      1: 10, 2: 20, 3: 30, 4: 40, 5: 50,
      6: 60, 7: 100, 8: 70, 9: 80, 10: 90,
      11: 100, 12: 110, 13: 120, 14: 200
    }
    return rewards[day] || 10
  }

  if (!status) return <div className="loading">جاري التحميل...</div>

  return (
    <div className="daily-rewards">
      <div className="rewards-header">
        <h2>🎁 المكافآت اليومية</h2>
        <div className="streak-counter">
          <span>🔥</span>
          <span className="streak-number">{status.streak}</span>
          <span className="streak-label">أيام متتالية</span>
        </div>
      </div>

      <div className="calendar">
        {status.rewards?.slice(0, 7).map((day, index) => (
          <div 
            key={index} 
            className={`calendar-day ${day.claimed ? 'claimed' : ''} ${index + 1 === status.currentDay ? 'current' : ''}`}
          >
            <span className="day-number">{index + 1}</span>
            <span className="day-reward">{getRewardForDay(index + 1)}</span>
            {day.claimed && <span className="check">✓</span>}
          </div>
        ))}
      </div>

      {status.canClaim ? (
        <button 
          className="claim-button" 
          onClick={claimReward}
          disabled={claiming}
        >
          {claiming ? '...' : `🤑 للمكافأة: ${getRewardForDay(status.currentDay)} نقطة`}
        </button>
      ) : (
        <div className="next-claim">
          <span>⏰</span>
          <span>المكافأة التالية متاحة غداً</span>
        </div>
      )}

      <div className="total-earned">
        <span>إجمالي المكتسب:</span>
        <span className="total-points">{status.totalClaimed} 🪙</span>
      </div>
    </div>
  )
}
