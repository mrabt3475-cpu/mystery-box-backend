import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'
import { useSoundEffects } from '../context/SoundContext'
import { useVFX } from '../context/VFXContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { onHover, onClick } = useSoundEffects()
  const { addEffect, winPrize } = useVFX()

  useEffect(() => { fetchOrders() }, [filter])

  const fetchOrders = async () => {
    try {
      const url = filter === 'all' ? '/orders' : `/orders?status=${filter}`
      const res = await api.get(url)
      setOrders(res.data)
    } catch (err) {
      setOrders([
        { _id: '1', orderNumber: '1001', total: 99, status: 'delivered', createdAt: new Date(), items: [{ name: 'آيفون 15', price: 99, image: '📱', pointsReward: 5 }] },
        { _id: '2', orderNumber: '1002', total: 149, status: 'shipped', createdAt: new Date(), items: [{ name: 'ماك', price: 149, image: '💻', pointsReward: 7 }] },
        { _id: '3', orderNumber: '1003', total: 79, status: 'processing', createdAt: new Date(), items: [{ name: 'سماعات', price: 79, image: '🎧', pointsReward: 4 }] },
      ])
    } finally { setLoading(false) }
  }

  const handleFilterChange = (status) => {
    setFilter(status)
    onClick()
    addEffect('sparkle', { count: 8, duration: 800 })
  }

  const getStatusColor = (status) => {
    switch (status) { case 'delivered': return 'from-emerald-500 to-green-600'; case 'shipped': return 'from-blue-500 to-cyan-600'; case 'processing': return 'from-yellow-500 to-orange-600'; case 'cancelled': return 'from-red-500 to-pink-600'; default: return 'from-gray-500 to-slate-600'; }
  }

  const getStatusText = (status) => {
    switch (status) { case 'delivered': return 'تم التسليم'; case 'shipped': return 'تم الشحن'; case 'processing': return 'قيد التجهيز'; case 'cancelled': return 'ملغى'; default: return status; }
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="loading-dots"><span></span><span></span><span></span></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s`, animationDuration: `${15 + Math.random() * 10}s` }} />
        ))}
      </div>

      <header className="flex justify-between items-center mb-8" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-4xl font-bold mb-2"><span className="shimmer-text">طلباتي</span></h1>
          <p className="text-xl text-gray-400">تتبع طلباتك وشحناتها</p>
        </div>
        <Link to="/" onClick={onClick} className="glass-premium px-6 py-3 hover:bg-white/10 transition">← رجوع</Link>
      </header>

      <div className="flex gap-3 mb-6" style={{ position: 'relative' }}>
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button key={status} onClick={() => handleFilterChange(status)} onMouseEnter={onHover}
            className={`category-card px-5 py-2 rounded-xl font-bold transition ${
              filter === status ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black' : 'glass-premium text-gray-400 hover:text-white'`}>
            {status === 'all' ? 'الكل' : getStatusText(status)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 glass-premium cursor-pointer" onClick={() => { onClick(); addEffect('particles', { count: 30, colors: ['#d4af37', '#8b5cf6'] }) }}>
            <div className="text-8xl mb-6 float-3d">📦</div>
            <h2 className="text-3xl font-bold mb-4">لا توجد طلبات</h2>
            <p className="text-gray-400 mb-8">ابدأ التسوق الآن!</p>
            <Link to="/shop" onClick={onClick} className="btn-3d btn-premium">تسوق الآن</Link>
          </div>
        ) : (
          orders.map((order, i) => (
            <div key={order._id} className="glass-premium overflow-hidden fade-in-up card-3d" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="glass-premium p-4 flex justify-between items-center cursor-pointer" onClick={() => { onClick(); addEffect('glow', { color: '#8b5cf6', duration: 500 }) }}>
                <div>
                  <span className="font-bold text-lg">طلب #{order.orderNumber}</span>
                  <span className="text-gray-400 mr-4">{new Date(order.createdAt).toLocaleDateString('ar')}</span>
                </div>
                <span className={`px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="p-5">
                <div className="space-y-3 mb-5">
                  {order.items?.map((item, j) => (
                    <div key={j} className="flex items-center gap-4 cursor-pointer" onClick={() => { onClick(); winPrize('rare') }}>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center text-3xl">
                        {item.image || '📦'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-400">الكمية: {item.quantity || 1}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${item.price}</div>
                        {item.pointsReward > 0 && <div className="text-emerald-400 text-sm">+{item.pointsReward} 🪙</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-400">المجموع: </span>
                    <span className="text-2xl font-bold shimmer-text">${order.total}</span>
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
