import React from 'react';
import { LayoutDashboard, PiggyBank, FileBarChart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, onClose, activeSection }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay to close sidebar on mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <nav className="nav-items">
            <button 
              className={`nav-item ${isActivePath('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button 
              className={`nav-item ${isActivePath('/finances') ? 'active' : ''}`}
              onClick={() => navigate('/finances')}
            >
              <PiggyBank size={20} />
              My Finances
            </button>

            <button 
              className={`nav-item ${isActivePath('/reports') ? 'active' : ''}`}
              onClick={() => navigate('/reports')}
            >
              <FileBarChart size={20} />
              Summary & Reports
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar; 