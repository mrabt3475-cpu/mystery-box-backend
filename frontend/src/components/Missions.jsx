import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/missions.css'

export default function Missions() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    try {
      const res = await api.get('/missions')
      setMissions(res.data)
    } catch (err) {
      // Mock data
      setMissions([
        { _id: '1', missionId: 'open_3_boxes', type: 'open_boxes', target: 3, progress: 2, completed: false, reward: { type: 'points', amount: 50 } },
        { _id: '2', missionId: 'win_rare', type: 'win_rarity', target: 1, progress: 0, completed: false, reward: { type: 'points', amount: 75 } },
        { _id: '3', missionId: 'spend_500_points', type: 'spend_points', target: 500, progress: 350, completed: false, reward: { type: 'points', amount: 50 } },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getMissionIcon = (type) => {
    switch (type) {
      case 'open_boxes': return '🎁'
      case 'win_rarity': return '🏆'
      case 'spend_points': return '🪙'
      case 'refer_friends': return '👥'
      default: return '⭐'
    }
  }

  const getMissionTitle = (missionId) => {
    switch (missionId) {
      case 'open_3_boxes': return 'افتح 3 صناديق'
      case 'open_5_boxes': return 'افتح 5 صناديق'
      case 'win_rare': return 'اربح عنصر Rare'
      case 'win_epic': return 'اربح عنصر Epic'
      case 'spend_500_points': return 'أنفق 500 نقطة'
      default: return missionId
    }
  }

  const getProgressPercent = (mission) => {
    return Math.min(100, (mission.progress / mission.target) * 100)
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div className="missions-container">
      <h2 className="missions-title">🎯 المهام اليومية</h2>
      
      <div className="missions-grid">
        {missions.map((mission) => (
          <div key={mission._id} className={`mission-card ${mission.completed ? 'completed' : ''}`}>
            <div className="mission-icon">{getMissionIcon(mission.type)}</div>
            
            <div className="mission-info">
              <h3>{getMissionTitle(mission.missionId)}</h3>
              
              <div className="mission-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercent(mission)}%` }}
                  />
                </div>
                <span className="progress-text">
                  {mission.progress} / {mission.target}
                </span>
              </div>
            </div>

            <div className="mission-reward">
              <span className="reward-icon">🪙</span>
              <span className="reward-amount">+{mission.reward.amount}</span>
            </div>

            {mission.completed && (
              <div className="mission-complete-badge">✅</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
