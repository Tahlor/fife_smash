import { ENGINE_CONSTANTS } from '../config/constants';

export type UpdateCallback = (fixedDeltaMs: number) => void;
export type RenderCallback = (alpha: number) => void;

/**
 * Fixed timestep game loop with accumulator and interpolation alpha.
 * Decouples physics simulation (deterministic 60 Hz) from the browser's display refresh rate.
 */
export class GameLoop {
  private updateFn: UpdateCallback;
  private renderFn: RenderCallback;
  private isRunning: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private accumulator: number = 0;

  public readonly fixedDeltaMs: number = ENGINE_CONSTANTS.FIXED_DELTA_MS;
  private readonly maxAccumulator: number = 250; // Cap to avoid spiral of death on lag spikes

  constructor(updateFn: UpdateCallback, renderFn: RenderCallback) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning) return;

    let frameTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap frame time to prevent spiraling after browser tab backgrounding
    if (frameTime > this.maxAccumulator) {
      frameTime = this.maxAccumulator;
    }

    this.accumulator += frameTime;

    // Consume accumulated time in discrete deterministic 60Hz ticks
    while (this.accumulator >= this.fixedDeltaMs) {
      this.updateFn(this.fixedDeltaMs);
      this.accumulator -= this.fixedDeltaMs;
    }

    // Alpha is the fractional remainder between fixed simulation steps [0.0, 1.0)
    const alpha = this.accumulator / this.fixedDeltaMs;
    this.renderFn(alpha);

    this.rafId = requestAnimationFrame(this.tick);
  };
}
