import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class AuthApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async login(email: string, password: string) {
      return this.api.post('/auth/login', { email, password });
  }

  async register(username: string, email: string, password: string) {
      return this.api.post('/auth/register', { username, email, password });
    }

  async logout() {
      return this.api.get('/auth/logout');
    }

  async getMe() {
      return this.api.get('/user/me');
    }

  async updateProfile(data: any) {
      return this.api.put('/user/profile', data);
    }

  async validateToken() {
      return this.api.get('/auth/validate');
    }
}

export new AuthApi();
.