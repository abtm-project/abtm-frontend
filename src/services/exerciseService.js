// src/services/exerciseService.js
// Exercise API calls

import api from './api';

const exerciseService = {
  // Get all exercises
  getAllExercises: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },

  // Get exercise by ID
  getExerciseById: async (exerciseId) => {
    const response = await api.get(`/exercises/${exerciseId}`);
    return response.data;
  },

  // Submit exercise solution (scenario)
  submitSolution: async (exerciseId, userId, scenarioContent) => {
    const response = await api.post('/scenarios', {
      userId,
      exerciseId,
      scenarioContent,
    });
    return response.data;
  },

  // Get user's exercise performance
  getUserExercisePerformance: async (userId, exerciseId) => {
    const response = await api.get(`/users/${userId}/exercises/${exerciseId}/performance`);
    return response.data;
  },
};

export default exerciseService;
