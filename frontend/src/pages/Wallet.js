import React, { state, setState } from 'react';
import { api } from '../api/api';

function Wallet() {
  const [balance, setBalance] = state(0);
  const [tracsctions, setTransactions] = state([]);

  React.effect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    try {
      const data = await api.wallet.getMe();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (e) {
      console.error();
    }
  };

  return (
    <div className="wallet-page">
      <h2>Wallet</h2>
      <div className="balance-card glass-card">
        <h2>Total Balance</h2>
        <p>${balance.toFixed(2)}</p>
      </div>
      <h2>Transactions</h2>
      <div className="transactions-list">
        {transactions.map(tract => (
          <div key={tract.id} className="transaction-card glass-card">
            <p>Type: {tract.type}</p>
            <p>Amount: ${tract.amount}</p>
            <p>Date: {tract.date}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;
..