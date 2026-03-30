// 🎁 Realistic 3D Box with Advanced Lighting for PuzzleChain
// Dynamic lighting, reflections, and volumetric effects

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
    this.mouseX = 0;
    this.mouseY = 0;
    this.lightX = 0.5;
    this.lightY = 0.5;
    this.init();
  }

  init() {
    this.element.classList.add('advanced-box-container');
    if (this.options.rarity) {
      this.element.classList.add(`rarity-${this.options.rarity}`);
    }
    
    this.render();
    this.addEventListeners();
    this.startIdleAnimation();
    this.startDynamicLighting();
  }

  getRarityConfig() {
    const configs = {
      common: {
        primary: '#7a7a7a',
        secondary: '#4a4a4a',
        accent: '#9a9a9a',
        glow: 'rgba(122, 122, 122, 0.3)',
        lightColor: 'rgba(255, 255, 255, 0.15)',
        particleColor: '#d0d0d0',
        emissive: '#505050'
      },
      uncommon: {
        primary: '#10b981',
        secondary: '#047857',
        accent: '#34d399',
        glow: 'rgba(16, 185, 129, 0.5)',
        lightColor: 'rgba(52, 211, 153, 0.2)',
        particleColor: '#34d399',
        emissive: '#065f46'
      },
      rare: {
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        accent: '#60a5fa',
        glow: 'rgba(59, 130, 246, 0.6)',
        lightColor: 'rgba(96, 165, 250, 0.25)',
        particleColor: '#60a5fa',
        emissive: '#1e3a8a'
      },
      epic: {
        primary: '#8b5cf6',
        secondary: '#6d28d9',
        accent: '#a78bfa',
        glow: 'rgba(139, 92, 246, 0.7)',
        lightColor: 'rgba(167, 139, 250, 0.3)',
        particleColor: '#a78bfa',
        emissive: '#4c1d95'
      },
      legendary: {
        primary: '#f59e0b',
        secondary: '#b45309',
        accent: '#fbbf24',
        glow: 'rgba(245, 158, 11, 0.8)',
        lightColor: 'rgba(251, 191, 36, 0.35)',
        particleColor: '#fbbf24',
        emissive: '#78350f'
      }
    };
    return configs[this.options.rarity] || configs.common;
  }

  render() {
    const config = this.getRarityConfig();
    
    this.element.innerHTML = `
      <div class="advanced-box" style="
        --primary: ${config.primary}; 
        --secondary: ${config.secondary}; 
        --accent: ${config.accent}; 
        --glow: ${config.glow};
        --light-color: ${config.lightColor};
        --emissive: ${config.emissive};
      ">
        <!-- Dynamic Light Source -->
        <div class="dynamic-light"></div>
        
        <!-- Volumetric Light Rays -->
        <div class="light-rays"></div>
        
        <!-- Ambient Occlusion -->
        <div class="ambient-occlusion"></div>
        
        <!-- Main Box Structure -->
        <div class="box-structure">
          <!-- Lid -->
          <div class="box-lid">
            <div class="lid-surface">
              <div class="lid-highlight"></div>
              <div class="lid-specular"></div>
              <div class="lid-shine"></div>
              <div class="lid-detail"></div>
              <div class="lid-rim-light"></div>
            </div>
            <div class="lid-side lid-front"></div>
            <div class="lid-side lid-left"></div>
            <div class="lid-side lid-right"></div>
            <div class="lid-side lid-back"></div>
          </div>
          
          <!-- Box Body -->
          <div class="box-body">
            <div class="body-front">
              <div class="front-surface">
                <div class="front-highlight"></div>
                <div class="front-specular"></div>
                <div class="front-shine"></div>
                <div class="front-fresnel"></div>
              </div>
              <div class="front-panel">
                <div class="panel-glow"></div>
                ${this.options.image ? 
                  `<img src="${this.options.image}" alt="${this.options.title}" class="box-icon" />` : 
                  '<div class="box-icon-placeholder">🎁</div>'
                }
                <div class="box-label">${this.options.title}</div>
                <div class="box-value">${this.options.price} 🪙</div>
              </div>
            </div>
            <div class="body-side body-left">
              <div class="side-surface">
                <div class="side-highlight"></div>
              </div>
            </div>
            <div class="body-side body-right">
              <div class="side-surface">
                <div class="side-highlight"></div>
              </div>
            </div>
            <div class="body-side body-back">
              <div class="back-surface"></div>
            </div>
            <div class="body-side body-bottom">
              <div class="bottom-surface"></div>
            </div>
          </div>
        </div>
        
        <!-- Environment Reflection -->
        <div class="environment-reflection"></div>
        
        <!-- Shadow System -->
        <div class="shadow-group">
          <div class="shadow-main"></div>
          <div class="shadow-ambient"></div>
        </div>
        
        <!-- Particles -->
        <div class="particles-container"></div>
        
        <!-- Rarity Glow -->
        <div class="rarity-glow"></div>
        
        <!-- Rarity Badge -->
        <div class="rarity-badge">
          <span class="rarity-text">${this.getRarityText()}</span>
          <span class="rarity-sparkle"></span>
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
    this.element.addEventListener('mouseenter', (e) => this.onHover(e));
    this.element.addEventListener('mouseleave', (e) => this.onLeave(e));
    this.element.addEventListener('click', () => this.open());
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onHover(e) {
    if (!this.isOpening) {
      this.element.classList.add('hovering');
    }
  }

  onLeave(e) {
    this.element.classList.remove('hovering');
    this.resetLighting();
  }

  onMouseMove(e) {
    if (this.isOpening) return;
    
    const rect = this.element.getBoundingClientRect();
    this.mouseX = (e.clientX - rect.left) / rect.width;
    this.mouseY = (e.clientY - rect.top) / rect.height;
    
    this.updateDynamicLighting();
  }

  updateDynamicLighting() {
    const box = this.element.querySelector('.advanced-box');
    if (!box) return;
    
    // Calculate light position based on mouse
    const lightX = this.mouseX * 100;
    const lightY = this.mouseY * 100;
    
    // Update CSS custom properties for dynamic lighting
    box.style.setProperty('--light-x', `${lightX}%`);
    box.style.setProperty('--light-y', `${lightY}%`);
    
    // Update dynamic light element
    const dynamicLight = box.querySelector('.dynamic-light');
    if (dynamicLight) {
      dynamicLight.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, var(--light-color), transparent 60%)`;
    }
  }

  resetLighting() {
    const box = this.element.querySelector('.advanced-box');
    if (box) {
      box.style.setProperty('--light-x', '50%');
      box.style.setProperty('--light-y', '30%');
    }
  }

  startDynamicLighting() {
    // Subtle automatic light movement when idle
    let angle = 0;
    const animate = () => {
      if (this.isOpening) return;
      
      angle += 0.02;
      const x = 50 + Math.sin(angle) * 20;
      const y = 30 + Math.cos(angle * 0.7) * 15;
      
      const box = this.element.querySelector('.advanced-box');
      if (box && !this.element.classList.contains('hovering')) {
        box.style.setProperty('--light-x', `${x}%`);
        box.style.setProperty('--light-y', `${y}%`);
        
        const dynamicLight = box.querySelector('.dynamic-light');
        if (dynamicLight) {
          dynamicLight.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--light-color), transparent 60%)`;
        }
      }
      
      requestAnimationFrame(animate);
    };
    animate();
  }

  startIdleAnimation() {
    this.element.classList.add('idle-animating');
  }

  async open() {
    if (this.isOpening) return;
    this.isOpening = true;
    
    const box = this.element.querySelector('.advanced-box');
    const lid = this.element.querySelector('.box-lid');
    
    // Play sound
    if (window.audioService) {
      window.audioService.playSound('open-box');
    }
    
    // Pre-open intense lighting
    box.classList.add('pre-open');
    await this.delay(400);
    
    // Shake
    box.classList.add('shaking');
    await this.delay(600);
    box.classList.remove('shaking', 'pre-open');
    
    // Open with flash
    box.classList.add('opening');
    lid.classList.add('lid-opening');
    
    // Create particles
    this.createParticles();
    
    await this.delay(800);
    
    // Intense flash
    box.classList.add('flash');
    await this.delay(400);
    
    // Callback
    this.options.onOpen();
    
    this.isOpening = false;
  }

  createParticles() {
    const container = this.element.querySelector('.particles-container');
    const config = this.getRarityConfig();
    const particleCount = this.options.rarity === 'legendary' ? 60 : 
                         this.options.rarity === 'epic' ? 45 : 
                         this.options.rarity === 'rare' ? 35 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 120 + Math.random() * 180;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 80;
      const rz = (Math.random() - 0.5) * 1080;
      const delay = Math.random() * 0.15;
      const size = 3 + Math.random() * 10;
      
      particle.style.cssText = `
        --tx: ${tx}px;
        --ty: ${ty}px;
        --rz: ${rz}deg;
        --delay: ${delay}s;
        --size: ${size}px;
        --color: ${config.particleColor};
      `;
      
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 3000);
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

// Export
window.Box3D = Box3D;
