/**
 * 🛫 Error Handling System
 * 
 * نظام معالجة الأخطاء الشامل
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = useCallback((error) => {
    const errorObj = {
      id: Date.now(),
      message: error.message || 'حدث خطأ غير متوقع',
      type: error.type || 'error',
      duration: error.duration || 5000
    };

    setErrors(prev => [...prev, errorObj]);

    if (errorObj.duration > 0) {
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e.id !== errorObj.id));
      }, errorObj.duration);
    }

    return errorObj.id;
  }, []);

  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);

  const showError = useCallback((message, options = {}) => {
    return addError({ message, type: 'error', ...options });
  }, [addError]);

  const showSuccess = useCallback((message, options = {}) => {
    return addError({ message, type: 'success', duration: 3000, ...options });
  }, [addError]);

  const showWarning = useCallback((message, options = {}) => {
    return addError({ message, type: 'warning', ...options });
  }, [addError]);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, showError, showSuccess, showWarning }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
};

// Error Boundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <span>⚠️</span>
          <h2>حدث خطأ</h2>
          <button onClick={this.handleRetry}>إعادة المحاولة</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network error handler
export const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    return { message: 'لا يوجد اتصال بالإنترنت', type: 'warning' };
  }

  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400: return { message: 'طلب غير صالح', type: 'error' };
      case 401: return { message: 'يرجى تسجيل الدخول مرة أخرى', type: 'warning' };
      case 403: return { message: 'ليست لديك صلاحية', type: 'error' };
      case 404: return { message: 'البيانات غير موجودة', type: 'info' };
      case 500: return { message: 'خطأ في الخادم', type: 'error' };
      default: return { message: 'حدث خطأ', type: 'error' };
    }
  }

  return { message: 'فشل الاتصال', type: 'error' };
};

export default { ErrorProvider, useError, ErrorBoundary, handleNetworkError };