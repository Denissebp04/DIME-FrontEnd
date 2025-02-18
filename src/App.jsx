import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginForm from './pages/loginform/LoginForm';
import Dashboard from './pages/Dashboard';
import MainDashboard from './pages/MainDashboard';
import Reports from './pages/Reports';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isLoggedIn ? 
            <Navigate to="/dashboard" /> : 
            <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? 
            <MainDashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/finances" 
          element={
            isLoggedIn ? 
            <Dashboard /> : 
            <Navigate to="/login" />
          }
        />
        <Route 
          path="/reports" 
          element={
            isLoggedIn ? 
            <Reports onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
