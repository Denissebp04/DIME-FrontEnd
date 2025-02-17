import React, { useState } from 'react';
import './Budget.css';
import { budgetService } from '../services/budgetService';
import AddBudgetModal from './components/AddBudgetModal';

function Budget({ onBack, budgets, setBudgets }) {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleBudgetSubmit = async (budgetData, budgetId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to manage budgets');
        return;
      }

      const newBudget = {
        category: budgetData.category,
        amount: parseFloat(budgetData.amount),
        userId: parseInt(userId),
        spent: budgetId ? (budgets.find(b => b.id === budgetId)?.spent || 0) : 0
      };

      let response;
      if (budgetId) {
        // Update existing budget
        response = await budgetService.updateBudget(budgetId, newBudget);
        setBudgets(prev => prev.map(b => b.id === budgetId ? response : b));
        alert('Budget updated successfully!');
      } else {
        // Create new budget
        response = await budgetService.createBudget(newBudget);
        setBudgets(prev => [...prev, response]);
        alert('Budget added successfully!');
      }

      setShowAddBudgetModal(false);
      setEditingBudget(null);
    } catch (error) {
      console.error('Error managing budget:', error);
      alert('Failed to manage budget: ' + (error.response?.data?.message || error.message));
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'HOUSING':
        return '🏠';
      case 'UTILITIES':
        return '💡';
      case 'FOOD':
        return '🍽️';
      case 'TRANSPORT':
        return '🚗';
      case 'HEALTHCARE':
        return '🏥';
      case 'SAVINGS':
        return '💰';
      case 'ENTERTAINMENT':
        return '🎮';
      case 'SHOPPING':
        return '🛍️';
      case 'EDUCATION':
        return '📚';
      case 'DEBT':
        return '💳';
      case 'OTHER':
      default:
        return '📋';
    }
  };

  return (
    <div className="expenses-overlay">
      <div className="expenses-panel">
        <div className="expenses-panel-header">
          <div className="header-left">
            <a href="#" onClick={onBack} className="back-link">← Back</a>
            <h2>Manage Budget</h2>
          </div>
          <button 
            className="add-transaction-btn"
            onClick={() => setShowAddBudgetModal(true)}
          >
            + Add Budget
          </button>
        </div>

        {/* Display budgets */}
        <div className="budgets-list">
          {budgets.map(budget => (
            <div key={budget.id} className="budget-item">
              <div className="budget-info">
                <div className="budget-icon">
                  {getCategoryIcon(budget.category)}
                </div>
                <div className="budget-details">
                  <h3>{budget.category}</h3>
                  <div className="budget-amounts">
                    <span>Budget: ${budget.amount}</span>
                    <span>Spent: ${budget.spent}</span>
                  </div>
                </div>
              </div>
              <div className="budget-actions">
                <button 
                  className="edit-button"
                  onClick={() => {
                    setEditingBudget(budget);
                    setShowAddBudgetModal(true);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this budget?')) {
                      try {
                        await budgetService.deleteBudget(budget.id);
                        setBudgets(prev => prev.filter(b => b.id !== budget.id));
                        alert('Budget deleted successfully!');
                      } catch (error) {
                        console.error('Error deleting budget:', error);
                        alert('Failed to delete budget');
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddBudgetModal && (
        <AddBudgetModal
          onClose={() => {
            setShowAddBudgetModal(false);
            setEditingBudget(null);
          }}
          onSubmit={handleBudgetSubmit}
          editBudget={editingBudget}
        />
      )}
    </div>
  );
}

export default Budget; 