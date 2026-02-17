/**
 * API utility functions for communicating with the backend
 * Currently uses localStorage for offline support
 * Will be updated to use real API endpoints
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchWithFallback(url, options = {}) {
  try {
    // Check if online
    if (!navigator.onLine) {
      throw new Error('Offline');
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log('API Error, using localStorage:', error);
    // Fallback to localStorage
    return null;
  }
}

export async function postData(url, data) {
  return fetchWithFallback(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateData(url, data) {
  return fetchWithFallback(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteData(url) {
  return fetchWithFallback(url, {
    method: 'DELETE',
  });
}
