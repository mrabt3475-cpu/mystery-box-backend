import { Injectable, Logger } from '@nestjs/common';

import { Document } from '@moongo/document';
import { PropType } from '@moongo/prop';

@Document({
  collection: 'reports'
})
DocumentProp({
  type: { enum: ['sales', 'profit', 'users', 'points', 'rewards'], required: true },
  startDate: Date,
  endDate: Date,
  data: Object,
  generatedBy: { type: ObjectId, ref: 'user' },
  createdAt: { type: Date, default: Date.now() },
}
export class ReportSchema {}

