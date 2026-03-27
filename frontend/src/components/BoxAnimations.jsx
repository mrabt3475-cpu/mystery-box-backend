// Box Opening Animation Component
// ============================

import React, { useState, useEffect } from 'react'
import '../styles/boxOpeningDesign.css'

const rarityColors = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

const rarityGlows = {
  common: 'rgba(156, 163, 175, 0.3)',
  uncommon: 'rgba(34, 197, 94, 0.3)',
  rare: 'rgba(59, 130, 246, 0.3)',
  epic: 'rgba(168, 85, 247, 0.3)',
  legendary: 'rgba(245, 158, 11, 0.5)',
}

export function BoxOpeningAnimation({ box, onComplete, isOpening }) {
  const [phase, setPhase] = useState('idle') // idle, shaking, revealing, complete
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (isOpening) {
      startOpening()
    }
  }, [isOpening])

  const startOpening = () => {
    setPhase('shaking')
    setResult(null)

    // Shaking phase
    setTimeout(() => {
      setPhase('revealing')
    }, 2000)

    // Reveal result
    setTimeout(() => {
      setResult({
        name: 'آيفون 15 برو ماكس',
        rarity: 'legendary',
        value: 5000,
        image: '📱',
      })
      setPhase('complete')
    }, 3500)
  }

  const handleClose = () => {
    setPhase('idle')
    setResult(null)
    onComplete?.()
  }

  return (
    <div className="box-opening-wrapper">
      {/* Box Display */}
      <div className={`box-display-container ${phase}`}>
        <div className="box-glow-effect" style={{
          background: result ? `radial-gradient(circle, ${rarityGlows[result.rarity]} 0%, transparent 70%)` : 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)'
        }} />
        
        <div className={`box-3d ${phase === 'shaking' ? 'shaking' : ''}`}>
          <div className="box-front">
            <span className="box-emoji">{box?.icon || '🎁'}</span>
          </div>
        </div>

        {phase === 'revealing' && (
          <div className="reveal-flash" />
        )}
      </div>

      {/* Progress Indicator */}
      {phase === 'shaking' && (
        <div className="opening-progress">
          <div className="progress-dots">
            <span className="dot active"></span>
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
          <p>جاري فتح الصندوق...</p>
        </div>
      )}

      {/* Result Modal */}
      {phase === 'complete' && result && (
        <div className="result-modal-overlay">
          <div className="result-modal">
            <div className="result-glow" style={{
              background: `radial-gradient(circle, ${rarityGlows[result.rarity]} 0%, transparent 70%)`
            }} />
            
            <div className="result-content">
              <div className="result-rarity-badge" style={{
                background: rarityColors[result.rarity]
              }}>
                {result.rarity === 'legendary' ? '👑 أسطوري' : 
                 result.rarity === 'epic' ? '💎 إيبك' :
                 result.rarity === 'rare' ? '⭐ رير' : 'عادي'}
              </div>

              <div className="result-image" style={{
                textShadow: `0 0 30px ${rarityColors[result.rarity]}`
              }}>
                {result.image}
              </div>

              <h2 className="result-name">{result.name}</h2>
              
              <div className="result-value">
                <span className="value-icon">💰</span>
                <span className="value-amount">{result.value.toLocaleString()}</span>
              </div>

              <div className="result-actions">
                <button className="btn-claim" onClick={handleClose}>
                  استلام الجائزة
                </button>
                <button className="btn-again" onClick={startOpening}>
                  فتح آخر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Prize Pool Component
export function PrizePool({ prizes }) {
  const defaultPrizes = [
    { id: 1, name: 'آيفون', rarity: 'legendary', icon: '📱' },
    { id: 2, name: 'ساعة', rarity: 'epic', icon: '⌚' },
    { id: 3, name: 'لابتوب', rarity: 'rare', icon: '💻' },
    { id: 4, name: 'سماعات', rarity: 'uncommon', icon: '🎧' },
    { id: 5, name: 'كفر', rarity: 'common', icon: '📱' },
    { id: 6, name: 'شاحن', rarity: 'common', icon: '🔌' },
  ]

  const displayPrizes = prizes || defaultPrizes

  return (
    <div className="prize-pool-container">
      <h3 className="prize-pool-title">جوائز الصندوق</h3>
      <div className="prize-pool-grid">
        {displayPrizes.map((prize) => (
          <div 
            key={prize.id} 
            className={`prize-pool-item ${prize.rarity}`}
            title={prize.name}
          >
            <span className="prize-icon">{prize.icon}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Odds Display
export function OddsDisplay({ odds }) {
  const defaultOdds = [
    { rarity: 'legendary', chance: 1, color: '#f59e0b' },
    { rarity: 'epic', chance: 4, color: '#a855f7' },
    { rarity: 'rare', chance: 10, color: '#3b82f6' },
    { rarity: 'uncommon', chance: 25, color: '#22c55e' },
    { rarity: 'common', chance: 60, color: '#9ca3af' },
  ]

  const displayOdds = odds || defaultOdds

  return (
    <div className="odds-display">
      <h4>نسب الفوز</h4>
      <div className="odds-bars">
        {displayOdds.map((odd) => (
          <div key={odd.rarity} className="odds-bar-item">
            <div className="odds-info">
              <span 
                className="odds-dot" 
                style={{ background: odd.color }}
              />
              <span className="odds-label">
                {odd.rarity === 'legendary' ? '👑 أسطوري' :
                 odd.rarity === 'epic' ? '💎 إيبك' :
                 odd.rarity === 'rare' ? '⭐ رير' :
                 odd.rarity === 'uncommon' ? '🟢 غير عادي' : '⚪ عادي'}
              </span>
            </div>
            <div className="odds-bar-container">
              <div 
                className="odds-bar-fill" 
                style={{ 
                  width: `${odd.chance}%`,
                  background: odd.color 
                }}
              />
            </div>
            <span className="odds-percent">{odd.chance}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default { BoxOpeningAnimation, PrizePool, OddsDisplay }
