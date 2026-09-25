import { describe, it, expect } from 'vitest';
import { calculateKnockback } from '../Knockback';

describe('Knockback Physics Formula', () => {
  it('should scale knockback strictly with damage percentage', () => {
    const lowDamage = calculateKnockback(0, 15, 1.0, 1.0, 45, 1);
    const midDamage = calculateKnockback(50, 15, 1.0, 1.0, 45, 1);
    const highDamage = calculateKnockback(120, 15, 1.0, 1.0, 45, 1);

    expect(midDamage.totalKnockback).toBeGreaterThan(lowDamage.totalKnockback);
    expect(highDamage.totalKnockback).toBeGreaterThan(midDamage.totalKnockback);
  });

  it('should apply inverse scaling for heavier fighters', () => {
    const lightFighter = calculateKnockback(80, 14, 1.0, 0.8, 45, 1);
    const heavyFighter = calculateKnockback(80, 14, 1.0, 1.4, 45, 1);

    expect(lightFighter.totalKnockback).toBeGreaterThan(heavyFighter.totalKnockback);
    expect(lightFighter.hitstunFrames).toBeGreaterThan(heavyFighter.hitstunFrames);
  });

  it('should match exact formula calculation', () => {
    const D = 100;
    const B = 18;
    const Ks = 1.15;
    const W = 1.0;

    const baseTerm = (D / 10) + ((D * B) / 20); // 10 + 90 = 100
    const weightScaling = 200 / (W + 100); // 200 / 101 = 1.980198...
    const expectedVk = (((baseTerm * weightScaling * 1.4) + 18) / W) * Ks;

    const result = calculateKnockback(D, B, Ks, W, 45, 1);
    expect(result.totalKnockback).toBeCloseTo(expectedVk, 4);

    const expectedHitstun = Math.floor(expectedVk * 1.6);
    expect(result.hitstunFrames).toBe(expectedHitstun);
  });

  it('should apply Directional Influence (DI) to launch velocity components', () => {
    const noDI = calculateKnockback(80, 15, 1.0, 1.0, 45, 1);
    const diUp = calculateKnockback(80, 15, 1.0, 1.0, 45, 1, { x: 0, y: -1.0 });

    // Upward DI should decrease vy (make it more negative / launch higher)
    expect(diUp.vy).toBeLessThan(noDI.vy);
  });
});
