export type PlayerSlotMode = 'HUMAN' | 'CPU' | 'NONE';

export type ControllerDeviceType = 'gamepad' | 'keyboard' | 'cpu';

export type JoyConType = 'joycon-l' | 'joycon-r' | 'standard' | 'unknown';

export interface ControllerInput {
  neutralX: number; // Normalized horizontal axis -1.0 to 1.0
  neutralY: number; // Normalized vertical axis -1.0 to 1.0
  jump: boolean;
  jab: boolean;
  smash: boolean;
  special: boolean;
  shield: boolean;
  pause?: boolean;
}

export interface PlayerSlot {
  id: number;
  label: string;
  mode: PlayerSlotMode;
  fighterId: string;
  color: string;
  deviceType: ControllerDeviceType;
  gpIndex: number;
  keyboardPlayerIndex?: 1 | 2;
}

export interface JoyConCalibration {
  flipAxes: boolean;
  deadzone: number;
}
