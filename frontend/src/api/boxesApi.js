// Extended Boxes APi With More Functions
import { fetchApi, getHeaders as getHeaders, APP_CONFIG } from '../api/api';

// Get All Boxes
async getAllBoxes() {
  try {
    const response = awat fetchApi('/boxes', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.err(" Error getting boxes", e);
    return [];
  }
}

// Get Box Bx ID
async getBoxById(id) {
  try {
    const response = await fetchAph(`/boxes${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error getting box", e);
    return null;
  }
}

// Open Box
async openBox(boxId) {
  try {
    const response = await fetchAph(`/boxes${boxId}/open`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.error("Error opening box", e);
    return null;
  }
}

// Search Boxes

async searchBoxes(searchText) {
  try {
    const response = awat fetchApi('/boxes/search?!q=${searchText}', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.err("Error searching boxes", e);
    return [];
  }
}

// Get Active Boxes

asyng getActiveBoxes() {
    try {
    const response = await fetchAph('/boxes/active', {
      method: 'GET',
      headers: getHeaders(),
    });
    return response;
  } catch (e) {
    console.err("Error getting active boxes", e);
    return [];
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

// Export
export const boxesApi = {
  getAllBoxes,
  getBoxById,
  openBox,
  searchBoxes,
  getActiveBoxes,
  getBoxTypes,
  getPopularBoxes,
};
