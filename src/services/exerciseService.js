// src/services/exerciseService.js
// Exercise API calls - FIXED VERSION
import api from './api';

const exerciseService = {
  // Get all exercises for a specific module
  getModuleExercises: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}/exercises`);
    return response.data;
  },

  // Get exercise by ID (with /modules/ prefix)
  getExerciseById: async (exerciseId) => {
    const response = await api.get(`/modules/exercises/${exerciseId}`);
    return response.data;
  },

  // Get exercise from module (safer - avoids lazy loading issues)
  getExerciseFromModule: async (moduleId, exerciseId) => {
    const response = await api.get(`/modules/${moduleId}/exercises`);
    const exercise = response.data.find(ex => ex.id === parseInt(exerciseId));
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  },

  // Submit exercise solution (scenario) - SAVES to database
  submitSolution: async (exerciseId, userId, scenarioContent) => {
    const response = await api.post('/scenarios/submit', {
      userId,
      exerciseId,
      content: scenarioContent, // Backend expects 'content', not 'scenarioContent'
    });
    return response.data;
  },

  // Analyze scenario without submitting (preview) - DOESN'T save
  analyzeScenario: async (scenarioContent) => {
    const response = await api.post('/scenarios/analyze', {
      content: scenarioContent,
    });
    return response.data;
  },

  // Get user's scenarios for an exercise
  getUserExerciseScenarios: async (userId, exerciseId) => {
    const response = await api.get(`/scenarios/user/${userId}/exercise/${exerciseId}`);
    return response.data;
  },

  // Get all user's scenarios
  getUserScenarios: async (userId) => {
    const response = await api.get(`/scenarios/user/${userId}`);
    return response.data;
  },

  // Get user's scenario statistics
  getUserScenarioStatistics: async (userId) => {
    const response = await api.get(`/scenarios/user/${userId}/statistics`);
    return response.data;
  },

  // Reanalyze an existing scenario
  reanalyzeScenario: async (scenarioId) => {
    const response = await api.post(`/scenarios/${scenarioId}/reanalyze`);
    return response.data;
  },

  // Delete a scenario
  deleteScenario: async (scenarioId) => {
    const response = await api.delete(`/scenarios/${scenarioId}`);
    return response.data;
  },

  // Get scenario by ID
  getScenarioById: async (scenarioId) => {
    const response = await api.get(`/scenarios/${scenarioId}`);
    return response.data;
  },
};

export default exerciseService;