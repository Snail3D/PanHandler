# Blueprint Recalibration Measurement Display Fix - v2.5.5

## Issue
When recalibrating in blueprint mode, existing measurements would briefly display in **pixel format** (e.g., "500 px") instead of maintaining their calibrated units (e.g., "5.50 in" or "13.97 cm"). This happened because the old calibration was being cleared immediately when recalibration started, causing measurements to fall back to raw pixel values.

## Root Cause

### The Problem Flow
1. User hits "Recalibrate" button in blueprint mode
2. Code immediately called `setCalibration(null)` → Calibration cleared
3. Measurements still visible on screen
4. `recalculateMeasurement()` uses `calibration?.pixelsPerUnit || 1`
5. Since calibration is `null`, it defaults to `|| 1` → Raw pixels!
6. Result: Measurements show "500 px" instead of "5.50 in"

### Why This Happened
```typescript
// Before (Line 3355)
setCalibration(null); // ❌ Clears immediately!
setBlueprintPoints([]);
// ... user places new pins
// ... measurements using calibration?.pixelsPerUnit || 1 → defaults to 1!
```

The `recalculateMeasurement` function:
```typescript
const radiusInUnits = radius / (calibration?.pixelsPerUnit || 1);
//                                    ↑ null, so defaults to 1
// Result: radiusInUnits = radius / 1 = raw pixels!
```

## Solution

**Keep the old calibration active until the new one is set.**

### The Fix
```typescript
// After (Line 3354-3365)
// DON'T clear calibration yet - keep it so measurements display correctly
// It will be replaced when new calibration is set
// setCalibration(null); // ❌ REMOVED
setBlueprintPoints([]); // Still clear the points
// ... rest of recalibration flow
```

### New Flow
1. User hits "Recalibrate"
2. Old calibration stays active ✓
3. Measurements continue displaying with correct units ✓
4. User places two new pins
5. User enters distance
6. **New calibration overwrites old one** (line 7377)
7. Measurements recalculated with new scale

### Where New Calibration is Set
```typescript
// BlueprintDistanceModal onComplete (Line 7377)
const newCalibration = {
  pixelsPerUnit,
  unit,
  referenceDistance: distance,
  calibrationType: 'blueprint' as const,
  blueprintScale: { distance, unit },
};

useStore.getState().setCalibration(newCalibration); // Overwrites old
```

## Benefits

✅ **Measurements stay readable** - Always show proper units (inches, cm, etc.)  
✅ **No pixel confusion** - Users never see raw pixel values  
✅ **Smooth transition** - Old calibration → new calibration seamlessly  
✅ **Badge stays visible** - Calibration badge shows throughout recalibration  

## User Experience

### Before Fix
```
1. User has measurements: "5.50 in", "10.25 cm"
2. Taps "Recalibrate"
3. Measurements suddenly change: "139 px", "260 px" ❌ CONFUSING!
4. User places new pins
5. Enters distance
6. Measurements update: "5.75 in", "10.50 cm"
```

### After Fix
```
1. User has measurements: "5.50 in", "10.25 cm"
2. Taps "Recalibrate"  
3. Measurements stay: "5.50 in", "10.25 cm" ✓ CLEAR!
4. User places new pins
5. Enters distance
6. Measurements update: "5.75 in", "10.50 cm" ✓ NEW SCALE!
```

## Technical Details

### Calibration Badge Behavior
The calibration badge is shown when:
```typescript
{(coinCircle || calibration || mapScale) && ...}
```

Since we're keeping `calibration` active, the badge continues to show during recalibration, which is correct UX.

### Measurement Rendering
Measurements use this pattern everywhere:
```typescript
const value = distance / (calibration?.pixelsPerUnit || 1);
```

By keeping calibration active:
- ✅ `calibration?.pixelsPerUnit` returns the old scale factor
- ✅ Measurements display in proper units
- ✅ After new calibration: overwrites seamlessly

### No Side Effects
The old calibration is simply **replaced** when the new one is set:
```typescript
useStore.getState().setCalibration(newCalibration);
// This overwrites the old calibration object completely
```

No cleanup needed, no memory leaks, just a clean replacement.

## Files Modified
- ✏️ `src/components/DimensionOverlay.tsx` (Line ~3355)
  - Removed `setCalibration(null)` call during blueprint recalibration
  - Added comment explaining why calibration is kept active
- 📝 `app.json` - Version bumped to **2.5.5**
- 📝 `ReadMeKen.md` - Updated to v2.5.5 with recent fixes

## Testing

To verify the fix:
1. Calibrate with blueprint (place 2 pins, enter distance)
2. Create 3-5 measurements (any type: distance, circle, rectangle, freehand)
3. Tap "Recalibrate" button
4. **VERIFY**: Measurements still show proper units (NOT pixels)
5. Place 2 new pins
6. Enter different distance
7. **VERIFY**: Measurements recalculate with new values

### What to Look For
❌ **Before fix**: Measurements would briefly show "235 px", "480 px" during recalibration  
✅ **After fix**: Measurements always show "5.50 in", "12.2 cm" (proper units)

## Related Systems

This fix works in conjunction with:
- **Blueprint recalibration pan/zoom lock** (v2.5.3) - Prevents visual movement
- **Measurement recalculation** - Updates all measurements with new scale
- **Unit conversion** (v2.5.2) - Intelligent metric/imperial display

## Status
✅ **Complete and tested**

---

**Version:** v2.5.5  
**Date:** October 20, 2025  
**Fix Type:** Blueprint recalibration display bug
