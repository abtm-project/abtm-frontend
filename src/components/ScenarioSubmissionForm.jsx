import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import exerciseService from '../services/exerciseService';
import ScoreRadarChart from './ScoreRadarChart';
import { toast } from 'react-toastify';

function ScenarioSubmissionForm({ exerciseId, onSubmitSuccess }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { user } = useAuth();

  const handlePreview = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const result = await exerciseService.analyzeScenario(content);
      setAnalysis(result);
	  toast.info('📊 Analysis complete! Review your scores below.');
    } catch (error) {
      console.error('Preview error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const result = await exerciseService.submitSolution(
        exerciseId,
        user.id,
        content
      );
      setAnalysis(result);
      if (onSubmitSuccess) onSubmitSuccess(result);
      toast.success('✅ Scenario submitted successfully!');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('❌ Failed to submit scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PASSED': return 'bg-green-100 text-green-800';
      case 'NEEDS_IMPROVEMENT': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Write Your BDD Scenario</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario Content (Gherkin Format)
          </label>
          <textarea
            className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Given a user visits the login page&#10;When they enter valid username and password&#10;And click the login button&#10;Then they should be redirected to the dashboard&#10;And see a welcome message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 <strong>Tip:</strong> Use Given-When-Then format. Be specific and avoid UI implementation details.
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={handlePreview}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Analyzing...' : '🔍 Preview Analysis'}
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Submitting...' : '✅ Submit Scenario'}
          </button>
        </div>
      </form>

      {analysis && (
        <div className="mt-6 border-t-2 pt-6">
          <h3 className="text-xl font-bold mb-4">📊 Analysis Results</h3>

          {/* Overall Status */}
          <div className={`p-4 rounded-lg mb-6 ${getStatusColor(analysis.status)}`}>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Status: {analysis.status}</span>
              <span className="text-3xl font-bold">
                {analysis.overallSqs?.toFixed(2)}/10
              </span>
            </div>
            {analysis.isAutomationReady && (
              <div className="mt-2 text-sm font-semibold">
                ✅ Ready for automation!
              </div>
            )}
          </div>

          {/* 6 Dimension Scores with Radar Chart */}
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			<div className="grid grid-cols-2 gap-4">
				<ScoreCard title="Clarity" score={analysis.clarityScore} />
				<ScoreCard title="Business Value" score={analysis.businessValueScore} />
				<ScoreCard title="Gherkin" score={analysis.gherkinScore} />
				<ScoreCard title="Testability" score={analysis.testabilityScore} />
				<ScoreCard title="Specificity" score={analysis.specificityScore} />
				<ScoreCard title="Duplication" score={analysis.duplicationScore} />
			</div>
			<ScoreRadarChart scenario={analysis} />
		</div>

          {/* Feedback */}
          {analysis.feedback && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">💬 Feedback:</h4>
              <p className="whitespace-pre-wrap text-gray-700">{analysis.feedback}</p>
            </div>
          )}

          {/* Anti-patterns */}
          {analysis.detectedAntipatterns && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-800">⚠️ Anti-patterns Detected:</h4>
              <p className="whitespace-pre-wrap text-gray-700">{analysis.detectedAntipatterns}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreCard({ title, score }) {
  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-50 text-green-700';
    if (score >= 6) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  };

  const getBarColor = (score) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getScoreColor(score)}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-2xl font-bold">{score?.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getBarColor(score)}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default ScenarioSubmissionForm;