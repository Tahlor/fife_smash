import { InputManager } from '../input/InputManager';

export interface ControllerModalEvents {
  onQuickPairJoyConR: () => void;
  onResetPairings: () => void;
  onFlipAxesToggle: (enabled: boolean) => void;
  onClose: () => void;
}

export class ControllerModal {
  private modalEl: HTMLElement | null = null;
  private chkFlipAxes: HTMLInputElement | null = null;
  private events: ControllerModalEvents;

  constructor(events: ControllerModalEvents) {
    this.events = events;
  }

  public init(inputManager: InputManager): void {
    this.modalEl = document.getElementById('modal-grip');
    this.chkFlipAxes = document.getElementById('chkFlipAxes') as HTMLInputElement | null;

    if (this.chkFlipAxes) {
      this.chkFlipAxes.checked = inputManager.flipJoyConAxes;
      this.chkFlipAxes.onchange = (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        inputManager.flipJoyConAxes = checked;
        this.events.onFlipAxesToggle(checked);
      };
    }

    const btnClose = document.getElementById('btnCloseGripModal');
    if (btnClose) btnClose.onclick = () => this.hide();

    const btnDone = document.getElementById('btnDoneGripModal');
    if (btnDone) btnDone.onclick = () => this.hide();

    const btnPairR = document.getElementById('btnProfileRightJoyConP1');
    if (btnPairR) {
      btnPairR.onclick = () => {
        this.events.onQuickPairJoyConR();
      };
    }

    const btnReset = document.getElementById('btnProfileResetAll');
    if (btnReset) {
      btnReset.onclick = () => {
        this.events.onResetPairings();
      };
    }
  }

  public show(): void {
    if (this.modalEl) this.modalEl.classList.remove('hidden');
  }

  public hide(): void {
    if (this.modalEl) this.modalEl.classList.add('hidden');
    this.events.onClose();
  }

  public syncFlipAxesCheckbox(flipped: boolean): void {
    if (this.chkFlipAxes) {
      this.chkFlipAxes.checked = flipped;
    }
  }
}
