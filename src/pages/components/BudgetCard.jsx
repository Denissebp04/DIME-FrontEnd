import React from 'react';
import { PiggyBank } from 'lucide-react';

// This component shows the monthly budget card
function BudgetCard({ budget, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {/* Card header with icon and title */}
      <div className="card-header">
        <div className="icon-wrapper blue">
          <PiggyBank size={24} />
        </div>
        <h2 className="card-title">Monthly Budget</h2>
      </div>

      {/* Show the total budget amount */}
      <div className="card-amount">
        {budget.toFixed(2)}
      </div>
    </div>
  );
}

export default BudgetCard; 