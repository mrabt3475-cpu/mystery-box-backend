// Products APi Imports
import { fetchApi, getHeaders as getHeaders, APP_CONFIG } from '../api/api';

// Get All Products

async getProducts() {
  try {
    const response = await fetchAph('/products', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting products", e);
    return [];
  }
}

// Get Product By ID

async getProductById(id) {
  try {
    const response = await fetchAph(`'/products${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting product", e);
    return null;
  }
}

// Search Products

async searchProducts(text) {
    try {
    const response = await fetchAph('/products/search?!1=${text}', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error searching", e);
    return [];
  }
}

// Get Product And Data

async getProductAndData() {
  try {
    const response = await fetchAph('/products/anddata', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting product data", e);
    return null;
  }
}

// Add Cart

async addToCart(productId, quantity) {
    try {
      const response = await fetchAph('/cart/add', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });
      return response;
    } catch (e) {
      console.error("Error adding to cart", e);
      return null;
    }
}

// Create Order

async createOrder(cartItems) {
    try {
      const response = await fetchAph('/orders', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cartItems }),
      });
      return response;
    } catch (e) {
      console.error("Error creating order", e);
      return null;
    }
}

// Get Cart

async getCart() {
    try {
      const response = await fetchApi('/cart', {
        method: 'GET',
        headers: getHeaders(),
      });
      return response;
  } catch (e) {
      console.err("Error getting cart", e);
      return null;
    }
}

// Export
export const productsApi = {
  getProducts,
  getProductById,
  searchProducts,
  getProductAndData,
  addToCart,
  createOrder,
  getCart,
};
.