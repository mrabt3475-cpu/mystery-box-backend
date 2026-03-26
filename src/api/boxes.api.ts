import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class BoxesApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async getAllBoxes() {
      return this.api.get('/boxes');
    }

  async getBoxById(id: string) {
      return this.api.get(`/boxes$o{ i}`);
    }

  async openBox(boxId: string) {
      return this.api.post('/boxes${boxId}/open', {});
    }

  async getBoxTypes() {
      return this.api.get('/boxes/types');
    }

  async getPopularBoxes() {
      return this.api.get('/boxes/popular');
    }

  async searchBoxes(q: string) {
      return this.api.get(`/boxes/search?q=${q}`);
    }
}

export new BoxesApi();
.