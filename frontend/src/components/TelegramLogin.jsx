import { useState } from 'react';
import './TelegramLogin.css';

const TelegramLogin = ({ onSuccess, isLinking = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTelegramLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if Telegram WebView is available
      if (window.Telegram && window.Telegram.WebApp) {
        const telegram = window.Telegram.WebApp;
        telegram.ready();
        
        const initData = telegram.initData;
        
        if (!initData) {
          throw new Error('Telegram initData not available');
        }
        
        await loginWithTelegram(initData);
      } else {
        // Fallback: Open Telegram bot for authentication
        await openTelegramAuth();
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loginWithTelegram = async (initData) => {
    try {
      const endpoint = isLinking ? '/api/v1/telegram/link' : '/api/v1/telegram/login';
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token
      localStorage.setItem('token', data.token);
      
      // Call success callback
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openTelegramAuth = async () => {
    try {
      // Get bot username from config
      const configRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/telegram/widget-config`);
      const config = await configRes.json();
      
      // Open Telegram bot
      const botUsername = config.bot_username || 'puzzlechain_bot';
      const authUrl = `https://t.me/${botUsername}?start=AUTH`;
      
      // Open in new window
      window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Poll for authentication result
      pollAuthResult();
    } catch (err) {
      setError('Failed to open Telegram');
      setLoading(false);
    }
  };

  const pollAuthResult = () => {
    // Poll for auth result from localStorage (set by Telegram bot)
    let attempts = 0;
    const maxAttempts = 30;
    
    const interval = setInterval(async () => {
      attempts++;
      
      const authData = localStorage.getItem('telegram_auth');
      if (authData) {
        clearInterval(interval);
        localStorage.removeItem('telegram_auth');
        
        try {
          const data = JSON.parse(authData);
          if (data.token) {
            localStorage.setItem('token', data.token);
            onSuccess(data.user);
          } else {
            setError(data.error || 'Authentication failed');
          }
        } catch {
          setError('Invalid auth data');
        }
        setLoading(false);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setError('Authentication timeout');
        setLoading(false);
      }
    }, 2000);
  };


  return (
    <div className="telegram-login">
      <button
        className="telegram-btn"
        onClick={handleTelegramLogin}
        disabled={loading}
      >
        {loading ? (
          <span className="loading">جاري الاتصال...</span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#229ED9" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <span>{isLinking ? 'ربط مع Telegram' : 'تسجيل عبر Telegram'}</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="error-message">{error}</p>
      )}
      
      <p className="telegram-note">
        سيتم مشاركة اسم المستخدم والصورة فقط
      </p>
    </div>
  );
};

export default TelegramLogin;
