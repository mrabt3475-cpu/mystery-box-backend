import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Boxes from '../pages/Boxes'
import Shop from '../pages/Shop'
import Profile from '../pages/Profile'
import Wallet from '../pages/Wallet'
import Orders from '../pages/Orders'
import Leaderboard from '../pages/Leaderboard'
import Referral from '../pages/Referral'
import AdminDashboard from '../pages/admin/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/boxes" element={<Boxes />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/referral" element={<Referral />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  )
}