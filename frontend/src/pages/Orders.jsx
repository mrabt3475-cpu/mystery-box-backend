import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const res = await api.get(`/orders${params}`)
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-600',
      processing: 'bg-blue-600',
      shipped: 'bg-purple-600',
      delivered: 'bg-green-600',
      cancelled: 'bg-red-600',
    }
    return colors[status] || 'bg-gray-600'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'قيد الانتظار',
      processing: 'قيد التجهيز',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغى',
    }
    return texts[status] || status
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📦 طلباتي</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${filter === f ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              {f === 'all' ? 'الكل' : getStatusText(f)}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">لا توجد طلبات</h2>
          <p className="text-gray-400">ابدأ بفتح صناديق للحصول على جوائز!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-lg">طلب #{order.orderNumber}</div>
                  <div className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString('ar')}</div>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                      🎁
                    </div>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-gray-400 text-sm">الكمية: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div>
                  <span className="text-gray-400">المجموع: </span>
                  <span className="text-xl font-bold text-green-400">{order.totalPoints} نقطة</span>
                </div>
                {order.trackingNumber && (
                  <div className="text-gray-400">
                    رقم التتبع: <code className="text-purple-400">{order.trackingNumber}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}