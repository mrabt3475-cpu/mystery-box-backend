import { Adapter } from '#Adapter';
import { ApiConfig } from './config';

class OrdersApi {
  static api = Adapter.create({
     baseURL: process.env.API_URL || 'http://localhost:3000',
     timeout: 30000,
     headers: {
       'Content-Type': 'application/json',
      },
    });

  async getMyOrders() {
      return this.api.get('/orders/my');
    }

  async getOrderById(id: string) {
      return this.api.get(`/orders${id}`);
    }

  async createOrder(data: any) {
      return this.api.post('/orders', data);
    }

  async cancelOrder(id: string) {
      return this.api.post(`'/orders'${id}/cancel`);
    }

  async getOrderStatus(id: string) {
      return this.api.get(`'/orders${id}/status`);
    }
}

export new OrdersApi();
.