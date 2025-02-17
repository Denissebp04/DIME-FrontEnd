import React from 'react';
import { ArrowDownRight } from 'lucide-react';

// This component shows the expenses card
function ExpenseCard({ expenses, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {/* Card header with icon and title */}
      <div className="card-header">
        <div className="icon-wrapper red">
          <ArrowDownRight size={24} />
        </div>
        <h2 className="card-title">Expenses</h2>
      </div>

      {/* Show the total expenses amount */}
      <div className="card-amount expense">
        {expenses.toFixed(2)}
      </div>
    </div>
  );
}

export default ExpenseCard; 