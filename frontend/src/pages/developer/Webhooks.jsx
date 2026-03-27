import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', events: [] })

  useEffect(() => { fetchWebhooks() }, [])

  const fetchWebhooks = async () => {
    const res = await api.get('/developer/webhooks')
    setWebhooks(res.data)
  }

  const createWebhook = async (e) => {
    e.preventDefault()
    await api.post('/developer/webhooks', form)
    setShowCreate(false)
    fetchWebhooks()
  }

  const deleteWebhook = async (id) => {
    if (!confirm('حذف الـ Webhook؟')) return
    await api.delete(`/developer/webhooks/${id}`)
    fetchWebhooks()
  }

  const events = [
    { v: 'box.opened', l: 'فتح صندوق' },
    { v: 'box.won', l: 'فوز' },
    { v: 'order.created', l: 'طلب جديد' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔔 Webhooks</h1>

      <button onClick={() => setShowCreate(!showCreate)} className="bg-purple-600 px-6 py-2 rounded mb-4">
        {showCreate ? 'إلغاء' : '+ إضافة'}
      </button>

      {showCreate && (
        <form onSubmit={createWebhook} className="bg-gray-800 p-6 rounded-lg mb-6 space-y-4">
          <input type="text" placeholder="الاسم" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full bg-gray-700 px-4 py-2 rounded" required />
          <input type="url" placeholder="الرابط" value={form.url}
            onChange={e => setForm({...form, url: e.target.value})}
            className="w-full bg-gray-700 px-4 py-2 rounded" required />
          <button type="submit" className="bg-purple-600 px-6 py-2 rounded">إنشاء</button>
        </form>
      )}

      <div className="space-y-4">
        {webhooks.map(wh => (
          <div key={wh._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-bold">{wh.name}</div>
              <div className="text-sm text-purple-400">{wh.url}</div>
            </div>
            <button onClick={() => deleteWebhook(wh._id)} className="text-red-400">حذف</button>
          </div>
        ))}
      </div>
    </div>
  )
}