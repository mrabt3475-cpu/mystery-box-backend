import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast/ToastProvider';
import Modal from '../../components/ui/Modal/Modal';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import Pagination from '../../components/ui/Pagination/Pagination';
import { SkeletonText } from '../../components/ui/Skeleton/Skeleton';
import './Gift.css';

const GiftPoints = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState('send');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Send gift state
  const [receiverUsername, setReceiverUsername] = useState('');
  const [receiver, setReceiver] = useState(null);
  const [amount, setAmount] = useState(10);
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchHistory('all', 1);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gifts/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchHistory = async (type, page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/gifts/history?type=${type}&page=${page}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setHistory(data.data.gifts);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchReceiver = async (username) => {
    if (!username || username.length < 3) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/search?username=${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setReceiver(data.data);
      } else {
        setReceiver(null);
      }
    } catch (error) {
      setReceiver(null);
    }
  };

  const handleSendGift = async () => {
    if (!receiver) {
      toast.error('الرجاء اختيار مستلم صحيح');
      return;
    }

    if (amount < 1) {
      toast.error('الحد الأدنى نقطة واحدة');
      return;
    }

    if (amount > user.pointsBalance) {
      toast.error('رصيدك غير كافٍ');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gifts/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: receiver._id,
          amount,
          message,
          isAnonymous
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(`تم إرسال ${amount} نقطة لـ ${receiver.username}! 🎁`);
        setReceiverUsername('');
        setReceiver(null);
        setAmount(10);
        setMessage('');
        setIsAnonymous(false);
        setShowConfirmModal(false);
        await refreshUser();
        fetchStats();
        fetchHistory('sent', 1);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setSending(false);
    }
  };

  const handlePageChange = (page) => {
    fetchHistory(activeTab === 'send' ? 'sent' : activeTab === 'receive' ? 'received' : 'all', page);
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="gift-points-page">
      <div className="gift-header">
        <h1>🎁 نظام الهدايا</h1>
        <p>أرسل نقاطاً لاصدقائك كهدايا!</p>
      </div>

      {/* Stats Cards */}
      <div className="gift-stats">
        <div className="stat-card sent">
          <span className="stat-icon">📤</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.sent?.amount || 0}</span>
            <span className="stat-label">أرسلت</span>
          </div>
        </div>
        <div className="stat-card received">
          <span className="stat-icon">📥</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.received?.amount || 0}</span>
            <span className="stat-label">استلمت</span>
          </div>
        </div>
        <div className="stat-card balance">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">{user?.pointsBalance || 0}</span>
            <span className="stat-label">رصيدك</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="gift-tabs">
        <button 
          className={`tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          📤 إرسال هدية
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history');
            fetchHistory('all', 1);
          }}
        >
          📜 السجل
        </button>
      </div>

      {/* Send Gift Tab */}
      {activeTab === 'send' && (
        <div className="send-gift-section">
          <div className="receiver-search">
            <label>اختر المستلم</label>
            <SearchInput
              onSearch={searchReceiver}
              placeholder="ابحث باسم المستخدم..."
              debounce={800}
            />
            {receiver && (
              <div className="receiver-card">
                <div className="receiver-avatar">
                  {receiver.avatar ? (
                    <img src={receiver.avatar} alt="" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="receiver-info">
                  <span className="receiver-name">{receiver.name}</span>
                  <span className="receiver-username">@{receiver.username}</span>
                </div>
                <span className="selected-badge">✓</span>
              </div>
            )}
          </div>

          <div className="amount-section">
            <label>اختر المبلغ</label>
            <div className="quick-amounts">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  className={`amount-btn ${amount === amt ? 'active' : ''}`}
                  onClick={() => setAmount(amt)}
                  disabled={amt > user.pointsBalance}
                >
                  {amt}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                min={1}
                max={user.pointsBalance}
              />
              <span>نقطة</span>
            </div>
          </div>

          <div className="message-section">
            <label>رسالة (اختياري)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالة مع هديتك..."
              maxLength={500}
            />
          </div>

          <div className="options-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span>إرسال كهدية مجهولة</span>
            </label>
          </div>

          <div className="gift-summary">
            <div className="summary-row">
              <span>المستلم:</span>
              <span>{receiver?.username || '---'}</span>
            </div>
            <div className="summary-row">
              <span>المبلغ:</span>
              <span>{amount} نقطة</span>
            </div>
            <div className="summary-row balance">
              <span>رصيدك بعد الإرسال:</span>
              <span>{user.pointsBalance - amount} نقطة</span>
            </div>
          </div>

          <button
            className="send-gift-btn"
            onClick={() => setShowConfirmModal(true)}
            disabled={!receiver || amount < 1 || sending}
          >
            {sending ? 'جاري الإرسال...' : `🎁 إرسال ${amount} نقطة`}
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="history-section">
          {loading ? (
            <div className="history-loading">
              <SkeletonText lines={5} />
            </div>
          ) : history.length === 0 ? (
            <div className="empty-history">
              <span>📭</span>
              <p>لا توجد معاملات بعد</p>
            </div>
          ) : (
            <>
              <div className="history-list">
                {history.map((gift, index) => {
                  const isSent = gift.sender._id === user._id;
                  return (
                    <div key={index} className={`history-item ${isSent ? 'sent' : 'received'}`}>
                      <div className="history-icon">
                        {isSent ? '📤' : '📥'}
                      </div>
                      <div className="history-info">
                        <span className="history-user">
                          {isSent 
                            ? (gift.isAnonymous ? 'مستخدم مجهول' : gift.receiver.username)
                            : (gift.isAnonymous ? 'مستخدم مجهول' : gift.sender.username)
                          }
                        </span>
                        <span className="history-message">
                          {gift.message || (isSent ? 'إرسال هدية' : 'استلام هدية')}
                        </span>
                        <span className="history-time">
                          {new Date(gift.createdAt).toLocaleDateString('ar')}
                        </span>
                      </div>
                      <div className="history-amount">
                        <span className={isSent ? 'negative' : 'positive'}>
                          {isSent ? '-' : '+'}{gift.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      )}

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="تأكيد إرسال الهدية"
        size="small"
      >
        <div className="confirm-gift">
          <div className="confirm-avatar">
            {receiver?.avatar ? (
              <img src={receiver.avatar} alt="" />
            ) : (
              '👤'
            )}
          </div>
          <h3>{receiver?.name}</h3>
          <p className="confirm-username">@{receiver?.username}</p>
          <div className="confirm-amount">
            <span className="amount-label">المبلغ</span>
            <span className="amount-value">{amount} نقطة</span>
          </div>
          {message && (
            <div className="confirm-message">
              <span>الرسالة:</span>
              <p>{message}</p>
            </div>
          )}
          <div className="confirm-actions">
            <button onClick={() => setShowConfirmModal(false)}>إلغاء</button>
            <button className="confirm-btn" onClick={handleSendGift} disabled={sending}>
              {sending ? 'جاري...' : 'تأكيد'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GiftPoints;
