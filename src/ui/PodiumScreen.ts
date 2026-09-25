import { Fighter } from '../entities/Fighter';

export interface PodiumEvents {
  onContinue: () => void;
}

export class PodiumScreen {
  private container: HTMLElement | null = null;
  private listEl: HTMLElement | null = null;
  private events: PodiumEvents;

  constructor(events: PodiumEvents) {
    this.events = events;
  }

  public init(): void {
    this.container = document.getElementById('screen-results');
    this.listEl = document.getElementById('podium-list');

    const btnContinue = document.getElementById('btnResultsContinue');
    if (btnContinue) {
      btnContinue.onclick = () => this.events.onContinue();
    }
  }

  public show(fighters: Fighter[]): void {
    if (!this.container || !this.listEl) return;

    // Sort by stocks remaining descending, then by lowest damage % ascending
    const sorted = [...fighters].sort((a, b) => b.stocks - a.stocks || a.damage - b.damage);
    this.listEl.innerHTML = '';

    sorted.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className =
        'bg-gray-800/90 border border-gray-700 p-3.5 rounded-xl flex items-center justify-between shadow';
      item.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="font-smash text-2xl text-yellow-400">#${idx + 1}</span>
          <span class="text-3xl">${f.cfg.emoji}</span>
          <div class="text-left">
            <div class="font-bold text-sm text-white" style="color: ${f.slot.color}">${f.slot.label} (${f.cfg.name})</div>
            <div class="text-xs text-gray-400">Stocks Left: ${Math.max(0, f.stocks)}</div>
          </div>
        </div>
        <span class="font-smash text-xl text-yellow-300">${idx === 0 ? '🏆 WINNER' : `${Math.floor(f.damage)}%`}</span>
      `;
      this.listEl?.appendChild(item);
    });

    this.container.classList.remove('hidden');
  }

  public hide(): void {
    if (this.container) this.container.classList.add('hidden');
  }
}
