import React, { useEffect, useState } from 'react';
import { Menu, User, PieChart, BarChart, TrendingUp, PiggyBank } from 'lucide-react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import Sidebar from './components/Sidebar';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { budgetService } from '../services/budgetService';
import Logo from '../components/Logo';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Reports({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const [monthlyData, setMonthlyData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalBudget: 0,
    savings: 0,
    expensesByCategory: {},
    budgetUtilization: 0,
    budgetsByCategory: {}
  });

  const [chartData, setChartData] = useState({
    expenses: {
      labels: [],
      data: []
    },
    income: {
      labels: [],
      data: []
    },
    budget: {
      labels: ['Budget', 'Expenses'],
      data: []
    }
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        const expenses = await expenseService.getUserExpenses(userId);
        const incomes = await incomeService.getUserIncomes(userId);
        const budgets = await budgetService.getUserBudgets(userId);

        // Calculate totals
        const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
        
        // Calculate budget utilization percentage
        const budgetUtilization = totalBudget > 0 
          ? (totalExpenses / totalBudget) * 100 
          : 0;

        // Calculate expenses by category
        const expensesByCategory = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

        // Calculate budget utilization by category
        const budgetsByCategory = budgets.reduce((acc, budget) => {
          // Get all expenses for this budget's category
          const categoryExpenses = expenses.filter(exp => exp.category === budget.category)
            .reduce((sum, exp) => sum + exp.amount, 0);

          acc[budget.category] = {
            budgeted: budget.amount,
            spent: categoryExpenses,
            utilization: (categoryExpenses / budget.amount) * 100
          };
          return acc;
        }, {});

        // Prepare chart data
        const expenseChartData = {
          labels: Object.keys(expensesByCategory),
          data: Object.values(expensesByCategory)
        };

        // Group transactions by month for trend analysis
        const monthlyData = expenses.reduce((acc, expense) => {
          const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + expense.amount;
          return acc;
        }, {});

        setChartData({
          expenses: expenseChartData,
          monthly: {
            labels: Object.keys(monthlyData),
            data: Object.values(monthlyData)
          },
          budget: {
            labels: ['Budget', 'Expenses'],
            data: [totalBudget, totalExpenses]
          }
        });

        setMonthlyData({
          totalIncome,
          totalExpenses,
          totalBudget,
          savings: totalIncome - totalExpenses,
          expensesByCategory,
          budgetUtilization,
          budgetsByCategory
        });

      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, []);

  // Chart configurations
  const pieChartData = {
    labels: chartData.expenses.labels,
    datasets: [
      {
        data: chartData.expenses.data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  const lineChartData = {
    labels: chartData.monthly?.labels || [],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: chartData.monthly?.data || [],
        fill: false,
        borderColor: '#ff4b2b',
        tension: 0.1
      }
    ]
  };

  const barChartData = {
    labels: ['Budget vs Expenses'],
    datasets: [
      {
        label: 'Budget',
        data: [monthlyData.totalBudget],
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Actual Expenses',
        data: [monthlyData.totalExpenses],
        backgroundColor: '#ff4b2b',
      }
    ]
  };

  // Add new chart data for expense vs income comparison
  const expenseVsIncomeData = {
    labels: ['Income vs Expenses'],
    datasets: [
      {
        label: 'Income',
        data: [monthlyData.totalIncome],
        backgroundColor: '#10B981',  // Green for income
      },
      {
        label: 'Expenses',
        data: [monthlyData.totalExpenses],
        backgroundColor: '#ff4b2b',  // Red for expenses
      }
    ]
  };

  return (
    <>
      <Sidebar 
        activeSection="reports"
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
            <h1>Summary & Reports</h1>
          </header>

          {/* Monthly Summary Section */}
          <section className="summary-section">
            <h2 className="section-title">Monthly Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon income">
                  <TrendingUp size={24} />
                </div>
                <div className="summary-details">
                  <h3>Total Income</h3>
                  <p className="amount positive">${monthlyData.totalIncome.toFixed(2)}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon expense">
                  <BarChart size={24} />
                </div>
                <div className="summary-details">
                  <h3>Total Expenses</h3>
                  <p className="amount negative">${monthlyData.totalExpenses.toFixed(2)}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon savings">
                  <PieChart size={24} />
                </div>
                <div className="summary-details">
                  <h3>Remaining Balance</h3>
                  <p className="amount">${monthlyData.savings.toFixed(2)}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon budget">
                  <PiggyBank size={24} />
                </div>
                <div className="summary-details">
                  <h3>Total Budget</h3>
                  <p className="amount">${monthlyData.totalBudget.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <div className="charts-grid">
            <section className="chart-section">
              <h2 className="section-title">Expense Distribution</h2>
              <div className="chart-container">
                <Pie data={pieChartData} options={{ responsive: true }} />
              </div>
            </section>

            <section className="chart-section">
              <h2 className="section-title">Income vs Expenses</h2>
              <div className="chart-container">
                <Bar 
                  data={expenseVsIncomeData} 
                  options={{ 
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: true
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }} 
                />
              </div>
            </section>

            <section className="chart-section">
              <h2 className="section-title">Monthly Trends</h2>
              <div className="chart-container">
                <Line data={lineChartData} options={{ 
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} />
              </div>
            </section>

            <section className="chart-section">
              <h2 className="section-title">Budget vs Expenses</h2>
              <div className="chart-container">
                <Bar 
                  data={barChartData} 
                  options={{ 
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
            </section>
          </div>

          {/* Budget Categories Section */}
          <section className="categories-section">
            <h2 className="section-title">Utilized Budget Categories</h2>
            <div className="categories-grid">
              {Object.entries(monthlyData.budgetsByCategory || {})
                .filter(([_, data]) => data.spent > 0)  // Only show categories with spending
                .map(([category, data]) => (
                  <div key={category} className="category-card">
                    <h3>{category}</h3>
                    <div className="budget-details">
                      <p className="budget-amount">Budget: ${data.budgeted.toFixed(2)}</p>
                      <p className="spent-amount">
                        Spent: <span className={data.spent > data.budgeted ? 'negative' : ''}>
                          ${data.spent.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${Math.min(data.utilization, 100)}%`,
                          backgroundColor: data.spent > data.budgeted ? '#ff4b2b' : '#10B981'
                        }}
                      />
                    </div>
                    <p className="utilization">
                      {data.utilization.toFixed(1)}% utilized
                    </p>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Reports; 