/**
 * 🎨 Tabs Component
 * 
 * علامات تبويب قابلة للتخصيص
 * 
 * Props:
 * - tabs: array of { id, label, icon, badge }
 * - activeTab: string
 * - onChange: function
 * - variant: 'default' | 'pills' | 'underline' | 'glass'
 * - size: 'sm' | 'md' | 'lg'
 */

import React from 'react';
import './Tabs.css';

const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const classes = [
    'ui-tabs',
    `ui-tabs--${variant}`,
    `ui-tabs--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`ui-tabs__tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="ui-tabs__icon">{tab.icon}</span>}
          <span className="ui-tabs__label">{tab.label}</span>
          {tab.badge !== undefined && (
            <span className="ui-tabs__badge">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
};

// Tab Panel
export const TabPanel = ({
  children,
  activeTab,
  tabId,
  className = '',
  ...props
}) => {
  if (activeTab !== tabId) return null;

  return (
    <div className={`ui-tab-panel ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Tabs;