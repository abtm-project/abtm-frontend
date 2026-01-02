// src/services/scenarioService.js
// Scenario analysis API calls

import api from './api';

const scenarioService = {
  // Quick scenario analysis (no user/exercise context)
  quickAnalyze: async (scenarioContent) => {
    const response = await api.get('/scenarios/analyze', {
      params: { content: scenarioContent }
    });
    return response.data;
  },

  // Create and analyze scenario (with user and exercise context)
  createAndAnalyze: async (userId, exerciseId, scenarioContent) => {
    const response = await api.post('/scenarios', {
      userId,
      exerciseId,
      scenarioContent,
    });
    return response.data;
  },

  // Get scenario by ID
  getScenarioById: async (scenarioId) => {
    const response = await api.get(`/scenarios/${scenarioId}`);
    return response.data;
  },

  // Get user's scenarios
  getUserScenarios: async (userId) => {
    const response = await api.get(`/scenarios/user/${userId}`);
    return response.data;
  },

  // Get scenarios for exercise
  getExerciseScenarios: async (exerciseId) => {
    const response = await api.get(`/scenarios/exercise/${exerciseId}`);
    return response.data;
  },

  // Re-analyze existing scenario
  reAnalyze: async (scenarioId) => {
    const response = await api.put(`/scenarios/${scenarioId}/analyze`);
    return response.data;
  },
};

export default scenarioService;
