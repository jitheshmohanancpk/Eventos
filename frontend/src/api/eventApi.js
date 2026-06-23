import axios from 'axios';

// PRODUCTION FIX: 
// If VITE_API_URL is set in Vercel, use it. 
// Otherwise, default to localhost for local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetches events with dynamic filters applied
 * @param {Object} filters - Contain keys like search, category, city, page, sort
 */
export const fetchFilteredEvents = async (filters = {}) => {
  try {
    // Axios maps JavaScript objects directly into clean query parameters
    const response = await axios.get(`${API_BASE_URL}/events`, { params: filters });
    return response.data; // Returns { success, count, pagination, data: [...] }
  } catch (error) {
    console.error("Error connecting frontend to backend:", error.response?.data || error.message);
    throw error;
  }
};