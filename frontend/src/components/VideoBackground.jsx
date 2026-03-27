import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function VideoBackground() {
  const { theme } = useTheme()
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Mock video URLs - replace with actual video URLs
  const videos = {
    dark: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    light: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
  }

  const currentVideo = videos[theme] || videos.dark

  return (
    <div className="video-bg-container">
      <video
        key={theme}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={currentVideo} type="video/mp4" />
      </video>
      <div className="video-overlay" />
    </div>
  )
}
