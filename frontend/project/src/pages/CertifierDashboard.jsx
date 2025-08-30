import React, { useState, useEffect } from 'react';

function CertifierDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [isSigningWallet, setIsSigningWallet] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/documents');
      if (response.ok) {
        const documents = await response.json();
        setRequests(documents);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async (requestId) => {
    setIsSigningWallet(true);

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
    if (!a.riskScore && !b.riskScore) return 0;
    if (!a.riskScore) return -1;
    if (!b.riskScore) return 1;

    const aRisk = a.riskScore < 0.5 ? 'Low' : 'High';
    const bRisk = b.riskScore < 0.5 ? 'Low' : 'High';
    const riskOrder = { 'Low': 1, 'High': 2 };
    return riskOrder[aRisk] - riskOrder[bRisk];
  });

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Certifier Dashboard</h1>
          <p>Review and approve producer certification requests</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <h3>Low Risk</h3>
            <div className="stat-number">{requests.filter(r => r.riskScore && r.riskScore < 0.5).length}</div>
          </div>
          <div className="stat-card">
            <h3>High Risk</h3>
            <div className="stat-number">{requests.filter(r => r.riskScore && r.riskScore >= 0.5).length}</div>
          </div>
        </div>

        {/* Queue */}
        <div className="requests-queue">
          <h2>Certification Queue</h2>
          {loading ? (
            <div className="loading-state">
              <p>Loading documents...</p>
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="empty-state">
              <p>No documents in the queue. Documents will appear here after producers upload them.</p>
            </div>
          ) : (
            <div className="requests-list">
              {sortedRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-info">
                      <h3>{request.producerName}</h3>
                      <p className="document-type">{request.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p className="submitted-time">Submitted: {new Date(request.submittedAt).toLocaleString()}</p>
                    </div>
                    <div className="request-meta">
                      <span className={`risk-badge ${request.riskScore ? (request.riskScore < 0.5 ? 'low' : 'high') : 'pending'}`}>
                        {request.riskScore ? (request.riskScore < 0.5 ? 'Low' : 'High') : 'Pending'}
                      </span>
                      <span className={`status-badge ${request.status}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="request-actions">
                      {request.riskScore && request.riskScore < 0.5 ? (
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
                          <label>File Name:</label>
                          <span>{request.fileName}</span>
                        </div>
                        <div className="detail-item">
                          <label>File Size:</label>
                          <span>{(request.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <div className="detail-item">
                          <label>File Type:</label>
                          <span>{request.mimeType}</span>
                        </div>
                        <div className="detail-item">
                          <label>Producer Wallet:</label>
                          <span className="wallet-address">{request.producerWallet}</span>
                        </div>
                        {request.description && (
                          <div className="detail-item">
                            <label>Description:</label>
                            <span>{request.description}</span>
                          </div>
                        )}
                      </div>

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
          )}
        </div>
      </div>
    </div>
  );
}

export default CertifierDashboard;
