# Bubble Level Y-Axis Movement Fix (Vertical Mode)

## Problem
In vertical mode, the bubble wasn't moving down into negative Y-axis values - it only moved up.

## Investigation & Changes Made

### 1. Removed Negative Sign Inversion
**Before:** `bubbleYOffset = -(adjustedGamma / 20) * maxBubbleOffset`
**After:** `bubbleYOffset = (adjustedGamma / 10) * maxBubbleOffset`

The negative sign was inverting the Y-axis incorrectly, causing:
- gamma < 0 (tilt left) → bubbleYOffset becomes positive → bubble moves UP (wrong!)
- gamma > 0 (tilt right) → bubbleYOffset becomes negative → bubble moves DOWN (wrong!)

### 2. Increased Y-Axis Sensitivity
**Before:** `/20` divider (same as X-axis)
**After:** `/10` divider (2x more sensitive)

This makes Y-axis movement more noticeable and easier to see.

### 3. Reduced Deadzone for Gamma
**Before:** 2° deadzone
**After:** 1° deadzone

Smaller deadzone allows the bubble to respond to smaller tilt changes, making negative movement more apparent.

### 4. Added Debug Logging
Added console logs to monitor gamma values and verify the sensor is providing both positive and negative values:
```javascript
console.log(`[VERTICAL] beta: ${beta.toFixed(1)}°, gamma: ${gamma.toFixed(1)}°, adjustedGamma: ${adjustedGamma.toFixed(1)}°`);
console.log(`[VERTICAL] bubbleXOffset: ${bubbleXOffset.toFixed(1)}, bubbleYOffset: ${bubbleYOffset.toFixed(1)}`);
```

## Expected Behavior Now

In vertical mode (phone held upright):
- **Tilt left** (gamma < 0) → bubble moves DOWN (negative Y)
- **Tilt right** (gamma > 0) → bubble moves UP (positive Y)
- **Tilt forward** (beta > 90°) → bubble moves RIGHT (positive X)
- **Tilt backward** (beta < 90°) → bubble moves LEFT (negative X)

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx` - Lines 560-577

## Testing Notes
The console will occasionally log gamma values (5% sample rate) so you can verify:
1. Gamma is producing both positive AND negative values
2. bubbleYOffset is calculating correctly in both directions
3. The bubble moves smoothly in all directions

If you see the bubble moving in the wrong direction, we may need to re-add the negative sign. The key is watching the console logs to understand what the sensor is reporting.
