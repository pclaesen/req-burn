// src/components/transactions/TransactionList.js
'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function TransactionList({ address, contractName }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDrained, setTotalDrained] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [address]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/transactions/${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalDrained(data.totalDrained);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const truncateAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getExplorerUrl = (hash) => {
    return `https://gnosisscan.io/tx/${hash}`;
  };

  if (loading) {
    return (
      <div className="transaction-list">
        <div className="transaction-header">
          <h3>Recent Transactions</h3>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list">
        <div className="transaction-header">
          <h3>Recent Transactions</h3>
          <button onClick={fetchTransactions} className="retry-btn">
            Retry
          </button>
        </div>
        <div className="error-message">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-header">
        <div>
          <h3>Recent Transactions - {contractName}</h3>
          <p className="transaction-subtitle">
            Total xDAI Drained: <span className="drained-amount">{totalDrained.toFixed(4)} xDAI</span>
          </p>
        </div>
        <button onClick={fetchTransactions} className="refresh-btn">
          Refresh
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="no-transactions">
          No recent transactions found
        </div>
      ) : (
        <div className="transaction-items">
          {transactions.map((tx, index) => (
            <div key={tx.hash} className={`transaction-item ${tx.type}`}>
              <div className="transaction-icon">
                {tx.type === 'outgoing' ? (
                  <ArrowUpRight className="icon outgoing" />
                ) : (
                  <ArrowDownLeft className="icon incoming" />
                )}
              </div>
              
              <div className="transaction-details">
                <div className="transaction-main">
                  <div className="transaction-hash">
                    <code>{truncateHash(tx.hash)}</code>
                    <a 
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="transaction-status">
                    {tx.status === 'success' ? (
                      <CheckCircle className="status-icon success" size={14} />
                    ) : (
                      <XCircle className="status-icon failed" size={14} />
                    )}
                    <span className={`status-text ${tx.status}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
                
                <div className="transaction-meta">
                  <div className="transaction-addresses">
                    <span className="address-label">From:</span>
                    <code className="address">{truncateAddress(tx.from)}</code>
                    <span className="address-separator">→</span>
                    <span className="address-label">To:</span>
                    <code className="address">{truncateAddress(tx.to)}</code>
                  </div>
                  <div className="transaction-time">
                    <Clock size={12} />
                    {formatTimestamp(tx.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="transaction-value">
                <div className={`value-amount ${tx.type}`}>
                  {tx.type === 'outgoing' ? '-' : '+'}{parseFloat(tx.value).toFixed(4)} xDAI
                </div>
                <div className="gas-info">
                  Gas: {parseFloat(tx.gasPrice).toFixed(2)} Gwei
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}