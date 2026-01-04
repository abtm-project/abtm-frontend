// src/pages/Modules.jsx
// List all available learning modules

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moduleService from '../services/moduleService';
import { toast } from 'react-toastify';

const Modules = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, [user]);

  const loadModules = async () => {
    try {
      setLoading(true);
      
      // Load all modules
      const modulesData = await moduleService.getAllModules();
      setModules(modulesData);

      // Load user's completed modules
      try {
        const completed = await moduleService.getUserCompletedModules(user.id);
        setCompletedModules(completed.map(m => m.id));
      } catch (error) {
        setCompletedModules([]);
      }

      setLoading(false);
    } catch (error) {
      toast.error('Failed to load modules');
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      BEGINNER: 'bg-green-100 text-green-700',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
      ADVANCED: 'bg-orange-100 text-orange-700',
      EXPERT: 'bg-red-100 text-red-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Modules</h1>
        <p className="text-gray-600">
          Master Behavior-Driven Development through our comprehensive training modules
        </p>
      </div>

      {/* Progress Overview */}
      <div className="card bg-primary-50 border-l-4 border-primary-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Your Progress</p>
            <p className="text-2xl font-bold text-primary-700">
              {completedModules.length} of {modules.length} modules completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              {modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600">Complete</p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 bg-white rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary-600 h-full transition-all duration-500"
            style={{ width: `${modules.length > 0 ? (completedModules.length / modules.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const isCompleted = completedModules.includes(module.id);
          
          return (
            <div
              key={module.id}
              className={`card hover:shadow-xl transition-all duration-300 ${
                isCompleted ? 'border-2 border-green-400' : ''
              }`}
            >
              {/* Module Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {module.title}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(module.difficultyLevel)}`}>
                    {module.difficultyLevel}
                  </span>
                </div>
                {isCompleted && (
                  <div className="flex-shrink-0 ml-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Module Description */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {module.description}
              </p>

              {/* Module Meta Info */}
              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {module.estimatedHours} hours
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {module.orderIndex} of {modules.length}
                </div>
              </div>

              {/* Prerequisites (if any) */}
              {module.prerequisites && module.prerequisites.length > 0 && (
                <div className="mb-4 text-sm">
                  <p className="text-gray-600 font-medium mb-1">Prerequisites:</p>
                  <p className="text-gray-500">{module.prerequisites.join(', ')}</p>
                </div>
              )}

              {/* Action Button */}
              <Link
                to={`/modules/${module.id}`}
                className={`block text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                  isCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isCompleted ? 'Review Module' : 'Start Learning'} →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {modules.length === 0 && (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No modules available</h3>
          <p className="text-gray-500">
            Modules will appear here once they are added to the system.
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="card bg-blue-50">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Learning Tips</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Complete modules in order for the best learning experience</li>
              <li>• Practice writing scenarios for each exercise</li>
              <li>• Review feedback carefully to improve your BDD skills</li>
              <li>• Take your time - quality over speed!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;
