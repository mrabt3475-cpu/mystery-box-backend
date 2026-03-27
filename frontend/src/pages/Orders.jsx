import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

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
      case 'delivered': return 'from-emerald-500 to-green-600'
      case 'shipped': return 'from-blue-500 to-cyan-600'
      case 'processing': return 'from-yellow-500 to-orange-600'
      case 'cancelled': return 'from-red-500 to-pink-600'
      default: return 'from-gray-500 to-slate-600'
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
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="spinner-luxury"></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24">
      {/* Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
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

      {/* Header */}
      <header className="flex justify-between items-center mb-8" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-4xl font-bold gold-gradient">طلباتي</h1>
          <p className="text-xl text-gray-400">تتبع طلباتك وشحناتها</p>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Filters */}
      <div className="flex gap-3 mb-6" style={{ position: 'relative' }}>
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-xl font-bold transition ${
              filter === status
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                : 'glass-card text-gray-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'الكل' : getStatusText(status)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <div className="text-8xl mb-6 float">📦</div>
            <h2 className="text-3xl font-bold mb-4">لا توجد طلبات</h2>
            <p className="text-gray-400 mb-8">ابدأ التسوق الآن!</p>
            <Link to="/shop" className="btn-premium">
              تسوق الآن
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="glass-card overflow-hidden fade-in-up hover:transform hover:scale-[1.01] transition">
              {/* Order Header */}
              <div className="bg-black/30 p-4 flex justify-between items-center">
                <div>
                  <span className="font-bold text-lg">طلب #{order.orderNumber}</span>
                  <span className="text-gray-400 mr-4">{new Date(order.createdAt).toLocaleDateString('ar')}</span>
                </div>
                <span className={`px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-5">
                <div className="space-y-3 mb-5">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center text-3xl">
                        {item.image || '📦'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-400">الكمية: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${item.price}</div>
                        {item.pointsReward > 0 && (
                          <div className="text-emerald-400 text-sm">+{item.pointsReward} 🪙</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-400">المجموع: </span>
                    <span className="text-2xl font-bold gold-gradient">${order.total}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="text-sm">
                      <span className="text-gray-400">رقم التتبع: </span>
                      <span className="font-mono bg-black/30 px-3 py-1 rounded">{order.trackingNumber}</span>
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