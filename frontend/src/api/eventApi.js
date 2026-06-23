import axios from 'axios';

// Bypass VITE_API_URL and force the connection to your Render backend
const API_BASE_URL = 'https://eventos-backend-crl1.onrender.com/api';

export const fetchFilteredEvents = async (filters = {}) => {
  try {
    // This will now request: https://eventos-backend-crl1.onrender.com/api/events
    const response = await axios.get(`${API_BASE_URL}/events`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("DEBUG - Request failed:", error.config?.url);
    console.error("DEBUG - Error message:", error.message);
    throw error;
  }
};