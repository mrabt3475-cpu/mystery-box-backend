import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return <div className="auth-layout">{children}</div>;
  }

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'الرئيسية' },
    { path: '/boxes', icon: '📦', label: 'الصناديق' },
    { path: '/services', icon: '🛒', label: 'الخدمات' },
    { path: '/gift', icon: '🎁', label: 'الهدايا' },
    { path: '/leaderboard', icon: '🏆', label: 'الترتيب' },
  ];

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <header className="top-nav">
        <div className="nav-brand">
          <Link to="/dashboard">
            <span className="brand-icon">🎰</span>
            <span className="brand-name">PuzzleChain</span>
          </Link>
        </div>

        <nav className="nav-links">
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="nav-user">
          <Link to="/wallet" className="user-points">
            <span className="points-icon">💰</span>
            <span className="points-value">{user?.pointsBalance || 0}</span>
          </Link>
          
          <Link to="/profile" className="user-profile">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <span className="user-name">{user?.name?.split(' ')[0]}</span>
          </Link>

          <button className="logout-btn" onClick={logout} title="تسجيل خروج">
            🚪
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
