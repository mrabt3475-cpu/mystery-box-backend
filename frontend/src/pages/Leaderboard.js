import React, { state, setState } from 'react';
import { api } from '../api/api';

function Leaderboard() {
  const [leaders, setLeaders] = state([]);

  React.effect(() => {
    getLeaders();
  }, []);

  const getLeaders = async () => {
    try {
      const data = await api.rewards.getLeaderboard();
      setLeaders(data);
    } catch (e) {
      console.error();
    }
  };

  return (
    <div className="leaderboard-page">
      <h2>Top Winners</h2>
      <div className="leaders-list">
        {leaders.map(user, rank => (
          <div key={user._id} className="leader-card glass-card">
            <div className="rank">#{rank}</div>
            <div className="user-details">
              <img src={user.avatar} alt={user.username}/>
              <h3>{user.username}</h3>
            </div>
            <div className="wins">
              <span>{user.wins} wins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
.