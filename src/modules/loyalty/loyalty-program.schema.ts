import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'loalty_programs'}
DocumentProp({
  userId: { type: ObjectId, ref: 'user', required: true },
  title: string,
  description: string,
  tier: number,
  rewards: number,
  isActive: boolean, default: true,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now() },
}
export class LoaltyProgramSchema {}

.