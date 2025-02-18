import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, ChartBar, Wallet, Shield } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Create falling coins
    const createCoins = () => {
      const hero = document.querySelector('.hero');
      const coin = document.createElement('div');
      coin.classList.add('coin');
      
      // Random position and duration
      coin.style.left = Math.random() * 100 + 'vw';
      coin.style.animationDuration = Math.random() * 3 + 2 + 's';  // Slower fall
      
      hero.appendChild(coin);
      
      // Remove coin after animation
      setTimeout(() => {
        coin.remove();
      }, 5000);
    };

    // Create coins more frequently
    const interval = setInterval(createCoins, 200);  // Increased frequency
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Create trailing coins behind piggy
    const createTrailingCoin = () => {
      const piggy = document.querySelector('.walking-piggy');
      const hero = document.querySelector('.hero');
      if (!piggy || !hero) return;
      
      const piggyRect = piggy.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      
      const coin = document.createElement('div');
      coin.classList.add('trailing-coin');
      
      // Position coin relative to hero section
      const coinLeft = piggyRect.left - heroRect.left;
      coin.style.left = `${coinLeft}px`;
      coin.style.bottom = '40px'; // Match piggy's bottom position
      
      hero.appendChild(coin);
      
      // Remove coin after animation
      setTimeout(() => coin.remove(), 1000);
    };

    const trailInterval = setInterval(createTrailingCoin, 200); // More frequent coins
    return () => clearInterval(trailInterval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const points = document.querySelectorAll('.mission-point');
          points[0].classList.add('slide-left');
          points[1].classList.add('fade-in');
          points[2].classList.add('slide-right');
        } else {
          // Remove classes when out of view to reset animation
          const points = document.querySelectorAll('.mission-point');
          points[0].classList.remove('slide-left');
          points[1].classList.remove('fade-in');
          points[2].classList.remove('slide-right');
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '-50px'  // Trigger slightly before the element is in view
    });

    const missionSection = document.querySelector('.mission-points');
    if (missionSection) {
      observer.observe(missionSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-content">
          <h1 className="logo">
            <PiggyBank size={40} className="logo-icon" />
            DIME
          </h1>
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
          <h1>Every DIME Counts</h1>
          <p>Take Control of Your Finances</p>
          <p>Track expenses, manage budgets, and achieve your financial goals with ease.</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
        <div className="walking-piggy">
          <PiggyBank size={64} color="#FFD700" />
        </div>
      </div>

      <div className="features">
        <div className="features-content">
          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon">
                  <Wallet size={32} />
                </div>
                <h3>Expense Tracking</h3>
                <p>Easily track your daily expenses and income in one place</p>
              </div>
              <div className="feature-card-back">
                <p>Record transactions instantly</p>
                <p>Categorize expenses automatically</p>
                <p>Monitor spending patterns</p>
                <p>Set custom categories</p>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon">
                  <PiggyBank size={32} />
                </div>
                <h3>Smart Budgeting</h3>
                <p>Set and manage budgets that help you reach your financial goals</p>
              </div>
              <div className="feature-card-back">
                <p>Create and manage budgets</p>
                <p>Set financial goals and track progress</p>
                <p>Monitor expenses and income</p>
                <p>Receive budget alerts and notifications</p>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon">
                  <ChartBar size={32} />
                </div>
                <h3>Visual Analytics</h3>
                <p>Get insights into your spending with beautiful charts and reports</p>
              </div>
              <div className="feature-card-back">
                <p>Visualize spending patterns</p>
                <p>Generate detailed reports</p>
                <p>Compare expenses over time</p>
                <p>Identify areas for improvement</p>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon">
                  <Shield size={32} />
                </div>
                <h3>Secure & Private</h3>
                <p>Your financial data is protected with bank-level security</p>
              </div>
              <div className="feature-card-back">
                <p>Bank-level encryption</p>
                <p>Secure login and authentication</p>
                <p>Data privacy protection</p>
                <p>Regular security audits</p>
              </div>
            </div>
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