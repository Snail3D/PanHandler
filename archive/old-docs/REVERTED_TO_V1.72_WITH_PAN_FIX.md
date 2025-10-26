# Reverted to v1.72 + Pan Fix

## What We Did
Reverted back to the v1.72 UX/behavior but kept the panning improvements.

## v1.72 Behavior (Restored)
- **Pan button**: Simple toggle - shows "Pan" or "Edit" based on measurements
- **Measure button**: Enters measurement mode
- **No lock state**: Removed all the lock/unlock complexity
- **Measurement icons**: Tap to enter that measurement type

## Panning Improvements (Kept)
- **Calibration**: 1-finger pan works (simplified gesture config)
- **Measurement**: 2-finger pan/zoom works
- **No conflicting gestures**: Removed `activeOffsetX/Y` and `failOffsetX/Y`

## Changes Made

### DimensionOverlay.tsx
1. Removed `isPanLocked` state entirely
2. Restored simple Pan/Measure button toggle
3. Removed all `setIsPanLocked()` calls from measurement buttons
4. Back to v1.72 button text: "Pan" / "Edit" (not "Locked" / "Unlocked")

### ZoomableImageV2.tsx (Kept from earlier fix)
- Simplified pan gesture configuration
- Works with `singleFingerPan=true` in calibration
- No conflicting offset configurations

## Current Behavior

### Calibration Screen
✅ 1-finger pan works
✅ 2-finger zoom works
✅ Rotation works

### Measurement Screen
✅ "Pan" button - switches to pan mode
✅ "Measure" button - switches to measure mode
✅ When measurements exist - shows "Edit" instead of "Pan"
✅ 2-finger pan/zoom works when in pan mode

## What's Different from Before Our Session
- Better panning in calibration screen (this works now!)
- Simplified gesture detection (no more conflicts)
- Same UX as v1.72 (familiar, tested behavior)

## Files Modified
1. `src/components/DimensionOverlay.tsx` - Reverted button logic, removed lock state
2. `src/components/ZoomableImageV2.tsx` - Kept simplified pan gesture

## Testing
The app should now behave exactly like v1.72, but with working calibration panning.
