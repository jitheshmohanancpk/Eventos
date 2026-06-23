// src/utils/api.js
import axios from 'axios';

// This pulls the VITE_API_URL from Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchFilteredEvents = async (filters = {}) => {
  // Your code already adds /api here, so the variable in Vercel 
  // should just be the base URL
  const response = await axios.get(`${API_BASE_URL}/api/events`, { params: filters });
  return response.data;
};