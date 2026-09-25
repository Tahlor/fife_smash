# Nintendo Joy-Con Pairing & Web Gamepad API Integration Guide

## 1. Overview & Hardware Isolation Architecture

`fife_smash` provides native, out-of-the-box support for modern gamepads, with specialized engineering for individual **Nintendo Switch Joy-Cons (Left and Right)** held in horizontal (single Joy-Con) orientation.

### Strict Multi-Gamepad Isolation Guarantee
In local multiplayer sessions, cross-controller bleeding (where pressing a button on Controller B triggers an action for Player A) is prevented by strict hardware indexing:
- Physical controllers reported by the browser `navigator.getGamepads()` array are bound to player slots $P_1$ through $P_8$ via explicit hardware ID / slot mapping.
- Each player entity queries only its designated hardware driver channel.
- Disconnected gamepads emit neutral zero-frames, never defaulting to adjacent slots.

---

## 2. Joy-Con Horizontal Coordinate Mapping

When a single Joy-Con is held sideways as an independent controller, the physical thumbstick and buttons are rotated 90 degrees relative to standard gamepad coordinate spaces.

### 2.1. Right Joy-Con (R) Horizontal Translation

When held horizontally (SL and SR buttons on top):
- The default vertical axis becomes the horizontal movement axis.
- The default horizontal axis becomes the vertical movement axis.

The translation formula implemented in `src/input/JoyConProfile.ts`:
$$\text{stickX} = -\text{rawAxisY}$$
$$\text{stickY} = \text{rawAxisX}$$

### 2.2. Left Joy-Con (L) Horizontal Translation

For Joy-Con (L) held horizontally:
$$\text{stickX} = \text{rawAxisY}$$
$$\text{stickY} = -\text{rawAxisX}$$

### 2.3. User-Toggleable Axis Polarity (`flipJoyConAxes`)

Different operating systems (Windows 10/11, macOS, Ubuntu/Debian Linux) and Bluetooth drivers (e.g., standard Microsoft Bluetooth stack, Steam Input, BetterJoy, or hid-nintendo on Linux) may report Joy-Con axes with inverted polarities.

To accommodate any driver variation:
- Players can toggle **FLIP AXES** on the top navigation bar or inside the **CONTROLLER SETUP** modal.
- When enabled:
  $$\text{stickX} = -\text{stickX}, \quad \text{stickY} = -\text{stickY}$$

---

## 3. Radial Deadzones & Stick Drift Elimination

To eliminate stick drift from analog thumbsticks, the engine applies a radial deadzone threshold ($0.15$ minimum magnitude):

$$\text{magnitude} = \sqrt{\text{rawX}^2 + \text{rawY}^2}$$

If $\text{magnitude} \le \text{deadzone}$:
$$\text{neutralX} = 0, \quad \text{neutralY} = 0$$

If $\text{magnitude} > \text{deadzone}$:
$$\text{normalizedMagnitude} = \min\left(1.0, \frac{\text{magnitude} - \text{deadzone}}{1.0 - \text{deadzone}}\right)$$
$$\text{neutralX} = \left(\frac{\text{rawX}}{\text{magnitude}}\right) \cdot \text{normalizedMagnitude}$$
$$\text{neutralY} = \left(\frac{\text{rawY}}{\text{magnitude}}\right) \cdot \text{normalizedMagnitude}$$

---

## 4. Hardware Button Mapping Table

### Single Horizontal Joy-Con (R / L)
| Physical Button | Single Joy-Con Role | Game Action |
|:---|:---|:---|
| Right / Down face button | Action Button 0 / 1 | **Jump** |
| Left face button | Action Button 2 | **Jab / Light Attack** |
| Top face button | Action Button 3 | **Special Signature Move** |
| Hard horizontal tilt + Attack | Analog Threshold | **Smash Heavy Attack** |
| Top shoulder buttons (SL / SR) | Shoulder Buttons 4 / 5 | **Shield Bubble** |
| Side shoulder buttons (L/R, ZL/ZR)| Shoulder Buttons 6 / 7 | **Shield / Jump** |
| +/- button or Home/Capture | Auxiliary Button 9 / 16 | **Pause / Menu Select** |

### Standard Gamepad (Xbox, PlayStation, Generic XInput)
| Xbox Controller | PlayStation Controller | Game Action |
|:---|:---|:---|
| **A / Y** | **Cross / Triangle** | Jump |
| **X** | **Square** | Jab (Light Attack) |
| **B** | **Circle** | Special (Signature Move) |
| **Stick Tilt + X** or **Right Stick** | **Stick Tilt + Square** | Smash Attack |
| **LB / RB / LT / RT** | **L1 / R1 / L2 / R2** | Shield Bubble |
| **Start / Menu** | **Options** | Pause / Confirm |

---

## 5. Keyboard Fallback Configurations (2-Player Local)

If no gamepads are connected, two players can battle on a single keyboard:

### Player 1 (Left Side)
- **Movement:** `A` (Left), `D` (Right), `S` (Down / Drop)
- **Jump:** `W` or `Spacebar`
- **Jab Attack:** `Z` or `J`
- **Smash Attack:** `X` or `K`
- **Special Move:** `C` or `L`
- **Shield:** `Left Shift` or `S`

### Player 2 (Right Side)
- **Movement:** `Arrow Left`, `Arrow Right`, `Arrow Down`
- **Jump:** `Arrow Up`
- **Jab Attack:** `N` or `I`
- **Smash Attack:** `M` or `O`
- **Special Move:** `/` (Slash) or `P`
- **Shield:** `Right Shift` or `Arrow Down`

---

## 6. Pairing Nintendo Switch Joy-Cons via Bluetooth

1. Press and hold the small **Sync Button** on the rail of the Joy-Con until the green running lights pulse back and forth.
2. In your OS Bluetooth settings, locate **Joy-Con (R)** or **Joy-Con (L)** and click **Pair**.
3. Open `fife_smash` in any modern browser (Chrome, Edge, Opera, Firefox).
4. Press any button on the Joy-Con so the browser activates the Web Gamepad API.
5. Click **JOY-CON (R) ➔ P1** in the top bar to immediately calibrate Player 1.
