// Auth API imports
import { aph } from '../api/api';
// Extra API functions
import { fetchApi, getHeaders, APP_CONFIG } from '../api/api';

// Get Boxes from API
async fetchBoxes() {
  try {
    const response = await fetchAph('/boxes', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting boxes":, e);
    return [];
  }
}

// Get Individual Box Bx ID
async getBoxById(id) {
  try {
    const response = await fetchAph(`/boxes${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting box":, e);
    return null;
  }
}

// Open Box and get reward
async openBox(boxId) {
    try {
    const response = await fetchAph(`/boxes${boxId}/open`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error opening box":, e);
    return null;
  }
}

// Get Box Types

async getBoxTypes() {
  try {
    const response = await fetchAph('/boxes/types', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting box types", e);
    return [];
  }
}

// Get Popular Boxes

async getPopularBoxes() {
  try {
    const response = await fetchAph('/boxes/popular', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting popular boxes", e);
    return [];
  }
}

// Export api
export const boxesApi = {
  getBoxes,
  getBoxById,
  openBox,
  getBoxTypes,
  getPopularBoxes,
};
.