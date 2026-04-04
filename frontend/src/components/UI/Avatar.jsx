/**
 * 🎨 Avatar Component
 * 
 * صورة شخصية قابلة للتخصيص
 * 
 * Props:
 * - src: string (image URL)
 * - name: string (for fallback)
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * - shape: 'circle' | 'square' | 'rounded'
 * - status: 'online' | 'offline' | 'busy' | 'away'
 * - showBorder: boolean
 * - borderColor: string
 */

import React from 'react';
import './Avatar.css';

const Avatar = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  status,
  showBorder = false,
  borderColor,
  className = '',
  ...props
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return '#8b5cf6';
    const colors = [
      '#8b5cf6', '#3b82f6', '#22c55e', 
      '#f59e0b', '#ef4444', '#a855f7',
      '#06b6d4', '#ec4899', '#14b8a6'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const classes = [
    'ui-avatar',
    `ui-avatar--${size}`,
    `ui-avatar--${shape}`,
    !src && 'ui-avatar--fallback',
    showBorder && 'ui-avatar--border',
    className
  ].filter(Boolean).join(' ');

  const statusClasses = [
    'ui-avatar__status',
    `ui-avatar__status--${status}`
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      style={{ 
        '--border-color': borderColor,
        background: !src ? getColorFromName(name) : undefined
      }}
      {...props}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="ui-avatar__image" />
      ) : (
        <span className="ui-avatar__initials">
          {getInitials(name)}
        </span>
      )}
      
      {status && <span className={statusClasses}></span>}
    </div>
  );
};

// Avatar Group
export const AvatarGroup = ({
  users = [],
  max = 4,
  size = 'md',
  showCount = true
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="ui-avatar-group">
      {visibleUsers.map((user, index) => (
        <Avatar 
          key={index}
          src={user.avatar}
          name={user.name}
          size={size}
          showBorder
          borderColor="var(--color-bg-secondary)"
        />
      ))}
      {showCount && remainingCount > 0 && (
        <div className={`ui-avatar-group__count ui-avatar-group__count--${size}`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;