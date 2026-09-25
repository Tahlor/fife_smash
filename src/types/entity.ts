export type SpecialMoveType =
  | 'holy_beam'
  | 'void_kunai'
  | 'rock_meteor'
  | 'chain_lightning'
  | 'ice_shards'
  | 'fire_breath'
  | 'tornado_blade'
  | 'foxfire_orb'
  | 'solar_flare'
  | 'dark_scythe'
  | 'venom_spit'
  | 'time_warp'
  | 'boar_charge'
  | 'gale_kick'
  | 'plasma_blaster'
  | 'petal_storm'
  | 'lunge_claw'
  | 'tidal_wave'
  | 'bounce_bomb'
  | 'shield_bash'
  | 'mirror_clone'
  | 'black_hole'
  | 'rex_bite'
  | 'dna_whip'
  | 'iaijutsu_slash'
  | 'avalanche_slam'
  | 'bat_swarm'
  | 'anvil_drop'
  | 'flame_arrow'
  | 'tentacle_slam';

export interface FighterConfig {
  id: string;
  name: string;
  emoji: string;
  role: string;
  weight: number;
  speed: number;
  jump: number;
  color: string;
  specialType: SpecialMoveType;
  desc: string;
}

export interface PlatformConfig {
  x: number;
  y: number;
  w: number;
  h?: number;
  isPassThrough?: boolean;
  isTemporary?: boolean;
}

export interface StageConfig {
  id: string;
  name: string;
  w: number;
  h: number;
  platforms: PlatformConfig[];
  art: string;
}

export interface BlastZoneBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
