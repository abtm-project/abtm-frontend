// src/services/api.js
// Axios instance configuration
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.data || 'An error occurred';
      console.error('API Error:', message);
      if (toast && toast.error) {
        toast.error(message);
      }
    } else if (error.request) {
      // Request made but no response
      const message = 'Cannot connect to server. Please check if backend is running.';
      console.error('Network Error:', message);
      if (toast && toast.error) {
        toast.error(message);
      }
    } else {
      // Something else happened
      const message = 'An unexpected error occurred';
      console.error('Error:', error.message);
      if (toast && toast.error) {
        toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;