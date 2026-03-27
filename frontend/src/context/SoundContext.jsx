import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react'

// Sound Effects Context
const SoundContext = createContext()

// Sound URLs (using free sound effects)
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  openBox: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  coin: 'https://assets.mixkit.co/active_storage/sfx/2065/2065-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2965/2965-preview.mp3',
  purchase: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  cardFlip: 'https://assets.mixkit.co/active_storage/sfx/3048/3048-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2994/2994-preview.mp3',
}

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [soundsLoaded, setSoundsLoaded] = useState({})
  const audioRefs = useRef({})

  // Load all sounds on mount
  useEffect(() => {
    const loadSounds = async () => {
      const loaded = {}
      for (const [name, url] of Object.entries(SOUNDS)) {
        try {
          const audio = new Audio(url)
          audio.preload = 'auto'
          audioRefs.current[name] = audio
          loaded[name] = true
        } catch (err) {
          console.warn(`Failed to load sound: ${name}`)
          loaded[name] = false
        }
      }
      setSoundsLoaded(loaded)
    }
    loadSounds()
  }, [])

  // Play a sound
  const playSound = useCallback((soundName, options = {}) => {
    if (muted) return
    
    const audio = audioRefs.current[soundName]
    if (!audio) return

    // Clone to allow overlapping sounds
    const soundClone = audio.cloneNode()
    soundClone.volume = volume
    soundClone.play().catch(err => console.warn('Sound play error:', err))
  }, [muted, volume])

  // Play with custom URL
  const playCustomSound = useCallback((url) => {
    if (muted) return
    const audio = new Audio(url)
    audio.volume = volume
    audio.play().catch(err => console.warn('Sound play error:', err))
  }, [muted, volume])

  const toggleMute = () => setMuted(prev => !prev)

  return (
    <SoundContext.Provider value={{
      playSound,
      playCustomSound,
      muted,
      setMuted,
      toggleMute,
      volume,
      setVolume,
      soundsLoaded,
    }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSound = () => useContext(SoundContext)

// Hook for playing sounds on hover/click
export function useSoundEffects() {
  const { playSound, muted } = useContext(SoundContext)

  const onHover = () => playSound('hover')
  const onClick = () => playSound('click')
  const onWin = () => playSound('win')
  const onOpenBox = () => playSound('openBox')
  const onCoin = () => playSound('coin')
  const onError = () => playSound('error')
  const onSuccess = () => playSound('success')
  const onNotification = () => playSound('notification')
  const onPurchase = () => playSound('purchase')
  const onLevelUp = () => playSound('levelUp')
  const onCardFlip = () => playSound('cardFlip')
  const onWhoosh = () => playSound('whoosh')

  return {
    onHover,
    onClick,
    onWin,
    onOpenBox,
    onCoin,
    onError,
    onSuccess,
    onNotification,
    onPurchase,
    onLevelUp,
    onCardFlip,
    onWhoosh,
    muted,
  }
}
