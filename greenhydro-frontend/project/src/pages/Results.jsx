import React, { useState } from 'react';

function Results() {
  const [producerData] = useState({
    walletAddress: '0x742d35Cc6635C0532925a3b8D32C6C85eF73292e',
    tokenBalance: 156.75,
    claimStatus: 'Approved',
    lastUpdated: '2025-01-23 14:30'
  });

  const [auditTransactions] = useState([
    {
      id: 'TX001',
      date: '2025-01-23',
      time: '14:30',
      type: 'Token Release',
      amount: 25.50,
      status: 'Completed',
      producer: 'Alice Johnson',
      certifier: '0x123...abc'
    },
    {
      id: 'TX002',
      date: '2025-01-23',
      time: '13:15',
      type: 'Token Release',
      amount: 18.25,
      status: 'Completed',
      producer: 'Bob Smith',
      certifier: '0x456...def'
    },
    {
      id: 'TX003',
      date: '2025-01-23',
      time: '11:45',
      type: 'Certification',
      amount: 0,
      status: 'Pending',
      producer: 'Carol Wilson',
      certifier: '0x789...ghi'
    },
    {
      id: 'TX004',
      date: '2025-01-22',
      time: '16:20',
      type: 'Token Release',
      amount: 32.75,
      status: 'Completed',
      producer: 'David Brown',
      certifier: '0xabc...123'
    },
    {
      id: 'TX005',
      date: '2025-01-22',
      time: '14:10',
      type: 'Token Release',
      amount: 15.80,
      status: 'Completed',
      producer: 'Eva Martinez',
      certifier: '0xdef...456'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'released': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="results-header">
          <h1>Results & Status</h1>
          <p>View your token balance and track certification status</p>
        </div>

        <div className="results-grid">
          <div className="producer-status-card">
            <h2>Producer Status</h2>
            <div className="status-details">
              <div className="status-row">
                <label>Wallet Address:</label>
                <span className="wallet-address">{producerData.walletAddress}</span>
              </div>
              <div className="status-row">
                <label>Token Balance:</label>
                <span className="token-balance">{producerData.tokenBalance} CTF</span>
              </div>
              <div className="status-row">
                <label>Claim Status:</label>
                <span className={`status-badge ${getStatusColor(producerData.claimStatus)}`}>
                  {producerData.claimStatus}
                </span>
              </div>
              <div className="status-row">
                <label>Last Updated:</label>
                <span>{producerData.lastUpdated}</span>
              </div>
            </div>
            
            <div className="token-actions">
              <button className="claim-btn">
                Claim Available Tokens
              </button>
              <button className="history-btn">
                View Transaction History
              </button>
            </div>
          </div>

          <div className="quick-stats-card">
            <h3>Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{auditTransactions.filter(t => t.status === 'Completed').length}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{auditTransactions.filter(t => t.status === 'Pending').length}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {auditTransactions
                    .filter(t => t.status === 'Completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </div>
                <div className="stat-label">Total CTF</div>
              </div>
            </div>
          </div>
        </div>

        <div className="audit-section">
          <h2>Government Audit View</h2>
          <p>Complete transaction history for regulatory compliance</p>
          
          <div className="audit-table-container">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date/Time</th>
                  <th>Type</th>
                  <th>Producer</th>
                  <th>Amount (CTF)</th>
                  <th>Status</th>
                  <th>Certifier</th>
                </tr>
              </thead>
              <tbody>
                {auditTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="tx-id">{transaction.id}</td>
                    <td>{transaction.date} {transaction.time}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.producer}</td>
                    <td className="amount">
                      {transaction.amount > 0 ? transaction.amount.toFixed(2) : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="certifier-address">{transaction.certifier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="audit-actions">
            <button className="export-btn">Export Audit Report</button>
            <button className="filter-btn">Filter Transactions</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;