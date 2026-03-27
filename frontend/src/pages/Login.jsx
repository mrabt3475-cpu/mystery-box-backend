import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="premium-bg min-h-screen flex items-center justify-center p-4">
      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-2 shimmer" style={{ letterSpacing: '8px }}>
            ATHENA
          </h1>
          <p className="text-xl text-gray-400">سجل دخولك للمتابعة</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-3">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-amber-500 transition text-lg"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">كلمة المرور</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-amber-500 transition text-lg"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded bg-black/30 border-white/20" />
                <span className="text-gray-400">تذكرني</span>
              </label>
              <Link to="/forgot-password" className="text-amber-400 hover:text-amber-300 transition">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-4 text-lg"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-400">ليس لديك حساب؟ </span>
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold transition">
              سجل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}