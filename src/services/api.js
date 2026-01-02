// src/services/api.js
// Base API configuration and axios instance

import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      
      if (error.response.status === 401) {
        // Unauthorized - clear storage and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error('Access denied');
      } else if (error.response.status === 404) {
        toast.error('Resource not found');
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Cannot connect to server. Please check if backend is running.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
