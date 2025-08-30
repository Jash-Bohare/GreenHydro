import React from 'react';

function Home() {
  const features = [
    {
      icon: '🔒',
      title: 'Secure Document Processing',
      description: 'Upload and process documents with blockchain-based verification and security.'
    },
    {
      icon: '⚡',
      title: 'Fast Certification',
      description: 'Automated risk assessment and quick approval process for low-risk documents.'
    },
    {
      icon: '📈',
      title: 'Transparent Tracking',
      description: 'Real-time status updates and complete audit trail for all transactions.'
    },
    {
      icon: '🏛️',
      title: 'Government Compliance',
      description: 'Full regulatory compliance with government audit capabilities and reporting.'
    }
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="hero-section">
          <h1>Welcome to CertifyChain</h1>
          <p className="hero-subtitle">
            A blockchain-powered document certification platform that streamlines 
            the verification process while maintaining security and transparency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="instructions-section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Upload Document</h4>
                <p>Submit your PDF or text document for processing and verification.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Automated Review</h4>
                <p>Our system assesses risk level and routes to appropriate certification workflow.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Certification</h4>
                <p>Certifiers review and approve requests through secure blockchain signatures.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Token Release</h4>
                <p>Approved documents receive tokens that can be tracked and audited.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS for features grid */}
      <style jsx>{`
        .features-grid {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 40px;
        }

        .feature-card {
          flex: 1 1 22%;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
}

export default Home;
