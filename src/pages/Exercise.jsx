// src/pages/Exercise.jsx
// Exercise page with scenario editor and real-time BDD analysis
// THIS IS THE CORE FEATURE - Real-time 6-dimensional scenario quality analysis

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import exerciseService from '../services/exerciseService';
import scenarioService from '../services/scenarioService';
import { toast } from 'react-toastify';

const Exercise = () => {
  const { exerciseId } = useParams();
  const { user } = useAuth();
  
  const [exercise, setExercise] = useState(null);
  const [scenario, setScenario] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [exerciseId]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      const exerciseData = await exerciseService.getExerciseById(exerciseId);
      setExercise(exerciseData);
      
      // Pre-fill with template if available
      if (exerciseData.scenarioTemplate) {
        setScenario(exerciseData.scenarioTemplate);
      }
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load exercise');
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!scenario.trim()) {
      toast.warning('Please write a scenario first');
      return;
    }

    try {
      setAnalyzing(true);
      const analysisResult = await scenarioService.quickAnalyze(scenario);
      setAnalysis(analysisResult);
      setAnalyzing(false);
    } catch (error) {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!scenario.trim()) {
      toast.warning('Please write a scenario first');
      return;
    }

    try {
      setSubmitting(true);
      const result = await exerciseService.submitSolution(exerciseId, user.id, scenario);
      setAnalysis(result.analysis);
      toast.success(`Scenario submitted! Score: ${result.analysis.overallScore.toFixed(1)}/10`);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    if (score >= 4) return 'bg-orange-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Exercise Not Found</h2>
        <Link to="/modules" className="btn-primary inline-block">
          Back to Modules
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to={`/modules/${exercise.moduleId}`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Module
      </Link>

      {/* Exercise Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{exercise.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{exercise.description}</p>
        
        {/* Requirements */}
        {exercise.requirements && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Requirements
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{exercise.requirements}</p>
          </div>
        )}
      </div>

      {/* Scenario Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Write Your Scenario</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !scenario.trim()}
                className="btn-secondary text-sm"
              >
                {analyzing ? 'Analyzing...' : 'Analyze'} 🔍
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !scenario.trim()}
                className="btn-primary text-sm"
              >
                {submitting ? 'Submitting...' : 'Submit'} ✅
              </button>
            </div>
          </div>

          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Feature: User Login

Scenario: Successful login with valid credentials
  Given the user is on the login page
  When the user enters valid username and password
  And the user clicks the login button
  Then the user should be redirected to the dashboard
  And a welcome message should be displayed"
            className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">💡 Tips:</p>
            <ul className="space-y-1">
              <li>• Use Given-When-Then format</li>
              <li>• Be specific and clear</li>
              <li>• One scenario should test one behavior</li>
              <li>• Avoid UI-specific details unless necessary</li>
            </ul>
          </div>
        </div>

        {/* Right: Analysis Results */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis Results</h2>

          {!analysis ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600">
                Write a scenario and click "Analyze" to see quality feedback
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.overallScore)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Overall Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore.toFixed(1)}/10
                  </span>
                </div>
                <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      analysis.overallScore >= 8 ? 'bg-green-600' :
                      analysis.overallScore >= 6 ? 'bg-yellow-600' :
                      analysis.overallScore >= 4 ? 'bg-orange-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(analysis.overallScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Dimension Scores */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Quality Dimensions:</h3>
                
                {[
                  { name: 'Clarity & Readability', value: analysis.clarityScore },
                  { name: 'Business Value Alignment', value: analysis.businessValueScore },
                  { name: 'Gherkin Correctness', value: analysis.gherkinCorrectnessScore },
                  { name: 'Testability', value: analysis.testabilityScore },
                  { name: 'Specificity', value: analysis.specificityScore },
                  { name: 'Duplication Avoidance', value: analysis.duplicationScore },
                ].map((dimension) => (
                  <div key={dimension.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{dimension.name}</span>
                      <span className={`font-semibold ${getScoreColor(dimension.value)}`}>
                        {dimension.value.toFixed(1)}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          dimension.value >= 8 ? 'bg-green-600' :
                          dimension.value >= 6 ? 'bg-yellow-600' :
                          dimension.value >= 4 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${(dimension.value / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              {analysis.feedback && analysis.feedback.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Suggestions for Improvement
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {analysis.feedback.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Automation Ready */}
              <div className={`p-4 rounded-lg ${
                analysis.automationReady ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
              }`}>
                <div className="flex items-center">
                  {analysis.automationReady ? (
                    <>
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-green-800">Ready for Automation ✅</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-red-800">Needs Improvement ⚠️</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="card bg-blue-50">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          BDD Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-2">✅ DO:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Write from user perspective</li>
              <li>• Use clear, simple language</li>
              <li>• Focus on behavior, not implementation</li>
              <li>• Make scenarios testable</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-2">❌ DON'T:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Mix multiple scenarios in one</li>
              <li>• Use vague or ambiguous terms</li>
              <li>• Include unnecessary UI details</li>
              <li>• Create duplicate scenarios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
