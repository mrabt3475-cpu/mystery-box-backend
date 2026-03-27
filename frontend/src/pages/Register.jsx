import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
          <p className="text-gray-400 mt-2">أنشئ حسابك وابدأ الربح!</p>
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
              <label className="block text-sm text-gray-400 mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
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

            <div>
              <label className="block text-sm text-gray-400 mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
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
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="ABCD1234"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded bg-gray-700 border-gray-600" />
              <span className="text-sm text-gray-400">
                أوافق على <Link to="/terms" className="text-purple-400">الشروط والأحكام</Link> و <Link to="/privacy" className="text-purple-400">سياسة الخصوصية</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition disabled:opacity-50"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">لديك حساب بالفعل؟ </span>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold">
              سجل دخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}