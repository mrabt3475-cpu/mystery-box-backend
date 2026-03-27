import React, { useState, useEffect, useCallback } from 'react'
import '../styles/interactiveEffects.css'

// Sparkle Component
export function SparkleEffect({ children, color = '#d4af37', onClick }) {
  const [sparkles, setSparkles] = useState([])

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (Math.PI * 2 * i) / 8,
      x,
      y,
    }))

    setSparkles(newSparkles)

    setTimeout(() => setSparkles([]), 500)
    onClick?.(e)
  }, [onClick])

  return (
    <div className="sparkle-wrapper" onClick={handleClick} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle-burst"
          style={{
            left: s.x,
            top: s.y,
            '--angle': s.angle,
            '--sparkle-color': color,
          }}
        />
      ))}
    </div>
  )
}

// Ripple Button
export function RippleButton({ children, onClick, variant = 'primary', ...props }) {
  const [ripples, setRipples] = useState([])

  const handleClick = useCallback((e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ripple = { id: Date.now(), x, y }
    setRipples((prev) => [...prev, ripple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
    }, 600)

    onClick?.(e)
  }, [onClick])

  return (
    <button
      className={`ripple-button ${variant}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple-span" style={{ left: r.x, top: r.y }} />
      ))}
    </button>
  )
}

// Animated Counter
export function AnimatedCounter({ value, duration = 1000, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime
    const startValue = 0
    const endValue = value

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (endValue - startValue) * easeOut)
      
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

// Progress Ring with Animation
export function AnimatedProgressRing({ progress, size = 80, strokeWidth = 6, color = '#d4af37' }) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    let startTime
    const startValue = 0
    const duration = 1000

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (progress - startValue) * easeOut
      
      setAnimatedProgress(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  const offset = circumference - (animatedProgress / 100) * circumference

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        stroke="rgba(255,255,255,0.1)"
        fill="none"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
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

// Card with 3D Tilt
export function TiltCard({ children, className = '', tiltStrength = 10 }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = React.useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltStrength
    const rotateY = ((x - centerX) / centerX) * tiltStrength

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease',
      }}
    >
      {children}
    </div>
  )
}

// Shake on Error
export function ShakeError({ children, hasError }) {
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (hasError) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }, [hasError])

  return (
    <div className={shake ? 'shake' : ''}>
      {children}
    </div>
  )
}

// Pulse on New
export function PulseBadge({ children, pulse = false }) {
  return (
    <span className={`pulse-badge ${pulse ? 'pulsing' : ''}`}>
      {children}
    </span>
  )
}

// Loading Spinner
export function LoadingSpinner({ size = 40, color = '#d4af37' }) {
  return (
    <div className="loading-spinner-container">
      <div 
        className="custom-spinner"
        style={{
          width: size,
          height: size,
          borderColor: 'rgba(255,255,255,0.1)',
          borderTopColor: color,
        }}
      />
    </div>
  )
}

// Fade In On Scroll
export function FadeInOnScroll({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = React.useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`fade-in-scroll ${isVisible ? 'visible' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Expandable Card
export function ExpandableCard({ title, children, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={`expandable-card ${expanded ? 'expanded' : ''}`}>
      <div className="expandable-header" onClick={() => setExpanded(!expanded)}>
        <span>{title}</span>
        <span className="expand-icon">{expanded ? '−' : '+'}</span>
      </div>
      {expanded && <div className="expandable-content">{children}</div>}
    </div>
  )
}

// Notification Banner
export function NotificationBanner({ message, type = 'info', onClose }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`notification-banner ${type} ${isExiting ? 'exiting' : ''}`}>
      <span>{message}</span>
      <button onClick={() => { setIsExiting(true); setTimeout(onClose, 300) }}>×</button>
    </div>
  )
}

// Sound Button
export function SoundButton({ soundType = 'click', children, onClick }) {
  const playSound = () => {
    // In production, implement actual sound
    console.log(`Playing sound: ${soundType}`)
    onClick?.()
  }

  return (
    <button className="sound-btn" onClick={playSound}>
      {children}
    </button>
  )
}

export default {
  SparkleEffect,
  RippleButton,
  AnimatedCounter,
  AnimatedProgressRing,
  TiltCard,
  ShakeError,
  PulseBadge,
  LoadingSpinner,
  FadeInOnScroll,
  ExpandableCard,
  NotificationBanner,
  SoundButton,
}
