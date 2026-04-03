import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TelegramLogin from '../components/TelegramLogin';
import './Auth.css';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
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
            <h1>مرحباً снова!</h1>
            <p>سجل دخولك للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>


          <div className="auth-divider">
            <span>أو</span>
          </div>

          <TelegramLogin onSuccess={handleTelegramSuccess} />

          <div className="auth-footer">
            <p>
              ليس لديك حساب؟ <Link to="/register">سجل الآن</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="visual-content">
          <h2>ابدأ المغامرة!</h2>
          <p>افتح صناديق واستمتع بالجوائز الرائعة</p>
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

export default Login;
