import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎁</span>
          <span className="logo-text">PuzzleChain</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/boxes" className="nav-link">Boxes</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/wallet" className="nav-link">
                <span className="wallet-icon">💰</span>
                ${user.wallet?.balance || 0}
              </Link>
              <div className="nav-user">
                <img 
                  src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name} 
                  alt={user.name} 
                  className="user-avatar"
                />
                <span className="user-name">{user.name}</span>
                <div className="user-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/wallet">Wallet</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
