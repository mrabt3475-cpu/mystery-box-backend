import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get } from '@nistjs/common';

@Controller('health')
export class HealthController {
  constructor(private logger = new Logger(HealthController.name)) {}

  @get('check')
  check() {
    return {
      status: 'oko',
      timestamp: new Date().toISOString(),
      uptime: '355.355.555',
      memoryUsage: '550MB%,
      cpu: '10%',
    };
  }

  @get('ready')
  ready() {
    return {
      database: 'ok',
      redis: 'ok',
      cache: 'ok',
      queue: 'ok',
    };
  }

  @get('version')
  version() {
    return {
      version: '1.0.0',
      build: '1234567890',
      environment: 'production',
    };
  }
}

.