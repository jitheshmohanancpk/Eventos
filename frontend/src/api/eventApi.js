import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches events with dynamic filters applied
 * @param {Object} filters - Contain keys like search, category, city, page, sort
 */
export const fetchFilteredEvents = async (filters = {}) => {
  try {
    // Axios maps JavaScript objects directly into clean ?search=Tech&city=Doha query parameters!
    const response = await axios.get(`${API_BASE_URL}/events`, { params: filters });
    return response.data; // Returns { success, count, pagination, data: [...] }
  } catch (error) {
    console.error("Error connecting frontend to backend:", error.response?.data || error.message);
    throw error;
  }
};