import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navigation() {
  const location = useLocation();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const type = localStorage.getItem('userType');
    setUserType(type);
  }, [location]);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h2 className="nav-logo">Green H₂ DApp</h2>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Register
          </Link>
          {userType === 'admin' && (
            <Link 
              to="/certifier" 
              className={location.pathname === '/certifier' ? 'nav-link active' : 'nav-link'}
            >
              Certifier Dashboard
            </Link>
          )}
          <Link 
            to="/final" 
            className={location.pathname === '/final' ? 'nav-link active' : 'nav-link'}
          >
            {userType === 'admin' ? 'Audit Dashboard' : 'My Status'}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;