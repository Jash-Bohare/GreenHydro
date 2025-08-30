import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockRequests = [
  {
    id: 1,
    fullName: 'John Smith',
    walletAddress: '0x742d35Cc6F4B2c8C0DbD9BaA6b8C8F2D2E8B3A5F',
    plantCapacity: 15.5,
    riskScore: 'low',
    status: 'pending'
  },
  {
    id: 2,
    fullName: 'Sarah Johnson',
    walletAddress: '0x123abc456def789ghi012jkl345mno678pqr901st',
    plantCapacity: 8.2,
    riskScore: 'low',
    status: 'pending'
  },
  {
    id: 3,
    fullName: 'Michael Chen',
    walletAddress: '0x987zyx654wvu321tsr098poi765lkj432ihg109fe',
    plantCapacity: 25.8,
    riskScore: 'high',
    status: 'pending'
  },
  {
    id: 4,
    fullName: 'Emily Rodriguez',
    walletAddress: '0xabc123def456ghi789jkl012mno345pqr678stu901',
    plantCapacity: 12.1,
    riskScore: 'high',
    status: 'pending'
  }
];

function CertifierDashboard() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  // Check if user is admin
  const userType = localStorage.getItem('userType');
  
  if (userType !== 'admin') {
    return (
      <div className="page">
        <div className="container">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>This page is only accessible to admin users.</p>
            <button onClick={() => navigate('/')} className="back-btn">
              Go Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleQuickApprove = async (requestId) => {
    try {
      // Simulate wallet signature
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved' }
            : req
        )
      );
      
      alert('Request approved successfully!');
    } catch (error) {
      alert('Approval failed. Please try again.');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleDetailedApprove = async (requestId) => {
    try {
      // Simulate wallet signature
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved' }
            : req
        )
      );
      
      setSelectedRequest(null);
      alert('Request approved successfully!');
    } catch (error) {
      alert('Approval failed. Please try again.');
    }
  };

  const sortedRequests = requests.sort((a, b) => {
    if (a.riskScore === 'low' && b.riskScore === 'high') return -1;
    if (a.riskScore === 'high' && b.riskScore === 'low') return 1;
    return 0;
  });

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Certifier Dashboard</h1>
        <p className="page-subtitle">Review and approve producer registration requests</p>
        
        <div className="dashboard-content">
          <div className="requests-queue">
            <h2>Producer Requests Queue</h2>
            <div className="requests-list">
              {sortedRequests.map(request => (
                <div key={request.id} className={`request-card ${request.riskScore}-risk`}>
                  <div className="request-header">
                    <h3>{request.fullName}</h3>
                    <span className={`risk-badge ${request.riskScore}`}>
                      {request.riskScore.toUpperCase()} RISK
                    </span>
                    <span className={`status-badge ${request.status}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="request-info">
                    <p><strong>Plant Capacity:</strong> {request.plantCapacity} MW</p>
                    <p><strong>Wallet:</strong> {request.walletAddress.slice(0, 10)}...</p>
                  </div>
                  
                  <div className="request-actions">
                    {request.status === 'pending' && (
                      <>
                        {request.riskScore === 'low' ? (
                          <button 
                            onClick={() => handleQuickApprove(request.id)}
                            className="approve-btn quick"
                          >
                            Quick Approve
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleViewDetails(request)}
                              className="view-details-btn"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => handleDetailedApprove(request.id)}
                              className="approve-btn"
                            >
                              Approve
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedRequest && (
            <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Request Details</h3>
                <div className="details-grid">
                  <div><strong>Full Name:</strong> {selectedRequest.fullName}</div>
                  <div><strong>Wallet Address:</strong> {selectedRequest.walletAddress}</div>
                  <div><strong>Plant Capacity:</strong> {selectedRequest.plantCapacity} MW</div>
                  <div><strong>Risk Score:</strong> {selectedRequest.riskScore}</div>
                  <div><strong>Status:</strong> {selectedRequest.status}</div>
                </div>
                <div className="modal-actions">
                  <button 
                    onClick={() => handleDetailedApprove(selectedRequest.id)}
                    className="approve-btn"
                  >
                    Approve Request
                  </button>
                  <button 
                    onClick={() => setSelectedRequest(null)}
                    className="cancel-btn"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertifierDashboard;