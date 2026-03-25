import { Module } from '@nestjs/common';
import { LogController } from './logs.controller';

@Module({
  controllers: [LogController],
  providers: [],
  exports: [],
})
export class LogsModule {}

