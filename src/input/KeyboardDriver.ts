import { ControllerInput } from '../types/input';

export class KeyboardDriver {
  private activeKeys: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        // Prevent default for common game keys if not inside input field
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
        this.activeKeys.add(e.code);
      });

      window.addEventListener('keyup', (e) => {
        this.activeKeys.delete(e.code);
      });

      // Clear all keys when window loses focus to avoid stuck keys
      window.addEventListener('blur', () => {
        this.activeKeys.clear();
      });
    }
  }

  public isPressed(code: string): boolean {
    return this.activeKeys.has(code);
  }

  public pollPlayer(playerIndex: 1 | 2): ControllerInput {
    let neutralX = 0;
    let neutralY = 0;
    let jump = false;
    let jab = false;
    let smash = false;
    let special = false;
    let shield = false;

    if (playerIndex === 1) {
      // Player 1: WASD / Space / Z,X,C / J,K,L / ShiftLeft
      if (this.isPressed('KeyA')) neutralX -= 1;
      if (this.isPressed('KeyD')) neutralX += 1;
      if (this.isPressed('KeyS')) neutralY += 1;
      if (this.isPressed('KeyW')) neutralY -= 1;

      jump = this.isPressed('KeyW') || this.isPressed('Space');
      jab = this.isPressed('KeyZ') || this.isPressed('KeyJ');
      smash = this.isPressed('KeyX') || this.isPressed('KeyK');
      special = this.isPressed('KeyC') || this.isPressed('KeyL');
      shield = this.isPressed('ShiftLeft') || this.isPressed('KeyS');
    } else {
      // Player 2: Arrow keys / N,M,Slash / I,O,P / ShiftRight
      if (this.isPressed('ArrowLeft')) neutralX -= 1;
      if (this.isPressed('ArrowRight')) neutralX += 1;
      if (this.isPressed('ArrowDown')) neutralY += 1;
      if (this.isPressed('ArrowUp')) neutralY -= 1;

      jump = this.isPressed('ArrowUp');
      jab = this.isPressed('KeyN') || this.isPressed('KeyI');
      smash = this.isPressed('KeyM') || this.isPressed('KeyO');
      special = this.isPressed('Slash') || this.isPressed('KeyP');
      shield = this.isPressed('ShiftRight') || this.isPressed('ArrowDown');
    }

    return {
      neutralX,
      neutralY,
      jump,
      jab,
      smash,
      special,
      shield,
      pause: this.isPressed('Escape') || this.isPressed('Enter'),
    };
  }
}
