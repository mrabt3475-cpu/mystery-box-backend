import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

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
          <h1 className="text-4xl font-bold gold-gradient">المحفظة</h1>
          <p className="text-xl text-gray-400">إدارة نقاطك وأموالك</p>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="stat-card glow-pulse fade-in-up stagger-1">
          <div className="text-amber-200 mb-3 text-lg">🪙 نقاطي</div>
          <div className="text-5xl font-bold gold-gradient">{wallet?.points?.toLocaleString() || 0}</div>
          <div className="text-amber-200/60 text-sm mt-3">للاستخدام في فتح الصناديق</div>
        </div>
        <div className="stat-card fade-in-up stagger-2">
          <div className="text-blue-200 mb-3 text-lg">💵 رصيد USDT</div>
          <div className="text-5xl font-bold text-blue-400">{wallet?.usdtBalance?.toFixed(2) || '0.00'}</div>
          <div className="text-blue-200/60 text-sm mt-3">متاح للسحب</div>
        </div>
        <div className="stat-card fade-in-up stagger-3">
          <div className="text-purple-200 mb-3 text-lg">🎁 مكافآت</div>
          <div className="text-5xl font-bold text-purple-400">{wallet?.bonusBalance?.toFixed(2) || '0.00'}</div>
          <div className="text-purple-200/60 text-sm mt-3">مكافآت الإحالة والولاء</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <button className="glass-card p-6 text-center hover:bg-emerald-500/20 transition group">
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">💳</div>
          <div className="font-bold">إيداع</div>
        </button>
        <button className="glass-card p-6 text-center hover:bg-red-500/20 transition group">
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">↩️</div>
          <div className="font-bold">سحب</div>
        </button>
        <button className="glass-card p-6 text-center hover:bg-blue-500/20 transition group">
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">🔄</div>
          <div className="font-bold">تحويل</div>
        </button>
        <button className="glass-card p-6 text-center hover:bg-purple-500/20 transition group">
          <div className="text-4xl mb-3 group-hover:transform group-hover:scale-110 transition">📊</div>
          <div className="font-bold">سجل</div>
        </button>
      </div>

      {/* Transactions */}
      <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold mb-6">📜 أحدث المعاملات</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-12">لا توجد معاملات</p>
          ) : (
            transactions.map((tx, i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                  tx.type === 'withdraw' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                  tx.type === 'purchase' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'
                }`}>
                  {tx.type === 'deposit' ? '💳' : tx.type === 'withdraw' ? '↩️' : tx.type === 'purchase' ? '🛒' : '🎁'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{tx.description}</div>
                  <div className="text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString('ar')}</div>
                </div>
                <div className={`font-bold text-xl ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
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