import { GameLoop } from './GameLoop';
import { Camera } from './Camera';
import { MatchStateMachine } from './StateMachine';
import { Stage } from '../entities/Stage';
import { Fighter } from '../entities/Fighter';
import { Projectile } from '../entities/Projectile';
import { InputManager } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { Renderer } from '../render/Renderer';
import { UIManager } from '../ui/UIManager';
import { PlayerSlot } from '../types/input';
import { STAGES, getStageById } from '../config/stages.data';

export class Engine {
  public gameLoop: GameLoop;
  public stateMachine: MatchStateMachine;
  public camera: Camera;
  public inputManager: InputManager;
  public audioManager: AudioManager;
  public renderer: Renderer;
  public uiManager: UIManager;

  public currentStage: Stage;
  public fighters: Fighter[] = [];
  public projectiles: Projectile[] = [];

  public playerSlots: PlayerSlot[] = [
    { id: 0, label: 'P1', mode: 'HUMAN', fighterId: 'vanguard', color: '#ef4444', deviceType: 'gamepad', gpIndex: 0 },
    { id: 1, label: 'P2', mode: 'HUMAN', fighterId: 'specter',  color: '#3b82f6', deviceType: 'gamepad', gpIndex: 1 },
    { id: 2, label: 'P3', mode: 'NONE',  fighterId: 'titan',    color: '#10b981', deviceType: 'gamepad', gpIndex: 2 },
    { id: 3, label: 'P4', mode: 'NONE',  fighterId: 'volt',     color: '#f59e0b', deviceType: 'gamepad', gpIndex: 3 },
    { id: 4, label: 'P5', mode: 'NONE',  fighterId: 'glacia',   color: '#a855f7', deviceType: 'gamepad', gpIndex: 4 },
    { id: 5, label: 'P6', mode: 'NONE',  fighterId: 'ignis',    color: '#06b6d4', deviceType: 'gamepad', gpIndex: 5 },
    { id: 6, label: 'P7', mode: 'NONE',  fighterId: 'zephyr',   color: '#ec4899', deviceType: 'gamepad', gpIndex: 6 },
    { id: 7, label: 'P8', mode: 'NONE',  fighterId: 'kage',     color: '#f97316', deviceType: 'gamepad', gpIndex: 7 },
  ];

  public focusedSlotIdRef = { id: 0 };
  private isMatchConcluding: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.audioManager = new AudioManager();
    this.inputManager = new InputManager();
    this.renderer = new Renderer(canvas);
    this.camera = new Camera();
    this.stateMachine = new MatchStateMachine('title');
    this.currentStage = new Stage(STAGES[0]);

    this.uiManager = new UIManager(
      this.stateMachine,
      this.inputManager,
      {
        onStartMatch: (stageId: string) => this.startMatch(stageId),
        onExitMatch: () => this.endMatch(false),
        onSoundEffect: (sfx: string) => this.audioManager.play(sfx),
      },
      this.playerSlots,
      this.focusedSlotIdRef,
      () => this.onSlotsUpdated()
    );

    this.gameLoop = new GameLoop(
      (fixedDeltaMs) => this.update(fixedDeltaMs),
      (alpha) => this.render(alpha)
    );
  }

  public init(): void {
    const p1CursorEl = document.getElementById('smash-cursor-p1');
    const p2CursorEl = document.getElementById('smash-cursor-p2');
    this.inputManager.cursor.initElements(p1CursorEl, p2CursorEl);

    this.uiManager.init();
    this.onSlotsUpdated();
    this.gameLoop.start();
  }

  public onSlotsUpdated(): void {
    this.uiManager.css.renderSlots(this.playerSlots, this.focusedSlotIdRef.id);
  }

  public startMatch(stageId: string): void {
    this.audioManager.play('start');
    this.isMatchConcluding = false;
    this.currentStage = new Stage(getStageById(stageId));
    this.projectiles = [];
    this.fighters = [];

    // Ensure at least 2 combatants
    const activeSlots = this.playerSlots.filter(s => s.mode !== 'NONE');
    if (activeSlots.length < 2) {
      this.playerSlots[1].mode = 'CPU';
      activeSlots.push(this.playerSlots[1]);
      this.onSlotsUpdated();
    }

    // Spawn fighters evenly spaced along stage floor
    const spacing = this.currentStage.width / (activeSlots.length + 1);
    activeSlots.forEach((slot, idx) => {
      const spawnX = -this.currentStage.width / 2 + spacing * (idx + 1);
      this.fighters.push(new Fighter(slot, spawnX, -120));
    });

    this.camera.reset(0, -80);
    this.uiManager.hud.setup(this.fighters);

    // Announcer sequence
    this.uiManager.hud.showAnnouncer('READY!', 700).then(() => {
      if (this.stateMachine.state === 'brawl') {
        this.uiManager.hud.showAnnouncer('GO!', 700);
      }
    });
  }

  public endMatch(showPodium: boolean = true): void {
    if (this.isMatchConcluding) return;
    this.isMatchConcluding = true;

    if (showPodium) {
      this.uiManager.hud.showAnnouncer('GAME!', 1400).then(() => {
        this.stateMachine.transitionTo('podium');
        this.uiManager.showPodium(this.fighters);
      });
    } else {
      this.stateMachine.transitionTo('css');
    }
  }

  /**
   * Deterministic 60 Hz simulation step
   */
  public update(_fixedDeltaMs: number): void {
    // Menu Virtual Cursor Update
    if (this.stateMachine.state !== 'brawl') {
      this.inputManager.updateCursor();
      return;
    }

    // Active Brawl Physics Simulation
    const onSound = (sfx: string) => this.audioManager.play(sfx);

    // 1. Update Fighters
    for (const f of this.fighters) {
      if (!f.isAlive) continue;
      const input = this.inputManager.pollPlayerInput(f.slot);
      f.update(
        this.currentStage,
        input,
        this.fighters,
        (proj) => this.projectiles.push(proj),
        onSound
      );
    }

    // 2. Update Projectiles & Projectile Collisions
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update();

      if (!p.active) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision against other fighters
      for (const target of this.fighters) {
        if (target.slot.id !== p.ownerSlotId && target.isAlive && target.invulnerableTimer <= 0) {
          if (p.intersectsHurtbox(target.Hurtbox)) {
            p.active = false;
            const attacker = this.fighters.find(f => f.slot.id === p.ownerSlotId) || target;
            target.takeHit(attacker, p.damage, 1.0, 45, undefined, onSound);
            break;
          }
        }
      }

      if (!p.active) {
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Attacker Hitbox vs Victim Hurtbox Collisions
    for (const attacker of this.fighters) {
      if (!attacker.isAlive || !attacker.currentHitbox || !attacker.currentHitbox.active) continue;

      for (const victim of this.fighters) {
        if (victim === attacker || !victim.isAlive || victim.invulnerableTimer > 0) continue;

        if (attacker.currentHitbox.intersectsHurtbox(attacker.x, attacker.y, attacker.facing, victim.Hurtbox)) {
          attacker.currentHitbox.active = false; // consume hitbox on hit

          const hbData = attacker.currentHitbox.data;
          victim.takeHit(
            attacker,
            hbData.damage,
            hbData.knockbackScaling,
            hbData.angle,
            undefined,
            onSound
          );
        }
      }
    }

    // 4. Blast Zone Elimination & Respawns
    for (const f of this.fighters) {
      if (f.isAlive && this.currentStage.isOutOfBounds(f.x, f.y)) {
        this.audioManager.play('blast');
        f.stocks--;

        if (f.stocks > 0) {
          f.respawn(0, -120);
        }
      }
    }

    // 5. Match Conclusion Evaluation
    if (!this.isMatchConcluding) {
      const aliveFighters = this.fighters.filter(f => f.isAlive);
      if (aliveFighters.length <= 1) {
        this.endMatch(true);
      }
    }

    // 6. Camera Tracking
    this.camera.update(this.fighters, this.currentStage, window.innerWidth, window.innerHeight);

    // 7. Update HUD
    this.uiManager.hud.update(this.fighters);
  }

  /**
   * Render step with fractional alpha interpolation
   */
  public render(alpha: number): void {
    this.renderer.render(
      this.currentStage,
      this.fighters,
      this.projectiles,
      this.camera,
      alpha
    );
  }
}
