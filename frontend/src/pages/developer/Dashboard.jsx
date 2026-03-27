import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function DeveloperDashboard() {
  const [developer, setDeveloper] = useState(null)
  const [keys, setKeys] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, keysRes, statsRes] = await Promise.all([
        api.get('/developer/profile'),
        api.get('/developer/keys'),
        api.get('/developer/usage/stats'),
      ])
      setDeveloper(profileRes.data)
      setKeys(keysRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🎮 لوحة تحكم المطورين</h1>
          <p className="text-gray-400">إدارة مفاتيح API والإحصائيات</p>
        </div>
        <Link to="/developer/keys" className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700">
          + إنشاء مفتاح جديد
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-500">{stats?.totalRequests || 0}</div>
          <div className="text-gray-400">إجمالي الطلبات</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-500">{stats?.successRequests || 0}</div>
          <div className="text-gray-400">ناجحة</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-red-500">{stats?.failedRequests || 0}</div>
          <div className="text-gray-400">فاشلة</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-500">{Math.round(stats?.avgResponseTime || 0)}ms</div>
          <div className="text-gray-400">متوسط الاستجابة</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">🔑 مفاتيح API</h2>
        {keys.length === 0 ? (
          <p className="text-gray-400">لا توجد مفاتيح</p>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div key={key._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold">{key.name}</div>
                  <div className="text-sm text-gray-400">{key.keyPrefix}...</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded ${key.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                    {key.isActive ? 'نشط' : 'معطل'}
                  </span>
                  <span className="text-gray-400">{key.requestsCount} طلب</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}