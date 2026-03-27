import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function VideoBackground() {
  const { theme } = useTheme()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [particles, setParticles] = useState([])

  // Generate floating particles
  useEffect(() => {
    const newParticles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.1,
    }))
    setParticles(newParticles)
  }, [])

  const videos = {
    dark: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4',
    light: 'https://assets.mixkit.co/videos/preview/mixkit-white-clouds-on-blue-sky-2408-large.mp4',
  }

  const currentVideo = videos[theme] || videos.dark

  return (
    <div className="video-bg-container">
      {/* Video */}
      <video
        key={theme}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={currentVideo} type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div className="video-overlay" />
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }} />
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float-orb" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: '-10s' }} />
      </div>
      
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: theme === 'dark' ? 
              `rgba(212, 175, 55, ${p.opacity})` : 
              `rgba(139, 92, 246, ${p.opacity})`,
            animation: `particleFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
      }} />
    </div>
  )
}
