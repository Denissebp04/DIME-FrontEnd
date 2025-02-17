// Separate component for transaction cards
function TransactionCard({ transaction }) {
  return (
    <div className="transaction-item">
      <div className="transaction-left">
        <div className="transaction-icon">
          {transaction.amount > 0 ? <DollarSign /> : <ShoppingBag />}
        </div>
        <div className="transaction-info">
          <div className="transaction-name">{transaction.name}</div>
          <div className="transaction-date">{transaction.date}</div>
        </div>
      </div>
      <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
        {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
} 