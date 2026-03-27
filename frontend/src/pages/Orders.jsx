import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data))
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-500',
      processing: 'text-blue-500',
      shipped: 'text-purple-500',
      delivered: 'text-green-500',
    }
    return colors[status] || 'text-gray-500'
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">طلباتي</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold">طلب #{order._id.slice(-8)}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('ar')}
                </div>
              </div>
              <div className={`font-bold ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="text-purple-500 font-bold">{order.totalPoints} نقطة</div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center text-gray-400 py-20">لا توجد طلبات</div>
        )}
      </div>
    </div>
  )
}
