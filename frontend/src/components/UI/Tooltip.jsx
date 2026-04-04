/**
 * 🎨 Tooltip Component
 * 
 * تلميح نصي قابل للتخصيص
 */

import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({
  children,
  content,
  position = 'top',
  variant = 'default',
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const classes = [
    'ui-tooltip-wrapper',
    className
  ].filter(Boolean).join(' ');

  const tooltipClasses = [
    'ui-tooltip',
    `ui-tooltip--${position}`,
    `ui-tooltip--${variant}`
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div className={tooltipClasses}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;