import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Config, ConfigDocument } from '../config/config.schema';
import { CacheService } from '../cache/cache.service';

export interface Theme {
  id: string;
  name: string;
  nameEn: string;
  bg: string;
  char: string;
  color: string;
  font: string;
  tags: string[];
}

export interface Animation {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  desc: string;
}

@Injectable()
export class ThemeService {
  private readonly logger = new Logger(ThemeService.name);

  constructor(
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
    private cacheService: CacheService,
  ) {}

  // Available themes (admin choices)
  getAvailableThemes(): Theme[] {
    return [
      {
        id: 'anime-neon',
        name: 'أنمي نيون',
        nameEn: 'Anime Neon',
        bg: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
        char: '🌸',
        color: '#ff6eb4',
        font: 'Cairo',
        tags: ['أنمي', 'نيون', 'وردي'],
      },
      {
        id: 'classic-royal',
        name: 'كلاسيك رويال',
        nameEn: 'Classic Royal',
        bg: 'linear-gradient(135deg,#1a0a00,#3d1f00,#1a0a00)',
        char: '👑',
        color: '#c8963c',
        font: 'Cinzel',
        tags: ['ملكي', 'ذهبي', 'أسطوري'],
      },
      {
        id: 'cyber-2077',
        name: 'سايبر 2077',
        nameEn: 'Cyber 2077',
        bg: 'linear-gradient(135deg,#001010,#002020,#001010)',
        char: '🤖',
        color: '#00ffc8',
        font: 'Orbitron',
        tags: ['سايبر', 'هولو', 'مستقبلي'],
      },
      {
        id: 'dark-fantasy',
        name: 'داك فانتازيا',
        nameEn: 'Dark Fantasy',
        bg: 'linear-gradient(135deg,#0d0010,#1a0030,#0d0010)',
        char: '🔮',
        color: '#c084fc',
        font: 'Cairo',
        tags: ['فانتازيا', 'داكن', 'سحري'],
      },
    ];
  }

  // Available animations
  getAnimations(): Animation[] {
    return [
      { id: 'float', name: 'Float', nameEn: 'Float', icon: '🪶', desc: 'حركة خفيفة' },
      { id: 'pulse', name: 'نبض', nameEn: 'Pulse', icon: '💗', desc: 'نبض قلبي' },
      { id: 'shake', name: 'هز', nameEn: 'Shake', icon: '📳', desc: 'اهتزاز قوي' },
      { id: 'sparkle', name: 'لمعان', nameEn: 'Sparkle', icon: '✨', desc: 'جذاب ومشرق' },
      { id: 'rotate', name: 'دوران', nameEn: 'Rotate', icon: '🔄', desc: 'دوران سلس' },
    ];
  }

  // Get GLOBAL theme (set by admin)
  async getGlobalTheme() {
    // Check cache first
    const cached = await this.cacheService.get('global:theme');
    if (cached) return cached;

    // Get from config
    const config = await this.configModel.findOne({ key: 'globalTheme' });
    
    const defaultTheme = this.getAvailableThemes()[0];
    const defaultAnim = this.getAnimations()[0];

    const globalTheme = config?.value || {
      theme: defaultTheme,
      animation: defaultAnim,
      soundEnabled: true,
      hapticsEnabled: true,
      particlesEnabled: true,
      updatedAt: new Date(),
      updatedBy: 'system',
    };

    // Cache for 5 minutes
    await this.cacheService.set('global:theme', globalTheme, 300);
    return globalTheme;
  }

  // ADMIN: Set global theme (only admin can call this)
  async setGlobalTheme(adminId: string, themeData: {
    themeId?: string;
    animationId?: string;
    soundEnabled?: boolean;
    hapticsEnabled?: boolean;
    particlesEnabled?: boolean;
  }) {
    const themes = this.getAvailableThemes();
    const animations = this.getAnimations();

    // Validate theme
    let selectedTheme = themes[0];
    if (themeData.themeId) {
      const found = themes.find(t => t.id === themeData.themeId);
      if (!found) throw new Error('Invalid theme ID');
      selectedTheme = found;
    }

    // Validate animation
    let selectedAnim = animations[0];
    if (themeData.animationId) {
      const found = animations.find(a => a.id === themeData.animationId);
      if (!found) throw new Error('Invalid animation ID');
      selectedAnim = found;
    }

    // Get current global theme
    const currentGlobal = await this.getGlobalTheme();

    const newGlobalTheme = {
      theme: selectedTheme,
      animation: selectedAnim,
      soundEnabled: themeData.soundEnabled ?? currentGlobal.soundEnabled,
      hapticsEnabled: themeData.hapticsEnabled ?? currentGlobal.hapticsEnabled,
      particlesEnabled: themeData.particlesEnabled ?? currentGlobal.particlesEnabled,
      updatedAt: new Date(),
      updatedBy: adminId,
    };

    // Save to config
    await this.configModel.findOneAndUpdate(
      { key: 'globalTheme' },
      { key: 'globalTheme', value: newGlobalTheme },
      { upsert: true }
    );

    // Invalidate cache
    await this.cacheService.del('global:theme');

    this.logger.log(`Global theme updated by admin ${adminId}: ${selectedTheme.name}`);

    return newGlobalTheme;
  }

  // Get full config for frontend (read-only for users)
  async getThemeConfig() {
    const [globalTheme, availableThemes, animations] = await Promise.all([
      this.getGlobalTheme(),
      Promise.resolve(this.getAvailableThemes()),
      Promise.resolve(this.getAnimations()),
    ]);

    return {
      global: globalTheme,
      available: {
        themes: availableThemes,
        animations,
      },
    };
  }
}
