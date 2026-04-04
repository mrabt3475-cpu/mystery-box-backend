import React, { useState } from 'react';
import './ChannelSettings.css';

// ========================
// 🖼️ Media Tab
// ========================
const MediaTab = ({ channel, saveSettings, handleFileUpload }) => {
  const [media, setMedia] = useState(channel.media || { rarityImages: {}, sounds: {} });

  const rarities = [
    { key: 'common', label: 'عادي', color: '#9ca3af' },
    { key: 'uncommon', label: 'غير عادي', color: '#22c55e' },
    { key: 'rare', label: 'نادر', color: '#3b82f6' },
    { key: 'epic', label: 'أسطوري', color: '#a855f7' },
    { key: 'legendary', label: 'خرافي', color: '#f59e0b' },
    { key: 'mythic', label: 'ميثي', color: '#ef4444' }
  ];

  const sounds = [
    { key: 'boxOpen', label: 'فتح الصندوق' },
    { key: 'win', label: 'فوز' },
    { key: 'levelUp', label: 'ترقية مستوى' },
    { key: 'notification', label: 'إشعار' }
  ];

  const updateMedia = (key, value) => {
    setMedia({ ...media, [key]: value });
  };

  const updateRarity = (key, value) => {
    setMedia({
      ...media,
      rarityImages: { ...media.rarityImages, [key]: value }
    });
  };

  const updateSound = (key, value) => {
    setMedia({
      ...media,
      sounds: { ...media.sounds, [key]: value }
    });
  };

  return (
    <div className="tab-content">
      <h2>🖼️ الوسائط</h2>

      {/* Rarity Images */}
      <div className="settings-section">
        <h3>🏷️ صور الندرة</h3>
        <p className="section-desc">الصور المعروضة عند فتح الصندوق حسب الندرة</p>
        
        <div className="rarity-grid">
          {rarities.map(r => (
            <div key={r.key} className="rarity-item">
              <div className="rarity-preview" style={{ borderColor: r.color }}>
                {media.rarityImages?.[r.key] ? (
                  <img src={media.rarityImages[r.key]} alt={r.label} />
                ) : (
                  <span style={{ color: r.color }}>{r.label}</span>
                )}
              </div>
              <label>{r.label}</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'media/rarity', r.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Background Music */}
      <div className="settings-section">
        <h3>🎵 موسيقى الخلفية</h3>
        <p className="section-desc">الموسيقى التي تعمل في الخلفية</p>
        
        <div className="form-group">
          <label>تفعيل الصوت</label>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={media.soundEnabled !== false}
              onChange={(e) => {
                updateMedia('soundEnabled', e.target.checked);
                saveSettings('/media', { soundEnabled: e.target.checked });
              }}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="form-group">
          <label>مستوى الصوت ({media.volume || 50}%)</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={media.volume || 50}
            onChange={(e) => updateMedia('volume', parseInt(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>ملف الموسيقى (MP3/WAV)</label>
          <div className="audio-upload">
            {media.backgroundMusic && (
              <audio src={media.backgroundMusic} controls />
            )}
            <input 
              type="file" 
              accept="audio/mp3,audio/wav,audio/mpeg"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'media', 'backgroundMusic')}
            />
          </div>
        </div>
      </div>

      {/* Sound Effects */}
      <div className="settings-section">
        <h3>🔊 المؤثرات الصوتية</h3>
        
        {sounds.map(s => (
          <div key={s.key} className="form-group">
            <label>{s.label}</label>
            <div className="audio-upload">
              {media.sounds?.[s.key] && (
                <audio src={media.sounds[s.key]} controls />
              )}
              <input 
                type="file" 
                accept="audio/mp3,audio/wav,audio/mpeg"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'media/sounds', s.key)}
              />
            </div>
          </div>
        ))}

        <button className="save-btn" onClick={() => saveSettings('/media/sounds', { ...media.sounds, soundEnabled: media.soundEnabled, volume: media.volume })}>
          💾 حفظ الأصوات
        </button>
      </div>

      <button className="save-btn primary" onClick={() => saveSettings('/media', media)}>
        💾 حفظ كل الإعدادات
      </button>
    </div>
  );
};

export default MediaTab;