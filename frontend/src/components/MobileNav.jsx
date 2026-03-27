import { Link, useLocation } from 'react-router-dom'

export default function MobileNav() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: 'الرئيسية' },
    { path: '/boxes', icon: '🎁', label: 'صناديق' },
    { path: '/shop', icon: '🛒', label: 'متجر' },
    { path: '/wallet', icon: '💰', label: 'محفظة' },
    { path: '/profile', icon: '👤', label: 'حسابي' },
  ]

  return (
    <nav className="mobile-only mobile-navbar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
