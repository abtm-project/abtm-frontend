import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import exerciseService from '../services/exerciseService';
import ScenarioSubmissionForm from '../components/ScenarioSubmissionForm';

function ExerciseDetail() {
  const [exercise, setExercise] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { moduleId, exerciseId } = useParams();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        console.log('Fetching exercise:', exerciseId, 'from module:', moduleId);
        
        // Get exercise from module
        const data = await exerciseService.getExerciseFromModule(moduleId, exerciseId);
        
        if (data) {
          setExercise(data);
          
          // Optionally fetch module info for breadcrumb
          try {
            const moduleResponse = await fetch(`http://localhost:8080/api/modules/${moduleId}`);
            const moduleData = await moduleResponse.json();
            setModule(moduleData);
          } catch (err) {
            console.log('Could not fetch module details');
          }
        } else {
          setError(`Exercise ${exerciseId} not found in this module`);
        }
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError('Failed to load exercise. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId && exerciseId) {
      fetchExercise();
    }
  }, [moduleId, exerciseId]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'DEVELOPER': return 'bg-blue-100 text-blue-800';
      case 'QA_ENGINEER': return 'bg-purple-100 text-purple-800';
      case 'PRODUCT_OWNER': return 'bg-green-100 text-green-800';
      case 'BUSINESS_ANALYST': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl">Loading exercise...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-red-800 text-xl font-semibold mb-4">{error}</div>
          <Link 
            to="/modules" 
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ← Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-yellow-800 text-xl font-semibold mb-4">Exercise not found</div>
          <Link 
            to="/modules" 
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ← Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-gray-600">
        <Link to="/modules" className="hover:text-blue-600">Modules</Link>
        <span className="mx-2">›</span>
        <Link to={`/modules/${moduleId}`} className="hover:text-blue-600">
          {module?.title || 'Module'}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-semibold">{exercise.title}</span>
      </div>

      {/* Exercise Header */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
        <h1 className="text-4xl font-bold mb-4">{exercise.title}</h1>
        
        <div className="flex gap-3 mb-6">
          {exercise.difficulty && (
            <span className={`px-4 py-2 rounded-full font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          )}
          {exercise.targetRole && (
            <span className={`px-4 py-2 rounded-full font-semibold ${getRoleColor(exercise.targetRole)}`}>
              {exercise.targetRole.replace('_', ' ')}
            </span>
          )}
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {exercise.description}
        </p>
        
        {exercise.userStory && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">📖 User Story</h3>
            <p className="text-gray-800 italic">{exercise.userStory}</p>
          </div>
        )}

        {exercise.sampleSolution && (
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <h3 className="font-semibold text-lg mb-2 text-green-900">💡 Sample Solution</h3>
            <pre className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
              {exercise.sampleSolution}
            </pre>
          </div>
        )}

        {exercise.expectedScenarios && (
          <div className="mt-6 text-sm text-gray-600">
            <span className="font-semibold">Expected Scenarios:</span> {exercise.expectedScenarios}
          </div>
        )}
      </div>

      {/* Scenario Submission Form */}
      <ScenarioSubmissionForm 
        exerciseId={parseInt(exerciseId)} 
        onSubmitSuccess={(result) => {
          console.log('Scenario submitted successfully!', result);
          // Optionally show success message or redirect
        }}
      />

      {/* Tips Section */}
      <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3 text-purple-900">💡 Tips for Writing Good BDD Scenarios</h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ <strong>Use Given-When-Then structure:</strong> Clearly separate context, action, and outcome</li>
          <li>✅ <strong>Be specific:</strong> Use concrete examples with actual data (e.g., "username: john.doe")</li>
          <li>✅ <strong>Focus on behavior:</strong> Describe what the user does and sees, not technical implementation</li>
          <li>✅ <strong>Avoid UI details:</strong> Don't reference buttons, divs, or CSS classes</li>
          <li>✅ <strong>Make it testable:</strong> Include clear, measurable assertions</li>
          <li>✅ <strong>Keep it simple:</strong> One scenario should test one specific behavior</li>
        </ul>
      </div>

      {/* Example Good vs Bad */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h4 className="font-bold text-lg mb-3 text-green-900">✅ Good Example</h4>
          <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
{`Given a user with email "user@test.com"
When they click "Forgot Password"
And enter their email "user@test.com"
And click "Send Reset Link"
Then they should see message "Check your email"
And receive a password reset email`}
          </pre>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h4 className="font-bold text-lg mb-3 text-red-900">❌ Bad Example</h4>
          <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
{`When I click the button
Then the page loads
And I see the div
And the JavaScript runs`}
          </pre>
          <div className="mt-3 text-sm text-red-800">
            <strong>Problems:</strong> Vague, UI-dependent, no Given context, technical details
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseDetail;