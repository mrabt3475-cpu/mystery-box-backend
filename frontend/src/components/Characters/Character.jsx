/**
 * 🎭 Character System
 * 
 * نظام الشخصيات - يمكن للمطور تخصيص الشخصيات
 * 
 * كيفية الاستخدام:
 * <Character type="warrior" animation="idle" size="lg" />
 */

import React from 'react';
import './Character.css';

// ========================
// 🎨 Character Data - يمكن تخصيصها
// ========================
export const characters = {
  // المحاربون
  warrior: {
    name: 'محارب',
    nameEn: 'Warrior',
    emoji: '⚔️',
    animations: ['idle', 'attack', 'defend', 'victory', 'defeat'],
    colors: {
      primary: '#ef4444',
      secondary: '#b91c1c',
      accent: '#fcd34d'
    }
  },
  mage: {
    name: 'ساحر',
    nameEn: 'Mage',
    emoji: '🔮',
    animations: ['idle', 'cast', 'channel', 'victory', 'defeat'],
    colors: {
      primary: '#a855f7',
      secondary: '#7c3aed',
      accent: '#c084fc'
    }
  },
  archer: {
    name: 'رامي',
    nameEn: 'Archer',
    emoji: '🏹',
    animations: ['idle', 'aim', 'shoot', 'victory', 'defeat'],
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#86efac'
    }
  },
  // الشخصيات الخاصة
  ninja: {
    name: 'نينجا',
    nameEn: 'Ninja',
    emoji: '🥷',
    animations: ['idle', 'sneak', 'attack', 'victory', 'defeat'],
    colors: {
      primary: '#1e293b',
      secondary: '#0f172a',
      accent: '#f43f5e'
    }
  },
  robot: {
    name: 'روبوت',
    nameEn: 'Robot',
    emoji: '🤖',
    animations: ['idle', 'scan', 'attack', 'victory', 'defeat'],
    colors: {
      primary: '#64748b',
      secondary: '#475569',
      accent: '#22d3ee'
    }
  },
  alien: {
    name: 'كائن فضائي',
    nameEn: 'Alien',
    emoji: '👽',
    animations: ['idle', 'beam', 'teleport', 'victory', 'defeat'],
    colors: {
      primary: '#22c55e',
      secondary: '#14b8a6',
      accent: '#a855f7'
    }
  },
  dragon: {
    name: 'تنين',
    nameEn: 'Dragon',
    emoji: '🐉',
    animations: ['idle', 'fly', 'breathe', 'victory', 'defeat'],
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#ef4444'
    }
  },
  unicorn: {
    name: 'وحيد قرن',
    nameEn: 'Unicorn',
    emoji: '🦄',
    animations: ['idle', 'gallop', 'magic', 'victory', 'defeat'],
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#fcd34d'
    }
  },
  ghost: {
    name: 'شبح',
    nameEn: 'Ghost',
    emoji: '👻',
    animations: ['idle', 'haunt', 'fade', 'victory', 'defeat'],
    colors: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: '#818cf8'
    }
  },
  pirate: قرصان: {
    name: 'قرصان',
    nameEn: 'Pirate',
    emoji: '🏴‍☠️',
    animations: ['idle', 'sail', 'attack', 'victory', 'defeat'],
    colors: {
      primary: '#1e293b',
      secondary: '#0f172a',
      accent: '#f59e0b'
    }
  },
  wizard: {
    name: 'ساحر كبير',
    nameEn: 'Wizard',
    emoji: '🧙',
    animations: ['idle', 'cast', 'teleport', 'victory', 'defeat'],
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#a855f7'
    }
  },
  vampire: {
    name: 'مستذئب',
    nameEn: 'Vampire',
    emoji: '🧛',
    animations: ['idle', 'bite', 'transform', 'victory', 'defeat'],
    colors: {
      primary: '#991b1b',
      secondary: '#7f1d1d',
      accent: '#dc2626'
    }
  }
};

// ========================
// 🎭 Character Component
// ========================
const Character = ({
  type = 'warrior',
  animation = 'idle',
  size = 'md',
  showName = false,
  className = '',
  onClick,
  ...props
}) => {
  const char = characters[type] || characters.warrior;

  const classes = [
    'character',
    `character--${size}`,
    `character--${animation}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      onClick={onClick}
      style={{
        '--char-primary': char.colors.primary,
        '--char-secondary': char.colors.secondary,
        '--char-accent': char.colors.accent
      }}
      {...props}
    >
      <div className="character__sprite">
        <span className="character__emoji">{char.emoji}</span>
        <div className="character__glow"></div>
      </div>
      
      {showName && (
        <span className="character__name">{char.name}</span>
      )}
    </div>
  );
};

// ========================
// 🎯 Character Selector
// ========================
export const CharacterSelector = ({
  selected,
  onSelect,
  showAll = true,
  className = '',
  ...props
}) => {
  const charList = showAll ? Object.entries(characters) : Object.entries(characters).slice(0, 6);

  return (
    <div className={`character-selector ${className}`} {...props}>
      {charList.map(([key, char]) => (
        <button
          key={key}
          className={`character-selector__item ${selected === key ? 'selected' : ''}`}
          onClick={() => onSelect(key)}
          style={{
            '--char-primary': char.colors.primary
          }}
        >
          <span className="character-selector__emoji">{char.emoji}</span>
          <span className="character-selector__name">{char.name}</span>
        </button>
      ))}
    </div>
  );
};

// ========================
// 🏆 Character Avatar
// ========================
export const CharacterAvatar = ({
  type,
  level = 1,
  size = 'md',
  className = '',
  ...props
}) => {
  const char = characters[type] || characters.warrior;

  return (
    <div 
      className={`character-avatar character-avatar--${size} ${className}`}
      style={{
        '--char-primary': char.colors.primary,
        '--char-secondary': char.colors.secondary
      }}
      {...props}
    >
      <div className="character-avatar__frame">
        <span className="character-avatar__emoji">{char.emoji}</span>
      </div>
      {level > 1 && (
        <span className="character-avatar__level">Lv.{level}</span>
      )}
    </div>
  );
};

export default Character;