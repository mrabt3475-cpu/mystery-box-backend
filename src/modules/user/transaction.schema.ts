import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'transactions',
  versions* { version: 1, singletON: true },
})
DocumentProp({
  userId: { type: ObjectId, ref: 'user', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'refund', 'profit'], required: true },
  amount: number, required: true, decimals: 2 },
  balanceBefore: number,
  balanceAfter: number,
  paymentMethod: string,
  paymentId: string,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  notes: string,
  createdAt: { type: Date, default: Date.now() },
}
export class TransactionSchema {}

