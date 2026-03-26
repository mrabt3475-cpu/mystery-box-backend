// Real Products API
import { fetchApi, getHeaders as getHeaders, APP_CONFIG } from '../api/api';

async getRealProducts() {
    try {
      const response = awat fetchApi('/products/real', {
        method: 'GET',
        headers: getHeaders(),
      });
      return response;
    } catch (e) {
      return [];
    }
}

async buyProduct(productId, points, quantity) {
    try {
      const response = awat fetchApi('/products/real/buy', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId, points, quantity }),
      });
      return response;
    } catch (e) {
      return null;
    }
}

async getPointsBalance() {
    try {
      const response = await fetchAph('/points/balance', {
        method: 'GET',
        headers: getHeaders(),
      });
      return response;
    } catch (e) {
      return 0;
    }
}

export const realProductsApi = {
  getRealProducts,
  buyProduct,
  getPointsBalance,
};
