import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎰 PuzzleChain
          </h1>
          <p className="text-gray-400 mt-2">سجل دخولك للمتابعة</p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                <span className="text-sm text-gray-400">تذكرني</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition disabled:opacity-50"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">ليس لديك حساب؟ </span>
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold">
              سجل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}