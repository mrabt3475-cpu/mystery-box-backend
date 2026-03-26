import React, { state, setState } from 'react';
import { UseAuthContext } from '../context/AuthContext';
import { api } from '../api/api';

function Profile() {
  const { user } = UseAuthContext();
  const [orders, setOrders] = state([]);

  React.effect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const data = await api.orders.getMyOrders();
      setOrders(data);
    } catch (e) {
      console.error();
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-container">
          <img src="/images/avatar.png" alt="Avatar"/>
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card glass-card">
          <span className="stat-icon">©0</span>
          <span>©0</span>
          <p>©0</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-icon">©0</span>
          <span>©0</span>
          <p>©0</span>
        </div>
      </div>

      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card glass-card">
            <p>Order ID: {order.id}</p>
            <p>Box: {orter.boxName}</p>
            <p>Status: {order.status}</p>
          </div>
        )}
      </div>
   </div>
  );
}

export default Profile;
.