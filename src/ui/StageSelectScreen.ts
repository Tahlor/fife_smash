import { STAGES } from '../config/stages.data';

export interface SSSEvents {
  onStageSelected: (stageId: string) => void;
  onRandomStage: () => void;
  onStartMatch: () => void;
  onBackToFighters: () => void;
}

export class StageSelectScreen {
  private container: HTMLElement | null = null;
  private gridEl: HTMLElement | null = null;
  private events: SSSEvents;
  public selectedStageId: string = 'celestial';

  constructor(events: SSSEvents) {
    this.events = events;
  }

  public init(): void {
    this.container = document.getElementById('screen-sss');
    this.gridEl = document.getElementById('stage-grid');

    const btnBack = document.getElementById('btnBackToFighters');
    if (btnBack) btnBack.onclick = () => this.events.onBackToFighters();

    const btnRandom = document.getElementById('btnRandomStage');
    if (btnRandom) btnRandom.onclick = () => this.events.onRandomStage();

    const btnStart = document.getElementById('btnStartMatchNowBottom');
    if (btnStart) btnStart.onclick = () => this.events.onStartMatch();

    this.renderStages();
  }

  public show(): void {
    if (this.container) this.container.classList.remove('hidden');
  }

  public hide(): void {
    if (this.container) this.container.classList.add('hidden');
  }

  public renderStages(): void {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    for (const s of STAGES) {
      const card = document.createElement('div');
      const isSelected = s.id === this.selectedStageId;

      card.className = `stage-card relative rounded-xl overflow-hidden border cursor-pointer transition flex flex-col justify-between p-1.5 select-none ${
        isSelected
          ? 'border-yellow-400 bg-yellow-500/20 ring-2 ring-yellow-400/60'
          : 'border-gray-700 bg-gray-800/60 hover:border-gray-500'
      }`;

      card.innerHTML = `
        <div class="h-10 sm:h-12 w-full rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
          ${s.art}
        </div>
        <div class="pt-1 flex items-center justify-between">
          <span class="font-smash text-sm tracking-wider text-white truncate">${s.name}</span>
          <span class="text-[9px] text-yellow-400 uppercase font-bold">${s.platforms.length} Plats</span>
        </div>
      `;

      card.onclick = () => {
        this.selectedStageId = s.id;
        this.events.onStageSelected(s.id);
        this.renderStages();
      };

      this.gridEl.appendChild(card);
    }
  }
}
