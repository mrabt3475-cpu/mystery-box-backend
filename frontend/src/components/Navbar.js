import React from 'react';
import { Link } from 'react-router';
import { Link } from 'react-dom';

function Navbar() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.load('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="logo" to="/home">
          <img src="/logo.png" alt="MysteryBox"/>
        </Link>
        <div className="nav-menu">
          <Link to="/home">Home</Link>
          <Link to="/boxes">Boxes</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/wallet">Wallet</Link>
          <Link to="/profile">Profile</Link>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>>
  );
}

export default Navbar;
.