/**
 * 🎨 Loading Component
 * 
 * مؤشرات التحميل
 */

import React from 'react';
import './Loading.css';

// Spinner
export const Spinner = ({ size = 'md', className = '', ...props }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64
  };

  return (
    <svg 
      className={`ui-spinner ui-spinner--${size} ${className}`}
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 24 24"
      {...props}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="3" 
        fill="none" 
        strokeDasharray="60" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

// Dots
export const LoadingDots = ({ className = '', ...props }) => (
  <div className={`ui-loading-dots ${className}`} {...props}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// Pulse
export const LoadingPulse = ({ className = '', ...props }) => (
  <div className={`ui-loading-pulse ${className}`} {...props}>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

// Full Page Loading
export const PageLoader = ({ text = 'جاري التحميل...', className = '', ...props }) => (
  <div className={`ui-page-loader ${className}`} {...props}>
    <Spinner size="lg" />
    {text && <p className="ui-page-loader__text">{text}</p>}
  </div>
);

// Skeleton Loader (re-export)
export { default as Skeleton } from './Skeleton';

export default Spinner;