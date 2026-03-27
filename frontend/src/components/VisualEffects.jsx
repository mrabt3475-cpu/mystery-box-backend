import { useEffect, useRef } from 'react'
import { useVFX } from '../context/VFXContext'

export default function VisualEffects() {
  const { effects, screenShake, flash } = useVFX()

  return (
    <>
      {/* Screen Shake */}
      {screenShake && <ScreenShake />}
      
      {/* Flash Effect */}
      {flash && <Flash color={flash} />}
      
      {/* Render all active effects */}
      {effects.map(effect => {
        switch (effect.type) {
          case 'confetti':
            return <Confetti key={effect.id} {...effect} />
          case 'fireworks':
            return <Fireworks key={effect.id} {...effect} />
          case 'particles':
            return <ParticleBurst key={effect.id} {...effect} />
          case 'glow':
            return <GlowEffect key={effect.id} {...effect} />
          case 'portal':
            return <PortalEffect key={effect.id} {...effect} />
          case 'sparkle':
            return <Sparkles key={effect.id} {...effect} />
          case 'matrix':
            return <MatrixRain key={effect.id} {...effect} />
          default:
            return null
        }
      })}
    </>
  )
}

// Screen Shake Effect
function ScreenShake() {
  return (
    <style>{`
      @keyframes shake {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-10px, -10px); }
        20% { transform: translate(10px, 10px); }
        30% { transform: translate(-10px, 10px); }
        40% { transform: translate(10px, -10px); }
        50% { transform: translate(-5px, 5px); }
        60% { transform: translate(5px, -5px); }
        70% { transform: translate(-5px, -5px); }
        80% { transform: translate(5px, 5px); }
        90% { transform: translate(-2px, 2px); }
      }
      .shake-effect {
        animation: shake 0.5s ease-in-out;
      }
    `}</style>
  )
}

// Flash Effect
function Flash({ color }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: color,
      opacity: 0.3,
      pointerEvents: 'none',
      zIndex: 9999,
      animation: 'flash 0.2s ease-out forwards',
    }}>
      <style>{`
        @keyframes flash {
          0% { opacity: 0.5; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// Confetti Effect
function Confetti({ count = 100, duration = 4000 }) {
  const confettiRef = useRef([])
  const colors = ['#d4af37', '#8b5cf6', '#ec4899', '#06b6d4', '#22c55e', '#f43f5e']
  
  useEffect(() => {
    confettiRef.current = [...Array(count)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: duration / 1000 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      size: Math.random() * 10 + 5,
    }))
  }, [count, duration])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998, overflow: 'hidden' }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {confettiRef.current.map(c => (
        <div key={c.id} style={{
          position: 'absolute',
          left: `${c.x}%`,
          top: -20,
          width: c.size,
          height: c.size * 1.5,
          background: c.color,
          animation: `confetti-fall ${c.duration}s ease-in ${c.delay}s forwards`,
          borderRadius: '2px',
        }} />
      ))}
    </div>
  )
}

// Fireworks Effect
function Fireworks({ count = 5, duration = 3000 }) {
  const fireworksRef = useRef([])
  
  useEffect(() => {
    fireworksRef.current = [...Array(count)].map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
      delay: i * 0.5,
      color: ['#d4af37', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 4)],
    }))
  }, [count])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997 }}>
      <style>{`
        @keyframes firework {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes firework-particle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
      {fireworksRef.current.map(fw => (
        <div key={fw.id} style={{
          position: 'absolute',
          left: `${fw.x}%`,
          top: `${fw.y}%`,
        }}>
          {/* Main explosion */}
          <div style={{
            position: 'absolute',
            width: 200,
            height: 200,
            marginLeft: -100,
            marginTop: -100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${fw.color}40 0%, transparent 70%)`,
            animation: `firework 1s ease-out ${fw.delay}s forwards`,
          }} />
          {/* Particles */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const distance = 50 + Math.random() * 50
            return (
              <div key={i} style={{
                position: 'absolute',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: fw.color,
                '--tx': `${Math.cos(angle) * distance}px`,
                '--ty': `${Math.sin(angle) * distance}px`,
                animation: `firework-particle 1s ease-out ${fw.delay}s forwards`,
              }} />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// Particle Burst Effect
function ParticleBurst({ count = 50, colors = ['#d4af37', '#8b5cf6'], duration = 3000 }) {
  const particlesRef = useRef([])
  
  useEffect(() => {
    particlesRef.current = [...Array(count)].map((_, i) => ({
      id: i,
      angle: (i / count) * Math.PI * 2,
      distance: 100 + Math.random() * 200,
      delay: Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }))
  }, [count, colors])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9996 }}>
      <style>{`
        @keyframes particle-burst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        {particlesRef.current.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            '--tx': `${Math.cos(p.angle) * p.distance}px`,
            '--ty': `${Math.sin(p.angle) * p.distance}px`,
            animation: `particle-burst ${duration/1000}s ease-out ${p.delay}s forwards`,
          }} />
        ))}
      </div>
    </div>
  )
}

// Glow Effect
function GlowEffect({ color = '#d4af37', duration = 2000 }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `radial-gradient(circle at 50% 50%, ${color}30 0%, transparent 50%)`,
      pointerEvents: 'none',
      zIndex: 9995,
      animation: `glow-pulse ${duration/1000}s ease-out forwards`,
    }}>
      <style>{`
        @keyframes glow-pulse {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}

// Portal Effect
function PortalEffect({ duration = 2000 }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9994,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes portal-rotate {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          50% { transform: rotate(180deg) scale(1); opacity: 1; }
          100% { transform: rotate(360deg) scale(2); opacity: 0; }
        }
        @keyframes portal-spiral {
          0% { transform: rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: rotate(720deg) translateX(200px); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 100,
        height: 100,
        marginLeft: -50,
        marginTop: -50,
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #d4af37, #8b5cf6, #d4af37)',
        animation: 'portal-rotate 2s ease-in-out forwards',
      }} />
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: '50%',
          background: i % 2 === 0 ? '#d4af37' : '#8b5cf6',
          animation: `portal-spiral 2s ease-in-out ${i * 0.1}s forwards`,
        }} />
      ))}
    </div>
  )
}

// Sparkles Effect
function Sparkles({ count = 10, duration = 1000 }) {
  const sparklesRef = useRef([])
  
  useEffect(() => {
    sparklesRef.current = [...Array(count)].map((_, i) => ({
      id: i,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      delay: Math.random() * 0.5,
    }))
  }, [count])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9993 }}>
      <style>{`
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {sparklesRef.current.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          fontSize: 24,
          animation: `sparkle ${duration/1000}s ease-out ${s.delay}s forwards`,
        }}>✨</div>
      ))}
    </div>
  )
}

// Matrix Rain Effect
function MatrixRain({ duration = 3000 }) {
  const columnsRef = useRef([])
  
  useEffect(() => {
    columnsRef.current = [...Array(30)].map((_, i) => ({
      id: i,
      left: (i / 30) * 100,
      chars: [...Array(20)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
    }))
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      pointerEvents: 'none',
      zIndex: 9992,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
      {columnsRef.current.map(col => (
        <div key={col.id} style={{
          position: 'absolute',
          left: `${col.left}%`,
          top: 0,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#0f0',
          textShadow: '0 0 5px #0f0',
          animation: `matrix-fall ${duration/1000}s linear forwards`,
          opacity: 0.7,
        }}>
          {col.chars.map((char, i) => (
            <div key={i} style={{ 
              color: i === 0 ? '#fff' : '#0f0',
              textShadow: i === 0 ? '0 0 10px #fff' : '0 0 5px #0f0',
            }}>{char}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
