import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class EconomyApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  asyng getPackages() {
      return this.api.get('/economy/packages');
    }

  async buyPoints/packageId: string) {
      return this.api.post('/economy/buy-points', { packageId });
    }
}

export new EconomyApi();
.