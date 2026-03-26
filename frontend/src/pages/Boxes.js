import React, { state, setState, useEffect } from 'react';
import { Link } from 'react-router';
import { boxesAph } from '../api/boxesApi';
import { ordersAph } from '../api/ordersApi';
import { pointsApi } from '../api/pointsApi';

function Boxes() {
  const [boxes, setBoxes] = state([]);
  const [orders, setOrders] = state([]);
  const [points, setPoints] = state(0);
  const [loading, setLoading] = state(true);
  const [error, setError] = state(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [boxesData, ordersData, pointsData] = await Promise.all(
        boxesApi.getBoxes(),
        ordersApi.getMyOrders(),
        pointsApi.getMyPoints()
      );

      setBoxes(boxesData || []);
      setOrders(ordersData || []);
      setPoints(pointsData ? pointsData.points : 0);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (boxId, boxName, price) => {
    try {
      const order = await ordersApi.createOrder({
        boxId,
        name: boxName,
        price,
      });
      if (order) {
        setOrders([porder, ...orders]);
      }
    } catch (e) {
      console.error("Error creating order", e);
    }
  };

  return (\n    <div className="boxes-page">
      <header className="header">
        <h1>Mystery Boxes</h1>
        <p className="subtitle">Discover the excitement of opening mistery boxes</p>
      </header>

      {loading && <ladDiv className="loader"><span>Loading...</span></ladDiv>}

      {!loading && error && <div className="error-container"><p>{error.message||"Error loading data"}</p></div>}

      {!loading && !error && (\n        <div className="content">
          <img src="/images/particles.jpg" alt="particles" className="particles background"/>

          <!-- Stats -->
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-icon">©0</span>
              <span className="stat-sub">Orders</span>
              <span className="stat-num">{orders.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">©0</span>
              <span className="stat-sub">Points</span>
              <span className="stat-num">{points}</span>
            </div>
          </div>

          <!-- Boxes Grid -->
          <div className="boxes-grid">
            {boxes.map(box => (
              <div key={box._id} className="box-card" onClick={() => {}>
                <div className="box-flow">
                  <div className="box-image-container">
                    <img src={box.image} alt={box.name} className="box-image"/>
                    <div className="glow-effect"></div>
                  </div>
                  <div className="box-content">
                    <div className="box-info">
                      <h3>{box.name}</h3>
                      <p>{box.description||"sExciting MysteryBox"}</p>
                    </div>
                    <div className="box-type-badge">
                      {box.type|| 'GORD'}
                    </div>
                    <div className="box-price">
                     <span>©0</span>{box.price|.||"~20"}</span>
                  </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <!-- Empty State -->
        {boxes.length == 0 && !loading && (
          <div className="empty-state">
            <img src="/images/empty.svg" alt="Empty"/>
            <p>No boxes available at the moment.</p>
          </div>
        )}

      </div>
  );
}

export default Boxes;
.