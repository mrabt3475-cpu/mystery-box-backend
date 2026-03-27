import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
      const url = filter === 'all' ? '/orders' : `/orders?status=${filter}`
      const res = await api.get(url)
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-600'
      case 'shipped': return 'bg-blue-600'
      case 'processing': return 'bg-yellow-600'
      case 'cancelled': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'تم التسليم'
      case 'shipped': return 'تم الشحن'
      case 'processing': return 'قيد التجهيز'
      case 'cancelled': return 'ملغى'
      default: return status
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">📦 طلباتي</h1>
          <p className="text-gray-400">تتبع طلباتك وشحناتها</p>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status === 'all' ? 'الكل' : getStatusText(status)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">لا توجد طلبات</h2>
            <p className="text-gray-400">ابدأ التسوق الآن!</p>
            <Link to="/shop" className="inline-block mt-4 bg-purple-600 px-6 py-2 rounded-lg">
              تسوق الآن
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-gray-800 rounded-2xl overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-700 p-4 flex justify-between items-center">
                <div>
                  <span className="font-bold">طلب #{order.orderNumber}</span>
                  <span className="text-gray-400 mr-4">{new Date(order.createdAt).toLocaleDateString('ar')}</span>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                        {item.image || '📦'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-400">الكمية: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${item.price}</div>
                        {item.pointsReward > 0 && (
                          <div className="text-green-400 text-sm">+{item.pointsReward} نقطة</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-400">المجموع: </span>
                    <span className="text-xl font-bold">${order.total}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="text-sm">
                      <span className="text-gray-400">رقم التتبع: </span>
                      <span className="font-mono">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}