import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey, ApiKeyDocument } from './api-key.schema';
import { DeveloperService } from './developer.service';
import * as crypto from 'crypto';

// Available permissions
export const API_PERMISSIONS = {
  // Read permissions
  'read:products': 'قراءة المنتجات',
  'read:boxes': 'قراءة الصناديق',
  'read:orders': 'قراءة الطلبات',
  'read:user': 'قراءة بيانات المستخدم',
  'read:stats': 'قراءة الإحصائيات',
  
  // Write permissions
  'write:open-box': 'فتح صندوق (يتطلب نقاط)',
  'write:create-order': 'إنشاء طلب',
  'write:claim-reward': 'استلام مكافأة',
  
  // Admin permissions
  'admin:full': 'إدارة كاملة',
  'admin:keys': 'إدارة المفاتيح',
  'admin:webhooks': 'إدارة Webhooks',
};

// Rate limits per plan
const PLAN_RATE_LIMITS = {
  free: { requests: 100, window: 'hour' },
  basic: { requests: 1000, window: 'hour' },
  pro: { requests: 10000, window: 'hour' },
  enterprise: { requests: 100000, window: 'hour' },
};

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>,
    private readonly developerService: DeveloperService,
  ) {}

  private generateKeyId(): string {
    return `key_${crypto.randomBytes(8).toString('hex')}`;
  }

  private generateKeySecret(): string {
    return `sk_${crypto.randomBytes(32).toString('hex')}`;
  }

  private hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  async create(developerId: string, data: {
    name: string;
    permissions?: string[];
    rateLimit?: number;
    expiresAt?: Date;
    isTestKey?: boolean;
  }): Promise<{ keyId: string; keySecret: string; keyPrefix: string }> {
    const keyId = this.generateKeyId();
    const keySecret = this.generateKeySecret();
    const keyPrefix = keySecret.substring(0, 12);
    const keyHash = this.hashKey(keySecret);

    const apiKey = new this.apiKeyModel({
      developerId,
      name: data.name,
      keyId,
      keyHash,
      keyPrefix,
      keySecret: keySecret, // Stored for one-time display
      permissions: data.permissions || ['read:products', 'read:boxes'],
      isActive: true,
      rateLimit: data.rateLimit || 1000,
      expiresAt: data.expiresAt,
      isTestKey: data.isTestKey || false,
    });

    await apiKey.save();
    await this.developerService.addApiKey(developerId, apiKey._id.toString());

    return {
      keyId,
      keySecret, // Only returned once!
      keyPrefix,
    };
  }

  async validate(keyId: string, keySecret: string): Promise<ApiKey | null> {
    const apiKey = await this.apiKeyModel.findOne({ keyId, isActive: true });
    if (!apiKey) {
      return null;
    }

    // Check expiration
    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return null;
    }

    // Validate secret
    const keyHash = this.hashKey(keySecret);
    if (keyHash !== apiKey.keyHash) {
      return null;
    }

    // Update last used
    await this.apiKeyModel.findByIdAndUpdate(apiKey._id, {
      lastUsedAt: new Date(),
      $inc: { requestsCount: 1 },
    });

    return apiKey;
  }

  async findById(id: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyModel.findById(id);
    if (!apiKey) {
      throw new NotFoundException('المفتاح غير موجود');
    }
    return apiKey;
  }

  async findByKeyId(keyId: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyModel.findOne({ keyId });
    if (!apiKey) {
      throw new NotFoundException('المفتاح غير موجود');
    }
    return apiKey;
  }

  async getDeveloperKeys(developerId: string): Promise<ApiKey[]> {
    return this.apiKeyModel
      .find({ developerId })
      .select('-keySecret -keyHash')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateKey(id: string, data: {
    name?: string;
    permissions?: string[];
    rateLimit?: number;
  }): Promise<ApiKey> {
    const apiKey = await this.apiKeyModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-keySecret -keyHash')
      .exec();

    if (!apiKey) {
      throw new NotFoundException('المفتاح غير موجود');
    }

    return apiKey;
  }

  async revokeKey(id: string, developerId: string): Promise<void> {
    const apiKey = await this.apiKeyModel.findOne({ _id: id, developerId });
    if (!apiKey) {
      throw new NotFoundException('المفتاح غير موجود');
    }

    await this.apiKeyModel.findByIdAndUpdate(id, {
      isActive: false,
      revokedAt: new Date(),
    });

    await this.developerService.removeApiKey(developerId, id);
  }

  async checkRateLimit(apiKey: ApiKey): Promise<boolean> {
    const windowStart = new Date(Date.now() - 60 * 60 * 1000); // 1 hour
    
    const usageCount = await this.apiKeyModel.countDocuments({
      _id: apiKey._id,
      lastUsedAt: { $gte: windowStart },
    });

    return usageCount < apiKey.rateLimit;
  }

  hasPermission(apiKey: ApiKey, permission: string): boolean {
    if (apiKey.permissions.includes('admin:full')) {
      return true;
    }
    return apiKey.permissions.includes(permission);
  }
}
