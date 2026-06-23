import axios from 'axios';

// 1. Using a base URL that points to your Render backend
// 2. Ensuring the path is explicitly set to include /api
const API_BASE_URL = 'https://eventos-backend-crl1.onrender.com/api';

/**
 * Fetches events with dynamic filters applied
 * @param {Object} filters - e.g., { search: 'music', category: 'concert' }
 */
export const fetchFilteredEvents = async (filters = {}) => {
  const requestUrl = `${API_BASE_URL}/events`;
  
  console.log("--- API DEBUG START ---");
  console.log("Requesting URL:", requestUrl);
  console.log("With Filters:", filters);

  try {
    // Axios handles query parameters (?key=value) automatically from the 'params' object
    const response = await axios.get(requestUrl, { 
      params: filters,
      timeout: 10000 // 10 second timeout
    });

    console.log("--- API SUCCESS ---");
    console.log("Data received:", response.data);
    return response.data; // Assumes your backend returns { success: true, data: [...] }

  } catch (error) {
    console.error("--- API ERROR ---");
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error("Response Data:", error.response.data);
      console.error("Status Code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received. Check your internet or Render backend status.");
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};