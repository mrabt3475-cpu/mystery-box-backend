/**
 * 🎮 Character 3D Import Page
 * صفحة استيراد الشخصيات ثلاثية الأبعاد - لوحة المطور
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS } from '../../config/characterConfig';
import { CHARACTER_ASSETS } from '../../config/characterAssets';
import './Developer.css';

const Character3DImport = () => {
  const navigate = useNavigate();
  const [characters] = useState(Object.values(CHARACTERS));
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [importUrl, setImportUrl] = useState('');
  const [importType, setImportType] = useState('model');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [assets, setAssets] = useState(CHARACTER_ASSETS.models);
  const [viewMode, setViewMode] = useState('grid');
  const [filterRarity, setFilterRarity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [preview3D, setPreview3D] = useState(false);

  const filteredCharacters = characters.filter(char => {
    const matchesRarity = filterRarity === 'all' || char.rarity === filterRarity;
    const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         char.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRarity && matchesSearch;
  });

  const getAsset = (characterId) => assets[characterId] || null;

  const handleImport = async () => {
    if (!selectedCharacter || !importUrl) {
      setMessage({ type: 'error', text: 'الرجاء اختيار شخصية وإدخال الرابط' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = CHARACTER_ASSETS.importModel(selectedCharacter.id, importUrl, {
        format: importUrl.split('.').pop()
      });

      setAssets({ ...CHARACTER_ASSETS.models });
      
      setMessage({ 
        type: 'success', 
        text: '✅ تم استيراد ' + importType + ' لـ ' + selectedCharacter.name + ' بنجاح!' 
      });
      
      if (realTimeUpdates) {
        console.log('🔄 Real-time update:', result);
      }
      
      setImportUrl('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (characterId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      CHARACTER_ASSETS.removeAsset(characterId);
      setAssets({ ...CHARACTER_ASSETS.models });
      setMessage({ type: 'success', text: '✅ تم حذف الأصل بنجاح' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = { common: '#22c55e', uncommon: '#3b82f6', rare: '#a855f7', epic: '#f59e0b', legendary: '#ef4444', mythic: '#ec4899' };
    return colors[rarity] || '#6b7280';
  };

  const getRarityName = (rarity) => {
    const names = { common: 'عادي', uncommon: 'غير عادي', rare: 'نادر', epic: 'أسطوري', legendary: 'أسطوري', mythic: 'ميثي' };
    return names[rarity] || rarity;
  };

  return (
    <div className="developer-page">
      <div className="developer-header">
        <div className="header-content">
          <h1>🎮 استيراد الشخصيات ثلاثية الأبعاد</h1>
          <p>قم باستيراد نماذج 3D وصور من مصادر خارجية</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/developer')}>
            ← العودة للوحة التحكم
          </button>
        </div>
      </div>

      <div className="updates-toggle">
        <label className="toggle-label">
          <input type="checkbox" checked={realTimeUpdates} onChange={(e) => setRealTimeUpdates(e.target.checked)} />
          <span className="toggle-switch"></span>
          <span>التحديثات الآنية</span>
        </label>
      </div>

      {message && (
        <div className={'message message-' + message.type}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <input type="text" placeholder="🔍 البحث عن شخصية..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)}>
            <option value="all">كل الندادات</option>
            <option value="common">عادي</option>
            <option value="uncommon">غير عادي</option>
            <option value="rare">نادر</option>
            <option value="epic">أسطوري</option>
            <option value="legendary">أسطوري</option>
            <option value="mythic">ميثي</option>
          </select>
        </div>
        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
        </div>
      </div>

      <div className="import-content">
        <div className="import-form-card">
          <h2>📥 استيراد أصل جديد</h2>
          
          <div className="form-group">
            <label>اختر الشخصية</label>
            <div className="character-select-grid">
              {filteredCharacters.map(char => (
                <div 
                  key={char.id}
                  className={'character-select-item ' + (selectedCharacter?.id === char.id ? 'selected' : '')}
                  onClick={() => setSelectedCharacter(char)}
                  style={{ borderColor: getRarityColor(char.rarity) }}
                >
                  <span className="char-icon">{char.icon}</span>
                  <span className="char-name">{char.name}</span>
                  <span className="char-rarity" style={{ color: getRarityColor(char.rarity) }}>
                    {getRarityName(char.rarity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>نوع الاستيراد</label>
            <div className="import-type-buttons">
              <button className={importType === 'model' ? 'active' : ''} onClick={() => setImportType('model')}>🎮 نموذج 3D</button>
              <button className={importType === 'texture' ? 'active' : ''} onClick={() => setImportType('texture')}>🧱 نسيج</button>
              <button className={importType === 'preview' ? 'active' : ''} onClick={() => setImportType('preview')}>🖼️ معاينة</button>
            </div>
          </div>

          <div className="form-group">
            <label>رابط الملف</label>
            <input type="url" placeholder="https://cdn.example.com/model.glb" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
            <small>الصيغ المدعومة: GLB, GLTF, FBX, OBJ, PNG, JPG, WebP</small>
          </div>

          <button className="btn btn-primary" onClick={handleImport} disabled={loading || !selectedCharacter || !importUrl}>
            {loading ? '⏳ جاري الاستيراد...' : '📥 استيراد'}
          </button>
        </div>

        <div className="characters-grid-container">
          <h2>📦 الشخصيات ({filteredCharacters.length})</h2>
          
          <div className={'characters-grid ' + viewMode}>
            {filteredCharacters.map(char => {
              const asset = getAsset(char.id);
              const hasAsset = asset?.modelUrl || asset?.previewUrl;
              
              return (
                <div key={char.id} className={'character-card ' + (hasAsset ? 'has-asset' : '')} style={{ borderColor: getRarityColor(char.rarity) }}>
                  <div className="card-header">
                    <span className="char-icon">{char.icon}</span>
                    <span className="rarity-badge" style={{ backgroundColor: getRarityColor(char.rarity) }}>
                      {getRarityName(char.rarity)}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <h3>{char.name}</h3>
                    <p className="char-name-en">{char.nameEn}</p>
                    
                    <div className="asset-status">
                      {hasAsset ? (
                        <span className="status-badge success">✅ مُستورد</span>
                      ) : (
                        <span className="status-badge pending">⏳ يحتاج استيراد</span>
                      )}
                    </div>
                    
                    {asset?.lastUpdated && (
                      <p className="last-updated">
                        آخر تحديث: {new Date(asset.lastUpdated).toLocaleDateString('ar')}
                      </p>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    {hasAsset && (
                      <>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRemove(char.id)}>🗑️ حذف</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setPreview3D(true)}>👁️ معاينة</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {preview3D && (
        <div className="modal-overlay" onClick={() => setPreview3D(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎮 معاينة 3D</h2>
              <button className="close-btn" onClick={() => setPreview3D(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="3d-viewer-placeholder">
                <p>📦 منطقة عرض النموذج ثلاثي الأبعاد</p>
                <p className="hint">يمكن إضافة Three.js أو Babylon.js هنا</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Character3DImport;