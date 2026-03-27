import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DeveloperDashboard from './pages/developer/Dashboard'
import ApiKeys from './pages/developer/ApiKeys'
import Webhooks from './pages/developer/Webhooks'
import UsageAnalytics from './pages/developer/UsageAnalytics'
import ApiDocs from './pages/developer/ApiDocs'

function DeveloperRoutes() {
  return (
    <Routes>
      <Route path="/developer" element={<DeveloperDashboard />} />
      <Route path="/developer/keys" element={<ApiKeys />} />
      <Route path="/developer/webhooks" element={<Webhooks />} />
      <Route path="/developer/analytics" element={<UsageAnalytics />} />
      <Route path="/developer/docs" element={<ApiDocs />} />
    </Routes>
  )
}

export default DeveloperRoutes