import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ totalOrders: 0, pending: 0 })

  useEffect(() => {
    api.get('/orders/admin/all').then((res) => setOrders(res.data))
  }, [])

  const updateStatus = async (orderId, status) => {
    await api.post(`/orders/${orderId}/status`, { status })
    setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold">{orders.length}</div>
          <div className="text-gray-400">إجمالي الطلبات</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-yellow-500">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-gray-400">قيد الانتظار</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-500">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-gray-400">مُنجزة</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">الطلبات</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">طلب #{order._id.slice(-8)}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('ar')}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-purple-500 font-bold">{order.totalPoints} نقطة</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="bg-gray-700 px-3 py-1 rounded"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="processing">قيد التجهيز</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">مُنجز</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
