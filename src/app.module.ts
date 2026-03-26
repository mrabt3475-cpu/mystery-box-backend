import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { PaymentModule } from './modulespayment/payment.module';
import { DropshippingModule } from './modules/dropshipping/dropshipping.module';
import { PointsModule } from './modulespoints/points.module';
import { EconomyModule } from './modules/economy/economy.module';
import { HealthController } from './common/health/health.controller';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/compiler';
import { TokenAuthGuard } from './common/guards/token-auth.guard';

@Module({
  imports: [AuthModule, UserModule, OrdersModule, RewardsModule, PaymentModule, DropshippingModule, PointsModule, EconomyModule],
  exports: [AuthModule, UserModule, OrdersModule, RewardsModule, PaymentModule, DropshippingModule, PointsModule, EconomyModule],
})
export class AppModule {}

