// src/services/authService.js
// Authentication service (simplified without JWT)

import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login user
  login: async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    if (response.data) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Get user statistics
  getUserStatistics: async (userId) => {
    const response = await api.get(`/users/${userId}/statistics`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    const response = await api.put(`/users/${userId}/profile`, profileData);
    if (response.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  },
};

export default authService;
