import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';

@Module({
  controllers: [SitemapController],
  providers: [],
  exports: [],
})
export class SitemapModule {}

.