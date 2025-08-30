import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '' },
    { path: '/introduction', label: 'Register', icon: '' },
    { path: '/upload', label: 'Upload Document', icon: '' },
    { path: '/dashboard', label: 'Certifier Dashboard', icon: '' },
    { path: '/results', label: 'Results', icon: '' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>GreenHydro</h2>
        </div>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;