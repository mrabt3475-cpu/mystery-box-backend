import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/security.css'

export default function SecuritySettings() {
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessions: [],
    loginHistory: [],
    backupCodes: []
  })
  const [loading, setLoading] = useState(true)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      const res = await api.get('/users/security')
      setSecurity(res.data)
    } catch (err) {
      // Mock data
      setSecurity({
        twoFactorEnabled: false,
        loginAlerts: true,
        sessions: [
          { id: '1', device: 'Chrome - Windows', location: 'Cairo, EG', current: true, lastActive: new Date() },
          { id: '2', device: 'Safari - iPhone', location: 'Cairo, EG', current: false, lastActive: new Date(Date.now() - 86400000) },
        ],
        loginHistory: [
          { id: '1', ip: '192.168.1.xxx', location: 'Cairo, EG', device: 'Chrome', date: new Date(), success: true },
          { id: '2', ip: '192.168.1.xxx', location: 'Cairo, EG', device: 'Chrome', date: new Date(Date.now() - 86400000), success: true },
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const setup2FA = async () => {
    try {
      const res = await api.post('/users/2fa/setup')
      setQrCode(res.data.qrCode)
      setShow2FASetup(true)
    } catch (err) {
      // Mock
      setQrCode('data:image/png;base64,mock')
      setShow2FASetup(true)
    }
  }

  const verifyAndEnable2FA = async () => {
    try {
      await api.post('/users/2fa/verify', { token: otpCode })
      alert('تم تفعيل التحقق بخطوتين!')
      fetchSecurityData()
      setShow2FASetup(false)
    } catch (err) {
      alert('رمز غير صحيح')
    }
  }

  const disable2FA = async () => {
    if (!window.confirm('هل أنت متأكد من تعطيل التحقق بخطوتين؟')) return
    try {
      await api.post('/users/2fa/disable', { password })
      alert('تم تعطيل التحقق بخطوتين')
      fetchSecurityData()
    } catch (err) {
      alert('فشل التعطيل')
    }
  }

  const revokeSession = async (sessionId) => {
    if (!window.confirm('هل تريد إنهاء هذه الجلسة؟')) return
    try {
      await api.delete(`/users/sessions/${sessionId}`)
      fetchSecurityData()
    } catch (err) {
      // Mock
      setSecurity(s => ({
        ...s,
        sessions: s.sessions.filter(sess => sess.id !== sessionId)
      }))
    }
  }

  const getPasswordStrength = (pass) => {
    let strength = 0
    if (pass.length >= 8) strength++
    if (/[A-Z]/.test(pass)) strength++
    if (/[a-z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[!@#$%^&*]/.test(pass)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthLabels = ['ضعيف', 'ضعيف', 'متوسط', 'قوي', 'قوي جداً']
  const strengthColors = ['weak', 'weak', 'medium', 'strong', 'very-strong']

  return (
    <div className="glass-premium p-6">
      <h2 className="text-2xl font-bold mb-6">🔐 الأمان</h2>

      {/* 2FA Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">التحقق بخطوتين</h3>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              {security.twoFactorEnabled ? '🛡️' : '🔓'}
            </div>
            <div>
              <div className="font-bold">
                {security.twoFactorEnabled ? 'مفعّل' : 'غير مفعّل'}
              </div>
              <div className="text-sm text-gray-400">
                {security.twoFactorEnabled 
                  ? 'حسابك محمي بخطوتين'
                  : 'فعّل لحماية حسابك'
                }
              </div>
            </div>
          </div>
          <div className={`security-badge ${security.twoFactorEnabled ? 'verified' : 'pending'}`}>
            {security.twoFactorEnabled ? '✅ مفعل' : '⏳ غير مفعل'}
          </div>
        </div>

        {security.twoFactorEnabled ? (
          <button onClick={disable2FA} className="mt-4 text-red-400 hover:text-red-300">
            تعطيل التحقق بخطوتين
          </button>
        ) : (
          <button onClick={setup2FA} className="btn-premium mt-4">
            فعّل الآن
          </button>
        )}
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className="modal-premium">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">إعداد التحقق بخطوتين</h3>
            
            <div className="text-center mb-4">
              <img src={qrCode} alt="QR Code" className="mx-auto rounded-xl" />
              <p className="text-gray-400 mt-4 text-sm">
                امسح هذا الرمز بتطبيق Google Authenticator
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                أدخل الرمز من التطبيق
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="000000"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-center text-2xl letter-spacing-8"
                maxLength={6}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShow2FASetup(false)} className="flex-1 py-3 bg-white/10 rounded-xl">
                إلغاء
              </button>
              <button onClick={verifyAndEnable2FA} className="flex-1 btn-premium">
                تفعيل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Strength */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">قوة كلمة المرور</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="اختبر قوة كلمة المرور"
          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl"
        />
        <div className="password-strength mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`password-strength-bar ${i < passwordStrength ? strengthColors[passwordStrength - 1] : ''}`}
            />
          ))}
        </div>
        {password && (
          <p className={`mt-2 text-sm ${
            passwordStrength >= 4 ? 'text-emerald-400' :
            passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {strengthLabels[passwordStrength - 1] || 'ضعيف جداً'}
          </p>
        )}
      </div>

      {/* Active Sessions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">الجلسات النشطة</h3>
        <div className="space-y-3">
          {security.sessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="text-2xl">💻</div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="session-active">الحالي</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {session.location}
                  </div>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => revokeSession(session.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  إنهاء
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">سجل تسجيل الدخول</h3>
        <div className="space-y-3">
          {security.loginHistory.map(login => (
            <div key={login.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`text-2xl ${login.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {login.success ? '✅' : '❌'}
                </div>
                <div>
                  <div className="font-bold">{login.device}</div>
                  <div className="text-sm text-gray-400">
                    {login.ip} • {login.location}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(login.date).toLocaleDateString('ar')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div>
        <h3 className="text-lg font-bold mb-4">💡 نصائح الأمان</h3>
        <div className="space-y-3">
          <div className="security-tip">
            <span className="security-tip-icon">🔑</span>
            <div className="security-tip-text">
              <strong>كلمة مرور قوية</strong>
              استخدم 8 أحرف على الأقل مع أحرف كبيرة وصغيرة وأرقام ورموز
            </div>
          </div>
          <div className="security-tip">
            <span className="security-tip-icon">📱</span>
            <div className="security-tip-text">
              <strong>التحقق بخطوتين</strong>
              فعّلها لحماية حسابك حتى لو تعرضت كلمة المرور للسرقة
            </div>
          </div>
          <div className="security-tip">
            <span className="security-tip-icon">🔒</span>
            <div className="security-tip-text">
              <strong>تسجيل الخروج</strong>
              سجّل الخروج من الأجهزة المشتركة بعد الاستخدام
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
