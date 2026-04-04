import React, { useState } from 'react';
import './ChannelSettings.css';

// ========================
// ✨ Animations Tab
// ========================
const AnimationsTab = ({ channel, saveSettings }) => {
  const [animations, setAnimations] = useState(channel.animations || { enabled: true });

  const animationTypes = [
    { value: 'none', label: 'بدون تأثير' },
    { value: 'fade', label: 'تتلاشى' },
    { value: 'slide', label: 'انزلاق' },
    { value: 'bounce', label: 'ارتداد' },
    { value: 'pulse', label: 'نبض' },
    { value: 'shake', label: 'اهتزاز' },
    { value: 'float', label: 'ت_FLOAT' }
  ];

  const boxAnimations = [
    { value: 'default', label: 'افتراضي' },
    { value: 'shake', label: 'اهتزاز' },
    { value: 'spin', label: 'دوران' },
    { value: 'explode', label: 'انفجار' },
    { value: 'glow', label: 'توهج' },
    { value: 'flip', label: 'قلب' },
    { value: 'zoom', label: 'تكبير' }
  ];

  const winAnimations = [
    { value: 'default', label: 'افتراضي' },
    { value: 'confetti', label: 'ألعاب نارية' },
    { value: 'fireworks', label: 'مفرقعات' },
    { value: 'glow', label: 'توهج' },
    { value: 'pulse', label: 'نبض' },
    { value: 'bounce', label: 'ارتداد' }
  ];

  const updateAnim = (key, value) => {
    setAnimations({ ...animations, [key]: value });
  };

  const updateEffects = (key, value) => {
    setAnimations({
      ...animations,
      specialEffects: { ...animations.specialEffects, [key]: value }
    });
  };

  return (
    <div className="tab-content">
      <h2>✨ التأثيرات والأنميشن</h2>

      {/* Enable/Disable */}
      <div className="settings-section">
        <div className="toggle-group">
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={animations.enabled}
              onChange={(e) => {
                updateAnim('enabled', e.target.checked);
                saveSettings('/animations', { enabled: e.target.checked });
              }}
            />
            <span className="slider"></span>
          </label>
          <span>تفعيل الأنميشن</span>
        </div>
      </div>

      {/* Global Animation */}
      <div className="settings-section">
        <h3>🌐 أنميشن عام</h3>
        
        <div className="form-group">
          <label>نوع الأنميشن</label>
          <select 
            value={animations.globalAnimation || 'fade'}
            onChange={(e) => updateAnim('globalAnimation', e.target.value)}
          >
            {animationTypes.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>سرعة الأنميشن (مللي ثانية)</label>
          <input 
            type="range" 
            min="100" 
            max="1000" 
            step="100"
            value={animations.animationSpeed || 300}
            onChange={(e) => updateAnim('animationSpeed', parseInt(e.target.value))}
          />
          <span>{animations.animationSpeed || 300}ms</span>
        </div>
      </div>

      {/* Box Open Animation */}
      <div className="settings-section">
        <h3>📦 أنميشن فتح الصندوق</h3>
        <div className="animation-grid">
          {boxAnimations.map(anim => (
            <div 
              key={anim.value}
              className={`animation-card ${animations.boxOpenAnimation === anim.value ? 'active' : ''}`}
              onClick={() => {
                updateAnim('boxOpenAnimation', anim.value);
                saveSettings('/animations/box', { boxOpenAnimation: anim.value });
              }}
            >
              <span className="anim-icon">📦</span>
              <span>{anim.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Win Animation */}
      <div className="settings-section">
        <h3>🏆 أنميشن الفوز</h3>
        <div className="animation-grid">
          {winAnimations.map(anim => (
            <div 
              key={anim.value}
              className={`animation-card ${animations.winAnimation === anim.value ? 'active' : ''}`}
              onClick={() => {
                updateAnim('winAnimation', anim.value);
                saveSettings('/animations/win', { winAnimation: anim.value });
              }}
            >
              <span className="anim-icon">🎉</span>
              <span>{anim.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transition Animation */}
      <div className="settings-section">
        <h3>🔄 أنميشن الانتقال</h3>
        <select 
          value={animations.transitionAnimation || 'fade'}
          onChange={(e) => updateAnim('transitionAnimation', e.target.value)}
        >
          <option value="none">بدون تأثير</option>
          <option value="fade">تتلاشى</option>
          <option value="slide-left">انزلاق يسار</option>
          <option value="slide-right">انزلاق يمين</option>
          <option value="zoom">تكبير</option>
          <option value="flip">قلب</option>
        </select>
      </div>

      {/* Special Effects */}
      <div className="settings-section">
        <h3>✨ مؤثرات خاصة</h3>
        
        <div className="checkbox-group">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={animations.specialEffects?.particles !== false}
              onChange={(e) => updateEffects('particles', e.target.checked)}
            />
            <span>جزيئات</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={animations.specialEffects?.glow !== false}
              onChange={(e) => updateEffects('glow', e.target.checked)}
            />
            <span>توهج</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={animations.specialEffects?.shadows !== false}
              onChange={(e) => updateEffects('shadows', e.target.checked)}
            />
            <span>ظلال</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={animations.specialEffects?.blur || false}
              onChange={(e) => updateEffects('blur', e.target.checked)}
            />
            <span>ضبابية</span>
          </label>
        </div>

        <button className="save-btn" onClick={() => saveSettings('/animations/effects', animations.specialEffects)}>
          💾 حفظ المؤثرات
        </button>
      </div>

      <button className="save-btn primary" onClick={() => saveSettings('/animations', animations)}>
        💾 حفظ كل الإعدادات
      </button>
    </div>
  );
};

export default AnimationsTab;