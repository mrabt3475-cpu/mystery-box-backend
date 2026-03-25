import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [],
  exports: [],
})
export class PaymentModule {}

.