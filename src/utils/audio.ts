// Web Audio API Synthesizer for educational feedback
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playBeep(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.08) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  click() {
    this.playBeep(600, 'triangle', 0.04);
  }

  selection() {
    this.playBeep(520, 'sine', 0.06);
  }

  crossover() {
    this.playBeep(780, 'sine', 0.09);
  }

  mutation() {
    this.playBeep(320, 'sawtooth', 0.12);
  }

  generation() {
    this.playBeep(880, 'sine', 0.1);
  }

  celebration() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 'triangle', 0.2);
      }, idx * 100);
    });
  }
}

export const soundFX = new SoundFX();
