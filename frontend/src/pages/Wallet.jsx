import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'

export default function Wallet() {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([api.get('/wallet'), api.get('/wallet/transactions')])
      setWallet(walletRes.data)
      setTransactions(txRes.data)
    } catch (err) {
      setWallet({ points: 1250, usdtBalance: 50, bonusBalance: 25 })
      setTransactions([
        { _id: '1', type: 'deposit', amount: 100, currency: 'USD', description: 'إيداع', createdAt: new Date() },
        { _id: '2', type: 'purchase', amount: -50, currency: 'USD', description: 'شراء', createdAt: new Date() },
        { _id: '3', type: 'points', amount: 25, currency: 'Points', description: 'مكافأة نقاط', createdAt: new Date() },
      ])
    } finally { setLoading(false) }
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
          <h1 className="text-4xl font-bold mb-2"><span className="shimmer-text">المحفظة</span></h1>
          <p className="text-xl text-gray-400">إدارة نقاطك وأموالك</p>
        </div>
        <Link to="/" className="glass-premium px-6 py-3 hover:bg-white/10 transition">← رجوع</Link>
      </header>

      {/* Balance Cards - 3D */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { icon: '🪙', label: 'نقاطي', value: wallet?.points || 0, desc: 'للاستخدام في الصناديق', gradient: 'from-amber-500 to-orange-600', textColor: 'text-amber-400' },
          { icon: '💵', label: 'USDT', value: `$${wallet?.usdtBalance?.toFixed(2) || '0.00'}`, desc: 'متاح للسحب', gradient: 'from-blue-500 to-cyan-600', textColor: 'text-blue-400' },
          { icon: '🎁', label: 'مكافآت', value: `$${wallet?.bonusBalance?.toFixed(2) || '0.00'}`, desc: 'الإحالة والولاء', gradient: 'from-purple-500 to-pink-600', textColor: 'text-purple-400' },
        ].map((bal, i) => (
          <div key={i} className="stat-card card-3d glow-pulse fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bal.gradient} flex items-center justify-center text-2xl mb-3 float-3d`}>
              {bal.icon}
            </div>
            <div className="text-gray-400 mb-1">{bal.label}</div>
            <div className={`text-4xl font-bold ${bal.textColor}`}>{bal.value}</div>
            <div className="text-gray-500 text-sm mt-2">{bal.desc}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions - 3D Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '💳', label: 'إيداع', action: 'deposit', color: 'from-emerald-500 to-teal-600' },
          { icon: '↩️', label: 'سحب', action: 'withdraw', color: 'from-red-500 to-pink-600' },
          { icon: '🔄', label: 'تحويل', action: 'transfer', color: 'from-blue-500 to-cyan-600' },
          { icon: '📊', label: 'سجل', action: 'history', color: 'from-purple-500 to-pink-600' },
        ].map((btn, i) => (
          <button key={i} className="category-card glass-premium p-6 text-center hover:bg-white/10 transition group">
            <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${btn.color} flex items-center justify-center text-2xl float-3d`}>
              {btn.icon}
            </div>
            <div className="font-bold">{btn.label}</div>
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="glass-premium p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold mb-6">📜 أحدث المعاملات</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? <p className="text-gray-500 text-center py-12">لا توجد معاملات</p> :
            transactions.map((tx, i) => (
              <div key={i} className="category-card flex items-center gap-4 p-4 hover:bg-white/5 transition">
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
                <div className={`font-bold text-xl ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                </div>
              </div>
            ))}
          }
        </div>
      </div>
    </div>
  )
}
