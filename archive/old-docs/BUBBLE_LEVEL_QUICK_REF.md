# 🎯 Bubble Level - Quick Reference

## What It Does
A playful, physics-based bubble level that helps users keep their phone steady when taking photos. The bubble moves based on device tilt, with crosshairs that glow when the phone is level.

## Key Features

### 1. **Morphing Bubble**
- 4mm glowing ball (15px diameter)
- Random vibrant color per session
- Smooth spring physics (damping: 20, stiffness: 180)
- 8-particle smoke trail that fades
- White inner glow effect

### 2. **Orientation-Aware**
**Vertical Mode** (phone upright, beta > 45°):
- X-axis locked to center
- Only Y-axis moves (up/down tilt)

**Horizontal Mode** (phone flat, beta < 45°):
- Both X and Y move
- Circular boundary (40px max offset)

### 3. **Morphing Crosshairs**
- Default: Red/Yellow/Green based on tilt alignment
- When bubble crosses center (within 15px):
  - Change to bubble's color
  - Glow with shadow effect
  - Shadow radius grows (0-12px)

### 4. **Center Dot**
- Default: White with 0.7 opacity
- When bubble centered:
  - Changes to bubble's color
  - Scales up (1.0 → 1.5x)
  - Glows with shadow (0-8px)

## Available Colors
Each session picks one randomly:
- 🔵 Blue (#3B82F6)
- 🟣 Purple (#8B5CF6)
- 🩷 Pink (#EC4899)
- 🩵 Cyan (#06B6D4)
- 🟢 Green (#10B981)
- 🟠 Amber (#F59E0B)
- 🔴 Red (#EF4444)

## Code Location
**File**: `/home/user/workspace/src/screens/MeasurementScreen.tsx`

**Key Variables**:
- `bubbleX`, `bubbleY` - Bubble position (shared values)
- `crosshairGlow` - Glow amount 0-1 (shared value)
- `bubbleColor` - Random session color (state)
- `trailPositions` - Last 8 positions for smoke trail (ref)

**Animated Styles** (lines 506-553):
- `crosshairHorizontalStyle` - Horizontal line appearance
- `crosshairVerticalStyle` - Vertical line appearance
- `bubbleStyle` - Bubble position transform
- `centerDotStyle` - Center dot appearance/scale

**Physics** (lines 286-363):
- DeviceMotion listener at 100ms intervals
- Calculates tilt from rotation.beta and rotation.gamma
- Updates bubble position with spring animations
- Tracks last 8 positions for trail
- Calculates glow based on distance from center

## How It Works

1. **DeviceMotion** reads phone tilt (beta/gamma angles)
2. Converts angles to bubble offset (±15° = max 40px)
3. **Spring animations** move bubble smoothly
4. **Trail** stores last 8 positions
5. **Glow calculation**: `glowAmount = max(0, 1 - (distance / 15))`
6. Crosshairs and center dot react to glow value

## Integration Points

### Auto-Capture System
- Uses same `alignmentStatus` for shutter button colors
- Haptic feedback "hot and cold" when holding shutter
- Auto-captures when: `alignmentStatus === 'good' && isStable`

### Guidance Text
- Appears above crosshairs when not holding shutter
- Shows directional hints: "Tilt forward", "Hold still", etc.
- Fades out when user holds shutter button

## Testing
```bash
# 1. Hold phone vertical
# → Bubble should only move up/down
# → X stays centered

# 2. Hold phone horizontal  
# → Bubble moves in all directions
# → Stays within circular boundary

# 3. Center the bubble
# → Crosshairs turn bubble's color
# → Crosshairs glow with shadow
# → Center dot scales up and glows

# 4. Move phone around
# → Smoke trail follows bubble
# → Smooth 60fps animations
```

## Performance Notes
- All animations use Reanimated 3 (runs on UI thread)
- DeviceMotion at 100ms = 10 updates/sec (efficient)
- Trail only stores 8 positions (minimal memory)
- No AsyncStorage writes during motion
- Zero JS thread blocking

## Future Ideas
💡 Optional customization in settings:
- User can pick bubble color
- Adjust sensitivity (tilt angle → offset multiplier)
- Show/hide smoke trail
- Different trail styles (sparkles, rings, etc.)
