import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/createChannel.css'

export default function CreateChannel() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    username: '',
    joinSettings: {
      pointsRequired: 0,
      isPrivate: false
    }
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/channels', form)
      alert('تم إنشاء القناة!')
      navigate(`/channels/${res.data.data._id}`)
    } catch (err) {
      alert('فشل إنشاء القناة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-channel">
      <h1>📢 أنشئ قناتك</h1>
      
      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. المعلومات</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. البوت</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. الإعدادات</div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="step-content">
            <div className="form-group">
              <label>اسم القناة</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="اسم قناتك"
                required
              />
            </div>
            <div className="form-group">
              <label>الوصف</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف قناتك"
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>اسم المستخدم (اختياري)</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username"
              />
            </div>
            <button type="button" onClick={() => setStep(2)} className="btn-next">
              التالي →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <div className="bot-setup">
              <h3>🤖 إعداد البوت</h3>
              <p>أنشئ بوت خاص بقناتك للتفاعل مع المستخدمين</p>
              
              <div className="form-group">
                <label>اسم البوت</label>
                <input
                  type="text"
                  placeholder="اسم البوت"
                />
              </div>
              
              <div className="form-group">
                <label>Token البوت</label>
                <input
                  type="text"
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                />
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" />
                  تفعيل الرد التلقائي
                </label>
              </div>
            </div>
            
            <div className="buttons">
              <button type="button" onClick={() => setStep(1)} className="btn-back">
                ← السابق
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-next">
                التالي →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <div className="join-settings">
              <h3>⚙️ إعدادات الانضمام</h3>
              
              <div className="form-group">
                <label>نقاط المطلوبة للانضمام</label>
                <input
                  type="number"
                  value={form.joinSettings.pointsRequired}
                  onChange={(e) => setForm({
                    ...form,
                    joinSettings: { ...form.joinSettings, pointsRequired: parseInt(e.target.value) }
                  })}
                  min={0}
                />
                <small>0 = انضمام مجاني</small>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.joinSettings.isPrivate}
                    onChange={(e) => setForm({
                      ...form,
                      joinSettings: { ...form.joinSettings, isPrivate: e.target.checked }
                    })}
                  />
                  قناة خاصة (تتطلب دعوة)
                </label>
              </div>
            </div>

            <div className="commission-info">
              <h3>💰 معلومات العمولات</h3>
              <p>نسبة العمولة: <strong>10%</strong> من كل عملية بيع</p>
            </div>
            
            <div className="buttons">
              <button type="button" onClick={() => setStep(2)} className="btn-back">
                ← السابق
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? '...' : 'إنشاء القناة'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
