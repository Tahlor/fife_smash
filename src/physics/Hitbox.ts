import { AttackType, HitboxData, HurtboxData } from '../types/combat';
import { checkCircleBoxIntersection } from './Collisions';

export class Hitbox {
  public data: HitboxData;
  public remainingFrames: number;
  public active: boolean = true;
  public attackType: AttackType;

  constructor(attackType: AttackType, customData?: Partial<HitboxData>) {
    this.attackType = attackType;
    this.data = Hitbox.getDefaultData(attackType, customData);
    this.remainingFrames = this.data.activeFrames;
  }

  public static getDefaultData(attackType: AttackType, overrides?: Partial<HitboxData>): HitboxData {
    let base: HitboxData;
    switch (attackType) {
      case 'smash':
        base = {
          damage: 18,
          angle: 45,
          baseKnockback: 22,
          knockbackScaling: 1.15,
          reach: 44,
          offsetX: 24,
          offsetY: -22,
          activeFrames: 22,
        };
        break;
      case 'special':
        base = {
          damage: 14,
          angle: 40,
          baseKnockback: 18,
          knockbackScaling: 1.0,
          reach: 32,
          offsetX: 26,
          offsetY: -22,
          activeFrames: 26,
        };
        break;
      case 'jab':
      default:
        base = {
          damage: 8,
          angle: 50,
          baseKnockback: 14,
          knockbackScaling: 0.85,
          reach: 28,
          offsetX: 16,
          offsetY: -22,
          activeFrames: 14,
        };
        break;
    }

    return { ...base, ...overrides };
  }

  public tick(): void {
    if (this.remainingFrames > 0) {
      this.remainingFrames--;
      if (this.remainingFrames <= 0) {
        this.active = false;
      }
    }
  }

  public getWorldCenter(ownerX: number, ownerY: number, facing: number): { x: number; y: number } {
    return {
      x: ownerX + facing * this.data.offsetX,
      y: ownerY + this.data.offsetY,
    };
  }

  public intersectsHurtbox(
    ownerX: number,
    ownerY: number,
    facing: number,
    targetHurtbox: HurtboxData
  ): boolean {
    if (!this.active) return false;

    const center = this.getWorldCenter(ownerX, ownerY, facing);
    return checkCircleBoxIntersection(
      { x: center.x, y: center.y, radius: this.data.reach / 2 },
      targetHurtbox
    );
  }
}
