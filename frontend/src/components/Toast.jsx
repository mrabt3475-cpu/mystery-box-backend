// Toast Notifications Component
// ===========================

import React, { useEffect } from 'react'
import { useUIStore } from '../stores'
import '../styles/toast.css'

export default function ToastContainer() {
  const { notifications, removeNotification } = useUIStore()

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast 
          key={notification.id} 
          notification={notification} 
          onClose={() => removeNotification(notification.id)} 
        />
      ))}
    </div>
  )
}

function Toast({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, notification.duration || 5000)

    return () => clearTimeout(timer)
  }, [notification.duration, onClose])

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '🔔'
    }
  }

  return (
    <div className={`toast toast-${notification.type || 'info'}`}>
      <span className="toast-icon">{getIcon(notification.type)}</span>
      <div className="toast-content">
        {notification.title && <div className="toast-title">{notification.title}</div>}
        <div className="toast-message">{notification.message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  )
}

// Toast Helper Hook
export function useToast() {
  const addNotification = useUIStore((state) => state.addNotification)

  return {
    success: (message, title) => addNotification({ type: 'success', message, title }),
    error: (message, title) => addNotification({ type: 'error', message, title }),
    warning: (message, title) => addNotification({ type: 'warning', message, title }),
    info: (message, title) => addNotification({ type: 'info', message, title }),
  }
}
