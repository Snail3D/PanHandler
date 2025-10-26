# Bubble Level - Use Horizontal Mode Formula

## Problem
Vertical mode bubble was "locked" and unresponsive, while horizontal mode worked perfectly.

## Solution
Copy the exact formula and spring parameters from horizontal mode to vertical mode.

## Changes Made

### 1. Removed Deadzone (Lines 560-575)
**Before**: 0.5-2° deadzone with adjustments
**After**: No deadzone (like horizontal mode)

### 2. Simplified Formula (Lines 560-565)
**Before**: Complex power curve with sign extraction
```javascript
const signX = adjustedLeftRight >= 0 ? 1 : -1;
const bubbleXOffset = -signX * Math.pow(Math.abs(adjustedLeftRight) / 3, 0.7) * maxBubbleOffset;
```

**After**: Same simple linear formula as horizontal mode
```javascript
const bubbleXOffset = -(gamma / 15) * maxBubbleOffset;
const bubbleYOffset = (forwardBackwardTilt / 15) * maxBubbleOffset;
```

### 3. Faster Spring Parameters (Lines 586-595)
**Before**: Slow, smooth spring
```javascript
damping: 40, stiffness: 100, mass: 1.5
```

**After**: Fast, responsive spring (matches horizontal)
```javascript
damping: 20, stiffness: 180, mass: 0.8
```

## Vertical Mode Now Uses

Exact same approach as working horizontal mode:
- ✅ No deadzone
- ✅ Simple linear formula: `-(sensor / 15) * maxOffset`
- ✅ Fast spring animation
- ✅ Circular boundary clamping

## Expected Result

Vertical mode should now feel EXACTLY like horizontal mode:
- Immediate response to any tilt
- Smooth, fluid movement
- No "sticking" or "locking"
- Natural physics feel

## Files Modified
- `/home/user/workspace/src/screens/MeasurementScreen.tsx`
  - Lines 559-565: Simplified formula
  - Lines 586-595: Updated spring parameters
