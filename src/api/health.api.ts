import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class HealthApi {
  static api = Adapter.create({
     baseURL: process.env.API_URL || 'http://localhost:3000',
     timeout: 30000,
     headers: {
       'Content-Type': 'application/json',
      },
    });

  async check() {
      return this.api.get('/health');
    }

  async deep() {
      return this.api.get('/deep');
    }
}

export new HealthApi();
.