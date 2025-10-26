# Bubble Level Y-Axis Fix - Coordinate System Rotation

## The Real Problem

When you tilt the phone (rotate it around the long axis), the bubble wasn't moving below the middle. The issue was that the crosshair container rotates 90° in vertical mode, but the bubble's translateX/translateY coordinates weren't adjusted for this rotation.

## The Solution

**Swap X and Y coordinates when in vertical mode** because the container is rotated 90°.

### Before (Broken)
```javascript
const bubbleStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: bubbleX.value + 60 - 7 }, // Always X to X
    { translateY: bubbleY.value + 60 - 7 }, // Always Y to Y
  ],
}));
```

This didn't account for the 90° container rotation, so the bubble's visual movement didn't match the physical tilt.

### After (Fixed)
```javascript
const bubbleStyle = useAnimatedStyle(() => ({
  transform: isVerticalMode.value 
    ? [
        // In vertical mode, swap X and Y because container is rotated 90°
        { translateX: bubbleY.value + 60 - 7 },
        { translateY: -bubbleX.value + 60 - 7 }, // Negate X for correct direction
      ]
    : [
        // In horizontal mode, use normal X and Y
        { translateX: bubbleX.value + 60 - 7 },
        { translateY: bubbleY.value + 60 - 7 },
      ],
}));
```

## Why This Works

**The Coordinate System:**
1. The crosshair container rotates 90° clockwise in vertical mode
2. The bubble is INSIDE the rotated container
3. But translateX/translateY are applied in the container's local coordinate system
4. After 90° rotation:
   - Physical X → Visual Y
   - Physical Y → Visual X

**The Mapping:**
- In vertical mode, `bubbleY` (left/right tilt) → `translateX` (horizontal movement in rotated container)
- In vertical mode, `bubbleX` (forward/back tilt) → `translateY` (vertical movement in rotated container)
- We negate `bubbleX` to get the correct direction

## Expected Behavior Now

**When holding phone vertically (portrait):**
- 🔄 **Rotate phone left** (left edge up) → Bubble moves **DOWN** ✅
- 🔄 **Rotate phone right** (right edge up) → Bubble moves **UP** ✅
- ⬅️ **Tilt backward** (top away from you) → Bubble moves **LEFT** ✅
- ➡️ **Tilt forward** (top toward you) → Bubble moves **RIGHT** ✅

## Additional Changes

1. **Increased Y-axis sensitivity**: Changed from `/20` to `/10` (2x more responsive)
2. **Reduced gamma deadzone**: Changed from 2° to 1° (more sensitive to small tilts)
3. **Removed debug logging**: No console access on device

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx`:
  - Lines 561-563: Reduced gamma deadzone to 1°
  - Lines 571-573: Increased Y sensitivity to `/10`
  - Lines 818-829: Swapped X/Y coordinates in vertical mode

The bubble should now move freely in ALL directions within the crosshair boundaries!
