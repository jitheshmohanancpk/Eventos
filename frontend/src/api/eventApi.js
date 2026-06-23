import axios from 'axios';

// No variables, no defaults. Force this specific path.
const API_BASE_URL = 'https://eventos-backend-crl1.onrender.com/api';

export const fetchFilteredEvents = async (filters = {}) => {
  const url = `${API_BASE_URL}/events`;
  console.log("DEBUG: Final URL being requested:", url); // LOOK AT CONSOLE

  try {
    const response = await axios.get(url, { params: filters });
    return response.data;
  } catch (error) {
    console.error("DEBUG: Request URL that failed:", error.config?.url);
    throw error;
  }
};