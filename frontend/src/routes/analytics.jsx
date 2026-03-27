import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AnalyticsDashboard from './pages/developer/AnalyticsDashboard'
import KeyAnalytics from './pages/developer/KeyAnalytics'

export default function AnalyticsRoutes() {
  return (
    <Routes>
      <Route path="/developer/analytics" element={<AnalyticsDashboard />} />
      <Route path="/developer/analytics/keys" element={<KeyAnalytics />} />
    </Routes>
  )
}