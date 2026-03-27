import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../stores'
import '../styles/liveFeed.css'

// WebSocket Hook
function useWebSocket() {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [wins, setWins] = useState([])
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}/ws`
    )

    ws.onopen = () => {
      setConnected(true)
      // Authenticate
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', token }))
      }
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'new_win':
          setWins((prev) => [data.data, ...prev].slice(0, 20))
          break
        case 'connected':
          console.log('WS Connected')
          break
      }
    }

    ws.onclose = () => setConnected(false)
    ws.onerror = (err) => console.error('WS Error:', err)

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [token])

  return { socket, connected, wins }
}

export default function LiveFeed() {
  const { connected, wins } = useWebSocket()

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'rarity-legendary'
      case 'epic': return 'rarity-epic'
      case 'rare': return 'rarity-rare'
      default: return 'rarity-common'
    }
  }

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000)
    if (seconds < 60) return 'الآن'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h`
  }

  return (
    <div className="live-feed">
      <div className="feed-header">
        <span className="live-indicator">
          <span className={`pulse ${connected ? 'active' : ''}`}></span>
          {connected ? 'مباشر' : 'جارٍ الاتصال...'}
        </span>
      </div>

      <div className="feed-list">
        {wins.length === 0 ? (
          <div className="feed-empty">
            <span>🎰</span>
            <p>لا توجد نتائج حية حالياً</p>
          </div>
        ) : (
          wins.map((win) => (
            <div key={win.id} className={`feed-item ${getRarityColor(win.rarity)}`}>
              <div className="feed-avatar">
                {win.username?.charAt(0)}
              </div>
              <div className="feed-content">
                <div className="feed-user">{win.username}</div>
                <div className="feed-prize">{win.prize}</div>
              </div>
              <div className="feed-meta">
                <span className="feed-value">${win.value}</span>
                <span className="feed-time">{getTimeAgo(win.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
