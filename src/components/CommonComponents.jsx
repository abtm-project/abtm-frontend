// src/components/CommonComponents.jsx
// Common reusable components

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// Loading Spinner Component
// ============================================================================

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
    </div>
  );
};

// ============================================================================
// Private Route Component - Requires Authentication
// ============================================================================

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ============================================================================
// Footer Component
// ============================================================================

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              © 2026 ABTM - Adaptive BDD Training Model
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Research Project | Abdullah Alshammari | Yanbu Industrial College
            </p>
          </div>
          <div className="text-sm text-gray-400">
            <p>ABTM</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
