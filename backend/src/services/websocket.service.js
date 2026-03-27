// WebSocket Service for Real-time Features
// =======================================

const WebSocket = require('ws')
const jwt = require('jsonwebtoken')

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' })
    this.clients = new Map() // userId -> ws
    this.rooms = new Map() // roomName -> Set(userIds)
    this.latestWins = []
    this.maxWins = 50

    this.setupHandlers()
  }

  setupHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('[WS] New connection')
      ws.isAlive = true

      ws.on('pong', () => { ws.isAlive = true })

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message)
          this.handleMessage(ws, data)
        } catch (e) {
          console.error('[WS] Invalid message:', e)
        }
      })

      ws.on('close', () => {
        this.handleDisconnect(ws)
      })

      ws.send(JSON.stringify({ type: 'connected', timestamp: new Date() }))
    })

    // Heartbeat
    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          return ws.terminate()
        }
        ws.isAlive = false
        ws.ping()
      })
    }, 30000)
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case 'auth':
        this.handleAuth(ws, data.token)
        break
      case 'subscribe':
        this.handleSubscribe(ws, data.room)
        break
      case 'unsubscribe':
        this.handleUnsubscribe(ws, data.room)
        break
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }))
        break
    }
  }

  handleAuth(ws, token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      this.clients.set(decoded.id, ws)
      ws.userId = decoded.id
      ws.send(JSON.stringify({ type: 'authenticated', userId: decoded.id }))
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }))
    }
  }

  handleDisconnect(ws) {
    if (ws.userId) {
      this.clients.delete(ws.userId)
      // Remove from rooms
      this.rooms.forEach((users) => users.delete(ws.userId))
    }
  }

  handleSubscribe(ws, room) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set())
    }
    this.rooms.get(room).add(ws.userId)
    ws.send(JSON.stringify({ type: 'subscribed', room }))
  }

  handleUnsubscribe(ws, room) {
    if (this.rooms.has(room)) {
      this.rooms.get(room).delete(ws.userId)
    }
  }

  // Broadcast to all
  broadcast(message) {
    const data = JSON.stringify(message)
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  // Broadcast to room
  broadcastToRoom(room, message) {
    const users = this.rooms.get(room)
    if (!users) return

    const data = JSON.stringify(message)
    users.forEach((userId) => {
      const client = this.clients.get(userId)
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  // Send to specific user
  sendToUser(userId, message) {
    const client = this.clients.get(userId)
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  }

  // Broadcast new win
  broadcastNewWin(winData) {
    const win = {
      id: Date.now(),
      username: winData.username,
      prize: winData.prize,
      rarity: winData.rarity,
      boxName: winData.boxName,
      value: winData.value,
      timestamp: new Date()
    }

    this.latestWins.unshift(win)
    if (this.latestWins.length > this.maxWins) {
      this.latestWins.pop()
    }

    this.broadcast({
      type: 'new_win',
      data: win
    })
  }

  // Get latest wins (for initial load)
  getLatestWins() {
    return this.latestWins
  }

  // Broadcast statistics
  broadcastStats(stats) {
    this.broadcast({
      type: 'stats_update',
      data: stats
    })
  }
}

module.exports = WebSocketService
