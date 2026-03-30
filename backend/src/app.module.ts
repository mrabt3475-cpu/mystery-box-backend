import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { PointsModule } from './modules/points/points.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { NotificationsModule } from './modules/notifications/notification.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ReferralModule } from './modules/referral/referral.module';
import { PaymentModule } from './modules/payment/payment.module';
import { QueueModule } from './modules/queue/queue.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { CacheModule } from './modules/cache/cache.module';
import { ThemeModule } from './modules/theme/theme.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/puzzlechain',
      }),
      inject: [ConfigService],
    }),
    CacheModule,
    AuthModule,
    UsersModule,
    BoxesModule,
    PointsModule,
    WalletModule,
    NotificationsModule,
    SubscriptionModule,
    ReferralModule,
    PaymentModule,
    QueueModule,
    WebsocketModule,
    ThemeModule,
  ],
})
export class AppModule {}
