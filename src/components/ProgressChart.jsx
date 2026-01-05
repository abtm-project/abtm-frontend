import React from 'react';

function ProgressChart({ stats }) {
  if (!stats || stats.totalScenarios === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Progress Overview</h3>
        <div className="text-gray-500 text-center py-8">
          No data yet. Start submitting scenarios!
        </div>
      </div>
    );
  }

  const passRate = (stats.passedScenarios / stats.totalScenarios) * 100;
  const needsWorkRate = ((stats.needsImprovementScenarios || 0) / stats.totalScenarios) * 100;
  const failRate = (stats.failedScenarios / stats.totalScenarios) * 100;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold mb-6">Progress Overview</h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Overall Progress</span>
          <span className="text-gray-600">{stats.totalScenarios} scenarios submitted</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden flex">
          <div 
            className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
            style={{ width: `${passRate}%` }}
          >
            {passRate > 15 && `${Math.round(passRate)}%`}
          </div>
          <div 
            className="bg-yellow-500 h-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
            style={{ width: `${needsWorkRate}%` }}
          >
            {needsWorkRate > 15 && `${Math.round(needsWorkRate)}%`}
          </div>
          <div 
            className="bg-red-500 h-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
            style={{ width: `${failRate}%` }}
          >
            {failRate > 15 && `${Math.round(failRate)}%`}
          </div>
        </div>
        <div className="flex justify-between text-xs mt-2 text-gray-600">
          <span>✅ Passed: {stats.passedScenarios}</span>
          <span>⚠️ Needs Work: {stats.needsImprovementScenarios || 0}</span>
          <span>❌ Failed: {stats.failedScenarios}</span>
        </div>
      </div>

      {/* Score Gauge */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Average Score</span>
          <span className="text-3xl font-bold text-blue-600">
            {stats.averageScore?.toFixed(1) || 0}/10
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                stats.averageScore >= 8 ? 'bg-green-500' :
                stats.averageScore >= 6 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${(stats.averageScore / 10) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div>
        <h4 className="font-semibold mb-3">Score Distribution</h4>
        <div className="space-y-2">
          <ScoreBar label="8.0 - 10 (Excellent)" count={stats.passedScenarios} total={stats.totalScenarios} color="green" />
          <ScoreBar label="6.0 - 7.9 (Good)" count={stats.needsImprovementScenarios || 0} total={stats.totalScenarios} color="yellow" />
          <ScoreBar label="0 - 5.9 (Needs Work)" count={stats.failedScenarios} total={stats.totalScenarios} color="red" />
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-600">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressChart;