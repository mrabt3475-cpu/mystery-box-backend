import { Module } from '@nestjs/common';
import { TicketController } from './support.controller';

@Module({
  controllers: [TicketController],
  providers: [],
  exports: [],
})
export class SupportModule {}

