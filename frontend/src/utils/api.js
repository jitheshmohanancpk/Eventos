// export const api = async (endpoint, options = {}) => {
//   // If your proxy is set up, this will always hit http://localhost:5000/api/...
//   const response = await fetch(`/api${endpoint}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers
//     }
//   });
//   return response;
// };

import axios from 'axios';

// Bypass VITE_API_URL completely for testing
const API_BASE_URL = 'https://eventos-backend-crl1.onrender.com/api';

export const fetchFilteredEvents = async (filters = {}) => {
  // Add a console log to force visibility
  console.log("Attempting request to:", `${API_BASE_URL}/events`);
  
  const response = await axios.get(`${API_BASE_URL}/events`, { params: filters });
  return response.data;
};