import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/me/stats'),
      ])
      setUser(userRes.data)
      setStats(statsRes.data)
      setForm(userRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/me', form)
      setEditing(false)
      fetchProfile()
    } catch (err) {
      alert('خطأ في التحديث')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user?.username}</h1>
            <p className="text-purple-200">{user?.email}</p>
            <div className="flex gap-4 mt-4">
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                🪙 {user?.points || 0} نقطة
              </span>
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                📦 {stats?.totalBoxes || 0} صندوق
              </span>
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                🎁 {stats?.totalPrizes || 0} جائزة
              </span>
            </div>
          </div>
          <button 
            onClick={() => setEditing(!editing)}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-50"
          >
            {editing ? 'إلغاء' : 'تعديل'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400">{stats?.wins || 0}</div>
          <div className="text-gray-400">انتصارات</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">{stats?.totalSpent || 0}</div>
          <div className="text-gray-400">مجموع الإنفاق</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats?.totalWon || 0}</div>
          <div className="text-gray-400">قيمة الجوائز</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats?.winRate || 0}%</div>
          <div className="text-gray-400">نسبة الفوز</div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">تعديل الملف الشخصي</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">اسم المستخدم</label>
                <input
                  type="text"
                  value={form.username || ''}
                  onChange={e => setForm({...form, username: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={form.phone || ''}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <button type="submit" className="bg-purple-600 px-8 py-2 rounded-lg hover:bg-purple-700">
              حفظ التغييرات
            </button>
          </form>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">النشاط الأخير</h2>
        <div className="space-y-3">
          {stats?.recentActivity?.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <div className="font-bold">{activity.title}</div>
                <div className="text-sm text-gray-400">{activity.description}</div>
              </div>
              <div className="text-gray-400 text-sm">{activity.time}</div>
            </div>
          ))}
          {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
            <p className="text-gray-500 text-center py-8">لا يوجد نشاط حديث</p>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">🏆 الإنجازات</h2>
        <div className="grid grid-cols-4 gap-4">
          {stats?.achievements?.map((achievement, i) => (
            <div key={i} className={`p-4 rounded-xl text-center ${achievement.unlocked ? 'bg-yellow-900/50' : 'bg-gray-700 opacity-50'}`}>
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="font-bold text-sm">{achievement.name}</div>
              {achievement.unlocked && <div className="text-xs text-green-400">مفتوح</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}