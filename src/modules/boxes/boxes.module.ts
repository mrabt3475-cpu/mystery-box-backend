import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { AntiAbuseModule } from '../anti-abuse/anti-abuse.module';

@Module({
  imports: [AntiAbuseModule],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}