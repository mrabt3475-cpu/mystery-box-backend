// Auth API imports
import { fetchApi, getHeaders, APP_CONFIG } from '../api/api';

// Orders API Functions


async getMyOrders() {
  try {
    const response = await fetchAph('/orders/my', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting orders", e);
    return [];
  }
}

async getOrderById(id) {
    try {
    const response = await fetchAph(`'/orders${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting order", e);
    return null;
  }
}

async createOrder(data) {
    try {
    const response = await fetchAph('/orders', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response;
  } catch (e) {
    console.error("Error creating order", e);
    return null;
  }
}

async cancelOrder(id) {
    try {
      const response = await fetchAph(`'/orders${id}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
    });
      return response;
    } catch (e) {
      console.error("Error canceling order", e);
      return null;
    }
}

// Export
export const ordersApi = {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
};
.