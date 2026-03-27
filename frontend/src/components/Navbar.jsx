import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores'
import '../styles/navigationDesign.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()

  const navLinks = [
    { path: '/', label: 'الرئيسية', icon: '🏠' },
    { path: '/boxes', label: 'الصناديق', icon: '🎁' },
    { path: '/shop', label: 'المتجر', icon: '🛍️' },
    { path: '/channels', label: 'القنوات', icon: '📢' },
    { path: '/leaderboard', label: 'ال排行榜', icon: '🏆' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">💎</div>
            <span>PuzzleChain</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                {/* Wallet */}
                <Link to="/wallet" className="navbar-wallet">
                  <div className="wallet-icon">🪙</div>
                  <span className="wallet-amount">{user?.points || 0}</span>
                </Link>

                {/* User */}
                <Link to="/profile" className="navbar-user">
                  <div className="user-avatar">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="user-name">{user?.username || 'User'}</span>
                  {user?.level && (
                    <span className="user-level">Lv.{user.level}</span>
                  )}
                </Link>

                {/* Logout */}
                <button onClick={logout} className="btn btn-ghost btn-icon" title="تسجيل خروج">
                  🚪
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  تسجيل دخول
                </Link>
                <Link to="/register" className="btn btn-primary">
                  حساب جديد
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
        
        {isAuthenticated && (
          <>
            <Link to="/wallet" className="navbar-link" onClick={() => setMobileOpen(false)}>
              <span>💰</span>
              <span>المحفظة</span>
            </Link>
            <Link to="/profile" className="navbar-link" onClick={() => setMobileOpen(false)}>
              <span>👤</span>
              <span>الملف</span>
            </Link>
          </>
        )}
      </div>
    </>
  )
}
