import { useSound } from '../context/SoundContext'

export default function SoundController() {
  const { muted, toggleMute, volume, setVolume, soundsLoaded } = useSound()

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleMute()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleMute])

  return null // This component just handles sound logic
}

// Sound Button Component
export function SoundButton({ className = '' }) {
  const { muted, toggleMute, volume, setVolume, soundsLoaded } = useSound()

  return (
    <div className={`sound-controls ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={toggleMute}
        className="glass-premium p-2 rounded-full hover:bg-white/10 transition"
        title={muted ? 'تشغيل الصوت (M)' : 'كتم الصوت (M)'}
        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      
      {!muted && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
          style={{
            width: '80px',
            accentColor: '#d4af37',
            cursor: 'pointer',
          }}
          title={`الصوت: ${Math.round(volume * 100)}%`}
        />
      )}
      
      {/* Sound indicators */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {Object.values(soundsLoaded).some(v => v) ? (
          <span style={{ fontSize: '12px' }}>✅</span>
        ) : (
          <span style={{ fontSize: '12px' }}>⏳</span>
        )}
      </div>
    </div>
  )
}

// Sound wrapper for clickable elements
export function SoundClick({ children, sound = 'click', onClick, className = '', ...props }) {
  const { playSound, muted } = useSound()

  const handleClick = (e) => {
    if (!muted) playSound(sound)
    if (onClick) onClick(e)
  }

  return (
    <div onClick={handleClick} className={className} style={{ cursor: 'pointer' }} {...props}>
      {children}
    </div>
  )
}

// Sound wrapper for hoverable elements
export function SoundHover({ children, sound = 'hover', className = '', ...props }) {
  const { playSound, muted } = useSound()

  const handleMouseEnter = () => {
    if (!muted) playSound(sound)
  }

  return (
    <div onMouseEnter={handleMouseEnter} className={className} {...props}>
      {children}
    </div>
  )
}

import { useEffect } from 'react'
