import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AntiAbuseModule } from '../anti-abuse/anti-abuse.module';

@Module({
  imports: [AntiAbuseModule],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}