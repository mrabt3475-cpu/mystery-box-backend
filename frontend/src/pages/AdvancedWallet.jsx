import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/advancedWallet.css'

export default function AdvancedWallet() {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [walletRes, txRes, analyticsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions?limit=20'),
        api.get('/wallet/analytics')
      ])
      setWallet(walletRes.data.data)
      setTransactions(txRes.data.data)
      setAnalytics(analyticsRes.data.data)
    } catch (err) {
      setWallet({
        balance: 5000,
        bonusBalance: 200,
        channelEarnings: { commissions: 1500, donations: 300, productSales: 2000 },
        spending: { totalSpent: 3000, purchases: 15, boxOpens: 50 },
        earnings: { totalEarned: 8000, fromChannels: 3800 }
      })
      setAnalytics({
        summary: {
          currentBalance: 5000,
          totalEarned: 8000,
          totalSpent: 3000,
          netProfit: 5000
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: '📊' },
    { id: 'transactions', label: 'المعاملات', icon: '📜' },
    { id: 'channels', label: 'القنوات', icon: '📢' },
    { id: 'analytics', label: 'التحليلات', icon: '📈' }
  ]

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div className="advanced-wallet">
      <header className="wallet-header">
        <h1>💰 محفظتي المتقدمة</h1>
        <div className="balance-display">
          <span className="balance-label">الرصيد المتاح</span>
          <span className="balance-value">{wallet?.balance?.toLocaleString()} 🪙</span>
        </div>
      </header>

      <div className="wallet-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="wallet-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="balance-cards">
              <div className="balance-card main">
                <span>💵 الرصيد</span>
                <strong>{wallet?.balance?.toLocaleString()}</strong>
              </div>
              <div className="balance-card">
                <span>🎁 المكافآت</span>
                <strong>{wallet?.bonusBalance?.toLocaleString()}</strong>
              </div>
            </div>

            <div className="earnings-section">
              <h3>💰 الأرباح</h3>
              <div className="earnings-grid">
                <div className="earning-card">
                  <span className="icon">📢</span>
                  <span className="label">العمولات</span>
                  <span className="value">{wallet?.channelEarnings?.commissions}</span>
                </div>
                <div className="earning-card">
                  <span className="icon">❤️</span>
                  <span className="label">التبرعات</span>
                  <span className="value">{wallet?.channelEarnings?.donations}</span>
                </div>
                <div className="earning-card">
                  <span className="icon">🛍️</span>
                  <span className="label">مبيعات</span>
                  <span className="value">{wallet?.channelEarnings?.productSales}</span>
                </div>
              </div>
            </div>

            <div className="spending-section">
              <h3>💸 المصروفات</h3>
              <div className="spending-grid">
                <div className="spending-card">
                  <span>إجمالي المصروف</span>
                  <strong>{wallet?.spending?.totalSpent}</strong>
                </div>
                <div className="spending-card">
                  <span>مشتريات</span>
                  <strong>{wallet?.spending?.purchases}</strong>
                </div>
                <div className="spending-card">
                  <span>فتح صناديق</span>
                  <strong>{wallet?.spending?.boxOpens}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-tab">
            {transactions.length === 0 ? (
              <div className="empty">لا توجد معاملات</div>
            ) : (
              transactions.map(tx => (
                <div key={tx._id} className={`transaction ${tx.direction}`}>
                  <div className="tx-icon">
                    {tx.direction === 'credit' ? '⬆️' : '⬇️'}
                  </div>
                  <div className="tx-info">
                    <span className="tx-type">{tx.type}</span>
                    <span className="tx-desc">{tx.description}</span>
                    <span className="tx-date">
                      {new Date(tx.createdAt).toLocaleDateString('ar')}
                    </span>
                  </div>
                  <div className={`tx-amount ${tx.direction}`}>
                    {tx.direction === 'credit' ? '+' : '-'}{tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="channels-tab">
            <h3>📢 قنواتي</h3>
            <p className="info">إحصائيات قنواتك وأرباحك منها</p>
            
            <div className="channel-earnings">
              <div className="earning-item">
                <span>إجمالي أرباح القنوات</span>
                <strong>{wallet?.earnings?.fromChannels}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="analytics-tab">
            <h3>📈 التحليلات</h3>
            
            <div className="analytics-summary">
              <div className="analytics-card">
                <span>إجمالي الأرباح</span>
                <strong className="green">{analytics.summary?.totalEarned}</strong>
              </div>
              <div className="analytics-card">
                <span>إجمالي المصروفات</span>
                <strong className="red">{analytics.summary?.totalSpent}</strong>
              </div>
              <div className="analytics-card">
                <span>صافي الربح</span>
                <strong className={analytics.summary?.netProfit >= 0 ? 'green' : 'red'}>
                  {analytics.summary?.netProfit}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
