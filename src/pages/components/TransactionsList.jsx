import React from 'react';
import { ShoppingBag, DollarSign } from 'lucide-react';
import { expenseService } from '../../services/expenseService';
import { incomeService } from '../../services/incomeService';

// This component shows the list of recent transactions
function TransactionsList({ transactions, onAddClick, setTransactions }) {
  const handleDelete = async (transaction) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const id = transaction.id.replace(transaction.type + '-', '');
        
        if (transaction.type === 'expense') {
          await expenseService.deleteExpense(id);
        } else {
          await incomeService.deleteIncome(id);
        }

        setTransactions(prev => prev.filter(t => t.id !== transaction.id));
        alert('Transaction deleted successfully!');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  return (
    <div className="transactions-section">
      {/* Header with title and add button */}
      <div className="section-header">
        <h2>Recent Transactions</h2>
        <button 
          onClick={onAddClick}
          style={{  // Add inline style to override any other styles
            background: '#ff4b2b',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          + Add Transaction
        </button>
      </div>

      {/* List of transactions */}
      <div className="transactions-list">
        {transactions.map(transaction => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-left">
              <div className={`transaction-icon ${transaction.amount > 0 ? 'income' : 'expense'}`}>
                {transaction.amount > 0 ? <DollarSign /> : <ShoppingBag />}
              </div>
              <div className="transaction-info">
                <div className="transaction-name">{transaction.name}</div>
                <div className="transaction-metadata">
                  <span className="transaction-date">{transaction.date}</span>
                  <span className="transaction-category">{transaction.category}</span>
                </div>
              </div>
            </div>
            <div className="transaction-right">
              <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toFixed(2)}
              </div>
              <button 
                className="delete-button"
                onClick={() => handleDelete(transaction)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsList; 