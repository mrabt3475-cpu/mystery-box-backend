/**
 * 🎨 Modal Component
 * 
 * نافذة منبثقة قابلة للتخصيص
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - title: string
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * - variant: 'default' | 'glass' | 'gradient'
 * - closeOnOverlay: boolean
 * - showCloseButton: boolean
 * - footer: ReactNode
 */

import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closeOnOverlay = true,
  showCloseButton = true,
  footer,
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeOnOverlay ? onClose : undefined}>
      <div 
        ref={modalRef}
        className={`modal modal--${size} modal--${variant} ${className}`}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            {showCloseButton && (
              <button className="modal__close" onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}
        
        <div className="modal__body">
          {children}
        </div>
        
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirm Modal
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'تأكيد',
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  type = 'warning',
  loading = false
}) => {
  const icons = {
    warning: '⚠️',
    danger: '🛑',
    info: 'ℹ️',
    success: '✅'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="confirm-modal">
        <span className="confirm-modal__icon">{icons[type]}</span>
        <p className="confirm-modal__message">{message}</p>
        
        <div className="confirm-modal__actions">
          <button 
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--${type}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;