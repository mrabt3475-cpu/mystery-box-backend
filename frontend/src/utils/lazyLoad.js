// Lazy Loading & Code Splitting
// ============================

import React, { Suspense, lazy } from 'react'
import { Spin } from 'antd'

// Lazy load pages
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Boxes = lazy(() => import('../pages/Boxes'))
const Shop = lazy(() => import('../pages/Shop'))
const Wallet = lazy(() => import('../pages/Wallet'))
const Profile = lazy(() => import('../pages/Profile'))
const Leaderboard = lazy(() => import('../pages/Leaderboard'))
const Orders = lazy(() => import('../pages/Orders'))
const Referral = lazy(() => import('../pages/Referral'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Loading component
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <Spin size="large" />
      <p style={{ color: '#888' }}>جاري التحميل...</p>
    </div>
  )
}

// Error boundary for lazy components
class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Async error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px'
        }}>
          <h2>فشل تحميل الصفحة</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: '#d4af37',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Lazy wrapper component
function LazyWrapper({ component: Component, ...props }) {
  return (
    <AsyncErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    </AsyncErrorBoundary>
  )
}

// Export lazy components
export const LazyPages = {
  Login: (props) => <LazyWrapper component={Login} {...props} />,
  Register: (props) => <LazyWrapper component={Register} {...props} />,
  Dashboard: (props) => <LazyWrapper component={Dashboard} {...props} />,
  Boxes: (props) => <LazyWrapper component={Boxes} {...props} />,
  Shop: (props) => <LazyWrapper component={Shop} {...props} />,
  Wallet: (props) => <LazyWrapper component={Wallet} {...props} />,
  Profile: (props) => <LazyWrapper component={Profile} {...props} />,
  Leaderboard: (props) => <LazyWrapper component={Leaderboard} {...props} />,
  Orders: (props) => <LazyWrapper component={Orders} {...props} />,
  Referral: (props) => <LazyWrapper component={Referral} {...props} />,
  NotFound: (props) => <LazyWrapper component={NotFound} {...props} />,
}

export { PageLoader, AsyncErrorBoundary }
