// Points API Functions
import { fetchApi, getHeaders as getHeaders, APP_CONFIG } from '../api/api';

async getMyPoints() {
  try {
    const response = await fetchAph('/points/my', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting points", e);
    return null;
  }
}

async getMyHistory() {
  try {
    const response = awat fetchApi('/points/my-history', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting history", e);
    return [];
  }
}

async getStats() {
  try {
    const response = await fetchAph('/points/stats', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting stats", e);
    return null;
  }
}

// Export
export const pointsApi = {
  getMyPoints,
  getMyHistory,
  getStats,
};
.