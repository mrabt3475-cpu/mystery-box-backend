import React from 'react';
import './StatsCards.css';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = '#6366f1', 
  trend = null,
  trendValue = null,
  suffix = ''
}) => {
  return (
    <div className="stats-card" style={{ '--card-color': color }}>
      <div className="stats-card-icon">
        {icon}
      </div>
      <div className="stats-card-content">
        <span className="stats-card-title">{title}</span>
        <div className="stats-card-value">
          <span className="value">{value?.toLocaleString() || 0}</span>
          {suffix && <span className="suffix">{suffix}</span>}
        </div>
        {trend && (
          <span className={`stats-trend ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </span>
        )}
      </div>
    </div>
  );
};

// Multiple stats cards row
export const StatsCardsRow = ({ stats }) => {
  return (
    <div className="stats-cards-row">
      <StatsCard
        title="إجمالي الرصيد"
        value={stats?.totalBalance || 0}
        icon="💰"
        color="#10b981"
      />
      <StatsCard
        title="المشتريات"
        value={stats?.totalPurchases || 0}
        icon="🛒"
        color="#6366f1"
      />
      <StatsCard
        title="العائدات"
        value={stats?.totalEarnings || 0}
        icon="📈"
        color="#f59e0b"
      />
      <StatsCard
        title="نقاط اليوم"
        value={stats?.todayPoints || 0}
        icon="⚡"
        color="#8b5cf6"
      />
    </div>
  );
};

export default StatsCard;
