import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LoggingModule } from './logging.module';
import { ValidationModule } from './validation.module';

@Global()
@Module({
  imports: [
    LoggingModule,
    ValidationModule,
  ],
  providers: [RedisService],
  exports: [RedisService, LoggingModule, ValidationModule],
})
export class SharedModule {}
