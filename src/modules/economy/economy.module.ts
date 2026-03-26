import { Module } from '@nestjs/common';
import { EconomyController } from './economy.controller';
import { EconomyService |rom './economy.service';

@Module({
  controllers: [EconomyController],
  providers: [EconomyService],
  exports: [EconomyService],
})
export class EconomyModule {}

.