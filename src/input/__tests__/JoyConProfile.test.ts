import { describe, it, expect, beforeEach } from 'vitest';
import { JoyConProfile } from '../JoyConProfile';

describe('JoyConProfile Hardware Mapping', () => {
  beforeEach(() => {
    JoyConProfile.calibration.flipAxes = false;
    JoyConProfile.calibration.deadzone = 0.15;
  });

  it('should identify Joy-Con L and R from device identifiers', () => {
    expect(JoyConProfile.identifyDevice('Joy-Con (R) (Vendor: 057e Product: 2007)')).toBe('joycon-r');
    expect(JoyConProfile.identifyDevice('Joy-Con (L) (Vendor: 057e Product: 2006)')).toBe('joycon-l');
    expect(JoyConProfile.identifyDevice('Wireless Gamepad 057e-2007')).toBe('joycon-r');
    expect(JoyConProfile.identifyDevice('Xbox 360 Controller (XInput Standard Gamepad)')).toBe('standard');
  });

  it('should map horizontal Joy-Con (R) axes: stickX = -rawAxisY, stickY = rawAxisX', () => {
    // Mock Gamepad with raw stick: Y = 0.8 (pushing right in horizontal orientation), X = 0
    const mockGamepad = {
      id: 'Joy-Con (R)',
      connected: true,
      axes: [0, 0.8, 0, 0],
      buttons: new Array(18).fill({ pressed: false, value: 0 }),
    } as unknown as Gamepad;

    const input = JoyConProfile.mapGamepadToInput(mockGamepad);

    // stickX = -rawAxisY = -0.8 normalized
    expect(input.neutralX).toBeLessThan(-0.5);
    expect(input.neutralY).toBeCloseTo(0, 1);
  });

  it('should invert axes when flipAxes is enabled', () => {
    const mockGamepad = {
      id: 'Joy-Con (R)',
      connected: true,
      axes: [0, 0.8, 0, 0],
      buttons: new Array(18).fill({ pressed: false, value: 0 }),
    } as unknown as Gamepad;

    JoyConProfile.calibration.flipAxes = true;
    const inputFlipped = JoyConProfile.mapGamepadToInput(mockGamepad);

    // Flipped stickX = -(-rawAxisY) = +0.8 normalized
    expect(inputFlipped.neutralX).toBeGreaterThan(0.5);
  });

  it('should eliminate stick drift within radial deadzone', () => {
    const mockGamepad = {
      id: 'Standard Gamepad',
      connected: true,
      axes: [0.10, 0.08], // magnitude hypot(0.1, 0.08) = 0.128 < 0.15 deadzone
      buttons: new Array(18).fill({ pressed: false, value: 0 }),
    } as unknown as Gamepad;

    const input = JoyConProfile.mapGamepadToInput(mockGamepad);
    expect(input.neutralX).toBe(0);
    expect(input.neutralY).toBe(0);
  });
});
