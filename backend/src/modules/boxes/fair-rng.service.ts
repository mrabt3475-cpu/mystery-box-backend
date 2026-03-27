import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash, createHmac, randomBytes } from 'crypto';

export interface FairRandomResult {
  winnerIndex: number;
  seed: string;
  hash: string;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  proof: string;
}

/**
 * Provably Fair RNG Service
 * 
 * يستخدم نظام HMAC-SHA256 لضمان عدالة النتائج:
 * 1. الخادم يولد serverSeed عشوائي
 * 2. المستخدم يوفر clientSeed
 * 3. النتيجة = HMAC(serverSeed, clientSeed + nonce)
 * 4. يمكن للمستخدم التحقق من النتيجة لاحقاً
 */
@Injectable()
export class FairRngService {
  private readonly HASH_ALGORITHM = 'sha256';

  /**
   * إنشاء Server Seed جديد
   */
  generateServerSeed(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * إنشاء Client Seed
   */
  generateClientSeed(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * حساب النتيجة العادلة
   * 
   * @param serverSeed - seed من الخادم
   * @param clientSeed - seed من المستخدم
   * @param nonce - رقم متزايد لكل طلب
   * @param max - الحد الأقصى (عدد العناصر)
   */
  calculateFairResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    max: number,
  ): number {
    if (max <= 0) {
      throw new BadRequestException('Max must be greater than 0');
    }

    // إنشاء HMAC
    const hmac = createHmac(this.HASH_ALGORITHM, serverSeed);
    hmac.update(`${clientSeed}:${nonce}`);
    const hash = hmac.digest('hex');

    // تحويل الهاش إلى رقم
    const decimal = parseInt(hash.slice(0, 15), 16);
    
    // استخدام modulo للحصول على نتيجة في المدى المطلوب
    const result = decimal % max;

    return result;
  }

  /**
   * فتح صندوق بطريقة عادلة
   */
  openBox(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    prizes: Array<{ id: string; weight: number }>,
  ): { prize: any; result: FairRandomResult } {
    // حساب الأوزان الإجمالية
    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    
    if (totalWeight === 0) {
      throw new BadRequestException('No prizes with weight available');
    }

    // الحصول على رقم عشوائي
    const hmac = createHmac(this.HASH_ALGORITHM, serverSeed);
    hmac.update(`${clientSeed}:${nonce}`);
    const hash = hmac.digest('hex');
    const decimal = parseInt(hash.slice(0, 15), 16);

    // تحديد الفائز بناءً على الأوزان
    let random = decimal % totalWeight;
    let winnerIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      random -= prizes[i].weight;
      if (random < 0) {
        winnerIndex = i;
        break;
      }
    }

    return {
      prize: prizes[winnerIndex],
      result: {
        winnerIndex,
        seed: hash,
        hash: this.hashResult(hash),
        serverSeed: this.hashSeed(serverSeed),
        clientSeed,
        nonce,
        proof: hash,
      },
    };
  }

  /**
   * التحقق من نتيجة سابقة
   */
  verifyResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    max: number,
    expectedResult: number,
  ): boolean {
    const actualResult = this.calculateFairResult(serverSeed, clientSeed, nonce, max);
    return actualResult === expectedResult;
  }

  /**
   * تشفير الـ Seed للعرض (إخفاء القيمة الحقيقية)
   */
  hashSeed(seed: string): string {
    return createHash(this.HASH_ALGORITHM).update(seed).digest('hex');
  }

  /**
   * تشفير النتيجة
   */
  hashResult(result: string): string {
    return createHash(this.HASH_ALGORITHM).update(result).digest('hex');
  }

  /**
   * إنشاء رابط التحقق
   */
  generateVerificationLink(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
  ): string {
    const data = `${serverSeed}:${clientSeed}:${nonce}`;
    const signature = createHmac(this.HASH_ALGORITHM, process.env.VERIFICATION_SECRET || 'default-secret')
      .update(data)
      .digest('hex');
    
    return `/verify?data=${encodeURIComponent(data)}&sig=${signature}`;
  }
}
