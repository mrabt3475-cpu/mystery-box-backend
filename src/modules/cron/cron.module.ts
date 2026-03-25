import { Module, CronScheduler } from '@nestjs/common';
import { CronController } from './cron.controller';

@Module({
  controllers: [CronController],
  providers: [],
  exports: [],
})
export class CronModule {}

.