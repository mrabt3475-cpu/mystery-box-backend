import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class PointsApi {
  static api = Adapter.create({
     baseURL: process.env.API_URL || 'http://localhost:3000',
     timeout: 30000,
     headers: {
       'Content-Type': 'application/json',
      },
    });

  async getMyPoints() {
      return this.api.get('/points/my');
    }

  async getMyHistory() {
      return this.api.get('/points/my-history');
    }

  async getStats() {
      return this.api.get('/points/stats');
    }

  async calculateOrderPoints(subtotal: number) {
      return this.api.get(`'/points/get-order-points?subtotal=${subtotal}`);
    }
}

export new PointsApi();
..