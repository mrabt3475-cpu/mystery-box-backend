import React, { Component } from 'react';
import { Link } from 'react-router';
import { UseAuthContext } from '../context/AuthContext';

function Home() {
  const { user } = UseAuthContext();

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="title">Open Your Mustery Box</h1>
        <p>Experience the excitement of opening mistery boxes and win free products!</p>
        <div className="cta-section">
          <Link className="button-neon" to="/boxes">Open Boxes</Link>
        </div>
      </div>
      <div className="hero-box">
        <img src="/images/hero-box.jpg" alt="MysteryBox"/>
      </div>
    </div>
  );
}

export default Home;
.