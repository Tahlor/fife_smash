import { KnockbackResult } from '../types/combat';
import { ENGINE_CONSTANTS } from '../config/constants';

/**
 * Calculates knockback velocity and hitstun duration adhering strictly to the Smash formula:
 * Vk = ((((D/10 + (D * B)/20) * (200 / (W + 100)) * 1.4) + 18) / W) * Ks
 *
 * @param damagePercent Current victim damage % (D)
 * @param baseDamage Attack base damage (B)
 * @param knockbackScaling Attack scaling factor (Ks)
 * @param weight Victim fighter weight (W)
 * @param angleDegrees Launch angle in degrees (default 45)
 * @param facing Attacker facing direction (+1 or -1)
 * @param di Directional Influence vector { x, y } (-1.0 to 1.0)
 */
export function calculateKnockback(
  damagePercent: number,
  baseDamage: number,
  knockbackScaling: number,
  weight: number,
  angleDegrees: number = 45,
  facing: number = 1,
  di?: { x: number; y: number }
): KnockbackResult {
  const D = Math.max(0, damagePercent);
  const B = Math.max(1, baseDamage);
  const Ks = Math.max(0.1, knockbackScaling);
  // Weight safety clamp to avoid division by zero
  const W = Math.max(0.4, weight);

  // Vk formula
  const baseTerm = (D / 10) + ((D * B) / 20);
  const weightScaling = 200 / (W + 100);
  const rawVk = (((baseTerm * weightScaling * 1.4) + 18) / W) * Ks;

  // Total launch magnitude
  let totalKnockback = Math.max(0.5, rawVk);

  // Base trajectory angle
  let angleRad = (angleDegrees * Math.PI) / 180;

  // Directional Influence (DI):
  // di.y in browser screen space is negative for UP. Convert to math Cartesian space (-di.y)
  // Smash DI shifts the launch angle perpendicularly or nudges trajectory by up to ~18 degrees
  if (di && (Math.abs(di.x) > 0.2 || Math.abs(di.y) > 0.2)) {
    const mathDiY = -di.y;
    const diAngle = Math.atan2(mathDiY, di.x * facing);
    const diInfluence = 0.18; // ~10-18 degrees maximum deflection
    angleRad += Math.sin(diAngle - angleRad) * diInfluence;
  }

  // Calculate velocity components (Canvas Y is negative for upward movement)
  let vx = facing * totalKnockback * Math.cos(angleRad);
  let vy = -totalKnockback * Math.sin(angleRad);

  // Hitstun calculation: floor(Vk * 1.6)
  const hitstunFrames = Math.max(4, Math.floor(totalKnockback * ENGINE_CONSTANTS.HITSTUN_SCALING));

  return {
    vx,
    vy,
    totalKnockback,
    hitstunFrames,
  };
}
