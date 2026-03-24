import { Module } from '@nestjs/common';
import { AntiAbuseService } from './anti-abuse.service';

@Module({
  providers: [AntiAbuseService],
  exports: [AntiAbuseService],
})
export class AntiAbuseModule {}