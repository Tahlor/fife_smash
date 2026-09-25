import { JoyConType, ControllerInput, JoyConCalibration } from '../types/input';
import { ENGINE_CONSTANTS } from '../config/constants';

export class JoyConProfile {
  private static defaultCalibration: JoyConCalibration = {
    flipAxes: false,
    deadzone: ENGINE_CONSTANTS.RADIAL_DEADZONE,
  };

  public static calibration: JoyConCalibration = { ...JoyConProfile.defaultCalibration };

  /**
   * Identifies the controller type from the Gamepad ID string.
   */
  public static identifyDevice(idString: string): JoyConType {
    const lower = idString.toLowerCase();
    if (lower.includes('joy-con (r)') || lower.includes('joy-con r') || lower.includes('057e-2007')) {
      return 'joycon-r';
    }
    if (lower.includes('joy-con (l)') || lower.includes('joy-con l') || lower.includes('057e-2006')) {
      return 'joycon-l';
    }
    if (lower.includes('joy-con') || lower.includes('057e')) {
      // Generic Joy-Con string, check if right or left
      if (lower.includes('right') || lower.includes('(r)')) return 'joycon-r';
      if (lower.includes('left') || lower.includes('(l)')) return 'joycon-l';
      return 'joycon-r'; // default assumption for single joycon
    }
    return 'standard';
  }

  /**
   * Translates raw Gamepad state into an abstract Virtual Controller Input frame
   * with horizontal Joy-Con coordinate transformations and radial deadzones.
   */
  public static mapGamepadToInput(gp: Gamepad, forceJoyConR: boolean = false): ControllerInput {
    const deviceType = forceJoyConR ? 'joycon-r' : this.identifyDevice(gp.id);
    const deadzone = this.calibration.deadzone;

    let rawX = 0;
    let rawY = 0;

    const btn = (index: number): boolean => {
      const b = gp.buttons[index];
      return Boolean(b && (b.pressed || b.value > 0.4));
    };

    if (deviceType === 'joycon-r') {
      // Joy-Con (R) horizontal mapping:
      // Raw stick is rotated 90 degrees: stickX = -rawAxisY, stickY = rawAxisX
      const ax0 = gp.axes[0] ?? 0;
      const ax1 = gp.axes[1] ?? 0;
      const ax2 = gp.axes[2] ?? 0;
      const ax3 = gp.axes[3] ?? 0;

      // Some drivers place stick on axes 2/3 instead of 0/1
      const activeX = Math.abs(ax2) > deadzone ? ax2 : (Math.abs(ax0) > deadzone ? ax0 : 0);
      const activeY = Math.abs(ax3) > deadzone ? ax3 : (Math.abs(ax1) > deadzone ? ax1 : 0);

      // Section 5.1: stickX = -rawAxisY, stickY = rawAxisX
      rawX = -activeY;
      rawY = activeX;

      if (this.calibration.flipAxes) {
        rawX = -rawX;
        rawY = -rawY;
      }
    } else if (deviceType === 'joycon-l') {
      // Joy-Con (L) horizontal mapping:
      const ax0 = gp.axes[0] ?? 0;
      const ax1 = gp.axes[1] ?? 0;
      const activeX = Math.abs(ax0) > deadzone ? ax0 : 0;
      const activeY = Math.abs(ax1) > deadzone ? ax1 : 0;

      // Joy-Con (L) rotated 90 degrees opposite
      rawX = activeY;
      rawY = -activeX;

      if (this.calibration.flipAxes) {
        rawX = -rawX;
        rawY = -rawY;
      }
    } else {
      // Standard Gamepad (XInput, DualShock, Generic USB)
      const ax0 = gp.axes[0] ?? 0;
      const ax1 = gp.axes[1] ?? 0;
      rawX = Math.abs(ax0) > deadzone ? ax0 : 0;
      rawY = Math.abs(ax1) > deadzone ? ax1 : 0;
    }

    // Radial deadzone filtering
    const magnitude = Math.hypot(rawX, rawY);
    let neutralX = 0;
    let neutralY = 0;
    if (magnitude > deadzone) {
      const normalizedMagnitude = Math.min(1.0, (magnitude - deadzone) / (1.0 - deadzone));
      neutralX = (rawX / magnitude) * normalizedMagnitude;
      neutralY = (rawY / magnitude) * normalizedMagnitude;
    }

    // Button mapping based on hardware layout
    let jump = false;
    let jab = false;
    let smash = false;
    let special = false;
    let shield = false;

    if (deviceType === 'joycon-r' || deviceType === 'joycon-l') {
      // In horizontal orientation:
      // Face buttons: 0, 1, 2, 3 (A/B/X/Y)
      // Shoulder buttons: 4, 5 (SL, SR), 6, 7 (L/R, ZL/ZR)
      jump = btn(0) || btn(1) || btn(12) || neutralY < -0.55;
      jab = btn(2) || btn(14);
      special = btn(3) || btn(15);
      shield = btn(4) || btn(5) || btn(6) || btn(7);
      smash = Math.abs(neutralX) > 0.70 && jab;
    } else {
      // Standard controller (Xbox A=0, B=1, X=2, Y=3; LB=4, RB=5, LT=6, RT=7; D-Pad=12-15)
      jump = btn(0) || btn(3) || btn(12) || neutralY < -0.55;
      jab = btn(2) || btn(14);
      special = btn(1) || btn(15);
      shield = btn(4) || btn(5) || btn(6) || btn(7);
      smash = (Math.abs(neutralX) > 0.70 && jab) || btn(9); // Right stick click or smash threshold
    }

    const pause = btn(9) || btn(16) || btn(17);

    return {
      neutralX,
      neutralY,
      jump,
      jab,
      smash,
      special,
      shield,
      pause,
    };
  }
}
