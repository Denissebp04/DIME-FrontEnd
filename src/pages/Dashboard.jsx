import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { PiggyBank, ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Menu, User } from 'lucide-react';
import Logo from '../components/Logo';

// Import our components
import BudgetCard from './components/BudgetCard';
import IncomeCard from './components/IncomeCard';
import ExpenseCard from './components/ExpenseCard';
import TransactionsList from './components/TransactionsList';
import AddTransactionModal from './components/AddTransactionModal';
import Income from './Income';
import Expenses from './Expenses';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { budgetService } from '../services/budgetService';
import AddBudgetModal from './components/AddBudgetModal';
import Budget from './Budget';
import Sidebar from './components/Sidebar';

function Dashboard({ onLogout }) {
  // Store all our financial data
  const [transactions, setTransactions] = useState([]);

  // Calculate totals
  const expenses = Math.abs(transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0));
  
  const income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  // Control what's showing on screen
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIncomeManagement, setShowIncomeManagement] = useState(false);
  const [showExpensesManagement, setShowExpensesManagement] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Add state for budget management
  const [showBudgetManagement, setShowBudgetManagement] = useState(false);

  // Get username from localStorage
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || 'User';
  });

  // Add this state
  const [budgets, setBudgets] = useState([]);

  // Add new state for budget modal
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);

  // Add state for active section
  const [activeSection, setActiveSection] = useState('dashboard');

  // Add state for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Dashboard mounted');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log('Dashboard auth check:', {
      hasToken: !!token,
      hasUserId: !!userId
    });
  }, []);

  useEffect(() => {
    const fetchAllTransactions = async () => {
        try {
            const userId = localStorage.getItem('userId');
            // Fetch both expenses and incomes
            const expensesResponse = await expenseService.getUserExpenses(userId);
            const incomesResponse = await incomeService.getUserIncomes(userId);

            // Combine and format both types of transactions
            // Filter out any transactions with category 'SAVINGS' or budget-related items
            const allTransactions = [
                ...expensesResponse
                    .filter(expense => expense.category !== 'SAVINGS')  // Filter out budget/savings
                    .map(expense => ({
                        id: `expense-${expense.id}`,
                        name: expense.title,
                        amount: -Math.abs(expense.amount),
                        date: new Date(expense.date).toLocaleDateString(),
                        category: expense.category,
                        type: 'expense'
                    })),
                ...incomesResponse.map(income => ({
                    id: `income-${income.id}`,
                    name: income.title,
                    amount: Math.abs(income.amount),
                    date: new Date(income.date).toLocaleDateString(),
                    category: income.category,
                    type: 'income'
                }))
            ];

            // Sort by date (most recent first)
            allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    fetchAllTransactions();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        onLogout();
      }
    };

    // Check on mount
    checkAuth();

    // Optional: Check periodically
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, [onLogout]);

  // Add this effect to fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await budgetService.getUserBudgets(userId);
            setBudgets(response);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    fetchBudgets();
  }, []);

  const handleAddTransaction = () => {
    setShowAddModal(true);
  };

  // Calculate budget totals from the budgets array
  const totalBudget = budgets.reduce((total, budget) => total + parseFloat(budget.amount), 0);
  const totalSpent = budgets.reduce((total, budget) => total + parseFloat(budget.spent), 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <>
      <Sidebar 
        onBudgetClick={() => {
          setShowBudgetManagement(true);
          setActiveSection('budget');
        }}
        onIncomeClick={() => {
          setShowIncomeManagement(true);
          setActiveSection('income');
        }}
        onExpensesClick={() => {
          setShowExpensesManagement(true);
          setActiveSection('expenses');
        }}
        activeSection={activeSection}
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
            <h1>My Finances</h1>
          </header>
          <div className="summary-cards">
            <BudgetCard 
              budget={totalBudget}
              onClick={() => setShowBudgetManagement(true)}
            />

            <IncomeCard 
              income={income}
              onClick={() => setShowIncomeManagement(true)}
            />

            <ExpenseCard 
              expenses={expenses}
              onClick={() => setShowExpensesManagement(true)}
            />
          </div>

          <TransactionsList 
            transactions={transactions}
            setTransactions={setTransactions}
            onAddClick={handleAddTransaction}
          />

          {showIncomeManagement && (
            <Income 
              onBack={() => setShowIncomeManagement(false)}
              transactions={transactions}
              setTransactions={setTransactions}
              setShowAddModal={setShowAddModal}
              setNewExpense={setNewExpense}
            />
          )}

          {showExpensesManagement && (
            <Expenses 
              onBack={() => setShowExpensesManagement(false)}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          )}

          {showBudgetManagement && (
            <Budget 
              onBack={() => setShowBudgetManagement(false)}
              budgets={budgets}
              setBudgets={setBudgets}
            />
          )}

          {showAddModal && (
            <AddTransactionModal
                onClose={() => setShowAddModal(false)}
                onSubmit={async (transaction) => {
                    try {
                        const userId = localStorage.getItem('userId');
                        if (!userId) {
                            alert('Please log in to add expenses');
                            return;
                        }

                        const expenseData = {
                            title: transaction.name,
                            category: transaction.category,
                            amount: Math.abs(transaction.amount),
                            date: transaction.date || new Date().toISOString().split('T')[0],
                            userId: parseInt(userId)
                        };

                        console.log('Saving expense:', expenseData);
                        const response = await expenseService.createExpense(expenseData);
                        console.log('Server response:', response);

                        if (response && response.id) {
                            // Update local transactions list
                            setTransactions(prev => [...prev, {
                                id: `expense-${response.id}`,  // Use the same prefix format
                                name: transaction.name,
                                amount: -Math.abs(transaction.amount),
                                date: 'Today',
                                category: transaction.category,
                                type: 'expense'
                            }]);
                            setShowAddModal(false);
                            
                            // Show success message
                            alert('Expense saved successfully!');
                        }
                    } catch (error) {
                        console.error('Error saving expense:', error);
                        alert('Failed to save expense. Please try again.');
                    }
                }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard; 