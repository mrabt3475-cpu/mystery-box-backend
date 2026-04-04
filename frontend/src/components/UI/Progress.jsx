/**
 * 🎨 Progress Component
 * 
 * شريط تقدم قابل للتخصيص
 * 
 * Props:
 * - value: number (0-100)
 * - variant: 'default' | 'gradient' | 'striped' | 'animated'
 * - size: 'sm' | 'md' | 'lg'
 * - color: string
 * - showLabel: boolean
 * - label: string
 */

import React from 'react';
import './Progress.css';

const Progress = ({
  value = 0,
  variant = 'default',
  size = 'md',
  color,
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const classes = [
    'ui-progress',
    `ui-progress--${variant}`,
    `ui-progress--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(showLabel || label) && (
        <div className="ui-progress__label">
          <span>{label}</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className="ui-progress__track">
        <div 
          className="ui-progress__bar"
          style={{ 
            width: `${clampedValue}%`,
            background: color || undefined
          }}
        />
      </div>
    </div>
  );
};

// Circular Progress
export const CircularProgress = ({
  value = 0,
  size = 100,
  strokeWidth = 8,
  color,
  showValue = true,
  className = '',
  ...props
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={`ui-circular-progress ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size}>
        <circle
          className="ui-circular-progress__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="ui-circular-progress__bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: color || 'var(--color-primary)' }}
        />
      </svg>
      {showValue && (
        <div className="ui-circular-progress__value">
          {Math.round(value)}%
        </div>
      )}
    </div>
  );
};

// XP Progress Bar
export const XPProgress = ({
  currentXP,
  requiredXP,
  level,
  className = '',
  ...props
}) => {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className={`xp-progress ${className}`} {...props}>
      <div className="xp-progress__header">
        <span className="xp-progress__level">المستوى {level}</span>
        <span className="xp-progress__xp">
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </span>
      </div>
      <Progress 
        value={progress} 
        variant="animated"
        color="linear-gradient(90deg, #8b5cf6, #a855f7)"
      />
    </div>
  );
};

export default Progress;