import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DesignTab from './components/ChannelSettings/DesignTab';
import CharactersTab from './components/ChannelSettings/CharactersTab';
import AnimationsTab from './components/ChannelSettings/AnimationsTab';
import MediaTab from './components/ChannelSettings/MediaTab';
import UITab from './components/ChannelSettings/UITab';
import MessagesTab from './components/ChannelSettings/MessagesTab';
import './components/ChannelSettings/ChannelSettings.css';

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

export default ChannelSettings;