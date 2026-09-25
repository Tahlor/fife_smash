import { ControllerInput } from '../types/input';

export class VirtualCursor {
  private p1El: HTMLElement | null = null;
  private p2El: HTMLElement | null = null;

  public p1X: number = window.innerWidth * 0.4;
  public p1Y: number = window.innerHeight * 0.4;
  public p2X: number = window.innerWidth * 0.6;
  public p2Y: number = window.innerHeight * 0.4;

  public mouseControlled: boolean = true;
  private isBrawlActive: boolean = false;
  private lastClickTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', (e) => {
        if (this.mouseControlled && !this.isBrawlActive) {
          this.p1X = e.clientX;
          this.p1Y = e.clientY;
          this.render();
        }
      });

      window.addEventListener('mousedown', () => {
        if (!this.isBrawlActive) {
          this.triggerClick(this.p1X, this.p1Y);
        }
      });
    }
  }

  public initElements(p1Element: HTMLElement | null, p2Element: HTMLElement | null): void {
    this.p1El = p1Element;
    this.p2El = p2Element;
    this.render();
  }

  public setBrawlActive(active: boolean): void {
    this.isBrawlActive = active;
    if (this.p1El) {
      this.p1El.style.display = active ? 'none' : 'flex';
    }
    if (this.p2El) {
      this.p2El.style.display = 'none';
    }
  }

  public update(p1Input: ControllerInput): void {
    if (this.isBrawlActive) return;

    // If controller stick moves, switch to controller-driven cursor
    if (Math.abs(p1Input.neutralX) > 0.15 || Math.abs(p1Input.neutralY) > 0.15) {
      this.mouseControlled = false;
      this.p1X = Math.max(10, Math.min(window.innerWidth - 10, this.p1X + p1Input.neutralX * 14));
      this.p1Y = Math.max(10, Math.min(window.innerHeight - 10, this.p1Y + p1Input.neutralY * 14));
    }

    if (p1Input.jab || p1Input.jump || p1Input.special) {
      const now = performance.now();
      // Debounce virtual click
      if (now - this.lastClickTime > 200) {
        this.lastClickTime = now;
        this.triggerClick(this.p1X, this.p1Y);
      }
    }

    this.render();
  }

  private render(): void {
    if (this.p1El && !this.isBrawlActive) {
      this.p1El.style.transform = `translate3d(${this.p1X}px, ${this.p1Y}px, 0)`;
    }
  }

  public triggerClick(x: number, y: number): void {
    if (this.isBrawlActive) return;
    const target = document.elementFromPoint(x, y);
    if (!target) return;

    const interactive = target.closest<HTMLElement>(
      'button, .fighter-tile, .stage-card, .slot-card, .slot-mode-btn, input, label'
    );

    if (interactive) {
      interactive.click();
      interactive.classList.add('scale-95', 'bg-yellow-500/30');
      setTimeout(() => {
        interactive.classList.remove('scale-95', 'bg-yellow-500/30');
      }, 150);
    }
  }
}
