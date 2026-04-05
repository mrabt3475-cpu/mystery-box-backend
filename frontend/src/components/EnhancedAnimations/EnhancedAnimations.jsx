/**
 * ⚡ Enhanced Animations System
 * 
 * نظام تحريك محسن وقوي مع مؤثرات متقدمة
 * 
 * مميزات النظام:
 * - تحريكات ثلاثية الأبعاد
 * - مؤثرات الجزيئات المتقدمة
 * - تحريكات فيزيائية
 * - دعم Reduced Motion
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import './EnhancedAnimations.css';

// ========================
// 🎯 3D Transform Animations
// ========================

export const Flip3D = ({ 
  children, 
  flip = false, 
  duration = 600, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`flip-3d ${flip ? 'flipped' : ''} ${className}`}
      style={{ '--duration': `${duration}ms` }}
      {...props}
    >
      <div className="flip-3d__inner">
        <div className="flip-3d__front">{children}</div>
        <div className="flip-3d__back">{children}</div>
      </div>
    </div>
  );
};

export const Rotate3D = ({ 
  children, 
  axis = 'y', 
  angle = 360, 
  duration = 2000, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`rotate-3d rotate-3d--${axis} ${className}`}
      style={{ '--duration': `${duration}ms`, '--angle': `${angle}deg` }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Tilt3D = ({ 
  children, 
  tiltX = 20, 
  tiltY = 20, 
  className = '', 
  ...props 
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -tiltX;
    const rotateY = ((x - centerX) / centerX) * tiltY;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={ref}
      className={`tilt-3d ${className}`}
      style={{ 
        '--rotate-x': `${rotate.x}deg`,
        '--rotate-y': `${rotate.y}deg`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

// ========================
// 🌊 Wave & Ripple Effects
// ========================

export const Wave = ({ 
  color = 'var(--color-primary)', 
  count = 3, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`wave-container ${className}`} {...props}>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="wave"
          style={{ 
            background: color,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

export const Ripple = ({ 
  active = true, 
  color = 'var(--color-primary)', 
  className = '', 
  ...props 
}) => {
  if (!active) return null;

  return (
    <div className={`ripple-container ${className}`} {...props}>
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="ripple"
          style={{ 
            borderColor: color,
            animationDelay: `${i * 0.4}s`
          }}
        />
      ))}
    </div>
  );
};

export const Radar = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`radar-container ${className}`} {...props}>
      <div className="radar"></div>
      <div className="radar radar--2"></div>
      <div className="radar radar--3"></div>
    </div>
  );
};

// ========================
// ✨ Particle Systems
// ========================

export const ParticleField = ({ 
  count = 50,
  speed = 1,
  color = '#8b5cf6',
  className = '',
  ...props 
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
  }, [count]);

  return (
    <div className={`particle-field ${className}`} {...props}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle-field__particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            animationDuration: `${p.duration / speed}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export const Fireflies = ({ 
  count = 20,
  className = '',
  ...props 
}) => {
  const fireflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5
    }));
  }, [count]);

  return (
    <div className={`fireflies-container ${className}`} {...props}>
      {fireflies.map(f => (
        <div
          key={f.id}
          className="firefly"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// ========================
// 🎪 Circle & Ring Animations
// ========================

export const SpinningCircles = ({ 
  count = 3,
  size = 40,
  color = 'var(--color-primary)',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`spinning-circles ${className}`}
      style={{ '--size': `${size}px`, '--color': color }}
      {...props}
    >
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="spinning-circle"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

export const PulsingRings = ({ 
  count = 3,
  size = 60,
  color = 'var(--color-primary)',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`pulsing-rings ${className}`}
      style={{ '--size': `${size}px`, '--color': color }}
      {...props}
    >
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="pulsing-ring"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </div>
  );
};

export const Orbit = ({ 
  children,
  speed = 2000,
  radius = 80,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`orbit-container ${className}`}
      style={{ '--speed': `${speed}ms`, '--radius': `${radius}px` }}
      {...props}
    >
      <div className="orbit-center">{children}</div>
      <div className="orbit-path">
        <div className="orbit-satellite"></div>
      </div>
    </div>
  );
};

// ========================
// 💫 Physics-based Animations
// ========================

export const ElasticBounce = ({ 
  children, 
  bounce = true,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`elastic-bounce ${bounce ? 'bouncing' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Spring = ({ 
  children, 
  tension = 100,
  friction = 10,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`spring-animation ${className}`}
      style={{ 
        '--tension': tension,
        '--friction': friction
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const RubberBand = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`rubber-band ${className}`} {...props}>
      {children}
    </div>
  );
};

// ========================
// 🎭 Text Animations
// ========================

export const TextReveal = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`text-reveal ${className}`} {...props}>
      {children.split('').map((char, i) => (
        <span 
          key={i} 
          className="text-reveal__char"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export const TextGlow = ({ 
  children, 
  color = '#8b5cf6',
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={`text-glow ${className}`}
      style={{ '--glow-color': color }}
      {...props}
    >
      {children}
    </span>
  );
};

export const Typewriter = ({ 
  text, 
  speed = 50,
  className = '',
  ...props 
}) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={`typewriter ${className}`} {...props}>
      {displayed}
      <span className="typewriter__cursor">|</span>
    </span>
  );
};

// ========================
// 🎯 Advanced Reveal Effects
// ========================

export const ClipReveal = ({ 
  children, 
  direction = 'top',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`clip-reveal clip-reveal--${direction} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const BlurReveal = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`blur-reveal ${className}`} {...props}>
      {children}
    </div>
  );
};

export const SlideReveal = ({ 
  children, 
  direction = 'left',
  distance = 100,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`slide-reveal slide-reveal--${direction} ${className}`}
      style={{ '--distance': `${distance}px` }}
      {...props}
    >
      {children}
    </div>
  );
};

// ========================
// 🌀 Glitch Effects
// ========================

export const Glitch = ({ 
  children, 
  active = true,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`glitch ${active ? 'active' : ''} ${className}`}
      data-text={children}
      {...props}
    >
      {children}
    </div>
  );
};

export const ChromaticAberration = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`chromatic-aberration ${className}`} {...props}>
      <span className="chromatic-aberration__red">{children}</span>
      <span className="chromatic-aberration__green">{children}</span>
      <span className="chromatic-aberration__blue">{children}</span>
    </div>
  );
};

// ========================
// 🎪 Skeleton Loading
// ========================

export const SkeletonPulse = ({ 
  className = '',
  ...props 
}) => {
  return (
    <div className={`skeleton-pulse ${className}`} {...props}>
      <div className="skeleton-pulse__wave"></div>
    </div>
  );
};

export const SkeletonShimmer = ({ 
  className = '',
  ...props 
}) => {
  return (
    <div className={`skeleton-shimmer ${className}`} {...props}>
      <div className="skeleton-shimmer__gradient"></div>
    </div>
  );
};

export default {
  Flip3D,
  Rotate3D,
  Tilt3D,
  Wave,
  Ripple,
  Radar,
  ParticleField,
  Fireflies,
  SpinningCircles,
  PulsingRings,
  Orbit,
  ElasticBounce,
  Spring,
  RubberBand,
  TextReveal,
  TextGlow,
  Typewriter,
  ClipReveal,
  BlurReveal,
  SlideReveal,
  Glitch,
  ChromaticAberration,
  SkeletonPulse,
  SkeletonShimmer
};