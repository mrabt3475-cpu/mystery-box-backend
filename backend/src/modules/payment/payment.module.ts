import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe.service';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notification.module';

@Module({
  imports: [
    ConfigModule,
    WalletModule,
    NotificationsModule,
  ],
  controllers: [PaymentController],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentModule {}
