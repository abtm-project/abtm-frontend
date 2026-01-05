import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

function ScoreRadarChart({ scenario }) {
  if (!scenario) return null;

  const data = [
    { subject: 'Clarity', score: scenario.clarityScore || 0, fullMark: 10 },
    { subject: 'Business\nValue', score: scenario.businessValueScore || 0, fullMark: 10 },
    { subject: 'Gherkin', score: scenario.gherkinScore || 0, fullMark: 10 },
    { subject: 'Testability', score: scenario.testabilityScore || 0, fullMark: 10 },
    { subject: 'Specificity', score: scenario.specificityScore || 0, fullMark: 10 },
    { subject: 'No\nDuplication', score: scenario.duplicationScore || 0, fullMark: 10 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-center">6-Dimension Analysis</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar 
            name="Score" 
            dataKey="score" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.6}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center">
        <div className="text-4xl font-bold text-blue-600">
          {scenario.overallSqs?.toFixed(2)}/10
        </div>
        <div className="text-gray-600 text-sm">Overall SQS Score</div>
      </div>
    </div>
  );
}

export default ScoreRadarChart;