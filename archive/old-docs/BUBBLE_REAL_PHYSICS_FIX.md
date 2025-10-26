# Bubble Level Real Physics Fix

## Problem
The bubble movement didn't match real physics. It wasn't intuitive - you couldn't just tilt the phone in the opposite direction to center the bubble like you would with a real bubble level.

## Solution: Real Physics Mapping

The bubble now behaves like a **real physical ball** - it rolls in the direction of tilt.

### Vertical Mode (Portrait) - NEW Behavior

**Tilt forward** (top toward you) → Ball rolls **DOWN** ✅
**Tilt backward** (top away) → Ball rolls **UP** ✅
**Tilt left** → Ball rolls **LEFT** ✅
**Tilt right** → Ball rolls **RIGHT** ✅

This is intuitive! To center the ball, you tilt the phone in the OPPOSITE direction, just like a real bubble level.

## Code Changes

### 1. Fixed Vertical Mode Physics (Lines 540-592)

**Before (Confusing):**
```javascript
// Beta (forward/back) mapped to X-axis
// Gamma (left/right) mapped to Y-axis
const bubbleXOffset = (adjustedBetaDeviation / 20) * maxBubbleOffset;
const bubbleYOffset = (adjustedGamma / 10) * maxBubbleOffset;
```

**After (Real Physics):**
```javascript
// FORWARD/BACKWARD TILT (beta):
//   beta > 90° = tilts forward → ball rolls DOWN (positive Y)
//   beta < 90° = tilts backward → ball rolls UP (negative Y)
//
// LEFT/RIGHT TILT (gamma): 
//   gamma > 0 = tilts right → ball rolls RIGHT (positive X)
//   gamma < 0 = tilts left → ball rolls LEFT (negative X)

const forwardBackwardTilt = beta - 90; // Positive = forward, negative = backward
const adjustedForwardBackward = Math.abs(forwardBackwardTilt) < 2 ? 0 : forwardBackwardTilt;
const adjustedLeftRight = Math.abs(gamma) < 2 ? 0 : gamma;

// Map to bubble movement (real physics)
const bubbleXOffset = (adjustedLeftRight / 15) * maxBubbleOffset; // Left/right → X
const bubbleYOffset = (adjustedForwardBackward / 15) * maxBubbleOffset; // Forward/back → Y
```

### 2. Removed Coordinate Swapping (Lines 814-819)

**Before (Swapped X/Y):**
```javascript
const bubbleStyle = useAnimatedStyle(() => ({
  transform: isVerticalMode.value 
    ? [
        { translateX: bubbleY.value + 60 - 7 }, // SWAPPED!
        { translateY: -bubbleX.value + 60 - 7 },
      ]
    : [
        { translateX: bubbleX.value + 60 - 7 },
        { translateY: bubbleY.value + 60 - 7 },
      ],
}));
```

**After (Direct Mapping):**
```javascript
const bubbleStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: bubbleX.value + 60 - 7 }, // X is X
    { translateY: bubbleY.value + 60 - 7 }, // Y is Y
  ],
}));
```

### 3. Unified Sensitivity

Both axes now use `/15` sensitivity for consistent, responsive movement.

### 4. Consistent Deadzone

Both axes use 2° deadzone for stable centering.

## Why This Works

### The Key Insight
The crosshair rotates 90° visually, but we calculate bubble physics in the phone's **physical coordinate system**, not the visual one. The rotation is purely cosmetic.

### Physical Coordinate System (What Matters)
- **X-axis**: Left/right movement (gamma sensor)
- **Y-axis**: Up/down movement (beta deviation from 90°)

### Visual Rotation (Just for Show)
- The crosshair rotates 90° in vertical mode to look vertical
- But the bubble's X/Y physics stay in phone coordinates
- This creates the correct real-world behavior!

## User Experience

**Before:** Confusing, unintuitive - bubble didn't match expectations

**After:** Natural, intuitive - works like a real bubble level:
1. See bubble off-center
2. Tilt phone in opposite direction
3. Bubble rolls back to center
4. Phone is now level!

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx`
  - Lines 540-592: Rewrote vertical mode physics
  - Lines 814-819: Removed coordinate swapping

## Testing
Hold phone in portrait (vertical) mode and:
- ✅ Tilt forward → bubble rolls down
- ✅ Tilt backward → bubble rolls up
- ✅ Tilt left → bubble rolls left
- ✅ Tilt right → bubble rolls right
- ✅ Bubble stays within crosshairs
- ✅ To center bubble, tilt in opposite direction (intuitive!)
