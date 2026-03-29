// 🎁 Realistic 3D Box Component for PuzzleChain
// Advanced CSS 3D with realistic lighting and physics

class Box3D {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      rarity: options.rarity || 'common',
      price: options.price || 0,
      title: options.title || 'صندوق',
      image: options.image || '',
      onOpen: options.onOpen || (() => {}),
      ...options
    };
    
    this.isOpening = false;
    this.init();
  }

  init() {
    this.element.classList.add('realistic-box-container');
    if (this.options.rarity) {
      this.element.classList.add(`rarity-${this.options.rarity}`);
    }
    
    this.render();
    this.addEventListeners();
    this.startIdleAnimation();
  }

  getRarityConfig() {
    const configs = {
      common: {
        primary: '#8b8b8b',
        secondary: '#5a5a5a',
        accent: '#a0a0a0',
        glow: 'rgba(139, 139, 139, 0.3)',
        particleColor: '#c0c0c0',
        shine: 'rgba(255,255,255,0.1)'
      },
      uncommon: {
        primary: '#22c55e',
        secondary: '#15803d',
        accent: '#4ade80',
        glow: 'rgba(34, 197, 94, 0.4)',
        particleColor: '#4ade80',
        shine: 'rgba(255,255,255,0.2)'
      },
      rare: {
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        accent: '#60a5fa',
        glow: 'rgba(59, 130, 246, 0.5)',
        particleColor: '#60a5fa',
        shine: 'rgba(255,255,255,0.25)'
      },
      epic: {
        primary: '#a855f7',
        secondary: '#7c3aed',
        accent: '#c084fc',
        glow: 'rgba(168, 85, 247, 0.6)',
        particleColor: '#c084fc',
        shine: 'rgba(255,255,255,0.3)'
      },
      legendary: {
        primary: '#f59e0b',
        secondary: '#b45309',
        accent: '#fbbf24',
        glow: 'rgba(245, 158, 11, 0.7)',
        particleColor: '#fbbf24',
        shine: 'rgba(255,255,255,0.4)'
      }
    };
    return configs[this.options.rarity] || configs.common;
  }

  render() {
    const config = this.getRarityConfig();
    
    this.element.innerHTML = `
      <div class="realistic-box" style="--primary: ${config.primary}; --secondary: ${config.secondary}; --accent: ${config.accent}; --glow: ${config.glow};">
        <!-- Ambient Glow -->
        <div class="box-ambient-glow"></div>
        
        <!-- Main Box Structure -->
        <div class="box-structure">
          <!-- Lid -->
          <div class="box-lid">
            <div class="lid-surface">
              <div class="lid-shine"></div>
              <div class="lid-detail"></div>
              <div class="lid-edge"></div>
            </div>
            <div class="lid-front"></div>
            <div class="lid-left"></div>
            <div class="lid-right"></div>
            <div class="lid-back"></div>
          </div>
          
          <!-- Box Body -->
          <div class="box-body">
            <div class="body-front">
              <div class="front-surface">
                <div class="front-shine"></div>
                <div class="front-design"></div>
              </div>
              <div class="front-panel">
                ${this.options.image ? `<img src="${this.options.image}" alt="${this.options.title}" class="box-icon" />` : '<div class="box-icon-placeholder">📦</div>'}
                <div class="box-label">${this.options.title}</div>
                <div class="box-value">${this.options.price} 🪙</div>
              </div>
            </div>
            <div class="body-left">
              <div class="side-surface"></div>
            </div>
            <div class="body-right">
              <div class="side-surface"></div>
            </div>
            <div class="body-back">
              <div class="back-surface"></div>
            </div>
            <div class="body-bottom">
              <div class="bottom-surface"></div>
            </div>
          </div>
        </div>
        
        <!-- Shadow -->
        <div class="box-shadow"></div>
        
        <!-- Particles Container -->
        <div class="particles-container"></div>
        
        <!-- Rarity Badge -->
        <div class="rarity-badge">
          <span class="rarity-text">${this.getRarityText()}</span>
        </div>
      </div>
    `;
  }

  getRarityText() {
    const rarities = {
      common: 'عادي',
      uncommon: 'غير عادي',
      rare: 'نادر',
      epic: 'أسطوري',
      legendary: 'خرافي'
    };
    return rarities[this.options.rarity] || 'عادي';
  }

  addEventListeners() {
    this.element.addEventListener('mouseenter', () => this.onHover());
    this.element.addEventListener('mouseleave', () => this.onLeave());
    this.element.addEventListener('click', () => this.open());
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onHover() {
    if (!this.isOpening) {
      this.element.classList.add('hovering');
    }
  }

  onLeave() {
    this.element.classList.remove('hovering');
    this.resetRotation();
  }

  onMouseMove(e) {
    if (this.isOpening) return;
    
    const rect = this.element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    const box = this.element.querySelector('.realistic-box');
    if (box) {
      box.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
    }
  }

  resetRotation() {
    const box = this.element.querySelector('.realistic-box');
    if (box) {
      box.style.transform = '';
    }
  }

  startIdleAnimation() {
    this.element.classList.add('idle-animating');
  }

  async open() {
    if (this.isOpening) return;
    this.isOpening = true;
    
    const box = this.element.querySelector('.realistic-box');
    const lid = this.element.querySelector('.box-lid');
    
    // Play sound
    if (window.audioService) {
      window.audioService.playSound('open-box');
    }
    
    // Pre-open shake
    box.classList.add('shaking');
    await this.delay(600);
    box.classList.remove('shaking');
    
    // Open animation
    box.classList.add('opening');
    lid.classList.add('lid-opening');
    
    // Create particles
    this.createParticles();
    
    await this.delay(800);
    
    // Flash effect
    box.classList.add('flash');
    
    await this.delay(300);
    
    // Callback
    this.options.onOpen();
    
    this.isOpening = false;
  }

  createParticles() {
    const container = this.element.querySelector('.particles-container');
    const config = this.getRarityConfig();
    const particleCount = this.options.rarity === 'legendary' ? 50 : 
                         this.options.rarity === 'epic' ? 40 : 
                         this.options.rarity === 'rare' ? 30 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 150 + Math.random() * 150;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100;
      const rz = (Math.random() - 0.5) * 720;
      const delay = Math.random() * 0.2;
      const size = 4 + Math.random() * 8;
      
      particle.style.cssText = `
        --tx: ${tx}px;
        --ty: ${ty}px;
        --rz: ${rz}deg;
        --delay: ${delay}s;
        --size: ${size}px;
        --color: ${config.particleColor};
      `;
      
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2500);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static create(data) {
    const container = document.createElement('div');
    document.querySelector('.boxes-grid')?.appendChild(container);
    return new Box3D(container, data);
  }
}

// Prize Reveal Component
class PrizeReveal {
  constructor(prize) {
    this.prize = prize;
  }

  show() {
    const overlay = document.createElement('div');
    overlay.className = 'prize-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s ease;
    `;

    const container = document.createElement('div');
    container.className = 'prize-container';
    container.style.cssText = `
      text-align: center;
      padding: 60px;
      max-width: 550px;
      animation: prizeReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    const rarityColors = {
      common: '#8b8b8b',
      uncommon: '#22c55e',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };
    
    const color = rarityColors[this.prize.rarity] || '#8b8b8b';
    const glowIntensity = this.prize.rarity === 'legendary' ? '50px' : 
                         this.prize.rarity === 'epic' ? '40px' : '30px';

    container.innerHTML = `
      <div class="prize-glow" style="box-shadow: 0 0 ${glowIntensity} ${color};"></div>
      <h2 class="prize-title" style="color: ${color};">
        <span class="title-text">🎉 تهانينا! 🎉</span>
      </h2>
      <div class="prize-image-wrapper">
        <div class="prize-sparkle"></div>
        <img src="${this.prize.image}" alt="${this.prize.name}" 
          class="prize-image" 
          style="filter: drop-shadow(0 0 ${glowIntensity} ${color});" />
      </div>
      <h3 class="prize-name">${this.prize.name}</h3>
      <div class="prize-value" style="color: ${color};">
        <span class="value-icon">💰</span>
        <span class="value-amount">${this.prize.value}</span>
        <span class="value-currency">🪙</span>
      </div>
      <button class="prize-close-btn" onclick="this.closest('.prize-overlay').remove()">
        <span>إغلاق</span>
        <span class="btn-icon">✕</span>
      </button>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Add styles
    this.addStyles();

    // Play win sound
    if (window.audioService) {
      window.audioService.playSound('win');
    }
  }

  addStyles() {
    if (document.getElementById('prize-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'prize-styles';
    style.textContent = `
      @keyframes prizeReveal {
        0% { transform: scale(0) rotate(-10deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(2deg); }
        100% { transform: scale(1) rotate(0); opacity: 1; }
      }
      .prize-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: transparent;
        animation: glowPulse 2s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes glowPulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      .prize-title {
        font-size: 36px;
        margin-bottom: 30px;
        text-shadow: 0 0 30px currentColor;
      }
      .prize-image-wrapper {
        position: relative;
        display: inline-block;
        margin: 20px 0;
      }
      .prize-image {
        width: 220px;
        height: 220px;
        object-fit: contain;
        animation: prizeFloat 3s ease-in-out infinite;
      }
      @keyframes prizeFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      .prize-name {
        color: #fff;
        font-size: 28px;
        margin: 20px 0;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }
      .prize-value {
        font-size: 32px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
      }
      .prize-close-btn {
        margin-top: 30px;
        padding: 16px 50px;
        border-radius: 50px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 auto;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
      }
      .prize-close-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.7);
      }
    `;
    document.head.appendChild(style);
  }
}

// Export
window.Box3D = Box3D;
window.PrizeReveal = PrizeReveal;
