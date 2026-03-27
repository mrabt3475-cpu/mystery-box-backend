import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [prizes, setPrizes] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [userRes, ordersRes, prizesRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/orders'),
        api.get('/users/prizes'),
      ])
      setUser(userRes.data)
      setOrders(ordersRes.data)
      setPrizes(prizesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: '👤' },
    { id: 'orders', label: 'الطلبات', icon: '📦' },
    { id: 'prizes', label: 'الجوائز', icon: '🏆' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">👤 ملفي الشخصي</h1>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex gap-4 mt-4">
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-yellow-400 font-bold">{user?.points || 0}</span>
                <span className="text-gray-400 mr-1">نقطة</span>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-green-400 font-bold">{user?.totalWins || 0}</span>
                <span className="text-gray-400 mr-1">مكسب</span>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-blue-400 font-bold">#{user?.rank || '-'}</span>
                <span className="text-gray-400 mr-1">ترتيب</span>
              </div>
            </div>
          </div>
          <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition">
            تعديل الملف
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-2xl p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-gray-400 mb-2">إجمالي أنفقت</h3>
              <p className="text-3xl font-bold">${user?.totalSpent || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-gray-400 mb-2">الصناديق المفتوحة</h3>
              <p className="text-3xl font-bold">{user?.totalBoxes || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-gray-400 mb-2">قيمة الجوائز</h3>
              <p className="text-3xl font-bold">${user?.totalWinnings || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد طلبات</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="bg-gray-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">طلب #{order.orderNumber}</div>
                    <div className="text-sm text-gray-400">{order.items?.length} منتجات</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${order.total}</div>
                    <div className={`text-sm ${
                      order.status === 'delivered' ? 'text-green-400' :
                      order.status === 'shipped' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>
                      {order.status === 'delivered' ? 'تم التسليم' :
                       order.status === 'shipped' ? 'تم الشحن' : 'قيد التجهيز'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="grid grid-cols-4 gap-4">
            {prizes.length === 0 ? (
              <p className="text-gray-500 text-center py-8 col-span-4">لا توجد جوائز</p>
            ) : (
              prizes.map((prize, i) => (
                <div key={i} className="bg-gray-700 rounded-xl p-4 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    prize.rarity === 'legendary' ? 'bg-yellow-600' :
                    prize.rarity === 'epic' ? 'bg-purple-600' :
                    prize.rarity === 'rare' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {prize.rarity === 'legendary' ? '👑' : '🎁'}
                  </div>
                  <div className="font-bold">{prize.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{prize.rarity}</div>
                  <div className="text-yellow-400 text-sm mt-1">${prize.value}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-xl">
              <div>
                <div className="font-bold">الإشعارات</div>
                <div className="text-sm text-gray-400">استلم إشعارات بالجوائز الجديدة</div>
              </div>
              <button className="w-12 h-6 bg-purple-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-xl">
              <div>
                <div className="font-bold">المحفظة</div>
                <div className="text-sm text-gray-400">إدارة نقاطك ومحفظة التون</div>
              </div>
              <Link to="/wallet" className="text-purple-400 hover:text-purple-300">→</Link>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-xl">
              <div>
                <div className="font-bold">الإحالة</div>
                <div className="text-sm text-gray-400">دعوة أصدقاء واكسب نقاط</div>
              </div>
              <Link to="/referral" className="text-purple-400 hover:text-purple-300">→</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}