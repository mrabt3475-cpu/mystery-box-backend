/**
 * 🎨 Theme Configuration
 * 
 * ملف تكوين السمات - يمكن للمطورين إنشاء سمات جديدة
 * أو تخصيص السمات الموجودة
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// ========================
// 🎭 السمات المتاحة
// ========================
export const themes = {
  dark: {
    id: 'dark',
    name: 'داكن',
    nameEn: 'Dark',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: '#334155',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  },
  light: {
    id: 'light',
    name: 'فاتح',
    nameEn: 'Light',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceHover: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  },
  glass: {
    id: 'glass',
    name: 'زجاج',
    nameEn: 'Glass',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      background: 'rgba(15, 23, 42, 0.8)',
      surface: 'rgba(30, 41, 59, 0.6)',
      surfaceHover: 'rgba(51, 65, 85, 0.4)',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'محيط',
    nameEn: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#0c1929',
      surface: '#132f4c',
      surfaceHover: '#173a5e',
      text: '#e3f2fd',
      textMuted: '#90caf9',
      border: '#1e4976',
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'غروب',
    nameEn: 'Sunset',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#ef4444',
      accent: '#f59e0b',
      background: '#1a0a0a',
      surface: '#2d1f1f',
      surfaceHover: '#3d2a2a',
      text: '#fef2f2',
      textMuted: '#fca5a5',
      border: '#4a2c2c',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  },
  forest: {
    id: 'forest',
    name: 'غابة',
    nameEn: 'Forest',
    colors: {
      primary: '#22c55e',
      primaryHover: '#16a34a',
      secondary: '#14b8a6',
      accent: '#a3e635',
      background: '#052e16',
      surface: '#14532d',
      surfaceHover: '#166534',
      text: '#f0fdf4',
      textMuted: '#bbf7d0',
      border: '#14532d',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  }
};

// ========================
// 🎨 Context
// ========================
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ========================
// 🏭 Theme Provider
// ========================
export const ThemeProvider = ({ children, defaultTheme = 'dark' }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [customTheme, setCustomTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  // تحميل السمة من API
  useEffect(() => {
    loadThemeFromAPI();
  }, []);

  const loadThemeFromAPI = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('/api/settings/public', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.data?.design) {
          const { primaryColor, backgroundColor, surfaceColor, textColor } = res.data.data.design;
          
          if (primaryColor || backgroundColor) {
            setCustomTheme({
              primary: primaryColor || '#8b5cf6',
              background: backgroundColor || '#0f172a',
              surface: surfaceColor || '#1e293b',
              text: textColor || '#f8fafc'
            });
          }
        }
      }
    } catch (error) {
      console.log('Using default theme');
    } finally {
      setLoading(false);
    }
  };

  // تطبيق السمة على CSS
  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;
    const currentTheme = customTheme || themes[theme]?.colors || themes.dark.colors;

    // تطبيق الألوان
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // تطبيق سمة HTML
    root.setAttribute('data-theme', theme);
  }, [theme, customTheme, loading]);

  // تغيير السمة
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setCustomTheme(null);
    localStorage.setItem('theme', newTheme);
  };

  // إضافة سمة مخصصة
  const addCustomTheme = (themeConfig) => {
    setCustomTheme(themeConfig);
  };

  // الحصول على ألوان السمة الحالية
  const getThemeColors = () => {
    return customTheme || themes[theme]?.colors || themes.dark.colors;
  };

  const value = {
    theme,
    themes,
    customTheme,
    loading,
    changeTheme,
    addCustomTheme,
    getThemeColors,
    colors: getThemeColors()
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ========================
// 🔧 Helper Components
// ========================
export const ThemeSelector = ({ onChange }) => {
  const { theme, changeTheme, themes } = useTheme();

  return (
    <div className="theme-selector">
      {Object.values(themes).map((t) => (
        <button
          key={t.id}
          className={`theme-btn ${theme === t.id ? 'active' : ''}`}
          onClick={() => {
            changeTheme(t.id);
            onChange?.(t.id);
          }}
          style={{
            background: t.colors.background,
            borderColor: theme === t.id ? t.colors.primary : t.colors.border
          }}
        >
          <span
            className="theme-preview"
            style={{
              background: `linear-gradient(135deg, ${t.colors.primary} 0%, ${t.colors.secondary || t.colors.accent} 100%)`
            }}
          />
          <span style={{ color: t.colors.text }}>{t.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeProvider;