/**
 * 🎮 Character 3D Import Page - Improved Version
 * صفحة استيراد الشخصيات ثلاثية الأبعاد - لوحة المطور
 * 
 * Features:
 * - API integration
 * - Real-time updates
 * - Drag and drop
 * - Progress tracking
 * - Better error handling
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS } from '../../config/characterConfig';
import { CHARACTER_ASSETS } from '../../config/characterAssets';
import './Developer.css';

// API base URL
const API_BASE = '/api/assets';

const Character3DImport = () => {
  const navigate = useNavigate();
  const [characters] = useState(Object.values(CHARACTERS));
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [importUrl, setImportUrl] = useState('');
  const [importType, setImportType] = useState('model');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [assets, setAssets] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [filterRarity, setFilterRarity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [preview3D, setPreview3D] = useState(false);
  const [stats, setStats] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get auth token
  const getToken = () => localStorage.getItem('token');

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    try {
      const response = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch assets');
      
      const result = await response.json();
      
      if (result.success) {
        // Convert array to object keyed by characterId
        const assetsMap = {};
        result.data.forEach(asset => {
          assetsMap[asset.characterId] = asset;
        });
        setAssets(assetsMap);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      // Fallback to local config
      setAssets(CHARACTER_ASSETS.models);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Filter characters
  const filteredCharacters = characters.filter(char => {
    const matchesRarity = filterRarity === 'all' || char.rarity === filterRarity;
    const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         char.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRarity && matchesSearch;
  });

  // Get asset for character
  const getAsset = (characterId) => assets[characterId] || null;

  // Handle import via API
  const handleImport = async () => {
    if (!selectedCharacter || !importUrl) {
      setMessage({ type: 'error', text: 'الرجاء اختيار شخصية وإدخال الرابط' });
      return;
    }

    setLoading(true);
    setUploadProgress(20);

    try {
      const response = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          characterId: selectedCharacter.id,
          type: importType,
          url: importUrl,
          options: {
            format: importUrl.split('.').pop()
          }
        })
      });

      setUploadProgress(80);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import asset');
      }

      setUploadProgress(100);
      
      setMessage({ 
        type: 'success', 
        text: `✅ تم استيراد ${importType} لـ ${selectedCharacter.name} بنجاح!` 
      });
      
      // Refresh assets
      await fetchAssets();
      
      setImportUrl('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  // Handle remove via API
  const handleRemove = async (characterId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الأصل؟')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove asset');
      }

      setMessage({ type: 'success', text: '✅ تم حذف الأصل بنجاح' });
      await fetchAssets();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // For now, just show a message about file upload
      setMessage({ 
        type: 'info', 
        text: '📁 يمكنك رفع الملفات عبر نموذج الاستيراد أدناه' 
      });
    }
  };

  // Get rarity color
  const getRarityColor = (rarity) => {
    const colors = { 
      common: '#22c55e', 
      uncommon: '#3b82f6', 
      rare: '#a855f7', 
      epic: '#f59e0b', 
      legendary: '#ef4444', 
      mythic: '#ec4899' 
    };
    return colors[rarity] || '#6b7280';
  };

  // Get rarity name
  const getRarityName = (rarity) => {
    const names = { 
      common: 'عادي', 
      uncommon: 'غير عادي', 
      rare: 'نادر', 
      epic: 'أسطوري', 
      legendary: 'خرافي', 
      mythic: 'ميثي' 
    };
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

      {/* Stats Bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">الإجمالي</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.withModels}</span>
            <span className="stat-label">نماذج 3D</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.withTextures}</span>
            <span className="stat-label">أنسجة</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.external}</span>
            <span className="stat-label">خارجي</span>
          </div>
        </div>
      )}

      {/* Real-time Toggle */}
      <div className="updates-toggle">
        <label className="toggle-label">
          <input 
            type="checkbox" 
            checked={realTimeUpdates} 
            onChange={(e) => setRealTimeUpdates(e.target.checked)} 
          />
          <span className="toggle-switch"></span>
          <span>التحديثات الآنية</span>
        </label>
        <button className="btn btn-sm" onClick={fetchAssets}>
          🔄 تحديث
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {/* Progress Bar */}
      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="🔍 البحث عن شخصية..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)}>
            <option value="all">كل الندادات</option>
            <option value="common">عادي</option>
            <option value="uncommon">غير عادي</option>
            <option value="rare">نادر</option>
            <option value="epic">أسطوري</option>
            <option value="legendary">خرافي</option>
            <option value="mythic">ميثي</option>
          </select>
        </div>
        <div className="view-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
          >
            ⊞
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="import-content">
        {/* Import Form */}
        <div 
          className={`import-form-card ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h2>📥 استيراد أصل جديد</h2>
          
          {/* Character Selection */}
          <div className="form-group">
            <label>اختر الشخصية</label>
            <div className="character-select-grid">
              {filteredCharacters.map(char => (
                <div 
                  key={char.id}
                  className={`character-select-item ${selectedCharacter?.id === char.id ? 'selected' : ''}`}
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

          {/* Import Type */}
          <div className="form-group">
            <label>نوع الاستيراد</label>
            <div className="import-type-buttons">
              <button 
                className={importType === 'model' ? 'active' : ''} 
                onClick={() => setImportType('model')}
              >
                🎮 نموذج 3D
              </button>
              <button 
                className={importType === 'texture' ? 'active' : ''} 
                onClick={() => setImportType('texture')}
              >
                🧱 نسيج
              </button>
              <button 
                className={importType === 'preview' ? 'active' : ''} 
                onClick={() => setImportType('preview')}
              >
                🖼️ معاينة
              </button>
            </div>
          </div>

          {/* URL Input */}
          <div className="form-group">
            <label>رابط الملف</label>
            <input 
              type="url" 
              placeholder="https://cdn.example.com/model.glb" 
              value={importUrl} 
              onChange={(e) => setImportUrl(e.target.value)}
              disabled={loading}
            />
            <small>الصيغ المدعومة: GLB, GLTF, FBX, OBJ, PNG, JPG, WebP</small>
          </div>

          {/* Import Button */}
          <button 
            className="btn btn-primary" 
            onClick={handleImport} 
            disabled={loading || !selectedCharacter || !importUrl}
          >
            {loading ? '⏳ جاري الاستيراد...' : '📥 استيراد'}
          </button>
        </div>

        {/* Characters Grid */}
        <div className="characters-grid-container">
          <h2>📦 الشخصيات ({filteredCharacters.length})</h2>
          
          <div className={`characters-grid ${viewMode}`}>
            {filteredCharacters.map(char => {
              const asset = getAsset(char.id);
              const hasAsset = asset?.modelUrl || asset?.previewUrl;
              
              return (
                <div 
                  key={char.id} 
                  className={`character-card ${hasAsset ? 'has-asset' : ''}`}
                  style={{ borderColor: getRarityColor(char.rarity) }}
                >
                  <div className="card-header">
                    <span className="char-icon">{char.icon}</span>
                    <span 
                      className="rarity-badge" 
                      style={{ backgroundColor: getRarityColor(char.rarity) }}
                    >
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
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleRemove(char.id)}
                          disabled={loading}
                        >
                          🗑️ حذف
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => setPreview3D(true)}
                        >
                          👁️ معاينة
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3D Preview Modal */}
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
