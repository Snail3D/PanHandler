# Debug: Bubble Stuck on Right Side

## Problem
The bubble is stuck on the right side (positive X) in vertical mode and won't move.

## Debugging Changes Made

### 1. Inverted X-Axis (Line 574)
Changed from:
```javascript
const bubbleXOffset = (adjustedLeftRight / 15) * maxBubbleOffset;
```

To:
```javascript
const bubbleXOffset = -(adjustedLeftRight / 15) * maxBubbleOffset; // Inverted
```

This matches the horizontal mode behavior where gamma is also inverted.

### 2. Added On-Screen Debug Display
Added debug info display in top-left corner of camera view that shows:
- **gamma**: Left/right tilt sensor value (degrees)
- **beta**: Forward/backward tilt sensor value (degrees)
- **bubbleX**: Calculated X position (pixels from center)
- **bubbleY**: Calculated Y position (pixels from center)

**Location**: Lines 141-149 (state variables), Lines 598-605 (updates), Lines 1253-1275 (display)

## How to Use Debug Display

1. Open camera mode in portrait (vertical)
2. Look at top-left corner - you'll see sensor readings
3. Tilt phone left/right and watch gamma change
4. Tilt phone forward/backward and watch beta change
5. Check if bubbleX and bubbleY values update

## What to Check

### If Bubble is Stuck:
- **gamma stuck at positive value?** → Sensor might be miscalibrated or phone orientation wrong
- **bubbleX always positive?** → X calculation might be wrong
- **bubbleX not changing?** → Deadzone might be too large or gamma not updating

### Expected Behavior:
- **Hold phone level**: gamma ≈ 0°, beta ≈ 90°, bubbleX ≈ 0, bubbleY ≈ 0
- **Tilt left**: gamma < 0 → bubbleX should be positive (ball rolls right)
- **Tilt right**: gamma > 0 → bubbleX should be negative (ball rolls left)
- **Tilt forward**: beta > 90 → bubbleY should be positive (ball rolls down)
- **Tilt backward**: beta < 90 → bubbleY should be negative (ball rolls up)

## Next Steps

Based on what you see in the debug display:
1. If gamma is NOT near 0° when phone is level → sensor calibration issue
2. If bubbleX calculation looks wrong → need to adjust formula
3. If values don't update → sensor subscription might not be working

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx`
  - Lines 141-149: Added debug state variables
  - Line 574: Inverted X-axis calculation
  - Lines 598-605: Update debug values
  - Lines 1253-1275: Display debug overlay
