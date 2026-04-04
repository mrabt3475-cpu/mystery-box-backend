import React, { useState } from 'react';
import './ChannelSettings.css';

// ========================
// 👤 UI Tab
// ========================
const UITab = ({ channel, saveSettings }) => {
  const [ui, setUI] = useState(channel.ui || { showElements: {} });

  const cardStyles = [
    { value: 'default', label: 'افتراضي', icon: '📇' },
    { value: 'glass', label: 'زجاج', icon: '🪟' },
    { value: 'gradient', label: 'تدرج', icon: '🌈' },
    { value: 'solid', label: 'صلب', icon: '⬛' },
    { value: 'outline', label: 'حدود', icon: '🔲' }
  ];

  const buttonStyles = [
    { value: 'default', label: 'افتراضي', icon: '🔘' },
    { value: 'rounded', label: 'مستدير', icon: '🔵' },
    { value: 'pill', label: 'كبسولة', icon: '💊' },
    { value: 'outline', label: 'حدود', icon: '🔲' },
    { value: 'soft', label: 'ناعم', icon: '☁️' }
  ];

  const boxStyles = [
    { value: 'default', label: 'افتراضي', icon: '📦' },
    { value: '3d', label: 'ثلاثي الأبعاد', icon: '🎁' },
    { value: 'animated', label: 'متحرك', icon: '✨' },
    { value: 'minimal', label: 'بسيط', icon: '⬜' },
    { value: 'realistic', label: 'واقعي', icon: '📦' }
  ];

  const notificationStyles = [
    { value: 'default', label: 'افتراضي', icon: '🔔' },
    { value: 'toast', label: 'إشعار منبثق', icon: '🍞' },
    { value: 'banner', label: 'شريط', icon: '📜' },
    { value: 'modal', label: 'نافذة', icon: '🪟' },
    { value: 'floating', label: 'عائم', icon: '🎈' }
  ];

  const profileStyles = [
    { value: 'default', label: 'افتراضي', icon: '👤' },
    { value: 'card', label: 'بطاقة', icon: '💳' },
    { value: 'minimal', label: 'بسيط', icon: '⬜' },
    { value: 'detailed', label: 'مفصل', icon: '📋' }
  ];

  const updateUI = (key, value) => {
    setUI({ ...ui, [key]: value });
  };

  const updateShowElement = (key, value) => {
    setUI({
      ...ui,
      showElements: { ...ui.showElements, [key]: value }
    });
  };

  return (
    <div className="tab-content">
      <h2>👤 تخصيص واجهة المستخدم</h2>

      {/* Card Style */}
      <div className="settings-section">
        <h3>📇 شكل البطاقات</h3>
        <div className="style-grid">
          {cardStyles.map(style => (
            <div 
              key={style.value}
              className={`style-card ${ui.cardStyle === style.value ? 'active' : ''}`}
              onClick={() => {
                updateUI('cardStyle', style.value);
                saveSettings('/ui/styles', { cardStyle: style.value });
              }}
            >
              <span className="style-icon">{style.icon}</span>
              <span>{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Button Style */}
      <div className="settings-section">
        <h3>🔘 شكل الأزرار</h3>
        <div className="style-grid">
          {buttonStyles.map(style => (
            <div 
              key={style.value}
              className={`style-card ${ui.buttonStyle === style.value ? 'active' : ''}`}
              onClick={() => {
                updateUI('buttonStyle', style.value);
                saveSettings('/ui/styles', { buttonStyle: style.value });
              }}
            >
              <span className="style-icon">{style.icon}</span>
              <span>{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Box Style */}
      <div className="settings-section">
        <h3>📦 شكل الصناديق</h3>
        <div className="style-grid">
          {boxStyles.map(style => (
            <div 
              key={style.value}
              className={`style-card ${ui.boxStyle === style.value ? 'active' : ''}`}
              onClick={() => {
                updateUI('boxStyle', style.value);
                saveSettings('/ui/styles', { boxStyle: style.value });
              }}
            >
              <span className="style-icon">{style.icon}</span>
              <span>{style.label}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Notification Style */}
      <div className="settings-section">
        <h3>🔔 شكل الإشعارات</h3>
        <div className="style-grid">
          {notificationStyles.map(style => (
            <div 
              key={style.value}
              className={`style-card ${ui.notificationStyle === style.value ? 'active' : ''}`}
              onClick={() => {
                updateUI('notificationStyle', style.value);
                saveSettings('/ui/styles', { notificationStyle: style.value });
              }}
            >
              <span className="style-icon">{style.icon}</span>
              <span>{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Style */}
      <div className="settings-section">
        <h3>👤 شكل الملف الشخصي</h3>
        <div className="style-grid">
          {profileStyles.map(style => (
            <div 
              key={style.value}
              className={`style-card ${ui.profileStyle === style.value ? 'active' : ''}`}
              onClick={() => {
                updateUI('profileStyle', style.value);
                saveSettings('/ui/styles', { profileStyle: style.value });
              }}
            >
              <span className="style-icon">{style.icon}</span>
              <span>{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Show Elements */}
      <div className="settings-section">
        <h3>👁️ إظهار العناصر</h3>
        
        <div className="checkbox-group">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={ui.showElements?.leaderboard !== false}
              onChange={(e) => {
                updateShowElement('leaderboard', e.target.checked);
                saveSettings('/ui', { showElements: { ...ui.showElements, leaderboard: e.target.checked } });
              }}
            />
            <span>قائمة المتصدرين</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={ui.showElements?.statistics !== false}
              onChange={(e) => {
                updateShowElement('statistics', e.target.checked);
                saveSettings('/ui', { showElements: { ...ui.showElements, statistics: e.target.checked } });
              }}
            />
            <span>الإحصائيات</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={ui.showElements?.achievements !== false}
              onChange={(e) => {
                updateShowElement('achievements', e.target.checked);
                saveSettings('/ui', { showElements: { ...ui.showElements, achievements: e.target.checked } });
              }}
            />
            <span>الإنجازات</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={ui.showElements?.history !== false}
              onChange={(e) => {
                updateShowElement('history', e.target.checked);
                saveSettings('/ui', { showElements: { ...ui.showElements, history: e.target.checked } });
              }}
            />
            <span>السجل</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={ui.showElements?.chat !== false}
              onChange={(e) => {
                updateShowElement('chat', e.target.checked);
                saveSettings('/ui', { showElements: { ...ui.showElements, chat: e.target.checked } });
              }}
            />
            <span>المحادثة</span>
          </label>
        </div>
      </div>

      <button className="save-btn primary" onClick={() => saveSettings('/ui', ui)}>
        💾 حفظ كل الإعدادات
      </button>
    </div>
  );
};

export default UITab;