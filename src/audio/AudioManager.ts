import { SoundSynthesizer } from './SoundSynthesizer';

export class AudioManager {
  private synth: SoundSynthesizer;
  private isMuted: boolean = false;

  constructor() {
    this.synth = new SoundSynthesizer();

    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.synth.init();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };

      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  }

  public setVolume(val: number): void {
    if (!this.isMuted) {
      this.synth.setVolume(val);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.synth.setVolume(this.isMuted ? 0 : 0.8);
    return this.isMuted;
  }

  public play(sfxName: string): void {
    if (this.isMuted) return;
    if (!this.synth.initialized) {
      this.synth.init();
    }

    switch (sfxName) {
      case 'jump':
        this.synth.playJump();
        break;
      case 'attack':
        this.synth.playAttack();
        break;
      case 'smash':
        this.synth.playSmash();
        break;
      case 'hit_light':
        this.synth.playHit(false);
        break;
      case 'hit_heavy':
        this.synth.playHit(true);
        break;
      case 'shield':
        this.synth.playShield();
        break;
      case 'special':
        this.synth.playSpecial();
        break;
      case 'blast':
        this.synth.playBlast();
        break;
      case 'select':
        this.synth.playSelect();
        break;
      case 'start':
        this.synth.playStart();
        break;
      default:
        break;
    }
  }
}
