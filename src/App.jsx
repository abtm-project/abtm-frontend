// src/App.jsx
// Main application component with routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, Footer } from './components/CommonComponents';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModuleList from './pages/ModuleList';
import ModuleDetail from './pages/ModuleDetail';
import Exercise from './pages/Exercise';
import ExerciseDetail from './pages/ExerciseDetail';
import MyScenarios from './pages/MyScenarios';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/modules" element={
                <PrivateRoute>
                  <ModuleList />
                </PrivateRoute>
              } />
              
              <Route path="/modules/:moduleId" element={
                <PrivateRoute>
                  <ModuleDetail />
                </PrivateRoute>
              } />
              
              <Route path="/exercises/:exerciseId" element={
                <PrivateRoute>
                  <Exercise />
                </PrivateRoute>
              } />
			  
			  <Route path="/modules/:moduleId/exercises/:exerciseId" element={
				  <PrivateRoute>
				  <ExerciseDetail />
				  </PrivateRoute>
			  } />
			  
			  <Route path="/my-scenarios" element={
				  <PrivateRoute>
				  <MyScenarios />
				  </PrivateRoute>
			  } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
			  
			  <Route path="/quiz/:quizId" element={
				<PrivateRoute>
					<Quiz />
				</PrivateRoute>
			  } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
        
        {/* Toast notifications */}
		<ToastContainer
			position="top-right"
			autoClose={3000}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme="light"
		/>
		
      </Router>
    </AuthProvider>
  );
}

export default App;
