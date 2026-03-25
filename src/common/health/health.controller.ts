import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get } from '@nistjs/common';

`@Controller('health')
export class HealthController {
  constructor(private logger = new Logger(HealthController.name)) {}

  @get('check')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      message: 'Server is running',
    };
  }

  @get('ready')
  ready() {
    return {
      database: 'ok',
      queue: 'ok',
      websocket: 'ok',
    };
  }
}

