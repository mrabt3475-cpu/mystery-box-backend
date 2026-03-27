// Enhanced Error Handling Service
// ==============================

class ErrorHandler {
  constructor() {
    this.errors = []
    this.maxErrors = 50
  }

  // Handle API error
  handleAPIError(error, context = '') {
    const { response, request, message } = error
    
    let errorInfo = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      context,
      type: 'unknown',
      message: 'حدث خطأ غير متوقع',
      details: null,
      status: null,
      recoverable: false
    }

    // Network error
    if (!response && !request) {
      errorInfo.type = 'network'
      errorInfo.message = 'لا يوجد اتصال بالإنترنت'
      errorInfo.recoverable = true
    }
    // HTTP error
    else if (response) {
      errorInfo.status = response.status
      errorInfo.details = response.data

      switch (response.status) {
        case 400:
          errorInfo.type = 'validation'
          errorInfo.message = response.data?.message || 'بيانات غير صالحة'
          break
        case 401:
          errorInfo.type = 'auth'
          errorInfo.message = 'انتهت الجلسة، يرجى تسجيل الدخول'
          errorInfo.recoverable = true
          break
        case 403:
          errorInfo.type = 'forbidden'
          errorInfo.message = 'ليس لديك صلاحية لهذا الإجراء'
          break
        case 404:
          errorInfo.type = 'not_found'
          errorInfo.message = 'البيانات المطلوبة غير موجودة'
          break
        case 422:
          errorInfo.type = 'validation'
          errorInfo.message = response.data?.message || 'بيانات غير صالحة'
          break
        case 429:
          errorInfo.type = 'rate_limit'
          errorInfo.message = 'طلبات كثيرة جداً، يرجى المحاولة لاحقاً'
          errorInfo.recoverable = true
          break
        case 500:
          errorInfo.type = 'server'
          errorInfo.message = 'خطأ في الخادم'
          errorInfo.recoverable = true
          break
        default:
          errorInfo.message = response.data?.message || 'حدث خطأ'
      }
    }
    // Request error
    else if (request) {
      errorInfo.type = 'request'
      errorInfo.message = 'فشل في إرسال الطلب'
      errorInfo.recoverable = true
    }

    // Log error
    this.logError(errorInfo)
    
    // Show notification
    this.showNotification(errorInfo)

    return errorInfo
  }

  // Log error
  logError(errorInfo) {
    this.errors.push(errorInfo)
    
    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Console logging
    console.error('[ERROR]', errorInfo)
  }

  // Show notification
  showNotification(errorInfo) {
    // Use the UI store or dispatch event
    window.dispatchEvent(new CustomEvent('app-error', { 
      detail: errorInfo 
    }))
  }

  // Get recent errors
  getRecentErrors() {
    return this.errors.slice(-10)
  }

  // Clear errors
  clearErrors() {
    this.errors = []
  }

  // Retry handler
  async retryWithBackoff(fn, maxRetries = 3) {
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        const delay = Math.min(1000 * Math.pow(2, i), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }
}

export const errorHandler = new ErrorHandler()

export default errorHandler
