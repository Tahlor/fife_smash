export const ENGINE_CONSTANTS = {
  // Tick rate & Fixed timestep
  TICK_RATE: 60,
  FIXED_DELTA_MS: 1000 / 60,
  FIXED_DELTA_SEC: 1 / 60,

  // Global Physics
  GRAVITY: 0.50,
  TERMINAL_VELOCITY: 15.0,
  GROUND_FRICTION: 0.80,
  AIR_FRICTION: 0.92,

  // Respawn & Invulnerability
  SPAWN_PLATFORM_Y: -120,
  SPAWN_PLATFORM_WIDTH: 120,
  SPAWN_PLATFORM_HEIGHT: 12,
  INVULNERABILITY_TICKS: 300, // 5.0 seconds at 60 Hz

  // Blast Boundaries (relative to stage center)
  BLAST_ZONE_X_OFFSET: 500, // extra margin outside stage half-width
  BLAST_ZONE_TOP: -650,
  BLAST_ZONE_BOTTOM: 450,

  // Combat Mechanics
  DEFAULT_STOCKS: 3,
  HITSTUN_SCALING: 1.6,
  MAX_SHIELD_HEALTH: 100,
  SHIELD_DRAIN_RATE: 0.45,
  SHIELD_RECOVER_RATE: 0.16,
  SHIELD_BREAK_STUN_TICKS: 120, // 2 seconds stun on shield break

  // Controls & Gamepads
  RADIAL_DEADZONE: 0.15,
  MAX_PLAYER_SLOTS: 8,
} as const;
