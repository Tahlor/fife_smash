# Smash Arena Ultimate (`fife_smash`)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-1.6+-729B1B.svg)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

A high-performance, modular 2D arena platform fighter engine and game built from first principles in TypeScript. Features 30 unique procedural fighters, 20 vector battle stages, deterministic 60 Hz physics simulation, strict hardware multi-controller isolation, horizontal Nintendo Switch Joy-Con profiling, procedural Web Audio sound synthesis, and automated deployment pipelines for the host server **Archimedes**.

---

## 🎮 Highlights & Key Features

- **Decoupled Simulation & Render Loop:** Deterministic 60 Hz physics accumulator ($16.666\text{ms}$ per tick) independent of display refresh rates (60Hz, 120Hz, 144Hz, 240Hz), with fractional sub-frame alpha interpolation.
- **Data-Driven Entity Design:** 30 unique fighters and 20 stages configured through typed schemas, fully separated from rendering and collision math.
- **Strict Input Abstraction Layer:** Translates raw browser hardware inputs into normalized virtual controller frames. Supports up to 8 isolated player slots with zero cross-controller input bleed.
- **Horizontal Joy-Con Hardware Profiling:** Dedicated coordinate rotation ($\text{stickX} = -\text{rawAxisY}, \text{stickY} = \text{rawAxisX}$), user-toggleable axis polarity inversion (`flipJoyConAxes`), and radial deadzones ($0.15$).
- **Authentic Combat Math:** Knockback velocity scaling formula:
  $$V_k = \frac{\left( \left( \frac{D}{10} + \frac{D \cdot B}{20} \right) \cdot \frac{200}{W + 100} \cdot 1.4 \right) + 18}{W} \cdot K_s$$
  Includes proportional hitstun ($\lfloor V_k \cdot 1.6 \rfloor$), Directional Influence (DI), 5-second ($300$ ticks) respawn invulnerability on temporary platforms, and edge-guarding blast zones.
- **Zero-Asset Procedural Audio:** Procedural Web Audio synthesizer generating jumps, light jabs, smash impacts, shields, specials, and blast explosions.
- **Production-Ready Deployment:** Multi-stage Dockerfile, optimized Nginx configuration, automated host deployment script (`deploy-archimedes.sh`), and GitHub Actions CI/CD for **Archimedes**.

---

## 📁 Project Structure

```text
fife_smash/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline to Archimedes
├── docker/
│   ├── Dockerfile                  # Multi-stage production build (Node build -> Nginx)
│   └── nginx.conf                  # Production HTTP headers, caching & gzip
├── docs/
│   ├── ARCHITECTURE.md             # Complete system architecture and engine lifecycle
│   ├── CONTROLLERS.md              # Joy-Con pairing & Web Gamepad API integration guide
│   └── DEPLOYMENT.md               # Guide for deploying and managing on Archimedes
├── src/
│   ├── audio/
│   │   ├── AudioManager.ts         # Master audio listener, volume controls, SFX bank
│   │   └── SoundSynthesizer.ts     # Procedural Web Audio synth (jumps, hits, blasts)
│   ├── config/
│   │   ├── constants.ts            # Global gravity, blast zones, friction, tick rate
│   │   ├── fighters.data.ts        # Typed roster schema for all 30 fighters
│   │   └── stages.data.ts          # Typed stage geometry & platform configs (20 stages)
│   ├── core/
│   │   ├── Engine.ts               # Master coordinator
│   │   ├── GameLoop.ts             # Deterministic accumulator & fixed timestep
│   │   ├── Camera.ts               # Dynamic multi-player tracking & smooth zoom
│   │   └── StateMachine.ts         # Match flow (Title, CSS, SSS, Brawl, Podium)
│   ├── entities/
│   │   ├── Fighter.ts              # Fighter state machine, hurtboxes, damage, stocks
│   │   ├── Projectile.ts           # Active projectiles, lifetime, velocity, collision
│   │   ├── Platform.ts             # Static, pass-through, and temporary spawn platforms
│   │   └── Stage.ts                # Active arena instance & blast boundaries
│   ├── input/
│   │   ├── InputManager.ts         # Master input polling coordinator
│   │   ├── GamepadDriver.ts        # Gamepad API poller with device identification
│   │   ├── JoyConProfile.ts        # Horizontal Joy-Con (L/R) axis mapping & deadzones
│   │   ├── KeyboardDriver.ts       # Configurable 2-player keyboard mapping
│   │   └── VirtualCursor.ts        # Menu cursor management for mouse & controllers
│   ├── physics/
│   │   ├── Collisions.ts           # AABB, Raycast, and circle-box intersection math
│   │   ├── Hitbox.ts               # Damage, angle, base knockback, scaling factor
│   │   └── Knockback.ts            # Knockback calculation based on damage & weight
│   ├── render/
│   │   ├── Renderer.ts             # Canvas pipeline coordinator
│   │   ├── FighterRenderer.ts      # Procedural articulated fighter anatomy & anims
│   │   └── StageRenderer.ts        # Stage backdrop, hazards, platforms & blast lines
│   ├── ui/
│   │   ├── UIManager.ts            # UI view transitions and DOM overlay orchestration
│   │   ├── CharacterSelectScreen.ts# 30-fighter roster grid, slots, ready logic
│   │   ├── StageSelectScreen.ts    # 20-stage selection grid
│   │   ├── BattleHUD.ts            # Dynamic stock icons, damage %, name tags
│   │   ├── PodiumScreen.ts         # Results screen, rankings, return to CSS
│   │   └── ControllerModal.ts      # Grip/Order setup, calibration, axes flip UI
│   ├── types/
│   │   ├── combat.ts               # Hitbox, damage, attack types, state enum
│   │   ├── entity.ts               # Fighter and Stage data contracts
│   │   └── input.ts                # Input payload, controller profiles, modes
│   ├── index.html                  # HTML entry point
│   ├── main.ts                     # Bootstrap entry point
│   └── Stage.ts                    # Entity Stage re-export
├── deploy-archimedes.sh            # Production deployment script for Archimedes
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # Strict TypeScript compiler options
├── vite.config.ts                  # Vite build tool configuration & path aliases
└── README.md                       # Master documentation
```

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js 20+ LTS
- npm 10+

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start local development server with Hot Module Replacement (HMR)
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Type Checking & Unit Tests
```bash
# Run strict TypeScript compiler verification
npm run typecheck

# Run Vitest test suite (Knockback formulas, Collisions math, Joy-Con profiles)
npm run test

# Build production bundle
npm run build
```

---

## 🎮 Controls

### Single Nintendo Joy-Con (Horizontal)
- **Movement:** Analog Stick
- **Jump:** Bottom / Right face button
- **Jab (Light Attack):** Left face button
- **Smash (Heavy Attack):** Hard stick tilt + Attack
- **Special (Signature Move):** Top face button
- **Shield:** SL or SR shoulder button

### Keyboard (2-Player Local)
- **Player 1:** `A` / `D` (Move), `W` / `Space` (Jump), `Z` / `J` (Jab), `X` / `K` (Smash), `C` / `L` (Special), `Left Shift` / `S` (Shield).
- **Player 2:** `Arrow Keys` (Move & Jump), `N` / `I` (Jab), `M` / `O` (Smash), `/` / `P` (Special), `Right Shift` / `Arrow Down` (Shield).

---

## 🚢 Deployment to Server "Archimedes"

### Direct Host Deployment
```bash
./deploy-archimedes.sh host
```

### Docker Container Deployment
```bash
docker build -t fife_smash -f docker/Dockerfile .
docker run -d -p 80:80 --name fife_smash_prod fife_smash
```

For complete deployment details, see [`docs/DEPLOYMENT.md`](file:///mnt/c/Users/taylo/github/fife_smash/docs/DEPLOYMENT.md).
