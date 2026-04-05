/**
 * 🎮 Game Animations
 * 
 * تحريكات خاصة للألعاب والصناديق
 */

import React, { useState, useEffect } from 'react';
import './GameAnimations.css';

// ========================
// 📦 Box Opening Animation
// ========================
export const BoxOpening = ({
  box,
  onComplete,
  duration = 3000,
  className = '',
  ...props
}) => {
  const [stage, setStage] = useState('closed');

  useEffect(() => {
    const shakeTimer = setTimeout(() => setStage('shaking'), 500);
    const openTimer = setTimeout(() => setStage('opening'), 2000);
    const revealTimer = setTimeout(() => {
      setStage('reveal');
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(openTimer);
      clearTimeout(revealTimer);
    };
  }, [duration, onComplete]);

  return (
    <div className={`box-opening ${stage} ${className}`} {...props}>
      <div className="box-opening__box">
        <span className="box-opening__emoji">📦</span>
        <div className="box-opening__glow" />
      </div>
      
      {stage === 'shaking' && (
        <div className="box-opening__shake-indicator">
          <span>🔥</span> جاري التحضير...
        </div>
      )}
      
      {stage === 'opening' && (
        <div className="box-opening__lid">
          <span>🎁</span>
        </div>
      )}
    </div>
  );
};

// ========================
// 🎰 Slot Machine Animation
// ========================
export const SlotMachine = ({
  items = [],
  spinning = false,
  result,
  onComplete,
  className = '',
  ...props
}) => {
  const [displayItems, setDisplayItems] = useState(items);
  const [isSpinning, setIsSpinning] = useState(spinning);

  useEffect(() => {
    if (spinning) {
      setIsSpinning(true);
      const interval = setInterval(() => {
        setDisplayItems([...displayItems.slice(1), ...displayItems.slice(0, 1)]);
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsSpinning(false);
        onComplete?.(result);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [spinning]);

  return (
    <div className={`slot-machine ${isSpinning ? 'spinning' : ''} ${className}`} {...props}>
      <div className="slot-machine__reels">
        {displayItems.map((item, i) => (
          <div key={i} className="slot-machine__reel">
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========================
// 🏆 Trophy Animation
// ========================
export const TrophyAnimation = ({
  rank = 1,
  className = '',
  ...props
}) => {
  const emojis = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className={`trophy-animation rank-${rank} ${className}`} {...props}>
      <div className="trophy-animation__glow" />
      <span className="trophy-animation__emoji">{emojis[rank] || '🏅'}</span>
      <div className="trophy-animation__rays">
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{ transform: `rotate(${i * 45}deg)` }} />
        ))}
      </div>
    </div>
  );
};

// ========================
// 💎 Diamond Shine Effect
// ========================
export const DiamondShine = ({
  children,
  active = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`diamond-shine ${active ? 'active' : ''} ${className}`} {...props}>
      {children}
      <div className="diamond-shine__shine" />
    </div>
  );
};

// ========================
// 🎲 Dice Roll Animation
// ========================
export const DiceRoll = ({
  result,
  rolling = false,
  onComplete,
  className = '',
  ...props
}) => {
  const [isRolling, setIsRolling] = useState(rolling);
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  useEffect(() => {
    if (rolling) {
      setIsRolling(true);
      setTimeout(() => {
        setIsRolling(false);
        onComplete?.(result);
      }, 1500);
    }
  }, [rolling, result, onComplete]);

  return (
    <div className={`dice-roll ${isRolling ? 'rolling' : ''} ${className}`} {...props}>
      <span className="dice-roll__face">
        {isRolling ? '🎲' : diceFaces[result - 1]}
      </span>
    </div>
  );
};

// ========================
// 🔮 Crystal Ball Animation
// ========================
export const CrystalBall = ({
  active = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`crystal-ball ${active ? 'active' : ''} ${className}`} {...props}>
      <div className="crystal-ball__orb">
        <div className="crystal-ball__shine" />
        <div className="crystal-ball__glow" />
      </div>
      <div className="crystal-ball__base" />
    </div>
  );
};

export default {
  BoxOpening,
  SlotMachine,
  TrophyAnimation,
  DiamondShine,
  DiceRoll,
  CrystalBall
};