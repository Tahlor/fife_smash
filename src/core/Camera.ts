import { Fighter } from '../entities/Fighter';
import { Stage } from '../entities/Stage';

export class Camera {
  public x: number = 0;
  public y: number = -80;
  public zoom: number = 1.0;

  public targetX: number = 0;
  public targetY: number = -80;
  public targetZoom: number = 1.0;

  // Smoothing rates
  public panLerp: number = 0.08;
  public zoomLerp: number = 0.05;

  // Zoom bounds
  public minZoom: number = 0.65;
  public maxZoom: number = 1.25;

  public update(fighters: Fighter[], stage: Stage, viewportWidth: number, viewportHeight: number): void {
    const active = fighters.filter(f => f.isAlive);
    if (active.length === 0) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let sumX = 0;
    let sumY = 0;

    for (const f of active) {
      sumX += f.x;
      sumY += f.y;
      if (f.x < minX) minX = f.x;
      if (f.x > maxX) maxX = f.x;
      if (f.y < minY) minY = f.y;
      if (f.y > maxY) maxY = f.y;
    }

    // Centroid of active fighters
    this.targetX = sumX / active.length;
    // Bias camera slightly above feet level
    this.targetY = (sumY / active.length) - 40;

    // Stage clamping to keep focus near action
    const maxPanX = stage.width / 2 + 100;
    this.targetX = Math.max(-maxPanX, Math.min(maxPanX, this.targetX));
    this.targetY = Math.max(-400, Math.min(200, this.targetY));

    // Dynamic zoom based on player spread
    const spreadX = (maxX - minX) + 320;
    const spreadY = (maxY - minY) + 240;

    const zoomX = viewportWidth / spreadX;
    const zoomY = viewportHeight / spreadY;
    const desiredZoom = Math.min(zoomX, zoomY);

    this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, desiredZoom));

    // Smooth interpolation
    this.x += (this.targetX - this.x) * this.panLerp;
    this.y += (this.targetY - this.y) * this.panLerp;
    this.zoom += (this.targetZoom - this.zoom) * this.zoomLerp;
  }

  public reset(spawnX: number = 0, spawnY: number = -80): void {
    this.x = spawnX;
    this.y = spawnY;
    this.targetX = spawnX;
    this.targetY = spawnY;
    this.zoom = 1.0;
    this.targetZoom = 1.0;
  }
}
