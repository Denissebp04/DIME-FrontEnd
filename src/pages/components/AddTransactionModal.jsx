import React, { useState, useEffect } from 'react';
import './AddTransactionModal.css';
import { IncomeCategory } from '../../types/IncomeCategory';

// This component shows the modal for adding new transactions
function AddTransactionModal({ onClose, onSubmit, editTransaction = null, type = 'expense' }) {
  // State for the form fields
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editTransaction) {
      setFormData({
        name: editTransaction.name,
        category: editTransaction.category,
        amount: Math.abs(editTransaction.amount).toString(),
        date: editTransaction.date
      });
    }
  }, [editTransaction]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.category || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    // Submit the form data
    onSubmit({
      name: formData.name,
      category: formData.category,  // Use selected category directly
      amount: parseFloat(formData.amount),
      date: formData.date
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editTransaction ? `Edit ${type}` : `Add ${type}`}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Show different category options based on type */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {type === 'income' ? (
                <>
                  <option value="">Select category</option>
                  <option value="SALARY">Salary</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="INVESTMENTS">Investments</option>
                  <option value="BUSINESS">Business</option>
                  <option value="RENTAL">Rental</option>
                  <option value="OTHER">Other</option>
                </>
              ) : (
                // Existing expense categories
                <>
                  <option value="HOUSING">Housing (Rent, mortgage, repairs)</option>
                  <option value="UTILITIES">Utilities (Electricity, water, gas, internet)</option>
                  <option value="FOOD">Food (Groceries, dining out)</option>
                  <option value="TRANSPORT">Transport (Car payments, gas, public transit)</option>
                  <option value="HEALTHCARE">Healthcare (Medical expenses, insurance)</option>
                  <option value="SAVINGS">Savings (Emergency fund, investments)</option>
                  <option value="ENTERTAINMENT">Entertainment (Recreation, hobbies)</option>
                  <option value="SHOPPING">Shopping (Clothing, personal items)</option>
                  <option value="EDUCATION">Education (Tuition, books, courses)</option>
                  <option value="DEBT">Debt (Credit card, loans)</option>
                  <option value="OTHER">Other (Miscellaneous expenses)</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="add-button">
              {editTransaction ? 'Save Changes' : `Add ${type}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal; 