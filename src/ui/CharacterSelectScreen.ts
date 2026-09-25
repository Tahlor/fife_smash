import { FIGHTERS } from '../config/fighters.data';
import { PlayerSlot } from '../types/input';

export interface CSSEvents {
  onFighterSelected: (fighterId: string) => void;
  onSlotModeChanged: (slotId: number) => void;
  onFocusedSlotChanged: (slotId: number) => void;
  onRandomFighter: () => void;
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  onConfirmReady: () => void;
  onBackToTitle: () => void;
}

export class CharacterSelectScreen {
  private container: HTMLElement | null = null;
  private gridEl: HTMLElement | null = null;
  private slotsEl: HTMLElement | null = null;
  private events: CSSEvents;

  constructor(events: CSSEvents) {
    this.events = events;
  }

  public init(): void {
    this.container = document.getElementById('screen-css');
    this.gridEl = document.getElementById('fighter-roster-grid');
    this.slotsEl = document.getElementById('css-player-slots-container');

    const btnBack = document.getElementById('btnBackToTitle');
    if (btnBack) btnBack.onclick = () => this.events.onBackToTitle();

    const btnRandom = document.getElementById('btnRandomFighter');
    if (btnRandom) btnRandom.onclick = () => this.events.onRandomFighter();

    const btnAdd = document.getElementById('btnAddPlayerSlot');
    if (btnAdd) btnAdd.onclick = () => this.events.onAddPlayer();

    const btnRemove = document.getElementById('btnRemovePlayerSlot');
    if (btnRemove) btnRemove.onclick = () => this.events.onRemovePlayer();

    const btnConfirm = document.getElementById('btnGoToStagesBottom');
    if (btnConfirm) btnConfirm.onclick = () => this.events.onConfirmReady();

    this.renderRoster();
  }

  public show(): void {
    if (this.container) this.container.classList.remove('hidden');
  }

  public hide(): void {
    if (this.container) this.container.classList.add('hidden');
  }

  public renderRoster(): void {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    for (const f of FIGHTERS) {
      const tile = document.createElement('div');
      tile.className =
        'fighter-tile relative bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700 hover:border-yellow-400 p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow transition select-none';
      tile.innerHTML = `
        <div class="text-3xl sm:text-4xl mb-1 filter drop-shadow">${f.emoji}</div>
        <div class="font-bold text-[11px] sm:text-xs text-center text-white tracking-wide truncate w-full">${f.name}</div>
        <div class="text-[9px] text-amber-400 truncate">${f.role}</div>
      `;
      tile.onclick = () => {
        this.events.onFighterSelected(f.id);
      };
      this.gridEl.appendChild(tile);
    }

    // Random Tile
    const randomTile = document.createElement('div');
    randomTile.className =
      'fighter-tile relative bg-purple-900/60 hover:bg-purple-800/80 border border-purple-600 hover:border-yellow-400 p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow transition select-none';
    randomTile.innerHTML = `
      <div class="text-3xl sm:text-4xl mb-1 filter drop-shadow">🎲</div>
      <div class="font-bold text-[11px] sm:text-xs text-center text-white tracking-wide truncate w-full">RANDOM</div>
      <div class="text-[9px] text-purple-300 truncate">Roll Fighter</div>
    `;
    randomTile.onclick = () => {
      this.events.onRandomFighter();
    };
    this.gridEl.appendChild(randomTile);
  }

  public renderSlots(slots: PlayerSlot[], focusedSlotId: number): void {
    if (!this.slotsEl) return;
    const slotsEl = this.slotsEl;
    slotsEl.innerHTML = '';

    slots.forEach((slot, idx) => {
      const fighter = FIGHTERS.find(f => f.id === slot.fighterId) || FIGHTERS[0];
      const isNone = slot.mode === 'NONE';
      const card = document.createElement('div');

      card.className = `slot-card rounded-xl p-2.5 border transition flex flex-col justify-between select-none cursor-pointer ${
        isNone ? 'bg-gray-900/40 border-gray-800/60 opacity-35' : 'bg-gray-800/80 border-gray-700 shadow-md'
      } ${focusedSlotId === idx ? 'ring-2 ring-yellow-400' : ''}`;

      card.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="font-smash text-xl" style="color: ${slot.color}">${slot.label}</span>
          <button class="slot-mode-btn text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
            slot.mode === 'HUMAN'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : slot.mode === 'CPU'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : 'bg-gray-800 text-gray-500 border-gray-700'
          }">
            ${slot.mode}
          </button>
        </div>

        <div class="flex items-center space-x-2 my-1">
          <span class="text-2xl">${isNone ? '⚪' : fighter.emoji}</span>
          <div class="overflow-hidden">
            <div class="font-bold text-xs text-white truncate">${isNone ? 'Inactive' : fighter.name}</div>
            <div class="text-[9px] text-gray-400 truncate">${isNone ? 'Slot Off' : fighter.role}</div>
          </div>
        </div>
      `;

      card.onclick = (e) => {
        const modeBtn = (e.target as HTMLElement).closest('.slot-mode-btn');
        if (modeBtn) {
          this.events.onSlotModeChanged(idx);
          return;
        }
        this.events.onFocusedSlotChanged(idx);
      };

      slotsEl.appendChild(card);
    });
  }
}
