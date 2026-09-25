import { FighterConfig } from '../types/entity';
import { PlayerSlot, ControllerInput } from '../types/input';
import { AttackType, FighterState, HurtboxData, KnockbackResult } from '../types/combat';
import { Hitbox } from '../physics/Hitbox';
import { calculateKnockback } from '../physics/Knockback';
import { Projectile } from './Projectile';
import { Stage } from './Stage';
import { ENGINE_CONSTANTS } from '../config/constants';
import { getFighterById } from '../config/fighters.data';

export class Fighter {
  public slot: PlayerSlot;
  public cfg: FighterConfig;

  // Position & Physics
  public x: number;
  public y: number;
  public prevX: number;
  public prevY: number;
  public vx: number = 0;
  public vy: number = 0;
  public facing: number = 1; // 1 = right, -1 = left
  public isGrounded: boolean = false;
  public jumpsLeft: number = 2;

  // Combat Stats
  public damage: number = 0;
  public stocks: number;
  public shieldHealth: number = ENGINE_CONSTANTS.MAX_SHIELD_HEALTH;
  public shielding: boolean = false;
  public hitstun: number = 0;
  public invulnerableTimer: number = ENGINE_CONSTANTS.INVULNERABILITY_TICKS;
  public hasSpawnPlatform: boolean = true;

  // Attacks
  public attackTimer: number = 0;
  public attackType: AttackType | null = null;
  public currentHitbox: Hitbox | null = null;

  // Procedural Animation
  public animPhase: number = Math.random() * Math.PI * 2;
  public state: FighterState = 'idle';

  constructor(slot: PlayerSlot, spawnX: number, spawnY: number = ENGINE_CONSTANTS.SPAWN_PLATFORM_Y) {
    this.slot = slot;
    this.cfg = getFighterById(slot.fighterId);
    this.x = spawnX;
    this.y = spawnY;
    this.prevX = spawnX;
    this.prevY = spawnY;
    this.facing = spawnX < 0 ? 1 : -1;
    this.stocks = ENGINE_CONSTANTS.DEFAULT_STOCKS;
  }

  public get isAlive(): boolean {
    return this.stocks > 0;
  }

  public get Hurtbox(): HurtboxData {
    return {
      x: this.x - 14,
      y: this.y - 48,
      width: 28,
      height: 48,
    };
  }

  /**
   * Fixed-timestep physics update (60 Hz deterministic tick)
   */
  public update(
    stage: Stage,
    input: ControllerInput | null,
    allFighters: Fighter[],
    spawnProjectile: (p: Projectile) => void,
    onSoundEffect?: (sfx: string) => void
  ): void {
    if (!this.isAlive) return;

    // Cache previous position for render interpolation
    this.prevX = this.x;
    this.prevY = this.y;

    // Update animation oscillation
    const currentSpeed = Math.hypot(this.vx, this.vy);
    this.animPhase += currentSpeed > 0.3 ? 0.25 : 0.05;

    // Timers
    if (this.hitstun > 0) this.hitstun--;
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;

    if (this.currentHitbox) {
      this.currentHitbox.tick();
      if (!this.currentHitbox.active) {
        this.currentHitbox = null;
        this.attackType = null;
      }
    }
    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.attackType = null;
        this.currentHitbox = null;
      }
    }

    // Shield management
    if (this.shielding) {
      this.shieldHealth = Math.max(0, this.shieldHealth - ENGINE_CONSTANTS.SHIELD_DRAIN_RATE);
      if (this.shieldHealth <= 0) {
        // Shield break!
        this.shielding = false;
        this.hitstun = ENGINE_CONSTANTS.SHIELD_BREAK_STUN_TICKS;
        this.state = 'shield_break';
        onSoundEffect?.('hit_heavy');
      }
    } else {
      this.shieldHealth = Math.min(
        ENGINE_CONSTANTS.MAX_SHIELD_HEALTH,
        this.shieldHealth + ENGINE_CONSTANTS.SHIELD_RECOVER_RATE
      );
    }

    // Input processing if not in hitstun
    if (this.hitstun <= 0) {
      if (this.slot.mode === 'CPU') {
        this.runCPUAI(stage, allFighters, spawnProjectile, onSoundEffect);
      } else if (input) {
        this.processInput(input, spawnProjectile, onSoundEffect);
      }
    } else if (input) {
      // Directional Influence during hitstun: slightly nudge momentum
      if (Math.abs(input.neutralX) > 0.2 || Math.abs(input.neutralY) > 0.2) {
        this.vx += input.neutralX * 0.12;
        this.vy += input.neutralY * 0.12;
      }
    }

    // Movement & Friction
    if (this.isGrounded) {
      this.vx *= ENGINE_CONSTANTS.GROUND_FRICTION;
    } else {
      this.vx *= ENGINE_CONSTANTS.AIR_FRICTION;
      const maxAirSpeed = this.cfg.speed * 1.15;
      if (Math.abs(this.vx) > maxAirSpeed) {
        this.vx = Math.sign(this.vx) * maxAirSpeed;
      }
    }

    // Gravity
    if (!this.hasSpawnPlatform) {
      this.vy += ENGINE_CONSTANTS.GRAVITY * this.cfg.weight;
      if (this.vy > ENGINE_CONSTANTS.TERMINAL_VELOCITY) {
        this.vy = ENGINE_CONSTANTS.TERMINAL_VELOCITY;
      }
    }

    // Integrate position
    this.x += this.vx;
    this.y += this.vy;

    // Platform & Stage Collisions
    if (this.hasSpawnPlatform) {
      this.y = ENGINE_CONSTANTS.SPAWN_PLATFORM_Y;
      this.vy = 0;
      this.isGrounded = true;
      this.jumpsLeft = 2;
      // If invulnerability expires naturally, spawn platform drops
      if (this.invulnerableTimer <= 0) {
        this.hasSpawnPlatform = false;
      }
    } else {
      this.checkStageCollisions(stage);
    }

    // Update state enum for renderer
    this.updateState();
  }

  private processInput(
    input: ControllerInput,
    spawnProjectile: (p: Projectile) => void,
    onSoundEffect?: (sfx: string) => void
  ): void {
    // Horizontal Movement
    if (Math.abs(input.neutralX) > ENGINE_CONSTANTS.RADIAL_DEADZONE) {
      this.vx += input.neutralX * this.cfg.speed * 0.22;
      this.facing = input.neutralX > 0 ? 1 : -1;
      // Moving cancels the spawn platform
      if (Math.abs(input.neutralX) > 0.4) {
        this.hasSpawnPlatform = false;
      }
    }

    // Jumping
    if (input.jump || input.neutralY < -0.55) {
      if (this.isGrounded) {
        this.vy = -this.cfg.jump;
        this.hasSpawnPlatform = false;
        this.isGrounded = false;
        onSoundEffect?.('jump');
      } else if (this.jumpsLeft > 0 && this.vy > -2) {
        this.vy = -this.cfg.jump * 0.9;
        this.jumpsLeft--;
        this.hasSpawnPlatform = false;
        onSoundEffect?.('jump');
      }
    }

    // Shielding
    this.shielding = Boolean(input.shield) && this.isGrounded && this.shieldHealth > 10;

    // Attacks (cannot attack while shielding)
    if (!this.shielding && this.attackTimer <= 0) {
      if (input.smash) {
        this.executeAttack('smash', onSoundEffect);
      } else if (input.jab) {
        this.executeAttack('jab', onSoundEffect);
      } else if (input.special) {
        this.executeSpecial(spawnProjectile, onSoundEffect);
      }
    }
  }

  public executeAttack(type: AttackType, onSoundEffect?: (sfx: string) => void): void {
    if (this.attackTimer > 0) return;
    this.attackType = type;
    this.currentHitbox = new Hitbox(type);
    this.attackTimer = this.currentHitbox.data.activeFrames;

    if (type === 'smash') {
      onSoundEffect?.('smash');
    } else {
      onSoundEffect?.('attack');
    }
  }

  public executeSpecial(
    spawnProjectile: (p: Projectile) => void,
    onSoundEffect?: (sfx: string) => void
  ): void {
    if (this.attackTimer > 0) return;
    this.attackType = 'special';
    this.currentHitbox = new Hitbox('special');
    this.attackTimer = 26;
    onSoundEffect?.('special');

    spawnProjectile(
      new Projectile({
        ownerSlotId: this.slot.id,
        x: this.x + this.facing * 26,
        y: this.y - 22,
        vx: this.facing * 12,
        vy: this.cfg.specialType === 'rock_meteor' ? 4 : 0,
        color: this.cfg.color,
        type: this.cfg.specialType,
        life: 80,
        damage: 14,
      })
    );
  }

  public takeHit(
    attacker: Fighter,
    baseDamage: number,
    knockbackScaling: number,
    angleDegrees: number,
    di?: { x: number; y: number },
    onSoundEffect?: (sfx: string) => void
  ): KnockbackResult | null {
    if (this.invulnerableTimer > 0 || !this.isAlive) return null;

    if (this.shielding) {
      this.shieldHealth -= baseDamage * 1.5;
      onSoundEffect?.('shield');
      return null;
    }

    // Apply damage
    this.damage += baseDamage;

    // Calculate knockback
    const result = calculateKnockback(
      this.damage,
      baseDamage,
      knockbackScaling,
      this.cfg.weight,
      angleDegrees,
      attacker.facing,
      di
    );

    this.hitstun = result.hitstunFrames;
    this.vx = result.vx;
    this.vy = result.vy;
    this.hasSpawnPlatform = false;
    this.isGrounded = false;

    const isHeavy = result.totalKnockback > 16;
    onSoundEffect?.(isHeavy ? 'hit_heavy' : 'hit_light');

    return result;
  }

  private checkStageCollisions(stage: Stage): void {
    this.isGrounded = false;
    const landing = stage.resolveLanding(this.x, this.y, this.prevY, this.vy);
    if (landing.landed) {
      this.y = landing.surfaceY;
      this.vy = 0;
      this.isGrounded = true;
      this.jumpsLeft = 2;
    }
  }

  public respawn(spawnX: number = 0, spawnY: number = ENGINE_CONSTANTS.SPAWN_PLATFORM_Y): void {
    this.x = spawnX;
    this.y = spawnY;
    this.prevX = spawnX;
    this.prevY = spawnY;
    this.vx = 0;
    this.vy = 0;
    this.damage = 0;
    this.shieldHealth = ENGINE_CONSTANTS.MAX_SHIELD_HEALTH;
    this.shielding = false;
    this.hitstun = 0;
    this.invulnerableTimer = ENGINE_CONSTANTS.INVULNERABILITY_TICKS;
    this.hasSpawnPlatform = true;
    this.attackTimer = 0;
    this.attackType = null;
    this.currentHitbox = null;
    this.isGrounded = true;
    this.jumpsLeft = 2;
  }

  private runCPUAI(
    stage: Stage,
    allFighters: Fighter[],
    spawnProjectile: (p: Projectile) => void,
    onSoundEffect?: (sfx: string) => void
  ): void {
    // Find closest opponent
    let target: Fighter | null = null;
    let minDist = Infinity;

    for (const f of allFighters) {
      if (f !== this && f.isAlive) {
        const d = Math.hypot(f.x - this.x, f.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = f;
        }
      }
    }

    if (!target) return;

    // Edge Recovery
    const stageEdge = stage.width / 2;
    if (Math.abs(this.x) > stageEdge && !this.isGrounded) {
      this.vx += (this.x > 0 ? -1 : 1) * 0.42;
      this.facing = this.x > 0 ? -1 : 1;
      if (this.vy > 1 && this.jumpsLeft > 0) {
        this.vy = -this.cfg.jump;
        this.jumpsLeft--;
        this.hasSpawnPlatform = false;
        onSoundEffect?.('jump');
      }
      return;
    }

    const dx = target.x - this.x;
    this.facing = dx > 0 ? 1 : -1;

    // Approach target
    if (Math.abs(dx) > 42) {
      this.vx += (dx > 0 ? 1 : -1) * 0.36;
      this.hasSpawnPlatform = false;
    }

    // Platform jump tracking
    if (target.y < this.y - 40 && this.isGrounded && Math.random() < 0.05) {
      this.vy = -this.cfg.jump;
      this.hasSpawnPlatform = false;
      this.isGrounded = false;
      onSoundEffect?.('jump');
    }

    // Attacks
    if (minDist < 60 && this.attackTimer <= 0) {
      if (Math.random() < 0.5) {
        this.executeAttack('jab', onSoundEffect);
      } else {
        this.executeAttack('smash', onSoundEffect);
      }
    } else if (minDist < 280 && Math.random() < 0.035 && this.attackTimer <= 0) {
      this.executeSpecial(spawnProjectile, onSoundEffect);
    }
  }

  private updateState(): void {
    if (this.hitstun > 0) {
      this.state = this.state === 'shield_break' ? 'shield_break' : 'hitstun';
    } else if (this.shielding) {
      this.state = 'shielding';
    } else if (this.attackTimer > 0) {
      this.state = 'attacking';
    } else if (this.hasSpawnPlatform) {
      this.state = 'respawning';
    } else if (!this.isGrounded) {
      this.state = this.vy < 0 ? 'jumping' : 'falling';
    } else if (Math.abs(this.vx) > 0.4) {
      this.state = 'running';
    } else {
      this.state = 'idle';
    }
  }

  public getInterpolatedPosition(alpha: number): { x: number; y: number } {
    return {
      x: this.prevX + (this.x - this.prevX) * alpha,
      y: this.prevY + (this.y - this.prevY) * alpha,
    };
  }
}
