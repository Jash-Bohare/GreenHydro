import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import DocumentUpload from './pages/DocumentUpload';
import CertifierDashboard from './pages/CertifierDashboard';
import Results from './pages/Results';
import Introduction from './pages/Introduction';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
                  <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/dashboard" element={<CertifierDashboard />} />
          <Route path="/results" element={<Results />} />
        </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;