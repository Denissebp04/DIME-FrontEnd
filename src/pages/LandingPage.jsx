import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, ChartBar, Wallet, Shield } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-content">
          <h1 className="logo">DIME</h1>
          <div className="auth-buttons">
            <button 
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="signup-btn"
              onClick={() => navigate('/login')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <h1>Every Dime Counts</h1>
          <p>Take Control of Your Finances</p>
          <p>Track expenses, manage budgets, and achieve your financial goals with ease.</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="features">
        <div className="features-content">
          <div className="feature-card">
            <div className="feature-icon">
              <Wallet size={32} />
            </div>
            <h3>Expense Tracking</h3>
            <p>Easily track your daily expenses and income in one place</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <PiggyBank size={32} />
            </div>
            <h3>Smart Budgeting</h3>
            <p>Set and manage budgets that help you reach your financial goals</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ChartBar size={32} />
            </div>
            <h3>Visual Analytics</h3>
            <p>Get insights into your spending with beautiful charts and reports</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Secure & Private</h3>
            <p>Your financial data is protected with bank-level security</p>
          </div>
        </div>
      </div>

      <div className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p className="mission-text">
            At DIME, we believe everyone deserves financial clarity and control. 
            Our mission is to empower individuals with simple yet powerful tools 
            to manage their finances effectively, make informed decisions, and 
            achieve their financial goals.
          </p>
          <div className="mission-points">
            <div className="mission-point">
              <h3>Simplify</h3>
              <p>Making financial management accessible and straightforward</p>
            </div>
            <div className="mission-point">
              <h3>Empower</h3>
              <p>Providing insights and tools for better financial decisions</p>
            </div>
            <div className="mission-point">
              <h3>Succeed</h3>
              <p>Helping you achieve your financial goals and dreams</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2024 DIME. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 