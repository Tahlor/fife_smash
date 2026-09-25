import { Camera } from '../core/Camera';
import { Stage } from '../entities/Stage';
import { Fighter } from '../entities/Fighter';
import { Projectile } from '../entities/Projectile';
import { FighterRenderer } from './FighterRenderer';
import { StageRenderer } from './StageRenderer';

export class Renderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private fighterRenderer: FighterRenderer;
  private stageRenderer: StageRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to obtain 2D rendering context from canvas');
    }
    this.ctx = context;
    this.fighterRenderer = new FighterRenderer();
    this.stageRenderer = new StageRenderer();
    this.resize();
  }

  public resize(): void {
    if (this.canvas.width !== window.innerWidth || this.canvas.height !== window.innerHeight) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  public render(
    stage: Stage,
    fighters: Fighter[],
    projectiles: Projectile[],
    camera: Camera,
    alpha: number
  ): void {
    this.resize();
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Apply Camera View Transform
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    // 1. Render Stage
    this.stageRenderer.render(ctx, stage, fighters);

    // 2. Render Projectiles
    for (const p of projectiles) {
      if (!p.active) continue;
      const interp = p.getInterpolatedPosition(alpha);
      ctx.save();
      ctx.beginPath();
      ctx.arc(interp.x, interp.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // 3. Render Fighters
    for (const f of fighters) {
      this.fighterRenderer.render(ctx, f, alpha);
    }

    ctx.restore();
  }
}
