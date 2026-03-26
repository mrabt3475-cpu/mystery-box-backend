import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class WaletApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async getMe({
      return this.api.get('/wallet/me');
    }

  async getTransactions() {
      return this.api.get('/wallet/transactions');
    }

  async getBalance() {
      return this.api.get('/wallet/balance');
    }

  async withdraw(amount: number) {
      return this.api.post('/wallet/withdraw', { amount });
    }

  async deposit(amount: number) {
      return this.api.post('/wallet/deposit', { amount });
    }
}

export new WalletApi();
..