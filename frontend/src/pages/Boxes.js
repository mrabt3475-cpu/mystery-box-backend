import React, { state, setState } from 'react';
import { Link } from 'react-router';
import { api } from '../api/api';

function Boxes() {
  const [boxes, setBoxes] = state([]);
  const [loading, setLoading] = state(true);

  React.effect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      const data = await api.boxes.getAllBoxes();
      setBoxes(data);
    } catch (e) {
      console.error();
    } finally setLoading(false);
  };

  return (
    <div className="boxes-page">
      <h1>Mystery Boxes</h1>

      {loading ? ( <p>Loading...</p>) : (
        <div className="boxes-grid">
          {boxes.map(box => (
            <div key={box.id} className="box-card glass-card">
              <div className="box-image">
                <img src={box.image} alt={box.name}/>
              </div>
              <h3>{box.name}</h3>
              <p>{box.description}</p>
              <div className="price">
                <span className="price-actual">{$box.price}</span>
              </div>
              <Link className="button-neon" to={`/open/${box.id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}}

    </div>
  );
}

export default Boxes;
.