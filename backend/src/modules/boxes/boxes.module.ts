import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';
import { FairRngService } from './fair-rng.service';
import { Box, BoxSchema } from './box.schema';
import { Prize, PrizeSchema } from '../rewards/prize.schema';
import { UsersModule } from '../users/users.module';
import { PointsModule } from '../points/points.module';
import { RewardsModule } from '../rewards/rewards.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Box.name, schema: BoxSchema },
      { name: Prize.name, schema: PrizeSchema },
    ]),
    UsersModule,
    PointsModule,
    RewardsModule,
    SharedModule,
  ],
  controllers: [BoxesController],
  providers: [
    BoxesService,
    FairRngService,
  ],
  exports: [BoxesService, FairRngService],
})
export class BoxesModule {}
