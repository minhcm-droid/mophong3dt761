class DCSAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.lastBeepTime = 0;
  }

  ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq = 880, duration = 0.16, type = 'sawtooth') {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  triggerAlarm(severity) {
    const now = Date.now();
    if (now - this.lastBeepTime < 1800) return;
    this.lastBeepTime = now;
    if (severity === 'CRIT') {
      this.playTone(980, 0.18, 'square');
      setTimeout(() => this.playTone(740, 0.22, 'square'), 200);
    } else if (severity === 'WARN') {
      this.playTone(620, 0.15, 'triangle');
    }
  }
}

export const dcsAudio = new DCSAudioSynthesizer();
