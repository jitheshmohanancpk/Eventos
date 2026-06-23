import axios from 'axios';

// HARDCODED: No environment variables, just the direct URL
const API_BASE_URL = 'https://eventos-backend-crl1.onrender.com/api';

/**
 * Fetches events with dynamic filters applied
 */
export const fetchFilteredEvents = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error connecting to Render backend:", error.message);
    throw error;
  }
};