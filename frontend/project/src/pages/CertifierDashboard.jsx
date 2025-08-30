import React, { useState } from 'react';

function CertifierDashboard() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      producerName: 'Alice Johnson',
      documentType: 'Contract Agreement',
      riskScore: 'Low',
      submittedAt: '2025-01-23 10:30',
      status: 'pending',
      details: {
        documentSize: '2.4 MB',
        pages: 15,
        contentType: 'Legal Contract',
        flaggedTerms: 0
      }
    },
    {
      id: 2,
      producerName: 'Bob Smith',
      documentType: 'Financial Report',
      riskScore: 'Low',
      submittedAt: '2025-01-23 11:15',
      status: 'pending',
      details: {
        documentSize: '1.8 MB',
        pages: 8,
        contentType: 'Financial Document',
        flaggedTerms: 0
      }
    },
    {
      id: 3,
      producerName: 'Carol Wilson',
      documentType: 'Research Data',
      riskScore: 'High',
      submittedAt: '2025-01-23 09:45',
      status: 'pending',
      details: {
        documentSize: '5.2 MB',
        pages: 45,
        contentType: 'Research Document',
        flaggedTerms: 3,
        flags: ['Sensitive data detected', 'Complex terminology', 'Large document size']
      }
    },
    {
      id: 4,
      producerName: 'David Brown',
      documentType: 'Investment Proposal',
      riskScore: 'High',
      submittedAt: '2025-01-23 08:20',
      status: 'pending',
      details: {
        documentSize: '3.1 MB',
        pages: 22,
        contentType: 'Investment Document',
        flaggedTerms: 2,
        flags: ['Financial projections', 'High-value transaction']
      }
    }
  ]);

  const [expandedRequest, setExpandedRequest] = useState(null);
  const [isSigningWallet, setIsSigningWallet] = useState(false);

  const handleQuickApprove = async (requestId) => {
    setIsSigningWallet(true);
    
    // Simulate wallet signature process
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));
      setIsSigningWallet(false);
      alert('Document approved successfully! Wallet signature completed.');
    }, 1500);
  };

  const handleViewDetails = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const handleDetailedApprove = async (requestId) => {
    setIsSigningWallet(true);
    
    // Simulate wallet signature process
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));
      setExpandedRequest(null);
      setIsSigningWallet(false);
      alert('Document approved successfully! Wallet signature completed.');
    }, 1500);
  };

  const sortedRequests = [...requests].sort((a, b) => {
    const riskOrder = { 'Low': 1, 'High': 2 };
    return riskOrder[a.riskScore] - riskOrder[b.riskScore];
  });

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Certifier Dashboard</h1>
          <p>Review and approve producer certification requests</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <h3>Low Risk</h3>
            <div className="stat-number">{requests.filter(r => r.riskScore === 'Low').length}</div>
          </div>
          <div className="stat-card">
            <h3>High Risk</h3>
            <div className="stat-number">{requests.filter(r => r.riskScore === 'High').length}</div>
          </div>
        </div>

        <div className="requests-queue">
          <h2>Certification Queue</h2>
          <div className="requests-list">
            {sortedRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-info">
                    <h3>{request.producerName}</h3>
                    <p className="document-type">{request.documentType}</p>
                    <p className="submitted-time">Submitted: {request.submittedAt}</p>
                  </div>
                  <div className="request-meta">
                    <span className={`risk-badge ${request.riskScore.toLowerCase()}`}>
                      {request.riskScore} Risk
                    </span>
                    <span className={`status-badge ${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="request-actions">
                    {request.riskScore === 'Low' ? (
                      <button 
                        className="quick-approve-btn"
                        onClick={() => handleQuickApprove(request.id)}
                        disabled={isSigningWallet}
                      >
                        {isSigningWallet ? 'Signing...' : 'Quick Approve'}
                      </button>
                    ) : (
                      <button 
                        className="view-details-btn"
                        onClick={() => handleViewDetails(request.id)}
                      >
                        {expandedRequest === request.id ? 'Hide Details' : 'View Details'}
                      </button>
                    )}
                  </div>
                )}

                {expandedRequest === request.id && (
                  <div className="request-details">
                    <h4>Document Details</h4>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>Document Size:</label>
                        <span>{request.details.documentSize}</span>
                      </div>
                      <div className="detail-item">
                        <label>Pages:</label>
                        <span>{request.details.pages}</span>
                      </div>
                      <div className="detail-item">
                        <label>Content Type:</label>
                        <span>{request.details.contentType}</span>
                      </div>
                      <div className="detail-item">
                        <label>Flagged Terms:</label>
                        <span>{request.details.flaggedTerms}</span>
                      </div>
                    </div>
                    
                    {request.details.flags && (
                      <div className="flags-section">
                        <h5>Risk Factors:</h5>
                        <ul className="flags-list">
                          {request.details.flags.map((flag, index) => (
                            <li key={index} className="flag-item">{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button 
                      className="approve-btn"
                      onClick={() => handleDetailedApprove(request.id)}
                      disabled={isSigningWallet}
                    >
                      {isSigningWallet ? 'Signing Wallet...' : 'Approve Document'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertifierDashboard;