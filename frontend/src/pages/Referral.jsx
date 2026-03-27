import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
          <h1 className="text-3xl font-bold">👥 الإحالة</h1>
          <p className="text-gray-400">دعوة أصدقاء واكسب نقاط!</p>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Your Code */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">كود الإحالة الخاص بك</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
            <span className="text-3xl font-bold text-yellow-400 tracking-wider">{referral?.code}</span>
          </div>
          <button
            onClick={copyCode}
            className="bg-white text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            📋 نسخ
          </button>
        </div>
        <p className="text-gray-400 mt-4 text-center">
          شارك هذا الكود مع أصدقائك وعند تسجيلهم ستحصل على نقاط!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-purple-400">{stats?.totalReferrals || 0}</div>
          <div className="text-gray-400 mt-2">إجمالي الإحالات</div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-green-400">{stats?.activeReferrals || 0}</div>
          <div className="text-gray-400 mt-2">نشطون</div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-yellow-400">{stats?.totalEarnings || 0}</div>
          <div className="text-gray-400 mt-2">نقاط مكتسبة</div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-blue-400">${stats?.availableBalance || 0}</div>
          <div className="text-gray-400 mt-2">متاح للسحب</div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-800 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">💡 كيف يعمل؟</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-3xl mb-4">
              1
            </div>
            <h3 className="font-bold mb-2">شارك الكود</h3>
            <p className="text-gray-400 text-sm">أعطِ كود الإحالة لصديقك</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-3xl mb-4">
              2
            </div>
            <h3 className="font-bold mb-2">يسجل</h3>
            <p className="text-gray-400 text-sm">صديقك يسجل باستخدام الكود</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-3xl mb-4">
              3
            </div>
            <h3 className="font-bold mb-2">اكسب نقاط</h3>
            <p className="text-gray-400 text-sm">تحصل على 30% من نقاطهم!</p>
          </div>
        </div>
      </div>

      {/* Commission Rates */}
      <div className="bg-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">💰 معدلات العمولة</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold">30%</div>
            <div className="text-yellow-200 mt-2">المستوى الأول</div>
            <div className="text-sm text-yellow-300">صديقك المباشر</div>
          </div>
          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold">20%</div>
            <div className="text-gray-300 mt-2">المستوى الثاني</div>
            <div className="text-sm text-gray-400">صديق صديقك</div>
          </div>
          <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold">10%</div>
            <div className="text-amber-200 mt-2">المستوى الثالث</div>
            <div className="text-sm text-amber-300">صديق صديق صديقك</div>
          </div>
        </div>
      </div>
    </div>
  )
}