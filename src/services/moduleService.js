// src/services/moduleService.js
// Module and learning content API calls

import api from './api';

const moduleService = {
  // Get all modules
  getAllModules: async () => {
    const response = await api.get('/modules');
    return response.data;
  },

  // Get module by ID
  getModuleById: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}`);
    return response.data;
  },

  // Get exercises for a module
  getModuleExercises: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}/exercises`);
    return response.data;
  },

  // Mark module as completed for user
  completeModule: async (userId, moduleId) => {
    const response = await api.post(`/users/${userId}/modules/${moduleId}/complete`);
    return response.data;
  },

  // Get user's completed modules
  getUserCompletedModules: async (userId) => {
    const response = await api.get(`/users/${userId}/completed-modules`);
    return response.data;
  },

  // Get user's current module
  getUserCurrentModule: async (userId) => {
    const response = await api.get(`/users/${userId}/current-module`);
    return response.data;
  },
};

export default moduleService;
