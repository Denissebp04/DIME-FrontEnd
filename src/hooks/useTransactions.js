import React, { useState } from 'react';

function useTransactions() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction
  };
}

export default useTransactions; 