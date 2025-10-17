# Bubble Level Constrained to Crosshairs

## Problem
In vertical shooting mode, the bubble level was jumping around too much along the Y-axis (and X-axis), moving outside the crosshair boundaries. This made it harder to see and use.

## Solution
Added circular boundary clamping to vertical mode to keep the bubble constrained within the crosshairs, just like horizontal mode already had.

### Technical Details

**Crosshair Dimensions:**
- Size: 120px × 120px
- Center position: 60px from edges
- Maximum bubble offset: 48px (radius constraint)

**Before (Vertical Mode - No Clamping):**
```javascript
// VERTICAL MODE: Track both forward/backward tilt AND left/right tilt
const bubbleXOffset = (adjustedBetaDeviation / 20) * maxBubbleOffset; // Forward/back
const bubbleYOffset = -(adjustedGamma / 20) * maxBubbleOffset; // Left/right rotation (inverted)

// Applied directly without clamping - could exceed boundaries! ❌
bubbleX.value = withSpring(bubbleXOffset, { 
  damping: 40,
  stiffness: 100,
  mass: 1.5
});
bubbleY.value = withSpring(bubbleYOffset, { 
  damping: 40,
  stiffness: 100,
  mass: 1.5
});
```

**After (Vertical Mode - With Circular Clamping):**
```javascript
// VERTICAL MODE: Track both forward/backward tilt AND left/right tilt
const bubbleXOffset = (adjustedBetaDeviation / 20) * maxBubbleOffset; // Forward/back
const bubbleYOffset = -(adjustedGamma / 20) * maxBubbleOffset; // Left/right rotation (inverted)

// Clamp to circular boundary (stay within crosshairs) ✅
const distance = Math.sqrt(bubbleXOffset * bubbleXOffset + bubbleYOffset * bubbleYOffset);
let finalX = bubbleXOffset;
let finalY = bubbleYOffset;

if (distance > maxBubbleOffset) {
  const scale = maxBubbleOffset / distance;
  finalX = bubbleXOffset * scale;
  finalY = bubbleYOffset * scale;
}

// Apply clamped values
bubbleX.value = withSpring(finalX, { 
  damping: 40,
  stiffness: 100,
  mass: 1.5
});
bubbleY.value = withSpring(finalY, { 
  damping: 40,
  stiffness: 100,
  mass: 1.5
});
```

## How Circular Clamping Works

1. **Calculate desired offset** for both X and Y axes based on device tilt
2. **Calculate distance** from center: `√(x² + y²)`
3. **Check if outside boundary**: `distance > maxBubbleOffset` (48px)
4. **Scale down proportionally**: If outside, multiply both X and Y by `maxBubbleOffset / distance`
5. **Apply clamped values** to bubble position

This ensures the bubble always stays within a 48-pixel radius circle centered in the crosshairs, no matter how much the device is tilted.

## Visual Result

**Before:**
```
┌──────────────────┐
│                  │
│        ┼         │  ← Crosshairs (120px)
│                  │
│                🔵│  ← Bubble could jump outside!
└──────────────────┘
```

**After:**
```
┌──────────────────┐
│                  │
│        ┼      🔵 │  ← Bubble always stays within crosshairs
│                  │
│                  │
└──────────────────┘
```

## Benefits

✅ **Stable visual feedback** - Bubble never leaves the crosshair area
✅ **Easier to read** - User can focus on the crosshair zone
✅ **Consistent behavior** - Matches horizontal mode behavior
✅ **Better UX** - Less visual noise and distraction
✅ **Still responsive** - Shows tilt direction even when clamped

## Files Modified

- `/home/user/workspace/src/screens/MeasurementScreen.tsx` - Lines 566-591 (added circular clamping to vertical mode)

## Related Features

- Bubble level tracks 2 axes in vertical mode (forward/back + left/right rotation)
- 2° deadzone for both axes to make centering easier
- `/20` sensitivity divider for smooth, gentle movement
- Same clamping logic already existed in horizontal mode (lines 593-610)
