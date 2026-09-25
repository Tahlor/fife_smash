# System Architecture & Engine Lifecycle: `fife_smash`

## 1. High-Level Architectural Overview

`fife_smash` is a production-grade 2D arena platform fighter engine designed with deterministic simulation, component decoupling, data-driven entity architectures, and strict multi-controller hardware isolation.

```text
+-----------------------------------------------------------------------------------+
|                                  Browser Runtime                                  |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                                                   |
        v                                                                   v
+-----------------------+                                         +------------------+
|  Hardware Inputs      |                                         | DOM UI Overlays  |
| - Gamepad API         |                                         | - Title Screen   |
| - Joy-Con Profiles    |                                         | - CSS / SSS      |
| - Keyboard (2P)       |                                         | - Battle HUD     |
| - Virtual Cursors     |                                         | - Victory Podium |
+-----------+-----------+                                         +--------+---------+
            |                                                              |
            v                                                              v
+-----------------------+     State Transitions      +---------------------------------+
| InputManager (Driver) | <========================> | MatchStateMachine & UIManager   |
+-----------+-----------+                            +----------------+----------------+
            |                                                         |
            | Abstract Controller Frames                              |
            v                                                         |
+---------------------------------------------------------------------v-------------+
|                                    Engine Core                                    |
|  +-----------------------------------------------------------------------------+  |
|  | GameLoop (60 Hz Fixed Timestep Accumulator, Delta = 16.666ms)               |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|            +---------------------------+---------------------------+              |
|            | 60 Hz Simulation Tick                                 | Interpolation|
|            v                                                       v Alpha        |
|  +-------------------+   +--------------------+          +---------------------+  |
|  | Physics Subsystem |   | Entities Subsystem |          | Render Subsystem    |  |
|  | - Knockback math  |   | - Fighter states   |          | - Renderer          |  |
|  | - Hitbox overlap  |   | - Projectiles      |          | - FighterRenderer   |  |
|  | - AABB/Raycasts   |   | - Stage platforms  |          | - StageRenderer     |  |
|  | - Blast zones     |   | - AI Controller    |          | - Dynamic Camera    |  |
|  +---------+---------+   +----------+---------+          +----------+----------+  |
|            |                        |                               |             |
|            +-----------+------------+                               |             |
|                        |                                            |             |
|                        v                                            v             |
|             +---------------------+                       +-------------------+   |
|             | Audio Synthesizer   |                       | Canvas 2D Target  |   |
|             | (Web Audio API SFX) |                       | (Window Canvas)   |   |
|             +---------------------+                       +-------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Decoupled Simulation vs. Render Loop (Fixed Timestep)

A core flaw of naive browser games is tying the physics simulation directly to `requestAnimationFrame`. When run on monitors with variable refresh rates (60Hz, 120Hz, 144Hz, 240Hz), game physics either accelerate or become inconsistent.

### Fixed Timestep Accumulator

`fife_smash` uses a deterministic fixed timestep pattern (`src/core/GameLoop.ts`):
- Simulation tick rate is locked to **60 Hz** ($\Delta t = 16.666\text{ms}$).
- `requestAnimationFrame` continuously measures elapsed real time since the prior frame.
- An accumulator stores residual time. Discrete ticks execute in a `while (accumulator >= fixedDelta)` loop.
- A maximum accumulator cap ($250\text{ms}$) prevents the "spiral of death" if the browser is backgrounded or experiences sudden CPU stalls.

### Sub-Frame Render Interpolation

To eliminate visual micro-stuttering on high-refresh monitors, positions are interpolated:
$$\alpha = \frac{\text{accumulator}}{\text{fixedDelta}} \in [0.0, 1.0)$$
Fighters and Projectiles maintain both their previous tick position (`prevX`, `prevY`) and current tick position (`x`, `y`):
$$\text{renderX} = \text{prevX} + (\text{x} - \text{prevX}) \cdot \alpha$$
$$\text{renderY} = \text{prevY} + (\text{y} - \text{prevY}) \cdot \alpha$$
This guarantees frame-perfect, deterministic hitboxes and hurtboxes during physics computation while delivering silky rendering.

---

## 3. Data-Driven Entity Design

Combat rules, fighter configurations, and arena layouts are decoupled from game logic into immutable typed configurations:

1. **Roster Definition (`src/config/fighters.data.ts`):**
   - 30 distinct fighters with individualized attributes:
     - `weight`: influences inertia, gravity, and launch knockback susceptibility.
     - `speed`: ground run acceleration and max air drift.
     - `jump`: ground jump impulse and second air jump multiplier.
     - `specialType`: designated elemental signature projectile/attack.
2. **Stage Catalog (`src/config/stages.data.ts`):**
   - 20 unique battlefields with exact platform coordinates, dimensions, pass-through flags, and vector artwork.
3. **Global Engine Constants (`src/config/constants.ts`):**
   - Centralizes gravity ($0.50$), terminal velocity ($15.0$), friction coefficients, blast margins ($+500\text{px}$ horizontal, $-650\text{px}$ ceiling, $+450\text{px}$ floor), and invulnerability duration ($300$ ticks / $5.0$ seconds).

---

## 4. Physics & Combat Mechanics

### 4.1. Knockback Velocity Formula

Knockback velocity ($V_k$) is computed mathematically via:
$$V_k = \frac{\left( \left( \frac{D}{10} + \frac{D \cdot B}{20} \right) \cdot \frac{200}{W + 100} \cdot 1.4 \right) + 18}{W} \cdot K_s$$
Where:
- $D$: Victim's current damage percentage.
- $B$: Attack base damage.
- $K_s$: Attack knockback scaling factor.
- $W$: Victim fighter weight.

### 4.2. Hitstun & Directional Influence (DI)

- **Hitstun Frames:** $\text{hitstun} = \lfloor V_k \cdot 1.6 \rfloor$.
- **Directional Influence:** Victims can alter their trajectory vector by tilting their analog stick during hitstun. The engine converts stick deflection into Cartesian coordinates, deflecting the launch angle by up to $\pm 18^\circ$ ($0.18$ rad).

### 4.3. Spawn Platform & Invulnerability Lifecycle

- When a fighter spawns (at match start or after losing a stock), a solid spawn platform is generated at $(x, -120)$.
- The fighter enters a strict 5.0-second ($300$ ticks) invulnerability state.
- If the fighter moves horizontally or jumps, the spawn platform despawns immediately, but invulnerability persists until the timer elapses.
- Golden aura visual cues and flashing indicate remaining invincibility.

---

## 5. Input Management & Strict Hardware Isolation

The input subsystem enforces complete device separation:
- Raw browser inputs (`navigator.getGamepads()`, keyboard events) are never queried directly by gameplay entities.
- An intermediate driver maps hardware into a normalized `ControllerInput` schema:
  `{ neutralX, neutralY, jump, jab, smash, special, shield, pause }`.
- **Hardware Isolation Guarantee:** Each player slot maps exclusively to an assigned physical index. Gamepad index 1 input cannot leak into Player 1 (index 0).
- Joy-Con (L) and Joy-Con (R) horizontal mapping translates single-stick rotational axes with 90-degree adjustments and user-toggleable inversion.

---

## 6. Procedural Audio Engine

The procedural audio synthesizer (`src/audio/SoundSynthesizer.ts`) generates all sound effects directly via the browser's Web Audio API using sinusoidal, triangle, square, and sawtooth oscillators with exponential gain envelope decays. It requires zero external WAV, MP3, or OGG file assets.
