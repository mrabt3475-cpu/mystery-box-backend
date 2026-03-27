import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/levelProgress.css'

export default function LevelProgress() {
  const [levelInfo, setLevelInfo] = useState(null)

  useEffect(() => {
    fetchLevelInfo()
  }, [])

  const fetchLevelInfo = async () => {
    try {
      const res = await api.get('/users/level')
      setLevelInfo(res.data)
    } catch (err) {
      setLevelInfo({
        level: 5,
        title: 'خبير',
        xp: 750,
        totalXp: 1250,
        currentLevelXp: 500,
        nextLevelXp: 1000,
        progress: 50,
        benefits: { discount: 5, extraPoints: 10, exclusiveBoxes: false },
        levelConfig: {
          1: { title: 'مبتدئ', minXp: 0 },
          2: { title: 'متدرب', minXp: 100 },
          3: { title: 'لاعب', minXp: 250 },
          4: { title: 'محترف', minXp: 500 },
          5: { title: 'خبير', minXp: 1000 },
          10: { title: 'VIP', minXp: 12000 },
        }
      })
    }
  }

  const getLevelTitle = (level) => {
    const titles = {
      1: 'مبتدئ', 2: 'متدرب', 3: 'لاعب', 4: 'محترف',
      5: 'خبير', 6: 'ماستر', 7: 'أسطوري', 8: 'محظوظ',
      9: 'مميز', 10: 'VIP', 15: 'Diamond',
      20: 'Platinum', 30: 'Elite', 50: 'Legend', 100: 'God'
    }
    return titles[level] || `Level ${level}`
  }

  const getLevelColor = (level) => {
    if (level >= 50) return '#ffd700'
    if (level >= 20) return '#a855f7'
    if (level >= 10) return '#3b82f6'
    if (level >= 5) return '#22c55e'
    return '#888'
  }

  if (!levelInfo) return null

  return (
    <div className="level-progress">
      <div className="level-header">
        <div className="level-badge" style={{ borderColor: getLevelColor(levelInfo.level) }}>
          <span className="level-number">{levelInfo.level}</span>
          <span className="level-title">{levelInfo.title}</span>
        </div>
        <div className="level-xp">
          <span className="xp-current">{levelInfo.xp}</span>
          <span className="xp-divider">/</span>
          <span className="xp-next">{levelInfo.nextLevelXp || 'MAX'}</span>
          <span className="xp-label">XP</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="xp-progress-bar">
          <div 
            className="xp-progress-fill" 
            style={{ 
              width: `${levelInfo.progress}%`,
              background: `linear-gradient(90deg, ${getLevelColor(levelInfo.level)}, ${getLevelColor(levelInfo.level + 1)})`
            }}
          />
        </div>
      </div>

      <div className="level-benefits">
        {levelInfo.benefits.discount > 0 && (
          <div className="benefit">
            <span>🏷️</span>
            <span>خصم {levelInfo.benefits.discount}%</span>
          </div>
        )}
        {levelInfo.benefits.extraPoints > 0 && (
          <div className="benefit">
            <span>🪙</span>
            <span>+{levelInfo.benefits.extraPoints} نقطة لكل عملية</span>
          </div>
        )}
        {levelInfo.benefits.exclusiveBoxes && (
          <div className="benefit">
            <span>🔒</span>
            <span>صناديق حصرية</span>
          </div>
        )}
      </div>

      <div className="level-tiers">
        {[1, 5, 10, 20, 50, 100].map(tier => (
          <div 
            key={tier} 
            className={`tier ${levelInfo.level >= tier ? 'unlocked' : ''}`}
          >
            <span className="tier-level">{tier}</span>
            <span className="tier-title">{getLevelTitle(tier)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
