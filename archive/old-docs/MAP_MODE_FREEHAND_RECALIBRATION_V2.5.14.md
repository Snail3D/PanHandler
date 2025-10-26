# Map Mode Freehand Recalibration Fix (v2.5.14)

## Issue Reported
"In the normal map mode, when I recalibrated the verbal scale, the free draw line didn't recalculate"

## Root Cause
In v2.5.11, we added recalibration logic for verbal scale (map mode). However, the `recalculateMeasurement` function was still using component-level `isMapMode` and `mapScale` variables instead of the override calibration data.

### The Problem
```typescript
const recalculateMeasurement = (measurement, overrideCalibration) => {
  // Uses the NEW calibration for coin/blueprint modes
  const activeCalibration = overrideCalibration ?? calibration;
  
  // But for map mode checks, uses OLD component state! ❌
  if (isMapMode && mapScale) {  // Component state, not override!
    lengthStr = formatMapScaleDistance(totalLength);
  }
}
```

When recalibrating with a new verbal scale:
1. `newCalibration` passed with updated `verbalScale` data
2. Function uses `activeCalibration` for pixelsPerUnit calculations ✅
3. But checks component's `isMapMode` and `mapScale` for map mode logic ❌
4. Component state hasn't updated yet → uses OLD scale
5. Freehand measurements don't recalculate properly

## Solution
Modified `recalculateMeasurement` to detect if the override calibration is a verbal scale and use its data instead of component state.

### Code Changes

**File: `src/components/DimensionOverlay.tsx` (Line ~1672)**

**Before:**
```typescript
const recalculateMeasurement = (measurement, overrideCalibration) => {
  const activeCalibration = overrideCalibration ?? calibration;
  
  // ... measurement logic ...
  
  // Uses component state (wrong during recalibration!)
  if (isMapMode && mapScale) {
    lengthStr = formatMapScaleDistance(totalLength);
  }
}
```

**After:**
```typescript
const recalculateMeasurement = (measurement, overrideCalibration) => {
  const activeCalibration = overrideCalibration ?? calibration;
  
  // NEW: Determine if we're in map mode using override calibration
  const isUsingMapMode = overrideCalibration?.calibrationType === 'verbal' 
    ? true 
    : isMapMode;
  const activeMapScale = overrideCalibration?.calibrationType === 'verbal' && overrideCalibration.verbalScale
    ? overrideCalibration.verbalScale
    : mapScale;
  
  // ... measurement logic ...
  
  // Now uses override calibration data! ✅
  if (isUsingMapMode && activeMapScale) {
    lengthStr = formatMapScaleDistance(totalLength);
  }
}
```

## Changes Applied

### 1. Added Map Mode Detection Logic (Lines ~1677-1686)
```typescript
// Determine if we're in map mode (verbal scale)
// When recalibrating with new verbal scale, use the override calibration's verbal scale
const isUsingMapMode = overrideCalibration?.calibrationType === 'verbal' 
  ? true 
  : isMapMode;
const activeMapScale = overrideCalibration?.calibrationType === 'verbal' && overrideCalibration.verbalScale
  ? overrideCalibration.verbalScale
  : mapScale;
```

### 2. Updated All Map Mode Checks
Replaced all instances of:
- `isMapMode && mapScale` → `isUsingMapMode && activeMapScale`
- `mapScale.realDistance` → `activeMapScale.realDistance`
- `mapScale.screenDistance` → `activeMapScale.screenDistance`

**Affected measurement types:**
- ✅ Circle (line ~1705)
- ✅ Rectangle (line ~1724)
- ✅ Freehand (line ~1764) **← This was the reported issue**
- ✅ Polygon (line ~1822)

## Testing

### Test Case 1: Freehand Line Recalibration
1. ✅ Import map photo
2. ✅ Set verbal scale: "1cm = 10km"
3. ✅ Draw freehand line → Shows "15.5 km"
4. ✅ Recalibrate: "1cm = 5km"
5. ✅ **Verify**: Freehand line updates to "7.75 km"

### Test Case 2: All Map Mode Measurements
1. ✅ Set verbal scale: "1in = 100ft"
2. ✅ Create measurements:
   - Distance line → "250 ft"
   - Circle → "⌀ 120 ft"
   - Rectangle → "80 ft × 60 ft"
   - Freehand → "350 ft"
   - Polygon → "400 ft (A: 5,000 ft²)"
3. ✅ Recalibrate: "1in = 50ft"
4. ✅ **Verify**: ALL measurements update correctly:
   - Distance → "125 ft"
   - Circle → "⌀ 60 ft"
   - Rectangle → "40 ft × 30 ft"
   - Freehand → "175 ft"
   - Polygon → "200 ft (A: 1,250 ft²)"

### Test Case 3: Mixed Mode (Shouldn't Break)
1. ✅ Coin calibration with measurements
2. ✅ Recalibrate with blueprint
3. ✅ **Verify**: Uses `activeCalibration` (not map scale)
4. ✅ All measurements update correctly

## Technical Notes

### Why This Pattern Works
```typescript
// Pattern: Use override if available, fallback to component state
const isUsingMapMode = overrideCalibration?.calibrationType === 'verbal' 
  ? true          // Override says it's verbal → definitely map mode
  : isMapMode;    // No override → use component state

const activeMapScale = overrideCalibration?.verbalScale
  ? overrideCalibration.verbalScale  // Use override scale
  : mapScale;                          // Fallback to component scale
```

This ensures:
1. **During recalibration**: Uses new calibration's data ✅
2. **During normal use**: Uses component state ✅
3. **For non-map modes**: Falls back correctly ✅

### Why All Measurement Types Needed Fixing
The bug affected ALL map mode measurements, not just freehand:
- **Circle**: Diameter calculation using map scale
- **Rectangle**: Width × Height using map scale
- **Freehand**: Path length using map scale **← User reported this one**
- **Polygon**: Perimeter and area using map scale

All needed to reference `activeMapScale` instead of `mapScale`.

## Related Fixes

This completes the recalibration feature added in:
- v2.5.9: Blueprint recalibration display fix
- v2.5.10: Freehand recalibration support (all tools)
- v2.5.11: Verbal scale recalibration consistency (incomplete)
- v2.5.14: **Verbal scale now properly recalculates map mode measurements** ✅

## Files Modified
1. `src/components/DimensionOverlay.tsx` (Lines ~1672-1830)
   - Added `isUsingMapMode` and `activeMapScale` detection
   - Updated all map mode checks to use active values
2. `app.json` - Version 2.5.14

## Version History
- v2.5.9: Blueprint recalibration display fix
- v2.5.10: Freehand recalibration support
- v2.5.11: Verbal scale recalibration (partial - didn't work for map mode)
- v2.5.12: Map mode unit toggle support
- v2.5.13: Photo import calibration clear fix
- v2.5.14: **Map mode recalibration fully working** ✅ **Current**

## Status
✅ **FIXED** - Verbal scale recalibration now updates all measurement types including freehand paths
