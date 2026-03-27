// Interactive Effects Hook
// =======================

import { useState, useEffect, useCallback, useRef } from 'react'

// Mouse Position Hook
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}

// Click Sound Hook
export function useSound() {
  const playSound = useCallback((type) => {
    // Placeholder for sound effects
    // In production, use Howler.js or Web Audio API
    const sounds = {
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      win: '/sounds/win.mp3',
      open: '/sounds/open.mp3',
    }
    
    // console.log(`Playing sound: ${type}`)
  }, [])

  return { playSound }
}

// Ripple Effect Hook
export function useRipple() {
  const [ripples, setRipples] = useState([])

  const addRipple = useCallback((e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ripple = { id: Date.now(), x, y }

    setRipples((prev) => [...prev, ripple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
    }, 600)
  }, [])

  return { ripples, addRipple }
}

// Intersection Observer Hook for Scroll Animations
export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return [ref, isInView]
}

// Parallax Effect Hook
export function useParallax() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return offset
}

// Tilt Effect Hook
export function useTilt() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setRotation({ x: rotateX, y: rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 })
  }, [])

  return { ref, rotation, handleMouseMove, handleMouseLeave }
}

// Confetti Effect
export function Confetti({ active, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (active) {
      const colors = ['#d4af37', '#8b5cf6', '#22c55e', '#ef4444', '#3b82f6']
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 5 + 2,
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      }))

      setParticles(newParticles)

      const interval = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              y: p.y + p.speed,
              x: p.x + Math.sin(p.y / 50) * 2,
              rotation: p.rotation + p.rotationSpeed,
            }))
            .filter((p) => p.y < window.innerHeight + 50)
        )
      }, 16)

      setTimeout(() => {
        clearInterval(interval)
        setParticles([])
        onComplete?.()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [active, onComplete])

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

// Particle System
export function ParticleField({ active, type = 'sparkle' }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / 30,
        radius: 0,
        size: Math.random() * 4 + 2,
        color: type === 'win' ? '#d4af37' : '#8b5cf6',
      }))

      setParticles(newParticles)

      const interval = setInterval(() => {
        setParticles((prev) =>
          prev.map((p) => ({
            ...p,
            radius: p.radius + 3,
            opacity: 1 - p.radius / 200,
          })).filter((p) => p.radius < 200)
        )
      }, 16)

      setTimeout(() => {
        clearInterval(interval)
        setParticles([])
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [active, type])

  return (
    <div className="particle-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `translate(${Math.cos(p.angle) * p.radius}px, ${Math.sin(p.angle) * p.radius}px)`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

// Sparkle Effect
export function Sparkle({ x, y, color = '#d4af37' }) {
  const [sparkles, setSparkles] = useState([])

  useEffect(() => {
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / 12,
      length: Math.random() * 30 + 20,
    }))

    setSparkles(newSparkles)

    const timeout = setTimeout(() => setSparkles([]), 500)
    return () => clearTimeout(timeout)
  }, [x, y])

  return (
    <div className="sparkle-container" style={{ left: x, top: y }}>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle-line"
          style={{
            transform: `rotate(${s.angle}rad)`,
            background: `linear-gradient(to right, ${color}, transparent)`,
          }}
        />
      ))}
    </div>
  )
}

// Notification Toast System
export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const notification = { id, message, type }

    setNotifications((prev) => [...prev, notification])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, duration)
  }, [])

  return { notifications, notify }
}

// Loading Spinner
export function LoadingDots() {
  return (
    <div className="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

// Progress Circle
export function ProgressCircle({ progress, size = 60, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="progress-circle">
      <circle
        stroke="rgba(255,255,255,0.1)"
        fill="none"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#d4af37"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
    </svg>
  )
}

export default {
  useMousePosition,
  useSound,
  useRipple,
  useInView,
  useParallax,
  useTilt,
  Confetti,
  ParticleField,
  Sparkle,
  useNotification,
  LoadingDots,
  ProgressCircle,
}
