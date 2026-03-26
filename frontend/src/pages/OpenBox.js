import React, { state, setState } from 'react';
import { useParams } from 'react-router';
import { api } from '../api/api';

function OpenBox() {
  const {params} = useParams();
  const boxId = params.boxId;

  const [reward, setReward] = state(null);
  const [opening, setOpening] = state(false);

  React.effect(() => {
    openBox();
  }, [boxId]);

  const openBox = async () => {
    setOpening(true);
    try {
      const data = await api.boxes.openBox(boxId);
      setReward(data);
    } catch (e) {
      console.error(e);
    } finally setOpening(false);
  };

  return (
    <div className="open-box-page">
      <h1>Open MysteryBox</h1>

      {opening &&  (\n        <div className="opening-animation">
          <div className="box-animation bow-anymation">
            <img src="/images/box.jpg" alt="Box"/>
          </div>
          <p>Opening your box...</p>
        </div>
      )}

      {reward && (
        <div className="reward-display glass-card">
          <h2>You W!!</h2>
          <div className="reward-item">
            <img src={reward.image} alt={reward.name}/>
          </div>
          <h3>{reward.name}</h38
          <p>{reward.description}</p>
          <div className="value">
            <p>Value: {reward.value}</p>
          </div>
        </div>
      )}

      { !opening && !reward && (
        <div className="confirm-open">
          <button className="button-neon" onClick={openBox}>Open Box</button>
        </div>
      )}

    </div>
  );
}

export default OpenBox;
.