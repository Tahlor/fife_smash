import { StageConfig } from '../types/entity';

export const STAGES: readonly StageConfig[] = [
  {
    id: 'celestial',
    name: 'Celestial Haven',
    w: 840,
    h: 26,
    platforms: [
      { x: -200, y: -110, w: 140, isPassThrough: true },
      { x: 60, y: -110, w: 140, isPassThrough: true },
      { x: -70, y: -210, w: 140, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#0f172a"/><circle cx="50" cy="18" r="14" fill="#fbbf24" opacity="0.35"/><rect x="20" y="44" width="60" height="8" rx="2" fill="#38bdf8"/></svg>`,
  },
  {
    id: 'void',
    name: 'Astral Void',
    w: 760,
    h: 28,
    platforms: [
      { x: -150, y: -120, w: 130, isPassThrough: true },
      { x: 20, y: -120, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#030712"/><circle cx="50" cy="30" r="18" fill="#6366f1" opacity="0.45"/><rect x="25" y="46" width="50" height="6" rx="2" fill="#818cf8"/></svg>`,
  },
  {
    id: 'cyber',
    name: 'Neo Cyber City',
    w: 860,
    h: 26,
    platforms: [
      { x: -220, y: -105, w: 130, isPassThrough: true },
      { x: 90, y: -105, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#0d081f"/><rect x="22" y="45" width="56" height="7" rx="2" fill="#06b6d4"/></svg>`,
  },
  {
    id: 'volcano',
    name: 'Molten Caldera',
    w: 800,
    h: 30,
    platforms: [
      { x: -160, y: -130, w: 140, isPassThrough: true },
      { x: 20, y: -130, w: 140, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#1c0a0a"/><polygon points="20,60 50,25 80,60" fill="#dc2626" opacity="0.35"/><rect x="24" y="46" width="52" height="8" rx="2" fill="#ea580c"/></svg>`,
  },
  {
    id: 'forest',
    name: 'Whispering Grove',
    w: 820,
    h: 28,
    platforms: [
      { x: -210, y: -100, w: 130, isPassThrough: true },
      { x: 80, y: -100, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#052e16"/><rect x="22" y="45" width="56" height="8" rx="2" fill="#16a34a"/></svg>`,
  },
  {
    id: 'glacier',
    name: 'Cryo Spire',
    w: 780,
    h: 26,
    platforms: [
      { x: -170, y: -125, w: 130, isPassThrough: true },
      { x: 40, y: -125, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#082f49"/><rect x="24" y="46" width="52" height="7" rx="2" fill="#0ea5e9"/></svg>`,
  },
  {
    id: 'desert',
    name: 'Sunken Oasis',
    w: 850,
    h: 26,
    platforms: [
      { x: -230, y: -110, w: 130, isPassThrough: true },
      { x: 100, y: -110, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#292524"/><rect x="22" y="46" width="56" height="7" rx="2" fill="#d97706"/></svg>`,
  },
  {
    id: 'crypt',
    name: 'Haunted Crypt',
    w: 800,
    h: 28,
    platforms: [
      { x: -180, y: -115, w: 120, isPassThrough: true },
      { x: 60, y: -115, w: 120, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#18181b"/><rect x="25" y="46" width="50" height="8" rx="2" fill="#52525b"/></svg>`,
  },
  {
    id: 'trench',
    name: 'Abyssal Trench',
    w: 840,
    h: 26,
    platforms: [
      { x: -200, y: -115, w: 130, isPassThrough: true },
      { x: 70, y: -115, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#022c22"/><rect x="22" y="45" width="56" height="8" rx="2" fill="#0f766e"/></svg>`,
  },
  {
    id: 'clock',
    name: 'Clockwork Spire',
    w: 790,
    h: 28,
    platforms: [
      { x: -160, y: -120, w: 130, isPassThrough: true },
      { x: 30, y: -120, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#262626"/><rect x="24" y="46" width="52" height="7" rx="2" fill="#a16207"/></svg>`,
  },
  {
    id: 'thunder',
    name: 'Thunder Peak',
    w: 830,
    h: 26,
    platforms: [
      { x: -210, y: -110, w: 130, isPassThrough: true },
      { x: 80, y: -110, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#1e1b4b"/><rect x="22" y="46" width="56" height="7" rx="2" fill="#4338ca"/></svg>`,
  },
  {
    id: 'neon',
    name: 'Synth Highway',
    w: 850,
    h: 26,
    platforms: [
      { x: -180, y: -120, w: 130, isPassThrough: true },
      { x: 50, y: -120, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#18042b"/><rect x="22" y="46" width="56" height="7" rx="2" fill="#d946ef"/></svg>`,
  },
  {
    id: 'dojo',
    name: 'Imperial Pagoda',
    w: 810,
    h: 28,
    platforms: [
      { x: -190, y: -110, w: 130, isPassThrough: true },
      { x: 60, y: -110, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#311111"/><rect x="24" y="46" width="52" height="7" rx="2" fill="#991b1b"/></svg>`,
  },
  {
    id: 'colosseum',
    name: 'Grand Colosseum',
    w: 880,
    h: 26,
    platforms: [
      { x: -240, y: -110, w: 140, isPassThrough: true },
      { x: 100, y: -110, w: 140, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#1c1917"/><rect x="20" y="46" width="60" height="7" rx="2" fill="#57534e"/></svg>`,
  },
  {
    id: 'atlantis',
    name: 'Sunken Atlantis',
    w: 830,
    h: 28,
    platforms: [
      { x: -200, y: -115, w: 130, isPassThrough: true },
      { x: 70, y: -115, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#062534"/><rect x="22" y="46" width="56" height="7" rx="2" fill="#0284c7"/></svg>`,
  },
  {
    id: 'canopy',
    name: 'Mushroom Canopy',
    w: 800,
    h: 28,
    platforms: [
      { x: -170, y: -125, w: 130, isPassThrough: true },
      { x: 40, y: -125, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#271033"/><rect x="24" y="46" width="52" height="8" rx="2" fill="#9333ea"/></svg>`,
  },
  {
    id: 'crystal',
    name: 'Crystal Cavern',
    w: 820,
    h: 26,
    platforms: [
      { x: -210, y: -110, w: 130, isPassThrough: true },
      { x: 80, y: -110, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#130924"/><rect x="22" y="46" width="56" height="7" rx="2" fill="#7e22ce"/></svg>`,
  },
  {
    id: 'skyship',
    name: 'Sky Cruiser',
    w: 780,
    h: 26,
    platforms: [
      { x: -160, y: -120, w: 120, isPassThrough: true },
      { x: 40, y: -120, w: 120, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#1e293b"/><rect x="24" y="46" width="52" height="7" rx="2" fill="#64748b"/></svg>`,
  },
  {
    id: 'matrix',
    name: 'Matrix Nexus',
    w: 850,
    h: 26,
    platforms: [
      { x: -220, y: -110, w: 130, isPassThrough: true },
      { x: 90, y: -110, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#021a0a"/><rect x="22" y="46" width="56" height="7" rx="2" fill="#15803d"/></svg>`,
  },
  {
    id: 'inferno',
    name: 'Infernal Core',
    w: 800,
    h: 30,
    platforms: [
      { x: -180, y: -125, w: 130, isPassThrough: true },
      { x: 50, y: -125, w: 130, isPassThrough: true },
    ],
    art: `<svg viewBox="0 0 100 60" class="w-full h-full"><rect width="100" height="60" fill="#210303"/><rect x="24" y="46" width="52" height="8" rx="2" fill="#b91c1c"/></svg>`,
  },
];

export function getStageById(id: string): StageConfig {
  const s = STAGES.find(stage => stage.id === id);
  return s ?? STAGES[0];
}
