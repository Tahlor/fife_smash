import { PlatformConfig } from '../types/entity';
import { checkPlatformLanding } from '../physics/Collisions';

export class Platform {
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public isPassThrough: boolean;
  public isTemporary: boolean;
  public active: boolean = true;

  constructor(config: PlatformConfig) {
    this.x = config.x;
    this.y = config.y;
    this.w = config.w;
    this.h = config.h ?? 10;
    this.isPassThrough = config.isPassThrough ?? true;
    this.isTemporary = config.isTemporary ?? false;
  }

  public checkLanding(
    entityX: number,
    entityY: number,
    prevY: number,
    vy: number,
    tolerance: number = 14
  ): boolean {
    if (!this.active) return false;
    return checkPlatformLanding(entityX, entityY, prevY, vy, this.x, this.y, this.w, tolerance);
  }

  public despawn(): void {
    if (this.isTemporary) {
      this.active = false;
    }
  }
}
