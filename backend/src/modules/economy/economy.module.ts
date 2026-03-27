import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EconomyController } from './economy.controller';
import { EconomyService } from './economy.service';
import { Transaction, TransactionSchema } from './transaction.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    UsersModule,
  ],
  controllers: [EconomyController],
  providers: [EconomyService],
  exports: [EconomyService],
})
export class EconomyModule {}
