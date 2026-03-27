import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Wallet() {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions'),
      ])
      setWallet(walletRes.data)
      setTransactions(txRes.data)
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">💰 المحفظة</h1>
          <p className="text-gray-400">إدارة نقاطك وأموالك</p>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6">
          <div className="text-yellow-200 mb-2">🪙 نقاطي</div>
          <div className="text-4xl font-bold">{wallet?.points?.toLocaleString() || 0}</div>
          <div className="text-yellow-200 text-sm mt-2">يمكن استخدامها لفتح الصناديق</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6">
          <div className="text-blue-200 mb-2">💵 رصيد USDT</div>
          <div className="text-4xl font-bold">{wallet?.usdtBalance?.toFixed(2) || '0.00'}</div>
          <div className="text-blue-200 text-sm mt-2">متاح للسحب</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6">
          <div className="text-purple-200 mb-2">🎁 مكافآت</div>
          <div className="text-4xl font-bold">{wallet?.bonusBalance?.toFixed(2) || '0.00'}</div>
          <div className="text-purple-200 text-sm mt-2">مكافآت الإحالة والولاء</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <button className="bg-green-600 hover:bg-green-500 p-4 rounded-xl transition flex flex-col items-center gap-2">
          <span className="text-2xl">💳</span>
          <span className="font-bold">إيداع</span>
        </button>
        <button className="bg-red-600 hover:bg-red-500 p-4 rounded-xl transition flex flex-col items-center gap-2">
          <span className="text-2xl">↩️</span>
          <span className="font-bold">سحب</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 p-4 rounded-xl transition flex flex-col items-center gap-2">
          <span className="text-2xl">🔄</span>
          <span className="font-bold">تحويل</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-500 p-4 rounded-xl transition flex flex-col items-center gap-2">
          <span className="text-2xl">📊</span>
          <span className="font-bold">سجل</span>
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">📜 أحدث المعاملات</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد معاملات</p>
          ) : (
            transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-700 p-4 rounded-xl">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-green-600' :
                  tx.type === 'withdraw' ? 'bg-red-600' :
                  tx.type === 'purchase' ? 'bg-blue-600' : 'bg-yellow-600'
                }`}>
                  {tx.type === 'deposit' ? '💳' : tx.type === 'withdraw' ? '↩️' : tx.type === 'purchase' ? '🛒' : '🎁'}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{tx.description}</div>
                  <div className="text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString('ar')}</div>
                </div>
                <div className={`font-bold ${
                  tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}