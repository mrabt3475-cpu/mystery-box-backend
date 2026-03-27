import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores'

export default function DashboardHero() {
  const user = useAuthStore((state) => state.user)

  const stats = [
    { label: 'رصيدي', value: user?.points || 0, icon: '💰' },
    { label: 'صناديق', value: user?.boxesOpened || 0, icon: '🎁' },
    { label: 'ارباح', value: user?.totalWins || 0, icon: '🏆' },
    { label: 'مستوى', value: user?.level || 1, icon: '⭐' },
  ]

  return (
    <div className="dashboard-hero fade-in-up">
      <div className="hero-content">
        <div className="hero-text">
          <h1>مرحباً، {user?.username || 'ضيف'} 👋</h1>
          <p>هل أنت مستعد للفوز بجوائز رائعة؟</p>
        </div>
        
        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div key={index} className="hero-stat">
              <span className="hero-stat-value">{stat.value.toLocaleString()}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Quick Actions Component
export function QuickActions() {
  const actions = [
    { icon: '🎁', label: 'افتح صندوق', desc: 'جرب حظك', path: '/boxes' },
    { icon: '🛍️', label: 'تسوق', desc: 'منتجات جديدة', path: '/shop' },
    { icon: '📢', label: 'قناتي', desc: 'ادارة القنوات', path: '/channels' },
    { icon: '💰', label: 'المحفظة', desc: 'شحن رصيد', path: '/wallet' },
  ]

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <Link key={index} to={action.path} className="action-card">
          <div className="action-icon">{action.icon}</div>
          <div className="action-label">{action.label}</div>
          <div className="action-desc">{action.desc}</div>
        </Link>
      ))}
    </div>
  )
}

// Stats Grid Component
export function StatsGrid({ stats }) {
  const defaultStats = [
    { icon: '💰', value: '5,000', label: 'الرصيد', change: '+12%' },
    { icon: '🎁', value: '25', label: 'صناديق مفتوحة', change: '+5' },
    { icon: '🏆', value: '15', label: 'ارباح', change: '+3' },
    { icon: '👥', value: '8', label: 'الاصدقاء', change: '+2' },
  ]

  const displayStats = stats || defaultStats

  return (
    <div className="stats-grid">
      {displayStats.map((stat, index) => (
        <div key={index} className="stat-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
          {stat.change && (
            <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.change}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Box Showcase Component
export function BoxShowcase({ boxes }) {
  const defaultBoxes = [
    { id: 1, name: 'صندوق برونزي', price: 100, icon: '🥉', odds: '80%Rare', badge: 'hot' },
    { id: 2, name: 'صندوق فضي', price: 250, icon: '🥈', odds: '60%Epic', badge: 'new' },
    { id: 3, name: 'صندوق ذهبي', price: 500, icon: '🥇', odds: '40%Legend', badge: 'limited' },
  ]

  const displayBoxes = boxes || defaultBoxes

  return (
    <div className="box-showcase">
      {displayBoxes.map((box, index) => (
        <Link 
          key={box.id || index} 
          to={`/boxes/${box.id || index + 1}`}
          className="box-card fade-in-up"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {box.badge && (
            <span className={`box-badge ${box.badge}`}>
              {box.badge === 'hot' ? '🔥热销' : box.badge === 'new' ? '✨ جديد' : '⭐ محدود'}
            </span>
          )}
          <div className="box-image">{box.icon}</div>
          <div className="box-name">{box.name}</div>
          <div className="box-price">{box.price} 🪙</div>
          <div className="box-odds">{box.odds}</div>
        </Link>
      ))}
    </div>
  )
}

// Activity Section Component
export function ActivitySection() {
  const activities = [
    { type: 'win', title: 'فوز بمركز ذهبي', desc: 'صندوق ذهبي', time: 'منذ 5 دقائق', icon: '🏆' },
    { type: 'purchase', title: 'شراء منتج', desc: 'آيفون 15', time: 'منذ ساعة', icon: '🛍️' },
    { type: 'lose', title: 'خسارة', desc: 'صندوق برونزي', time: 'منذ 2 ساعة', icon: '😢' },
  ]

  return (
    <div className="activity-section fade-in-up">
      <div className="section-header">
        <h3 className="section-title">النشاط الاخير</h3>
        <Link to="/activity" className="btn btn-ghost">
          عرض الكل
        </Link>
      </div>
      
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-icon ${activity.type}`}>
              {activity.icon}
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-desc">{activity.desc}</div>
            </div>
            <div className="activity-time">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Leaderboard Preview Component
export function LeaderboardPreview() {
  const leaders = [
    { rank: 1, name: 'أحمد', value: '50,000', avatar: 'أ' },
    { rank: 2, name: 'محمد', value: '45,000', avatar: 'م' },
    { rank: 3, name: 'علي', value: '40,000', avatar: 'ع' },
  ]

  return (
    <div className="leaderboard-preview fade-in-up">
      <div className="section-header">
        <h3 className="section-title">ال排行榜</h3>
        <Link to="/leaderboard" className="btn btn-ghost">
          عرض الكل
        </Link>
      </div>
      
      <div className="leaderboard-list">
        {leaders.map((leader) => (
          <div key={leader.rank} className="leaderboard-item">
            <div className={`leaderboard-rank ${leader.rank === 1 ? 'gold' : leader.rank === 2 ? 'silver' : 'bronze'}`}>
              {leader.rank}
            </div>
            <div className="avatar avatar-sm">{leader.avatar}</div>
            <div className="leaderboard-name">{leader.name}</div>
            <div className="leaderboard-value">{leader.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
