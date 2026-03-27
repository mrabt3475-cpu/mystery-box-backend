import { useState, useEffect } from 'react'
import api from '../services/api'

export default function ApiKeys() {
  const [keys, setKeys] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [form, setForm] = useState({ name: '', permissions: [], rateLimit: 1000 })

  useEffect(() => { fetchKeys() }, [])

  const fetchKeys = async () => {
    const res = await api.get('/developer/keys')
    setKeys(res.data)
  }

  const createKey = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/developer/keys', form)
      setNewKey(res.data)
      fetchKeys()
    } catch (err) { alert('خطأ') }
  }

  const revokeKey = async (id) => {
    if (!confirm('إلغاء المفتاح؟')) return
    await api.delete(`/developer/keys/${id}`)
    fetchKeys()
  }

  const perms = [
    { v: 'read:products', l: 'قراءة المنتجات' },
    { v: 'read:boxes', l: 'قراءة الصناديق' },
    { v: 'write:open-box', l: 'فتح صندوق' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔑 مفاتيح API</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <button onClick={() => setShowCreate(!showCreate)} className="bg-purple-600 px-6 py-2 rounded">
          {showCreate ? 'إلغاء' : '+ مفتاح جديد'}
        </button>

        {showCreate && (
          <form onSubmit={createKey} className="mt-4 space-y-4">
            <input type="text" placeholder="اسم المفتاح" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-gray-700 px-4 py-2 rounded" required />
            <button type="submit" className="bg-purple-600 px-6 py-2 rounded">إنشاء</button>
          </form>
        )}
      </div>

      {newKey && (
        <div className="bg-yellow-900 border border-yellow-500 p-6 rounded-lg mb-8">
          <h3 className="text-yellow-500 font-bold">⚠️ مفتاحك السري (مرة واحدة فقط!)</h3>
          <code className="block bg-gray-900 p-4 rounded mt-2 break-all">{newKey.keySecret}</code>
          <button onClick={() => setNewKey(null)} className="mt-4 bg-yellow-600 px-4 py-2 rounded">حسناً</button>
        </div>
      )}

      <div className="space-y-4">
        {keys.map(key => (
          <div key={key._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-bold">{key.name}</div>
              <div className="text-sm text-gray-400">{key.keyId}</div>
            </div>
            <button onClick={() => revokeKey(key._id)} className="text-red-400">إلغاء</button>
          </div>
        ))}
      </div>
    </div>
  )
}