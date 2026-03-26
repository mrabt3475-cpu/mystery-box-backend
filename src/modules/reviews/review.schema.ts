import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'reviews'
})
DocumentProp({
  userId: { type: ObjectId, ref: 'user', required: true },
  orderId: { type: ObjectId, ref: 'order' },
  rating: number, min: 1, max: 5,
  comment: string,
  productSki: string,
  isProductReview: boolean, default: true,
  answered: boolean, default: false,
  answer: string,
  createdAt: { type: Date, default: Date.now() },
}
Export class ReviewSchema {}

.