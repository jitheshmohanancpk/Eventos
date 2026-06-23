import axios from 'axios';

// 1. Dedicated instance for Admin API (Events)
const adminAPI = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
});

// 2. Dedicated instance for Auth/User API
const authAPI = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// 3. Interceptors to attach token to both instances
const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

adminAPI.interceptors.request.use(attachToken);
authAPI.interceptors.request.use(attachToken);

// --- EXPORTED FUNCTIONS ---

// Event Management
export const fetchAllEvents = () => adminAPI.get('/events');
export const toggleEventStatus = (id) => adminAPI.put(`/events/${id}/status`);
export const deleteEvent = (id) => adminAPI.delete(`/events/${id}`);

// User Management
export const getAllUsers = () => authAPI.get('/users');
export const deleteUser = (id) => authAPI.delete(`/${id}`); // Correct path based on authRoutes
export const updateUser = (id, data) => authAPI.put(`/${id}`, data);