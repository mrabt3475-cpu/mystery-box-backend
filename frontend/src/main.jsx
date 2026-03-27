import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider, ReactQueryDevtools } from '@tanstack/react-query'
import { queryClient } from './hooks/useQueries'
import App from './App'
import './index.css'

// Error Boundary for catching React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          background: '#0a0a0a',
          color: '#fff',
          fontFamily: 'system-ui'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>حدث خطأ ما</h1>
          <p style={{ color: '#666' }}>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '12px 24px',
              background: '#d4af37',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Performance monitoring
const reportWebVitals = (metric) => {
  console.log('[Performance]', metric)
  // Send to analytics in production
  // if (process.env.NODE_ENV === 'production') {
  //   analytics.track(metric.name, metric.value)
  // }
}

// Mount app
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)

// Enable hot module replacement in development
if (module.hot) {
  module.hot.accept()
}
