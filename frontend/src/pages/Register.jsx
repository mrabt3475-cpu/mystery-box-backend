import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TelegramLogin from '../components/TelegramLogin';
import './Auth.css';

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    referralCode: refCode
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          referralCode: formData.referralCode
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramSuccess = (user) => {
    setUser(user);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span>🎁</span> PuzzleChain
            </Link>
            <h1>أنشئ حسابك!</h1>
            <p>ابدأ رحلتك معنا اليوم</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>الاسم الكامل</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>اسم المستخدم</label>
              <input
                type="text"
                name="username"
                className="input"
                placeholder="أدخل اسم المستخدم"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>كلمة المرور</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="input-group">
              <label>تأكيد كلمة المرور</label>
              <input
                type="password"
                name="confirmPassword"
                className="input"
                placeholder="أعد إدخال كلمة المرور"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {refCode && (
              <div className="input-group">
                <label>كود الدعوة</label>
                <input
                  type="text"
                  name="referralCode"
                  className="input"
                  value={formData.referralCode}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="auth-divider">
            <span>أو</span>
          </div>

          <TelegramLogin onSuccess={handleTelegramSuccess} />

          <div className="auth-footer">
            <p>
              لديك حساب بالفعل؟ <Link to="/login">سجل دخولك</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="visual-content">
          <h2>انضم إلى الفائزين!</h2>
          <p>آلاف الجوائز بانتظارك</p>
          <div className="visual-boxes">
            <span>🎁</span>
            <span>💎</span>
            <span>🏆</span>
            <span>🎮</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
