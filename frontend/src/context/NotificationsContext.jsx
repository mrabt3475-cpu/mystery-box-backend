import { useState, useEffect, createContext, useContext } from 'react'
import api from '../services/api'

// Notifications Context
const NotificationsContext = createContext()

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
      setUnreadCount(res.data.filter(n => !n.read).length)
    } catch (err) {
      console.error(err)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error(err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error(err)
    }
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    if (!notification.read) {
      setUnreadCount(prev => prev + 1)
    }
  }

  const toggle = () => setIsOpen(prev => !prev)

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      isOpen,
      toggle,
      markAsRead,
      markAllAsRead,
      addNotification,
      refresh: fetchNotifications,
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
