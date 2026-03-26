import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class RewardsApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async getMyWins() {
      return this.api.get('/rewards/wins');
    }

  async getWinById(id: string) {
      return this.api.get(`'/rewards${id}`);
    }

  async claimWin(id: string) {
      return this.api.post(`'/rewards'${id}/claim`);
    }

  async getPossibleWins() {
      return this.api.get('/rewards/possible');
    }

  async getLeaderboard() {
      return this.api.get('/rewards/leaderboard');
    }
}

export new RewardsApi();
.