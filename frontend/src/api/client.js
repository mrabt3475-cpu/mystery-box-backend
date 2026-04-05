/**
 * 🔌 API Client with Interceptors
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = {
  baseURL: API_BASE_URL,
  token: null,

  setToken(token) {
    this.token = token;
  },

  clearToken() {
    this.token = null;
  },

  async request(method, url, data = null, options = {}) {
    const config = {
      method,
      url: `${this.baseURL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(config.url, config);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        throw { status: response.status, message: result.message, data: result };
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(url, options) { return this.request('GET', url, null, options); },
  post(url, data, options) { return this.request('POST', url, data, options); },
  put(url, data, options) { return this.request('PUT', url, data, options); },
  delete(url, options) { return this.request('DELETE', url, null, options); },

  async upload(url, file, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.open('POST', `${this.baseURL}${url}`);
      if (this.token) xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject({ status: xhr.status, message: 'Upload failed' });
        }
      };

      xhr.onerror = () => reject({ status: xhr.status, message: 'Network error' });
      xhr.send(formData);
    });
  }
};

// Endpoints
export const endpoints = {
  auth: { login: '/auth/login', register: '/auth/register', logout: '/auth/logout' },
  user: { profile: '/user/profile', updateProfile: '/user/profile' },
  boxes: { list: '/boxes', detail: (id) => `/boxes/${id}`, open: (id) => `/boxes/${id}/open` },
  prizes: { list: '/prizes', history: '/prizes/history', claim: (id) => `/prizes/${id}/claim` },
  wallet: { balance: '/wallet/balance', deposit: '/wallet/deposit', withdraw: '/wallet/withdraw', history: '/wallet/history' },
  leaderboard: { weekly: '/leaderboard/weekly', monthly: '/leaderboard/monthly', allTime: '/leaderboard/all-time' }
};

export default api;