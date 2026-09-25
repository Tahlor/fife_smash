import { Stage } from '../entities/Stage';
import { Fighter } from '../entities/Fighter';

export class StageRenderer {
  public render(ctx: CanvasRenderingContext2D, stage: Stage, activeFighters: Fighter[]): void {
    const halfW = stage.width / 2;

    // 1. Stage Understructure (Trapezoid floating island)
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.lineTo(halfW, 0);
    ctx.lineTo(halfW - 45, 95);
    ctx.lineTo(-halfW + 45, 95);
    ctx.closePath();
    ctx.fill();

    // Geometric structure lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-halfW + 50, 0);
    ctx.lineTo(-halfW + 70, 95);
    ctx.moveTo(halfW - 50, 0);
    ctx.lineTo(halfW - 70, 95);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 95);
    ctx.stroke();

    // 2. Main Floor Surface
    ctx.fillStyle = '#334155';
    ctx.fillRect(-halfW, 0, stage.width, stage.height);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.strokeRect(-halfW, 0, stage.width, stage.height);
    ctx.shadowBlur = 0;

    // 3. Floating Pass-Through Platforms
    for (const plat of stage.platforms) {
      if (!plat.active) continue;

      ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
      ctx.shadowBlur = 0;

      // Platform edge neon dots
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(plat.x + 2, plat.y + 2, 4, plat.h - 4);
      ctx.fillRect(plat.x + plat.w - 6, plat.y + 2, 4, plat.h - 4);
    }

    // 4. Temporary Spawn Platforms for Respawning / Newly Spawned Fighters
    for (const f of activeFighters) {
      if (f.hasSpawnPlatform && f.isAlive) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fillRect(f.x - 60, -120, 120, 12);
        ctx.strokeRect(f.x - 60, -120, 120, 12);
        ctx.shadowBlur = 0;
      }
    }

    // 5. Blast Zone visual warning perimeter lines (faint boundary)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    const bz = stage.blastZones;
    ctx.strokeRect(bz.left, bz.top, bz.right - bz.left, bz.bottom - bz.top);
    ctx.setLineDash([]);

    ctx.restore();
  }
}
