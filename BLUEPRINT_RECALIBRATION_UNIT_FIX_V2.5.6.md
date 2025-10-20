# Blueprint Recalibration Unit Update Fix - v2.5.6

## Issue
When recalibrating in blueprint mode and changing the **unit** (e.g., from "10 cm" to "10 km"), measurements would recalculate with the new scale factor but continue displaying in the **old unit**. For example, a measurement that was "5.00 cm" would recalculate to use the new kilometer scale but still display as "X cm" instead of "X km".

## Root Cause

### The Problem
When measurements were recalculated after setting the new calibration, the `recalculateMeasurement` function was using the component's `calibration` state from the Zustand hook:

```typescript
const calibration = useStore((s) => s.calibration);
```

However, React batches state updates, so the component hadn't re-rendered yet when recalculation ran:

```typescript
// 1. Set new calibration in store
useStore.getState().setCalibration(newCalibration);

// 2. Immediately recalculate (component hasn't re-rendered!)
const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m));
//                                                      ↑ Still uses OLD calibration!
```

Inside `recalculateMeasurement`:
```typescript
const radiusInUnits = radius / (calibration?.pixelsPerUnit || 1); // OLD scale
const value = formatMeasurement(diameter, calibration?.unit || 'mm', unitSystem, 2); // OLD unit!
```

### Example Issue Flow
```
1. Old calibration: { unit: 'cm', pixelsPerUnit: 10 }
2. User recalibrates: "10 km" → New calibration: { unit: 'km', pixelsPerUnit: 100 }
3. Store updated with new calibration
4. recalculateMeasurement runs BUT uses component state → still sees { unit: 'cm', ...}
5. Result: Measurements use NEW scale but OLD unit → "0.05 cm" instead of "0.50 km"
```

## Solution

**Pass the new calibration directly as a parameter to `recalculateMeasurement`** instead of relying on component state that hasn't re-rendered yet.

### Changes Made

#### 1. Updated `recalculateMeasurement` Function Signature
```typescript
// Before
const recalculateMeasurement = (measurement: Measurement): Measurement => {
  const { mode, points } = measurement;
  // Uses closure's `calibration` variable
}

// After
const recalculateMeasurement = (measurement: Measurement, overrideCalibration?: typeof calibration): Measurement => {
  const { mode, points } = measurement;
  
  // Use override calibration if provided, otherwise use component state
  const activeCalibration = overrideCalibration !== undefined ? overrideCalibration : calibration;
  // Now uses `activeCalibration` everywhere instead of `calibration`
}
```

#### 2. Updated All References Inside Function
Replaced all instances of `calibration` with `activeCalibration`:
- `calibration?.pixelsPerUnit` → `activeCalibration?.pixelsPerUnit`
- `calibration?.unit` → `activeCalibration?.unit`

Applied to:
- Circle diameter calculations
- Rectangle width/height formatting
- Freehand perimeter formatting
- Polygon perimeter/area formatting

#### 3. Updated Call Site to Pass New Calibration
```typescript
// Before
const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m));

// After
const recalibratedMeasurements = measurements.map(m => recalculateMeasurement(m, newCalibration));
//                                                                                 ↑ Pass new calibration directly!
```

## User Experience

### Before Fix
```
1. User has measurement: "5.00 cm" (calibrated with 10 cm scale)
2. Taps "Recalibrate"
3. Places pins and enters "10 km" as the new scale
4. Measurement recalculates but shows: "0.05 cm" ❌ WRONG UNIT!
   (New scale applied, but old unit persists)
```

### After Fix
```
1. User has measurement: "5.00 cm" (calibrated with 10 cm scale)
2. Taps "Recalibrate"
3. Places pins and enters "10 km" as the new scale
4. Measurement correctly shows: "0.50 km" ✓ CORRECT!
   (Both new scale AND new unit applied)
```

## Technical Details

### Why Override Parameter?
Instead of modifying the store access pattern, we use a parameter override because:
1. **Explicit** - Clear that we're using a specific calibration
2. **Immediate** - No waiting for state updates
3. **Backwards compatible** - Other calls still work (use component state)
4. **Type-safe** - TypeScript ensures calibration shape matches

### Backward Compatibility
The function signature is backward compatible:
```typescript
// Existing calls still work (use component state)
recalculateMeasurement(measurement);

// New call with override (use provided calibration)
recalculateMeasurement(measurement, newCalibration);
```

### Debug Logging
Added console log to verify unit change:
```typescript
console.log('📐 New calibration unit:', newCalibration.unit, 'Old unit was:', calibration?.unit);
```

This helps debug future unit issues.

## Files Modified
- ✏️ `src/components/DimensionOverlay.tsx`
  - Line 1579: Updated `recalculateMeasurement` signature with optional override parameter
  - Line 1583: Added `activeCalibration` selection logic
  - Lines 1606-1697: Replaced all `calibration` references with `activeCalibration`
  - Line 7394: Updated call site to pass `newCalibration`
- 📝 `app.json` - Version bumped to **2.5.6**

## Testing

### Test Scenario: Unit Change
1. Calibrate with blueprint: "10 cm"
2. Create 3 distance measurements
3. Verify measurements show in cm (e.g., "5.00 cm", "10.50 cm")
4. Tap "Recalibrate"
5. Place same pins but enter "10 km" instead
6. **VERIFY**: Measurements update to km (e.g., "0.50 km", "1.05 km")

### Test Scenario: Same Unit, Different Scale
1. Calibrate with blueprint: "10 cm"
2. Create measurements
3. Recalibrate with "20 cm"
4. **VERIFY**: Measurements double in value but stay in cm

### Test Scenario: Metric to Imperial
1. Calibrate: "10 cm"
2. Create measurements in metric system
3. Switch to imperial system
4. Recalibrate: "4 in"
5. **VERIFY**: Measurements show in inches/feet

## Related Systems

This fix complements:
- **v2.5.5** - Keeping old calibration during recalibration (no pixel display)
- **v2.5.3** - Pan/zoom lock during recalibration
- **v2.5.2** - Intelligent metric unit selection

## Benefits

✅ **Unit changes work** - Can recalibrate from cm to km, mm to m, etc.  
✅ **Immediate updates** - No waiting for component re-render  
✅ **Type-safe** - TypeScript catches calibration shape mismatches  
✅ **Debuggable** - Console logs show unit transitions  
✅ **Backward compatible** - Existing code continues to work  

## Status
✅ **Complete and ready to test**

---

**Version:** v2.5.6  
**Date:** October 20, 2025  
**Fix Type:** Blueprint recalibration unit update bug
