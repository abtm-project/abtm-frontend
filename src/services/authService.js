// src/services/authService.js
// Authentication API calls

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

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user && !!user.id;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get user statistics
  getUserStatistics: async (userId) => {
    const response = await api.get(`/users/${userId}/statistics`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    const response = await api.put(`/users/${userId}/profile`, profileData);
    return response.data;
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  },
};

export default authService;
