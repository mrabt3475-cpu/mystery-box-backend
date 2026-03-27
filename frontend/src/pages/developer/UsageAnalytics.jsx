import { useState, useEffect } from 'react'
import api from '../services/api'

export default function UsageAnalytics() {
  const [stats, setStats] = useState(null)
  const [hourly, setHourly] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/developer/usage/stats'),
      api.get('/developer/usage/hourly')
    ]).then(([s, h]) => { setStats(s.data); setHourly(h.data) })
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">📊 التحليلات</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-500">{stats?.totalRequests || 0}</div>
          <div className="text-gray-400">إجمالي</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-500">{stats?.successRequests || 0}</div>
          <div className="text-gray-400">ناجح</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-red-500">{stats?.failedRequests || 0}</div>
          <div className="text-gray-400">فاشل</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-500">{Math.round(stats?.avgResponseTime || 0)}ms</div>
          <div className="text-gray-400">الاستجابة</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">📈 آخر 24 ساعة</h2>
        <div className="h-48 flex items-end gap-1">
          {hourly.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-600 rounded-t" style={{ height: `${Math.min(h.requests || 1, 100)}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}