import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Box, BoxStatus, BoxType } from './box.schema';
import { Prize, PrizeDocument } from '../rewards/prize.schema';
import { FairRngService, FairRandomResult } from './fair-rng.service';
import { UserService } from '../users/user.service';
import { PointsService } from '../points/points.service';
import { RedisService } from '../shared/redis.service';
import { EventTriggerService } from '../developer/event-trigger.service';

interface OpenBoxResult {
  success: boolean;
  prize?: any;
  remainingPoints?: number;
  box?: Box;
  fairness: FairRandomResult;
  message?: string;
}

@Injectable()
export class BoxesService {
  constructor(
    @InjectModel(Box.name) private boxModel: Model<Box>,
    @InjectModel(Prize.name) private prizeModel: Model<PrizeDocument>,
    private readonly fairRngService: FairRngService,
    private readonly userService: UserService,
    private readonly pointsService: PointsService,
    private readonly redisService: RedisService,
    private readonly eventTriggerService: EventTriggerService,
  ) {}

  /**
   * فتح صندوق بطريقة عادلة
   */
  async openBox(
    userId: string,
    boxId: string,
    clientSeed?: string,
  ): Promise<OpenBoxResult> {
    // 1. التحقق من الصندوق
    const box = await this.boxModel.findById(boxId);
    if (!box) {
      throw new NotFoundException('الصندوق غير موجود');
    }

    if (box.status !== BoxStatus.ACTIVE) {
      throw new BadRequestException('الصندوق غير نشط');
    }

    // 2. التحقق من التوقيت
    if (box.startsAt && new Date() < box.startsAt) {
      throw new BadRequestException('الصندوق لم يبدأ بعد');
    }

    if (box.endsAt && new Date() > box.endsAt) {
      throw new BadRequestException('الصندوق انتهى');
    }

    // 3. التحقق من الرصيد
    const user = await this.userService.findById(userId);
    const finalCost = this.calculateCost(box);

    if (user.points < finalCost) {
      throw new BadRequestException('نقاط غير كافية');
    }

    // 4. التحقق من الحدود
    await this.checkLimits(userId, box);

    // 5. خصم النقاط
    await this.pointsService.deductPoints(userId, finalCost, `فتح صندوق: ${box.name}`);

    // 6. الحصول على الـ Seeds
    const serverSeed = box.fairness?.serverSeed || this.fairRngService.generateServerSeed();
    const finalClientSeed = clientSeed || this.fairRngService.generateClientSeed();
    const nonce = (box.fairness?.nonce || 0) + 1;

    // 7. جلب الجوائز
    const prizes = await this.prizeModel.find({
      _id: { $in: box.prizes },
      isActive: true,
    }).lean();

    if (prizes.length === 0) {
      throw new BadRequestException('لا توجد جوائز متاحة');
    }

    // 8. تحديد الفائز بطريقة عادلة
    const prizeData = prizes.map(p => ({ id: p._id.toString(), weight: p.weight || 1 }));
    const { prize, result } = this.fairRngService.openBox(
      serverSeed,
      finalClientSeed,
      nonce,
      prizeData,
    );

    // 9. إضافة الجائزة للمستخدم
    const wonPrize = prizes.find(p => p._id.toString() === prize.id);
    
    if (wonPrize) {
      await this.userService.addPrize(userId, wonPrize._id);
      
      // تحديث الإحصائيات
      await this.boxModel.findByIdAndUpdate(boxId, {
        $inc: {
          'statistics.totalOpens': 1,
          'statistics.totalWins': wonPrize.value ? 1 : 0,
          'statistics.totalValue': wonPrize.value || 0,
        },
      });

      // تشغيل Webhook
      await this.eventTriggerService.onBoxWon(userId, boxId, wonPrize);
    }

    // 10. تحديث nonce
    await this.boxModel.findByIdAndUpdate(boxId, {
      'fairness.serverSeed': serverSeed,
      'fairness.clientSeed': finalClientSeed,
      'fairness.nonce': nonce,
      'fairness.lastVerified': new Date(),
    });

    // 11. تسجيل في Redis (للحدود)
    await this.redisService.incr(`box:${boxId}:${userId}:${new Date().toISOString().split('T')[0]}`);
    await this.redisService.expire(`box:${boxId}:${userId}:${new Date().toISOString().split('T')[0]}`, 86400);

    // 12. تشغيل حدث فتح الصندوق
    await this.eventTriggerService.onBoxOpened(userId, boxId, finalCost);

    return {
      success: true,
      prize: wonPrize,
      remainingPoints: user.points - finalCost,
      box,
      fairness: result,
    };
  }

  /**
   * التحقق من عدالة نتيجة
   */
  async verifyFairness(
    boxId: string,
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    expectedIndex: number,
  ): Promise<{ valid: boolean; actualIndex: number }> {
    const box = await this.boxModel.findById(boxId);
    if (!box) {
      throw new NotFoundException('الصندوق غير موجود');
    }

    const prizes = await this.prizeModel.find({
      _id: { $in: box.prizes },
      isActive: true,
    }).lean();

    const prizeData = prizes.map(p => ({ id: p._id.toString(), weight: p.weight || 1 }));
    const totalWeight = prizeData.reduce((sum, p) => sum + p.weight, 0);

    const actualIndex = this.fairRngService.calculateFairResult(
      serverSeed,
      clientSeed,
      nonce,
      totalWeight,
    );

    return {
      valid: actualIndex === expectedIndex,
      actualIndex,
    };
  }

  /**
   * التحقق من الحدود
   */
  private async checkLimits(userId: string, box: Box): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const key = `box:${box._id}:${userId}:${today}`;
    
    const todayOpens = parseInt(await this.redisService.get(key) || '0');
    
    if (box.settings?.dailyLimit && todayOpens >= box.settings.dailyLimit) {
      throw new BadRequestException(`تم الوصول للحد اليومي: ${box.settings.dailyLimit} فتح`);
    }

    if (box.settings?.cooldownMinutes) {
      const cooldownKey = `cooldown:${box._id}:${userId}`;
      const lastOpen = await this.redisService.get(cooldownKey);
      
      if (lastOpen) {
        const lastOpenTime = parseInt(lastOpen);
        const cooldownEnd = lastOpenTime + box.settings.cooldownMinutes * 60 * 1000;
        
        if (Date.now() < cooldownEnd) {
          const remaining = Math.ceil((cooldownEnd - Date.now()) / 60000);
          throw new BadRequestException(`يرجى الانتظار ${remaining} دقيقة`);
        }
      }

      await this.redisService.set(cooldownKey, Date.now().toString(), box.settings.cooldownMinutes * 60);
    }
  }

  /**
   * حساب التكلفة النهائية
   */
  private calculateCost(box: Box): number {
    if (box.discount > 0) {
      return Math.round(box.cost * (1 - box.discount / 100));
    }
    return box.cost;
  }

  /**
   * إنشاء صندوق جديد
   */
  async createBox(data: Partial<Box>, userId: string): Promise<Box> {
    const box = new this.boxModel({
      ...data,
      createdBy: new Types.ObjectId(userId),
      fairness: {
        serverSeed: this.fairRngService.generateServerSeed(),
        clientSeed: this.fairRngService.generateClientSeed(),
        nonce: 0,
      },
      statistics: {
        totalOpens: 0,
        totalWins: 0,
        totalValue: 0,
        averagePayout: 0,
      },
    });

    return box.save();
  }

  /**
   * الحصول على الصناديق النشطة
   */
  async getActiveBoxes(locale = 'ar'): Promise<Box[]> {
    return this.boxModel.find({
      status: BoxStatus.ACTIVE,
      $or: [
        { startsAt: { $exists: false } },
        { startsAt: { $lte: new Date() } },
      ],
      $or: [
        { endsAt: { $exists: false } },
        { endsAt: { $gte: new Date() } },
      ],
    }).sort({ sortOrder: 1 });
  }
}
