/**
 * 🎆 Special Effects System
 * 
 * نظام المؤثرات الخاصة - مؤثرات بصرية مذهلة
 */

import React from 'react';
import './SpecialEffects.css';

// ========================
// 🎇 Confetti Effect
// ========================
export const Confetti = ({ 
  active = true, 
  particleCount = 100,
  colors = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'],
  className = '',
  ...props 
}) => {
  if (!active) return null;

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 5 + Math.random() * 10
  }));

  return (
    <div className={`confetti-container ${className}`} {...props}>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            transform: `rotate(${p.rotation}deg)`,
            width: p.size,
            height: p.size
          }}
        />
      ))}
    </div>
  );
};

// ========================
// ✨ Sparkle Effect
// ========================
export const Sparkle = ({ 
  children, 
  color = '#f59e0b',
  count = 20,
  className = '',
  ...props 
}) => {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 1
  }));

  return (
    <div className={`sparkle-container ${className}`} style={{ position: 'relative' }} {...props}>
      {children}
      {sparkles.map(s => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            background: color
          }}
        />
      ))}
    </div>
  );
};

// ========================
// 💫 Particle Effect
// ========================
export const Particles = ({ 
  active = true,
  count = 30,
  color = '#8b5cf6',
  className = '',
  ...props 
}) => {
  if (!active) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2
  }));

  return (
    <div className={`particles-container ${className}`} {...props}>
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            background: color
          }}
        />
      ))}
    </div>
  );
};

// ========================
// 🎯 Prize Reveal Effect
// ========================
export const PrizeReveal = ({ 
  prize,
  rarity = 'common',
  className = '',
  ...props 
}) => {
  const rarityColors = {
    common: '#9ca3af',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythic: '#ef4444'
  };

  return (
    <div 
      className={`prize-reveal ${className}`}
      style={{ '--rarity-color': rarityColors[rarity] }}
      {...props}
    >
      <div className="prize-reveal__glow" />
      <div className="prize-reveal__rings">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="prize-reveal__content">
        <span className="prize-reveal__emoji">
          {prize?.image ? <img src={prize.image} alt="prize" /> : '🎁'}
        </span>
      </div>
    </div>
  );
};

export default { Confetti, Sparkle, Particles, PrizeReveal };