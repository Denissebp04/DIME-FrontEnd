import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// This component shows the income card
function IncomeCard({ income, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {/* Card header with icon and title */}
      <div className="card-header">
        <div className="icon-wrapper green">
          <ArrowUpRight size={24} />
        </div>
        <h2 className="card-title">Income</h2>
      </div>

      {/* Show the total income amount */}
      <div className="card-amount income">
        {income.toFixed(2)}
      </div>
    </div>
  );
}

export default IncomeCard; 