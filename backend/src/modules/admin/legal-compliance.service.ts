import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LegalCompliance, AgeRestriction } from './legal-compliance.schema';
import { User, UserDocument } from '../users/user.schema';
import { RedisService } from '../shared/redis.service';

@Injectable()
export class LegalComplianceService {
  constructor(
    @InjectModel(LegalCompliance.name) private legalModel: Model<LegalCompliance>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * التحقق من الامتثال قبل عملية الشراء
   */
  async validatePurchase(userId: string, amount: number): Promise<{
    allowed: boolean;
    reason?: string;
    requiresVerification?: boolean;
  }> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    // 1. التحقق من العمر
    if (user.dateOfBirth) {
      const age = this.calculateAge(user.dateOfBirth);
      const compliance = await this.getActiveCompliance();
      
      if (compliance?.ageRestriction === AgeRestriction.PLUS_18 && age < 18) {
        return { allowed: false, reason: 'العمر أقل من 18 سنة' };
      }
      if (compliance?.ageRestriction === AgeRestriction.PLUS_16 && age < 16) {
        return { allowed: false, reason: 'العمر أقل من 16 سنة' };
      }
    }

    // 2. التحقق منCountry
    if (user.country) {
      const compliance = await this.getActiveCompliance();
      if (compliance?.regionalRestrictions?.blockedCountries?.includes(user.country)) {
        return { allowed: false, reason: 'الدولة محظورة' };
      }
    }

    // 3. التحقق من حدود الإنفاق
    const spendingCheck = await this.checkSpendingLimits(userId, amount);
    if (!spendingCheck.allowed) {
      return spendingCheck;
    }

    // 4. التحقق من KYC
    const compliance = await this.getActiveCompliance();
    const monthlyTotal = await this.getMonthlySpending(userId);
    
    if (compliance?.spendingLimits?.requireVerificationAbove) {
      if (monthlyTotal + amount > compliance.spendingLimits.requireVerificationAbove) {
        if (!user.isVerified) {
          return { 
            allowed: false, 
            reason: 'يتطلب التحقق من الهوية',
            requiresVerification: true,
          };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * التحقق من حدود الإنفاق
   */
  async checkSpendingLimits(userId: string, newAmount: number): Promise<{
    allowed: boolean;
    reason?: string;
    remaining?: number;
  }> {
    const compliance = await this.getActiveCompliance();
    if (!compliance?.spendingLimits) {
      return { allowed: true };
    }

    const { dailyLimit, weeklyLimit, monthlyLimit } = compliance.spendingLimits;

    // الحصول على الإنفاق الحالي
    const today = await this.getDailySpending(userId);
    const thisWeek = await this.getWeeklySpending(userId);
    const thisMonth = await this.getMonthlySpending(userId);

    if (dailyLimit && today + newAmount > dailyLimit) {
      return { 
        allowed: false, 
        reason: `تم الوصول للحد اليومي: ${dailyLimit}`,
        remaining: Math.max(0, dailyLimit - today),
      };
    }

    if (weeklyLimit && thisWeek + newAmount > weeklyLimit) {
      return { 
        allowed: false, 
        reason: `تم الوصول للحد الأسبوعي: ${weeklyLimit}`,
        remaining: Math.max(0, weeklyLimit - thisWeek),
      };
    }

    if (monthlyLimit && thisMonth + newAmount > monthlyLimit) {
      return { 
        allowed: false, 
        reason: `تم الوصول للحد الشهري: ${monthlyLimit}`,
        remaining: Math.max(0, monthlyLimit - thisMonth),
      };
    }

    return { allowed: true };
  }

  /**
   * تسجيل عملية إنفاق
   */
  async recordSpending(userId: string, amount: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const weekKey = this.getWeekKey();
    const monthKey = this.getMonthKey();

    // اليومية
    await this.redisService.incr(`spending:daily:${userId}:${today}`);
    await this.redisService.expire(`spending:daily:${userId}:${today}`, 86400 * 2);

    // الأسبوعية
    await this.redisService.incr(`spending:weekly:${userId}:${weekKey}`);
    await this.redisService.expire(`spending:weekly:${userId}:${weekKey}`, 86400 * 14);

    // الشهرية
    await this.redisService.incr(`spending:monthly:${userId}:${monthKey}`);
    await this.redisService.expire(`spending:monthly:${userId}:${monthKey}`, 86400 * 60);
  }

  /**
   *_self-exclusion (استبعاد ذاتي)
   */
  async selfExclude(userId: string, days: number): Promise<void> {
    const compliance = await this.getActiveCompliance();
    
    if (compliance?.selfExclusion) {
      const { minPeriodDays, maxPeriodDays } = compliance.selfExclusion;
      
      if (days < minPeriodDays || days > maxPeriodDays) {
        throw new BadRequestException(
          `فترة الاستبعاد يجب أن تكون بين ${minPeriodDays} و ${maxPeriodDays} يوم`
        );
      }
    }

    // تفعيل الاستبعاد
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await this.userModel.findByIdAndUpdate(userId, {
      selfExcluded: true,
      selfExclusionExpiresAt: expiresAt,
    });

    // تسجيل في Redis للتحقق السريع
    await this.redisService.set(
      `self_exclude:${userId}`,
      expiresAt.toISOString(),
      days * 86400,
    );
  }

  /**
   * إلغاء الاستبعاد الذاتي
   */
  async cancelSelfExclusion(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      selfExcluded: false,
      selfExclusionExpiresAt: null,
    });

    await this.redisService.del(`self_exclude:${userId}`);
  }

  /**
   * التحقق من حالة الاستبعاد
   */
  async checkSelfExclusion(userId: string): Promise<boolean> {
    const excluded = await this.redisService.get(`self_exclude:${userId}`);
    
    if (excluded) {
      const expiresAt = new Date(excluded);
      if (expiresAt > new Date()) {
        return true; // لا يزال مستبعداً
      } else {
        // انتهاء فترة الاستبعاد
        await this.cancelSelfExclusion(userId);
      }
    }

    return false;
  }

  /**
   * الحصول على إعدادات الامتثال النشطة
   */
  async getActiveCompliance(): Promise<LegalCompliance | null> {
    return this.legalModel.findOne({ status: 'active' });
  }

  /**
   * حساب RTP (Return to Player)
   */
  async calculateRTP(boxId: string): Promise<number> {
    // حساب نسبة العائد الفعلية
    // هذا يتطلب بيانات إحصائية من قاعدة البيانات
    return 85; // مثال - يجب حسابه فعلياً
  }

  // Helper methods
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private async getDailySpending(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const value = await this.redisService.get(`spending:daily:${userId}:${today}`);
    return parseInt(value || '0');
  }

  private async getWeeklySpending(userId: string): Promise<number> {
    const weekKey = this.getWeekKey();
    const value = await this.redisService.get(`spending:weekly:${userId}:${weekKey}`);
    return parseInt(value || '0');
  }

  private async getMonthlySpending(userId: string): Promise<number> {
    const monthKey = this.getMonthKey();
    const value = await this.redisService.get(`spending:monthly:${userId}:${monthKey}`);
    return parseInt(value || '0');
  }

  private getWeekKey(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil(days / 7);
    return `${now.getFullYear()}-W${week}`;
  }

  private getMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
}
