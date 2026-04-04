/**
 * 🎨 Dropdown Component
 * 
 * قائمة منسدلة قابلة للتخصيص
 */

import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({
  trigger,
  children,
  position = 'bottom-left',
  align = 'start',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const classes = [
    'ui-dropdown',
    `ui-dropdown--${position}`,
    `ui-dropdown--align-${align}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-dropdown-wrapper" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={classes} {...props}>
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item
export const DropdownItem = ({
  children,
  icon,
  onClick,
  danger = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`ui-dropdown__item ${danger ? 'danger' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="ui-dropdown__item-icon">{icon}</span>}
      <span className="ui-dropdown__item-label">{children}</span>
    </button>
  );
};

// Dropdown Menu
export const DropdownMenu = ({ children, className = '', ...props }) => (
  <div className={`ui-dropdown__menu ${className}`} {...props}>
    {children}
  </div>
);

// Dropdown Divider
export const DropdownDivider = () => (
  <div className="ui-dropdown__divider" />
);

export default Dropdown;