import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { BoxesModule } from '../boxes/boxes.module';
import { RewardsModule } from '../rewards/rewards.module';
import { WalletModule } from '../wallet/wallet.module';
import { LegalModule } from './legal.module';

@Module({
  imports: [
    UsersModule,
    BoxesModule,
    RewardsModule,
    WalletModule,
    LegalModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
