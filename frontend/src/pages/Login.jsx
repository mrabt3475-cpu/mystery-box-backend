import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في تسجيل الدخول')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-gray-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">تسجيل دخول</h2>
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 py-3 rounded hover:bg-purple-700"
          >
            تسجيل دخول
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-purple-500 hover:underline">
            تسجيل جديد
          </Link>
        </p>
      </div>
    </div>
  )
}
