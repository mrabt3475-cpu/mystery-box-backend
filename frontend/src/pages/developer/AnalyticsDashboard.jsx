import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState(null)
  const [realtime, setRealtime] = useState(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [days])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ov, rt] = await Promise.all([
        api.get(`/analytics/overview?days=${days}`),
        api.get('/analytics/realtime'),
      ])
      setOverview(ov.data)
      setRealtime(rt.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>

  const summary = overview?.summary || {}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 لوحة التحليلات</h1>
        <select value={days} onChange={e => setDays(parseInt(e.target.value))} className="bg-gray-700 px-4 py-2 rounded">
          <option value={7}>آخر 7 أيام</option>
          <option value={30}>آخر 30 يوم</option>
          <option value={90}>آخر 90 يوم</option>
        </select>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl">
          <div className="text-4xl font-bold">{realtime?.requestsLastHour || 0}</div>
          <div className="text-purple-200">طلب آخر ساعة</div>
          <div className="text-xs text-purple-300 mt-2">🟢 الوقت الفعلي</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl">
          <div className="text-4xl font-bold">{summary.totalRequests || 0}</div>
          <div className="text-green-200">إجمالي الطلبات</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl">
          <div className="text-4xl font-bold">{Math.round(summary.successRate || 0)}%</div>
          <div className="text-blue-200">نسبة النجاح</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-xl">
          <div className="text-4xl font-bold">{Math.round(summary.avgResponseTime || 0)}ms</div>
          <div className="text-orange-200">متوسط الاستجابة</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">⚡ أداء الاستجابة</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">المتوسط</span>
              <span className="font-bold text-purple-400">{Math.round(summary.avgResponseTime || 0)}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">P50 (Median)</span>
              <span className="font-bold">{Math.round(summary.p50ResponseTime || 0)}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">P95</span>
              <span className="font-bold text-yellow-400">{Math.round(summary.p95ResponseTime || 0)}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">P99</span>
              <span className="font-bold text-red-400">{Math.round(summary.p99ResponseTime || 0)}ms</span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📈 حالة الطلبات</h2>
          <div className="space-y-3">
            {overview?.statusDistribution?.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded text-sm ${
                  s.range === 200 ? 'bg-green-600' :
                  s.range === 300 ? 'bg-blue-600' :
                  s.range === 400 ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {s.range}s
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-20 text-left">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">📊 الاستخدام اليومي</h2>
        <div className="h-64 flex items-end gap-1">
          {overview?.dailyUsage?.slice(-14).map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                style={{ height: `${Math.min((d.requests / (summary.totalRequests / 30)) * 100, 100)}%` }}
                title={`${d.requests} طلب`}
              />
              <span className="text-xs text-gray-500 mt-1 transform -rotate-45">
                {d._id?.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">🏆 أكثر المسارات استخداماً</h2>
          <div className="space-y-3">
            {overview?.topEndpoints?.slice(0, 5).map((ep, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                <code className="flex-1 text-purple-400 bg-gray-700 px-3 py-2 rounded">{ep.endpoint}</code>
                <span className="font-bold">{ep.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">❌ الأخطاء الأخيرة</h2>
          <div className="space-y-3">
            {overview?.errors?.slice(0, 5).map((err, i) => (
              <div key={i} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between">
                  <code className="text-red-400">{err.endpoint}</code>
                  <span className="text-red-400 font-bold">{err.statusCode}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{err.count} occurrences</div>
              </div>
            ))}
            {(!overview?.errors || overview.errors.length === 0) && (
              <p className="text-gray-500 text-center py-8">لا توجد أخطاء 🎉</p>
            )}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={async () => {
            const res = await api.get('/analytics/export?format=csv')
            const blob = new Blob([res.data.data], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'analytics.csv'
            a.click()
          }}
          className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          📥 تصدير البيانات
        </button>
      </div>
    </div>
  )
}