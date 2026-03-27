import { useState, useEffect } from 'react'
import api from '../services/api'

export default function KeyAnalytics() {
  const [keys, setKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    api.get('/developer/keys').then(res => {
      setKeys(res.data)
      if (res.data.length > 0) {
        selectKey(res.data[0]._id)
      }
    })
  }, [])

  const selectKey = async (keyId) => {
    setSelectedKey(keyId)
    const res = await api.get(`/analytics/key/${keyId}`)
    setAnalytics(res.data)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">📊 تحليلات المفاتيح</h1>

      {/* Key Selector */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">اختر مفتاح API</h2>
        <div className="flex gap-4 flex-wrap">
          {keys.map(key => (
            <button
              key={key._id}
              onClick={() => selectKey(key._id)}
              className={`px-6 py-3 rounded-lg ${
                selectedKey === key._id
                  ? 'bg-purple-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {key.name}
            </button>
          ))}
        </div>
      </div>

      {selectedKey && analytics && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-500">{analytics.totalRequests}</div>
              <div className="text-gray-400">إجمالي الطلبات</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-500">{Math.round(analytics.successRate)}%</div>
              <div className="text-gray-400">نسبة النجاح</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-500">{Math.round(analytics.avgResponseTime)}ms</div>
              <div className="text-gray-400">متوسط الاستجابة</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-orange-500">
                {analytics.dailyUsage?.reduce((sum, d) => sum + d.requests, 0) || 0}
              </div>
              <div className="text-gray-400">طلبات اليوم</div>
            </div>
          </div>

          {/* Daily Chart */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">📈 الطلبات اليومية</h2>
            <div className="h-48 flex items-end gap-2">
              {analytics.dailyUsage?.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-purple-600 rounded-t"
                    style={{ height: `${Math.min((d.requests / 100) * 100, 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}