import { SpecialMoveType } from '../types/entity';
import { checkCircleBoxIntersection } from '../physics/Collisions';
import { HurtboxData } from '../types/combat';

export interface ProjectileInit {
  ownerSlotId: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  type: SpecialMoveType;
  life: number;
  damage: number;
  radius?: number;
}

export class Projectile {
  public ownerSlotId: number;
  public x: number;
  public y: number;
  public prevX: number;
  public prevY: number;
  public vx: number;
  public vy: number;
  public color: string;
  public type: SpecialMoveType;
  public life: number;
  public maxLife: number;
  public damage: number;
  public radius: number;
  public active: boolean = true;

  constructor(init: ProjectileInit) {
    this.ownerSlotId = init.ownerSlotId;
    this.x = init.x;
    this.y = init.y;
    this.prevX = init.x;
    this.prevY = init.y;
    this.vx = init.vx;
    this.vy = init.vy;
    this.color = init.color;
    this.type = init.type;
    this.life = init.life;
    this.maxLife = init.life;
    this.damage = init.damage;
    this.radius = init.radius ?? 8;
  }

  public update(): void {
    if (!this.active) return;

    this.prevX = this.x;
    this.prevY = this.y;

    this.x += this.vx;
    this.y += this.vy;

    // Apply special projectile trajectory characteristics
    if (this.type === 'rock_meteor') {
      this.vy += 0.25; // Arcing boulder
    } else if (this.type === 'bounce_bomb') {
      this.vy += 0.35; // Gravity on bouncing bomb
      if (this.y > 0) {
        this.y = 0;
        this.vy = -Math.abs(this.vy) * 0.75;
      }
    }

    this.life--;
    if (this.life <= 0) {
      this.active = false;
    }
  }

  public intersectsHurtbox(hurtbox: HurtboxData): boolean {
    if (!this.active) return false;
    return checkCircleBoxIntersection(
      { x: this.x, y: this.y, radius: this.radius },
      hurtbox
    );
  }

  public getInterpolatedPosition(alpha: number): { x: number; y: number } {
    return {
      x: this.prevX + (this.x - this.prevX) * alpha,
      y: this.prevY + (this.y - this.prevY) * alpha,
    };
  }
}
