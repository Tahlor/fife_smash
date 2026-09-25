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

    // Tab Switching
    const tabBtns = document.querySelectorAll<HTMLElement>('.controls-tab-btn');
    tabBtns.forEach((btn) => {
      btn.onclick = () => {
        const tabTarget = btn.getAttribute('data-tab');
        if (tabTarget) {
          this.switchTab(tabTarget);
        }
      };
    });
  }

  public switchTab(tabId: string): void {
    const tabBtns = document.querySelectorAll<HTMLElement>('.controls-tab-btn');
    const tabPanels = document.querySelectorAll<HTMLElement>('.controls-tab-panel');

    tabBtns.forEach((btn) => {
      const isCurrent = btn.getAttribute('data-tab') === tabId;
      if (isCurrent) {
        btn.classList.add('border-yellow-400', 'text-yellow-400', 'bg-gray-800/90');
        btn.classList.remove('border-transparent', 'text-gray-400');
      } else {
        btn.classList.remove('border-yellow-400', 'text-yellow-400', 'bg-gray-800/90');
        btn.classList.add('border-transparent', 'text-gray-400');
      }
    });

    tabPanels.forEach((panel) => {
      if (panel.id === `tab-panel-${tabId}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  }

  public show(preferredTab: string = 'keyboard'): void {
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
      this.switchTab(preferredTab);
    }
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
