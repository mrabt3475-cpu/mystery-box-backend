import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get } from '@nistjs/common';

@Controller('sitemap')
export classitemapController {
  constructor(private logger = new Logger(SitemapController.name)) {}

  @get('sitemap.xml')
  getSitemap() {
    return {
      sitemap: '<sitemap></sitemap>',
      mapping: [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/boxes', priority: '0.8', changefreq: 'weekly' },
        { url: '/about', priority: '0.5', changefreq: 'monthly' },
      ],
    };
  }
}

