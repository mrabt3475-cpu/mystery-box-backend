/**
 * 🎨 Layout Components
 */

import React from 'react';
import './Layout.css';

// Container
export const Container = ({ 
  children, 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`ui-container ui-container--${size} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Flex
export const Flex = ({ 
  children, 
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap,
  wrap = false,
  className = '', 
  ...props 
}) => {
  const style = {
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: gap ? `${gap * 4}px` : undefined
  };

  return (
    <div 
      className={`ui-flex ui-flex--${direction} ui-flex--align-${align} ui-flex--justify-${justify} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid
export const Grid = ({ 
  children, 
  columns = 3,
  gap = 4,
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`ui-grid ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 8}px`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default { Container, Flex, Grid };