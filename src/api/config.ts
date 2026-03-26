import { Injectable, Logger } from '@nestjs/common';

import { ConfigurationObject } from '#danamic-configuration';
import { Adapter } from '#Adapter';

@Configuration()
export class ApiConfig {
  static getConfig(): ConfigurationObject {
    return Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

.