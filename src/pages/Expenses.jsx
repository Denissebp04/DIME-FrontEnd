import React, { useState } from 'react';
import { expenseService } from '../services/expenseService';
import "./Expenses.css";
import AddTransactionModal from './components/AddTransactionModal';

function Expenses({ onBack, transactions, setTransactions }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const handleExpenseSubmit = async (expenseData, expenseId) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in to manage expenses');
                return;
            }

            const expensePayload = {
                title: expenseData.name,
                category: expenseData.category,
                amount: Math.abs(expenseData.amount),
                date: expenseData.date || new Date().toISOString().split('T')[0],
                userId: parseInt(userId)
            };

            let response;
            if (expenseId) {
                // Update existing expense
                response = await expenseService.updateExpense(expenseId, expensePayload);
                setTransactions(prev => prev.map(t => 
                    t.id === `expense-${expenseId}` ? {
                        id: `expense-${response.id}`,
                        name: response.title,
                        amount: -Math.abs(response.amount),
                        date: new Date(response.date).toLocaleDateString(),
                        category: response.category,
                        type: 'expense'
                    } : t
                ));
                alert('Expense updated successfully!');
            } else {
                // Create new expense
                response = await expenseService.createExpense(expensePayload);
                setTransactions(prev => [...prev, {
                    id: `expense-${response.id}`,
                    name: response.title,
                    amount: -Math.abs(response.amount),
                    date: new Date(response.date).toLocaleDateString(),
                    category: response.category,
                    type: 'expense'
                }]);
                alert('Expense added successfully!');
            }

            setShowAddModal(false);
            setEditingExpense(null);
        } catch (error) {
            console.error('Error managing expense:', error);
            alert('Failed to manage expense: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="expenses-overlay">
            <div className="expenses-panel">
                <div className="expenses-panel-header">
                    <div className="header-left">
                        <a href="#" onClick={onBack} className="back-link">← Back</a>
                        <h2>Manage Expenses</h2>
                    </div>
                    <button 
                        className="add-transaction-btn"
                        onClick={() => {
                            setEditingExpense(null);
                            setShowAddModal(true);
                        }}
                    >
                        + Add Expense
                    </button>
                </div>

                <div className="expenses-list">
                    {transactions
                        .filter(t => t.amount < 0)
                        .map(expense => (
                            <div key={expense.id} className="expense-item">
                                <div className="expense-info">
                                    <div className="expense-icon">
                                        {expense.category === 'HOUSING' ? '🏠' :
                                         expense.category === 'UTILITIES' ? '💡' :
                                         expense.category === 'FOOD' ? '🍽️' :
                                         expense.category === 'TRANSPORT' ? '🚗' :
                                         expense.category === 'HEALTHCARE' ? '🏥' :
                                         expense.category === 'SAVINGS' ? '💰' :
                                         expense.category === 'ENTERTAINMENT' ? '🎮' :
                                         expense.category === 'SHOPPING' ? '🛍️' :
                                         expense.category === 'EDUCATION' ? '📚' :
                                         expense.category === 'DEBT' ? '💳' :
                                         '📋'
                                        }
                                    </div>
                                    <div className="expense-details">
                                        <h3>{expense.name}</h3>
                                        <div className="expense-metadata">
                                            <span className="expense-date">{expense.date}</span>
                                            <span className="expense-category">{expense.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="expense-actions">
                                    <span className="expense-amount negative">
                                        ${Math.abs(expense.amount).toFixed(2)}
                                    </span>
                                    <button 
                                        className="edit-button"
                                        onClick={() => {
                                            const expenseToEdit = {
                                                id: expense.id.replace('expense-', ''),
                                                name: expense.name,
                                                category: expense.category,
                                                amount: Math.abs(expense.amount).toString(),
                                                date: expense.date
                                            };
                                            setEditingExpense(expenseToEdit);
                                            setShowAddModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this expense?')) {
                                                try {
                                                    const expenseId = expense.id.replace('expense-', '');
                                                    await expenseService.deleteExpense(expenseId);
                                                    setTransactions(prev => prev.filter(t => t.id !== expense.id));
                                                    alert('Expense deleted successfully!');
                                                } catch (error) {
                                                    console.error('Error deleting expense:', error);
                                                    alert('Failed to delete expense');
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

            {showAddModal && (
                <AddTransactionModal
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingExpense(null);
                    }}
                    onSubmit={handleExpenseSubmit}
                    editTransaction={editingExpense}
                    type="expense"
                />
            )}
        </div>
    );
}

export default Expenses;
