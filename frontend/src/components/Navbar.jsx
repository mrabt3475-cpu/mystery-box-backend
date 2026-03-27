import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationsContext'
import { useState, useRef, useEffect } from 'react'
import api from '../services/api'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount, isOpen, toggle, markAsRead, markAllAsRead } = useNotifications()
  const dropdownRef = useRef(null)
  const location = useLocation()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) toggle()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'الرئيسية'
      case '/boxes': return 'الصناديق'
      case '/shop': return 'المتجر'
      case '/profile': return 'ملفي'
      case '/wallet': return 'المحفظة'
      case '/orders': return 'طلباتي'
      case '/leaderboard': return 'الترتيب'
      case '/referral': return 'الإحالة'
      default: return 'Athena'
    }
  }

  return (
    <>
      <header className="navbar-premium desktop-only">
        <div className="flex items-center gap-6">
          <h1 className="logo-premium">
            <span className="shimmer">ATHENA</span>
          </h1>
          <span className="text-gray-400">{getPageTitle()}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            <div className="theme-toggle-thumb">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </button>

          {/* Notification Bell */}
          <div className="notification-bell" ref={dropdownRef}>
            <button
              onClick={toggle}
              className="glass-card p-2 rounded-full hover:bg-white/10 transition"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
              <div className="notification-dropdown">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-amber-400 hover:text-amber-300"
                    >
                      تعيين كمقروء
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      لا توجد إشعارات
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif._id}
                        className={`notification-item ${!notif.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notif._id)}
                      >
                        <div className="text-2xl">
                          {notif.type === 'win' ? '🎉' :
                           notif.type === 'points' ? '🪙' :
                           notif.type === 'order' ? '📦' : '🔔'}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{notif.title}</p>
                          <p className="text-xs text-gray-400">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString('ar')}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Points */}
          <div className="points-display">
            <span className="points-icon">🪙</span>
            <span className="points-value">1,250</span>
          </div>

          {/* Profile */}
          <Link to="/profile" className="glass-card p-1 rounded-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-amber-900">
              م
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="mobile-only" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px',
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
      }}>
        <h1 className="logo-premium" style={{ fontSize: '20px' }}>
          <span className="shimmer">ATHENA</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <div className="relative">
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
