import React, { useState, useEffect } from 'react';
import './MusicControl.css';

const MusicControl = ({ audioService }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (audioService) {
      audioService.init();
      audioService.loadSettings();
      setVolume(audioService.volume);
      setIsMuted(audioService.isMuted);
    }
  }, [audioService]);

  const handleToggle = async () => {
    if (!audioService) return;
    const playing = await audioService.toggle();
    setIsPlaying(playing);
  };

  const handleMuteToggle = () => {
    if (!audioService) return;
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e) => {
    if (!audioService) return;
    const newVolume = parseFloat(e.target.value);
    audioService.setVolume(newVolume);
    setVolume(newVolume);
  };

  return (
    <div className="music-widget">
      <button 
        className={`music-toggle-btn ${isPlaying ? 'playing' : ''}`}
        onClick={handleToggle}
        title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {isPlaying ? <span className="music-icon">🎵</span> : <span className="music-icon">🔇</span>}
      </button>
      <button className="music-settings-btn" onClick={() => setShowPanel(!showPanel)}>⚙️</button>
      {showPanel && (
        <div className="music-panel">
          <h4>🎵 إعدادات الموسيقى</h4>
          <div className="music-control-row">
            <button className="music-btn" onClick={handleToggle}>
              {isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل'}
            </button>
          </div>
          <div className="music-control-row">
            <button className="music-btn" onClick={handleMuteToggle}>
              {isMuted ? '🔇 كتم' : '🔊 صوت'}
            </button>
          </div>
          <div className="volume-control">
            <span>🔊</span>
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="volume-slider" />
            <span>🔈</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicControl;
