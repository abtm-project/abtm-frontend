// src/pages/Profile.jsx
// User profile and statistics page

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const statsData = await authService.getUserStatistics(user.id);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(user.id, profileData);
      updateUser(profileData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await authService.changePassword(user.id, {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
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
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      {/* User Info Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-primary-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-800">{user?.fullName || user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {user?.role?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <svg className="w-12 h-12 text-primary-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600 text-sm mb-1">Modules Completed</p>
          <p className="text-3xl font-bold text-primary-600">{stats?.completedModules || 0}</p>
        </div>

        <div className="card text-center">
          <svg className="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-sm mb-1">Exercises Done</p>
          <p className="text-3xl font-bold text-green-600">{stats?.completedExercises || 0}</p>
        </div>

        <div className="card text-center">
          <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-gray-600 text-sm mb-1">Average Score</p>
          <p className="text-3xl font-bold text-yellow-600">
            {stats?.averageScore ? stats.averageScore.toFixed(1) : '0.0'}
          </p>
        </div>

        <div className="card text-center">
          <svg className="w-12 h-12 text-purple-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-600 text-sm mb-1">Scenarios Written</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalScenarios || 0}</p>
        </div>
      </div>

      {/* Recent Performance */}
      {stats?.recentPerformance && stats.recentPerformance.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Performance</h3>
          <div className="space-y-3">
            {stats.recentPerformance.slice(0, 5).map((perf, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{perf.exerciseTitle || `Exercise #${perf.exerciseId}`}</p>
                  <p className="text-sm text-gray-600">{new Date(perf.attemptDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    perf.score >= 8 ? 'text-green-600' :
                    perf.score >= 6 ? 'text-yellow-600' :
                    perf.score >= 4 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {perf.score.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600">/ 10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Security</h3>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="btn-secondary"
            >
              Change Password
            </button>
          )}
        </div>

        {changingPassword && (
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="input-field"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Info */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Member Since</p>
            <p className="font-medium text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">User ID</p>
            <p className="font-medium text-gray-800">{user?.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Username</p>
            <p className="font-medium text-gray-800">{user?.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-medium text-gray-800">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
