import { MatchState, MatchStateMachine } from '../core/StateMachine';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { StageSelectScreen } from './StageSelectScreen';
import { BattleHUD } from './BattleHUD';
import { PodiumScreen } from './PodiumScreen';
import { ControllerModal } from './ControllerModal';
import { InputManager } from '../input/InputManager';
import { Fighter } from '../entities/Fighter';
import { PlayerSlot } from '../types/input';

export interface UIManagerEvents {
  onStartMatch: (stageId: string) => void;
  onExitMatch: () => void;
  onSoundEffect: (sfx: string) => void;
}

export class UIManager {
  private stateMachine: MatchStateMachine;
  private inputManager: InputManager;
  private events: UIManagerEvents;

  public css: CharacterSelectScreen;
  public sss: StageSelectScreen;
  public hud: BattleHUD;
  public podium: PodiumScreen;
  public controllerModal: ControllerModal;

  private titleScreenEl: HTMLElement | null = null;
  private matchBadgeEl: HTMLElement | null = null;
  private leaveBattleBtn: HTMLElement | null = null;

  constructor(
    stateMachine: MatchStateMachine,
    inputManager: InputManager,
    events: UIManagerEvents,
    playerSlots: PlayerSlot[],
    focusedSlotIdRef: { id: number },
    onSlotsUpdated: () => void
  ) {
    this.stateMachine = stateMachine;
    this.inputManager = inputManager;
    this.events = events;

    // Character Select Screen
    this.css = new CharacterSelectScreen({
      onFighterSelected: (fighterId) => {
        this.events.onSoundEffect('select');
        const slot = playerSlots[focusedSlotIdRef.id];
        if (slot && slot.mode !== 'NONE') {
          slot.fighterId = fighterId;
        } else {
          playerSlots[0].fighterId = fighterId;
        }
        onSlotsUpdated();
      },
      onSlotModeChanged: (slotId) => {
        this.events.onSoundEffect('select');
        const slot = playerSlots[slotId];
        if (slot) {
          if (slot.mode === 'NONE') slot.mode = 'CPU';
          else if (slot.mode === 'CPU') slot.mode = 'HUMAN';
          else slot.mode = 'NONE';
        }
        onSlotsUpdated();
      },
      onFocusedSlotChanged: (slotId) => {
        focusedSlotIdRef.id = slotId;
        onSlotsUpdated();
      },
      onRandomFighter: () => {
        this.events.onSoundEffect('select');
        const slot = playerSlots[focusedSlotIdRef.id];
        const allFighters = ['vanguard', 'specter', 'titan', 'volt', 'glacia', 'ignis', 'zephyr', 'kage', 'solaria', 'umbra'];
        const randomId = allFighters[Math.floor(Math.random() * allFighters.length)];
        if (slot && slot.mode !== 'NONE') {
          slot.fighterId = randomId;
        } else {
          playerSlots[0].fighterId = randomId;
        }
        onSlotsUpdated();
      },
      onAddPlayer: () => {
        this.events.onSoundEffect('select');
        const inactive = playerSlots.find(s => s.mode === 'NONE');
        if (inactive) {
          inactive.mode = 'CPU';
          onSlotsUpdated();
        }
      },
      onRemovePlayer: () => {
        this.events.onSoundEffect('select');
        const active = [...playerSlots].reverse().find(s => s.mode !== 'NONE' && s.id > 1);
        if (active) {
          active.mode = 'NONE';
          onSlotsUpdated();
        }
      },
      onConfirmReady: () => {
        this.events.onSoundEffect('select');
        this.stateMachine.transitionTo('sss');
      },
      onBackToTitle: () => {
        this.events.onSoundEffect('select');
        this.stateMachine.transitionTo('title');
      },
    });

    // Stage Select Screen
    this.sss = new StageSelectScreen({
      onStageSelected: () => {
        this.events.onSoundEffect('select');
      },
      onRandomStage: () => {
        this.events.onSoundEffect('select');
      },
      onStartMatch: () => {
        this.stateMachine.transitionTo('brawl');
        this.events.onStartMatch(this.sss.selectedStageId);
      },
      onBackToFighters: () => {
        this.events.onSoundEffect('select');
        this.stateMachine.transitionTo('css');
      },
    });

    // Battle HUD
    this.hud = new BattleHUD();

    // Victory Podium Screen
    this.podium = new PodiumScreen({
      onContinue: () => {
        this.events.onSoundEffect('select');
        this.stateMachine.transitionTo('css');
      },
    });

    // Controller Modal
    this.controllerModal = new ControllerModal({
      onQuickPairJoyConR: () => {
        this.events.onSoundEffect('select');
        playerSlots[0].mode = 'HUMAN';
        playerSlots[0].gpIndex = 0;
        this.inputManager.forceJoyConRP1 = true;
        onSlotsUpdated();
      },
      onResetPairings: () => {
        this.events.onSoundEffect('select');
        onSlotsUpdated();
      },
      onFlipAxesToggle: (enabled) => {
        this.events.onSoundEffect('select');
        this.inputManager.flipJoyConAxes = enabled;
      },
      onClose: () => {
        this.events.onSoundEffect('select');
      },
    });
  }

  public init(): void {
    this.titleScreenEl = document.getElementById('screen-title');
    this.matchBadgeEl = document.getElementById('match-status-badge');
    this.leaveBattleBtn = document.getElementById('btnLeaveBattle');

    this.css.init();
    this.sss.init();
    this.hud.init();
    this.podium.init();
    this.controllerModal.init(this.inputManager);

    // Title buttons
    const btnStart = document.getElementById('btnStartGame');
    if (btnStart) {
      btnStart.onclick = () => {
        this.events.onSoundEffect('start');
        this.stateMachine.transitionTo('css');
      };
    }

    const btnTitleControls = document.getElementById('btnTitleControls');
    if (btnTitleControls) {
      btnTitleControls.onclick = () => {
        this.events.onSoundEffect('select');
        this.controllerModal.show();
      };
    }

    // Top Bar Buttons
    const btnHome = document.getElementById('logoTitleHome');
    if (btnHome) {
      btnHome.onclick = () => {
        this.events.onSoundEffect('select');
        this.stateMachine.transitionTo('title');
      };
    }

    const btnQuickPair = document.getElementById('btnQuickPairJoyCons');
    if (btnQuickPair) {
      btnQuickPair.onclick = () => {
        this.events.onSoundEffect('select');
        this.inputManager.forceJoyConRP1 = true;
      };
    }

    const btnFlipAxes = document.getElementById('btnFlipJoyConAxes');
    if (btnFlipAxes) {
      btnFlipAxes.onclick = () => {
        const flipped = this.inputManager.toggleFlipAxes();
        this.controllerModal.syncFlipAxesCheckbox(flipped);
        this.events.onSoundEffect('select');
      };
    }

    const btnOpenGrip = document.getElementById('btnOpenGripModal');
    if (btnOpenGrip) {
      btnOpenGrip.onclick = () => {
        this.events.onSoundEffect('select');
        this.controllerModal.show('keyboard');
      };
    }

    const btnControlsHint = document.getElementById('btnOpenControlsHint');
    if (btnControlsHint) {
      btnControlsHint.onclick = () => {
        this.events.onSoundEffect('select');
        this.controllerModal.show('keyboard');
      };
    }

    if (this.leaveBattleBtn) {
      this.leaveBattleBtn.onclick = () => {
        this.events.onExitMatch();
      };
    }

    // React to State Changes
    this.stateMachine.onStateChange((newState) => {
      this.handleStateTransition(newState);
    });

    this.handleStateTransition(this.stateMachine.state);
  }

  private handleStateTransition(state: MatchState): void {
    if (this.titleScreenEl) this.titleScreenEl.classList.toggle('hidden', state !== 'title');
    if (state === 'css') this.css.show(); else this.css.hide();
    if (state === 'sss') this.sss.show(); else this.sss.hide();
    if (state === 'podium') this.podium.show([]); else this.podium.hide();

    const isBrawl = state === 'brawl';
    if (this.matchBadgeEl) this.matchBadgeEl.classList.toggle('hidden', !isBrawl);
    if (this.leaveBattleBtn) this.leaveBattleBtn.classList.toggle('hidden', !isBrawl);

    if (isBrawl) {
      this.hud.show();
    } else {
      this.hud.hide();
    }

    this.inputManager.cursor.setBrawlActive(isBrawl);
  }

  public showPodium(fighters: Fighter[]): void {
    this.podium.show(fighters);
  }
}
