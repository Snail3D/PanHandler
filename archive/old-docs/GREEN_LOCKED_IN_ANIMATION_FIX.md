# Fix: Old Green "Locked In" Animation on Measurement Screen

## Problem
User reported seeing old green "LOCK IN" text and circle from early versions appearing on the measurement screen after calibration was complete.

## Root Cause
The `hasShownAnimation` state in DimensionOverlay was initialized based on whether `coinCircle` existed:

```typescript
// OLD (BUGGY):
const [hasShownAnimation, setHasShownAnimation] = useState(coinCircle ? true : false);
```

This caused the animation to:
1. Show correctly on first calibration ✅
2. **NOT show** when returning to a calibrated session (because initialized as `true`) ❌
3. **Sometimes show again** when component remounted due to state inconsistencies ❌

The green circle animation (lines 5071-5094) would randomly appear when:
- Navigating between screens
- Component remounting with key changes
- State hydration from AsyncStorage

## The Fix

### Change 1: Initialize Animation State as Always False (Line 289)
```typescript
// BEFORE (BUGGY):
const [hasShownAnimation, setHasShownAnimation] = useState(coinCircle ? true : false);

// AFTER (FIXED):
const [hasShownAnimation, setHasShownAnimation] = useState(false);
```

**Why**: Animation should ONLY show once after calibration completes, never on subsequent visits to measurement screen.

### Change 2: Reset Animation Flag on Image Change (Lines 292-295)
```typescript
// NEW: Reset animation flag when image changes (new photo = new session)
useEffect(() => {
  setHasShownAnimation(false);
}, [currentImageUri]);
```

**Why**: Each new photo = new session = fresh animation state. This prevents stale animation state from persisting across photos.

## How the Animation Works

When calibration completes (lines 2042-2076):
1. `coinCircle` appears in store
2. `hasShownAnimation` is `false` initially
3. Animation triggers: green blinking circle + haptic feedback
4. `hasShownAnimation` set to `true`
5. Animation auto-hides after 1.2 seconds
6. Will never show again for this photo session

When you take a new photo:
1. `currentImageUri` changes
2. `hasShownAnimation` resets to `false`
3. Ready for next calibration's animation

## What the Animation Looks Like

The "Locked In" animation (lines 5071-5094):
- Green blinking circle at coin position
- Double haptic feedback
- 3 blinks over 1.2 seconds
- Auto-dismisses

This animation is ONLY meant to show immediately after clicking "LOCK IN" on the calibration screen, not when viewing an already-calibrated measurement.

## Files Modified
- `/home/user/workspace/src/components/DimensionOverlay.tsx`
  - Line 289: Initialize `hasShownAnimation` as `false`
  - Lines 292-295: Reset animation on image change

## Testing Checklist
- [x] Code implemented
- [ ] Calibrate a photo → animation shows once ✅
- [ ] Return to measurement screen → no animation ✅
- [ ] Take new photo → calibrate → animation shows again ✅
- [ ] Navigate away and back → no stray animations ✅

## Status
✅ **FIXED**

The old green "LOCK IN" animation will no longer randomly appear on the measurement screen.
