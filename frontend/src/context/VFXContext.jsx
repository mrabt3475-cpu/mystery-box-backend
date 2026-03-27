import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react'

// Visual Effects Context
const VFXContext = createContext()

export function VFXProvider({ children }) {
  const [effects, setEffects] = useState([])
  const [screenShake, setScreenShake] = useState(false)
  const [flash, setFlash] = useState(false)
  const effectIdRef = useRef(0)

  // Add a new effect
  const addEffect = useCallback((type, options = {}) => {
    const id = ++effectIdRef.current
    const newEffect = {
      id,
      type,
      ...options,
      createdAt: Date.now(),
    }
    setEffects(prev => [...prev, newEffect])
    
    // Auto remove after duration
    const duration = options.duration || 3000
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id))
    }, duration)
    
    return id
  }, [])

  // Remove effect manually
  const removeEffect = useCallback((id) => {
    setEffects(prev => prev.filter(e => e.id !== id))
  }, [])

  // Screen shake
  const triggerShake = useCallback((intensity = 'medium') => {
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 500)
  }, [])

  // Flash effect
  const triggerFlash = useCallback((color = 'white') => {
    setFlash(color)
    setTimeout(() => setFlash(false), 200)
  }, [])

  // Preset effects
  const celebrate = useCallback(() => {
    addEffect('confetti', { count: 100, duration: 4000 })
    addEffect('fireworks', { count: 5, duration: 3000 })
    triggerShake('strong')
    triggerFlash('gold')
  }, [addEffect, triggerShake, triggerFlash])

  const winPrize = useCallback((rarity) => {
    const colors = {
      legendary: ['#ffd700', '#ff6b6b', '#4ecdc4'],
      epic: ['#a855f7', '#ec4899', '#06b6d4'],
      rare: ['#3b82f6', '#06b6d4', '#22c55e'],
      uncommon: ['#22c55e', '#84cc16', '#eab308'],
      common: ['#9ca3af', '#6b7280', '#d1d5db'],
    }
    
    addEffect('particles', { 
      count: 50, 
      colors: colors[rarity] || colors.common,
      duration: 3000 
    })
    addEffect('glow', { color: colors[rarity]?.[0] || '#ffd700', duration: 2000 })
    triggerShake('medium')
    triggerFlash(colors[rarity]?.[0] || 'gold')
  }, [addEffect, triggerShake, triggerFlash])

  const openBox = useCallback(() => {
    addEffect('portal', { duration: 2000 })
    addEffect('particles', { count: 30, colors: ['#d4af37', '#8b5cf6'], duration: 2000 })
  }, [addEffect])

  const addToCart = useCallback(() => {
    addEffect('sparkle', { count: 10, duration: 1000 })
  }, [addEffect])

  const levelUp = useCallback(() => {
    addEffect('matrix', { duration: 3000 })
    addEffect('fireworks', { count: 3, duration: 2000 })
    triggerShake('strong')
  }, [addEffect, triggerShake])

  return (
    <VFXContext.Provider value={{
      effects,
      addEffect,
      removeEffect,
      screenShake,
      flash,
      triggerShake,
      triggerFlash,
      celebrate,
      winPrize,
      openBox,
      addToCart,
      levelUp,
    }}>
      {children}
    </VFXContext.Provider>
  )
}

export const useVFX = () => useContext(VFXContext)
