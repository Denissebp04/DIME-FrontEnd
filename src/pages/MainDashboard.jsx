import React, { useEffect, useState } from 'react';
import { Menu, User, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { budgetService } from '../services/budgetService';
import './MainDashboard.css';

function MainDashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activities, setActivities] = useState([]);
  const [username, setUsername] = useState(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.username || 'User';
      } catch (e) {
        return 'User';
      }
    }
    return 'User';
  });

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        // Fetch transactions and budgets
        const expenses = await expenseService.getUserExpenses(userId);
        const incomes = await incomeService.getUserIncomes(userId);
        const budgets = await budgetService.getUserBudgets(userId);

        // Combine and format all activities
        const allActivities = [
          ...expenses.map(expense => ({
            id: `expense-${expense.id}`,
            type: 'expense',
            title: expense.title,
            amount: -expense.amount,
            date: new Date(expense.date),
            icon: '💳'
          })),
          ...incomes.map(income => ({
            id: `income-${income.id}`,
            type: 'income',
            title: income.title,
            amount: income.amount,
            date: new Date(income.date),
            icon: '💰'
          })),
          ...budgets.map(budget => ({
            id: `budget-${budget.id}`,
            type: 'budget',
            title: budget.title,
            amount: budget.amount,
            date: new Date(budget.created_at || budget.date),
            icon: '🎯'
          }))
        ];

        // Sort by date (most recent first)
        allActivities.sort((a, b) => b.date - a.date);
        
        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchAllActivities();
  }, []);

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <>
      <Sidebar 
        activeSection="dashboard"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="header-container">
          <div className="header-left">
            <button 
              className="menu-button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="site-logo">DIME</h1>
          </div>
          <div className="header-right">
            <div className="profile-section">
              <User size={20} />
              <span className="welcome-text">Welcome back, {username}</span>
            </div>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1>Dashboard</h1>
          </header>

          {/* Quick Stats Section */}
          <div className="quick-stats">
            <div className="stat-card">
              <h3>Total Balance</h3>
              <p className="stat-value">$2,070.00</p>
            </div>
            <div className="stat-card">
              <h3>Monthly Savings</h3>
              <p className="stat-value positive">+$520.00</p>
            </div>
            <div className="stat-card">
              <h3>Monthly Spending</h3>
              <p className="stat-value negative">-$1,500.00</p>
            </div>
          </div>

          {/* Activity Overview */}
          <section className="activity-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-details">
                    <h4>{activity.title}</h4>
                    <span className="activity-date">{formatDate(activity.date)}</span>
                  </div>
                  <span className={`activity-amount ${activity.amount >= 0 ? 'positive' : 'negative'}`}>
                    {activity.amount >= 0 ? '+' : ''}{activity.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default MainDashboard; 