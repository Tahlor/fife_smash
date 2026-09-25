export type AttackType = 'jab' | 'smash' | 'special';

export type FighterState =
  | 'idle'
  | 'running'
  | 'jumping'
  | 'falling'
  | 'attacking'
  | 'shielding'
  | 'shield_break'
  | 'hitstun'
  | 'respawning';

export interface HitboxData {
  damage: number;
  angle: number; // launch trajectory angle in degrees (e.g. 45 degrees up-forward)
  baseKnockback: number;
  knockbackScaling: number;
  reach: number;
  offsetX: number;
  offsetY: number;
  activeFrames: number;
}

export interface HurtboxData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KnockbackResult {
  vx: number;
  vy: number;
  totalKnockback: number;
  hitstunFrames: number;
}

export interface CombatStats {
  damage: number;
  stocks: number;
  shieldHealth: number;
  hitstun: number;
  invulnerableTimer: number;
}
