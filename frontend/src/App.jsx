import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Boxes from './pages/Boxes'
import OpenBox from './pages/OpenBox'
import Products from './pages/Products'
import Wallet from './pages/Wallet'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Login />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="boxes" element={<Boxes />} />
          <Route path="open-box/:id" element={<OpenBox />} />
          <Route path="products" element={<Products />} />
          <Route path="wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
