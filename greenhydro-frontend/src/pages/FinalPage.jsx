import { useState, useEffect } from 'react';

const mockTransactions = [
  {
    id: 'TX001',
    producer: 'John Smith',
    amount: '15,000 USDC',
    status: 'Released',
    date: '2024-01-15',
    capacity: '15.5 MW'
  },
  {
    id: 'TX002',
    producer: 'Sarah Johnson',
    amount: '8,200 USDC',
    status: 'Approved',
    date: '2024-01-14',
    capacity: '8.2 MW'
  },
  {
    id: 'TX003',
    producer: 'Michael Chen',
    amount: '25,800 USDC',
    status: 'Pending',
    date: '2024-01-13',
    capacity: '25.8 MW'
  },
  {
    id: 'TX004',
    producer: 'Emily Rodriguez',
    amount: '12,100 USDC',
    status: 'Released',
    date: '2024-01-12',
    capacity: '12.1 MW'
  },
  {
    id: 'TX005',
    producer: 'David Park',
    amount: '18,500 USDC',
    status: 'Released',
    date: '2024-01-11',
    capacity: '18.5 MW'
  }
];

function FinalPage() {
  const [userBalance, setUserBalance] = useState('0');
  const [claimStatus, setClaimStatus] = useState('Pending');
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // Load registration data
    const data = localStorage.getItem('registrationData');
    if (data) {
      const parsed = JSON.parse(data);
      setRegistrationData(parsed);
      
      // Calculate mock balance based on plant capacity
      const balance = (parseFloat(parsed.plantCapacity) * 1000).toFixed(0);
      setUserBalance(balance);
      
      // Simulate random claim status
      const statuses = ['Pending', 'Approved', 'Released'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setClaimStatus(randomStatus);
    }
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Status & Audit Dashboard</h1>
        
        <div className="dashboard-grid">
          {/* Producer Status Card */}
          <div className="status-card">
            <h2>Your Status</h2>
            {registrationData ? (
              <div className="status-info">
                <div className="status-item">
                  <label>Producer Name:</label>
                  <span>{registrationData.fullName}</span>
                </div>
                <div className="status-item">
                  <label>Plant Capacity:</label>
                  <span>{registrationData.plantCapacity} MW</span>
                </div>
                <div className="status-item">
                  <label>Token Balance:</label>
                  <span className="balance">{userBalance} USDC</span>
                </div>
                <div className="status-item">
                  <label>Claim Status:</label>
                  <span className={`status-badge ${claimStatus.toLowerCase()}`}>
                    {claimStatus}
                  </span>
                </div>
              </div>
            ) : (
              <p className="no-data">No registration data found. Please register first.</p>
            )}
          </div>
          
          {/* Government Audit View */}
          <div className="audit-card">
            <h2>Government Audit View</h2>
            <div className="transactions-table">
              <div className="table-header">
                <span>Transaction ID</span>
                <span>Producer</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              <div className="table-body">
                {mockTransactions.map(tx => (
                  <div key={tx.id} className="table-row">
                    <span className="tx-id">{tx.id}</span>
                    <span>{tx.producer}</span>
                    <span className="amount">{tx.amount}</span>
                    <span className={`status-badge ${tx.status.toLowerCase()}`}>
                      {tx.status}
                    </span>
                    <span>{tx.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalPage;