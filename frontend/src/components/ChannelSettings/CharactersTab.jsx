import React, { useState } from 'react';
import './ChannelSettings.css';

// ========================
// 🎭 Characters Tab
// ========================
const CharactersTab = ({ channel, saveSettings, handleFileUpload }) => {
  const [characters, setCharacters] = useState(channel.characters || { enabled: false, mainCharacter: {}, welcomeCharacter: {} });
  const [activeCharTab, setActiveCharTab] = useState('main');

  const charTypes = [
    { value: 'none', label: 'بدون شخصية', icon: '🚫' },
    { value: 'robot', label: 'روبوت', icon: '🤖' },
    { value: 'anime', label: 'أنمي', icon: '🎌' },
    { value: 'human', label: 'إنسان', icon: '👤' },
    { value: 'animal', label: 'حيوان', icon: '🐾' },
    { value: 'custom', label: 'مخصص', icon: '✨' }
  ];

  const updateMainChar = (key, value) => {
    setCharacters({
      ...characters,
      mainCharacter: { ...characters.mainCharacter, [key]: value }
    });
  };

  const updateCharColors = (key, value) => {
    setCharacters({
      ...characters,
      mainCharacter: {
        ...characters.mainCharacter,
        colors: { ...characters.mainCharacter.colors, [key]: value }
      }
    });
  };

  const updatePosition = (key, value) => {
    setCharacters({
      ...characters,
      mainCharacter: {
        ...characters.mainCharacter,
        position: { ...characters.mainCharacter.position, [key]: value }
      }
    });
  };

  const updateShowOn = (key, value) => {
    setCharacters({
      ...characters,
      mainCharacter: {
        ...characters.mainCharacter,
        showOn: { ...characters.mainCharacter.showOn, [key]: value }
      }
    });
  };

  return (
    <div className="tab-content">
      <h2>🎭 الشخصيات ثلاثية الأبعاد</h2>

      {/* Enable/Disable */}
      <div className="settings-section">
        <div className="toggle-group">
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={characters.enabled}
              onChange={(e) => {
                setCharacters({ ...characters, enabled: e.target.checked });
                saveSettings('/characters', { enabled: e.target.checked });
              }}
            />
            <span className="slider"></span>
          </label>
          <span>تفعيل الشخصيات</span>
        </div>
      </div>

      {/* Character Type Selection */}
      <div className="settings-section">
        <h3>نوع الشخصية</h3>
        <div className="char-types-grid">
          {charTypes.map(type => (
            <div 
              key={type.value}
              className={`char-type-card ${characters.mainCharacter?.type === type.value ? 'active' : ''}`}
              onClick={() => {
                updateMainChar('type', type.value);
                saveSettings('/characters/main', { type: type.value });
              }}
            >
              <span className="char-icon">{type.icon}</span>
              <span className="char-label">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Character Preview */}
      {characters.mainCharacter?.type !== 'none' && (
        <>
          <div className="settings-section">
            <h3>👁️ معاينة الشخصية</h3>
            <div className="character-preview">
              {characters.mainCharacter?.image ? (
                <img src={characters.mainCharacter.image} alt="Character" />
              ) : characters.mainCharacter?.type === 'robot' ? (
                <div className="default-char robot">🤖</div>
              ) : characters.mainCharacter?.type === 'anime' ? (
                <div className="default-char anime">🎌</div>
              ) : characters.mainCharacter?.type === 'animal' ? (
                <div className="default-char animal">🐾</div>
              ) : (
                <div className="default-char human">👤</div>
              )}
            </div>
          </div>

          {/* Character Name */}
          <div className="settings-section">
            <h3>📝 اسم الشخصية</h3>
            <input 
              type="text" 
              className="text-input"
              placeholder="أدخل اسم الشخصية"
              value={characters.mainCharacter?.name || ''}
              onChange={(e) => updateMainChar('name', e.target.value)}
              onBlur={() => saveSettings('/characters/main', { name: characters.mainCharacter?.name })}
            />
          </div>

          {/* Character Files */}
          <div className="settings-section">
            <h3>📁 ملفات الشخصية</h3>
            
            <div className="form-group">
              <label>صورة (PNG/JPG)</label>
              <input 
                type="file" 
                accept="image/png,image/jpeg"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'characters/main', 'image')}
              />
            </div>

            <div className="form-group">
              <label>نموذج ثلاثي الأبعاد (GLB/GLTF)</label>
              <input 
                type="file" 
                accept=".glb,.gltf"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'characters/main', 'model3d')}
              />
            </div>

            <div className="form-group">
              <label>أنميشن (Rive)</label>
              <input 
                type="file" 
                accept=".riv"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'characters/main', 'animation')}
              />
            </div>
          </div>

          {/* Character Colors */}
          <div className="settings-section">
            <h3>🎨 ألوان الشخصية</h3>
            
            <div className="form-group">
              <label>اللون الأساسي</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={characters.mainCharacter?.colors?.primary || '#8b5cf6'}
                  onChange={(e) => updateCharColors('primary', e.target.value)}
                />
                <input 
                  type="text" 
                  value={characters.mainCharacter?.colors?.primary || '#8b5cf6'}
                  onChange={(e) => updateCharColors('primary', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>اللون الثانوي</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={characters.mainCharacter?.colors?.secondary || '#3b82f6'}
                  onChange={(e) => updateCharColors('secondary', e.target.value)}
                />
                <input 
                  type="text" 
                  value={characters.mainCharacter?.colors?.secondary || '#3b82f6'}
                  onChange={(e) => updateCharColors('secondary', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>لون البشرة</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={characters.mainCharacter?.colors?.skin || '#fcd34d'}
                  onChange={(e) => updateCharColors('skin', e.target.value)}
                />
                <input 
                  type="text" 
                  value={characters.mainCharacter?.colors?.skin || '#fcd34d'}
                  onChange={(e) => updateCharColors('skin', e.target.value)}
                />
              </div>
            </div>

            <button className="save-btn" onClick={() => saveSettings('/characters/colors', characters.mainCharacter?.colors)}>
              💾 حفظ الألوان
            </button>
          </div>

          {/* Character Position */}
          <div className="settings-section">
            <h3>📍 موضع الشخصية</h3>
            
            <div className="form-group">
              <label>الموقع الأفقي (X)</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={characters.mainCharacter?.position?.x || 50}
                onChange={(e) => updatePosition('x', parseInt(e.target.value))}
              />
              <span>{characters.mainCharacter?.position?.x || 50}%</span>
            </div>

            <div className="form-group">
              <label>الموقع العمودي (Y)</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={characters.mainCharacter?.position?.y || 50}
                onChange={(e) => updatePosition('y', parseInt(e.target.value))}
              />
              <span>{characters.mainCharacter?.position?.y || 50}%</span>
            </div>

            <div className="form-group">
              <label>الحجم</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1"
                value={characters.mainCharacter?.position?.scale || 1}
                onChange={(e) => updatePosition('scale', parseFloat(e.target.value))}
              />
              <span>{characters.mainCharacter?.position?.scale || 1}x</span>
            </div>

            <button className="save-btn" onClick={() => saveSettings('/characters/position', characters.mainCharacter?.position)}>
              💾 حفظ الموضع
            </button>
          </div>

          {/* Show On Settings */}
          <div className="settings-section">
            <h3>👁️ إظهار في</h3>
            
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={characters.mainCharacter?.showOn?.header !== false}
                  onChange={(e) => updateShowOn('header', e.target.checked)}
                />
                الهيدر
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={characters.mainCharacter?.showOn?.welcome !== false}
                  onChange={(e) => updateShowOn('welcome', e.target.checked)}
                />
                رسالة الترحيب
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={characters.mainCharacter?.showOn?.wins !== false}
                  onChange={(e) => updateShowOn('wins', e.target.checked)}
                />
                عند الفوز
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={characters.mainCharacter?.showOn?.profile || false}
                  onChange={(e) => updateShowOn('profile', e.target.checked)}
                />
                الملف الشخصي
              </label>
            </div>

            <button className="save-btn" onClick={() => saveSettings('/characters/main', { showOn: characters.mainCharacter?.showOn })}>
              💾 حفظ الإعدادات
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CharactersTab;