import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-purple-500">
                🎁 PuzzleChain
              </Link>
              <div className="flex space-x-4">
                <Link to="/boxes" className="hover:text-purple-400">الصناديق</Link>
                <Link to="/products" className="hover:text-purple-400">المنتجات</Link>
                <Link to="/leaderboard" className="hover:text-purple-400">الترتيب</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/wallet" className="hover:text-purple-400">
                    💰 {user?.points || 0} نقطة
                  </Link>
                  <Link to="/profile" className="hover:text-purple-400">
                    👤 {user?.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
                  >
                    تسجيل دخول
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  >
                    تسجيل جديد
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
