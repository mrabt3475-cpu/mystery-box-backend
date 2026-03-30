import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ThemeService {
  private readonly logger = new Logger(ThemeService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cacheService: CacheService,
  ) {}

  getAvailableThemes() {
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

  getAnimations() {
    return [
      { id: 'float', name: 'Float', icon: '🪶', desc: 'حركة خفيفة' },
      { id: 'pulse', name: 'نبض', icon: '💗', desc: 'نبض قلبي' },
      { id: 'shake', name: 'هز', icon: '📳', desc: 'اهتزاز قوي' },
      { id: 'sparkle', name: 'لمعان', icon: '✨', desc: 'جذاب ومشرق' },
      { id: 'rotate', name: 'دوران', icon: '🔄', desc: 'دوران سلس' },
    ];
  }

  async getUserTheme(userId: string) {
    const cached = await this.cacheService.get(`theme:${userId}`);
    if (cached) return cached;

    const user = await this.userModel.findById(userId).select('themeSettings');
    const theme = user?.themeSettings || {
      name: 'أنمي نيون',
      animation: 'float',
      soundEnabled: true,
      hapticsEnabled: true,
      particlesEnabled: true,
    };

    await this.cacheService.set(`theme:${userId}`, theme, 3600);
    return theme;
  }

  async updateTheme(userId: string, themeData: {
    name?: string;
    animation?: string;
    soundEnabled?: boolean;
    hapticsEnabled?: boolean;
    particlesEnabled?: boolean;
  }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    const themes = this.getAvailableThemes();
    const validTheme = themes.find(t => t.name === themeData.name || t.nameEn === themeData.name);
    if (themeData.name && !validTheme) throw new Error('Invalid theme');

    const animations = this.getAnimations();
    const validAnim = animations.find(a => a.id === themeData.animation);
    if (themeData.animation && !validAnim) throw new Error('Invalid animation');

    user.themeSettings = { ...user.themeSettings, ...themeData };
    await user.save();
    await this.cacheService.del(`theme:${userId}`);

    this.logger.log(`Theme updated for user ${userId}`);
    return user.themeSettings;
  }

  async getFullThemeConfig(userId: string) {
    const [userThemes, availableThemes, animations] = await Promise.all([
      this.getUserTheme(userId),
      Promise.resolve(this.getAvailableThemes()),
      Promise.resolve(this.getAnimations()),
    ]);

    const currentTheme = availableThemes.find(
      t => t.name === userThemes.name || t.nameEn === userThemes.name
    ) || availableThemes[0];

    const currentAnim = animations.find(a => a.id === userThemes.animation) || animations[0];

    return {
      current: { ...userThemes, themeDetails: currentTheme, animationDetails: currentAnim },
      available: { themes: availableThemes, animations },
    };
  }
}
