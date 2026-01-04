import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import exerciseService from '../services/exerciseService';

function MyScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PASSED, FAILED, NEEDS_IMPROVEMENT
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scenariosData, statsData] = await Promise.all([
          exerciseService.getUserScenarios(user.id),
          exerciseService.getUserScenarioStatistics(user.id)
        ]);
        setScenarios(scenariosData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const filteredScenarios = scenarios.filter(scenario => {
    if (filter === 'ALL') return true;
    return scenario.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'PASSED': return 'bg-green-100 text-green-800 border-green-200';
      case 'NEEDS_IMPROVEMENT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-xl">Loading your scenarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">My Scenarios</h1>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.totalScenarios}</div>
            <div className="text-gray-600">Total Submitted</div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl font-bold text-green-600">{stats.passedScenarios}</div>
            <div className="text-gray-600">Passed</div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.needsImprovementScenarios || 0}</div>
            <div className="text-gray-600">Needs Work</div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-600">{stats.averageScore?.toFixed(1) || 0}/10</div>
            <div className="text-gray-600">Average Score</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          {['ALL', 'PASSED', 'NEEDS_IMPROVEMENT', 'FAILED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios List */}
      {filteredScenarios.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📭</div>
          <div className="text-xl font-semibold mb-2">No scenarios found</div>
          <div className="text-gray-600 mb-4">
            {filter === 'ALL' 
              ? 'Start submitting scenarios to see them here!'
              : `No ${filter} scenarios yet.`
            }
          </div>
          <Link 
            to="/modules"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Browse Modules
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredScenarios.map(scenario => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScenarioCard({ scenario }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'PASSED': return 'bg-green-100 text-green-800 border-green-200';
      case 'NEEDS_IMPROVEMENT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(scenario.status)}`}>
              {scenario.status}
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {scenario.overallSqs?.toFixed(2)}/10
            </span>
            {scenario.isAutomationReady && (
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                🤖 Automation Ready
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Submitted: {formatDate(scenario.submittedAt)}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {expanded ? '▼ Collapse' : '▶ Expand'}
        </button>
      </div>

      {expanded && (
        <>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Scenario Content:</h4>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap border border-gray-200">
              {scenario.content}
            </pre>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-gray-600">Clarity</div>
              <div className="text-lg font-bold">{scenario.clarityScore?.toFixed(1)}/10</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-gray-600">Business Value</div>
              <div className="text-lg font-bold">{scenario.businessValueScore?.toFixed(1)}/10</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-gray-600">Gherkin</div>
              <div className="text-lg font-bold">{scenario.gherkinScore?.toFixed(1)}/10</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-gray-600">Testability</div>
              <div className="text-lg font-bold">{scenario.testabilityScore?.toFixed(1)}/10</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-gray-600">Specificity</div>
              <div className="text-lg font-bold">{scenario.specificityScore?.toFixed(1)}/10</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-gray-600">Duplication</div>
              <div className="text-lg font-bold">{scenario.duplicationScore?.toFixed(1)}/10</div>
            </div>
          </div>

          {scenario.feedback && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold mb-2">💬 Feedback:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{scenario.feedback}</p>
            </div>
          )}

          {scenario.detectedAntipatterns && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h4 className="font-semibold mb-2 text-red-800">⚠️ Anti-patterns Detected:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{scenario.detectedAntipatterns}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyScenarios;