import React from 'react';
import './Skeleton.css';

const Skeleton = ({ 
  width, 
  height, 
  borderRadius = '10px',
  className = ''
}) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius
      }}
    />
  );
};

// Card Skeleton
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton height="200px" borderRadius="15px 15px 0 0" />
    <div className="skeleton-card-content">
      <Skeleton width="70%" height="24px" />
      <Skeleton width="90%" height="16px" />
      <Skeleton width="50%" height="16px" />
      <div className="skeleton-card-footer">
        <Skeleton width="80px" height="36px" borderRadius="20px" />
        <Skeleton width="60px" height="24px" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const SkeletonTableRow = () => (
  <div className="skeleton-table-row">
    <Skeleton width="40px" height="40px" borderRadius="50%" />
    <Skeleton width="30%" height="20px" />
    <Skeleton width="20%" height="20px" />
    <Skeleton width="15%" height="20px" />
    <Skeleton width="80px" height="32px" borderRadius="8px" />
  </div>
);

// Text Skeleton
export const SkeletonText = ({ lines = 3 }) => (
  <div className="skeleton-text">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        width={i === lines - 1 ? '60%' : '100%'} 
        height="16px" 
      />
    ))}
  </div>
);

// Profile Skeleton
export const SkeletonProfile = () => (
  <div className="skeleton-profile">
    <Skeleton width="80px" height="80px" borderRadius="50%" />
    <Skeleton width="50%" height="24px" />
    <Skeleton width="30%" height="16px" />
  </div>
);

export default Skeleton;
