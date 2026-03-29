// 🎵 Audio Service for PuzzleChain - Background Music & Sound Effects

class AudioService {
  constructor() {
    this.backgroundMusic = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentTrack = 0;
    
    // Gaming music tracks - Add your own MP3 files in public/audio/
    // Default tracks (royalty-free from Pixabay)
    this.tracks = [
      'https://cdn.pixabay.com/audio/2024/11/04/audio_9d2e7a1f15.mp3', // Epic Adventure
      'https://cdn.pixabay.com/audio/2022/10/25/audio_946c3e0e4b.mp3', // Gaming vibe
      'https://cdn.pixabay.com/audio/2024/02/14/audio_80e32e1c21.mp3', // Action beats
    ];
    
    // Pirate/Jolly Roger theme track - Add your own file
    this.pirateTrack = '/audio/pirate-theme.mp3'; // User can add their own file
    
    // Sound effects URLs
    this.sounds = {
      'open-box': 'https://cdn.pixabay.com/audio/2022/03/10/audio_c6ccdc7b2f.mp3',
      'win': 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
      'click': 'https://cdn.pixabay.com/audio/2022/03/24/audio_6e40e0c9b0.mp3',
      'error': 'https://cdn.pixabay.com/audio/2021/08/09/audio_0c6c0b0c4e.mp3',
      'success': 'https://cdn.pixabay.com/audio/2022/03/24/audio_c5f7f52bf6.mp3',
      'coin': 'https://cdn.pixabay.com/audio/2022/01/26/audio_6d4e5007d2.mp3',
      'magic': 'https://cdn.pixabay.com/audio/2022/02/07/audio_0e2a2f9d4c.mp3',
    };
    
    // Volume presets
    this.presets = {
      low: 0.3,
      medium: 0.5,
      high: 0.8
    };
  }

  init() {
    this.backgroundMusic = new Audio();
    this.backgroundMusic.loop = true; // Loop background music
    this.backgroundMusic.volume = this.volume;
    this.loadTrack(this.currentTrack);
    
    // Auto-advance tracks
    this.backgroundMusic.addEventListener('ended', () => this.nextTrack());
    
    // Save volume preference
    this.backgroundMusic.addEventListener('volumechange', () => {
      localStorage.setItem('puzzlechain_volume', this.volume);
    });
    
    console.log('🎵 Audio Service initialized');
    this.loadSettings();
  }

  loadTrack(index) {
    if (this.backgroundMusic && this.tracks[index]) {
      this.backgroundMusic.src = this.tracks[index];
      this.backgroundMusic.load();
    }
  }

  // Load custom pirate track
  loadPirateTrack(customUrl = null) {
    if (customUrl) {
      this.pirateTrack = customUrl;
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.src = this.pirateTrack;
      this.backgroundMusic.load();
    }
  }

  async play() {
    if (!this.backgroundMusic) this.init();
    try {
      await this.backgroundMusic.play();
      this.isPlaying = true;
      console.log('🎵 Music started');
    } catch (error) {
      console.log('🎵 Autoplay blocked - user interaction needed');
    }
  }

  pause() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.isPlaying = false;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  nextTrack() {
    this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
    this.loadTrack(this.currentTrack);
    if (this.isPlaying) this.play();
  }

  previousTrack() {
    this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(this.currentTrack);
    if (this.isPlaying) this.play();
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
    localStorage.setItem('puzzlechain_volume', this.volume);
  }

  setPreset(presetName) {
    if (this.presets[presetName] !== undefined) {
      this.setVolume(this.presets[presetName]);
    }
  }

  mute() {
    this.isMuted = true;
    if (this.backgroundMusic) this.backgroundMusic.volume = 0;
    localStorage.setItem('puzzlechain_muted', 'true');
  }

  unmute() {
    this.isMuted = false;
    if (this.backgroundMusic) this.backgroundMusic.volume = this.volume;
    localStorage.setItem('puzzlechain_muted', 'false');
  }

  toggleMute() {
    if (this.isMuted) this.unmute();
    else this.mute();
    return this.isMuted;
  }

  playSound(name) {
    if (this.sounds[name] && !this.isMuted) {
      const audio = new Audio(this.sounds[name]);
      audio.volume = this.volume;
      audio.play().catch(() => {});
    }
  }

  playCustomSound(url) {
    if (url && !this.isMuted) {
      const audio = new Audio(url);
      audio.volume = this.volume;
      audio.play().catch(() => {});
    }
  }

  loadSettings() {
    const savedVolume = localStorage.getItem('puzzlechain_volume');
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
      if (this.backgroundMusic) this.backgroundMusic.volume = this.volume;
    }
    if (localStorage.getItem('puzzlechain_muted') === 'true') {
      this.mute();
    }
  }

  // Get current track info
  getCurrentTrack() {
    return {
      index: this.currentTrack,
      total: this.tracks.length,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume
    };
  }
}

// Export for global use
window.AudioService = AudioService;
window.audioService = null;
