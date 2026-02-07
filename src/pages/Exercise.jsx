// src/pages/Exercise.jsx
// FIXED: Timer useEffect infinite loop bug
// The key changes:
// 1. First useEffect sets startTime ONCE (empty dependency array)
// 2. Second useEffect updates timer when startTime changes (only happens once)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import exerciseService from '../services/exerciseService';
import { toast } from 'react-toastify';

const Exercise = () => {
  const { exerciseId } = useParams();
  const { user } = useAuth();
  
  const [exercise, setExercise] = useState(null);
  const [scenario, setScenario] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Load exercise data
  useEffect(() => {
    loadExercise();
  }, [exerciseId]);

  // FIXED: Set startTime ONCE on mount (empty dependency array)
  useEffect(() => {
    setStartTime(new Date());
  }, []); // Runs only once when component mounts

  // FIXED: Timer updates based on startTime (which is set once)
  useEffect(() => {
    if (!startTime) return;
    
    const updateTimer = () => {
      const now = new Date();
      const minutes = Math.floor((now - startTime) / 60000);
      setElapsedMinutes(minutes);
    };
    
    updateTimer(); // Update immediately
    const interval = setInterval(updateTimer, 60000); // Then every minute
    
    return () => clearInterval(interval);
  }, [startTime]); // Runs when startTime is set (once)

  const loadExercise = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getExerciseById(exerciseId);
      setExercise(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load exercise');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!scenario.trim()) {
      toast.warning('Please write a scenario first');
      return;
    }

    try {
      setSubmitting(true);
      const now = new Date();
      const timeSpentMinutes = startTime ? Math.floor((now - startTime) / 60000) : 0;
      
      const result = await exerciseService.submitSolution(
        exerciseId, 
        user.id, 
        scenario,
        timeSpentMinutes
      );
      
      setAnalysis(result.analysis);
      toast.success(`Submitted! Score: ${result.analysis.overallScore}/10 (Time: ${timeSpentMinutes} min)`);
      setSubmitting(false);
    } catch (error) {
      toast.error('Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!exercise) return <div className="text-center p-8">Exercise not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
      <p className="text-gray-600 mb-6">{exercise.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Write Your Scenario</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded">
                <span className="mr-1">⏱️</span>
                <span className="font-semibold">{elapsedMinutes}</span> min
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !scenario.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Feature: Login&#10;&#10;Scenario: Successful login&#10;  Given the user is on the login page&#10;  When the user enters valid credentials&#10;  Then the user should be logged in"
            className="w-full h-96 p-4 border rounded font-mono text-sm"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
          {!analysis ? (
            <p className="text-gray-500 text-center py-12">Submit a scenario to see results</p>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded">
                <div className="flex justify-between">
                  <span className="font-semibold">Overall Score</span>
                  <span className="text-2xl font-bold text-blue-600">{analysis.overallScore}/10</span>
                </div>
              </div>
              {analysis.feedback && (
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm">{analysis.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercise;
