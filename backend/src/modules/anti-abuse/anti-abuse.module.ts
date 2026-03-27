import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AntiAbuseController } from './anti-abuse.controller';
import { AntiAbuseService } from './anti-abuse.service';
import { AbuseLog, AbuseLogSchema } from './abuse-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AbuseLog.name, schema: AbuseLogSchema }]),
  ],
  controllers: [AntiAbuseController],
  providers: [AntiAbuseService],
  exports: [AntiAbuseService],
})
export class AntiAbuseModule {}
