import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { EconomyModule } from './modules/economy/economy.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AntiAbuseModule } from './modules/anti-abuse/anti-abuse.module';

@Module({
  imports: [
    // Database
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/puzzlechain'),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // Modules
    AuthModule,
    UsersModule,
    ProductsModule,
    BoxesModule,
    RewardsModule,
    EconomyModule,
    OrdersModule,
    AntiAbuseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
