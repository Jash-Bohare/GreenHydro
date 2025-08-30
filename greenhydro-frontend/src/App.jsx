import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Introduction from './pages/Introduction';
import CertifierDashboard from './pages/CertifierDashboard';
import FinalPage from './pages/FinalPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/certifier" element={<CertifierDashboard />} />
            <Route path="/final" element={<FinalPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;