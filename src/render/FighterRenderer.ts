import { Fighter } from '../entities/Fighter';

export class FighterRenderer {
  public render(ctx: CanvasRenderingContext2D, fighter: Fighter, alpha: number): void {
    if (!fighter.isAlive) return;

    const interp = fighter.getInterpolatedPosition(alpha);
    const renderX = interp.x;
    const renderY = interp.y;

    ctx.save();
    ctx.translate(renderX, renderY);

    // Flashing invulnerability aura
    if (fighter.invulnerableTimer > 0) {
      const isLowInvuln = fighter.invulnerableTimer < 60;
      const flash = isLowInvuln ? Math.floor(Date.now() / 60) % 2 === 0 : Math.floor(Date.now() / 100) % 2 === 0;

      if (flash) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -24, 36, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // Shield bubble
    if (fighter.shielding) {
      ctx.save();
      const shieldRatio = fighter.shieldHealth / 100;
      const radius = 32 * Math.max(0.3, shieldRatio);
      ctx.beginPath();
      ctx.arc(0, -24, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.strokeStyle = shieldRatio < 0.3 ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Facing direction transformation
    ctx.scale(fighter.facing, 1);

    // Dynamic articulated limb kinematics
    const moving = Math.abs(fighter.vx) > 0.2;
    const legSwing = Math.sin(fighter.animPhase) * (moving ? 15 : 3);
    const armSwing = Math.cos(fighter.animPhase) * (moving ? 14 : 2);
    const breathingOffset = Math.sin(fighter.animPhase * 0.5) * 1.5;

    // 1. Back Leg
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-4, -14);
    ctx.lineTo(-8 - legSwing, -4);
    ctx.lineTo(-12 - legSwing, 0);
    ctx.stroke();

    // 2. Back Arm
    ctx.beginPath();
    ctx.moveTo(-6, -30 + breathingOffset);
    ctx.lineTo(-14 - armSwing, -20);
    ctx.stroke();

    // 3. Torso (Articulated Armor)
    ctx.fillStyle = fighter.cfg.color;
    ctx.beginPath();
    ctx.roundRect(-12, -38 + breathingOffset, 24, 26, [6]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Torso emblem
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(-6, -32 + breathingOffset, 12, 14);

    // 4. Front Leg
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(4, -14);
    ctx.lineTo(8 + legSwing, -4);
    ctx.lineTo(12 + legSwing, 0);
    ctx.stroke();

    // 5. Head
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -46 + breathingOffset, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = fighter.cfg.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Visor / Eyes
    ctx.fillStyle = fighter.cfg.color;
    ctx.fillRect(2, -49 + breathingOffset, 8, 4);

    // 6. Front Arm & Weapon
    ctx.beginPath();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    let handX = 14 + armSwing;
    let handY = -26;
    if (fighter.attackTimer > 0) {
      handX = 28;
      handY = -30;
    }
    ctx.moveTo(6, -30 + breathingOffset);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Attack swoosh arc
    if (fighter.attackTimer > 0 && fighter.currentHitbox?.active) {
      ctx.beginPath();
      const isSmash = fighter.attackType === 'smash';
      const reach = isSmash ? 44 : 28;
      ctx.arc(18, -24, reach, -Math.PI / 3, Math.PI / 3);
      ctx.strokeStyle = isSmash ? '#f59e0b' : '#ffffff';
      ctx.lineWidth = isSmash ? 6 : 4;
      ctx.shadowColor = isSmash ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.stroke();
    }

    ctx.restore();

    // Overhead Slot Indicator
    ctx.save();
    ctx.fillStyle = fighter.slot.color;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(fighter.slot.label, renderX, renderY - 64);
    ctx.restore();
  }
}
