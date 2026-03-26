import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'point_exchange'
}
DocumentProp({
  pointSpend: number,
  moneyEarned: number, // money to get
  rate: number,  // exchange rate (ew. 1point = 1dollar)
  type: { enum: ['points_to_money', 'money_to_points'], required: true },
  isActive: boolean, default: true,
  createdAt: { type: Date, default: Date.now() },
}
export class PointExchangeSchema {}

.