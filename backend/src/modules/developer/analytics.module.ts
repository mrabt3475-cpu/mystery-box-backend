import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ApiUsage, ApiUsageSchema } from './api-usage.schema';
import { ApiKey, ApiKeySchema } from './api-key.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiUsage.name, schema: ApiUsageSchema },
      { name: ApiKey.name, schema: ApiKeySchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
