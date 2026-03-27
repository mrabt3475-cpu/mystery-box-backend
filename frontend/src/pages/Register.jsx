import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      setLoading(false)
      return
    }

    try {
      const data = {
        username: form.username,
        email: form.email,
        password: form.password,
      }
      if (form.referralCode) {
        data['referralCode'] = form.referralCode
      }

      const res = await api.post('/auth/register', data)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="premium-bg min-h-screen flex items-center justify-center p-4 py-12">
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
          <p className="text-xl text-gray-400">أنشئ حسابك وابدأ الربح!</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                placeholder="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
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
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">كود الإحالة (اختياري)</label>
              <input
                type="text"
                value={form.referralCode}
                onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                placeholder="ABCD1234"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded bg-black/30 border-white/20" />
              <span className="text-sm text-gray-400">
                أوافق على <Link to="/terms" className="text-amber-400 hover:text-amber-300">الشروط</Link> و <Link to="/privacy" className="text-amber-400 hover:text-amber-300">الخصوصية</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-4 text-lg"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">لديك حساب بالفعل؟ </span>
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold transition">
              سجل دخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}