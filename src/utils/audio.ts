// Web Audio API Synthesizer for Pitch / Referee Whistle and Timer Cues
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Realistic whistle sound with trill/flutter
  playWhistle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Dual frequencies typical of a sports pea whistle (e.g., Fox 40: ~2.5kHz and ~2.8kHz with beat frequency)
      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(2600, now);
      osc2.frequency.setValueAtTime(2950, now);

      // Add a slight frequency modulation for the "trill"
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(35, now); // 35Hz modulation (flutter)
      lfoGain.gain.setValueAtTime(60, now);
      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      // Envelope: blast, short break, second blast
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.35);
      gain.gain.linearRampToValueAtTime(0, now + 0.42);

      // Second blast
      gain.gain.setValueAtTime(0, now + 0.48);
      gain.gain.linearRampToValueAtTime(0.55, now + 0.52);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.95);
      gain.gain.linearRampToValueAtTime(0, now + 1.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);

      lfo.stop(now + 1.15);
      osc1.stop(now + 1.15);
      osc2.stop(now + 1.15);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  // Warning tick/beep (e.g. 3, 2, 1)
  playBeep(isFinal: boolean = false) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFinal ? 880 : 520, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + (isFinal ? 0.3 : 0.12));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + (isFinal ? 0.3 : 0.12));
    } catch {
      // ignore
    }
  }

  // Success chime when "Subs Done" is pressed
  playSubsDoneChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Vibrate mobile device if supported
  vibrate(pattern: number | number[] = [200, 100, 300]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }
}

export const sounds = new SoundController();
