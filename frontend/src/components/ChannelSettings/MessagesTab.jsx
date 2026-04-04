import React, { useState } from 'react';
import './ChannelSettings.css';

// ========================
// 💬 Messages Tab
// ========================
const MessagesTab = ({ channel, saveSettings }) => {
  const [messages, setMessages] = useState(channel.messages || { welcome: {}, winMessage: {}, levelUp: {} });

  const updateWelcome = (key, value) => {
    setMessages({
      ...messages,
      welcome: { ...messages.welcome, [key]: value }
    });
  };

  const updateWinMessage = (key, value) => {
    setMessages({
      ...messages,
      winMessage: { ...messages.winMessage, [key]: value }
    });
  };

  return (
    <div className="tab-content">
      <h2>💬 تخصيص الرسائل</h2>

      {/* Welcome Message */}
      <div className="settings-section">
        <h3>👋 رسالة الترحيب</h3>
        
        <div className="form-group">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={messages.welcome?.enabled !== false}
              onChange={(e) => {
                updateWelcome('enabled', e.target.checked);
                saveSettings('/messages/welcome', { enabled: e.target.checked });
              }}
            />
            <span>تفعيل رسالة الترحيب</span>
          </label>
        </div>

        <div className="form-group">
          <label>العنوان</label>
          <input 
            type="text" 
            className="text-input"
            placeholder="مرحباً بك!"
            value={messages.welcome?.title || ''}
            onChange={(e) => updateWelcome('title', e.target.value)}
            onBlur={() => saveSettings('/messages/welcome', { title: messages.welcome?.title })}
          />
        </div>

        <div className="form-group">
          <label>الرسالة</label>
          <textarea 
            className="text-input"
            placeholder="نحن سعيدون بانضمامك إلينا"
            value={messages.welcome?.message || ''}
            onChange={(e) => updateWelcome('message', e.target.value)}
            onBlur={() => saveSettings('/messages/welcome', { message: messages.welcome?.message })}
          />
        </div>

        <div className="form-group">
          <label>صورة (اختياري)</label>
          <input 
            type="text" 
            className="text-input"
            placeholder="رابط الصورة"
            value={messages.welcome?.image || ''}
            onChange={(e) => updateWelcome('image', e.target.value)}
            onBlur={() => saveSettings('/messages/welcome', { image: messages.welcome?.image })}
          />
        </div>

        <div className="form-group">
          <label>ستيكر (اختياري)</label>
          <input 
            type="text" 
            className="text-input"
            placeholder="معرف الستيكر"
            value={messages.welcome?.sticker || ''}
            onChange={(e) => updateWelcome('sticker', e.target.value)}
            onBlur={() => saveSettings('/messages/welcome', { sticker: messages.welcome?.sticker })}
          />
        </div>
      </div>

      {/* Win Message */}
      <div className="settings-section">
        <h3>🏆 رسالة الفوز</h3>
        
        <div className="form-group">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={messages.winMessage?.enabled !== false}
              onChange={(e) => {
                updateWinMessage('enabled', e.target.checked);
                saveSettings('/messages/win', { enabled: e.target.checked });
              }}
            />
            <span>تفعيل رسالة الفوز</span>
          </label>
        </div>

        <div className="form-group">
          <label>قالب الرسالة</label>
          <textarea 
            className="text-input"
            placeholder="🎉 تهانينا! فزت بـ {prize}!"
            value={messages.winMessage?.template || ''}
            onChange={(e) => updateWinMessage('template', e.target.value)}
            onBlur={() => saveSettings('/messages/win', { template: messages.winMessage?.template })}
          />
          <p className="help-text">استخدم {prize} للجائزة، {user} للمستخدم، {channel} للقناة</p>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={messages.winMessage?.showInChannel !== false}
              onChange={(e) => {
                updateWinMessage('showInChannel', e.target.checked);
                saveSettings('/messages/win', { showInChannel: e.target.checked });
              }}
            />
            <span>إظهار في القناة</span>
          </label>
        </div>

        <div className="form-group">
          <label>قناة الإعلانات</label>
          <input 
            type="text" 
            className="text-input"
            placeholder="معرف القناة"
            value={messages.winMessage?.announceChannel || ''}
            onChange={(e) => updateWinMessage('announceChannel', e.target.value)}
            onBlur={() => saveSettings('/messages/win', { announceChannel: messages.winMessage?.announceChannel })}
          />
        </div>
      </div>

      {/* Level Up Message */}
      <div className="settings-section">
        <h3>⬆️ رسالة ترقية المستوى</h3>
        
        <div className="form-group">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={messages.levelUp?.enabled !== false}
              onChange={(e) => {
                setMessages({
                  ...messages,
                  levelUp: { ...messages.levelUp, enabled: e.target.checked }
                });
                saveSettings('/messages', { levelUp: { enabled: e.target.checked } });
              }}
            />
            <span>تفعيل رسالة الترقية</span>
          </label>
        </div>

        <div className="form-group">
          <label>الرسالة</label>
          <input 
            type="text" 
            className="text-input"
            placeholder="🎊 وصلت للمستوى {level}!"
            value={messages.levelUp?.message || ''}
            onChange={(e) => {
              setMessages({
                ...messages,
                levelUp: { ...messages.levelUp, message: e.target.value }
              });
            }}
            onBlur={() => saveSettings('/messages', { levelUp: { message: messages.levelUp?.message } })}
          />
          <p className="help-text">استخدم {level} للمستوى</p>
        </div>
      </div>

      <button className="save-btn primary" onClick={() => saveSettings('/messages', messages)}>
        💾 حفظ كل الرسائل
      </button>
    </div>
  );
};

export default MessagesTab;