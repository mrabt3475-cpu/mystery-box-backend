import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast/ToastProvider';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Boxes from './pages/Boxes';
import OpenBox from './pages/OpenBox';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import ServicesMarketplace from './pages/services/ServicesMarketplace';
import CreateService from './pages/services/CreateService';
import ServiceDetail from './pages/services/ServiceDetail';
import MyServices from './pages/services/MyServices';
import GiftPoints from './pages/gift/GiftPoints';
import ApiKeys from './pages/ApiKeys';
import NotFound from './pages/NotFound';

// Developer Routes
import DeveloperRoutes from './routes/developer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/boxes" 
                element={
                  <ProtectedRoute>
                    <Boxes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/boxes/:id" 
                element={
                  <ProtectedRoute>
                    <OpenBox />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Services Routes */}
              <Route 
                path="/services" 
                element={
                  <ProtectedRoute>
                    <ServicesMarketplace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/services/create" 
                element={
                  <ProtectedRoute>
                    <CreateService />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/services/my" 
                element={
                  <ProtectedRoute>
                    <MyServices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/services/:id" 
                element={
                  <ProtectedRoute>
                    <ServiceDetail />
                  </ProtectedRoute>
                } 
              />

              {/* Gift Points */}
              <Route 
                path="/gift" 
                element={
                  <ProtectedRoute>
                    <GiftPoints />
                  </ProtectedRoute>
                } 
              />

              {/* API Keys */}
              <Route 
                path="/api-keys" 
                element={
                  <ProtectedRoute>
                    <ApiKeys />
                  </ProtectedRoute>
                } 
              />

              {/* Developer Routes */}
              <Route path="/developer/*" element={<DeveloperRoutes />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
