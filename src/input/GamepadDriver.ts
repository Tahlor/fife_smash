import { ControllerInput } from '../types/input';
import { JoyConProfile } from './JoyConProfile';

export class GamepadDriver {
  private static readonly EMPTY_INPUT: ControllerInput = {
    neutralX: 0,
    neutralY: 0,
    jump: false,
    jab: false,
    smash: false,
    special: false,
    shield: false,
    pause: false,
  };

  /**
   * Polls the physical gamepad at the exact specified hardware index.
   * Guarantees strict isolation: returns empty input if the gamepad is not connected
   * or if the index is out of range.
   */
  public pollGamepad(gpIndex: number, forceJoyConR: boolean = false): ControllerInput {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) {
      return { ...GamepadDriver.EMPTY_INPUT };
    }

    const gamepads = navigator.getGamepads();
    if (!gamepads || gpIndex < 0 || gpIndex >= gamepads.length) {
      return { ...GamepadDriver.EMPTY_INPUT };
    }

    const gp = gamepads[gpIndex];
    if (!gp || !gp.connected) {
      return { ...GamepadDriver.EMPTY_INPUT };
    }

    return JoyConProfile.mapGamepadToInput(gp, forceJoyConR);
  }

  /**
   * Returns list of currently connected gamepads with index and ID info.
   */
  public getConnectedDevices(): Array<{ index: number; id: string; type: string }> {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return [];

    const list: Array<{ index: number; id: string; type: string }> = [];
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      const gp = gamepads[i];
      if (gp && gp.connected) {
        list.push({
          index: i,
          id: gp.id,
          type: JoyConProfile.identifyDevice(gp.id),
        });
      }
    }
    return list;
  }
}
