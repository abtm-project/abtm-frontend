import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moduleService from '../services/moduleService';
import { toast } from 'react-toastify';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [module, setModule] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModuleData();
  }, [moduleId]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      const moduleData = await moduleService.getModuleById(moduleId);
      setModule(moduleData);
      
      // Load exercises for this module
      const exerciseData = await moduleService.getModuleExercises(moduleId);
      setExercises(exerciseData);
      
      // Load quizzes for this module
      const quizData = await moduleService.getModuleQuizzes(moduleId);
      setQuizzes(quizData);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load module');
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Module not found</p>
        <Link to="/modules" className="btn-primary mt-4">Back to Modules</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/modules" className="text-primary-600 hover:text-primary-700 mb-2 inline-block">
          ← Back to Modules
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
        <p className="text-gray-600 mt-2">{module.description}</p>
        
        {module.estimatedHours && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated time: {module.estimatedHours} hours
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Exercises */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Exercises ({exercises.length})
            </h2>
            
            {exercises.length === 0 ? (
              <p className="text-gray-500">No exercises available yet.</p>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <Link
                    key={exercise.id}
                    to={`/exercises/${exercise.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {exercise.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {exercise.description}
                        </p>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                          {exercise.expectedMinutes && (
                            <span className="text-gray-500">
                              ⏱️ {exercise.expectedMinutes} min
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 ml-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ✅ NEW: Quizzes Section */}
          {quizzes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">
                  Knowledge Assessment ({quizzes.length})
                </h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Test your understanding of this module's concepts
              </p>

              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          📝 {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {quiz.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>❓ {quiz.totalQuestions} questions</span>
                          <span>✅ Pass: {quiz.passingScore}%</span>
                        </div>
                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Take Quiz
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Module Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-4">Module Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Exercises</p>
                  <p className="text-2xl font-bold text-gray-900">{exercises.length}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
                </div>
              </div>

              {module.estimatedHours && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Est. Time</p>
                    <p className="text-2xl font-bold text-gray-900">{module.estimatedHours}h</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Learning Path</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">1.</span>
                  <span>Complete all exercises</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">2.</span>
                  <span>Take the quiz to test knowledge</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">3.</span>
                  <span>Move to next module</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
