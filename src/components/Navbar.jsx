// src/components/Navbar.jsx
// Top navigation bar

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-primary-100 transition-colors">
            ABTM
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-primary-100 transition-colors">
                Dashboard
              </Link>
              <Link to="/modules" className="hover:text-primary-100 transition-colors">
                Modules
              </Link>
              <Link to="/profile" className="hover:text-primary-100 transition-colors">
                Profile
              </Link>
              
              {/* User menu */}
              <div className="flex items-center space-x-4 border-l border-primary-500 pl-6">
                <span className="text-sm">
                  Welcome, <span className="font-semibold">{user?.fullName || user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-primary-100 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;