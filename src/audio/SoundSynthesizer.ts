export class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public initialized: boolean = false;
  public masterGain: GainNode | null = null;
  private volume: number = 0.8;

  public init(): void {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch {
      // AudioContext unavailable or restricted by browser policy
    }
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public beep(freq = 440, type: OscillatorType = 'sine', duration = 0.1, gainVal = 0.1): void {
    if (!this.initialized || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio node failure graceful fallback
    }
  }

  public playJump(): void {
    this.beep(330, 'sine', 0.14, 0.12);
  }

  public playAttack(): void {
    this.beep(190, 'triangle', 0.1, 0.15);
  }

  public playSmash(): void {
    this.beep(90, 'sawtooth', 0.28, 0.22);
    this.beep(240, 'square', 0.2, 0.15);
  }

  public playHit(strong: boolean = false): void {
    if (strong) {
      this.beep(65, 'square', 0.35, 0.3);
      this.beep(125, 'sawtooth', 0.25, 0.2);
    } else {
      this.beep(150, 'triangle', 0.12, 0.15);
    }
  }

  public playShield(): void {
    this.beep(540, 'sine', 0.08, 0.08);
  }

  public playSpecial(): void {
    this.beep(430, 'sawtooth', 0.2, 0.12);
    this.beep(650, 'sine', 0.25, 0.1);
  }

  public playBlast(): void {
    this.beep(45, 'square', 0.65, 0.45);
    this.beep(85, 'sawtooth', 0.5, 0.3);
  }

  public playSelect(): void {
    this.beep(580, 'triangle', 0.08, 0.1);
  }

  public playStart(): void {
    this.beep(440, 'sine', 0.15, 0.15);
    setTimeout(() => this.beep(660, 'sine', 0.25, 0.2), 120);
  }
}
