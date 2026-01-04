import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moduleService from '../services/moduleService';

function ModuleDetail() {
  const [module, setModule] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { moduleId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moduleData, exercisesData] = await Promise.all([
          moduleService.getModuleById(moduleId),
          moduleService.getModuleExercises(moduleId, user?.role)
        ]);
        setModule(moduleData);
        setExercises(exercisesData);
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl">Loading module...</div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl font-semibold mb-4">Module not found</div>
          <Link to="/modules" className="text-blue-600 hover:underline">
            ← Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/modules" className="hover:text-blue-600">Modules</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-semibold">{module.title}</span>
      </div>

      {/* Module Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-6">
        <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
        <p className="text-xl mb-6 text-blue-100">{module.description}</p>
        
        <div className="flex gap-6 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{module.estimatedHours} hours</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{exercises.length} exercises</span>
          </div>
          {module.passingScore && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Passing: {module.passingScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Exercises List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
        
        {exercises.length === 0 ? (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <div className="text-xl font-semibold mb-2">No exercises available</div>
            <div className="text-gray-600">
              {user?.role 
                ? `No exercises found for role: ${user.role}`
                : 'Exercises will appear here once added'
              }
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                index={index}
                moduleId={moduleId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, index, moduleId }) {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HARD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'DEVELOPER': return '👨‍💻';
      case 'QA_ENGINEER': return '🧪';
      case 'PRODUCT_OWNER': return '📊';
      case 'BUSINESS_ANALYST': return '📈';
      default: return '👤';
    }
  };

  return (
    <Link
      to={`/modules/${moduleId}/exercises/${exercise.id}`}
      className="block bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
            <h3 className="text-xl font-bold text-gray-900">{exercise.title}</h3>
          </div>
          
          <p className="text-gray-600 mb-4">{exercise.description}</p>

          <div className="flex gap-3 flex-wrap">
            {exercise.difficulty && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            )}
            {exercise.targetRole && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-800 border-2 border-blue-200">
                {getRoleIcon(exercise.targetRole)} {exercise.targetRole.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4">
          <div className="text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ModuleDetail;