# Master Task Prompt: Architectural Redesign & Production Engineering for `fife_smash`

**Target Repository:** `https://github.com/Tahlor/fife_smash`  
**Execution Context:** Local Autonomous Agent (Claude Code / Cursor / Aider / Devin)  
**Destination Target:** Modular TypeScript/Vite architecture deployable to the production server **Archimedes**

---

## 1. Mission Brief & Executive Summary

You are acting as the Lead Game Engine Architect and Senior Systems Engineer. The repository `Tahlor/fife_smash` currently contains a functional proof-of-concept for an arena platform fighter built as a monolithic single-file HTML/JS document (`index.html`).

Your objective is to **redesign this game from first principles into a clean, modular, and extensible architecture**. You must transition the code from an untyped monolith into a maintainable, high-performance production codebase capable of scaling to hundreds of fighters, advanced combat mechanics, complex stage hazards, and multi-controller input configurations (specifically supporting isolated Left and Right Nintendo Switch Joy-Cons and standard gamepads). Finally, you will package and prepare the project for continuous deployment to the host server **Archimedes**.

---

## 2. Core Architectural Principles

When refactoring, you must strictly adhere to the following principles:

1. **Decoupled Simulation vs. Render Loop (Fixed Timestep):**
   - The game logic and physics simulation must execute at a deterministic 60 Hz tick (`16.666ms` per tick) independent of the browser's display refresh rate (e.g., 60Hz, 120Hz, 144Hz monitors).
   - The render loop must interpolate positions between simulation steps to eliminate stutter while preserving frame-perfect hitboxes and hurtboxes.
2. **Data-Driven Entity Design:**
   - Fighter stats, hitboxes, frame data, and stage geometry must be defined as typed data structures (JSON or TypeScript schemas), separate from the logic that computes collisions or renders sprites/shapes.
3. **Strict Input Abstraction Layer:**
   - Raw browser events (`navigator.getGamepads()`, Keyboard, Pointer) must never be accessed directly by combat entities.
   - An intermediate **Input Management Subsystem** translates raw hardware inputs into abstract virtual controller frames (`neutralX`, `neutralY`, `jump`, `jab`, `smash`, `special`, `shield`, `pause`).
4. **Isolated Controller Pairing & Orientation:**
   - Multi-controller sessions must enforce strict hardware isolation. Input from Gamepad index $N$ must never leak into Player $M$.
   - Explicit hardware profiling must support individual Joy-Cons (L and R) held in horizontal orientation, handling axis flipping, 90-degree rotational coordinate mapping, and deadzones.
5. **Clean Component-Based Separation:**
   - Separate modules for Engine Core, Input Management, Physics & Hitboxes, Entity Components, Audio Synthesizer/WebAudio, UI/Screens, and Assets.
6. **Zero-Fluff Deployment:**
   - Deliver clean containerized or static web server configurations tailored for **Archimedes** (e.g., Docker, Nginx, systemd, or PM2).

---

## 3. Recommended Technology Stack

- **Language:** TypeScript 5.x (Strict mode: `"strict": true`, `"noImplicitAny": true`).
- **Build Tool / Bundler:** Vite (fast HMR, lightweight asset bundling, minimal overhead).
- **Rendering:** High-performance Canvas 2D or PixiJS / WebGL rendering layer with clean procedural vector rendering.
- **Styling / UI Overlay:** Tailwind CSS (configured via PostCSS) or lightweight modular CSS components.
- **Audio:** Web Audio API sound synthesis engine with asset pre-caching capabilities.
- **Code Quality:** ESLint + Prettier configuration.
- **Containerization / Deployment:** Multi-stage Dockerfile with an alpine Nginx server.

---

## 4. Target Project File Structure

You must reorganize the repository to match this structure:

```text
fife_smash/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline to Archimedes
├── docker/
│   ├── Dockerfile                  # Multi-stage production build (Node build -> Nginx)
│   └── nginx.conf                  # Production HTTP/WebSocket headers & gzip config
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
│   │   └── Platform.ts             # Static, pass-through, and temporary spawn platforms
│   └── Stage.ts                # Active arena instance & blast boundaries
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
│   ├── index.html                  # HTML entry point (clean markup)
│   └── main.ts                     # Bootstrap entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 5. Subsystem Specifications

### 5.1. Multi-Gamepad & Joy-Con Subsystem (`src/input/`)

1. **Hardware Identification:**
   - Detect device vendor ID/product ID or identifier string (e.g., `"Joy-Con (L)"`, `"Joy-Con (R)"`, `"Wireless Gamepad"`, standard XInput/DualShock).
2. **Joy-Con Horizontal Mapping:**
   - Joy-Cons used as single controllers must be treated horizontally.
   - For Joy-Con (R): Default raw stick inputs are rotated 90 degrees. Translate raw axis inputs:
     $$\text{stickX} = -\text{rawAxisY}, \quad \text{stickY} = \text{rawAxisX}$$
   - Provide an inversion flag (`flipJoyConAxes`) allowing players to toggle axis polarity if their OS/Bluetooth driver reports opposing values.
3. **Deadzone & Normalization:**
   - Apply a radial deadzone ($0.15$ minimum threshold) to eliminate stick drift before computing directional movement.
4. **Strict Isolation:**
   - Each player slot ($P_1$ to $P_8$) maps to an explicit hardware source ID.
   - A button press on Gamepad index 1 must never trigger an action for Player 1 (Gamepad index 0).

### 5.2. Physics & Combat Engine (`src/physics/` & `src/entities/`)

1. **Knockback Formula:**
   - Knockback velocity ($V_k$) must scale dynamically with current damage ($D$), move base damage ($B$), move knockback scaling ($K_s$), and fighter weight ($W$):
     $$V_k = \frac{\left( \left( \frac{D}{10} + \frac{D \cdot B}{20} \right) \cdot \frac{200}{W + 100} \cdot 1.4 \right) + 18}{W} \cdot K_s$$
2. **Hitstun & Trajectory:**
   - Apply hitstun frames proportional to total launch velocity: $\text{hitstun} = \lfloor V_k \cdot 1.6 \rfloor$.
   - Apply Directional Influence (DI) allowing the victim to nudge their vector during hitstun.
3. **Spawn Platforms & Invulnerability:**
   - Upon match start or respawn, entities spawn on a temporary solid platform at $(0, -120)$.
   - Fighters receive a strict $5.0$-second invulnerability window ($300$ ticks at 60 Hz).
   - If the fighter moves, jumps, or drops off the platform, the platform despawns immediately, but invulnerability persists until the timer elapses.
4. **Off-Screen Recovery & Blast Zones:**
   - Canvas boundaries do not equal blast zones.
   - Configure generous blast boundaries ($+500\text{px}$ horizontal, $-650\text{px}$ ceiling, $+450\text{px}$ floor relative to stage center) to enable edge guarding and aerial recoveries.

### 5.3. Fighter Data & Procedural Rendering (`src/config/` & `src/render/`)

1. **30 Unique Fighters:**
   - Roster must preserve all 30 characters (Vanguard, Specter, Titan, Volt, Glacia, Ignis, Zephyr, Kage, Solaria, Umbra, Toxis, Chrono, Terra, Gale, Pulse, Blossom, Fang, Siren, Spark, Aegis, Mirage, Nova, Apex, Helix, Ronin, Blizzard, Eclipse, Vulcan, Cinder, Abyss).
   - Each fighter configuration must include: `id`, `name`, `emoji`, `role`, `weight`, `speed`, `jumpForce`, `color`, `specialMoveType`, and `description`.
2. **Procedural Articulated Anatomy:**
   - Render fighters with articulated limbs (head, torso, arms, hands, legs, feet) using procedural trigonometry:
     - Breathing idle oscillations.
     - Dynamic running leg swings and arm pumps.
     - Aerial jump crouches, forward leaning, and directional facing.
     - Distinct attack swooshes and elemental projectile visuals.

### 5.4. Stage Catalog (`src/config/stages.data.ts`)

- Implement all 20 unique stages with structured platform dimensions, coordinates, pass-through collision flags, and vector aesthetic presets.
- Stage selection must display in a fitted 5×4 grid that prevents unnecessary window scrolling.

---

## 6. Server Deployment to "Archimedes"

The game will be hosted on an internal/production server named **Archimedes**. You must provide complete deployment automation:

### 6.1. Dockerization
Create a production-grade multi-stage `Dockerfile`:
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6.2. Nginx Configuration (`docker/nginx.conf`)
Include:
- Static asset caching (`Cache-Control: public, max-age=31536000` for hashed Vite assets).
- Gzip / Brotli compression for JS, CSS, and SVG.
- Fallback routing for SPA history mode (`try_files $uri $uri/ /index.html;`).
- Proper security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

### 6.3. Direct Host Deployment Script (`deploy-archimedes.sh`)
Provide a shell script that can be executed either directly on Archimedes or via SSH:
```bash
#!/usr/bin/env bash
set -euo pipefail

ARCHIMEDES_DIR="/var/www/fife_smash"
BRANCH="main"

echo "=== Deploying fife_smash to Archimedes ==="
cd "$ARCHIMEDES_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

npm ci
npm run build

# If using systemd/nginx directly:
sudo systemctl reload nginx
echo "=== Deployment to Archimedes Complete ==="
```

---

## 7. Step-by-Step Implementation Roadmap for the Agent

Execute this project sequentially across six phases:

### Phase 1: Environment Setup & Project Scaffolding
1. Initialize `package.json` with TypeScript, Vite, Tailwind CSS, and dev tools.
2. Configure `tsconfig.json` with strict type checking and path aliases (`@core/*`, `@entities/*`, etc.).
3. Set up the directory tree outlined in Section 4.

### Phase 2: Configuration & Type Definitions
1. Define all TypeScript interfaces in `src/types/` (`FighterConfig`, `StageConfig`, `ControllerInput`, `HitboxData`, `GameState`).
2. Migrate and export `FIGHTERS` data in `src/config/fighters.data.ts` and `STAGES` data in `src/config/stages.data.ts`.
3. Centralize physics tuning parameters in `src/config/constants.ts`.

### Phase 3: Core Engine & Deterministic Game Loop
1. Implement `GameLoop.ts` with a fixed delta accumulator loop.
2. Implement `Collisions.ts` and `Knockback.ts` math libraries with unit test verification.
3. Build `Fighter.ts` and `Stage.ts` entity models handling stocks, damage accumulation, invulnerability frames, and temporary platforms.

### Phase 4: Input & Joy-Con Subsystem
1. Implement `GamepadDriver.ts` and `KeyboardDriver.ts`.
2. Implement `JoyConProfile.ts` with auto-detection, horizontal stick transformation, and user-toggleable axis inversion.
3. Build `InputManager.ts` to assign hardware devices to Player Slots 1–8 with isolation guarantees.

### Phase 5: Rendering & Audio Engine
1. Build `Renderer.ts`, `FighterRenderer.ts`, and `StageRenderer.ts` using smooth camera tracking.
2. Migrate procedural audio generation into `SoundSynthesizer.ts` with zero external audio asset dependencies.
3. Implement UI state machines: Title Screen, Character Select, Stage Select, Brawl HUD, and Victory Podium.

### Phase 6: Documentation & Archimedes Deployment
1. Write comprehensive documentation in `docs/ARCHITECTURE.md`, `docs/CONTROLLERS.md`, and `docs/DEPLOYMENT.md`.
2. Generate `docker/Dockerfile`, `docker/nginx.conf`, and `deploy-archimedes.sh`.
3. Provide a clear `README.md` with developer onboarding, testing instructions, and controller calibration notes.

---

## 8. Verification & Acceptance Criteria

Before completing your tasks, confirm that:
- [ ] `npm run build` runs cleanly with zero TypeScript errors or warnings.
- [ ] Gamepad 0 and Gamepad 1 operate independently without cross-input bleeding.
- [ ] The Right Joy-Con works seamlessly as Player 1 or Player 2 with correct stick axes.
- [ ] Knockback scales visibly and mathematically with player damage percentage.
- [ ] Respawn platforms linger until a jump/fall occurs, maintaining 5 seconds of invincibility.
- [ ] Results Podium triggers upon match conclusion and cleanly routes back to Character Select.
- [ ] Docker container builds and runs locally (`docker build -t fife_smash -f docker/Dockerfile .`).
- [ ] Deployment scripts and documentation for server **Archimedes** are verified and complete.