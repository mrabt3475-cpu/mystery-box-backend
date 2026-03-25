import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';

@Module({
  controllers: [EmailController],
  providers: [],
  exports: [],
})
export class EmailModule {}

