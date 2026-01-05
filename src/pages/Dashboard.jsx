import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProgressChart from '../components/ProgressChart';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStats, scenarioStats] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${user.id}/statistics`),
          axios.get(`http://localhost:8080/api/scenarios/user/${user.id}/statistics`)
        ]);
        
        setStats({ 
          ...userStats.data, 
          ...scenarioStats.data 
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">Welcome back, {user.fullName}!</h1>
      <p className="text-gray-600 mb-8">Role: {user.role}</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Modules Completed" 
          value={stats?.completedModules || 0}
          icon="📚"
          color="blue"
        />
        <StatCard 
          title="Scenarios Submitted" 
          value={stats?.totalScenarios || 0}
          icon="✍️"
          color="purple"
        />
        <StatCard 
          title="Passed Scenarios" 
          value={stats?.passedScenarios || 0}
          icon="✅"
          color="green"
        />
        <StatCard 
          title="Average Score" 
          value={`${(stats?.averageScore || 0).toFixed(1)}/10`}
          icon="⭐"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/modules" 
            className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
          >
            <div className="text-4xl mb-2">📖</div>
            <div className="font-semibold text-lg">Browse Modules</div>
            <div className="text-sm text-gray-600 mt-1">Start learning BDD</div>
          </Link>
          <Link 
            to="/my-scenarios" 
            className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
          >
            <div className="text-4xl mb-2">📝</div>
            <div className="font-semibold text-lg">My Scenarios</div>
            <div className="text-sm text-gray-600 mt-1">View your submissions</div>
          </Link>
          <Link 
            to="/progress" 
            className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
          >
            <div className="text-4xl mb-2">📊</div>
            <div className="font-semibold text-lg">View Progress</div>
            <div className="text-sm text-gray-600 mt-1">Track your learning</div>
          </Link>
        </div>
      </div>
	  
	  {/* Progress Chart */}
		{stats && (
		<ProgressChart stats={stats} />
		)}

      {/* Performance Breakdown */}
      {stats && stats.totalScenarios > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Performance Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats.passedScenarios}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.needsImprovementScenarios || 0}
              </div>
              <div className="text-sm text-gray-600">Needs Improvement</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {stats.failedScenarios}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`${colorClasses[color]} border-2 shadow-md rounded-lg p-6`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{title}</div>
    </div>
  );
}

export default Dashboard;