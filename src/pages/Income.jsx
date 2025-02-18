import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import './Income.css';
import { incomeService } from '../services/incomeService';
import AddTransactionModal from './components/AddTransactionModal';

function Income({ onBack, transactions, setTransactions }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const handleIncomeSubmit = async (incomeData) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to manage income');
        return;
      }

      const incomePayload = {
        title: incomeData.name,
        category: incomeData.category,
        amount: Math.abs(incomeData.amount),
        date: incomeData.date || new Date().toISOString().split('T')[0],
        userId: parseInt(userId)
      };

      let response;
      if (editingIncome?.id) {
        // Update existing income
        response = await incomeService.updateIncome(editingIncome.id, incomePayload);
        setTransactions(prev => prev.map(t => 
          t.id === `income-${editingIncome.id}` ? {
            id: `income-${response.id}`,
            name: response.title,
            amount: Math.abs(response.amount),
            date: new Date(response.date).toLocaleDateString(),
            category: response.category,
            type: 'income'
          } : t
        ));
        alert('Income updated successfully!');
      } else {
        // Create new income
        response = await incomeService.createIncome(incomePayload);
        setTransactions(prev => [...prev, {
          id: `income-${response.id}`,
          name: response.title,
          amount: Math.abs(response.amount),
          date: new Date(response.date).toLocaleDateString(),
          category: response.category,
          type: 'income'
        }]);
        alert('Income added successfully!');
      }

      setShowAddModal(false);
      setEditingIncome(null);
    } catch (error) {
      console.error('Error managing income:', error);
      alert('Failed to manage income: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="expenses-overlay">
      <div className="expenses-panel">
        <div className="expenses-panel-header">
          <div className="header-left">
            <a href="#" onClick={onBack} className="back-link">← Back</a>
            <h2>Manage Income</h2>
          </div>
          <button 
            className="add-transaction-btn"
            onClick={() => {
              setEditingIncome(null);  // Ensure we're not in edit mode
              setShowAddModal(true);
            }}
          >
            + Add Income
          </button>
        </div>

        <div className="incomes-list">
          {transactions
            .filter(t => t.amount > 0)
            .map(income => (
              <div key={income.id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-icon">
                    <DollarSign />
                  </div>
                  <div className="expense-details">
                    <h3>{income.name}</h3>
                    <div className="expense-metadata">
                      <span className="expense-date">{income.date}</span>
                      <span className="expense-category">{income.category}</span>
                    </div>
                  </div>
                </div>
                <div className="expense-actions">
                  <span className="expense-amount positive">
                    ${parseFloat(income.amount).toFixed(2)}
                  </span>
                  <button 
                    className="edit-button"
                    onClick={() => {
                      const incomeId = income.id.replace('income-', '');
                      const incomeToEdit = {
                        name: income.name,
                        category: income.category,
                        amount: income.amount.toString(),
                        date: income.date,
                        id: incomeId
                      };
                      setEditingIncome(incomeToEdit);
                      setShowAddModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this income?')) {
                        try {
                          const incomeId = income.id.replace('income-', '');
                          await incomeService.deleteIncome(incomeId);
                          setTransactions(prev => prev.filter(t => t.id !== income.id));
                          alert('Income deleted successfully!');
                        } catch (error) {
                          console.error('Error deleting income:', error);
                          alert('Failed to delete income');
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

      {/* Add/Edit Income Modal */}
      {showAddModal && (
        <AddTransactionModal
          onClose={() => {
            setShowAddModal(false);
            setEditingIncome(null);
          }}
          onSubmit={handleIncomeSubmit}
          editTransaction={editingIncome}
          type="income"
        />
      )}
    </div>
  );
}

export default Income;
