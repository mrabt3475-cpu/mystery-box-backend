import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChannelSettings.css';

const ChannelSettings = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('design');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [channel, setChannel] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const fetchChannel = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/channel-groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannel(res.data.data);
    } catch (error) {
      console.error('Error fetching channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (endpoint, data) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/channel-groups/${id}${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('تم الحفظ بنجاح!');
      fetchChannel();
    } catch (error) {
      alert('حدث خطأ: ' + error.response?.data?.error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file, field, subField = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/upload', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const url = res.data.url;
      if (subField) {
        saveSettings(`/${field}/${subField}`, { [subField]: url });
      } else {
        saveSettings(`/${field}`, { [field]: url });
      }
    } catch (error) {
      alert('فشل رفع الملف');
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!channel) return <div className="error">القناة غير موجودة</div>;

  return (
    <div className="channel-settings">
      <div className="settings-header">
        <h1>⚙️ إعدادات {channel.title}</h1>
        <span className="channel-type">{channel.type === 'channel' ? '📢 قناة' : '👥 مجموعة'}</span>
      </div>

      <div className="settings-tabs">
        <button className={activeTab === 'design' ? 'active' : ''} onClick={() => setActiveTab('design')}>
          🎨 التصميم
        </button>
        <button className={activeTab === 'characters' ? 'active' : ''} onClick={() => setActiveTab('characters')}>
          🎭 الشخصيات
        </button>
        <button className={activeTab === 'animations' ? 'active' : ''} onClick={() => setActiveTab('animations')}>
          ✨ الأنميشن
        </button>
        <button className={activeTab === 'media' ? 'active' : ''} onClick={() => setActiveTab('media')}>
          🖼️ الوسائط
        </button>
        <button className={activeTab === 'ui' ? 'active' : ''} onClick={() => setActiveTab('ui')}>
          👤 الواجهة
        </button>
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
          💬 الرسائل
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'design' && (
          <DesignTab channel={channel} saveSettings={saveSettings} handleFileUpload={handleFileUpload} fileInputRef={fileInputRef} />
        )}
        {activeTab === 'characters' && (
          <CharactersTab channel={channel} saveSettings={saveSettings} handleFileUpload={handleFileUpload} />
        )}
        {activeTab === 'animations' && (
          <AnimationsTab channel={channel} saveSettings={saveSettings} />
        )}
        {activeTab === 'media' && (
          <MediaTab channel={channel} saveSettings={saveSettings} handleFileUpload={handleFileUpload} />
        )}
        {activeTab === 'ui' && (
          <UITab channel={channel} saveSettings={saveSettings} />
        )}
        {activeTab === 'messages' && (
          <MessagesTab channel={channel} saveSettings={saveSettings} />
        )}
      </div>

      {saving && <div className="saving-overlay">جاري الحفظ...</div>}
    </div>
  );
};

// ========================
// 🎨 Design Tab
// ========================
const DesignTab = ({ channel, saveSettings, handleFileUpload, fileInputRef }) => {
  const [design, setDesign] = useState(channel.design || {});

  const updateDesign = (key, value) => {
    setDesign({ ...design, [key]: value });
  };

  const effects = [
    { value: 'none', label: 'بدون تأثير' },
    { value: 'particles', label: 'جزيئات' },
    { value: 'gradient', label: 'تدرج' },
    { value: 'stars', label: 'نجوم' },
    { value: 'matrix', label: 'ماتريكس' },
    { value: 'fire', label: 'نار' },
    { value: 'snow', label: 'ثلج' }
  ];

  return (
    <div className="tab-content">
      <h2>🎨 تخصيص التصميم</h2>

      {/* Background */}
      <div className="settings-section">
        <h3>🖼️ الخلفية</h3>
        
        <div className="form-group">
          <label>لون الخلفية</label>
          <div className="color-input">
            <input 
              type="color" 
              value={design.backgroundColor || '#0f172a'}
              onChange={(e) => updateDesign('backgroundColor', e.target.value)}
            />
            <input 
              type="text" 
              value={design.backgroundColor || '#0f172a'}
              onChange={(e) => updateDesign('backgroundColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>صورة الخلفية</label>
          <div className="file-upload">
            {design.backgroundImage && (
              <img src={design.backgroundImage} alt="Background" className="preview-image" />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'design', 'backgroundImage')}
            />
          </div>
        </div>

        <div className="form-group">
          <label>تأثير الخلفية</label>
          <select 
            value={design.backgroundEffect || 'none'}
            onChange={(e) => updateDesign('backgroundEffect', e.target.value)}
          >
            {effects.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>صورة الغلاف</label>
          <div className="file-upload">
            {design.coverImage && (
              <img src={design.coverImage} alt="Cover" className="preview-image" />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'design', 'coverImage')}
            />
          </div>
        </div>

        <div className="form-group">
          <label>فيديو الغلاف</label>
          <div className="file-upload">
            {design.coverVideo && (
              <video src={design.coverVideo} className="preview-video" controls />
            )}
            <input 
              type="file" 
              accept="video/*"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'design', 'coverVideo')}
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="settings-section">
        <h3>🎨 الألوان</h3>
        
        <div className="form-group">
          <label>لون النص</label>
          <div className="color-input">
            <input 
              type="color" 
              value={design.textColor || '#ffffff'}
              onChange={(e) => updateDesign('textColor', e.target.value)}
            />
            <input 
              type="text" 
              value={design.textColor || '#ffffff'}
              onChange={(e) => updateDesign('textColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>لون النص الثانوني</label>
          <div className="color-input">
            <input 
              type="color" 
              value={design.textMutedColor || '#94a3b8'}
              onChange={(e) => updateDesign('textMutedColor', e.target.value)}
            />
            <input 
              type="text" 
              value={design.textMutedColor || '#94a3b8'}
              onChange={(e) => updateDesign('textMutedColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>لون التمييز</label>
          <div className="color-input">
            <input 
              type="color" 
              value={design.accentColor || '#8b5cf6'}
              onChange={(e) => updateDesign('accentColor', e.target.value)}
            />
            <input 
              type="text" 
              value={design.accentColor || '#8b5cf6'}
              onChange={(e) => updateDesign('accentColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>نصف قطر الحدود</label>
          <input 
            type="range" 
            min="0" 
            max="30" 
            value={design.borderRadius || 12}
            onChange={(e) => updateDesign('borderRadius', parseInt(e.target.value))}
          />
          <span>{design.borderRadius || 12}px</span>
        </div>
      </div>

      <button className="save-btn" onClick={() => saveSettings('/design', design)}>
        💾 حفظ التصميم
      </button>
    </div>
  );
};

export default ChannelSettings;