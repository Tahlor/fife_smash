import { Fighter } from '../entities/Fighter';

export class BattleHUD {
  private hudContainer: HTMLElement | null = null;
  private announcerBanner: HTMLElement | null = null;
  private announcerText: HTMLElement | null = null;

  public init(): void {
    this.hudContainer = document.getElementById('battle-hud');
    this.announcerBanner = document.getElementById('announcer-banner');
    this.announcerText = document.getElementById('announcer-text');
  }

  public show(): void {
    if (this.hudContainer) this.hudContainer.style.display = 'flex';
  }

  public hide(): void {
    if (this.hudContainer) {
      this.hudContainer.style.display = 'none';
      this.hudContainer.innerHTML = '';
    }
  }

  public setup(fighters: Fighter[]): void {
    if (!this.hudContainer) return;
    this.hudContainer.innerHTML = '';

    fighters.forEach((f, idx) => {
      const card = document.createElement('div');
      card.id = `hud-card-${idx}`;
      card.className =
        'bg-gray-900/85 border border-gray-700/80 px-3 py-2 rounded-xl backdrop-blur-md flex flex-col items-center min-w-[95px] shadow-lg';
      card.innerHTML = `
        <div class="flex items-center space-x-1.5 w-full justify-between">
          <span class="font-smash text-lg font-bold" style="color: ${f.slot.color}">${f.slot.label}</span>
          <span id="hud-stocks-${idx}" class="text-xs text-yellow-400">❤️❤️❤️</span>
        </div>
        <div id="hud-pct-${idx}" class="font-smash text-3xl text-white tracking-wider my-0.5">0%</div>
        <div class="text-[10px] text-gray-400 truncate max-w-[80px]">${f.cfg.name}</div>
      `;
      this.hudContainer?.appendChild(card);
    });
  }

  public update(fighters: Fighter[]): void {
    fighters.forEach((f, idx) => {
      const pctEl = document.getElementById(`hud-pct-${idx}`);
      const stocksEl = document.getElementById(`hud-stocks-${idx}`);

      if (pctEl) {
        pctEl.textContent = `${Math.floor(f.damage)}%`;
        pctEl.style.color = f.damage >= 100 ? '#ef4444' : f.damage >= 60 ? '#f59e0b' : '#ffffff';
      }

      if (stocksEl) {
        stocksEl.textContent = '❤️'.repeat(Math.max(0, f.stocks));
      }
    });
  }

  public showAnnouncer(text: string, durationMs: number = 800): Promise<void> {
    return new Promise((resolve) => {
      if (!this.announcerBanner || !this.announcerText) {
        resolve();
        return;
      }

      this.announcerText.textContent = text;
      this.announcerBanner.classList.remove('opacity-0', 'scale-90');
      this.announcerBanner.classList.add('opacity-100', 'scale-100');

      setTimeout(() => {
        if (this.announcerBanner) {
          this.announcerBanner.classList.remove('opacity-100', 'scale-100');
          this.announcerBanner.classList.add('opacity-0', 'scale-90');
        }
        resolve();
      }, durationMs);
    });
  }
}
