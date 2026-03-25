import { Module } from '@nestjs/common';
import { PromoCodeController } from './promo.controller';

@Module({
  controllers: [PromoCodeController],
  providers: [],
  exports: [],
})
export class PromoModule {}

.