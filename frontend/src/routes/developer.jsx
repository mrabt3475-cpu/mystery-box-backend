import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DeveloperDashboard from './pages/developer/Dashboard'
import ApiKeys from './pages/developer/ApiKeys'
import Webhooks from './pages/developer/Webhooks'
import UsageAnalytics from './pages/developer/UsageAnalytics'
import ApiDocs from './pages/developer/ApiDocs'
import Character3DImport from './pages/developer/Character3DImport'

function DeveloperRoutes() {
  return (
    <Routes>
      <Route path="/developer" element={<DeveloperDashboard />} />
      <Route path="/developer/keys" element={<ApiKeys />} />
      <Route path="/developer/webhooks" element={<Webhooks />} />
      <Route path="/developer/analytics" element={<UsageAnalytics />} />
      <Route path="/developer/docs" element={<ApiDocs />} />
      <Route path="/developer/3d-import" element={<Character3DImport />} />
    </Routes>
  )
}

export default DeveloperRoutes
