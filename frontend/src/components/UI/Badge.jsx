/**
 * 🎨 Badge Component
 * 
 * شارة قابلة للتخصيص
 * 
 * Props:
 * - variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
 * - size: 'sm' | 'md' | 'lg'
 * - shape: 'default' | 'pill' | 'dot'
 * - icon: ReactNode
 */

import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'default',
  icon,
  className = '',
  ...props
}) => {
  const classes = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    `ui-badge--${shape}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {icon && <span className="ui-badge__icon">{icon}</span>}
      {children}
    </span>
  );
};

// Rarity Badge
export const RarityBadge = ({ rarity }) => {
  const rarityConfig = {
    common: { label: 'عادي', color: '#9ca3af' },
    uncommon: { label: 'غير عادي', color: '#22c55e' },
    rare: { label: 'نادر', color: '#3b82f6' },
    epic: { label: 'أسطوري', color: '#a855f7' },
    legendary: { label: 'خرافي', color: '#f59e0b' },
    mythic: { label: 'ميثي', color: '#ef4444' }
  };

  const config = rarityConfig[rarity] || rarityConfig.common;

  return (
    <Badge 
      variant="custom" 
      style={{ '--badge-color': config.color, background: `${config.color}20`, color: config.color }}
    >
      {config.label}
    </Badge>
  );
};

// Status Badge
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'نشط', variant: 'success' },
    inactive: { label: 'غير نشط', variant: 'error' },
    pending: { label: 'قيد الانتظار', variant: 'warning' },
    banned: { label: 'محظور', variant: 'error' },
    verified: { label: 'موثق', variant: 'info' }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} shape="pill">
      {config.label}
    </Badge>
  );
};

// Count Badge
export const CountBadge = ({ count, max = 99 }) => {
  if (!count || count === 0) return null;

  return (
    <Badge variant="error" size="sm" shape="pill">
      {count > max ? `${max}+` : count}
    </Badge>
  );
};

export default Badge;