import { StageConfig, BlastZoneBounds } from '../types/entity';
import { Platform } from './Platform';
import { ENGINE_CONSTANTS } from '../config/constants';

export class Stage {
  public config: StageConfig;
  public platforms: Platform[];
  public blastZones: BlastZoneBounds;

  constructor(config: StageConfig) {
    this.config = config;
    this.platforms = config.platforms.map(p => new Platform(p));
    this.blastZones = this.calculateBlastZones();
  }

  public get width(): number {
    return this.config.w;
  }

  public get height(): number {
    return this.config.h;
  }

  public get art(): string {
    return this.config.art;
  }

  private calculateBlastZones(): BlastZoneBounds {
    const halfW = this.config.w / 2;
    return {
      left: -(halfW + ENGINE_CONSTANTS.BLAST_ZONE_X_OFFSET),
      right: halfW + ENGINE_CONSTANTS.BLAST_ZONE_X_OFFSET,
      top: ENGINE_CONSTANTS.BLAST_ZONE_TOP,
      bottom: ENGINE_CONSTANTS.BLAST_ZONE_BOTTOM,
    };
  }

  public isOutOfBounds(x: number, y: number): boolean {
    return (
      x < this.blastZones.left ||
      x > this.blastZones.right ||
      y < this.blastZones.top ||
      y > this.blastZones.bottom
    );
  }

  /**
   * Resolves vertical collision with main stage floor or secondary pass-through platforms.
   * Returns true if entity landed on a surface.
   */
  public resolveLanding(
    entityX: number,
    entityY: number,
    prevY: number,
    vy: number
  ): { landed: boolean; surfaceY: number } {
    if (vy < 0) return { landed: false, surfaceY: entityY };

    // 1. Check main stage floor
    const halfW = this.config.w / 2;
    const mainTop = 0;
    if (entityX >= -halfW && entityX <= halfW) {
      if (entityY >= mainTop && prevY <= mainTop + 16) {
        return { landed: true, surfaceY: mainTop };
      }
    }

    // 2. Check secondary floating platforms
    for (const plat of this.platforms) {
      if (plat.checkLanding(entityX, entityY, prevY, vy)) {
        return { landed: true, surfaceY: plat.y };
      }
    }

    return { landed: false, surfaceY: entityY };
  }
}
