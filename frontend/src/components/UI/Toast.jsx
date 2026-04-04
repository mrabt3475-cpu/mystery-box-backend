/**
 * 🎨 Toast Component
 * 
 * إشعارات منبثقة قابلة للتخصيص
 * 
 * Props:
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - title: string
 * - message: string
 * - duration: number (ms)
 * - onClose: function
 */

import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div 
      className={`
        toast toast--${type} 
        ${isVisible ? 'toast--visible' : ''} 
        ${isLeaving ? 'toast--leaving' : ''} 
        ${className}
      `}
      {...props}
    >
      <span className="toast__icon">{icons[type]}</span>
      
      <div className="toast__content">
        {title && <h4 className="toast__title">{title}</h4>}
        {message && <p className="toast__message">{message}</p>}
      </div>
      
      <button className="toast__close" onClick={handleClose}>
        ✕
      </button>
      
      <div className="toast__progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
};

// Toast Container
export const ToastContainer = ({
  toasts = [],
  position = 'top-right',
  className = '',
  ...props
}) => {
  return (
    <div className={`toast-container toast-container--${position} ${className}`} {...props}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

// Toast Context (for global usage)
import { createContext, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title, message) => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title, message) => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title, message) => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title, message) => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {children}
    </ToastContext.Provider>
  );
};

export default Toast;