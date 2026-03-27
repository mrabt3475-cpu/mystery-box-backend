import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Referral() {
  const [referral, setReferral] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        api.get('/referral/code'),
        api.get('/referral/stats'),
      ])
      setReferral(codeRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(referral.code)
    alert('تم نسخ الكود!')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">👥 برنامج الإحالة</h1>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-xl mb-4">كود الإحالة الخاص بك</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/20 rounded-lg px-6 py-4 text-2xl font-mono">
            {referral?.code || 'LOADING...'}
          </div>
          <button
            onClick={copyCode}
            className="bg-white text-purple-600 px-6 py-4 rounded-lg font-bold hover:bg-purple-50"
          >
            📋 نسخ
          </button>
        </div>
        <p className="mt-4 text-purple-200">
          شارك هذا الكود مع أصدقائك واحصل على عمولات!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">{stats?.totalReferrals || 0}</div>
          <div className="text-gray-400">إجمالي الإحالات</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400">{stats?.activeReferrals || 0}</div>
          <div className="text-gray-400">نشطون</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400">${stats?.totalEarnings || 0}</div>
          <div className="text-gray-400">الأرباح</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400">${stats?.availableBalance || 0}</div>
          <div className="text-gray-400">متاح للسحب</div>
        </div>
      </div>

      {/* Commission Rates */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">💰 معدلات العمولة</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">30%</div>
            <div className="text-gray-400">المستوى الأول</div>
            <div className="text-sm text-gray-500">الإحالة المباشرة</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">20%</div>
            <div className="text-gray-400">المستوى الثاني</div>
            <div className="text-sm text-gray-500">محال المستوى الأول</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">10%</div>
            <div className="text-gray-400">المستوى الثالث</div>
            <div className="text-sm text-gray-500">محال المستوى الثاني</div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">👥 إحالاتك</h2>
        <div className="space-y-3">
          {stats?.referralTree?.referrals?.map((ref, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                  {ref.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold">{ref.user?.username}</div>
                  <div className="text-sm text-gray-400">
                    منذ {new Date(ref.activatedAt).toLocaleDateString('ar')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">${ref.earnings?.toFixed(2)}</div>
                <div className="text-sm text-gray-400">أرباح</div>
              </div>
            </div>
          ))}
          {(!stats?.referralTree?.referrals || stats.referralTree.referrals.length === 0) && (
            <p className="text-gray-500 text-center py-8">لا توجد إحالات بعد</p>
          )}
        </div>
      </div>

      {/* Withdraw */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">💸 سحب الأرباح</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-700 rounded-lg px-4 py-3">
            الرصيد المتاح: <span className="text-green-400 font-bold text-xl">${stats?.availableBalance || 0}</span>
          </div>
          <button
            disabled={!stats?.availableBalance || stats.availableBalance < 10}
            className="bg-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            سحب
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">الحد الأدنى للسحب: $10</p>
      </div>
    </div>
  )
}