import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Channels.css';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    type: 'channel',
    chatId: '',
    title: ''
  });
  const [creating, setCreating] = useState(false);


  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/channel-groups/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChannel = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/channel-groups', newChannel, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('تم إنشاء القناة بنجاح!');
      setShowModal(false);
      setNewChannel({ name: '', type: 'channel', chatId: '', title: '' });
      fetchChannels();
    } catch (error) {
      alert('حدث خطأ: ' + error.response?.data?.error);
    } finally {
      setCreating(false);
    }
  };

  const deleteChannel = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه القناة؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/channel-groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('تم الحذف بنجاح');
      fetchChannels();
    } catch (error) {
      alert('حدث خطأ: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;

  return (
    <div className="channels-page">
      <div className="page-header">
        <div>
          <h1>📢 قنواتي ومجموعاتي</h1>
          <p>إدارة قنواتك ومجموعاتك وتخصيصها</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ إضافة قناة
        </button>
      </div>

      {channels.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📢</span>
          <h2>لا توجد قنوات بعد</h2>
          <p>أضف قناتك أو مجموعتك الأولى للبدء</p>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            ➕ إضافة قناة
          </button>
        </div>
      ) : (
        <div className="channels-grid">
          {channels.map(channel => (
            <div key={channel._id} className="channel-card">
              <div className="channel-header">
                <div className="channel-icon">
                  {channel.design?.icon ? (
                    <img src={channel.design.icon} alt={channel.title} />
                  ) : (
                    <span>{channel.type === 'channel' ? '📢' : '👥'}</span>
                  )}
                </div>
                <span className={`channel-status ${channel.status}`}>
                  {channel.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
              </div>

              <div className="channel-info">
                <h3>{channel.title}</h3>
                <p className="channel-name">@{channel.name}</p>
                <p className="channel-desc">{channel.description || 'لا يوجد وصف'}</p>
              </div>

              <div className="channel-stats">
                <div className="stat">
                  <span className="stat-value">{channel.stats?.membersCount || 0}</span>
                  <span className="stat-label">أعضاء</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{channel.stats?.winsAnnounced || 0}</span>
                  <span className="stat-label">فائزين</span>
                </div>
              </div>

              <div className="channel-design-preview">
                <div 
                  className="preview-box"
                  style={{
                    backgroundColor: channel.design?.backgroundColor || '#0f172a',
                    borderRadius: `${channel.design?.borderRadius || 12}px`
                  }}
                >
                  <span style={{ color: channel.design?.textColor || '#fff' }}>
                    {channel.characters?.enabled ? '🎭' : '📦'}
                  </span>
                </div>
                <div className="preview-info">
                  <span>تخصيص: {channel.characters?.enabled ? '✅' : '❌'}</span>
                  <span>أنميشن: {channel.animations?.enabled !== false ? '✅' : '❌'}</span>
                </div>
              </div>

              <div className="channel-actions">
                <Link to={`/channel/${channel._id}/settings`} className="settings-btn">
                  ⚙️ إعدادات
                </Link>
                <button className="delete-btn" onClick={() => deleteChannel(channel._id)}>
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Channel Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>إضافة قناة جديدة</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={createChannel}>
              <div className="form-group">
                <label>نوع القناة</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={newChannel.type === 'channel' ? 'active' : ''}
                    onClick={() => setNewChannel({ ...newChannel, type: 'channel' })}
                  >
                    📢 قناة
                  </button>
                  <button
                    type="button"
                    className={newChannel.type === 'group' ? 'active' : ''}
                    onClick={() => setNewChannel({ ...newChannel, type: 'group' })}
                  >
                    👥 مجموعة
                  </button>
                  <button
                    type="button"
                    className={newChannel.type === 'supergroup' ? 'active' : ''}
                    onClick={() => setNewChannel({ ...newChannel, type: 'supergroup' })}
                  >
                    🌟 مجموعة سوبر
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>اسم القناة (بالإنجليزية)</label>
                <input
                  type="text"
                  placeholder="my_channel"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>عنوان القناة</label>
                <input
                  type="text"
                  placeholder="قناة الجوائز"
                  value={newChannel.title}
                  onChange={(e) => setNewChannel({ ...newChannel, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>معرف القناة (Chat ID)</label>
                <input
                  type="text"
                  placeholder="-1001234567890"
                  value={newChannel.chatId}
                  onChange={(e) => setNewChannel({ ...newChannel, chatId: e.target.value })}
                  required
                />
                <p className="help-text">معرف القناة من Telegram</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="submit-btn" disabled={creating}>
                  {creating ? 'جاري الإنشاء...' : 'إنشاء'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;