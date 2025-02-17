import React, { useState, useEffect } from 'react';

function AddBudgetModal({ onClose, onSubmit, editBudget = null }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editBudget) {
      setFormData({
        category: editBudget.category,
        amount: editBudget.amount.toString(),
      });
    }
  }, [editBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editBudget?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editBudget ? 'Edit Budget' : 'Add Budget'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
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
            </select>
          </div>

          <div className="form-group">
            <label>Budget Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="add-button">
              {editBudget ? 'Save Changes' : 'Add Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBudgetModal; 