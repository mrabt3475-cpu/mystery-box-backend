import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PrizeType {
  POINTS = 'points',
  VOUCHER = 'voucher',
  PRODUCT = 'product',
  CRYPTO = 'crypto',
  NFT = 'nft',
  BADGE = 'badge',
  DISCOUNT = 'discount',
}

export enum PrizeRarity {
  COMMON = 'common',      // شائع
  UNCOMMON = 'uncommon',  // غير شائع
  RARE = 'rare',          // نادر
  EPIC = 'epic',          // ملحمي
  LEGENDARY = 'legendary',// أسطوري
}

export enum PrizeStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Prize extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: PrizeType, required: true })
  type: PrizeType;

  @Prop({ type: String, enum: PrizeRarity, default: PrizeRarity.COMMON })
  rarity: PrizeRarity;

  @Prop({ type: String, enum: PrizeStatus, default: PrizeStatus.ACTIVE })
  status: PrizeStatus;

  @Prop({ default: 1 })
  weight: number; // وزن الاحتمالية

  @Prop({ default: 0 })
  value: number; // القيمة النقدية

  @Prop()
  imageUrl: string;

  @Prop()
  iconUrl: string;

  @Prop({ type: Object })
  reward: {
    // Points
    points?: number;
    // Voucher
    code?: string;
    discountPercent?: number;
    minPurchase?: number;
    // Product
    productId?: Types.ObjectId;
    productName?: string;
    sku?: string;
    // Crypto
    cryptoSymbol?: string;
    cryptoAmount?: number;
    // NFT
    nftContract?: string;
    nftTokenId?: string;
    nftMetadata?: string;
  };

  @Prop({ type: Object })
  limits: {
    totalQuantity: number;     // الكمية الإجمالية
    perUser: number;           // لكل مستخدم
    dailyQuantity: number;     // الكمية اليومية
    minLevel: number;          // أقل مستوى
  };

  @Prop({ type: Object })
  statistics: {
    totalWon: number;          // مرات الفوز
    totalValue: number;        // القيمة الإجمالية
    lastWonAt: Date;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop()
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: ['ar', 'en'] })
  availableLocales: string[];

  @Prop({ type: Object })
  translations: Record<string, {
    name: string;
    description: string;
  }>;
}

export const PrizeSchema = SchemaFactory.createForClass(Prize);

// Indexes
PrizeSchema.index({ status: 1, isActive: 1 });
PrizeSchema.index({ rarity: 1 });
PrizeSchema.index({ weight: -1 });
