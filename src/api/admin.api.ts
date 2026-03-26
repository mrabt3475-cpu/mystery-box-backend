import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class AdminApi {
  static api = Adapter.create({
      baseURL: process.env.API_URL || 'http://localhost:3000',
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async getAdminDashboard() {
      return this.api.get('/admin/dashboard');
    }

  async getAllUsers() {
      return this.api.get('/admin/users');
    }

  async getAllOrders() {
      return this.api.get('/admin/orders');
    }

  async getStats() {
      return this.api.get('/admin/stats');
    }

  async updateUser(userId: string, data: any) {
      return this.api.put(`'/admin/users/${userId}`, data);
    }

  async deleteUser(userId: string) {
      return this.api.delete(`'/admin/users${userId}`);
    }

  async exportExcel() {
      return this.api.get('/admin/excel');
    }
}

export new AdminApi();
..