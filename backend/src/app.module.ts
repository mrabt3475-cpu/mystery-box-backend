import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { OrdersModule } from './modules/orders/orders.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PointsModule } from './modules/points/points.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ReferralModule } from './modules/referral/referral.module';
import { EventsModule } from './modules/developer/events.module';
import { AnalyticsModule } from './modules/developer/analytics.module';

// Shared
import { DatabaseModule } from './modules/shared/database.module';
import { LoggingModule } from './modules/shared/logging.module';
import { ValidationModule } from './modules/shared/validation.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Shared
    LoggingModule,
    ValidationModule,

    // Core Modules
    AuthModule,
    UsersModule,
    BoxesModule,
    RewardsModule,
    OrdersModule,
    WalletModule,
    PointsModule,
    NotificationsModule,
    AdminModule,

    // Developer & API
    DeveloperModule,
    SubscriptionModule,
    ReferralModule,
    EventsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
