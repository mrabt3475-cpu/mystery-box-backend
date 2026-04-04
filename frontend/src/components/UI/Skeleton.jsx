/**
 * 🎨 Skeleton Component
 * 
 * تأثير تحميل هيكلي
 */

import React from 'react';
import './Skeleton.css';

const Skeleton = ({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className = '',
  ...props
}) => {
  const classes = [
    'ui-skeleton',
    `ui-skeleton--${variant}`,
    `ui-skeleton--${animation}`,
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined)
  };

  return (
    <div className={classes} style={style} {...props}>
      {variant === 'avatar' && <div className="ui-skeleton__avatar" />}
      {variant === 'image' && <div className="ui-skeleton__image" />}
      {variant === 'card' && (
        <>
          <div className="ui-skeleton__card-image" />
          <div className="ui-skeleton__card-content">
            <div className="ui-skeleton__line" style={{ width: '70%' }} />
            <div className="ui-skeleton__line" style={{ width: '50%' }} />
          </div>
        </>
      )}
    </div>
  );
};

// Skeleton Group
export const SkeletonGroup = ({ count = 3, children }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {children}
        </React.Fragment>
      ))}
    </>
  );
};

export default Skeleton;