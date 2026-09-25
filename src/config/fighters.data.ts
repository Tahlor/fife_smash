import { FighterConfig } from '../types/entity';

export const FIGHTERS: readonly FighterConfig[] = [
  { id: 'vanguard', name: 'Vanguard', emoji: '⚔️', role: 'Paladin', weight: 1.05, speed: 4.8, jump: 11.5, color: '#eab308', specialType: 'holy_beam', desc: 'Balanced holy knight with Excalibur beam.' },
  { id: 'specter', name: 'Specter', emoji: '🗡️', role: 'Void Rogue', weight: 0.85, speed: 5.8, jump: 12.2, color: '#a855f7', specialType: 'void_kunai', desc: 'Blazing agility and shadow kunai.' },
  { id: 'titan', name: 'Titan', emoji: '🗿', role: 'Colossus', weight: 1.35, speed: 3.6, jump: 10.0, color: '#78716c', specialType: 'rock_meteor', desc: 'Unstoppable hyper-armor heavy juggernaut.' },
  { id: 'volt', name: 'Volt', emoji: '⚡', role: 'Electro Raiju', weight: 0.90, speed: 5.6, jump: 12.5, color: '#38bdf8', specialType: 'chain_lightning', desc: 'Rapid electric lunges and chain bolts.' },
  { id: 'glacia', name: 'Glacia', emoji: '❄️', role: 'Cryo Sorceress', weight: 0.92, speed: 4.6, jump: 11.8, color: '#06b6d4', specialType: 'ice_shards', desc: 'Zoning specialist with freezing crystals.' },
  { id: 'ignis', name: 'Ignis', emoji: '🐉', role: 'Dragon Brawler', weight: 1.18, speed: 4.4, jump: 11.2, color: '#ef4444', specialType: 'fire_breath', desc: 'Heavy fiery brawler with dragon breath.' },
  { id: 'zephyr', name: 'Zephyr', emoji: '🦅', role: 'Valkyrie', weight: 0.82, speed: 5.5, jump: 13.5, color: '#22c55e', specialType: 'tornado_blade', desc: 'Unmatched aerial recovery and wind cut.' },
  { id: 'kage', name: 'Kage', emoji: '🦊', role: 'Kitsune', weight: 0.88, speed: 5.4, jump: 12.0, color: '#f97316', specialType: 'foxfire_orb', desc: 'Mystic fox trickster with homing foxfire.' },
  { id: 'solaria', name: 'Solaria', emoji: '☀️', role: 'Sun Empress', weight: 1.02, speed: 4.7, jump: 11.6, color: '#fbbf24', specialType: 'solar_flare', desc: 'Radiant burst attacks that knock upward.' },
  { id: 'umbra', name: 'Umbra', emoji: '🌑', role: 'Reaper', weight: 1.08, speed: 4.5, jump: 11.4, color: '#6366f1', specialType: 'dark_scythe', desc: 'Wide scythe sweeps that pull opponents in.' },
  { id: 'toxis', name: 'Toxis', emoji: '🐍', role: 'Venom Viper', weight: 0.95, speed: 5.1, jump: 11.7, color: '#10b981', specialType: 'venom_spit', desc: 'Corrosive poison lingering projectiles.' },
  { id: 'chrono', name: 'Chrono', emoji: '⏳', role: 'Time Warden', weight: 0.98, speed: 4.9, jump: 11.9, color: '#e2e8f0', specialType: 'time_warp', desc: 'Spatial warps and quick teleport counter.' },
  { id: 'terra', name: 'Terra', emoji: '🐗', role: 'Iron Boar', weight: 1.28, speed: 4.0, jump: 10.5, color: '#b45309', specialType: 'boar_charge', desc: 'Charging juggernaut with knockdown tusks.' },
  { id: 'gale', name: 'Gale', emoji: '🌪️', role: 'Storm Monk', weight: 0.94, speed: 5.3, jump: 12.3, color: '#3b82f6', specialType: 'gale_kick', desc: 'Martial arts fighter with storm combos.' },
  { id: 'pulse', name: 'Pulse', emoji: '🤖', role: 'Android', weight: 1.12, speed: 4.7, jump: 11.0, color: '#ec4899', specialType: 'plasma_blaster', desc: 'Futuristic arsenal with explosive zoning.' },
  { id: 'blossom', name: 'Blossom', emoji: '🌸', role: 'Druid', weight: 0.86, speed: 5.2, jump: 12.4, color: '#f472b6', specialType: 'petal_storm', desc: 'Whip spacing master with floral traps.' },
  { id: 'fang', name: 'Fang', emoji: '🐺', role: 'Werewolf', weight: 1.06, speed: 5.4, jump: 12.1, color: '#64748b', specialType: 'lunge_claw', desc: 'Aggressive rushdown beast with lunge.' },
  { id: 'siren', name: 'Siren', emoji: '🧜‍♀️', role: 'Tide Empress', weight: 0.92, speed: 4.8, jump: 11.7, color: '#0ea5e9', specialType: 'tidal_wave', desc: 'Hydrokinetic wave pusher with long-range sweep.' },
  { id: 'spark', name: 'Spark', emoji: '🧨', role: 'Bomber', weight: 0.80, speed: 5.7, jump: 12.6, color: '#f59e0b', specialType: 'bounce_bomb', desc: 'Chaotic explosives that bounce across platforms.' },
  { id: 'aegis', name: 'Aegis', emoji: '🛡️', role: 'Guardian', weight: 1.40, speed: 3.3, jump: 9.8, color: '#94a3b8', specialType: 'shield_bash', desc: 'Impenetrable shield with projectile deflection.' },
  { id: 'mirage', name: 'Mirage', emoji: '🎭', role: 'Illusionist', weight: 0.87, speed: 5.2, jump: 12.0, color: '#c084fc', specialType: 'mirror_clone', desc: 'Cloning trickster that confuses enemy hits.' },
  { id: 'nova', name: 'Nova', emoji: '🌌', role: 'Cosmic', weight: 1.00, speed: 5.0, jump: 12.5, color: '#8b5cf6', specialType: 'black_hole', desc: 'Micro black hole pulls opponents inward.' },
  { id: 'apex', name: 'Apex', emoji: '🦖', role: 'Saurian Rex', weight: 1.32, speed: 4.1, jump: 10.4, color: '#15803d', specialType: 'rex_bite', desc: 'Crushing bite attacks with immense knockback.' },
  { id: 'helix', name: 'Helix', emoji: '🧬', role: 'Shapeshifter', weight: 0.96, speed: 5.1, jump: 11.8, color: '#14b8a6', specialType: 'dna_whip', desc: 'Elongating limbs that adapt to distance.' },
  { id: 'ronin', name: 'Ronin', emoji: '👺', role: 'Samurai', weight: 1.00, speed: 5.3, jump: 11.9, color: '#dc2626', specialType: 'iaijutsu_slash', desc: 'Precision edge attacks with sweet-spot tips.' },
  { id: 'blizzard', name: 'Blizzard', emoji: '🐻', role: 'Polar Bear', weight: 1.38, speed: 3.5, jump: 9.9, color: '#bae6fd', specialType: 'avalanche_slam', desc: 'Massive frozen brawler with armor on smashes.' },
  { id: 'eclipse', name: 'Eclipse', emoji: '🦇', role: 'Vampire', weight: 0.91, speed: 5.4, jump: 12.8, color: '#881337', specialType: 'bat_swarm', desc: 'Multi-jump flight and draining dark attacks.' },
  { id: 'vulcan', name: 'Vulcan', emoji: '🔨', role: 'Forge Master', weight: 1.25, speed: 3.9, jump: 10.6, color: '#ea580c', specialType: 'anvil_drop', desc: 'Fiery forge hammer with burning ground.' },
  { id: 'cinder', name: 'Cinder', emoji: '🔥', role: 'Archer', weight: 0.84, speed: 5.6, jump: 13.0, color: '#f97316', specialType: 'flame_arrow', desc: 'Rapid archery zoning with piercing flame arrows.' },
  { id: 'abyss', name: 'Abyss', emoji: '🐙', role: 'Kraken Priest', weight: 1.20, speed: 4.2, jump: 11.0, color: '#047857', specialType: 'tentacle_slam', desc: 'Deep sea tentacles that blind and knock back.' }
];

export function getFighterById(id: string): FighterConfig {
  const f = FIGHTERS.find(fighter => fighter.id === id);
  return f ?? FIGHTERS[0];
}
