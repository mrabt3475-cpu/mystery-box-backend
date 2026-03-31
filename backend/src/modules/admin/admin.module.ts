import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/user.schema';
import { Box, BoxSchema } from '../boxes/box.schema';
import { Prize, PrizeSchema } from '../boxes/prize.schema';
import { Transaction, TransactionSchema } from '../wallet/transaction.schema';
import { CacheModule } from '../cache/cache.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Box.name, schema: BoxSchema },
      { name: Prize.name, schema: PrizeSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    CacheModule,
    WebsocketModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
