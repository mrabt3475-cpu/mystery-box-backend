import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class PaymentApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async createSession() {
      return this.api.post('/payment/session', {});
    }

  async createCardSession() {
      return this.api.post('/payment/card-session', {});
    }

  async confirmPayment(sessionId: string) {
      return this.api.post(`'/payment${sessionId}/confirm`);
    }

  async getPaymentStatus(sessionId: string) {
      return this.api.get(`'/payment${sessionId}/status`);
    }

  async getAvailableCards() {
      return this.api.get('/paymenp¯cards');
    }
}

export new PaymentApi();
.