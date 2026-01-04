import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moduleService from '../services/moduleService';

function ModuleList() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await moduleService.getAllModules();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <div className="text-xl">Loading modules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">BDD Training Modules</h1>
        <p className="text-gray-600 text-lg">
          Master Behavior-Driven Development through structured learning paths
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📭</div>
          <div className="text-xl font-semibold mb-2">No modules available</div>
          <div className="text-gray-600">Check back later for training content</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              index={index}
              userRole={user?.role}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module, index, userRole }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await moduleService.getModuleExercises(module.id, userRole);
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [module.id, userRole]);

  const iconMap = {
    1: '📖',
    2: '✍️',
    3: '👥',
    4: '🚀'
  };

  return (
    <Link 
      to={`/modules/${module.id}`}
      className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl">{iconMap[module.moduleOrder] || '📚'}</span>
          <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            Module {module.moduleOrder}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
        <p className="text-blue-100">{module.description}</p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{module.estimatedHours}h</span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">
              {loading ? '...' : `${exercises.length} exercises`}
            </span>
          </div>
        </div>

        {module.difficulty && (
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              module.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
              module.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {module.difficulty}
            </span>
          </div>
        )}

        <div className="text-blue-600 font-semibold flex items-center">
          Start Learning
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default ModuleList;