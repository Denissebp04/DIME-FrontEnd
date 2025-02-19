import React, { useEffect, useState } from 'react';
import { Menu, User, PiggyBank, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, CreditCard } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Logo from '../components/Logo';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { budgetService } from '../services/budgetService';
import './MainDashboard.css';

function MainDashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activities, setActivities] = useState([]);
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || 'User';
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

        // Filter out invalid dates and sort by date
        const validActivities = allActivities.filter(activity => 
          activity.date instanceof Date && !isNaN(activity.date)
        );
        
        // Sort by date (most recent first)
        validActivities.sort((a, b) => b.date - a.date);
        
        setActivities(validActivities);
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

  const calculateTotalBalance = () => {
    const totalIncome = activities
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = activities
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return totalIncome - totalExpenses;
  };

  const calculateMonthlySavings = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Filter for this month's transactions
    const thisMonthActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= firstDayOfMonth && activityDate <= currentDate;
    });

    const monthlyIncome = thisMonthActivities
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = thisMonthActivities
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return monthlyIncome - monthlyExpenses;
  };

  const calculateMonthlySpending = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Filter for this month's expenses only
    const thisMonthExpenses = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= firstDayOfMonth && 
             activityDate <= currentDate && 
             activity.amount < 0;  // Only negative amounts (expenses)
    });

    // Sum up the expenses (use absolute values)
    return thisMonthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
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
            <Logo />
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
            <h1>My Dashboard</h1>
          </header>

          {/* Quick Stats Section */}
          <div className="quick-stats">
            <div className="card">
              <div className="card-header">
                <div className="icon-wrapper blue">
                  <Wallet size={24} />
                </div>
                <h2 className="card-title">Total Balance</h2>
              </div>
              <div className="card-amount">
                {calculateTotalBalance().toFixed(2)}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="icon-wrapper green">
                  <TrendingUp size={24} />
                </div>
                <h2 className="card-title">Monthly Savings</h2>
              </div>
              <div className={`card-amount ${calculateMonthlySavings() >= 0 ? 'positive' : 'negative'}`}>
                {calculateMonthlySavings().toFixed(2)}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="icon-wrapper red">
                  <CreditCard size={24} />
                </div>
                <h2 className="card-title">Monthly Spending</h2>
              </div>
              <div className="card-amount negative">
                {calculateMonthlySpending().toFixed(2)}
              </div>
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