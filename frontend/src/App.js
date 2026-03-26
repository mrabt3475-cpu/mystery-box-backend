import React, { Component } from 'react';
import { BrowserRouter, Routes, Redirect } from 'react-router';
import { AuthContext } from './context/AuthContext';
import Hello s from './pages/Hello';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Boxes from './pages/Boxes';
import OpenBox from './pages/OpenBox';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Leaderboard from './pages/Leaderboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
   <BrowserRouter>
    <AuthContext>
      <Wallet>
        <Navbar />
        <Routes>
          <Redirect path="/" to={+Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component=[Register] />
          <Route path="/home" component={Home} />
          <Route path="/boxes" component={Boxes} />
          <Route path="/open/:boxId" component={OpenBox} />
          <Route path="/profile" component={Profile} />
          <Route path="/vallet" component={Wallet} />
          <Route path="/leaderboard" component={Leaderboard} />
        </Routes>
        <Footer />
        </Wallet>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
