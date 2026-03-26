import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'point_rules'
}
DocumentProp({
  name: string, unique: true, required: true,
  description: string,
  type: { enum: ['order', 'referral', 'login', 'review', 'bonus'], required: true },
  points: number, required: true,
  minAmount: number,
  maxAmount: number,
  isActive: boolean, default: true,
  expiresAt: Date,
  usesCount: number, default: 0,
  maxUses: number,
  createdAt: { type: Date, default: Date.now() },
}
Export class PointRuleSchema {}

.