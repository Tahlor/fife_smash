import { ControllerInput, PlayerSlot } from '../types/input';
import { GamepadDriver } from './GamepadDriver';
import { KeyboardDriver } from './KeyboardDriver';
import { JoyConProfile } from './JoyConProfile';
import { VirtualCursor } from './VirtualCursor';

export class InputManager {
  private gamepadDriver: GamepadDriver;
  private keyboardDriver: KeyboardDriver;
  public cursor: VirtualCursor;
  public forceJoyConRP1: boolean = false;

  constructor() {
    this.gamepadDriver = new GamepadDriver();
    this.keyboardDriver = new KeyboardDriver();
    this.cursor = new VirtualCursor();
  }

  public get flipJoyConAxes(): boolean {
    return JoyConProfile.calibration.flipAxes;
  }

  public set flipJoyConAxes(value: boolean) {
    JoyConProfile.calibration.flipAxes = value;
  }

  public toggleFlipAxes(): boolean {
    JoyConProfile.calibration.flipAxes = !JoyConProfile.calibration.flipAxes;
    return JoyConProfile.calibration.flipAxes;
  }

  public pollPlayerInput(slot: PlayerSlot): ControllerInput {
    if (slot.mode !== 'HUMAN') {
      return {
        neutralX: 0,
        neutralY: 0,
        jump: false,
        jab: false,
        smash: false,
        special: false,
        shield: false,
      };
    }

    // 1. Poll Gamepad if assigned
    const forceR = slot.id === 0 && this.forceJoyConRP1;
    const gpInput = this.gamepadDriver.pollGamepad(slot.gpIndex, forceR);

    // Check if gamepad provided meaningful input
    const gpActive =
      Math.abs(gpInput.neutralX) > 0.1 ||
      Math.abs(gpInput.neutralY) > 0.1 ||
      gpInput.jump ||
      gpInput.jab ||
      gpInput.smash ||
      gpInput.special ||
      gpInput.shield;

    if (gpActive) {
      return gpInput;
    }

    // 2. Fall back to Keyboard for Slot 0 (P1) and Slot 1 (P2)
    if (slot.id === 0) {
      const kbInput = this.keyboardDriver.pollPlayer(1);
      return this.mergeInputs(gpInput, kbInput);
    } else if (slot.id === 1) {
      const kbInput = this.keyboardDriver.pollPlayer(2);
      return this.mergeInputs(gpInput, kbInput);
    }

    return gpInput;
  }

  public updateCursor(): void {
    // Poll Player 1 input to drive virtual cursor
    const p1Input = this.pollPlayerInput({
      id: 0,
      label: 'P1',
      mode: 'HUMAN',
      fighterId: 'vanguard',
      color: '#ef4444',
      deviceType: 'gamepad',
      gpIndex: 0,
    });
    this.cursor.update(p1Input);
  }

  private mergeInputs(a: ControllerInput, b: ControllerInput): ControllerInput {
    return {
      neutralX: Math.abs(a.neutralX) > Math.abs(b.neutralX) ? a.neutralX : b.neutralX,
      neutralY: Math.abs(a.neutralY) > Math.abs(b.neutralY) ? a.neutralY : b.neutralY,
      jump: a.jump || b.jump,
      jab: a.jab || b.jab,
      smash: a.smash || b.smash,
      special: a.special || b.special,
      shield: a.shield || b.shield,
      pause: a.pause || b.pause,
    };
  }

  public getConnectedDevices() {
    return this.gamepadDriver.getConnectedDevices();
  }
}
