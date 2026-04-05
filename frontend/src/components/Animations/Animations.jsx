/**
 * ✨ Animation System
 * 
 * نظام التحريك - يمكن تخصيصه من قبل المطور
 * 
 * كيفية الاستخدام:
 * <FadeIn>المحتوى</FadeIn>
 * <SlideIn direction="left">المحتوى</SlideIn>
 * <Bounce>المحتوى</Bounce>
 */

import React, { useEffect, useState, useRef } from 'react';
import './Animations.css';

// ========================
// 🎬 Base Animation Components
// ========================

// Fade In
export const FadeIn = ({ 
  children, 
  duration = 300, 
  delay = 0,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-fade-in ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`
    }}
    {...props}
  >
    {children}
  </div>
);

// Fade In Up
export const FadeInUp = ({ 
  children, 
  duration = 300, 
  delay = 0,
  distance = 20,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-fade-in-up ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      '--distance': `${distance}px`
    }}
    {...props}
  >
    {children}
  </div>
);

// Fade In Down
export const FadeInDown = ({ 
  children, 
  duration = 300, 
  delay = 0,
  distance = 20,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-fade-in-down ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      '--distance': `${distance}px`
    }}
    {...props}
  >
    {children}
  </div>
);

// Slide In Left
export const SlideInLeft = ({ 
  children, 
  duration = 300, 
  delay = 0,
  distance = 30,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-slide-in-left ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      '--distance': `${distance}px`
    }}
    {...props}
  >
    {children}
  </div>
);

// Slide In Right
export const SlideInRight = ({ 
  children, 
  duration = 300, 
  delay = 0,
  distance = 30,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-slide-in-right ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      '--distance': `${distance}px`
    }}
    {...props}
  >
    {children}
  </div>
);

// Scale In
export const ScaleIn = ({ 
  children, 
  duration = 300, 
  delay = 0,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-scale-in ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`
    }}
    {...props}
  >
    {children}
  </div>
);

// Bounce
export const Bounce = ({ 
  children, 
  duration = 500, 
  delay = 0,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-bounce ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`
    }}
    {...props}
  >
    {children}
  </div>
);

// Shake
export const Shake = ({ 
  children, 
  duration = 500, 
  delay = 0,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-shake ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`
    }}
    {...props}
  >
    {children}
  </div>
);

// Pulse
export const Pulse = ({ 
  children, 
  duration = 1000, 
  delay = 0,
  className = '', 
  infinite = true,
  ...props 
}) => (
  <div 
    className={`animation-pulse ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      animationIterationCount: infinite ? 'infinite' : '1'
    }}
    {...props}
  >
    {children}
  </div>
);

// Spin
export const Spin = ({ 
  children, 
  duration = 1000, 
  delay = 0,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-spin ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`
    }}
    {...props}
  >
    {children}
  </div>
);

// Float
export const Float = ({ 
  children, 
  duration = 3000, 
  delay = 0,
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-float ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`
    }}
    {...props}
  >
    {children}
  </div>
);

// Glow
export const Glow = ({ 
  children, 
  duration = 2000, 
  delay = 0,
  color = 'var(--color-primary)',
  className = '', 
  ...props 
}) => (
  <div 
    className={`animation-glow ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      '--glow-color': color
    }}
    {...props}
  >
    {children}
  </div>
);

// ========================
// 🎯 Stagger Animation (للمجموعات)
// ========================
export const Stagger = ({ 
  children, 
  staggerDelay = 100,
  className = '', 
  ...props 
}) => {
  const childArray = React.Children.toArray(children);
  
  return (
    <div className={`stagger-container ${className}`} {...props}>
      {childArray.map((child, index) => (
        <div 
          key={index}
          className="stagger-item"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// ========================
// 🔄 Infinite Loop Animation
// ========================
export const InfiniteLoop = ({ 
  children, 
  animation = 'pulse',
  duration = 2000,
  className = '', 
  ...props 
}) => (
  <div 
    className={`infinite-${animation} ${className}`}
    style={{ animationDuration: `${duration}ms` }}
    {...props}
  >
    {children}
  </div>
);

// ========================
// ⏱️ Scroll-triggered Animation
// ========================
export const ScrollReveal = ({ 
  children, 
  animation = 'fadeInUp',
  threshold = 0.1,
  className = '', 
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div 
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} animation-${animation} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  Bounce,
  Shake,
  Pulse,
  Spin,
  Float,
  Glow,
  Stagger,
  InfiniteLoop,
  ScrollReveal
};