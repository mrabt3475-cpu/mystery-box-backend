/**
 * 🎨 Advanced Card Components
 * 
 * مجموعة بطاقات متقدمة قابلة للتخصيص
 */

import React from 'react';
import './CardAdvanced.css';

// ========================
// 📦 Prize Card - لعرض الجوائز
// ========================
export const PrizeCard = ({
  prize,
  rarity = 'common',
  showRarity = true,
  size = 'md',
  onClick,
  ...props
}) => {
  const rarityColors = {
    common: '#9ca3af',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythic: '#ef4444'
  };

  const rarityLabels = {
    common: 'عادي',
    uncommon: 'غير عادي',
    rare: 'نادر',
    epic: 'أسطوري',
    legendary: 'خرافي',
    mythic: 'ميثي'
  };

  return (
    <div 
      className={`prize-card prize-card--${size}`}
      onClick={onClick}
      style={{ '--rarity-color': rarityColors[rarity] }}
      {...props}
    >
      <div className="prize-card__image">
        {prize.image ? (
          <img src={prize.image} alt={prize.name} />
        ) : (
          <div className="prize-card__placeholder">🎁</div>
        )}
        {showRarity && (
          <span className="prize-card__rarity" style={{ background: rarityColors[rarity] }}>
            {rarityLabels[rarity]}
          </span>
        )}
      </div>
      <div className="prize-card__info">
        <h4 className="prize-card__name">{prize.name}</h4>
        {prize.value && (
          <span className="prize-card__value">
            {prize.value.toLocaleString()} 🪙
          </span>
        )}
      </div>
    </div>
  );
};

// ========================
// 📦 Box Card - لعرض الصناديق
// ========================
export const BoxCard = ({
  box,
  size = 'md',
  showPrice = true,
  showStats = true,
  onClick,
  ...props
}) => {
  return (
    <div 
      className={`box-card box-card--${size}`}
      onClick={onClick}
      {...props}
    >
      <div className="box-card__image">
        {box.image ? (
          <img src={box.image} alt={box.name} />
        ) : (
          <div className="box-card__placeholder">📦</div>
        )}
        <div className="box-card__glow"></div>
      </div>
      
      <div className="box-card__content">
        <h3 className="box-card__name">{box.name}</h3>
        <p className="box-card__desc">{box.description}</p>
        
        {showStats && (
          <div className="box-card__stats">
            <div className="box-card__stat">
              <span className="box-card__stat-value">{box.totalOpens || 0}</span>
              <span className="box-card__stat-label">فتحات</span>
            </div>
            <div className="box-card__stat">
              <span className="box-card__stat-value">{box.winnersCount || 0}</span>
              <span className="box-card__stat-label">فائزين</span>
            </div>
          </div>
        )}
        
        {showPrice && box.price && (
          <div className="box-card__price">
            <span className="box-card__price-value">
              {box.price.toLocaleString()}
            </span>
            <span className="box-card__price-label">🪙</span>
          </div>
        )}
      </div>
      
      <div className="box-card__footer">
        <button className="box-card__btn-open">
          فتح الصندوق 🚀
        </button>
      </div>
    </div>
  );
};

// ========================
// 👤 User Card - لعرض المستخدمين
// ========================
export const UserCard = ({
  user,
  size = 'md',
  showStats = true,
  rank,
  onClick,
  ...props
}) => {
  return (
    <div 
      className={`user-card user-card--${size}`}
      onClick={onClick}
      {...props}
    >
      {rank && (
        <div className="user-card__rank">
          #{rank}
        </div>
      )}
      
      <div className="user-card__avatar">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <div className="user-card__avatar-placeholder">
            {user.name?.charAt(0) || '👤'}
          </div>
        )}
      </div>
      
      <div className="user-card__info">
        <h4 className="user-card__name">{user.name}</h4>
        {user.username && (
          <span className="user-card__username">@{user.username}</span>
        )}
      </div>
      
      {showStats && (
        <div className="user-card__stats">
          <div className="user-card__stat">
            <span className="user-card__stat-value">{user.totalWins || 0}</span>
            <span className="user-card__stat-label">فوز</span>
          </div>
          <div className="user-card__stat">
            <span className="user-card__stat-value">
              {user.totalSpent?.toLocaleString() || 0}
            </span>
            <span className="user-card__stat-label">أنفق</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================
// 💳 Transaction Card - لعرض المعاملات
// ========================
export const TransactionCard = ({
  transaction,
  size = 'md',
  onClick,
  ...props
}) => {
  const typeColors = {
    deposit: '#22c55e',
    withdraw: '#ef4444',
    purchase: '#f59e0b',
    win: '#8b5cf6',
    gift: '#3b82f6',
    refund: '#06b6d4'
  };

  const typeLabels = {
    deposit: 'إيداع',
    withdraw: 'سحب',
    purchase: 'شراء',
    win: 'فوز',
    gift: 'هدية',
    refund: 'استرداد'
  };

  const typeIcons = {
    deposit: '💰',
    withdraw: '💸',
    purchase: '🛒',
    win: '🎉',
    gift: '🎁',
    refund: '↩️'
  };

  return (
    <div 
      className={`transaction-card transaction-card--${size}`}
      onClick={onClick}
      {...props}
    >
      <div 
        className="transaction-card__icon"
        style={{ background: `${typeColors[transaction.type]}20`, color: typeColors[transaction.type] }}
      >
        {typeIcons[transaction.type]}
      </div>
      
      <div className="transaction-card__info">
        <h4 className="transaction-card__title">{transaction.title}</h4>
        <span className="transaction-card__date">
          {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
        </span>
      </div>
      
      <div className="transaction-card__amount">
        <span 
          className={`transaction-card__amount-value ${transaction.type === 'withdraw' ? 'negative' : 'positive'}`}
        >
          {transaction.type === 'withdraw' ? '-' : '+'}{transaction.amount?.toLocaleString()}
        </span>
        <span className="transaction-card__amount-label">🪙</span>
      </div>
    </div>
  );
};

// ========================
// 📊 Stats Card - لعرض الإحصائيات
// ========================
export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'primary',
  size = 'md',
  ...props
}) => {
  const colors = {
    primary: '#8b5cf6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  return (
    <div 
      className={`stats-card stats-card--${size}`}
      style={{ '--accent-color': colors[color] }}
      {...props}
    >
      <div className="stats-card__header">
        <span className="stats-card__title">{title}</span>
        <span className="stats-card__icon">{icon}</span>
      </div>
      
      <div className="stats-card__value">{value}</div>
      
      {trend && (
        <div className={`stats-card__trend ${trend === 'up' ? 'positive' : 'negative'}`}>
          <span>{trend === 'up' ? '↑' : '↓'}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

// ========================
// 🎯 Leaderboard Card - لعرض المتصدرين
// ========================
export const LeaderboardCard = ({
  users = [],
  currentUserId,
  onUserClick,
  ...props
}) => {
  return (
    <div className="leaderboard-card" {...props}>
      <div className="leaderboard-card__header">
        <h3>🏆 المتصدرين</h3>
      </div>
      
      <div className="leaderboard-card__list">
        {users.map((user, index) => (
          <div 
            key={user._id || index}
            className={`leaderboard-card__item ${user._id === currentUserId ? 'current' : ''}`}
            onClick={() => onUserClick?.(user)}
          >
            <div className="leaderboard-card__rank">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            
            <div className="leaderboard-card__avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                <span>{user.name?.charAt(0)}</span>
              )}
            </div>
            
            <div className="leaderboard-card__info">
              <span className="leaderboard-card__name">{user.name}</span>
              <span className="leaderboard-card__wins">{user.totalWins} فوز</span>
            </div>
            
            <div className="leaderboard-card__score">
              {user.totalSpent?.toLocaleString()} 🪙
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrizeCard;