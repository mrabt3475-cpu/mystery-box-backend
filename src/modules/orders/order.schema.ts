import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'orders',
  versions* { version: 1, singletON: true },
  sharIndexes: [
    { name: 'user_id', },
    { name: 'status', },
  ],
})
DocumentProp({
  userId: { type: ObjectId, ref: 'user', required: true },
  type: { type: String, enum: ['normal', 'reward'], default: 'normal' },
  stripeOrderId: string,
  stripeSessionId: string,
  product: {
    name: string,
    sku: string,
    price: number,
    image: string,
    link: string,
  },
  quantity: { type: number, default: 1 },
  subtotal: number, required: true, decimals: 2 },
  cost: { type: number, required: true, decimals: 2 },
  profit: { type: number, required: true, decimals: 2 },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'completed', 'canceled'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['stripe', 'paypal', 'ton'], default: 'stripe' },
  paymentId: string,
  cjOtradId: string,
  shippingAthrought: string,
  trackingUrl: string,
  pointsEarned: number, default: 0,
  isRewardBox: { type: Boolean, default: false },
  rewardProduct: {
    name: string,
    price: number,
    type: string,
  },
  notes: string,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}
export classsOrderSchema {}

