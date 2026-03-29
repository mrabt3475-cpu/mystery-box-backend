// 🎁 Enhanced 3D Box Component for PuzzleChain
// Improved design with better animations and effects

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
    this.element.classList.add('box-3d-container');
    if (this.options.rarity) {
      this.element.classList.add(`box-${this.options.rarity}`);
    }
    
    this.render();
    this.addEventListeners();
    this.startFloating();
    this.addGlowEffect();
  }

  render() {
    const rarityColors = {
      common: { primary: '#94a3b8', secondary: '#64748b', glow: 'rgba(148, 163, 184, 0.5)' },
      uncommon: { primary: '#22c55e', secondary: '#16a34a', glow: 'rgba(34, 197, 94, 0.5)' },
      rare: { primary: '#3b82f6', secondary: '#2563eb', glow: 'rgba(59, 130, 246, 0.5)' },
      epic: { primary: '#a855f7', secondary: '#9333ea', glow: 'rgba(168, 85, 247, 0.5)' },
      legendary: { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245, 158, 11, 0.5)' }
    };
    
    const colors = rarityColors[this.options.rarity] || rarityColors.common;
    
    this.element.innerHTML = `
      <div class="box-3d-wrapper">
        <div class="box-3d-lid">
          <div class="box-lid-shine"></div>
        </div>
        <div class="box-3d-body">
          <div class="box-body-front">
            <div class="box-glow"></div>
            <div class="box-particles"></div>
            ${this.options.image ? `<img src="${this.options.image}" alt="${this.options.title}" class="box-image" />` : ''}
            <div class="box-info">
              <h3 class="box-title">${this.options.title}</h3>
              <div class="box-price">${this.options.price} 🪙</div>
              <span class="box-rarity rarity-${this.options.rarity}">
                ${this.getRarityText()}
              </span>
            </div>
          </div>
          <div class="box-body-side box-body-left"></div>
          <div class="box-body-side box-body-right"></div>
          <div class="box-body-side box-body-back"></div>
          <div class="box-body-side box-body-bottom"></div>
        </div>
        <div class="box-shadow"></div>
      </div>
    `;
    
    // Apply rarity colors
    this.element.style.setProperty('--rarity-primary', colors.primary);
    this.element.style.setProperty('--rarity-secondary', colors.secondary);
    this.element.style.setProperty('--rarity-glow', colors.glow);
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
  }

  onHover() {
    if (!this.isOpening) {
      this.element.classList.add('box-hover');
    }
  }

  onLeave() {
    this.element.classList.remove('box-hover');
  }

  startFloating() {
    this.element.classList.add('box-floating');
  }

  addGlowEffect() {
    // Add pulsing glow for rare boxes
    if (['uncommon', 'rare', 'epic', 'legendary'].includes(this.options.rarity)) {
      this.element.classList.add('box-glowing');
    }
  }

  async open() {
    if (this.isOpening) return;
    this.isOpening = true;
    
    const inner = this.element.querySelector('.box-3d-wrapper');
    const lid = this.element.querySelector('.box-3d-lid');
    
    // Play opening sound
    if (window.audioService) {
      window.audioService.playSound('open-box');
    }
    
    // Shake animation
    inner.classList.add('box-shake');
    
    await this.delay(500);
    inner.classList.remove('box-shake');
    
    // Opening animation
    inner.classList.add('box-opening');
    lid.classList.add('box-lid-open');
    this.createParticles();
    
    await this.delay(1000);
    
    // Callback
    this.options.onOpen();
    
    this.isOpening = false;
  }

  createParticles() {
    const container = this.element.querySelector('.box-particles');
    const colors = {
      common: ['#94a3b8', '#64748b'],
      uncommon: ['#22c55e', '#16a34a'],
      rare: ['#3b82f6', '#2563eb'],
      epic: ['#a855f7', '#9333ea'],
      legendary: ['#f59e0b', '#d97706', '#fbbf24']
    };
    
    const particleColors = colors[this.options.rarity] || colors.common;
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 300}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 300}px`);
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Static method to create box from data
  static create(data) {
    const container = document.createElement('div');
    document.querySelector('.boxes-grid').appendChild(container);
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
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;

    const container = document.createElement('div');
    container.className = 'prize-reveal';
    container.style.cssText = `
      text-align: center;
      padding: 40px;
      max-width: 500px;
    `;

    const rarityColors = {
      common: '#94a3b8',
      uncommon: '#22c55e',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };
    
    const color = rarityColors[this.prize.rarity] || '#94a3b8';


    container.innerHTML = `
      <h2 style="color: ${color}; font-size: 32px; margin-bottom: 20px; text-shadow: 0 0 20px rgba(245,158,11,0.5);">
        🎉 تهانينا! 🎉
      </h2>
      <img src="${this.prize.image}" alt="${this.prize.name}" 
        style="width: 200px; height: 200px; object-fit: contain; 
               filter: drop-shadow(0 0 30px ${color});" />
      <h3 style="color: #fff; font-size: 24px; margin: 20px 0;">${this.prize.name}</h3>
      <p style="color: #94a3b8; font-size: 18px;">
        القيمة: ${this.prize.value} 🪙
      </p>
      <button onclick="this.closest('.prize-overlay').remove()" 
        class="btn-open-box" style="margin-top: 30px;">
        إغلاق
      </button>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Play win sound
    if (window.audioService) {
      window.audioService.playSound('win');
    }
  }
}

// Export for global use
window.Box3D = Box3D;
window.PrizeReveal = PrizeReveal;
