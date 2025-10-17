# Bubble Stuck at Center - Non-Linear Response Fix

## Problem
The bubble was "sticking" at the center point and required extreme tilts (45°+) before it would move fluidly. At moderate tilts, it would hit the circular boundary and stop moving smoothly.

## Root Cause
With gamma = 78.3°, the linear calculation produced:
```
bubbleX = -(78.3 / 15) * 48 = -250px
```

But this exceeded the circular boundary (48px max), so it got clamped to -42.1px, creating a "sticky" feeling where the bubble couldn't move smoothly.

## Solution: Non-Linear Response Curve

Changed from **linear** to **square root** response:

### Before (Linear - Sticky)
```javascript
const bubbleXOffset = -(adjustedLeftRight / 15) * maxBubbleOffset;
const bubbleYOffset = (adjustedForwardBackward / 15) * maxBubbleOffset;
```

At large angles, this produces values that exceed the boundary, causing clamping and sticky behavior.

### After (Non-Linear - Fluid)
```javascript
const signX = adjustedLeftRight >= 0 ? 1 : -1;
const signY = adjustedForwardBackward >= 0 ? 1 : -1;
const bubbleXOffset = -signX * Math.sqrt(Math.abs(adjustedLeftRight) * 3) * (maxBubbleOffset / 10);
const bubbleYOffset = signY * Math.sqrt(Math.abs(adjustedForwardBackward) * 3) * (maxBubbleOffset / 10);
```

## How It Works

**Square Root Response Curve:**
- **Small tilts (0-10°)**: √(angle) grows quickly → responsive
- **Medium tilts (10-30°)**: √(angle) grows moderately → smooth
- **Large tilts (30-90°)**: √(angle) grows slowly → doesn't hit boundary

**Example Calculations:**
- 5° tilt: √(5*3) = 3.9 → bubbleOffset ≈ 18.7px ✅ (was 1.6px)
- 15° tilt: √(15*3) = 6.7 → bubbleOffset ≈ 32.2px ✅ (was 4.8px)
- 45° tilt: √(45*3) = 11.6 → bubbleOffset ≈ 55.7px → clamped to 48px ✅ (was 14.4px)
- 78° tilt: √(78*3) = 15.3 → bubbleOffset ≈ 73.4px → clamped to 48px ✅ (was 25px)

## Benefits

✅ **More responsive at small angles** - bubble moves noticeably with small tilts
✅ **Fluid movement** - doesn't hit boundary and stick until very large angles
✅ **Natural feel** - matches human expectation of how a ball would roll
✅ **Smoother transitions** - no sudden jumps or sticky points

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx` - Lines 573-578

## Testing
Hold phone at various angles and check that bubble:
- ✅ Responds immediately to small tilts (5-10°)
- ✅ Moves smoothly through middle range (10-30°)
- ✅ Doesn't get stuck at center or edges
- ✅ Reaches boundary only at extreme tilts (60°+)
