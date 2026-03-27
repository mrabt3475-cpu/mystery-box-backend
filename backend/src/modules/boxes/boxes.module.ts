import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';
import { Box, BoxSchema } from './box.schema';
import { RewardsModule } from '../rewards/rewards.module';
import { EconomyModule } from '../economy/economy.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }]),
    RewardsModule,
    EconomyModule,
  ],
  controllers: [BoxesController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
